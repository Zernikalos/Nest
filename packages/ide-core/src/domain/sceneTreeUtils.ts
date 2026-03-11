import type { TreeNode, ZObjectLike } from './types.js';

/**
 * Converts a ZObject-like tree to a TreeNode view model.
 * Icon is represented as a type string; the UI renderer resolves it to an actual icon component.
 */
export function convertZObjectToTreeNode(zObject: ZObjectLike): TreeNode {
    return {
        id: zObject.refId,
        label: zObject.name,
        iconType: zObject.type,
        children: zObject.children?.map((child) => convertZObjectToTreeNode(child)) ?? [],
    };
}

/**
 * Finds a TreeNode by id in a tree (depth-first). Returns undefined if not found.
 */
export function findNodeById(tree: TreeNode[], id: string): TreeNode | undefined {
    for (const node of tree) {
        if (node.id === id) return node;
        if (node.children) {
            const found = findNodeById(node.children, id);
            if (found) return found;
        }
    }
    return undefined;
}
