import React, { useState } from 'react';

import { TreeView } from '@/components/treeview';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable';
import { EditorTopBar } from './EditorTopBar.tsx';
import { EditorMainPanel } from './EditorMainPanel';
import { useNestEditorContext } from './providers/NestEditorContext';
import { ScrollArea } from '@/components/ui/scroll-area';

export const EditorLayout: React.FC = () => {
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
            <ResizablePanel defaultSize={75} className="flex flex-col">
                <EditorTopBar
                    className="border-b h-8 w-full flex-shrink-0"
                    activeView={activeView}
                    onViewChange={setActiveView}
                />
                <EditorMainPanel activeView={activeView} />
            </ResizablePanel>
        </ResizablePanelGroup>
    );
};
