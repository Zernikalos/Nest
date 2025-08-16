import React from 'react';
import TabList from '@/components/tablist/TabList';
import ViewToggle from '@/components/ViewToggle';
import { useNestEditorContext } from '../providers/NestEditorContext';

interface EditorViewTopBarProps {
    activeView: 'form' | 'code' | 'viewer';
    onViewChange: (view: 'form' | 'code' | 'viewer') => void;
}

export const EditorViewTopBar: React.FC<EditorViewTopBarProps> = ({
    activeView,
    onViewChange,
}) => {
    const { 
        openedNodes, 
        activeNode, 
        handleTabChange, 
        handleTabClose,
    } = useNestEditorContext();

    return (
        <div className="flex items-center max-h-8">
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
                    onViewChange={onViewChange}
                />
            </div>
        </div>
    );
};


