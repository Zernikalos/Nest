export enum MenuPresentation {
    Native = 'native',
    InRenderer = 'in-renderer',
}

export enum ExitMenuRole {
    Quit = 'quit',
    Close = 'close',
}

export interface NestPlatformProfile {
    menuPresentation: MenuPresentation;
    frameless: boolean;
    exitMenuRole: ExitMenuRole;
}

export function getPlatformProfile(
    platform: NodeJS.Platform = process.platform,
): NestPlatformProfile {
    const isMac = platform === 'darwin';
    return {
        menuPresentation: isMac ? MenuPresentation.Native : MenuPresentation.InRenderer,
        frameless: !isMac,
        exitMenuRole: isMac ? ExitMenuRole.Close : ExitMenuRole.Quit,
    };
}
