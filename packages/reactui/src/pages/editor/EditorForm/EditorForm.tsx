import React from 'react';
import { FormZObject } from './FormZObject';
import { useNestEditorContext } from '../providers/NestEditorContext';

export const EditorForm: React.FC = () => {
    const { selectedZObject, zkResult, tree } = useNestEditorContext();

    // Determine the current state
    const isProjectLoaded = zkResult !== null;
    const hasNodes = tree.length > 0;
    const hasSelectedNode = selectedZObject !== null;

    const renderContent = () => {
        if (!isProjectLoaded) {
            return (
                <div className="flex h-full items-center justify-center p-6">
                    <div className="text-center">
                        <span className="font-semibold text-gray-600">
                            Import a project to start editing
                        </span>
                        <p className="text-sm text-gray-500 mt-2">
                            Import a 3D file from the file menu
                        </p>
                    </div>
                </div>
            );
        }

        if (!hasNodes) {
            return (
                <div className="flex h-full items-center justify-center p-6">
                    <div className="text-center">
                        <span className="font-semibold text-gray-600">
                            No objects found in project
                        </span>
                        <p className="text-sm text-gray-500 mt-2">
                            The project appears to be empty or corrupted
                        </p>
                    </div>
                </div>
            );
        }

        if (!hasSelectedNode) {
            return (
                <div className="flex h-full items-center justify-center p-6">
                    <div className="text-center">
                        <span className="font-semibold text-gray-600">
                            Select a node to open form
                        </span>
                        <p className="text-sm text-gray-500 mt-2">
                            Choose an object from the tree to edit its properties
                        </p>
                    </div>
                </div>
            );
        }

        return (
            <div className="p-6 border-t">
                <FormZObject 
                    zObject={selectedZObject}
                />
            </div>
        );
    };

    return (
        <div className="w-full h-full">
            {renderContent()}
        </div>
    );
};
