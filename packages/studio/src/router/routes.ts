import {RouteRecordRaw} from "vue-router"

const routes: RouteRecordRaw[] = [
    {
        path: "",
        redirect: "/studio"
    },
    {
        name: "main",
        path: "/",
        component: () => import("layouts/MainLayout.vue"),
        children: [
            {
                name: "studio",
                path: "studio",
                component: () => import("pages/StudioPage.vue")
            },
            {
                name: "import",
                path: "/import",
                component: () => import("pages/ImportPage.vue")
            },
            {
                name: "bundle",
                path: "/bundle",
                component: () => import("pages/BundlePage.vue")
            },
            {
                name: "settings",
                path: "/settings",
                component: () => import("pages/SettingsPage.vue")
            }
        ]
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path: "/:catchAll(.*)*",
        component: () => import("pages/ErrorNotFound.vue")
    }
]

export default routes
