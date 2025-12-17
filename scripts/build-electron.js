"use strict";

const builder = require("electron-builder");
const Platform = builder.Platform;

// Detectar si es modo debug desde variables de entorno
const isDebug = process.env.DEBUG === "true" || process.env.NODE_ENV === "development";

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration
 */
const options = {
    appId: "com.zernikalos.nest",
    productName: "Zernikalos Nest",
    copyright: "Copyright © 2025 Aarón Negrín",
    
    // Configuración de compresión
    compression: isDebug ? "store" : "normal",
    removePackageScripts: true,

    directories: {
        output: "out",
        buildResources: "build"
    },

    files: [
        "packages/electronapp/dist/**/*",
        "packages/reactui/dist/**/*",
        "packages/nestserver/dist/**/*",
        "packages/electronapp/assets/**/*",
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
        "!**/forge.config.js",
        "!**/nest-cli.json",
        "!**/pnpm-lock.yaml",
        "!**/pnpm-workspace.yaml",
        "!**/lerna.json",
        "!**/tsconfig*.json",
        "!**/vite.*.config.*",
        "!**/webpack.*.config.*",
        "!**/packages/electronapp/src/**/*",
        "!**/packages/nestserver/src/**/*",
        "!**/packages/reactui/src/**/*"
    ],

    asar: false,

    // Configuración para macOS (basada en forge.config.js)
    mac: {
        category: "public.app-category.developer-tools",
        icon: "packages/electronapp/assets/icons/zklogo.icns",
        target: [
            {
                target: "dmg",
                arch: ["x64", "arm64"]
            }
        ]
    },

    dmg: {
        title: "Zernikalos Nest"
    },

    // Configuración para Linux (basada en forge.config.js)
    linux: {
        target: [
            {
                target: "zip",
                arch: ["x64"]
            }
        ],
        icon: "packages/electronapp/assets/icons/zklogo.png",
        category: "Development"
    },

    // Configuración para Windows
    win: {
        target: [
            {
                target: "nsis",
                arch: ["x64"]
            }
        ],
        icon: "packages/electronapp/assets/icons/zklogo.png"
    },

    nsis: {
        deleteAppDataOnUninstall: true,
        perMachine: true
    },

    // Asociación de archivos .zko (basada en forge.config.js)
    fileAssociations: [
        {
            ext: "zko",
            name: "Zernikalos Engine scene object file",
            icon: "packages/electronapp/assets/icons/zklogo.icns",
            role: "Editor"
        }
    ]
};

// Función para construir
async function build() {
    const platformArg = process.argv.find(arg => 
        arg === "mac" || arg === "darwin" || 
        arg === "win" || arg === "win32" || 
        arg === "linux" || arg === "all"
    );
    
    const isDirOnly = process.argv.includes("--dir");
    
    let targets;
    let config = { ...options };

    if (isDirOnly) {
        // Solo empaquetar sin crear instaladores
        config.directories.output = "out";
    }

    if (platformArg) {
        switch (platformArg) {
            case "mac":
            case "darwin":
                targets = Platform.MAC.createTarget();
                break;
            case "win":
            case "win32":
                targets = Platform.WINDOWS.createTarget();
                break;
            case "linux":
                targets = Platform.LINUX.createTarget();
                break;
            case "all":
                targets = [
                    Platform.MAC.createTarget(),
                    Platform.WINDOWS.createTarget(),
                    Platform.LINUX.createTarget()
                ];
                break;
        }
    } else {
        // Por defecto, construir para la plataforma actual
        targets = Platform.current().createTarget();
    }

    try {
        const platformName = platformArg || process.platform;
        console.log(`Building for: ${platformName}`);
        
        if (isDirOnly) {
            console.log("Packaging only (no installers)...");
        }
        
        const result = await builder.build({
            targets: targets,
            config: config
        });
        
        console.log("Build completed successfully!");
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error("Build failed:", error);
        process.exit(1);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    build();
}

module.exports = { build, options };

