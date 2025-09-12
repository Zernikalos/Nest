import { useState, useEffect } from "react"
import { BsClipboard, BsCheck, BsEye, BsEyeSlash } from "react-icons/bs"
import { getDebugKey } from "@/lib/debuggerApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "../../components/ui/badge"

export function DebuggerKey() {
    const [deviceKey, setDeviceKey] = useState<string>("")
    const [copyState, setCopyState] = useState<string>("Copy")
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchDebugKey = async () => {
            try {
                setIsLoading(true)
                const key = await getDebugKey()
                setDeviceKey(key)
            } catch (error) {
                console.error("Failed to fetch debug key:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchDebugKey()
    }, [])

    const handleCopyButton = async () => {
        try {
            await navigator.clipboard.writeText(deviceKey)
            setCopyState("Copied!")
            setTimeout(() => {
                setCopyState("Copy")
            }, 1500)
        } catch (error) {
            console.error("Failed to copy to clipboard:", error)
        }
    }

    const toggleVisibility = () => {
        setIsVisible(!isVisible)
    }

    const displayKey = isVisible ? deviceKey : "•".repeat(deviceKey.length)

    if (isLoading) {
        return (
            <div className="space-y-3">
                <div className="h-10 bg-muted animate-pulse rounded-md" />
                <div className="flex justify-center">
                    <Badge variant="outline">Loading...</Badge>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 group">
                <Input
                    value={displayKey}
                    readOnly
                    className="text-center select-none cursor-pointer font-mono text-sm"
                    onClick={handleCopyButton}
                />
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={toggleVisibility}
                            className="shrink-0"
                        >
                            {isVisible ? (
                                <BsEyeSlash className="h-4 w-4" />
                            ) : (
                                <BsEye className="h-4 w-4" />
                            )}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{isVisible ? "Hide" : "Show"} key</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="shrink-0"
                            onClick={handleCopyButton}
                        >
                            {copyState === "Copied!" ? (
                                <BsCheck className="h-4 w-4 text-green-600" />
                            ) : (
                                <BsClipboard className="h-4 w-4" />
                            )}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{copyState}</p>
                    </TooltipContent>
                </Tooltip>
            </div>
            
            <div className="flex justify-center">
                <Badge 
                    variant={copyState === "Copied!" ? "default" : "secondary"}
                    className="transition-colors"
                >
                    {copyState === "Copied!" ? "✓ Key copied to clipboard" : "Click to copy"}
                </Badge>
            </div>
        </div>
    )
}
