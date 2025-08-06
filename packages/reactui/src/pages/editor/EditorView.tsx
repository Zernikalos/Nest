import React, { useState, useMemo } from 'react';

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

function convertZObjectToTreeNode(zObject: zernikalos.objects.ZObject): TreeNode {
    return {
        id: zObject.refId,
        label: zObject.name,
        children: zObject.children?.map((child: any) => convertZObjectToTreeNode(child)) || []
    };
}

const EditorView: React.FC = () => {
    const { parsedData } = useFileImportWorkflow();
    
    // Construir el árbol basado en parsedData.root si está disponible
    const tree = useMemo(() => {
        if (parsedData?.root) {
            console.log('🔄 Converting parsed data to tree structure:', parsedData.root);
            return [convertZObjectToTreeNode(parsedData.root)];
        }
        return [];
    }, [parsedData]);

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [openFiles, setOpenFiles] = useState<TreeNode[]>([]);
    const [activeFile, setActiveFile] = useState<string | null>(null);
    const [selectedZObject, setSelectedZObject] = useState<zernikalos.objects.ZObject | null>(null);

    const handleSelect = (ids: string[]) => {
        setSelectedIds(ids);
        const node = findNodeById(tree, ids[ids.length - 1]);
        if (node) {
            if (!openFiles.find(f => f.id === node.id)) {
                setOpenFiles([...openFiles, node]);
            }
            setActiveFile(node.id);
            
            // Find the corresponding ZObject
            const zObject = findZObjectById(parsedData?.root, ids[ids.length - 1]);
            setSelectedZObject(zObject || null);
        }
    };

    const handleMove = (newTree: TreeNode[]) => {
        // Note: Tree movement is disabled when using parsed data
        // setTree(newTree);
    };

    const handleTabChange = (fileId: string) => {
        setActiveFile(fileId);
        
        // Find the corresponding ZObject for the active tab
        const zObject = findZObjectById(parsedData?.root, fileId);
        setSelectedZObject(zObject || null);
    };

    const handleTabClose = (fileId: string) => {
        setOpenFiles(openFiles.filter(f => f.id !== fileId));
        if (activeFile === fileId) {
            const newActiveFile =
                openFiles.length > 1
                    ? openFiles.filter(f => f.id !== fileId)[0]?.id
                    : null;
            setActiveFile(newActiveFile || null);
        }
    };

    const handleNameChange = (newName: string) => {
        if (selectedZObject) {
            selectedZObject.name = newName;
            
            // Update the tree structure to reflect the name change
            const updatedTree = tree.map(node => {
                if (node.id === selectedZObject.refId) {
                    return { ...node, label: newName };
                }
                return updateNodeLabel(node, selectedZObject.refId, newName);
            });
            
            // Force re-render by updating the tree
            setSelectedIds([...selectedIds]);
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
                {openFiles.length > 0 ? (
                    <div className="flex flex-col h-full">
                        <TabList
                            className="w-full"
                            openTabs={openFiles}
                            activeTab={activeFile}
                            onTabChange={handleTabChange}
                            onTabClose={handleTabClose}
                        />
                        {selectedZObject && (
                            <div className="p-6 border-t">
                                <FormZObject 
                                    zObject={selectedZObject}
                                    onNameChange={handleNameChange}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex h-full items-center justify-center p-6">
                        <span className="font-semibold">
                            Select a file to open
                        </span>
                    </div>
                )}
            </ResizablePanel>
        </ResizablePanelGroup>
    );
};

// Utility function to find a node by id
function findNodeById(tree: TreeNode[], id?: string): TreeNode | undefined {
    if (!id) return undefined;
    for (const node of tree) {
        if (node.id === id) return node;
        if (node.children) {
            const found = findNodeById(node.children, id);
            if (found) return found;
        }
    }
    return undefined;
}

// Utility function to find a ZObject by refId
function findZObjectById(zObject: zernikalos.objects.ZObject | undefined, refId?: string): zernikalos.objects.ZObject | undefined {
    if (!zObject || !refId) return undefined;
    
    if (zObject.refId === refId) return zObject;
    
    for (const child of zObject.children || []) {
        const found = findZObjectById(child, refId);
        if (found) return found;
    }
    
    return undefined;
}

export default EditorView;
