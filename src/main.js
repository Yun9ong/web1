import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { SpeedInsights } from "@vercel/speed-insights/next"

createApp(App)
  .use(router)   // <-- 关键
  .mount('#app')