const eslint = require("@eslint/js")
const tseslint = require("typescript-eslint").default

const conf = tseslint.config({
    files: ['src/**/*.ts'],
    extends: [
        eslint.configs.recommended,
        ...tseslint.configs.recommended,
    ]
});

module.exports = conf
