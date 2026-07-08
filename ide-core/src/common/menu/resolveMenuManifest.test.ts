import { APP_MENU_MANIFEST } from './appMenuManifest.js';
import { evaluateMenuWhen, MenuItemKind, resolveMenuManifest, menuContextToKeys } from './core/index.js';

describe('resolveMenuManifest', () => {
    it('enables project-scoped items when projectOpen is true', () => {
        const resolved = resolveMenuManifest(APP_MENU_MANIFEST, { projectOpen: true });
        const fileGroup = resolved.find((g) => g.id === 'file');
        const loadZko = fileGroup?.items.find((i) => i.id === 'file.loadZko');
        expect(loadZko?.enabled).toBe(true);
    });

    it('disables project-scoped items when projectOpen is false', () => {
        const resolved = resolveMenuManifest(APP_MENU_MANIFEST, { projectOpen: false });
        const fileGroup = resolved.find((g) => g.id === 'file');
        const loadZko = fileGroup?.items.find((i) => i.id === 'file.loadZko');
        expect(loadZko?.enabled).toBe(false);
    });

    it('resolves nested import submenu with per-item when clauses', () => {
        const resolved = resolveMenuManifest(APP_MENU_MANIFEST, { projectOpen: true });
        const importItem = resolved
            .find((g) => g.id === 'file')
            ?.items.find((i) => i.id === 'file.import');
        expect(importItem?.kind).toBe(MenuItemKind.Submenu);
        expect(importItem?.children).toHaveLength(4);
        expect(importItem?.children?.every((c) => c.enabled)).toBe(true);
    });

    it('maps separators', () => {
        const resolved = resolveMenuManifest(APP_MENU_MANIFEST, { projectOpen: true });
        const sep = resolved.find((g) => g.id === 'file')?.items.find((i) => i.id === 'file.sep1');
        expect(sep?.kind).toBe(MenuItemKind.Separator);
    });
});

describe('menuContextToKeys', () => {
    it('maps MenuContextSnapshot to context keys', () => {
        expect(menuContextToKeys({ projectOpen: true })).toEqual({ projectOpen: true });
    });
});

describe('evaluateMenuWhen', () => {
    it('evaluates negated keys', () => {
        expect(evaluateMenuWhen('!projectOpen', { projectOpen: false })).toBe(true);
    });
});
