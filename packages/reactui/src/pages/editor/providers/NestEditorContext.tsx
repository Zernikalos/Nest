import { createContext } from 'react';
import { type NestInternalEditorState } from './hooks/useNestInternalEditorState';
import type { ZkResultExtended } from '@/types/project';

// Extend the internal editor state to include zkResult
interface NestEditorContextType extends NestInternalEditorState {
    zkResult: ZkResultExtended | null;
    regenerateZko: () => Promise<void>;
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
export type { NestEditorContextType };
