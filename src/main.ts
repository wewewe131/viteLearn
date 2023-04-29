import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './assets/main.css'
import 'element-plus/dist/index.css'

// 拦截快捷键
// document.onkeydown = function (e) {
//   if (e.key == "F5" || ((e.key == "R" || e.key == "r") && e.ctrlKey)) {
//     return false
//   }

//   return true;

// }

const app = createApp(App)
let pstate = createPinia()
app.use(ElementPlus)
app.use(pstate)
app.use(router)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')

export default app