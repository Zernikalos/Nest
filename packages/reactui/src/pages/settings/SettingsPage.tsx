import { useEffect } from "react"
import { useNavigate, useCurrentRoute } from "@/keepaliverouter"
import { MdPalette, MdSettings } from "react-icons/md"
import { SettingsLayout } from "@/layouts/SidebarLayout"
import { SettingsSidebar } from "./components/layout"
import { SettingsSelectorSection } from "./components/navigation"
import { GeneralSettingsSection, AppearanceSettingsSection } from "./sections"

export const SettingsPage = () => {
    const navigate = useNavigate()
    const currentRoute = useCurrentRoute()
    
    // Handle redirect to general settings when accessing /settings
    useEffect(() => {
        if (currentRoute === '/settings') {
            navigate('/settings/general')
        }
    }, [currentRoute, navigate])
    
    // Determine which section to show based on current route
    const renderContent = () => {
        switch (currentRoute) {
            case '/settings/general':
                return <GeneralSettingsSection />
            case '/settings/appearance':
                return <AppearanceSettingsSection />
            default:
                return <div>Loading...</div>
        }
    }

    return (
        <SettingsLayout
            sidebar={
                <SettingsSidebar>
                    <SettingsSelectorSection
                        id="general"
                        name="General"
                        icon={<MdSettings className="h-4 w-4" />}
                        description="General application settings"
                        to="/settings/general"
                    />
                    <SettingsSelectorSection
                        id="appearance"
                        name="Appearance"
                        icon={<MdPalette className="h-4 w-4" />}
                        description="Customize the look and feel of the application"
                        to="/settings/appearance"
                    />
                </SettingsSidebar>
            }
            content={
                <div className="p-6">
                    {renderContent()}
                </div>
            }
            sidebarWidth="w-80"
        />
    )
}
