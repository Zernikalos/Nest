import React from 'react';
import TabList from '@/components/tablist/TabList';
import ViewToggle from '@/components/ViewToggle';
import { useNestEditorContext } from '@/pages/editor/providers';
import { cn } from '@/lib/utils';

interface EditorViewTopBarProps {
    activeView: 'form' | 'code' | 'viewer';
    onViewChange: (view: 'form' | 'code' | 'viewer') => void;
    className?: string;
}

export const EditorTopBar: React.FC<EditorViewTopBarProps> = ({
    activeView,
    onViewChange,
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
            <div className="flex items-center pl-4">
                <ViewToggle
                    activeView={activeView}
                    onViewChange={onViewChange}
                />
            </div>
        </div>
    );
};


