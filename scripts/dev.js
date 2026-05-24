const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const managedChildren = [];
let shuttingDown = false;

function runPnpmScript(name, env = {}) {
    console.log(`[dev] starting ${name}`);
    const child = spawn('pnpm', ['run', name], {
        cwd: rootDir,
        env: { ...process.env, ...env },
        shell: true,
        stdio: 'inherit',
    });

    managedChildren.push(child);
    child.on('exit', (code, signal) => {
        if (shuttingDown) {
            return;
        }

        if (code !== 0) {
            console.error(`Script ${name} exited with code ${code ?? 'unknown'}${signal ? ` (${signal})` : ''}.`);
            shutdown(code || 1);
        }
    });

    return child;
}

function runPnpmScriptSync(name) {
    console.log(`[dev] running ${name} (sync)...`);
    const result = spawnSync('pnpm', ['run', name], {
        cwd: rootDir,
        stdio: 'inherit',
        shell: true,
    });

    if (result.status !== 0) {
        process.exit(result.status || 1);
    }
}

function waitForFile(filePath, timeoutMs = 120000) {
    return new Promise((resolve, reject) => {
        const startedAt = Date.now();
        let announced = false;

        function poll() {
            if (fs.existsSync(filePath)) {
                console.log(`[dev] ready file ${path.relative(rootDir, filePath)}`);
                resolve();
                return;
            }

            if (!announced) {
                console.log(`[dev] waiting for file ${path.relative(rootDir, filePath)}`);
                announced = true;
            }

            if (Date.now() - startedAt > timeoutMs) {
                reject(new Error(`Timed out waiting for file: ${filePath}`));
                return;
            }

            setTimeout(poll, 500);
        }

        poll();
    });
}

function removeIfExists(filePath) {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
}

function shutdown(code = 0) {
    if (shuttingDown) {
        return;
    }
    shuttingDown = true;

    for (const child of managedChildren) {
        if (!child.killed) {
            child.kill('SIGTERM');
        }
    }

    setTimeout(() => process.exit(code), 100);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

async function main() {
    runPnpmScript('dev:ui');
    runPnpmScript('dev:electron:preload');

    // Build the Nest server once before watch. `nest build --watch` with deleteOutDir wipes
    // dist on startup, so waiting for stale dist files from a previous session races and
    // breaks webpack's @zstudio-server alias (see electronapp.main.cjs).
    runPnpmScriptSync('build:server');
    runPnpmScript('dev:server');

    const electronMainOut = path.join(rootDir, 'electronapp', 'dist', 'main', 'index.js');
    removeIfExists(electronMainOut);

    runPnpmScript('dev:electron:main');

    await Promise.all([
        waitForFile(electronMainOut),
        waitForFile(path.join(rootDir, 'electronapp', 'dist', 'preload', 'preload.js')),
    ]);

    console.log('[dev] launching electron via dev:main');
    runPnpmScript('dev:main', { DEBUG: 'true' });
}

main().catch((error) => {
    console.error(error.message);
    shutdown(1);
});
