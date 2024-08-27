const typeScriptParser = require("@typescript-eslint/parser").default

const eslint = require("@eslint/js")
const tseslint = require("typescript-eslint").default
const tsParser = require("@typescript-eslint/parser").default
const pluginVue = require("eslint-plugin-vue")
const vueEslintParser = require("vue-eslint-parser")

const conf = tseslint.config({
    files: ['src/**/*.ts'],
    extends: [
        eslint.configs.recommended,
        ...tseslint.configs.recommended,
    ],
    rules: {
        //"vue/html-indent": ["error", 4]
    }
},
{
    files: ['src/**/*.vue'],
    extends: [
        eslint.configs.recommended,
        ...tseslint.configs.recommended,
        ...pluginVue.configs['flat/recommended'],
    ],
    languageOptions: {
        parser: vueEslintParser,
        parserOptions: {
            parser: tsParser
        }
    },
    rules: {
        "vue/html-indent": ["error", 4]
    }
});


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
            "vue/html-indent": ["error", 4]
        }
    },
)

