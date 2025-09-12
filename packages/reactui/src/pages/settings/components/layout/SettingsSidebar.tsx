import type { ReactNode } from "react"
import { MdSettings } from "react-icons/md"

type SettingsSidebarProps = {
    children: ReactNode
}

/**
 * Settings sidebar navigation component.
 * Provides consistent sidebar layout with title and navigation area.
 * Designed to contain SettingsSelectorSection components for navigation.
 */
export function SettingsSidebar({ children }: SettingsSidebarProps) {
    return (
        <div 
            className="p-4"
            data-component="settings-sidebar"
        >
            <div 
                className="flex items-center gap-2 mb-6"
                data-component="settings-sidebar-header"
            >
                <MdSettings 
                    className="h-5 w-5" 
                    data-component="settings-sidebar-icon"
                />
                <h1 
                    className="text-lg font-semibold"
                    data-component="settings-sidebar-title"
                >
                    Settings
                </h1>
            </div>
            
            <nav 
                className="space-y-1"
                data-component="settings-sidebar-navigation"
            >
                {children}
            </nav>
        </div>
    )
}

SettingsSidebar.displayName = "SettingsSidebar"
