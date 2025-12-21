import React, { use } from 'react';
import TabList from '@/components/tablist/TabList';
import ViewToggle from '@/pages/editor/components/ViewToggle';
import { cn } from '@/lib/utils';
import { NestEditorContext, type NestEditorContextType } from '../providers/NestEditorContext';

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
    } = use(NestEditorContext) as NestEditorContextType;

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


