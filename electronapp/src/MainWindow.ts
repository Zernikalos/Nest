import { BrowserWindow, ipcMain } from "electron";
import { MenuEvents, RendererMenuEvents } from "./menu/MenuEvents";
import { createMenu } from "./menu/menu";
import { DEFAULT_MENU_CONTEXT, type MenuContextSnapshot } from "./menu/MenuContext";
import { importFileDialog } from "./dialogs/importFileDialog";
import { bundleSceneDialog } from "./dialogs/bundleSceneDialog";
import { NestEvents } from "./NestEvents";
import * as fs from "node:fs/promises";
import { Constants } from "./constants";
import { loadZkoDialog } from "./dialogs/loadZkoDialog";
import _ from "lodash";
import { SettingsService, type AppSettings } from "./nestServerAdapter";
import { createProjectDialog } from "./dialogs/createProjectDialog";
import { openProjectDialog } from "./dialogs/openProjectDialog";

export class MainWindow {
    private mainWindow!: BrowserWindow;

    constructor(private settings: SettingsService) {}

    public getBrowserWindow(): BrowserWindow {
        return this.mainWindow;
    }

    public sendToRenderer(ev: RendererMenuEvents, payload?: any) {
        if (this.mainWindow && !this.mainWindow.isDestroyed()) {
            this.mainWindow.webContents.send(ev, payload);
        }
    }

    private async createWindow() {
        const { width, height } = await this.settings.getWindowSize();
        this.mainWindow = new BrowserWindow({
            icon: Constants.trayIcon,
            width: width,
            height: height,
            title: "Zernikalos Nest",
            webPreferences: {
                preload: Constants.PreloadScriptPath,
            },
        });
    }

    public async load() {
        await this.createWindow();
        this.mainWindow.on("resize", async () => {
            const [width, heigt] = this.mainWindow.getSize();
            await this.settings.setWindowSize(width, heigt);
        });
        createMenu(DEFAULT_MENU_CONTEXT);

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
    ipcMain.on(MenuEvents.LOAD_ZKO, async () => {
        const win = getMainWindow();
        if (!win) return;
        const pathInfo = await loadZkoDialog(win.getBrowserWindow());
        if (_.isNil(pathInfo)) return;
        win.sendToRenderer(RendererMenuEvents.LOAD_ZKO, {
            path: pathInfo.parsedPath.dir,
            fileName: pathInfo.parsedPath.base,
        });
    });

    ipcMain.on(MenuEvents.IMPORT_FILE, async (_event, data: { format: "gltf" | "obj" | "fbx" }) => {
        const win = getMainWindow();
        if (!win) return;
        const pathInfo = await importFileDialog(win.getBrowserWindow(), data.format);
        if (_.isNil(pathInfo)) return;
        win.sendToRenderer(RendererMenuEvents.IMPORT_FILE, {
            path: pathInfo.parsedPath.dir,
            fileName: pathInfo.parsedPath.base,
            format: data.format,
        });
    });

    ipcMain.on(MenuEvents.BUNDLE_SCENE, async () => {
        getMainWindow()?.sendToRenderer(RendererMenuEvents.BUNDLE_SCENE);
    });

    ipcMain.on(MenuEvents.CREATE_PROJECT, async () => {
        getMainWindow()?.sendToRenderer(RendererMenuEvents.CREATE_PROJECT);
    });

    ipcMain.on(MenuEvents.OPEN_PROJECT, async () => {
        const win = getMainWindow();
        if (!win) return;
        const pathInfo = await openProjectDialog(win.getBrowserWindow());
        if (_.isNil(pathInfo)) return;
        win.sendToRenderer(RendererMenuEvents.OPEN_PROJECT, { filePath: pathInfo.filePath });
    });

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

    ipcMain.on("ide:menuContext", (_event, context: MenuContextSnapshot) => {
        createMenu(context);
    });
}