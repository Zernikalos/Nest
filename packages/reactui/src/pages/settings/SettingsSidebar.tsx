import type { ReactNode } from "react"
import { MdSettings } from "react-icons/md"

type SettingsSidebarProps = {
  children: ReactNode
}

export function SettingsSidebar({ children }: SettingsSidebarProps) {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-6">
        <MdSettings className="h-5 w-5" />
        <h1 className="text-lg font-semibold">Settings</h1>
      </div>
      
      <nav className="space-y-1">
        {children}
      </nav>
    </div>
  )
} 