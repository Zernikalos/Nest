import { Navigate } from 'react-router-dom'
import { SettingsPage } from './SettingsPage'
import { GeneralSettingsSection, AppearanceSettingsSection } from './sections'

export const settingsRoutes = {
    path: 'settings',
    element: <SettingsPage />,
    children: [
        {
            index: true,
            element: <Navigate to="/settings/general" replace />,
        },
        {
            path: 'general',
            element: <GeneralSettingsSection />
        },
        {
            path: 'appearance',
            element: <AppearanceSettingsSection />
        }
    ]
} 