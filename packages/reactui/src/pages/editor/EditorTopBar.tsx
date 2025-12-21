import React from 'react';
import TabList from '@/components/tablist/TabList';
import ViewToggle from '@/pages/editor/components/ViewToggle';
import { useNestEditorContext } from '@/pages/editor/providers';
import { cn } from '@/lib/utils';

interface EditorViewTopBarProps {
    className?: string;
}

export const EditorTopBar: React.FC<EditorViewTopBarProps> = ({
    className,
}) => {
    const { 
        openedNodes, 
        activeNode, 
        handleTabChange, 
        handleTabClose,
    } = useNestEditorContext();

    return (
        <div className={cn('flex items-center h-8', className)}>
            <TabList
                className="flex-1"
                showBorder={false}
                openTabs={openedNodes}
                activeTab={activeNode}
                onTabChange={handleTabChange}
                onTabClose={handleTabClose}
            />
            <div className="flex items-center pl-4 flex-shrink-0">
                <ViewToggle />
            </div>
        </div>
    );
};


