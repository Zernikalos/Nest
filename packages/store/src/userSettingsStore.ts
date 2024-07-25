import {defineStore} from "pinia"
import {ref, watch} from "vue"
// @ts-ignore
import daisyUiThemes from "../../nestui/daisyUiThemes"

export const useUserSettingsStore = defineStore("UserSettingsStore", () => {
    const availableThemes = daisyUiThemes
    // @ts-ignore
    const store = window.userSettings

    const theme = ref("dark")

    async function startStore() {
        theme.value = await store?.get("theme") ?? "dark"
    }

    watch(theme, async (newTheme) => {
        debugger
        await store.set("theme", newTheme)
    })

    startStore()

    return {theme, availableThemes}
})