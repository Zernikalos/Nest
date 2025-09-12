import { useContext } from "react"
import { ElectronProviderContext } from "./ElectronProvider"

export function useElectronEvents() {
    const context = useContext(ElectronProviderContext)

    if (context === undefined) {
        throw new Error("useElectronEvents must be used within an ElectronProvider")
    }

    return context
}
