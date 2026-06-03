import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'
import { useAuthStore } from 'src/stores/Auth' // Import store auth Anda

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  Router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()

    const token = localStorage.getItem('access_token')
    const isAuthenticated = !!token || !!authStore.token

    const publicPages = [
      '/login',
      '/register',
      '/lupa-password',
      '/verifikasi-pin',
      '/reset-password',
    ]
    const isPublicPage = publicPages.includes(to.path)

    if (!isAuthenticated && !isPublicPage) {
      next('/login')
    } else if (isAuthenticated && isPublicPage) {
      next('/dashboard')
    } else {
      next()
    }
  })

  return Router
})
