import { useState, useMemo, useCallback } from 'react';
import { convertZObjectToTreeNode } from './utils';
import { zernikalos } from '@/lib/zernikalos';
import type { TreeNode } from '@/components/treeview';

interface UseTreeStateProps {
    root: zernikalos.objects.ZObject | undefined;
}

export function useTreeState({ root }: UseTreeStateProps) {
    const [treeUpdateTrigger, setTreeUpdateTrigger] = useState(0);
    
    const tree = useMemo((): TreeNode[] => {
        if (root) {
            return [convertZObjectToTreeNode(root)];
        }
        return [];
    }, [root, treeUpdateTrigger]);

    const notifyChange = useCallback(() => {
        setTreeUpdateTrigger(prev => prev + 1);
    }, []);

    return { tree, notifyChange };
}
