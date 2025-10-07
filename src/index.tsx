import { NativeModules, Platform } from 'react-native';

const isAndroid = Platform.OS === 'android';
const _logWarning = () => {
  console.warn('react-native-chat-head is not supported on iOS');
  return Promise.resolve(false);
};
const LINKING_ERROR =
  `The package 'react-native-chat-head' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const ChatHead = isAndroid
  ? NativeModules.ChatHead
    ? NativeModules.ChatHead
    : new Proxy(
        {},
        {
          get() {
            throw new Error(LINKING_ERROR);
          },
        }
      )
  : null;

export function showChatHead(): Promise<boolean> {
  return isAndroid ? ChatHead.showChatHead() : _logWarning();
}
export function hideChatHead(): Promise<boolean> {
  return isAndroid ? ChatHead.hideChatHead() : _logWarning();
}
export function updateChatBadgeCount(count: number): Promise<boolean> {
  if (typeof count !== 'number') {
    throw new Error('count must be a number');
  }
  return isAndroid ? ChatHead.updateBadgeCount(count) : _logWarning();
}

export function requrestPermission(): Promise<boolean> {
  return isAndroid ? ChatHead.requrestPermission() : _logWarning();
}

export function checkOverlayPermission(): Promise<boolean> {
  return isAndroid ? ChatHead.checkOverlayPermission() : _logWarning();
}
const chatHead = {
  showChatHead,
  hideChatHead,
  updateChatBadgeCount,
  requrestPermission,
  checkOverlayPermission,
};
export default chatHead;
