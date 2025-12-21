import React, { use, useEffect } from 'react';
import { ZernikalosViewer } from '@/components/ZernikalosViewer';
import { NestEditorContext, type NestEditorContextType } from '../providers/NestEditorContext.tsx';
import { editorLogger } from '../editorLogger';

export const EditorViewer: React.FC = () => {
    const editorContext = use(NestEditorContext) as NestEditorContextType;

    if (!editorContext) {
        return null;
    }

    const { zkResult, regenerateZko } = editorContext;

    // Regenerate proto when zkResult changes (by filePath)
    useEffect(() => {
        if (zkResult) {
            editorLogger.debug('🔄 Regenerating proto for viewer...');
            regenerateZko();
        }
    }, [zkResult?.filePath, regenerateZko]);

    return (
        <div className="h-full w-full">
            <ZernikalosViewer
                sceneData={zkResult?.proto || null}
                width="100%"
                height="100%"
                onError={(error) => {
                    editorLogger.error('Zernikalos viewer error', {
                        filePath: zkResult?.filePath,
                        error,
                    });
                }}
            />
        </div>
    );
};

