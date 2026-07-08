import { BrowserWindow, ipcMain } from "electron";
import { registerMenuCommandForward } from "./menu/menuCommandForward";
import { createMenu, clearApplicationMenu } from "./menu/menu";
import {
    DEFAULT_MENU_CONTEXT,
    IdeIpcChannel,
    type MenuContextSnapshot,
} from '@ide-core/electron';
import { Constants } from "./constants";
import { SettingsService, type AppSettings } from "./nestServerAdapter";
import { getPlatformProfile, MenuPresentation } from "./platform/platformProfile";
import { attachDevToolsShortcut } from "./window/devToolsShortcut";
import {
    attachWindowMaximizeEvents,
    MAXIMIZED_CHANGED,
    registerWindowControlHandlers,
} from "./window/windowControls";
import { registerHostDialogIpcHandlers } from "./host/registerHostDialogIpc";

export class MainWindow {
    private mainWindow!: BrowserWindow;
    private readonly platformProfile = getPlatformProfile();

    constructor(private settings: SettingsService) {}

    public getBrowserWindow(): BrowserWindow {
        return this.mainWindow;
    }

    public sendOnChannel(channel: string, payload?: unknown): void {
        if (this.mainWindow && !this.mainWindow.isDestroyed()) {
            this.mainWindow.webContents.send(channel, payload);
        }
    }

    public async load(): Promise<void> {
        await this.createWindow();
        this.registerWindowListeners();
        this.initApplicationMenu();
        await this.loadRendererContent();
    }

    private async createWindow(): Promise<void> {
        const { width, height } = await this.settings.getWindowSize();
        const bgColor = await this.resolveBackgroundColor();

        this.mainWindow = new BrowserWindow({
            icon: Constants.trayIcon,
            width,
            height,
            title: "Zernikalos Nest",
            ...this.resolveChromeOptions(bgColor),
            webPreferences: {
                preload: Constants.PreloadScriptPath,
                contextIsolation: true,
            },
        });
    }

    private async resolveBackgroundColor(): Promise<string> {
        const settings = await this.settings.getSettings();
        return Constants.windowBackgroundForTheme(settings.appearance?.theme);
    }

    private resolveChromeOptions(bgColor: string): Partial<Electron.BrowserWindowConstructorOptions> {
        if (this.platformProfile.menuPresentation === MenuPresentation.Native) {
            return {
                titleBarStyle: 'hiddenInset',
                trafficLightPosition: { x: 12, y: 10 },
                backgroundColor: bgColor,
            };
        }
        return {
            frame: false,
            backgroundColor: bgColor,
        };
    }

    private registerWindowListeners(): void {
        this.mainWindow.on("resize", () => {
            void this.persistWindowSize();
        });

        attachDevToolsShortcut(this.mainWindow);

        attachWindowMaximizeEvents(this.mainWindow, (maximized) => {
            this.broadcastMaximizedState(maximized);
        });
    }

    private async persistWindowSize(): Promise<void> {
        const [width, height] = this.mainWindow.getSize();
        await this.settings.setWindowSize(width, height);
    }

    private broadcastMaximizedState(maximized: boolean): void {
        this.sendOnChannel(MAXIMIZED_CHANGED, maximized);
    }

    private initApplicationMenu(): void {
        if (this.platformProfile.menuPresentation === MenuPresentation.Native) {
            createMenu(DEFAULT_MENU_CONTEXT);
        } else {
            clearApplicationMenu();
        }
    }

    private async loadRendererContent(): Promise<void> {
        if (Constants.isDebug) {
            await this.mainWindow.loadURL(Constants.MainWindowPath);
        } else {
            await this.mainWindow.loadFile(Constants.MainWindowPath);
        }
    }
}

/**
 * Register IPC handlers once (e.g. from ZernikalosNest). Uses getMainWindow() so that
 * when the window is recreated (macOS: close then reopen), handlers still target the current window.
 */
export function registerMainWindowIpcHandlers(
    getMainWindow: () => MainWindow | undefined,
    getSettings: () => SettingsService,
) {
    const getBrowserWindow = () => getMainWindow()?.getBrowserWindow();

    registerWindowControlHandlers(() => getBrowserWindow());
    registerHostDialogIpcHandlers(getBrowserWindow);
    registerMenuCommandForward(getMainWindow);

    ipcMain.handle("userSettings:getAll", async () => getSettings().getSettings());

    ipcMain.handle("userSettings:patch", async (_event, partial: Partial<AppSettings>) =>
        getSettings().updateSettings(partial));

    ipcMain.on(IdeIpcChannel.MenuContext, (_event, context: MenuContextSnapshot) => {
        if (getPlatformProfile().menuPresentation !== MenuPresentation.Native) return;
        createMenu(context);
    });
}
