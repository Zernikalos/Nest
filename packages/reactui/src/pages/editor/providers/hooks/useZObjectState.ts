import { useMemo } from 'react';
import { zernikalos } from '@/lib/zernikalos';
import { findZObjectById } from './utils';

interface UseZObjectStateProps {
    root: zernikalos.objects.ZObject | undefined;
    activeNode: string | null;
}

export function useZObjectState({ root, activeNode }: UseZObjectStateProps) {
    const selectedZObject = useMemo(() => {
        if (!activeNode || !root) return null;
        return findZObjectById(root, activeNode);
    }, [activeNode, root]);

    return { selectedZObject };
}
