import React from 'react';
import { FormZObject } from '../forms/FormZObject';
import { MonacoEditor } from '@/components/MonacoEditor';
import { ZernikalosViewer } from '@/components/ZernikalosViewer';
import { useNestEditorContext } from '../providers/NestEditorContext';
import { useAppTheme } from '@/providers/Theme';

interface EditorViewContentProps {
    activeView: 'form' | 'code' | 'viewer';
}

export const EditorViewContent: React.FC<EditorViewContentProps> = ({ activeView }) => {
    const { selectedZObject, zkResult } = useNestEditorContext();
    const { theme: appTheme } = useAppTheme();

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
            {/* Form View - Lazy mount to preserve state */}
            {activeView === 'form' && (
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
            
            {/* Code View - Lazy mount to preserve state */}
            {activeView === 'code' && (
                <div className="w-full h-full">
                    {canShowCode ? (
                        <MonacoEditor
                            value={JSON.stringify(zkResult?.exported, null, 2)}
                            language="json"
                            height="100%"
                            readOnly={true}
                            theme={appTheme}
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center p-6">
                            <span className="font-semibold">
                                No data available to display
                            </span>
                        </div>
                    )}
                </div>
            )}
            
            {/* Viewer - Lazy mount to preserve state */}
            {activeView === 'viewer' && (
                <div className="w-full h-full">
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


