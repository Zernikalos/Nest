import { Outlet } from 'react-router-dom';

import { Sidebar } from '@/components/sidebar/Sidebar';
import { FileImportIndicators } from '@/components/FileImportIndicators';

export function MainLayout() {
    return (
        <div className="h-screen">
            <div className="grid h-screen">
                <div className="grid grid-rows-1 grid-cols-[56px_minmax(0,1fr)] max-h-screen">
                    <Sidebar />
                    <main id="router-view" className="overflow-y-auto">
                        <Outlet />
                    </main>
                </div>
            </div>
            
            {/* Global file import indicators */}
            <FileImportIndicators />
        </div>
    );
}
