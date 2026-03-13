const path = require('path');

const repoRoot = path.resolve(__dirname, '..');

function fromRoot(...segments) {
    return path.resolve(repoRoot, ...segments);
}

function createAppAliases(localSrcDir) {
    return {
        '@': localSrcDir,
        '@ide-core': fromRoot('ide-core', 'src', 'index.ts'),
        '@electronapp': fromRoot('electronapp', 'src'),
        '@zstudio-server': fromRoot('nestserver', 'src', 'main.ts'),
        '@vueui': fromRoot('vueui', 'src'),
    };
}

module.exports = {
    repoRoot,
    fromRoot,
    createAppAliases,
};
