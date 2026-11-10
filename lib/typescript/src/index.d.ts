/** Resolves `false` when the overlay permission has not been granted. */
export declare function showChatHead(): Promise<boolean>;
export declare function hideChatHead(): Promise<boolean>;
/** Resolves `false` when no chat head is currently shown. */
export declare function updateChatBadgeCount(count: number): Promise<boolean>;
/**
 * Opens the system "display over other apps" screen and resolves with the
 * permission state once the user returns to the app.
 */
export declare function requestPermission(): Promise<boolean>;
/** @deprecated Misspelled; use `requestPermission`. */
export declare const requrestPermission: typeof requestPermission;
export declare function checkOverlayPermission(): Promise<boolean>;
declare const chatHead: {
    showChatHead: typeof showChatHead;
    hideChatHead: typeof hideChatHead;
    updateChatBadgeCount: typeof updateChatBadgeCount;
    requestPermission: typeof requestPermission;
    requrestPermission: typeof requestPermission;
    checkOverlayPermission: typeof checkOverlayPermission;
};
export default chatHead;
//# sourceMappingURL=index.d.ts.map