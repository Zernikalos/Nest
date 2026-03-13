const { spawnSync } = require('child_process');

const steps = [
    'build:core',
    'build:server',
    'build:vueui',
    'build:ui',
    'build:electron',
];

for (const step of steps) {
    console.log(`[build] ${step}`);
    const result = spawnSync('pnpm', ['run', step], {
        stdio: 'inherit',
        shell: true,
    });

    if (result.status !== 0) {
        process.exit(result.status || 1);
    }
}
