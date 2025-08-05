import type { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type SettingsSectionItemProps = {
  title: string
  description: string
  icon?: ReactNode
  children: ReactNode
}

export function SettingsSectionItem({ 
  title, 
  description, 
  icon, 
  children 
}: SettingsSectionItemProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
} 