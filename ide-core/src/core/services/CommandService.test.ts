import { CommandService } from './CommandService';

describe('CommandService', () => {
    it('registers and executes commands', () => {
        const service = new CommandService();
        const handler = jest.fn().mockReturnValue([{ type: 'EFFECT', payload: {} }]);
        service.register('test.cmd', handler);
        const effects = service.execute('test.cmd');
        expect(handler).toHaveBeenCalled();
        expect(effects).toHaveLength(1);
        expect(effects[0].type).toBe('EFFECT');
    });

    it('returns empty array for unknown command', () => {
        const service = new CommandService();
        expect(service.execute('unknown')).toEqual([]);
    });

    it('invokes onAfterExecute when provided', () => {
        const onAfterExecute = jest.fn();
        const service = new CommandService(onAfterExecute);
        service.register('test.cmd', () => []);
        service.execute('test.cmd');
        expect(onAfterExecute).toHaveBeenCalled();
    });

    it('unregisters commands', () => {
        const service = new CommandService();
        service.register('test.cmd', () => []);
        expect(service.has('test.cmd')).toBe(true);
        service.unregister('test.cmd');
        expect(service.has('test.cmd')).toBe(false);
        expect(service.execute('test.cmd')).toEqual([]);
    });
});
