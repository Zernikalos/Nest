import React from 'react';
import { EditorForm } from './EditorForm';
import { EditorCode } from '@/pages/editor/EditorCode/EditorCode.tsx';
import { EditorViewer } from './EditorViewer/EditorViewer';
import { useNestEditorContext } from '@/pages/editor/providers';

interface EditorMainPanelProps {
    activeView: 'form' | 'code' | 'viewer';
}

export const EditorMainPanel: React.FC<EditorMainPanelProps> = ({ activeView }) => {
    const { zkResult } = useNestEditorContext();

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
        <div className="flex-1 w-full overflow-auto relative">
            {(activeView === "form") && (
                <EditorForm />
            )}

            {(activeView === 'code') && (
                <div className="w-full h-full">
                    <EditorCode />
                </div>
            )}

            {(activeView === 'viewer') && (
                <EditorViewer />
            )}
        </div>
    );
};

