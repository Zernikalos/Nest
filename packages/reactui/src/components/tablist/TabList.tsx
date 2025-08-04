import React from 'react';
import { IoClose } from 'react-icons/io5';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export interface TreeNode {
    id: string;
    label: string;
}

interface TabListProps {
    openTabs: TreeNode[];
    activeTab: string | null;
    onTabChange: (fileName: string) => void;
    onTabClose: (fileName: string) => void;
    className?: string;
}

// Organize all styles in an object for better readability
// Moved outside component to avoid recreation on each render
const styles = {
    // Main container
    container: 'h-full flex flex-col',

    // Scroll area
    scrollArea: 'w-full border-b border-border',

    // Tabs list
    tabsList: 'flex-shrink-0 bg-background p-0 h-8 min-h-8',

    // Individual tab trigger
    tabTrigger: cn(
        // Layout and positioning
        'group flex items-center gap-2 h-full pr-1 pl-2',
        // Background and states
        'bg-transparent hover:bg-muted/50',
        'data-[state=active]:bg-muted',
        // Borders
        '',
        // Typography
        'text-sm font-normal',
        // Transitions
        'transition-colors duration-150'
    ),

    // Tab label
    tabLabel: 'truncate',

    // Close button
    closeButton: cn(
        // Layout
        'rounded-sm p-0.5 flex-shrink-0',
        // States and interactions
        'hover:bg-muted-foreground/20',
        'cursor-pointer',
        // Visibility
        'opacity-0 group-hover:opacity-100',
        // Transitions
        'transition-colors'
    ),

    // Close icon
    closeIcon: 'h-3 w-3',

    // Content container
    content: 'flex-grow bg-background',

    // Tab content
    tabContent: 'p-4 m-0',
};

const TabList: React.FC<TabListProps> = ({
    openTabs,
    activeTab,
    onTabChange,
    onTabClose,
    className,
}) => {
    return (
        <Tabs
            value={activeTab || ''}
            onValueChange={onTabChange}
            className={cn(styles.container, className)}
        >
            <ScrollArea className={styles.scrollArea}>
                <TabsList className={styles.tabsList}>
                    {openTabs.map(tab => (
                        <TabsTrigger
                            key={tab.label}
                            value={tab.id}
                            className={styles.tabTrigger}
                        >
                            <span className={styles.tabLabel}>{tab.label}</span>
                            <span
                                role="button"
                                tabIndex={0}
                                aria-label={`Close ${tab.label}`}
                                onClick={e => {
                                    e.stopPropagation();
                                    onTabClose(tab.id);
                                }}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onTabClose(tab.label);
                                    }
                                }}
                                className={styles.closeButton}
                            >
                                <IoClose className={styles.closeIcon} />
                            </span>
                        </TabsTrigger>
                    ))}
                </TabsList>
            </ScrollArea>
            <div className={styles.content}>
                {openTabs.map(tab => (
                    <TabsContent
                        key={tab.label}
                        value={tab.label}
                        className={styles.tabContent}
                    >
                        <p>Content for {tab.label}</p>
                    </TabsContent>
                ))}
            </div>
        </Tabs>
    );
};

export default TabList;
