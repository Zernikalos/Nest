import { MdInfo, MdComputer, MdBuild } from "react-icons/md"
import { SettingsSectionItem } from "../../components/layout"
import { zernikalos } from "@/lib/zernikalos"
import { ZKBUILDER_VERSION } from "@zernikalos/zkbuilder"
import { ZKO_VERSION } from "@zernikalos/zkbuilder"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Declare global variables injected by Vite
declare global {
    const __APP_VERSION__: string
}

// Reusable component for displaying information items
interface InfoDisplayItemProps {
    label: string
    value: string | number
    className?: string
}

function InfoDisplayItem({ label, value, className = "" }: InfoDisplayItemProps) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-base-foreground">
                {label}
            </span>
            <span className={`text-sm text-base-foreground font-mono bg-base-200 px-2 py-1 rounded border border-base-300 ${className}`}>
                {value}
            </span>
        </div>
    )
}

export function EnvironmentSettingsSection() {
    const engineVersion: string = zernikalos.version?.VERSION || "Unknown"
    const engineZkoVersion: string = zernikalos.version?.ZKO_VERSION || "Unknown"
    const builderVersion: string = ZKBUILDER_VERSION || "Unknown"
    const builderZkoVersion: string = ZKO_VERSION || "Unknown"

    const hasZkoMismatch =
        engineZkoVersion !== "Unknown" &&
        builderZkoVersion !== "Unknown" &&
        engineZkoVersion !== builderZkoVersion

    const zkoVersionValue = hasZkoMismatch
        ? `(engine) ${engineZkoVersion} / (builder) ${builderZkoVersion}`
        : engineZkoVersion

    return (
        <div className="h-full flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto space-y-6 p-6">
                <div>
                    <h2 className="text-2xl font-bold">Environment Information</h2>
                    <p className="text-muted-foreground">
                        System and application environment details
                    </p>
                </div>
            {/* Zernikalos Engine Information */}
            <SettingsSectionItem
                title="Zernikalos Engine"
                description="Core rendering engine version and information"
                icon={<MdBuild className="h-5 w-5" />}
            >
                <div className="space-y-2">
                    <InfoDisplayItem 
                        label="Engine Version" 
                        value={engineVersion} 
                    />
                    <InfoDisplayItem 
                        label="Builder Version" 
                        value={builderVersion} 
                    />
                    <InfoDisplayItem 
                        label="ZKO Version" 
                        value={zkoVersionValue} 
                    />
                    {hasZkoMismatch && (
                        <Alert variant="error" className="mt-2">
                            <AlertDescription>
                                Engine and builder target different ZKO versions; align them to avoid incompatibilities.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </SettingsSectionItem>

                        {/* Application Information */}
                        <SettingsSectionItem
                title="Application Details"
                description="Application version and build information"
                icon={<MdInfo className="h-5 w-5" />}
            >
                <div className="space-y-2">
                    <InfoDisplayItem 
                        label="Nest Version" 
                        value={__APP_VERSION__ || 'Unknown'} 
                    />
                    <InfoDisplayItem 
                        label="Environment" 
                        value={import.meta.env.MODE || 'development'} 
                    />
                    <InfoDisplayItem 
                        label="Build Time" 
                        value={import.meta.env.BUILD_TIME || 'Unknown'} 
                        className="bg-base-100 font-normal text-base-foreground"
                    />
                </div>
            </SettingsSectionItem>

            {/* System Information */}
            <SettingsSectionItem
                title="System Information"
                description="Operating system and platform details"
                icon={<MdComputer className="h-5 w-5" />}
            >
                <div className="space-y-2">
                    <InfoDisplayItem 
                        label="Platform" 
                        value={navigator.platform} 
                        className="bg-base-100 font-normal text-base-foreground"
                    />
                    <InfoDisplayItem 
                        label="User Agent" 
                        value={navigator.userAgent} 
                        className="bg-base-100 text-xs max-w-xs truncate text-base-foreground"
                    />
                </div>
            </SettingsSectionItem>
        </div>
        </div>
    )
}
