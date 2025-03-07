import {MenuItem} from "electron";


export const editMenu = new MenuItem({
    label: 'Edit',
    submenu: [
        {
            label: 'Copy',
            accelerator: 'CmdOrCtrl+C',
            role: 'copy'
        },
        {
            label: 'Paste',
            accelerator: 'CmdOrCtrl+V',
            role: 'paste'
        },
        {
            label: 'Cut',
            accelerator: 'CmdOrCtrl+X',
            role: 'cut'
        },
        {
            label: 'Select all',
            accelerator: 'CmdOrCtrl+A',
            role: 'selectAll'
        }
    ]
})