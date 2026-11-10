package com.chathead;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.graphics.PixelFormat;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewConfiguration;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class ChatHeadModule extends ReactContextBaseJavaModule implements ActivityEventListener {
  public static final String NAME = "ChatHead";
  private static final int OVERLAY_PERMISSION_REQ_CODE = 1234;

  private final Handler mainHandler = new Handler(Looper.getMainLooper());

  // Only touched on the main thread.
  @Nullable private View chatHeadView;

  @Nullable private Promise permissionPromise;

  public ChatHeadModule(ReactApplicationContext reactContext) {
    super(reactContext);
    reactContext.addActivityEventListener(this);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  @Override
  public void invalidate() {
    getReactApplicationContext().removeActivityEventListener(this);
    // Otherwise a reload leaves an orphaned chat head the new module instance cannot remove.
    mainHandler.post(this::removeChatHead);
    super.invalidate();
  }

  @ReactMethod
  public void checkOverlayPermission(final Promise promise) {
    promise.resolve(canDrawOverlays());
  }

  /** Opens the system overlay settings and resolves once the user comes back from them. */
  @ReactMethod
  public void requestPermission(final Promise promise) {
    if (canDrawOverlays()) {
      promise.resolve(true);
      return;
    }

    Activity activity = getReactApplicationContext().getCurrentActivity();
    if (activity == null) {
      promise.reject("E_NO_ACTIVITY", "Cannot request the overlay permission without a foreground activity");
      return;
    }

    Intent intent = new Intent(
      Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
      Uri.parse("package:" + getReactApplicationContext().getPackageName()));

    Promise previous = swapPermissionPromise(promise);
    if (previous != null) {
      previous.resolve(false);
    }

    try {
      activity.startActivityForResult(intent, OVERLAY_PERMISSION_REQ_CODE);
    } catch (ActivityNotFoundException e) {
      swapPermissionPromise(null);
      promise.reject("E_NO_SETTINGS", "This device has no overlay permission screen", e);
    }
  }

  @Override
  public void onActivityResult(Activity activity, int requestCode, int resultCode, @Nullable Intent data) {
    if (requestCode != OVERLAY_PERMISSION_REQ_CODE) {
      return;
    }
    Promise promise = swapPermissionPromise(null);
    if (promise != null) {
      promise.resolve(canDrawOverlays());
    }
  }

  @Override
  public void onNewIntent(Intent intent) {}

  /** Resolves true when the chat head is on screen, false when the overlay permission is missing. */
  @ReactMethod
  public void showChatHead(final Promise promise) {
    if (!canDrawOverlays()) {
      promise.resolve(false);
      return;
    }
    mainHandler.post(() -> {
      try {
        if (chatHeadView == null) {
          addChatHead();
        }
        promise.resolve(true);
      } catch (RuntimeException e) {
        promise.reject("E_SHOW_FAILED", "Could not show the chat head", e);
      }
    });
  }

  @ReactMethod
  public void hideChatHead(final Promise promise) {
    mainHandler.post(() -> {
      removeChatHead();
      promise.resolve(true);
    });
  }

  /** Resolves false when there is no visible chat head (or its layout has no badge) to update. */
  @ReactMethod
  public void updateBadgeCount(final int count, final Promise promise) {
    mainHandler.post(() -> {
      TextView badge = chatHeadView == null ? null : chatHeadView.findViewById(R.id.chat_head_badge);
      if (badge != null) {
        badge.setText(String.valueOf(count));
      }
      promise.resolve(badge != null);
    });
  }

  private boolean canDrawOverlays() {
    return Settings.canDrawOverlays(getReactApplicationContext());
  }

  @Nullable
  private synchronized Promise swapPermissionPromise(@Nullable Promise next) {
    Promise previous = permissionPromise;
    permissionPromise = next;
    return previous;
  }

  private WindowManager getWindowManager() {
    return (WindowManager) getReactApplicationContext().getSystemService(Context.WINDOW_SERVICE);
  }

  private void addChatHead() {
    final Context context = getReactApplicationContext();
    final WindowManager windowManager = getWindowManager();

    final WindowManager.LayoutParams params = new WindowManager.LayoutParams(
      WindowManager.LayoutParams.WRAP_CONTENT,
      WindowManager.LayoutParams.WRAP_CONTENT,
      Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
        ? WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
        : WindowManager.LayoutParams.TYPE_PHONE,
      WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
      PixelFormat.TRANSLUCENT);
    params.gravity = Gravity.TOP | Gravity.START;
    params.x = 0;
    params.y = 100;

    // The app may override chat_head_layout; every view in it is optional.
    View view = LayoutInflater.from(context).inflate(R.layout.chat_head_layout, null);

    ImageView profile = view.findViewById(R.id.chat_head_profile_iv);
    if (profile != null && profile.getDrawable() == null) {
      profile.setImageDrawable(context.getPackageManager().getApplicationIcon(context.getApplicationInfo()));
    }

    View closeButton = view.findViewById(R.id.close_btn);
    if (closeButton != null) {
      closeButton.setOnClickListener(v -> removeChatHead());
    }

    final int touchSlop = ViewConfiguration.get(context).getScaledTouchSlop();
    view.setOnTouchListener(new View.OnTouchListener() {
      private int initialX;
      private int initialY;
      private float initialTouchX;
      private float initialTouchY;
      private boolean dragging;

      @Override
      public boolean onTouch(View v, MotionEvent event) {
        switch (event.getActionMasked()) {
          case MotionEvent.ACTION_DOWN:
            initialX = params.x;
            initialY = params.y;
            initialTouchX = event.getRawX();
            initialTouchY = event.getRawY();
            dragging = false;
            return true;
          case MotionEvent.ACTION_MOVE:
            float dx = event.getRawX() - initialTouchX;
            float dy = event.getRawY() - initialTouchY;
            // A finger never stays perfectly still, so small movements must still count as a tap.
            if (!dragging && (Math.abs(dx) > touchSlop || Math.abs(dy) > touchSlop)) {
              dragging = true;
            }
            if (dragging && v.isAttachedToWindow()) {
              params.x = initialX + (int) dx;
              params.y = initialY + (int) dy;
              windowManager.updateViewLayout(v, params);
            }
            return true;
          case MotionEvent.ACTION_UP:
            if (!dragging) {
              openApp();
            }
            return true;
          default:
            return false;
        }
      }
    });

    windowManager.addView(view, params);
    chatHeadView = view;
  }

  private void removeChatHead() {
    if (chatHeadView != null) {
      getWindowManager().removeView(chatHeadView);
      chatHeadView = null;
    }
  }

  /** Brings the app back to the foreground, also when its activity is gone. */
  private void openApp() {
    Context context = getReactApplicationContext();
    Intent intent = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
    if (intent != null) {
      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      context.startActivity(intent);
    }
  }
}
