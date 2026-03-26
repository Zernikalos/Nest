import path from 'node:path';
import { fileURLToPath } from 'node:url';

const configDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(configDir, '..');

export function fromRoot(...segments) {
    return path.resolve(repoRoot, ...segments);
}

export function createAppAliases(localSrcDir) {
    return {
        '@': localSrcDir,
        '@ide-core': fromRoot('ide-core', 'src', 'index.ts'),
        '@electronapp': fromRoot('electronapp', 'src'),
        '@zstudio-server': fromRoot('nestserver', 'src', 'main.ts'),
        '@vueui': fromRoot('vueui', 'src'),
    };
}

export { repoRoot };
