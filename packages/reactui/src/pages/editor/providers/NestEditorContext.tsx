import { createContext } from 'react';
import type { TreeNode } from '@/components/treeview';
import type { ZkResultExtended } from '@/types/project';
import type { zernikalos } from '@/lib/zernikalos';

export interface NestEditorContextType {
    tree: TreeNode[];
    selectedIds: string[];
    openedNodes: TreeNode[];
    activeNode: string | null;
    selectedZObject: zernikalos.objects.ZObject | null;
    handleSelect: (ids: string[]) => void;
    handleTabChange: (nodeId: string) => void;
    handleTabClose: (nodeId: string) => void;
    notifyChange: () => void;
    zkResult: ZkResultExtended | null;
    regenerateZko: () => Promise<ZkResultExtended>;
}

const NestEditorContext = createContext<NestEditorContextType | undefined>(undefined);

// export const useNestEditorContext = () => {
//     const context = useContext(NestEditorContext);
//     if (context === undefined) {
//         throw new Error('useNestEditorContext must be used within a NestEditorProvider');
//     }
//     return context;
// };

export { NestEditorContext };
