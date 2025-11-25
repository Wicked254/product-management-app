import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

// Restore session
import { useAuthStore } from './stores/auth'
useAuthStore().restoreSession()

app.mount('#app')
