import type { TreeNode } from '@/components/treeview';
import { zernikalos } from '@/lib/zernikalos';
import { ObjectTypeIcon } from '../../components/ObjectTypeIcon';
import React from 'react';

// Convert ZObject to TreeNode
export function convertZObjectToTreeNode(zObject: zernikalos.objects.ZObject): TreeNode {
    return {
        id: zObject.refId,
        label: zObject.name,
        icon: React.createElement(ObjectTypeIcon, { type: zObject.type as any, size: 16 }),
        children: zObject.children?.map((child: any) => convertZObjectToTreeNode(child)) || []
    };
}

// Pure function to find TreeNode by id
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

// Pure function to find ZObject by refId
export function findZObjectById(root: zernikalos.objects.ZObject, refId: string): zernikalos.objects.ZObject | null {
    if (root.refId === refId) return root;
    
    for (const child of root.children || []) {
        const found = findZObjectById(child, refId);
        if (found) return found;
    }
    
    return null;
}
