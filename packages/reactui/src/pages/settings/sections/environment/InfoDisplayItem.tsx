import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface InfoDisplayItemProps {
    label: string
    value: ReactNode
    className?: string
    hasError?: boolean
    errorMessages?: string | string[]
}

export function InfoDisplayItem({
    label,
    value,
    className = "",
    hasError = false,
    errorMessages = [],
}: InfoDisplayItemProps) {
    const messageErrorArray = Array.isArray(errorMessages)
        ? errorMessages
        : (errorMessages ? [errorMessages] : [])
    const valueStyles = hasError
        ? "border-error text-error bg-error/10"
        : "border-base-300 text-base-foreground bg-base-200"

    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-base-foreground">
                    {label}
                </span>
                <span
                    className={cn(
                        "text-sm font-mono px-2 py-1 rounded border min-h-[2rem] flex items-center justify-end",
                        valueStyles,
                        className
                    )}
                >
                    {value}
                </span>
            </div>
            {hasError && messageErrorArray.length > 0 && (
                <Alert variant="error" className="mt-2">
                    <AlertDescription className="space-y-1">
                        {messageErrorArray.map((message) => (
                            <p key={message}>{message}</p>
                        ))}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    )
}

