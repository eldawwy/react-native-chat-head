"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkOverlayPermission = checkOverlayPermission;
exports.default = void 0;
exports.hideChatHead = hideChatHead;
exports.requestPermission = requestPermission;
exports.requrestPermission = void 0;
exports.showChatHead = showChatHead;
exports.updateChatBadgeCount = updateChatBadgeCount;
var _reactNative = require("react-native");
const LINKING_ERROR = `The package 'react-native-chat-head' doesn't seem to be linked. Make sure: \n\n` + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go\n';
const isAndroid = _reactNative.Platform.OS === 'android';
const ChatHead = _reactNative.NativeModules.ChatHead ?? new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});
const unsupported = () => {
  console.warn('react-native-chat-head is only supported on Android');
  return Promise.resolve(false);
};

/** Resolves `false` when the overlay permission has not been granted. */
function showChatHead() {
  return isAndroid ? ChatHead.showChatHead() : unsupported();
}
function hideChatHead() {
  return isAndroid ? ChatHead.hideChatHead() : unsupported();
}

/** Resolves `false` when no chat head is currently shown. */
function updateChatBadgeCount(count) {
  if (typeof count !== 'number') {
    throw new Error('count must be a number');
  }
  return isAndroid ? ChatHead.updateBadgeCount(count) : unsupported();
}

/**
 * Opens the system "display over other apps" screen and resolves with the
 * permission state once the user returns to the app.
 */
function requestPermission() {
  return isAndroid ? ChatHead.requestPermission() : unsupported();
}

/** @deprecated Misspelled; use `requestPermission`. */
const requrestPermission = exports.requrestPermission = requestPermission;
function checkOverlayPermission() {
  return isAndroid ? ChatHead.checkOverlayPermission() : unsupported();
}
const chatHead = {
  showChatHead,
  hideChatHead,
  updateChatBadgeCount,
  requestPermission,
  requrestPermission,
  checkOverlayPermission
};
var _default = exports.default = chatHead;
//# sourceMappingURL=index.js.map