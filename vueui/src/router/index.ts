import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import MainLayout from '@/layouts/MainLayout.vue';

const isFileProtocol =
  typeof window !== 'undefined' && window.location.protocol === 'file:';

const router = createRouter({
  history: isFileProtocol
    ? createWebHashHistory()
    : createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/projects',
    },
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: 'projects',
          name: 'Projects',
          component: () => import('@/views/ProjectsPage.vue'),
          meta: { keepAlive: true },
        },
        {
          path: 'editor',
          name: 'Editor',
          redirect: '/editor/form',
          component: () => import('@/views/EditorPage.vue'),
          meta: { keepAlive: true },
          children: [
            {
              path: 'form',
              name: 'EditorForm',
              component: () => import('@/views/editor/EditorFormView.vue'),
              meta: { keepAlive: true },
            },
            {
              path: 'code',
              name: 'EditorCode',
              component: () => import('@/views/editor/EditorCodeView.vue'),
              meta: { keepAlive: true },
            },
            {
              path: 'viewer',
              name: 'EditorViewer',
              component: () => import('@/views/editor/EditorViewerView.vue'),
              meta: { keepAlive: true },
            },
          ],
        },
        {
          path: 'settings',
          name: 'Settings',
          redirect: '/settings/general',
          component: () => import('@/views/SettingsPage.vue'),
          meta: { keepAlive: true },
          children: [
            {
              path: 'general',
              name: 'SettingsGeneral',
              component: () => import('@/views/settings/GeneralSettingsView.vue'),
              meta: { keepAlive: true },
            },
            {
              path: 'appearance',
              name: 'SettingsAppearance',
              component: () => import('@/views/settings/AppearanceSettingsView.vue'),
              meta: { keepAlive: true },
            },
            {
              path: 'environment',
              name: 'SettingsEnvironment',
              component: () => import('@/views/settings/EnvironmentSettingsView.vue'),
              meta: { keepAlive: true },
            },
          ],
        },
        {
          path: 'devices',
          name: 'Devices',
          component: () => import('@/views/DevicesPage.vue'),
          meta: { keepAlive: true },
        },
        {
          path: 'exporter',
          name: 'Exporter',
          component: () => import('@/views/ExporterPage.vue'),
          meta: { keepAlive: true },
        },
      ],
    },
  ],
});

export default router;
