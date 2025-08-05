import type { IconType } from 'react-icons';
import { Link } from 'react-router-dom';

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
    name: string;
    path: string;
    icon: IconType;
    selected?: boolean;
}

export function SidebarItem({
    name,
    path,
    icon: Icon,
    selected,
}: SidebarItemProps) {
    return (
        <div
            className={cn(
                'border-l-2 border-l-transparent',
                selected && 'border-l-primary'
            )}
        >
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        to={path}
                        className={cn(
                            'flex items-center text-4xl py-4 px-2 h-12 overflow-hidden text-ellipsis whitespace-nowrap text-sidebar-foreground',
                            'hover:rounded-r hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition duration-300 ease-in-out'
                        )}
                    >
                        <Icon />
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <p>{name}</p>
                </TooltipContent>
            </Tooltip>
        </div>
    );
}
