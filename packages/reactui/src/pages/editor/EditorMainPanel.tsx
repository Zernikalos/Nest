import React from 'react';
import { KeepAliveOutlet } from '@/keepaliverouter';
import { useNestEditorContext } from '@/pages/editor/providers';

export const EditorMainPanel: React.FC = () => {
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
            <KeepAliveOutlet className="h-full overflow-y-auto" />
        </div>
    );
};

