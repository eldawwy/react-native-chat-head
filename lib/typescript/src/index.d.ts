export declare function showChatHead(): Promise<boolean>;
export declare function hideChatHead(): Promise<boolean>;
export declare function updateChatBadgeCount(count: number): Promise<boolean>;
export declare function requrestPermission(): Promise<boolean>;
export declare function checkOverlayPermission(): Promise<boolean>;
declare const chatHead: {
    showChatHead: typeof showChatHead;
    hideChatHead: typeof hideChatHead;
    updateChatBadgeCount: typeof updateChatBadgeCount;
    requrestPermission: typeof requrestPermission;
    checkOverlayPermission: typeof checkOverlayPermission;
};
export default chatHead;
//# sourceMappingURL=index.d.ts.map