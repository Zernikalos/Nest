import { Outlet } from "react-router-dom"
import { MdPalette, MdSettings } from "react-icons/md"
import { SettingsLayout } from "@/layouts/SidebarLayout"
import { SettingsSidebar } from "./components/layout"
import { SettingsSelectorSection } from "./components/navigation"

export const SettingsPage = () => {
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
                    <Outlet />
                </div>
            }
            sidebarWidth="w-80"
        />
    )
}
