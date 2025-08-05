import { useState } from "react"
import { MdPalette, MdSettings } from "react-icons/md"
import { SettingsLayout } from "@/layouts/SidebarLayout"
import { SettingsSidebar } from "@/pages/settings/SettingsSidebar"
import { SettingsSelectorSection } from "@/pages/settings/SettingsSelectorSection"
import { GeneralSettingsSection } from "./sections/GeneralSettingsSection"
import { AppearanceSettingsSection } from "./sections/AppareanceSettingsSection"

export const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState<string>("appearance")

  const renderSectionContent = () => {
    switch (activeSection) {
      case "appearance":
        return <AppearanceSettingsSection />
      case "general":
        return <GeneralSettingsSection />
      default:
        return <div>Section not found</div>
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
            isActive={activeSection === "general"}
            onClick={() => setActiveSection("general")}
          />
          <SettingsSelectorSection
            id="appearance"
            name="Appearance"
            icon={<MdPalette className="h-4 w-4" />}
            description="Customize the look and feel of the application"
            isActive={activeSection === "appearance"}
            onClick={() => setActiveSection("appearance")}
          />
        </SettingsSidebar>
      }
      content={
        <div className="p-6">
          {renderSectionContent()}
        </div>
      }
      sidebarWidth="w-80"
    />
  )
}
