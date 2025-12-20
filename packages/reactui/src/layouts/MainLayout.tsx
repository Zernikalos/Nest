import { KeepAliveOutlet } from '@/keepaliverouter';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { useElectronProjectIntegration } from '@/hooks/useElectronProjectIntegration';

export function MainLayout() {
    // Initialize Electron integration here, after KeepAliveRouterProvider is available
    useElectronProjectIntegration()
    
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <Sidebar />
            
            {/* Main content - scroll is handled by KeepAliveOutlet inside Activity */}
            <main 
                id="router-view" 
                className="flex flex-col flex-1 overflow-hidden"
            >
                <KeepAliveOutlet className="h-full overflow-y-auto"/>
            </main>
        </div>
    );
}
