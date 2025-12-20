import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AppearanceProvider, ElectronProvider } from './providers';
import { KeepAliveRouterProvider } from './keepaliverouter';
import { appRoutes } from './router';
import { MainLayout } from './layouts/MainLayout';
import { LogLevel, setGlobalLogLevel } from './logger';

const queryClient = new QueryClient();

setGlobalLogLevel(LogLevel.INFO);

function AppContent() {
    return (
        <KeepAliveRouterProvider 
            routes={appRoutes} 
        >
            <MainLayout />
        </KeepAliveRouterProvider>
    )
}

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AppearanceProvider defaultTheme="default" defaultFont="Rajdhani">
                <ElectronProvider>
                    <AppContent />
                </ElectronProvider>
            </AppearanceProvider>
        </QueryClientProvider>
    );
}
