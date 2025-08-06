import React, { useMemo, useState } from 'react';

import TabList from '@/components/tablist/TabList';
import { TreeView, type TreeNode } from '@/components/treeview';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useFileImportWorkflow } from '@/hooks/useFileImportWorkflow';
import {zernikalos} from '@zernikalos/zernikalos';
import FormZObject from './forms/FormZObject';
import { useEditorState } from './hooks/useEditorState';

function convertZObjectToTreeNode(zObject: zernikalos.objects.ZObject): TreeNode {
    return {
        id: zObject.refId,
        label: zObject.name,
        children: zObject.children?.map((child: any) => convertZObjectToTreeNode(child)) || []
    };
}

const EditorView: React.FC = () => {
    const { parsedData } = useFileImportWorkflow();
    const [treeUpdateTrigger, setTreeUpdateTrigger] = useState(0);
    
    // Build tree from parsed data
    const tree = useMemo(() => {
        if (parsedData?.root) {
            return [convertZObjectToTreeNode(parsedData.root)];
        }
        return [];
    }, [parsedData, treeUpdateTrigger]);

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
    const findZObjectById = (zObject: zernikalos.objects.ZObject | undefined, refId?: string): zernikalos.objects.ZObject | undefined => {
        if (!zObject || !refId) return undefined;
        
        if (zObject.refId === refId) return zObject;
        
        for (const child of zObject.children || []) {
            const found = findZObjectById(child, refId);
            if (found) return found;
        }
        
        return undefined;
    };

    // Get selected ZObject based on active node
    const selectedZObject = activeNode ? findZObjectById(parsedData?.root, activeNode) : null;

    // Update tree when trigger changes
    const treeWithTrigger = useMemo(() => {
        return tree;
    }, [tree, setTreeUpdateTrigger]);

    return (
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
            <ResizablePanel defaultSize={25}>
                <SidebarProvider className="relative w-full">
                    <TreeView
                        className="w-full"
                        data={treeWithTrigger}
                        selectedIds={selectedIds}
                        onSelect={handleSelect}
                    />
                </SidebarProvider>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={75}>
                {openedNodes.length > 0 ? (
                    <div className="flex flex-col h-full">
                        <TabList
                            className="w-full"
                            openTabs={openedNodes}
                            activeTab={activeNode}
                            onTabChange={handleTabChange}
                            onTabClose={handleTabClose}
                        />
                        {selectedZObject && (
                            <div className="p-6 border-t">
                                <FormZObject 
                                    zObject={selectedZObject}
                                    onNameChange={(newName) => {
                                        selectedZObject.name = newName;
                                        setTreeUpdateTrigger(prev => prev + 1);
                                    }}
                                />
                            </div>
                        )}
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

export default EditorView;
