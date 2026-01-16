import React, { use, useEffect, useCallback, useMemo, useRef } from 'react';
import { ZernikalosViewer } from '@/components/ZernikalosViewer';
import { NestEditorContext, type NestEditorContextType } from '../providers/NestEditorContext.tsx';
import { editorLogger } from '../editorLogger';

export const EditorViewer: React.FC = () => {
    const editorContext = use(NestEditorContext) as NestEditorContextType;
    const previousFilePathRef = useRef<string | null>(null);

    if (!editorContext) {
        return null;
    }

    const { zkResult, regenerateZko } = editorContext;

    // Memoize sceneData based on zko reference to prevent unnecessary re-renders
    const sceneData = useMemo(() => {
        return zkResult?.proto || null
    }, [zkResult?.zko, zkResult?.proto])

    // Memoize onError callback to prevent recreating on each render
    const handleError = useCallback((error: Error) => {
        editorLogger.error('Zernikalos viewer error', {
            filePath: zkResult?.filePath,
            error,
        });
    }, [zkResult?.filePath]);

    // Regenerate proto only when filePath actually changes
    useEffect(() => {
        const currentFilePath = zkResult?.filePath;
        if (currentFilePath && currentFilePath !== previousFilePathRef.current) {
            previousFilePathRef.current = currentFilePath;
            editorLogger.debug('🔄 Regenerating proto for viewer...');
            regenerateZko();
        }
    }, [zkResult?.filePath, regenerateZko]);

    return (
        <div className="h-full w-full">
            <ZernikalosViewer
                sceneData={sceneData}
                width="100%"
                height="100%"
                onError={handleError}
            />
        </div>
    );
};

