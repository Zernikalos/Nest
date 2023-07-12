import {createPinia} from "pinia"
import {App} from "vue";

export {useFileApiStore} from "./src/fileapi-store"
export {useStudioStore} from "./src/studio-store"
export {useZkBuilderStore} from "./src/zkbuilder-store"

export function createStudioStore(app: App) {
    createPinia().install(app)
}
