import { zernikalos } from '@/lib/zernikalos';

// Pure function to find ZObject by refId
export function findZObjectById(root: zernikalos.objects.ZObject, refId: string): zernikalos.objects.ZObject | null {
    if (root.refId === refId) return root;
    
    for (const child of root.children || []) {
        const found = findZObjectById(child, refId);
        if (found) return found;
    }
    
    return null;
}
