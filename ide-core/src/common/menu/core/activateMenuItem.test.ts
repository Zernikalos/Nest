import { CommandId } from '../commandId.js';
import { MenuItemKind } from './menuItemKind.js';
import { MenuItemRole } from './menuItemRole.js';
import { activateMenuItem } from './activateMenuItem.js';
import type { ResolvedMenuItem } from './resolvedMenuItem.js';

describe('activateMenuItem', () => {
    it('runs executeCommand for command items', () => {
        const executeCommand = jest.fn();
        const item: ResolvedMenuItem = {
            id: 'test',
            label: 'Test',
            kind: MenuItemKind.Command,
            enabled: true,
            activation: { commandId: CommandId.FILE_CREATE_PROJECT },
        };
        activateMenuItem(item, { executeCommand });
        expect(executeCommand).toHaveBeenCalledWith(CommandId.FILE_CREATE_PROJECT, undefined);
    });

    it('runs closeWindow for quit role', () => {
        const closeWindow = jest.fn();
        const item: ResolvedMenuItem = {
            id: 'quit',
            label: 'Exit',
            kind: MenuItemKind.Role,
            enabled: true,
            activation: { role: MenuItemRole.Quit },
        };
        activateMenuItem(item, { executeCommand: jest.fn(), closeWindow });
        expect(closeWindow).toHaveBeenCalled();
    });

    it('skips disabled items', () => {
        const executeCommand = jest.fn();
        const item: ResolvedMenuItem = {
            id: 'load',
            label: 'Load',
            kind: MenuItemKind.Command,
            enabled: false,
            activation: { commandId: CommandId.FILE_LOAD_ZKO },
        };
        activateMenuItem(item, { executeCommand });
        expect(executeCommand).not.toHaveBeenCalled();
    });

    it('skips separators', () => {
        const executeCommand = jest.fn();
        const item: ResolvedMenuItem = {
            id: 'sep',
            label: '',
            kind: MenuItemKind.Separator,
            enabled: false,
        };
        activateMenuItem(item, { executeCommand });
        expect(executeCommand).not.toHaveBeenCalled();
    });
});
