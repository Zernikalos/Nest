import { ContextKeyService } from './ContextKeyService';

describe('ContextKeyService', () => {
    it('sets and gets values', () => {
        const service = new ContextKeyService();
        service.set('key1', 'value1');
        service.set('key2', true);
        expect(service.get('key1')).toBe('value1');
        expect(service.get('key2')).toBe(true);
    });

    it('evaluates bool keys', () => {
        const service = new ContextKeyService();
        service.set('hasSelection', true);
        expect(service.getBool('hasSelection')).toBe(true);
        service.set('hasSelection', false);
        expect(service.getBool('hasSelection')).toBe(false);
    });

    it('evaluates expressions', () => {
        const service = new ContextKeyService();
        service.set('editorFocus', true);
        expect(service.evaluate('editorFocus')).toBe(true);
        expect(service.evaluate('!editorFocus')).toBe(false);
    });

    it('clears context', () => {
        const service = new ContextKeyService();
        service.set('key1', 'value1');
        service.clear();
        expect(service.get('key1')).toBeUndefined();
    });
});
