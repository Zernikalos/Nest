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
        <div className={cn('flex items-center bg-base-200 rounded-md', className)}>
            <ToggleGroup 
                type="single" 
                value={activeView} 
                onValueChange={(value) => value && onViewChange(value as 'form' | 'code' | 'viewer')}
                variant="default"
                className="flex items-center gap-0"
            >
                <ToggleGroupItem 
                    value="form" 
                    className={cn(
                        "flex items-center gap-1 px-2 rounded-sm",
                        "data-[state=on]:bg-base-100 data-[state=on]:text-base-foreground data-[state=on]:shadow-sm",
                        "data-[state=off]:text-muted-foreground hover:text-base-foreground",
                        "transition-all duration-200"
                    )}
                >
                    <HiOutlineDocumentText className="h-2 w-2" />
                </ToggleGroupItem>
                
                <ToggleGroupItem 
                    value="code" 
                    className={cn(
                        "flex items-center gap-1 px-2 rounded-sm",
                        "data-[state=on]:bg-base-100 data-[state=on]:text-base-foreground",
                        "data-[state=off]:text-muted-foreground hover:text-base-foreground",
                        "transition-all duration-200"
                    )}
                >
                    <HiOutlineCode className="h-2 w-2" />
                </ToggleGroupItem>

                <ToggleGroupItem 
                    value="viewer" 
                    className={cn(
                        "flex items-center gap-1 px-2 rounded-sm",
                        "data-[state=on]:bg-base-100 data-[state=on]:text-base-foreground data-[state=on]:shadow-sm",
                        "data-[state=off]:text-muted-foreground hover:text-base-foreground",
                        "transition-all duration-200"
                    )}
                >
                    <HiOutlineEye className="h-2 w-2" />
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
    );
};

export default ViewToggle;
