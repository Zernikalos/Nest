/** IPC channel names between Electron main and renderer (preload bridge). */
export enum IdeIpcChannel {
    MenuContext = 'ide:menuContext',
    ExecuteCommand = 'ide:executeCommand',
}
