import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { MdChevronRight } from "react-icons/md"

type SettingsSectionProps = {
  id: string
  name: string
  icon: ReactNode
  description: string
  isActive: boolean
  onClick: () => void
}

export function SettingsSelectorSection({ 
  id, 
  name, 
  icon, 
  description, 
  isActive, 
  onClick 
}: SettingsSectionProps) {
  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className="w-full justify-start h-auto p-2"
      onClick={onClick}
    >
      <div className="flex items-start gap-2 w-full">
        {icon}
        <div className="flex-1 text-left min-w-0 overflow-hidden">
          <div className="font-medium break-words overflow-wrap-anywhere">{name}</div>
          <div className="text-xs text-muted-foreground break-words overflow-wrap-anywhere">
            {description}
          </div>
        </div>
        <MdChevronRight className="h-4 w-4 flex-shrink-0 mt-0.5" />
      </div>
    </Button>
  )
} 