import {defineStore} from "pinia"
import {computed, ref} from "vue"
// @ts-ignore
// import daisyUiThemes, {darkThemes, lightThemes} from "../../nestui/daisyUiThemes"

const lightThemes = ["light", "cupcake", "retro"]
const darkThemes = ["dark", "sunset"]
const daisyUiThemes = [...lightThemes, ...darkThemes]

export const useUserSettingsStore = defineStore("UserSettingsStore", () => {
    const availableThemes = daisyUiThemes
    // @ts-ignore
    const store = window.userSettings

    const _theme = ref("dark")
    const theme = computed(() => _theme.value)

    async function setTheme(newTheme: string) {
        if (!availableThemes.includes(newTheme)) {
            console.error(`Theme ${newTheme} not available`)
            return
        }
        await store.set("theme", newTheme)
        _theme.value = newTheme
    }

    async function startStore() {
        _theme.value = await store?.get("theme") ?? "dark"
    }

    const isLightTheme = computed(() => {
        return lightThemes.includes(_theme.value)
    })

    const isDarkTheme = computed(() => {
        return darkThemes.includes(_theme.value)
    })

    startStore()

    return {theme, setTheme, availableThemes, isDarkTheme, isLightTheme}
})
