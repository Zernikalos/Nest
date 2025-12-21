import { createRoutes } from '@/keepaliverouter';
import { EditorPage } from './EditorPage';
import { EditorViewer } from './EditorViewer/EditorViewer';
import { EditorForm } from './EditorForm/EditorForm';
import { EditorCode } from './EditorCode';

/**
 * Editor routes configuration for keep-alive router
 * Uses nested routes structure with KeepAliveOutlet for content management
 */
export const editorRoutes = createRoutes([
    {
        path: '/editor',
        component: EditorPage,
        title: 'Editor',
        children: [
            {
                path: '', // Index route - empty path
                redirectTo: '/editor/form',
                index: true
            },
            {
                path: 'form',
                component: EditorForm,
                title: 'Form Editor'
            },
            {
                path: 'code',
                component: EditorCode,
                title: 'Code Editor'
            },
            {
                path: 'viewer',
                component: EditorViewer,
                title: '3D Viewer'
            }
        ]
    }
]);

