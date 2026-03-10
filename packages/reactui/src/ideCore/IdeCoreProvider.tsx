import React, { useRef } from 'react';
import { IdeCoreContext } from './IdeCoreContext';
import { createEditorRuntime } from './createEditorRuntime';
import { createLocalStorageStoragePort } from './storageAdapter';

interface IdeCoreProviderProps {
    children: React.ReactNode;
}

export const IdeCoreProvider: React.FC<IdeCoreProviderProps> = ({ children }) => {
    const runtimeRef = useRef<ReturnType<typeof createEditorRuntime> | null>(null);
    if (!runtimeRef.current) {
        runtimeRef.current = createEditorRuntime({
            storage: createLocalStorageStoragePort(),
        });
    }
    const runtime = runtimeRef.current;

    return (
        <IdeCoreContext.Provider value={runtime}>
            {children}
        </IdeCoreContext.Provider>
    );
};
