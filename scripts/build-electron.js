"use strict";

const builder = require("electron-builder");
const Platform = builder.Platform;
const { options } = require("../electronapp/builder-options.cjs");

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
