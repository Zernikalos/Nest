import React from 'react';
import { FormZObject } from '../forms/FormZObject';
import MonacoEditor from '../../../components/MonacoEditor';
import { ZernikalosViewer } from '../../../components/ZernikalosViewer';
import { useNestEditorContext } from '../providers/NestEditorContext';

interface EditorViewContentProps {
    activeView: 'form' | 'code' | 'viewer';
}

export const EditorViewContent: React.FC<EditorViewContentProps> = ({ activeView }) => {
    const { selectedZObject, zkResult } = useNestEditorContext();

    if (!selectedZObject) {
        return (
            <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">
                    Select a node to open
                </span>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-auto">
            {activeView === 'form' ? (
                <div className="p-6 border-t">
                    <FormZObject 
                        zObject={selectedZObject}
                    />
                </div>
            ) : activeView === 'code' ? (
                <MonacoEditor
                    value={JSON.stringify(zkResult?.exported, null, 2)}
                    language="json"
                    height="100%"
                    readOnly={true}
                    theme="vs-dark"
                />
            ) : (
                <div className="w-full h-full">
                    <ZernikalosViewer
                        sceneData={zkResult?.proto || null}
                        width="100%"
                        height="100%"
                        onReady={() => console.log('Zernikalos viewer ready!')}
                        onError={(error) => console.error('Zernikalos viewer error:', error)}
                    />
                </div>
            )}
        </div>
    );
};


