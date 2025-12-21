import React, { useMemo } from 'react';
import { HiOutlineDocumentText, HiOutlineCode, HiOutlineEye } from 'react-icons/hi';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import { useNavigate, useIsActive } from '@/keepaliverouter';
import type { IconType } from 'react-icons';

interface ViewToggleProps {
    className?: string;
}

interface ViewToggleItemProps {
    value: 'form' | 'code' | 'viewer';
    icon: IconType;
    withShadow?: boolean;
}

const ViewToggleItem: React.FC<ViewToggleItemProps> = ({ value, icon: Icon, withShadow = false }) => {
    return (
        <ToggleGroupItem 
            value={value} 
            className={cn(
                "flex items-center gap-1 px-2 rounded-sm",
                "data-[state=on]:bg-base-100 data-[state=on]:text-base-foreground",
                withShadow && "data-[state=on]:shadow-sm",
                "data-[state=off]:text-muted-foreground hover:text-base-foreground",
                "transition-all duration-200"
            )}
        >
            <Icon className="h-2 w-2" />
        </ToggleGroupItem>
    );
};

const ViewToggle: React.FC<ViewToggleProps> = ({ className }) => {
    const navigate = useNavigate();
    const isFormActive = useIsActive('/editor/form');
    const isCodeActive = useIsActive('/editor/code');
    const isViewerActive = useIsActive('/editor/viewer');

    // Determine active view based on current route
    const activeView = useMemo(() => {
        if (isFormActive) return 'form';
        if (isCodeActive) return 'code';
        if (isViewerActive) return 'viewer';
        return 'form'; // Default to form
    }, [isFormActive, isCodeActive, isViewerActive]);

    const handleViewChange = (view: 'form' | 'code' | 'viewer') => {
        const routeMap = {
            form: '/editor/form',
            code: '/editor/code',
            viewer: '/editor/viewer'
        };
        navigate(routeMap[view]);
    };

    return (
        <div className={cn('flex items-center bg-base-200 rounded-md', className)}>
            <ToggleGroup 
                type="single" 
                value={activeView} 
                onValueChange={(value) => value && handleViewChange(value as 'form' | 'code' | 'viewer')}
                variant="default"
                className="flex items-center gap-0"
            >
                <ViewToggleItem value="form" icon={HiOutlineDocumentText} withShadow />
                <ViewToggleItem value="code" icon={HiOutlineCode} />
                <ViewToggleItem value="viewer" icon={HiOutlineEye} withShadow />
            </ToggleGroup>
        </div>
    );
};

export default ViewToggle;
