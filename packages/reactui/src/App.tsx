import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';

import { TooltipProvider } from './components/ui/tooltip';
import { AppearanceProvider } from './providers';
import { FileImportProvider } from './providers/FileImportProvider';
import { router } from './router';

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AppearanceProvider defaultTheme="default" defaultFont="Rajdhani">
                <FileImportProvider>
                    <TooltipProvider disableHoverableContent>
                        <RouterProvider router={router} />
                    </TooltipProvider>
                </FileImportProvider>
            </AppearanceProvider>
        </QueryClientProvider>
    );
}
