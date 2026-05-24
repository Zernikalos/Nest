"use strict";

const builder = require("electron-builder");
const Platform = builder.Platform;
const Arch = builder.Arch;
const { options } = require("../electronapp/builder-options.cjs");

/** Windows targets built one-by-one to avoid NSIS/zip racing on win-unpacked. */
const WIN_TARGETS = ["nsis", "zip"];

function resolvePlatformArg() {
    return process.argv.find(
        (arg) =>
            arg === "mac" ||
            arg === "darwin" ||
            arg === "win" ||
            arg === "win32" ||
            arg === "linux" ||
            arg === "all",
    );
}

function isWindowsBuild(platformArg, isDirOnly) {
    if (isDirOnly) {
        return false;
    }
    if (platformArg === "win" || platformArg === "win32") {
        return true;
    }
    return !platformArg && process.platform === "win32";
}

function resolveTargets(platformArg, isDirOnly) {
    if (platformArg) {
        switch (platformArg) {
            case "mac":
            case "darwin":
                return Platform.MAC.createTarget();
            case "win":
            case "win32":
                return Platform.WINDOWS.createTarget();
            case "linux":
                return Platform.LINUX.createTarget();
            case "all":
                return [
                    Platform.MAC.createTarget(),
                    Platform.WINDOWS.createTarget(),
                    Platform.LINUX.createTarget(),
                ];
        }
    }
    return Platform.current().createTarget();
}

function cloneConfig(config) {
    return JSON.parse(JSON.stringify(config));
}

async function buildWindowsTargetsSequentially(baseConfig) {
    const artifacts = [];
    for (const targetName of WIN_TARGETS) {
        console.log(`Building Windows target: ${targetName}...`);
        const targetConfig = cloneConfig(baseConfig);
        targetConfig.win.target = [{ target: targetName, arch: ["x64"] }];
        const result = await builder.build({
            targets: Platform.WINDOWS.createTarget(targetName, Arch.x64),
            config: targetConfig,
        });
        artifacts.push(...result);
    }
    return artifacts;
}

async function build() {
    // Skip code-sign discovery (local unsigned builds; avoids flaky sign/uninstaller steps).
    process.env.CSC_IDENTITY_AUTO_DISCOVERY = "false";

    const platformArg = resolvePlatformArg();
    const isDirOnly = process.argv.includes("--dir");
    const config = { ...options };

    if (isDirOnly) {
        config.directories = { ...config.directories, output: "out" };
    }

    const targets = resolveTargets(platformArg, isDirOnly);
    const platformName = platformArg || process.platform;
    const sequentialWindows = isWindowsBuild(platformArg, isDirOnly);

    try {
        console.log(`Building for: ${platformName}`);
        if (isDirOnly) {
            console.log("Packaging only (no installers)...");
        }
        if (sequentialWindows) {
            console.log("Windows: building nsis → zip sequentially...");
        }

        const result = sequentialWindows
            ? await buildWindowsTargetsSequentially(config)
            : await builder.build({ targets, config });

        console.log("Build completed successfully!");
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error("Build failed:", error);
        process.exit(1);
    }
}

if (require.main === module) {
    build();
}

module.exports = { build, options, WIN_TARGETS };
