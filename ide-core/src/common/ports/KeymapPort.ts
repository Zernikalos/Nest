/** Keybinding registration for commands. Optional; enables platform-specific shortcuts. */
export interface KeymapPort {
    registerCommand(commandId: string, keybinding: string): void;
    unregisterCommand(commandId: string): void;
}
