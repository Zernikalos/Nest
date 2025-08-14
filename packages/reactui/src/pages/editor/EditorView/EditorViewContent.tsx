import React from 'react';
import FormZObject from '../forms/FormZObject';
import { zernikalos } from '@zernikalos/zernikalos';

interface EditorViewContentProps {
    selectedZObject: zernikalos.objects.ZObject | null;
    activeView: 'form' | 'code';
    zkResult: any;
    onNameChange: (newName: string) => void;
}

const EditorViewContent: React.FC<EditorViewContentProps> = ({
    selectedZObject,
    activeView,
    zkResult,
    onNameChange,
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
                        onNameChange={onNameChange}
                    />
                </div>
            ) : (
                <div className="p-6 border-t">
                    <div className="bg-muted rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-3">Code View</h3>
                        <pre className="bg-background p-4 rounded border overflow-auto text-sm">
                            <code>{JSON.stringify(zkResult?.exported, null, 2)}</code>
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditorViewContent;
