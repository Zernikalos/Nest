import React, { useMemo, useState } from 'react';

import { TreeView, type TreeNode } from '@/components/treeview';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useZkProjectStore } from '@/stores';
import { zernikalos } from '@zernikalos/zernikalos';
import { useEditorState } from '../hooks/useEditorState';
import EditorViewTopBar from './EditorViewTopBar';
import EditorViewContent from './EditorViewContent';

function convertZObjectToTreeNode(zObject: zernikalos.objects.ZObject): TreeNode {
    return {
        id: zObject.refId,
        label: zObject.name,
        children: zObject.children?.map((child: any) => convertZObjectToTreeNode(child)) || []
    };
}

export const EditorView: React.FC = () => {
    const zkResult = useZkProjectStore(state => state.zkResult);
    const [treeUpdateTrigger, setTreeUpdateTrigger] = useState(0);
    const [activeView, setActiveView] = useState<'form' | 'code'>('form');
    
    // Build tree from parsed data
    const tree = useMemo(() => {
        if (zkResult?.zko?.root) {
            return [convertZObjectToTreeNode(zkResult.zko.root)];
        }
        return [];
    }, [zkResult, treeUpdateTrigger]);

    // Use custom hook for editor state management
    const {
        selectedIds,
        openedNodes,
        activeNode,
        handleSelect,
        handleTabChange,
        handleTabClose,
    } = useEditorState({ tree });

    // Find ZObject by refId
    const findZObjectById = (zObject: zernikalos.objects.ZObject | undefined, refId?: string): zernikalos.objects.ZObject | null => {
        if (!zObject || !refId) return null;
        
        if (zObject.refId === refId) return zObject;
        
        for (const child of zObject.children || []) {
            const found = findZObjectById(child, refId);
            if (found) return found;
        }
        
        return null;
    };

    // Get selected ZObject based on active node
    const selectedZObject = activeNode ? findZObjectById(zkResult?.zko?.root, activeNode) : null;

    const handleNameChange = (newName: string) => {
        if (selectedZObject) {
            selectedZObject.name = newName;
            setTreeUpdateTrigger(prev => prev + 1);
        }
    };

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
                            onNameChange={handleNameChange}
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
