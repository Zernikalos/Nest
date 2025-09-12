import { KeepAliveOutlet } from "@/keepaliverouter"
import { MdPalette, MdSettings, MdInfo } from "react-icons/md"
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
                    <SettingsSelectorSection
                        id="environment"
                        name="Environment"
                        icon={<MdInfo className="h-4 w-4" />}
                        description="System and application environment information"
                        to="/settings/environment"
                    />
                </SettingsSidebar>
            }
            content={
                <div className="px-6 pt-6 pb-0">
                    <KeepAliveOutlet />
                </div>
            }
            sidebarWidth="w-80"
        />
    )
}
