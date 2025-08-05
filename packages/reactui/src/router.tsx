import { createBrowserRouter, Navigate } from 'react-router-dom';

import { MainLayout } from './layouts/MainLayout';
import Editor from './pages/Editor';
import { SettingsPage } from './pages/settings/SettingsPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Navigate to="/editor" replace />,
            },
            {
                path: 'editor',
                element: <Editor />,
            },
            {
                path: 'devices',
                element: <div>Devices Page</div>, // Placeholder component
            },
            {
                path: 'exporter',
                element: <div>Export Page</div>, // Placeholder component
            },
            {
                path: 'settings',
                element: <SettingsPage />
            },
        ],
    },
]);
