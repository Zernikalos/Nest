import { BrowserWindow, ipcMain } from "electron";
import { registerMenuCommandHandlers } from "./menu/registerMenuCommandHandlers";
import { createMenu, clearApplicationMenu } from "./menu/menu";
import { AssetFormat } from '@ide-core';
import {
    DEFAULT_MENU_CONTEXT,
    IdeIpcChannel,
    type MenuContextSnapshot,
} from '@ide-core/electron';
import { bundleSceneDialog } from "./dialogs/bundleSceneDialog";
import { NestEvents } from "./NestEvents";
import * as fs from "node:fs/promises";
import { Constants } from "./constants";
import _ from "lodash";
import { SettingsService, type AppSettings } from "./nestServerAdapter";
import { createProjectDialog } from "./dialogs/createProjectDialog";
import { openProjectDialog } from "./dialogs/openProjectDialog";
import { getPlatformProfile, MenuPresentation } from "./platform/platformProfile";
import {
    attachWindowMaximizeEvents,
    MAXIMIZED_CHANGED,
    registerWindowControlHandlers,
} from "./window/windowControls";
import {
    runImportFileDialog,
    runLoadZkoDialog,
    runOpenProjectDialog,
} from "./menu/menuActions";

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

    ipcMain.handle('menu:loadZko', async () => {
        const win = getBrowserWindow();
        if (!win) return null;
        return runLoadZkoDialog(win);
    });

    ipcMain.handle('menu:importFile', async (_event, format: AssetFormat) => {
        const win = getBrowserWindow();
        if (!win) return null;
        return runImportFileDialog(win, format);
    });

    ipcMain.handle('menu:openProject', async () => {
        const win = getBrowserWindow();
        if (!win) return null;
        return runOpenProjectDialog(win);
    });

    registerMenuCommandHandlers(getMainWindow);

    ipcMain.handle(NestEvents.SAVE_FILE, async (_ev, fileData: Uint8Array) => {
        const win = getMainWindow();
        if (!win) return;
        const pathInfo = await bundleSceneDialog(win.getBrowserWindow());
        if (_.isNil(pathInfo)) return;
        try {
            await fs.writeFile(pathInfo.filePath, fileData);
        } catch (e) {
            console.log(`Unable to write file to ${pathInfo.filePath}. Error: ${e}`);
        }
    });

    ipcMain.handle(NestEvents.SHOW_SAVE_PROJECT_DIALOG, async (_ev, projectName: string) => {
        const win = getMainWindow();
        if (!win) return null;
        const pathInfo = await createProjectDialog(win.getBrowserWindow(), projectName);
        return pathInfo?.filePath ?? null;
    });

    ipcMain.handle(NestEvents.SHOW_OPEN_PROJECT_DIALOG, async () => {
        const win = getMainWindow();
        if (!win) return null;
        const pathInfo = await openProjectDialog(win.getBrowserWindow());
        return pathInfo?.filePath ?? null;
    });

    ipcMain.handle("userSettings:getAll", async () => getSettings().getSettings());

    ipcMain.handle("userSettings:patch", async (_event, partial: Partial<AppSettings>) =>
        getSettings().updateSettings(partial));

    ipcMain.on(IdeIpcChannel.MenuContext, (_event, context: MenuContextSnapshot) => {
        if (getPlatformProfile().menuPresentation !== MenuPresentation.Native) return;
        createMenu(context);
    });
}
