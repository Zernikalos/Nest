import type { IconType } from 'react-icons';
import { Link, useCurrentRoute, useLastRouteInHierarchy, isPathPrefix } from '@/keepaliverouter';

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { memo, useMemo } from 'react';

interface SidebarItemProps {
    name: string;
    path: string;
    icon: IconType;
    selected?: boolean;
}

export const SidebarItem = memo(({
    name,
    path,
    icon: Icon,
    selected,
}: SidebarItemProps) => {
    const currentRoute = useCurrentRoute();
    const targetPath = useLastRouteInHierarchy(path);
    
    // Si ya estamos en esta jerarquía, mantener la ruta actual
    const finalPath = useMemo(() => {
        if (isPathPrefix(path, currentRoute)) {
            return currentRoute;
        }
        return targetPath;
    }, [path, currentRoute, targetPath]);
    
    return (
        <div
            className={cn(
                'border-l-4 border-l-transparent',
                selected && 'border-l-primary'
            )}
        >
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        to={finalPath}
                        className={cn(
                            'flex items-center text-4xl py-4 px-2 h-12 overflow-hidden text-ellipsis whitespace-nowrap text-sidebar-foreground',
                            'hover:bg-base-300 hover:text-base-foreground transition duration-300 ease-in-out',
                            selected && 'bg-primary/10'
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
})

SidebarItem.displayName = 'SidebarItem';