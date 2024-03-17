import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// User Interface System
import PrimeVue from 'primevue/config'
import "@/assets/style/style.css"
// @ts-ignore
import Lara from '@/assets/style/primevue-presets/lara' 
app.use(PrimeVue, {
    unstyled: true,
    pt: Lara
})

// Mount the Vue application to DOM...
app.mount('#app')
