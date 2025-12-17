"use strict";

const builder = require("electron-builder");
const Platform = builder.Platform;

// Detect if debug mode from environment variables
const isDebug = process.env.DEBUG === "true" || process.env.NODE_ENV === "development";

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration
 */
const options = {
    appId: "com.zernikalos.nest",
    productName: "Zernikalos Nest",
    copyright: "Copyright © 2025 Aarón Negrín",
    
    // Compression configuration
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

    // macOS configuration
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

    // Linux configuration
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

    // Windows configuration
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

    // .zko file associations
    fileAssociations: [
        {
            ext: "zko",
            name: "Zernikalos Engine scene object file",
            icon: "packages/electronapp/assets/icons/zklogo.icns",
            role: "Editor"
        }
    ]
};

// Build function
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
        // Package only without creating installers
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
        // By default, build for current platform
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

// Execute if called directly
if (require.main === module) {
    build();
}

module.exports = { build, options };

