import { EffectCaller } from './EffectCaller';

describe('EffectCaller', () => {
    it('runs registered handlers by effect type', async () => {
        const caller = new EffectCaller();
        const handled: string[] = [];
        caller.register('test/effect', (effect) => {
            handled.push(effect.type);
        });
        await caller.run([{ type: 'test/effect' }, { type: 'unknown/effect' }]);
        expect(handled).toEqual(['test/effect']);
    });

    it('unregister removes handler', async () => {
        const caller = new EffectCaller();
        let count = 0;
        caller.register('test/effect', () => {
            count++;
        });
        caller.unregister('test/effect');
        await caller.run([{ type: 'test/effect' }]);
        expect(count).toBe(0);
    });
});
