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

  // --- MIDDLEWARE AUTH ---
  Router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()

    // Cek token dari localStorage (disesuaikan dengan auth.js Anda: 'access_token')
    const token = localStorage.getItem('access_token')
    const isAuthenticated = !!token || !!authStore.token

    const publicPages = ['/login', '/register', '/lupa-password', '/verifikasi-pin']
    const isPublicPage = publicPages.includes(to.path)

    if (!isAuthenticated && !isPublicPage) {
      // Jika tidak ada token dan bukan halaman publik, paksa ke login
      next('/login')
    } else if (isAuthenticated && isPublicPage) {
      // Jika sudah login tapi mau ke login/register, lempar ke dashboard
      next('/dashboard')
    } else {
      next()
    }
  })

  return Router
})
