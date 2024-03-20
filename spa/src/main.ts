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
import userInterface from "./framework/plugins/_user-interface_"
app.use(userInterface)

// User Feedback and Analytics
import userFeedbackAndAnalytics from "./framework/features/user-feedback-and-analytics/plugin"
app.use(userFeedbackAndAnalytics);

// Mount the Vue application to DOM...
app.mount("#app")
