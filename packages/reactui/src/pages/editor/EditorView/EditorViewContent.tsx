import React, { useEffect } from 'react';
import { FormZObject } from '../EditorForm/FormZObject';
import { TextEditor } from '../TextEditor/TextEditor';
import { ZernikalosViewer } from '@/components/ZernikalosViewer';
import { useNestEditorContext } from '../providers/NestEditorContext';

interface EditorViewContentProps {
    activeView: 'form' | 'code' | 'viewer';
}

export const EditorViewContent: React.FC<EditorViewContentProps> = ({ activeView }) => {
    const { selectedZObject, zkResult, rebuildZkResult } = useNestEditorContext();

    // Regenerate proto when entering viewer
    useEffect(() => {
        if (activeView === 'viewer' && zkResult) {
            console.log('🔄 Regenerating proto for viewer...')
            rebuildZkResult()
        }
    }, [activeView]) // Solo depende de activeView, no de zkResult

    // Check if views can be displayed
    const canShowForm = selectedZObject;
    const canShowCode = zkResult?.exported;
    const canShowViewer = true; // Viewer always available

    // If no view can be shown at all, display appropriate message
    if (!canShowForm && !canShowCode && !canShowViewer) {
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
                <div className="w-full h-full">
                    {canShowForm ? (
                        <div className="p-6 border-t">
                            <FormZObject 
                                zObject={selectedZObject}
                            />
                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-center p-6">
                            <span className="font-semibold">
                                Select a node to open form
                            </span>
                        </div>
                    )}
                </div>
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


