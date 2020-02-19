import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// Home Page
const HomePage = () => import('../views/index.vue')

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        name: 'home',
        component: HomePage
      }
    ]
  })
}
