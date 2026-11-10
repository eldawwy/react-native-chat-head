import { NativeModules, Platform } from 'react-native';

type NativeChatHead = {
  showChatHead(): Promise<boolean>;
  hideChatHead(): Promise<boolean>;
  updateBadgeCount(count: number): Promise<boolean>;
  requestPermission(): Promise<boolean>;
  checkOverlayPermission(): Promise<boolean>;
};

const LINKING_ERROR =
  `The package 'react-native-chat-head' doesn't seem to be linked. Make sure: \n\n` +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const isAndroid = Platform.OS === 'android';

const ChatHead: NativeChatHead =
  NativeModules.ChatHead ??
  new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    }
  );

const unsupported = (): Promise<boolean> => {
  console.warn('react-native-chat-head is only supported on Android');
  return Promise.resolve(false);
};

/** Resolves `false` when the overlay permission has not been granted. */
export function showChatHead(): Promise<boolean> {
  return isAndroid ? ChatHead.showChatHead() : unsupported();
}

export function hideChatHead(): Promise<boolean> {
  return isAndroid ? ChatHead.hideChatHead() : unsupported();
}

/** Resolves `false` when no chat head is currently shown. */
export function updateChatBadgeCount(count: number): Promise<boolean> {
  if (typeof count !== 'number') {
    throw new Error('count must be a number');
  }
  return isAndroid ? ChatHead.updateBadgeCount(count) : unsupported();
}

/**
 * Opens the system "display over other apps" screen and resolves with the
 * permission state once the user returns to the app.
 */
export function requestPermission(): Promise<boolean> {
  return isAndroid ? ChatHead.requestPermission() : unsupported();
}

/** @deprecated Misspelled; use `requestPermission`. */
export const requrestPermission = requestPermission;

export function checkOverlayPermission(): Promise<boolean> {
  return isAndroid ? ChatHead.checkOverlayPermission() : unsupported();
}

const chatHead = {
  showChatHead,
  hideChatHead,
  updateChatBadgeCount,
  requestPermission,
  requrestPermission,
  checkOverlayPermission,
};

export default chatHead;
