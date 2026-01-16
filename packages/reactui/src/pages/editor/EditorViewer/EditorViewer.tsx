import React, { use, useEffect, useCallback, useMemo } from 'react';
import { ZernikalosViewer } from '@/components/ZernikalosViewer';
import { NestEditorContext, type NestEditorContextType } from '../providers/NestEditorContext.tsx';
import { editorLogger } from '../editorLogger';

export const EditorViewer: React.FC = () => {
    const editorContext = use(NestEditorContext) as NestEditorContextType;

    if (!editorContext) {
        return null;
    }

    const { zkResult, regenerateZko } = editorContext;

    // Memoize onError callback to prevent recreating on each render
    const handleError = useCallback((error: Error) => {
        editorLogger.error('Zernikalos viewer error', {
            filePath: zkResult?.filePath,
            error,
        });
    }, [zkResult?.filePath]);

    // Regenerate proto when zkResult filePath changes (not regenerateZko to avoid infinite loop)
    useEffect(() => {
        if (zkResult?.filePath) {
            editorLogger.debug('🔄 Regenerating proto for viewer...');
            regenerateZko();
        }
    }, [zkResult?.filePath]);

    return (
        <div className="h-full w-full">
            <ZernikalosViewer
                sceneData={zkResult?.proto || null}
                width="100%"
                height="100%"
                onError={handleError}
            />
        </div>
    );
};

