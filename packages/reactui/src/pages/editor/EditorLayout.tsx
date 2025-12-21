import React from 'react';

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
    const {
        tree,
        selectedIds,
        handleSelect,
    } = useNestEditorContext();
    
    return (
        <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={25}>
                <ScrollArea className="h-full">
                    <TreeView
                        className="h-full"
                        data={tree}
                        selectedIds={selectedIds}
                        onSelect={handleSelect}
                    />
                </ScrollArea>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={75} className="flex flex-col">
                <EditorTopBar
                    className="border-b flex-shrink-0"
                />
                <EditorMainPanel />
            </ResizablePanel>
        </ResizablePanelGroup>
    );
};
