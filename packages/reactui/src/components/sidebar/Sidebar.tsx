import {
    BsFolder as ProjectsIcon,
    BsCodeSlash as EditorIcon,
    BsPhone as DeviceIcon,
    BsRocket as ExportIcon,
    BsGearFill as SettingsIcon,
} from 'react-icons/bs';
import { useCurrentRoute, useKeepAliveRouter } from '@/keepaliverouter';

import { Logo } from '../logo/Logo';
import { TooltipProvider } from '../ui/tooltip';

import { SidebarItem } from './SidebarItem';

import { cn } from '@/lib/utils';
import { useCallback } from 'react';

export function Sidebar() {
    const currentRoute = useCurrentRoute();
    const { isInRouteHierarchy } = useKeepAliveRouter();

    // Helper function to check if we're in the hierarchy of a route
    const checkActiveRoute = useCallback((path: string) => {
        // Special case for editor: also match root route
        if (path === '/editor') {
            return currentRoute === '/' || isInRouteHierarchy(path);
        }
        return isInRouteHierarchy(path);
    }, [currentRoute, isInRouteHierarchy]);

    return (
        <TooltipProvider disableHoverableContent>
            <aside
                className={cn(
                    'shadow-md pl-0 bg-base-200 w-[56px] flex-shrink-0 h-screen border-r border-base-300'
                )}
            >
                <div className="flex flex-col h-full">
                    <div className="flex-1">
                        <div className="align-middle p-2 h-12">
                            <Logo />
                        </div>
                        <SidebarItem
                            path="/projects"
                            name="Projects"
                            selected={checkActiveRoute('/projects')}
                            icon={ProjectsIcon}
                        />
                        <SidebarItem
                            path="/editor"
                            name="Editor"
                            selected={checkActiveRoute('/editor')}
                            icon={EditorIcon}
                        />
                        <SidebarItem
                            path="/devices"
                            name="Devices"
                            selected={checkActiveRoute('/devices')}
                            icon={DeviceIcon}
                        />
                        <SidebarItem
                            path="/exporter"
                            name="Export"
                            selected={checkActiveRoute('/exporter')}
                            icon={ExportIcon}
                        />
                    </div>
                    <div>
                        <SidebarItem
                            path="/settings"
                            name="Settings"
                            selected={checkActiveRoute('/settings')}
                            icon={SettingsIcon}
                        />
                    </div>
                </div>
            </aside>
        </TooltipProvider>
    );
}

Sidebar.displayName = 'Sidebar';
