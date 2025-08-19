import { createRoutes } from '@/keepaliverouter';
import { SettingsPage } from './SettingsPage';

/**
 * Settings routes configuration for keep-alive router
 * Uses flat routes structure with internal content management
 */
export const settingsRoutes = createRoutes([
    {
        path: '/settings',
        component: SettingsPage,
        title: 'Settings'
    },
    {
        path: '/settings/general',
        component: SettingsPage,
        title: 'General Settings'
    },
    {
        path: '/settings/appearance',
        component: SettingsPage,
        title: 'Appearance Settings'
    }
]); 