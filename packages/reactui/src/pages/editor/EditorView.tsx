import React, { useState } from 'react';

import TabList from '@/components/tablist/TabList';
import { TreeView, type TreeNode } from '@/components/treeview';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable';
import { SidebarProvider } from '@/components/ui/sidebar';

// Datos de ejemplo para el árbol
const initialTree: TreeNode[] = [
    {
        id: '1',
        label: 'src',
        children: [
            { id: '1-1', label: 'App.tsx' },
            { id: '1-2', label: 'main.tsx' },
            {
                id: '1-3',
                label: 'components',
                children: [
                    { id: '1-3-1', label: 'Button.tsx' },
                    { id: '1-3-2', label: 'Input.tsx' },
                ],
            },
        ],
    },
    {
        id: '2',
        label: 'public',
        children: [{ id: '2-1', label: 'vite.svg' }],
    },
    {
        id: '3',
        label: 'README.md',
    },
];

const EditorView: React.FC = () => {
    const [tree, setTree] = useState<TreeNode[]>(initialTree);
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
        setTree(newTree);
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
