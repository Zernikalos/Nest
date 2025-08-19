import { createRoutes } from '@/keepaliverouter';
import { SettingsPage } from './SettingsPage';
import { GeneralSettingsSection } from './sections/general';
import { AppearanceSettingsSection } from './sections/appearance';

/**
 * Settings routes configuration for keep-alive router
 * Uses hierarchical routes structure with KeepAliveOutlet for content management
 */
export const settingsRoutes = createRoutes([
    {
        path: '/settings',
        component: SettingsPage,
        title: 'Settings',
        children: [
            {
                path: '', // Index route - empty path
                redirectTo: '/settings/general',
                index: true
            },
            {
                path: 'general',
                component: GeneralSettingsSection,
                title: 'General Settings'
            },
            {
                path: 'appearance',
                component: AppearanceSettingsSection,
                title: 'Appearance Settings'
            }
        ]
    }
]); 