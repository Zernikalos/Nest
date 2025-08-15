import React, { useState } from 'react';

import { TreeView } from '@/components/treeview';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useZkProjectStore } from '@/stores';
import { useNestEditorState } from '../hooks/useNestEditorState';
import EditorViewTopBar from './EditorViewTopBar';
import EditorViewContent from './EditorViewContent';

export const EditorView: React.FC = () => {
    const zkResult = useZkProjectStore(state => state.zkResult);
    const [activeView, setActiveView] = useState<'form' | 'code'>('form');
    
    // Use custom hook for editor state management
    const {
        tree,
        selectedIds,
        openedNodes,
        activeNode,
        selectedZObject,
        handleSelect,
        handleTabChange,
        handleTabClose,
    } = useNestEditorState({ 
        root: zkResult?.zko?.root 
    });

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
                {openedNodes.length > 0 ? (
                    <div className="flex flex-col h-full">
                        <EditorViewTopBar
                            openedNodes={openedNodes}
                            activeNode={activeNode}
                            activeView={activeView}
                            onTabChange={handleTabChange}
                            onTabClose={handleTabClose}
                            onViewChange={setActiveView}
                        />
                        <EditorViewContent
                            selectedZObject={selectedZObject}
                            activeView={activeView}
                            zkResult={zkResult}
                        />
                    </div>
                ) : (
                    <div className="flex h-full items-center justify-center p-6">
                        <span className="font-semibold">
                            Select a node to open
                        </span>
                    </div>
                )}
            </ResizablePanel>
        </ResizablePanelGroup>
    );
};
