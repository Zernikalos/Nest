import { useEffect } from 'react';
import { createRoutes } from './keepaliverouter';
import { EditorPage } from './pages/editor';
import { useNavigate } from './keepaliverouter';

// Custom Navigate component for redirects
const Navigate = ({ to }: { to: string; replace?: boolean }) => {
    const navigate = useNavigate();
    
    useEffect(() => {
        navigate(to);
    }, [navigate, to]);

    return null; // This component renders nothing
};

// Route configuration for the keep-alive router
export const appRoutes = createRoutes([
    {
        path: '/',
        component: () => <Navigate to="/editor" replace />,
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
        component: () => (
            <div className="p-6">
                <h1 className="text-2xl font-bold">Export Page</h1>
                <p className="text-gray-600">This is a placeholder for the export page.</p>
            </div>
        ),
        title: 'Exporter'
    }
]);
