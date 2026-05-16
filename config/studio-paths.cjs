const path = require('path');

const repoRoot = path.resolve(__dirname, '..');

function fromRoot(...segments) {
    return path.resolve(repoRoot, ...segments);
}

/** More specific `@ide-core/vue` must precede `@ide-core`. */
function createBaseAppAliasEntries(localSrcDir) {
    return [
        { find: '@', replacement: localSrcDir },
        {
            find: '@ide-core/vue',
            replacement: fromRoot('ide-core', 'src', 'vue', 'index.ts'),
        },
        { find: '@ide-core', replacement: fromRoot('ide-core', 'src', 'index.ts') },
        { find: '@electronapp', replacement: fromRoot('electronapp', 'src') },
        { find: '@zstudio-server', replacement: fromRoot('nestserver', 'src', 'main.ts') },
        { find: '@vueui', replacement: fromRoot('vueui', 'src') },
    ];
}

/** Vite resolve.alias format. */
function createAppAliases(localSrcDir) {
    return createBaseAppAliasEntries(localSrcDir);
}

/** Webpack resolve.alias format (object map). */
function createWebpackAliases(localSrcDir, overrides = {}) {
    const aliases = Object.fromEntries(
        createBaseAppAliasEntries(localSrcDir).map(({ find, replacement }) => [find, replacement]),
    );
    return { ...aliases, ...overrides };
}

module.exports = {
    fromRoot,
    createAppAliases,
    createWebpackAliases,
    repoRoot,
};
