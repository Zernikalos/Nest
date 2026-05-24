import { ipcMain } from "electron";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { Constants } from "../constants";

export const IDE_SESSION_STORAGE_KEY = "ide-session";

export async function readIdeSession(): Promise<string | null> {
    try {
        return await fs.readFile(Constants.ideSessionPath, "utf-8");
    } catch {
        return null;
    }
}

export async function writeIdeSession(value: string): Promise<void> {
    await fs.mkdir(path.dirname(Constants.ideSessionPath), { recursive: true });
    await fs.writeFile(Constants.ideSessionPath, value, "utf-8");
}

export async function deleteIdeSession(): Promise<void> {
    try {
        await fs.unlink(Constants.ideSessionPath);
    } catch {
        // ignore missing file
    }
}

export function registerIdeStorageIpcHandlers(): void {
    ipcMain.handle("ide-storage:get", async (_event, key: string) => {
        if (key !== IDE_SESSION_STORAGE_KEY) return null;
        return readIdeSession();
    });
    ipcMain.handle("ide-storage:set", async (_event, key: string, value: string) => {
        if (key !== IDE_SESSION_STORAGE_KEY) return;
        await writeIdeSession(value);
    });
    ipcMain.handle("ide-storage:delete", async (_event, key: string) => {
        if (key !== IDE_SESSION_STORAGE_KEY) return;
        await deleteIdeSession();
    });
}
