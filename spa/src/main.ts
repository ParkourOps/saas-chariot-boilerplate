import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// User Interface System
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/aura-light-amber/theme.css'
app.use(PrimeVue)

// Mount the Vue application to DOM...
app.mount('#app')
