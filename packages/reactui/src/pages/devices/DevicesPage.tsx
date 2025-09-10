import { DebuggerKey } from "./DebuggerKey"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BsWifi, BsPhone, BsCpu, BsShieldCheck } from "react-icons/bs"

export function DevicesPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Devices</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage and monitor your connected devices
                    </p>
                </div>
                <Badge variant="secondary" className="flex items-center gap-2">
                    <BsWifi className="h-4 w-4" />
                    Online
                </Badge>
            </div>

            <div className="grid gap-6">
                {/* Debug Key Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BsShieldCheck className="h-5 w-5" />
                            Debug Configuration
                        </CardTitle>
                        <CardDescription>
                            Use this key to connect your devices to the debugger
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DebuggerKey />
                    </CardContent>
                </Card>

                <Separator />

                {/* Connected Devices Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BsPhone className="h-5 w-5" />
                            Connected Devices
                        </CardTitle>
                        <CardDescription>
                            Currently connected devices and their status
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Placeholder for device list */}
                            <div className="text-center py-8 text-muted-foreground">
                                <BsCpu className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No devices connected</p>
                                <p className="text-sm">Use the debug key above to connect a device</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
