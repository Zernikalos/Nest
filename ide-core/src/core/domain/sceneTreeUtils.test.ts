import { convertZObjectToTreeNode } from './sceneTreeUtils.js';

describe('convertZObjectToTreeNode', () => {
    it('converts ZObject-like to TreeNode', () => {
        const zobj = {
            refId: 'root',
            name: 'Scene',
            type: 'SCENE',
            children: [
                { refId: 'c1', name: 'Model', type: 'MODEL', children: [] },
            ],
        };
        const node = convertZObjectToTreeNode(zobj);
        expect(node.id).toBe('root');
        expect(node.label).toBe('Scene');
        expect(node.iconType).toBe('SCENE');
        expect(node.children).toHaveLength(1);
        expect(node.children![0].id).toBe('c1');
    });

    it('normalizes Kotlin-style enum type objects to icon strings', () => {
        const zobj = {
            refId: 'm1',
            name: 'Fox',
            type: { name: 'MODEL' },
            children: [],
        };
        const node = convertZObjectToTreeNode(zobj);
        expect(node.iconType).toBe('MODEL');
    });
});
