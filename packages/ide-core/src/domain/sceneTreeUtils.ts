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

/**
 * Finds a ZObject in the tree by refId (node id in scene tree = refId). Depth-first.
 * Returns null if not found.
 */
export function findZObjectById(
    root: ZObjectLike | undefined | null,
    refId: string
): ZObjectLike | null {
    if (!root) return null;
    if (root.refId === refId) return root;
    for (const child of root.children ?? []) {
        const found = findZObjectById(child, refId);
        if (found) return found;
    }
    return null;
}
