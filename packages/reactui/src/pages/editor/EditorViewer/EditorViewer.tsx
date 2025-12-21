import React, { useEffect } from 'react';
import { ZernikalosViewer } from '@/components/ZernikalosViewer';
import { useNestEditorContext } from '../providers';

export const EditorViewer: React.FC = () => {
    const { zkResult, regenerateZko } = useNestEditorContext();

    // Regenerate proto when zkResult changes (by filePath)
    useEffect(() => {
        if (zkResult) {
            console.log('🔄 Regenerating proto for viewer...', zkResult.filePath);
            regenerateZko();
        }
    }, [zkResult?.filePath, regenerateZko]);

    return (
        <div className="h-full w-full">
            <ZernikalosViewer
                sceneData={zkResult?.proto || null}
                width="100%"
                height="100%"
                onError={(error) => console.error('Zernikalos viewer error:', error)}
            />
        </div>
    );
};

