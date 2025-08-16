import React from 'react';
import { HiOutlineDocumentText, HiOutlineCode, HiOutlineEye } from 'react-icons/hi';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';

interface ViewToggleProps {
    activeView: 'form' | 'code' | 'viewer';
    onViewChange: (view: 'form' | 'code' | 'viewer') => void;
    className?: string;
}

const ViewToggle: React.FC<ViewToggleProps> = ({
    activeView,
    onViewChange,
    className
}) => {
    return (
        <ToggleGroup 
            type="single" 
            value={activeView} 
            onValueChange={(value) => value && onViewChange(value as 'form' | 'code' | 'viewer')}
            className={cn('flex items-center', className)}
        >
            <ToggleGroupItem value="form" className="flex items-center gap-1 px-2 rounded-none rounded-0">
                <HiOutlineDocumentText className="h-2 w-2" />
            </ToggleGroupItem>
            
            <ToggleGroupItem value="code" className="flex items-center gap-1 px-2">
                <HiOutlineCode className="h-2 w-2" />
            </ToggleGroupItem>

            <ToggleGroupItem value="viewer" className="flex items-center gap-1 px-2">
                <HiOutlineEye className="h-2 w-2" />
            </ToggleGroupItem>
        </ToggleGroup>
    );
};

export default ViewToggle;
