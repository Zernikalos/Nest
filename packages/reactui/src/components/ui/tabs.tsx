'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as React from 'react';

import { cn } from '@/lib/utils';

// Organize all styles in an object for better readability
// Moved outside component to avoid recreation on each render
const styles = {
    // Main tabs container
    tabs: 'flex flex-col',

    // Tabs list container
    tabsList: 'inline-flex items-center',

    // Individual tab trigger
    tabsTrigger: cn(
        // Layout and positioning
        'inline-flex items-center justify-center',
        // Typography
        'text-sm font-medium',
        // Transitions
        'transition-colors',
        // Focus states
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        // Disabled states
        'disabled:pointer-events-none disabled:opacity-50'
    ),

    // Tab content
    tabsContent: 'outline-none',
};

function Tabs({
    className,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
    return (
        <TabsPrimitive.Root
            data-slot="tabs"
            className={cn(styles.tabs, className)}
            {...props}
        />
    );
}

function TabsList({
    className,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
    return (
        <TabsPrimitive.List
            data-slot="tabs-list"
            className={cn(styles.tabsList, className)}
            {...props}
        />
    );
}

function TabsTrigger({
    className,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
    return (
        <TabsPrimitive.Trigger
            data-slot="tabs-trigger"
            className={cn(styles.tabsTrigger, className)}
            {...props}
        />
    );
}

function TabsContent({
    className,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
    return (
        <TabsPrimitive.Content
            data-slot="tabs-content"
            className={cn(styles.tabsContent, className)}
            {...props}
        />
    );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
