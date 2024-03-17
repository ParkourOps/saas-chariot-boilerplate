import { createApp } from "vue"
import App from "./App.vue"
const app = createApp(App)

// State Store
import { createPinia } from "pinia"
app.use(createPinia())

// Router
import router from "./router"
app.use(router)

// User Interface System
import PrimeVue from "primevue/config"
import "@/assets/style/global.css"
// @ts-ignore
import Lara from "@/assets/style/theme/primevue-presets/lara"
app.use(PrimeVue, {
    unstyled: true,
    pt: Lara
})

// Mount the Vue application to DOM...
app.mount("#app")
