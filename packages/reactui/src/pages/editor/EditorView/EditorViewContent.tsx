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
            {/* Form View - Always mounted, hidden when not active */}
            <div 
                className="w-full h-full"
                style={{ display: activeView === 'form' ? 'block' : 'none' }}
            >
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
            
            {/* Code View - Always mounted, hidden when not active */}
            <div 
                className="w-full h-full"
                style={{ display: activeView === 'code' ? 'block' : 'none' }}
            >
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
            
            {/* Viewer - Always mounted, hidden when not active using visibility */}
            <div 
                className="w-full h-full absolute inset-0"
                style={{ 
                    visibility: activeView === 'viewer' ? 'visible' : 'hidden',
                    display: 'block' // Always keep it in the layout
                }}
            >
                <ZernikalosViewer
                    sceneData={zkResult?.proto || null}
                    width="100%"
                    height="100%"
                    onError={(error) => console.error('Zernikalos viewer error:', error)}
                />
            </div>
        </div>
    );
};


