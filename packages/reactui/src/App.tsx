import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';

import { AppearanceProvider, ElectronProvider, ZkProjectProvider } from './providers';
import { router } from './router';

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AppearanceProvider defaultTheme="default" defaultFont="Rajdhani">
                <ElectronProvider>
                    <ZkProjectProvider>
                        <RouterProvider router={router} />
                    </ZkProjectProvider>
                </ElectronProvider>
            </AppearanceProvider>
        </QueryClientProvider>
    );
}
