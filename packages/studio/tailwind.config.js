/** @type {import('tailwindcss').Config} */
// const colors = require("tailwindcss/colors");
const path = require("path")

module.exports = {
    darkMode: 'class',
    content: [
        path.join(__dirname, "./index.html"),
        path.join(__dirname, "./src/**/*.{vue,js}")
    ],
    theme: {
        // colors: {
        //     ...colors,
        //     backcolor: "#1d232a",
        //     primar: colors.purple["600"]
        // }
    },
    plugins: [
        require("daisyui")
    ],
    daisyui: {
        themes: [
            // {
            //     mytheme: {
            //         ...require("daisyui/src/theming/themes")["dark"],
            //         neutral: "rgb(31 41 55)",
            //         primary: "rgb(147 51 234)"
            //     }
            // },
            "light",
            "dark",
            "cupcake",
            "retro"
        ], // true: all themes | false: only light + dark | array: specific themes like this ["light", "dark", "cupcake"]
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
