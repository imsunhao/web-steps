import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'

/**
 * 生成 vm app
 */
export function createApp() {
  const router = createRouter()

  const app = new Vue({
    router,
    render: h => h(App)
  })

  return { app, router }
}
