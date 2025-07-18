import { BrowserWindow, dialog } from "electron"

export async function newProjectDialog(mainWindow: BrowserWindow): Promise<{ filePath: string | undefined, canceled: boolean }> {
    const result = await dialog.showSaveDialog(mainWindow, {
        title: 'Create new project',
        filters: [{ name: 'Zernikalos Project', extensions: ['zkproj'] }],
        defaultPath: 'new-project.zkproj'
    })
    return {
        filePath: result.filePath,
        canceled: result.canceled
    }
} 