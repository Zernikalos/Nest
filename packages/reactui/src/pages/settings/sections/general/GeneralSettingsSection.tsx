import { MdSettings } from "react-icons/md"
import { SettingsMainContainer, SettingsSectionItem } from "../../components/layout"
import { 
    ControlledSettingsFieldSwitch, 
    ControlledSettingsFieldInput, 
    ControlledSettingsFieldSelect 
} from "../../components/fields"
import type { GeneralFormData } from "../../SettingsFormData"
import { useSettings } from "../../useSettings"

export function GeneralSettingsSection() {
    const { getGeneralSettings, updateGeneralSettings } = useSettings()
    const generalSettings = getGeneralSettings()

    const handleSubmit = (data: GeneralFormData) => {
        updateGeneralSettings(data)
        console.log("General settings saved:", data)
    }

    return (
        <SettingsMainContainer
            title="General"
            description="Configure general application behavior and preferences"
            defaultValues={generalSettings}
            onSubmit={handleSubmit}
        >
            {/* Confirm before exit */}
            <SettingsSectionItem
                title="Exit Confirmation"
                description="Ask for confirmation before closing the application"
                icon={<MdSettings className="h-5 w-5" />}
            >
                <ControlledSettingsFieldSwitch
                    name="confirmBeforeExit"
                    title="Confirm before exit"
                    description="Show a confirmation dialog when trying to close the application"
                />
            </SettingsSectionItem>

            {/* Reopen projects on startup */}
            <SettingsSectionItem
                title="Project Management"
                description="Configure how projects are handled on application startup"
            >
                <ControlledSettingsFieldSwitch
                    name="reopenProjectsOnStartup"
                    title="Reopen projects on startup"
                    description="Automatically reopen the last opened projects when starting the application"
                />
            </SettingsSectionItem>

            {/* Auto-save on inactivity */}
            <SettingsSectionItem
                title="Auto-save Settings"
                description="Configure automatic saving behavior when the editor is inactive"
            >
                <ControlledSettingsFieldInput
                    name="autoSaveInactivitySeconds"
                    title="Auto-save on inactivity"
                    description="Automatically save the project if the editor is inactive for a specified time"
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
                <ControlledSettingsFieldSelect
                    name="saveOnClose"
                    title="Save behavior when closing"
                    description="Choose what happens when you close a project"
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
