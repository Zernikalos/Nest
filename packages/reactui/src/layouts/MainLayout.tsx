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
                
                {/* Main content with scroll */}
                <main 
                    id="router-view" 
                    className="flex flex-col flex-1 ml-[56px] h-screen overflow-y-auto"
                >
                    <KeepAliveOutlet/>
                </main>
            </div>
        </div>
    );
}
