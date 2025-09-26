import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { SpeedInsights } from "@vercel/speed-insights/next"
const app = createApp(App)

// 将 SpeedInsights 注册为全局组件
app.component('SpeedInsights', SpeedInsights)

app.mount('#app')

createApp(App).use(router).mount('#app')