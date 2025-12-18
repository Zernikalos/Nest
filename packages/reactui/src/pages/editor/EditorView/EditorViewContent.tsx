import React, { useEffect } from 'react';
import { EditorForm } from '../EditorForm';
import { TextEditor } from '../TextEditor/TextEditor';
import { ZernikalosViewer } from '@/components/ZernikalosViewer';
import { useNestEditorContext } from '../providers/NestEditorContext';

interface EditorViewContentProps {
    activeView: 'form' | 'code' | 'viewer';
}

export const EditorViewContent: React.FC<EditorViewContentProps> = ({ activeView }) => {
    const { zkResult, regenerateZko } = useNestEditorContext();

    // Regenerate proto when entering viewer or when zkResult changes (by filePath)
    useEffect(() => {
        if (activeView === 'viewer' && zkResult) {
            console.log('🔄 Regenerating proto for viewer...', zkResult.filePath)
            regenerateZko()
        }
    }, [activeView, zkResult?.filePath, regenerateZko]) // Use filePath to detect ZKO changes without causing loops

    // Check if views can be displayed
    const canShowCode = zkResult?.exported;
    const canShowViewer = true; // Viewer always available

    // If no view can be shown at all, display appropriate message
    if (!canShowCode && !canShowViewer) {
        return (
            <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">
                    No data available to display
                </span>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-auto relative">
            {(activeView === "form") && (
                <EditorForm />
            )}

            {(activeView === 'code') && (
                <div className="w-full h-full">
                    <TextEditor />
                </div>
            )}
            
            {(activeView === 'viewer') && (
                <div className="w-full h-full absolute inset-0">
                    <ZernikalosViewer
                        sceneData={zkResult?.proto || null}
                        width="100%"
                        height="100%"
                        onError={(error) => console.error('Zernikalos viewer error:', error)}
                    />
                </div>
            )}
        </div>
    );
};


