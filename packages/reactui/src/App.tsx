import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AppearanceProvider, ElectronProvider, ZkProjectProvider } from './providers';
import { KeepAliveRouterProvider } from './keepaliverouter';
import { appRoutes } from './keepalive-router.config';
import { MainLayout } from './layouts/MainLayout';

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AppearanceProvider defaultTheme="default" defaultFont="Rajdhani">
                <ElectronProvider>
                    <ZkProjectProvider>
                        <KeepAliveRouterProvider 
                            routes={appRoutes} 
                            initialRoute="/editor"
                        >
                            <MainLayout />
                        </KeepAliveRouterProvider>
                    </ZkProjectProvider>
                </ElectronProvider>
            </AppearanceProvider>
        </QueryClientProvider>
    );
}
