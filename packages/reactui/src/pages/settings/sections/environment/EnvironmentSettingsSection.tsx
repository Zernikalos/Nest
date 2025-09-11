import { MdInfo, MdComputer, MdBuild } from "react-icons/md"
import { SettingsSectionItem } from "../../components/layout"
import { zernikalos } from "@/lib/zernikalos"

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
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </span>
            <span className={`text-sm text-secondary-foreground font-mono bg-secondary px-2 py-1 rounded ${className}`}>
                {value}
            </span>
        </div>
    )
}

export function EnvironmentSettingsSection() {
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
                        value={zernikalos.version?.VERSION || 'Unknown'} 
                    />
                    <InfoDisplayItem 
                        label="ZKO Version Support" 
                        value={zernikalos.version?.ZKO_VERSION || 'Unknown'} 
                    />
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
                        className="bg-transparent font-normal"
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
                        className="bg-transparent font-normal"
                    />
                    <InfoDisplayItem 
                        label="User Agent" 
                        value={navigator.userAgent} 
                        className="text-xs max-w-xs truncate"
                    />
                </div>
            </SettingsSectionItem>
        </div>
        </div>
    )
}
