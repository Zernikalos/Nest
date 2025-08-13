import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';

import { AppearanceProvider, ElectronProvider } from './providers';
import { FileImportProvider } from './providers/FileImportProvider';
import { router } from './router';

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AppearanceProvider defaultTheme="default" defaultFont="Rajdhani">
                <ElectronProvider>
                    <FileImportProvider>
                        <RouterProvider router={router} />
                    </FileImportProvider>
                </ElectronProvider>
            </AppearanceProvider>
        </QueryClientProvider>
    );
}
