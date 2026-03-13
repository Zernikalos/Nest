import React from 'react';
import { ObjectTypeIcon } from '@/pages/editor/components/ObjectTypeIcon';
import type { TreeNode as CoreTreeNode } from '@ide-core';
import type { TreeNode } from '@/components/treeview';

/**
 * Maps ide-core TreeNode (iconType) to reactui TreeNode (icon: ReactNode).
 * Renderer resolves icon type to actual component.
 */
export function mapTreeNodeToReact(node: CoreTreeNode): TreeNode {
    return {
        id: node.id,
        label: node.label,
        icon: node.iconType
            ? React.createElement(ObjectTypeIcon, {
                  type: node.iconType as Parameters<typeof ObjectTypeIcon>[0]['type'],
                  size: 16,
              })
            : undefined,
        children: node.children?.map(mapTreeNodeToReact),
    };
}

export function mapTreeToReact(nodes: CoreTreeNode[]): TreeNode[] {
    return nodes.map(mapTreeNodeToReact);
}
