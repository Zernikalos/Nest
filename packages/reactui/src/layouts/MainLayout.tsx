import { KeepAliveOutlet } from '@/keepaliverouter';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { useElectronProjectIntegration } from '@/hooks/useElectronProjectIntegration';

export function MainLayout() {
    // Initialize Electron integration here, after KeepAliveRouterProvider is available
    useElectronProjectIntegration()
    
    return (
        <div className="h-screen">
            <div className="grid h-screen">
                <div className="grid grid-rows-1 grid-cols-[56px_minmax(0,1fr)] max-h-screen">
                    <Sidebar />
                    <main id="router-view" className="flex flex-col">
                        <KeepAliveOutlet className="flex-1" />
                    </main>
                </div>
            </div>
        </div>
    );
}
