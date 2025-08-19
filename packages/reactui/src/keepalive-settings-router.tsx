import { createRoutes } from './keepaliverouter';
import { SettingsPage } from './pages/settings/SettingsPage';
import { GeneralSettingsSection, AppearanceSettingsSection } from './pages/settings/sections';

/**
 * Settings routes configuration for keep-alive router
 * Uses nested routes where children paths are relative to parent
 */
export const keepAliveSettingsRoutes = createRoutes([
    {
        path: '/settings',
        component: SettingsPage,
        title: 'Settings',
        children: [
            {
                path: '',  // Empty path = index route (/settings)
                redirectTo: 'general',  // Redirect to /settings/general
                index: true,
                title: 'Settings Home'
            },
            {
                path: 'general',  // Becomes /settings/general
                component: GeneralSettingsSection,
                title: 'General Settings'
            },
            {
                path: 'appearance',  // Becomes /settings/appearance
                component: AppearanceSettingsSection,
                title: 'Appearance Settings'
            }
        ]
    }
]);


