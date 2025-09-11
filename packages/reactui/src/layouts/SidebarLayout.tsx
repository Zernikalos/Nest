import type { ReactNode } from "react"

type SettingsLayoutProps = {
  sidebar: ReactNode
  content: ReactNode
  sidebarWidth?: string
}

export function SettingsLayout({ 
  sidebar, 
  content, 
  sidebarWidth = "w-50" 
}: SettingsLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar */}
      <div className={`${sidebarWidth} border-r bg-background flex-shrink-0`}>
        {sidebar}
      </div>

      {/* Right Content Area */}
      <div className="flex-1 overflow-auto">
        {content}
      </div>
    </div>
  )
} 