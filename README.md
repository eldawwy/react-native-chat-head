# React Native Chat Head 🚀

`react-native-chat-head` is a React Native library that allows you to create Facebook Messenger-like chat heads for Android applications.

<p>
  <img width="125" src="./docs/demo.gif" alt="Demo">
</p>

## Features

- Create customizable chat heads
- Display badges on chat heads
- Request and manage overlay permissions
- Simple API to show, hide, and update chat heads

## Installation

```bash
npm install react-native-chat-head
# or
yarn add react-native-chat-head
```

Then rebuild the Android app. That is all the setup there is:

- The module is autolinked and works with both the old and the new architecture (React Native 0.72+).
- The `SYSTEM_ALERT_WINDOW` permission is merged into your manifest automatically.
- A default chat head (your app icon, a close button and a badge) is bundled.
- The library is Android only. On iOS nothing is linked and every method resolves `false`.

### Customising the chat head (optional)

Add your own `android/app/src/main/res/layout/chat_head_layout.xml`. It replaces the bundled layout. Keep the view ids you want the library to drive; each of them is optional:

| id | view | behaviour |
| --- | --- | --- |
| `chat_head_profile_iv` | `ImageView` | Shows your `android:src`, or the app icon when none is set |
| `close_btn` | any view | Removes the chat head when pressed |
| `chat_head_badge` | `TextView` | Receives the count from `updateChatBadgeCount` |

```xml
<?xml version="1.0" encoding="utf-8" ?>
<RelativeLayout
  xmlns:android="http://schemas.android.com/apk/res/android"
  android:id="@+id/chat_head_root"
  android:layout_width="65dp"
  android:layout_height="wrap_content">

  <ImageView
    android:id="@+id/chat_head_profile_iv"
    android:layout_width="60dp"
    android:layout_height="60dp"
    android:layout_marginTop="8dp"
    android:src="@mipmap/ic_launcher_round" />

  <ImageView
    android:id="@+id/close_btn"
    android:layout_width="20dp"
    android:layout_height="20dp"
    android:layout_marginStart="40dp"
    android:src="@drawable/chat_head_close" />

  <TextView
    android:id="@+id/chat_head_badge"
    android:layout_width="26dp"
    android:layout_height="26dp"
    android:layout_alignParentStart="true"
    android:layout_margin="5dp" />
</RelativeLayout>
```

`@drawable/chat_head_close` is the close icon bundled with the library.

## Usage

```javascript
import ChatHead from "react-native-chat-head";

let granted = await ChatHead.checkOverlayPermission();
if (!granted) {
  // Opens the system settings screen and resolves when the user comes back.
  granted = await ChatHead.requestPermission();
}

if (granted) {
  await ChatHead.showChatHead();
  await ChatHead.updateChatBadgeCount(1);
}

await ChatHead.hideChatHead();
```

Tapping the chat head brings your app back to the foreground. Dragging moves it.

## API

Every method returns a `Promise<boolean>`.

- `checkOverlayPermission()`: `true` when the "display over other apps" permission is granted.
- `requestPermission()`: opens the system permission screen and resolves with the permission state once the user returns. Resolves `true` right away when it is already granted.
- `showChatHead()`: shows the chat head. Resolves `false` when the permission is missing.
- `hideChatHead()`: removes the chat head.
- `updateChatBadgeCount(count)`: sets the badge text. Resolves `false` when no chat head is shown.

`requrestPermission()` is kept as a deprecated alias of `requestPermission()`.

## Contributing

We welcome contributions! Please see the [contributing guide](https://github.com/xforcarlos/react-native-chat-head/blob/main/CONTRIBUTING.md) to learn how to get involved.

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/xforcarlos/react-native-chat-head/blob/main/LICENSE) file for more details.
