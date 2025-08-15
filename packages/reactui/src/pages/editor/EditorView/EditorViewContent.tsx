import React from 'react';
import FormZObject from '../forms/FormZObject';
import MonacoEditor from '../../../components/MonacoEditor';
import { zernikalos } from '@zernikalos/zernikalos';

interface EditorViewContentProps {
    selectedZObject: zernikalos.objects.ZObject | null;
    activeView: 'form' | 'code';
    zkResult: any;
}

const EditorViewContent: React.FC<EditorViewContentProps> = ({
    selectedZObject,
    activeView,
    zkResult,
}) => {
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
            ) : (
                <MonacoEditor
                    value={JSON.stringify(zkResult?.exported, null, 2)}
                    language="json"
                    height="100%"
                    readOnly={true}
                    theme="vs-dark"
                />
            )}
        </div>
    );
};

export default EditorViewContent;
