import React, { useState } from 'react';

import { TreeView } from '@/components/treeview';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable';
import { SidebarProvider } from '@/components/ui/sidebar';
import { EditorViewTopBar } from './EditorViewTopBar';
import { EditorViewContent } from './EditorViewContent';
import { useNestEditorContext } from '../providers/NestEditorContext';

export const EditorViewLayout: React.FC = () => {
    const [activeView, setActiveView] = useState<'form' | 'code'>('form');
    
    const {
        tree,
        selectedIds,
        handleSelect,
    } = useNestEditorContext();
    
    return (
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
            <ResizablePanel defaultSize={25}>
                <SidebarProvider className="relative w-full">
                    <TreeView
                        className="w-full"
                        data={tree}
                        selectedIds={selectedIds}
                        onSelect={handleSelect}
                    />
                </SidebarProvider>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={75}>
                <div className="flex flex-col h-full">
                    <EditorViewTopBar
                        activeView={activeView}
                        onViewChange={setActiveView}
                    />
                    <EditorViewContent activeView={activeView} />
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
};
