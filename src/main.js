import { createApp } from 'vue'
import App from './App.vue'
import router from './renderer/router'
import './renderer/assets/style.css'

const app = createApp(App)

app.use(router).mount('#app')
