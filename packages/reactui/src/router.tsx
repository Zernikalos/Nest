import { createRoutes } from './keepaliverouter';
import { EditorPage } from './pages/editor';
import { ExporterPage } from './pages/ExporterPage';
import { settingsRoutes } from './pages/settings/settingsRouter';

// Route configuration for the keep-alive router
export const appRoutes = createRoutes([
    {
        path: '/',
        redirectTo: '/editor',
        index: true,
        title: 'Home'
    },
    {
        path: '/editor',
        component: EditorPage,
        title: 'Editor'
    },
    {
        path: '/devices',
        component: () => (
            <div className="p-6">
                <h1 className="text-2xl font-bold">Devices Page</h1>
                <p className="text-gray-600">This is a placeholder for the devices page.</p>
            </div>
        ),
        title: 'Devices'
    },
    {
        path: '/exporter',
        component: ExporterPage,
        title: 'Exporter'
    },
    ...settingsRoutes
]);
