import { MdInfo, MdComputer, MdBuild } from "react-icons/md"
import { SettingsSectionItem } from "../../components/layout"
import { zernikalos } from "@/lib/zernikalos"
import { ZKBUILDER_VERSION } from "@zernikalos/zkbuilder"
import { ZKO_VERSION } from "@zernikalos/zkbuilder"
import { InfoDisplayItem } from "./InfoDisplayItem"
import _ from "lodash"

// Declare global variables injected by Vite
declare global {
    const __APP_VERSION__: string
}

export function EnvironmentSettingsSection() {
    const zkVersionInfo = getVersionValues()
    const engineError = zkVersionInfo.engineMissing ? "Engine version is missing." : undefined
    const builderError = zkVersionInfo.builderMissing ? "Builder version is missing." : undefined
    const zkoError = zkVersionInfo.zkoVersionMismatch
        ? `Engine and builder target different ZKO versions; align them to avoid incompatibilities. The ZKO version in zkbuilder is ${zkVersionInfo.builderZkoVersion ?? "unknown"} and in zernikalos is ${zkVersionInfo.engineZkoVersion ?? "unknown"}.`
        : undefined


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
                        value={zkVersionInfo.engineVersion ?? "Unavailable"} 
                        hasError={zkVersionInfo.engineMissing}
                        errorMessages={engineError}
                    />
                    <InfoDisplayItem 
                        label="Builder Version" 
                        value={zkVersionInfo.builderVersion ?? "Unavailable"} 
                        hasError={zkVersionInfo.builderMissing}
                        errorMessages={builderError}
                    />
                    <InfoDisplayItem 
                        label="ZKO Version" 
                        value={zkVersionInfo.zkoVersion} 
                        hasError={zkVersionInfo.zkoVersionMismatch}
                        errorMessages={zkoError}
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

interface ZkVersionInfo {
    engineVersion?: string
    builderVersion?: string
    zkoVersion: string
    engineZkoVersion?: string
    builderZkoVersion?: string
    engineMissing: boolean
    builderMissing: boolean
    zkoVersionMismatch: boolean
}

function getVersionValues(): ZkVersionInfo {
    const engineVersion = zernikalos.version?.VERSION
    const builderVersion = ZKBUILDER_VERSION
    const engineZkoVersion = zernikalos.version?.ZKO_VERSION
    const builderZkoVersion = ZKO_VERSION

    const engineZkoMissing = _.isNil(engineZkoVersion)
    const builderZkoMissing = _.isNil(builderZkoVersion)
    const mismatch =
        !engineZkoMissing &&
        !builderZkoMissing &&
        !_.isEqual(engineZkoVersion, builderZkoVersion)

    const zkoVersion = mismatch ? "Unavailable" : engineZkoVersion

    const zkVersionInfo: ZkVersionInfo = {
        engineVersion: engineVersion,
        builderVersion: builderVersion,
        zkoVersion,
        engineZkoVersion: engineZkoVersion,
        builderZkoVersion: builderZkoVersion,
        engineMissing: engineZkoMissing,
        builderMissing: builderZkoMissing,
        zkoVersionMismatch: mismatch,
    }

    return zkVersionInfo
}
