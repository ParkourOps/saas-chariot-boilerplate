import router from "@/router";
import type { RouteLocationRaw } from "vue-router/auto";

export default function (route: RouteLocationRaw) {
    const _route = router.resolve(route);
    return window.location.origin + _route.href;
}
