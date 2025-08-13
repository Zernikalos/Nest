import React, { useMemo, useState } from 'react';

import TabList from '@/components/tablist/TabList';
import { TreeView, type TreeNode } from '@/components/treeview';
import ViewToggle from '@/components/ViewToggle';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useZkProject } from '@/providers/ZkProject';
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
    const { zkResult } = useZkProject();
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
    const selectedZObject = activeNode ? findZObjectById(zkResult?.zko?.root, activeNode) : null;

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
                        <div className="flex items-center max-h-8 ">
                            <TabList
                                className="flex-1"
                                showBorder={false}
                                openTabs={openedNodes}
                                activeTab={activeNode}
                                onTabChange={handleTabChange}
                                onTabClose={handleTabClose}
                            />
                            <div className="flex items-center px-4">
                                <ViewToggle
                                    activeView={activeView}
                                    onViewChange={setActiveView}
                                />
                            </div>
                        </div>
                        {selectedZObject && (
                            <div className="flex-1 overflow-auto">
                                {activeView === 'form' ? (
                                    <div className="p-6 border-t">
                                        <FormZObject 
                                            zObject={selectedZObject}
                                            onNameChange={(newName) => {
                                                selectedZObject.name = newName;
                                                setTreeUpdateTrigger(prev => prev + 1);
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="p-6 border-t">
                                        <div className="bg-muted rounded-lg p-4">
                                            <h3 className="text-lg font-semibold mb-3">Code View</h3>
                                            <pre className="bg-background p-4 rounded border overflow-auto text-sm">
                                                <code>{JSON.stringify(zkResult?.exported, null, 2)}</code>
                                            </pre>
                                        </div>
                                    </div>
                                )}
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
