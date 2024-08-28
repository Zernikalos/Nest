const typeScriptParser = require("@typescript-eslint/parser").default

const eslint = require("@eslint/js")
const tseslint = require("typescript-eslint").default
const tsParser = require("@typescript-eslint/parser").default
const pluginVue = require("eslint-plugin-vue")
const vueEslintParser = require("vue-eslint-parser")

module.exports = tseslint.config(
    {
        files: ["src/**/*.ts", "src/**/*.vue"],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    ...pluginVue.configs['flat/recommended'],
    {
        languageOptions: {
            parserOptions: {
                parser: '@typescript-eslint/parser'
            }
        },
        rules: {
            "semi": ["error", "never"],
            "quotes": ["error", "double"],
            "vue/html-indent": ["error", 4],
            "vue/multi-word-component-names": "off",
            "vue/return-in-computed-property": "off"
        }
    },
)

