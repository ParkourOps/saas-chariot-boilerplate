import { createRouter, createWebHistory } from "vue-router/auto"

const router = createRouter({
    history: createWebHistory()
});

export default router;

declare module 'vue-router' {
    interface RouteMeta {
        // must be declared by every route
        showTopBar: boolean,
        requiresAuth: boolean
    }
}
