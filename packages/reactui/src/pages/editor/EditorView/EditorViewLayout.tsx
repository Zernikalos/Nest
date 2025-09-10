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
import { ScrollArea } from '@/components/ui/scroll-area';

export const EditorViewLayout: React.FC = () => {
    const [activeView, setActiveView] = useState<'form' | 'code' | 'viewer'>('form');
    
    const {
        tree,
        selectedIds,
        handleSelect,
    } = useNestEditorContext();
    
    return (
        <ResizablePanelGroup direction="horizontal" className="h-screen w-full">
            <ResizablePanel defaultSize={25} className="h-screen">
                <ScrollArea className="relative w-full h-screen">
                    <TreeView
                        className="w-full h-full"
                        data={tree}
                        selectedIds={selectedIds}
                        onSelect={handleSelect}
                    />
                </ScrollArea>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={75}>
                <div className="flex flex-col h-screen">
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
