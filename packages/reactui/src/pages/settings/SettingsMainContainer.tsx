import type { ReactNode } from "react"

type SettingsSectionProps = {
  title: string
  description: string
  children: ReactNode
}

export function SettingsMainContainer({ title, description, children }: SettingsSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="space-y-6">
        {children}
      </div>
    </div>
  )
} 