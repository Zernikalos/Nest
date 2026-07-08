/** IPC channel names for HostDialogsPort between Electron main and renderer (preload bridge). */
export enum HostDialogIpcChannel {
    LoadZko = 'host:dialog:loadZko',
    ImportFile = 'host:dialog:importFile',
    OpenProject = 'host:dialog:openProject',
    SaveProject = 'host:dialog:saveProject',
    SaveBundledScene = 'host:dialog:saveBundledScene',
}
