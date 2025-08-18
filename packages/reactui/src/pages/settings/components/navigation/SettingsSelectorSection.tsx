import type { ReactNode } from "react"
import { NavLink } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { MdChevronRight } from "react-icons/md"

type SettingsSectionProps = {
    id: string
    name: string
    icon: ReactNode
    description: string
    to: string
}

/**
 * Settings navigation item component.
 * Renders a clickable navigation button with icon, title, description, and chevron.
 * Automatically handles active state styling based on current route.
 */
export function SettingsSelectorSection({ 
    id, 
    name, 
    icon, 
    description, 
    to 
}: SettingsSectionProps) {
    return (
        <NavLink 
            to={to} 
            className="block"
            data-component="settings-selector-link"
            data-section-id={id}
        >
            {({ isActive }) => (
                <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start h-auto p-2"
                    data-component="settings-selector-button"
                    data-active={isActive}
                >
                    <div 
                        className="flex items-start gap-2 w-full"
                        data-component="settings-selector-content"
                    >
                        <span 
                            data-component="settings-selector-icon"
                        >
                            {icon}
                        </span>
                        <div 
                            className="flex-1 text-left min-w-0 overflow-hidden"
                            data-component="settings-selector-text"
                        >
                            <div 
                                className="font-medium break-words overflow-wrap-anywhere"
                                data-component="settings-selector-name"
                            >
                                {name}
                            </div>
                            <div 
                                className="text-xs text-muted-foreground break-words overflow-wrap-anywhere"
                                data-component="settings-selector-description"
                            >
                                {description}
                            </div>
                        </div>
                        <MdChevronRight 
                            className="h-4 w-4 flex-shrink-0 mt-0.5" 
                            data-component="settings-selector-chevron"
                        />
                    </div>
                </Button>
            )}
        </NavLink>
    )
}

SettingsSelectorSection.displayName = "SettingsSelectorSection"
