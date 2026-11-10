import { NativeModules, Platform } from 'react-native';

const native = {
  showChatHead: jest.fn(() => Promise.resolve(true)),
  hideChatHead: jest.fn(() => Promise.resolve(true)),
  updateBadgeCount: jest.fn(() => Promise.resolve(true)),
  requestPermission: jest.fn(() => Promise.resolve(true)),
  checkOverlayPermission: jest.fn(() => Promise.resolve(true)),
};

const loadChatHead = (os: 'android' | 'ios') => {
  jest.resetModules();
  Platform.OS = os;
  NativeModules.ChatHead = native;
  return require('../index').default as typeof import('../index').default;
};

beforeEach(() => jest.clearAllMocks());

it('forwards every call to the native module on Android', async () => {
  const chatHead = loadChatHead('android');

  await chatHead.checkOverlayPermission();
  await chatHead.requestPermission();
  await chatHead.showChatHead();
  await chatHead.updateChatBadgeCount(3);
  await chatHead.hideChatHead();

  expect(native.checkOverlayPermission).toHaveBeenCalledTimes(1);
  expect(native.requestPermission).toHaveBeenCalledTimes(1);
  expect(native.showChatHead).toHaveBeenCalledTimes(1);
  expect(native.updateBadgeCount).toHaveBeenCalledWith(3);
  expect(native.hideChatHead).toHaveBeenCalledTimes(1);
});

it('keeps the misspelled requrestPermission working', async () => {
  const chatHead = loadChatHead('android');

  await expect(chatHead.requrestPermission()).resolves.toBe(true);
  expect(native.requestPermission).toHaveBeenCalledTimes(1);
});

it('resolves false without touching the native module on iOS', async () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  const chatHead = loadChatHead('ios');

  await expect(chatHead.showChatHead()).resolves.toBe(false);
  expect(native.showChatHead).not.toHaveBeenCalled();
  warn.mockRestore();
});
