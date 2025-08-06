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

function convertZObjectToTreeNode(zObject: any): TreeNode {
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

    const handleSelect = (ids: string[]) => {
        setSelectedIds(ids);
        const node = findNodeById(tree, ids[ids.length - 1]);
        if (node) {
            if (!openFiles.find(f => f.id === node.id)) {
                setOpenFiles([...openFiles, node]);
            }
            setActiveFile(node.id);
        }
    };

    const handleMove = (newTree: TreeNode[]) => {
        // Note: Tree movement is disabled when using parsed data
        // setTree(newTree);
    };

    const handleTabChange = (fileId: string) => {
        setActiveFile(fileId);
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
                    <TabList
                        className="w-full"
                        openTabs={openFiles}
                        activeTab={activeFile}
                        onTabChange={handleTabChange}
                        onTabClose={handleTabClose}
                    />
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

// Utilidad para buscar un nodo por id
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

export default EditorView;
