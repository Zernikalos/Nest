"use strict";

const isDebug = process.env.DEBUG === "true" || process.env.NODE_ENV === "development";

/**
 * @type {import('electron-builder').Configuration}
 */
const options = {
    appId: "com.zernikalos.nest",
    productName: "Zernikalos Nest",
    copyright: "Copyright © 2025 Aarón Negrín",
    compression: isDebug ? "store" : "normal",
    removePackageScripts: true,
    directories: {
        output: "out",
        buildResources: "build",
    },
    files: [
        "electronapp/dist/**/*",
        "packages/reactui/dist/**/*",
        "vueui/dist/**/*",
        "nestserver/dist/**/*",
        "electronapp/assets/**/*",
        "node_modules/**/*",
        "!**/node_modules/*/{CHANGELOG.md,README.md,README,readme.md,readme}",
        "!**/node_modules/*/{test,__tests__,tests,powered-test,example,examples}",
        "!**/node_modules/*.d.ts",
        "!**/node_modules/.bin",
        "!**/*.{iml,o,hprof,orig,pyc,pyo,rbc,swp,csproj,sln,xproj}",
        "!**/.idea",
        "!**/docs",
        "!**/samples",
        "!**/.gitignore",
        "!**/nest-cli.json",
        "!**/pnpm-lock.yaml",
        "!**/pnpm-workspace.yaml",
        "!**/lerna.json",
        "!**/tsconfig*.json",
        "!**/vite.*.config.*",
        "!**/electronapp/src/**/*",
        "!**/nestserver/src/**/*",
        "!**/packages/reactui/src/**/*",
        "!**/vueui/src/**/*"
    ],
    asar: false,
    mac: {
        category: "public.app-category.developer-tools",
        icon: "electronapp/assets/icons/zklogo.icns",
        target: [
            {
                target: "dmg",
                arch: ["x64", "arm64"],
            },
        ],
    },
    dmg: {
        title: "Zernikalos Nest",
    },
    linux: {
        target: [
            {
                target: "zip",
                arch: ["x64"],
            },
        ],
        icon: "electronapp/assets/icons/zklogo.png",
        category: "Development",
    },
    win: {
        target: [
            {
                target: "nsis",
                arch: ["x64"],
            },
        ],
        icon: "electronapp/assets/icons/zklogo.png",
    },
    nsis: {
        deleteAppDataOnUninstall: true,
        perMachine: true,
    },
    fileAssociations: [
        {
            ext: "zko",
            name: "Zernikalos Engine scene object file",
            icon: "electronapp/assets/icons/zklogo.icns",
            role: "Editor",
        },
    ],
};

module.exports = { options };
