import {createPinia} from "pinia"
import {App} from "vue";

export {useFileApiStore} from "./src/fileapiStore"
export {useNestStore} from "./src/nestStore"
export {useZkBuilderStore} from "./src/zkbuilderStore"
export {useNativeNest} from "./src/nativeStore"
export {useNestApiStore} from "./src/nestApiStore"
export function createNestStore(app: App) {
    createPinia().install(app)
}
