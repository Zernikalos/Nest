import { MockStoragePort } from './MockStoragePort';

describe('MockStoragePort', () => {
    it('stores and retrieves values', async () => {
        const port = new MockStoragePort();
        await port.set('key1', 'value1');
        expect(await port.get('key1')).toBe('value1');
        expect(await port.get('missing')).toBeNull();
    });

    it('deletes values', async () => {
        const port = new MockStoragePort();
        await port.set('key1', 'value1');
        await port.delete('key1');
        expect(await port.get('key1')).toBeNull();
    });

    it('clears all values', async () => {
        const port = new MockStoragePort();
        await port.set('key1', 'value1');
        await port.set('key2', 'value2');
        port.clear();
        expect(await port.get('key1')).toBeNull();
        expect(await port.get('key2')).toBeNull();
    });
});
