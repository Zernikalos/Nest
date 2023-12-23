/** @type {import('tailwindcss').Config} */
// const colors = require("tailwindcss/colors");
const path = require("path")

const daisyUiThemes = ["light", "dark", "cupcake", "retro", "sunset"]
const transformedThemes = daisyUiThemes.map((themeName) => ({
    [themeName]: {
        ...require("daisyui/src/theming/themes")[themeName],
        "--rounded-btn": "0rem"
    }
}))

module.exports = {
    darkMode: 'class',
    content: [
        path.join(__dirname, "./index.html"),
        path.join(__dirname, "./src/**/*.{vue,js}")
    ],
    theme: {
    },
    plugins: [
        require("@tailwindcss/typography"),
        require("daisyui")
    ],
    daisyui: {
        themes: transformedThemes, // true: all themes | false: only light + dark | array: specific themes like this ["light", "dark", "cupcake"]
        darkTheme: "dark", // name of one of the included themes for dark mode
        base: true, // applies background color and foreground color for root element by default
        styled: true, // include daisyUI colors and design decisions for all components
        utils: true, // adds responsive and modifier utility classes
        //rtl: false, // rotate style direction from left-to-right to right-to-left. You also need to add dir="rtl" to your html tag and install `tailwindcss-flip` plugin for Tailwind CSS.
        prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
        logs: true, // Shows info about daisyUI version and used config in the console when building your CSS,
        // themeRoot: ":root", // The element that receives theme color CSS variables
    },
}
