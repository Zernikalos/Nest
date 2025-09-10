import { createRoutes } from './keepaliverouter';
import { EditorPage } from './pages/editor';
import { DevicesPage } from './pages/devices';
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
        component: DevicesPage,
        title: 'Devices'
    },
    {
        path: '/exporter',
        component: ExporterPage,
        title: 'Exporter'
    },
    ...settingsRoutes
]);
