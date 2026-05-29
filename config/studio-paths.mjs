import path from 'node:path';
import { fileURLToPath } from 'node:url';

const configDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(configDir, '..');

export function fromRoot(...segments) {
    return path.resolve(repoRoot, ...segments);
}

/**
 * Vite resolve aliases. More specific `@ide-core/vue` must precede `@ide-core`.
 */
export function createAppAliases(localSrcDir) {
    return [
        { find: '@', replacement: localSrcDir },
        {
            find: '@ide-core/vue',
            replacement: fromRoot('ide-core', 'src', 'vue', 'index.ts'),
        },
        {
            find: '@ide-core/electron',
            replacement: fromRoot('ide-core', 'src', 'electron', 'index.ts'),
        },
        {
            find: '@ide-core/browser',
            replacement: fromRoot('ide-core', 'src', 'browser', 'index.ts'),
        },
        { find: '@ide-core', replacement: fromRoot('ide-core', 'src', 'index.ts') },
        { find: '@electronapp', replacement: fromRoot('electronapp', 'src') },
        { find: '@zstudio-server', replacement: fromRoot('nestserver', 'src', 'main.ts') },
        { find: '@app-settings', replacement: fromRoot('nestserver', 'src', 'settings', 'app-settings.ts') },
        { find: '@vueui', replacement: fromRoot('vueui', 'src') },
    ];
}

export { repoRoot };
