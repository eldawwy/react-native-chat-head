"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkOverlayPermission = checkOverlayPermission;
exports.default = void 0;
exports.hideChatHead = hideChatHead;
exports.requrestPermission = requrestPermission;
exports.showChatHead = showChatHead;
exports.updateChatBadgeCount = updateChatBadgeCount;
var _reactNative = require("react-native");
const isAndroid = _reactNative.Platform.OS === 'android';
const _logWarning = () => console.warn('react-native-chat-head is not supported on iOS');
const LINKING_ERROR = `The package 'react-native-chat-head' doesn't seem to be linked. Make sure: \n\n` + _reactNative.Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go\n';
const ChatHead = isAndroid ? _reactNative.NativeModules.ChatHead ? _reactNative.NativeModules.ChatHead : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
}) : null;
function showChatHead() {
  return isAndroid ? ChatHead.showChatHead() : _logWarning();
}
function hideChatHead() {
  return isAndroid ? ChatHead.hideChatHead() : _logWarning();
}
function updateChatBadgeCount(count) {
  if (typeof count !== 'number') {
    throw new Error('count must be a number');
  }
  return isAndroid ? ChatHead.updateBadgeCount(count) : _logWarning();
}
function requrestPermission() {
  return isAndroid ? ChatHead.requrestPermission() : _logWarning();
}
function checkOverlayPermission() {
  return isAndroid ? ChatHead.checkOverlayPermission() : _logWarning();
}
const chatHead = {
  showChatHead,
  hideChatHead,
  updateChatBadgeCount,
  requrestPermission,
  checkOverlayPermission
};
var _default = exports.default = chatHead;
//# sourceMappingURL=index.js.map