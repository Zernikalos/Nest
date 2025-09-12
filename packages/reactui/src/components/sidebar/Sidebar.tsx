import {
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
    const { isRouteActive } = useKeepAliveRouter();

    // Helper function to check if a route is active with custom logic
    const checkActiveRoute = useCallback((path: string) => {
        if (path === '/editor') {
            return isRouteActive('/editor') || currentRoute === '/';
        }
        return isRouteActive(path);
    }, [currentRoute, isRouteActive]);

    return (
        <TooltipProvider disableHoverableContent>
            <aside
                className={cn(
                    'shadow-md pl-0 bg-base-200 max-w-[56px] max-h-screen h-screen border-r border-base-300'
                )}
            >
                <div className="flex flex-col h-full">
                    <div className="flex-1">
                        <div className="align-middle p-2 h-12">
                            <Logo />
                        </div>
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
