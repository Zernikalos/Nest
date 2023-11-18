import {createPinia} from "pinia"
import {App} from "vue";

export {useFileApiStore} from "./src/fileapiStore"
export {useStudioStore} from "./src/studioStore"
export {useZkBuilderStore} from "./src/zkbuilderStore"
export {useNativeStudio} from "./src/native-studio"

export function createStudioStore(app: App) {
    createPinia().install(app)
}
