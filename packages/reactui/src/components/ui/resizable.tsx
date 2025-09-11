import * as React from 'react';
import { MdDragIndicator } from 'react-icons/md';
import * as ResizablePrimitive from 'react-resizable-panels';

import { cn } from '@/lib/utils';

const styles = {
    // Main container for resizable panels
    panelGroup:
        'flex h-full w-full data-[panel-group-direction=vertical]:flex-col',
    // Individual panel element
    panel: 'data-slot-resizable-panel',
    handle: {
        // Base styles for the handle element
        base: [
            'bg-border focus-visible:ring-ring relative flex w-px items-center justify-center',
            'focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-hidden',
            'data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full',
        ],
        after: {
            // Base positioning and sizing for horizontal direction (visual line)
            base: [
                'after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2',
            ],
            // Override for vertical direction
            vertical: [
                'data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1',
                'data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:translate-x-0',
                'data-[panel-group-direction=vertical]:after:-translate-y-1/2',
            ],
        },
        before: {
            // Base positioning and sizing for horizontal direction
            base: [
                'before:absolute before:inset-y-0 before:left-1/2 before:w-4 before:-translate-x-1/2',
                'before:bg-transparent before:cursor-col-resize',
            ],
            // Override for vertical direction
            vertical: [
                'data-[panel-group-direction=vertical]:before:h-4 data-[panel-group-direction=vertical]:before:w-full',
                'data-[panel-group-direction=vertical]:before:left-0 data-[panel-group-direction=vertical]:before:translate-x-0',
                'data-[panel-group-direction=vertical]:before:cursor-row-resize',
            ],
        },
        // Hover effects for better visual feedback (subtle gray scale)
        hover: [
            'hover:bg-muted hover:after:bg-foreground transition-colors duration-200',
        ],
        // Rotation for vertical handle icon
        vertical: ['[&[data-panel-group-direction=vertical]>div]:rotate-90'],
    },
    // Container for the visible handle icon
    handleIcon:
        'bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border',
    // Size for the drag indicator icon
    handleIconSvg: 'size-2.5',
} as const;

function ResizablePanelGroup({
    className,
    ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) {
    return (
        <ResizablePrimitive.PanelGroup
            data-slot="resizable-panel-group"
            className={cn(styles.panelGroup, className)}
            {...props}
        />
    );
}

function ResizablePanel({
    ...props
}: React.ComponentProps<typeof ResizablePrimitive.Panel>) {
    return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />;
}

function ResizableHandle({
    withHandle,
    className,
    ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
    withHandle?: boolean;
}) {
    return (
        <ResizablePrimitive.PanelResizeHandle
            data-slot="resizable-handle"
            className={cn(
                styles.handle.base,
                styles.handle.after.base,
                styles.handle.after.vertical,
                styles.handle.before.base,
                styles.handle.before.vertical,
                styles.handle.hover,
                styles.handle.vertical,
                className
            )}
            {...props}
        >
            {withHandle && (
                <div className={styles.handleIcon}>
                    <MdDragIndicator className={styles.handleIconSvg} />
                </div>
            )}
        </ResizablePrimitive.PanelResizeHandle>
    );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
