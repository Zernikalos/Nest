import {App} from "vue"
import {createPinia} from "pinia"

export {useFileApiStore} from "./fileapiStore"
export {useNestStore} from "./nestStore"
export {useZkBuilderStore} from "./zkbuilderStore"
export {useNativeNest} from "./nativeStore"
export {useNestApiStore} from "./nestApiStore"
export {useExplorerStore} from "./explorerStore"
export {useUserSettingsStore} from "./userSettingsStore"

export function createNestStore(app: App) {
    createPinia().install(app)
}