import React from 'react';
import { FormZObject } from './FormZObject';
import { useNestEditorContext } from '../providers/NestEditorContext';

interface EmptyStateProps {
    title: string;
    description: string;
    fullHeight?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description }) => {
    return (
        <div className="flex h-full items-center justify-center p-6">
            <div className="text-center">
                <span className="font-semibold text-gray-600">
                    {title}
                </span>
                <p className="text-sm text-gray-500 mt-2">
                    {description}
                </p>
            </div>
        </div>
    );
};

export const EditorForm: React.FC = () => {
    const { selectedZObject, zkResult, tree } = useNestEditorContext();

    // Determine the current state
    const isProjectLoaded = zkResult !== null;
    const hasNodes = tree.length > 0;
    const hasSelectedNode = selectedZObject !== null;

    const renderContent = () => {
        if (!isProjectLoaded) {
            return (
                <EmptyState
                    title="Import a project to start editing"
                    description="Import a 3D file from the file menu"
                />
            );
        }

        if (!hasNodes) {
            return (
                <EmptyState
                    title="No objects found in project"
                    description="The project appears to be empty"
                />
            );
        }

        if (!hasSelectedNode) {
            return (
                <EmptyState
                    title="Select a node to open form"
                    description="Choose an object from the tree to edit its properties"
                />
            );
        }

        return (
            <div className="p-6">
                <FormZObject 
                    zObject={selectedZObject}
                />
            </div>
        );
    };

    return (
        renderContent()
    );
};
