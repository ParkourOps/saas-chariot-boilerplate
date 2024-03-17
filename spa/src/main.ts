import { createApp } from "vue"
import App from "./App.vue"
const app = createApp(App)

// State Store
import { createPinia } from "pinia"
app.use(createPinia())

// Router
import { createRouter, createWebHistory } from "vue-router/auto"
const router = createRouter({
    history: createWebHistory()
})
app.use(router)

// User Interface System
import PrimeVue from "primevue/config"
import "@/assets/style/style.css"
// @ts-ignore
import Lara from "@/assets/style/primevue-presets/lara"
app.use(PrimeVue, {
    unstyled: true,
    pt: Lara
})

// Mount the Vue application to DOM...
app.mount("#app")
