import {
    BsJournals as JournalCodeIcon,
    BsPhone as PhoneIcon,
    BsBoxSeam as BoxesIcon,
    BsGear as GearIcon,
} from 'react-icons/bs';
import { useLocation } from 'react-router-dom';

import { Logo } from '../logo/Logo';

import { SidebarItem } from './SidebarItem';

import { cn } from '@/lib/utils';

export function Sidebar() {
    const location = useLocation();
    const pathname = location.pathname;

    // Helper function to check if a route is active
    const isRouteActive = (path: string) => {
        if (path === '/editor') {
            return pathname === '/editor' || pathname === '/';
        }
        return pathname === path;
    };

    return (
        <aside
            className={cn(
                'shadow-md pl-0 bg-sidebar max-w-[56px] max-h-screen h-screen'
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
                        selected={isRouteActive('/editor')}
                        icon={JournalCodeIcon}
                    />
                    <SidebarItem
                        path="/devices"
                        name="Devices"
                        selected={isRouteActive('/devices')}
                        icon={PhoneIcon}
                    />
                    <SidebarItem
                        path="/exporter"
                        name="Export"
                        selected={isRouteActive('/exporter')}
                        icon={BoxesIcon}
                    />
                </div>
                <div>
                    <SidebarItem
                        path="/settings"
                        name="Settings"
                        selected={isRouteActive('/settings')}
                        icon={GearIcon}
                    />
                </div>
            </div>
        </aside>
    );
}
