import { KeepAliveOutlet } from '@/keepaliverouter';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { useElectronProjectIntegration } from '@/hooks/useElectronProjectIntegration';

export function MainLayout() {
    // Initialize Electron integration here, after KeepAliveRouterProvider is available
    useElectronProjectIntegration()
    
    return (
        <div className="h-screen overflow-hidden">
            <div className="flex h-screen">
                {/* Fixed Sidebar */}
                <div className="fixed left-0 top-0 h-screen z-10">
                    <Sidebar />
                </div>
                
                {/* Main content without scroll - scroll is handled by KeepAliveOutlet inside Activity */}
                <main 
                    id="router-view" 
                    className="flex flex-col flex-1 ml-[56px] overflow-hidden"
                >
                    <KeepAliveOutlet className="h-full overflow-y-auto"/>
                </main>
            </div>
        </div>
    );
}
