import {defineStore} from "pinia"

export const useNativeStudio = defineStore("NativeStudio", () => {

    function handleShowImport(callback: (ev: string) => {}) {
        // @ts-ignore
        window.NativeZernikalos.handleShowImport(callback)
    }

    return {handleShowImport}
})