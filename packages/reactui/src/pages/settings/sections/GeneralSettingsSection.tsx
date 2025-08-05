import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { MdSettings } from "react-icons/md"
import { SettingsMainContainer } from "../SettingsMainContainer"
import { SettingsSectionItem } from "../SettingsSectionItem"

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
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Confirm before exit</Label>
            <p className="text-sm text-muted-foreground">
              Show a confirmation dialog when trying to close the application
            </p>
          </div>
          <Switch
            checked={settings.confirmBeforeExit}
            onCheckedChange={(checked: boolean) => handleSettingChange("confirmBeforeExit", checked)}
          />
        </div>
      </SettingsSectionItem>

      {/* Reopen projects on startup */}
      <SettingsSectionItem
        title="Project Management"
        description="Configure how projects are handled on application startup"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Reopen projects on startup</Label>
            <p className="text-sm text-muted-foreground">
              Automatically reopen the last opened projects when starting the application
            </p>
          </div>
          <Switch
            checked={settings.reopenProjectsOnStartup}
            onCheckedChange={(checked: boolean) => handleSettingChange("reopenProjectsOnStartup", checked)}
          />
        </div>
      </SettingsSectionItem>

      {/* Auto-save on inactivity */}
      <SettingsSectionItem
        title="Auto-save Settings"
        description="Configure automatic saving behavior when the editor is inactive"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-base">Auto-save on inactivity</Label>
            <p className="text-sm text-muted-foreground">
              Automatically save the project if the editor is inactive for a specified time
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              min="5"
              max="300"
              value={settings.autoSaveInactivitySeconds}
              onChange={(e) => handleSettingChange("autoSaveInactivitySeconds", parseInt(e.target.value) || 30)}
              className="w-20"
            />
            <span className="text-sm text-muted-foreground">seconds</span>
          </div>
        </div>
      </SettingsSectionItem>

      {/* Save on close */}
      <SettingsSectionItem
        title="Save on Close"
        description="Configure what happens when closing a project"
      >
        <div className="space-y-2">
          <Label className="text-base">Save behavior when closing</Label>
          <p className="text-sm text-muted-foreground">
            Choose what happens when you close a project
          </p>
        </div>
        <Select 
          value={settings.saveOnClose} 
          onValueChange={(value) => handleSettingChange("saveOnClose", value)}
        >
          <SelectTrigger className="w-[300px] mt-3">
            <SelectValue placeholder="Select save behavior" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="always">
              Always save
            </SelectItem>
            <SelectItem value="never">
              Never save
            </SelectItem>
            <SelectItem value="ask">
              Ask each time
            </SelectItem>
          </SelectContent>
        </Select>
      </SettingsSectionItem>
    </SettingsMainContainer>
  )
}
