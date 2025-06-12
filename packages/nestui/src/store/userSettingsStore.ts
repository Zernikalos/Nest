import {defineStore} from "pinia"
import {computed, ref} from "vue"

const lightThemes = ["light", "cupcake", "retro"]
const darkThemes = ["dark", "sunset"]
const daisyUiThemes = [...lightThemes, ...darkThemes]

const availableFonts = [
    "Rajdhani",
    "system-ui",
    "Menlo",
    "Fira Code",
    "JetBrains Mono",
    "Source Code Pro",
    "Roboto",
    "Open Sans",
    "Lato",
    "Verdana",
].map(fontName => ({ name: fontName, value: fontName }));

// Helper to generate the font-family string
const getFontFamilyString = (fontName: string): string => {
    const fontMap: { [key: string]: string } = {
        'system-ui': 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        'Menlo': 'Menlo, Consolas, "Liberation Mono", Courier, monospace',
        'Fira Code': '"Fira Code", Consolas, "Liberation Mono", Courier, monospace',
        'JetBrains Mono': '"JetBrains Mono", Consolas, "Liberation Mono", Courier, monospace',
        'Source Code Pro': '"Source Code Pro", Consolas, "Liberation Mono", Courier, monospace',
        'Roboto': 'Roboto, sans-serif',
        'Open Sans': '"Open Sans", sans-serif',
        'Lato': 'Lato, sans-serif',
        'Verdana': 'Verdana, sans-serif',
        'Rajdhani': 'Rajdhani, sans-serif' // Assuming Rajdhani is a sans-serif font
    };
    return fontMap[fontName] || fontName; // Fallback to just the name if not in map
};

export const useUserSettingsStore = defineStore("UserSettingsStore", () => {
    const availableThemes = daisyUiThemes
    // @ts-ignore
    const store = window.userSettings

    const _theme = ref("dark")
    const theme = computed(() => _theme.value)

    const _fontFamily = ref("Rajdhani") // Default font
    const fontFamily = computed(() => _fontFamily.value)

    function applyFontFamily(fontName: string) {
        document.body.style.fontFamily = getFontFamilyString(fontName);
    }

    async function setTheme(newTheme: string) {
        if (!availableThemes.includes(newTheme)) {
            console.error(`Theme ${newTheme} not available`)
            return
        }
        await store.set("theme", newTheme)
        _theme.value = newTheme
    }

    async function setFontFamily(newFontFamily: string) {
        const fontExists = availableFonts.some(font => font.name === newFontFamily);
        if (!fontExists) {
            console.error(`Font ${newFontFamily} not available`);
            return;
        }
        await store.set("fontFamily", newFontFamily);
        _fontFamily.value = newFontFamily;
        applyFontFamily(newFontFamily);
    }

    async function startStore() {
        _theme.value = await store?.get("theme") ?? "dark"
        const storedFont = await store?.get("fontFamily") ?? "Rajdhani"
        _fontFamily.value = storedFont
        applyFontFamily(storedFont)
    }

    const isLightTheme = computed(() => {
        return lightThemes.includes(_theme.value)
    })

    const isDarkTheme = computed(() => {
        return darkThemes.includes(_theme.value)
    })

    startStore()

    return {theme, setTheme, availableThemes, isDarkTheme, isLightTheme, fontFamily, setFontFamily, availableFonts}
})
