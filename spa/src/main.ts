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
import userInterface from "./framework/libraries/user-interface"
app.use(userInterface)

// Mount the Vue application to DOM...
app.mount("#app")
