import { useState } from "react"
import { MdSettings } from "react-icons/md"
import { SettingsMainContainer } from "../SettingsMainContainer"
import { SettingsSectionItem } from "../SettingsSectionItem"
import { 
  SettingsFieldSwitch, 
  SettingsFieldInput, 
  SettingsFieldSelect 
} from "../SettingsField"

export function GeneralSettingsSection() {
  const [settings, setSettings] = useState({
    confirmBeforeExit: true,
    reopenProjectsOnStartup: false,
    autoSaveInactivitySeconds: 30,
    saveOnClose: "ask" // "always" | "never" | "ask"
  })

  const handleSettingChange = (key: string, value: boolean | number | string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <SettingsMainContainer
      title="General"
      description="Configure general application behavior and preferences"
    >
      {/* Confirm before exit */}
      <SettingsSectionItem
        title="Exit Confirmation"
        description="Ask for confirmation before closing the application"
        icon={<MdSettings className="h-5 w-5" />}
      >
        <SettingsFieldSwitch
          title="Confirm before exit"
          description="Show a confirmation dialog when trying to close the application"
          checked={settings.confirmBeforeExit}
          onCheckedChange={(checked) => handleSettingChange("confirmBeforeExit", checked)}
        />
      </SettingsSectionItem>

      {/* Reopen projects on startup */}
      <SettingsSectionItem
        title="Project Management"
        description="Configure how projects are handled on application startup"
      >
        <SettingsFieldSwitch
          title="Reopen projects on startup"
          description="Automatically reopen the last opened projects when starting the application"
          checked={settings.reopenProjectsOnStartup}
          onCheckedChange={(checked) => handleSettingChange("reopenProjectsOnStartup", checked)}
        />
      </SettingsSectionItem>

      {/* Auto-save on inactivity */}
      <SettingsSectionItem
        title="Auto-save Settings"
        description="Configure automatic saving behavior when the editor is inactive"
      >
        <SettingsFieldInput
          title="Auto-save on inactivity"
          description="Automatically save the project if the editor is inactive for a specified time"
          value={settings.autoSaveInactivitySeconds}
          onChange={(value) => handleSettingChange("autoSaveInactivitySeconds", parseInt(value) || 30)}
          type="number"
          min={5}
          max={300}
          className="w-20"
          suffix="seconds"
        />
      </SettingsSectionItem>

      {/* Save on close */}
      <SettingsSectionItem
        title="Save on Close"
        description="Configure what happens when closing a project"
      >
        <SettingsFieldSelect
          title="Save behavior when closing"
          description="Choose what happens when you close a project"
          value={settings.saveOnClose}
          onValueChange={(value) => handleSettingChange("saveOnClose", value)}
          options={[
            { value: "always", label: "Always save" },
            { value: "never", label: "Never save" },
            { value: "ask", label: "Ask each time" }
          ]}
        />
      </SettingsSectionItem>
    </SettingsMainContainer>
  )
}
