import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

const api = axios.create({ baseURL: 'https://gym-be.xianly.cloud/' })

export default defineBoot(({ app }) => {
  // Gunakan interceptor agar token selalu dicek SETIAP KALI ada request API
  api.interceptors.request.use(
    (config) => {
      // Ambil token dari storage
      const token = localStorage.getItem('access_token')

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      // Beritahu backend bahwa kita mengharapkan balasan JSON
      config.headers['Accept'] = 'application/json'

      return config
    },
    (error) => {
      return Promise.reject(error)
    },
  )

  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
