import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';

import { TooltipProvider } from './components/ui/tooltip';
import { ThemeProvider, FontProvider } from './providers';
import { router } from './router';

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="default">
                <FontProvider defaultFont="Rajdhani">
                    <TooltipProvider disableHoverableContent>
                        <RouterProvider router={router} />
                    </TooltipProvider>
                </FontProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}
