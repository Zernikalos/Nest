import React from 'react';
import TabList from '@/components/tablist/TabList';
import ViewToggle from '@/components/ViewToggle';

interface EditorViewTopBarProps {
    openedNodes: any[];
    activeNode: string | null;
    activeView: 'form' | 'code';
    onTabChange: (tabId: string) => void;
    onTabClose: (tabId: string) => void;
    onViewChange: (view: 'form' | 'code') => void;
}

const EditorViewTopBar: React.FC<EditorViewTopBarProps> = ({
    openedNodes,
    activeNode,
    activeView,
    onTabChange,
    onTabClose,
    onViewChange,
}) => {
    return (
        <div className="flex items-center max-h-8">
            <TabList
                className="flex-1"
                showBorder={false}
                openTabs={openedNodes}
                activeTab={activeNode}
                onTabChange={onTabChange}
                onTabClose={onTabClose}
            />
            <div className="flex items-center px-4">
                <ViewToggle
                    activeView={activeView}
                    onViewChange={onViewChange}
                />
            </div>
        </div>
    );
};

export default EditorViewTopBar;
