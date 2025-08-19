import { KeepAliveOutlet } from '@/keepaliverouter';
import { Sidebar } from '@/components/sidebar/Sidebar';

export function MainLayout() {
    return (
        <div className="h-screen">
            <div className="grid h-screen">
                <div className="grid grid-rows-1 grid-cols-[56px_minmax(0,1fr)] max-h-screen">
                    <Sidebar />
                    <main id="router-view" className="overflow-y-auto">
                        <KeepAliveOutlet className="h-full" />
                    </main>
                </div>
            </div>
        </div>
    );
}
