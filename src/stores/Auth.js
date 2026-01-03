import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    gyms: [],
    token: null,
    refreshToken: null,
  }),

  persist: true,

  actions: {
    setUser(userData, gymData = []) {
      this.user = userData
      this.gyms = gymData
    },

    // Get profile user yang sedang login
    async fetchUser() {
      try {
        const response = await api.get('api/v1/auth/me')
        const { user, gyms } = response.data.data

        this.user = user
        this.gyms = gyms

        return response.data
      } catch (error) {
        // Jika token expired atau error, bisa handle logout di sini
        console.error('Error fetching user:', error)
        throw error
      }
    },

    // Register owner baru
    async register(credential) {
      const response = await api.post('api/v1/auth/register-owner', credential)
      return response.data
    },

    // Login user dan simpan token
    async login(credential) {
      const response = await api.post('api/v1/auth/login', credential)
      const { access_token, refresh_token } = response.data.data

      this.token = access_token
      this.refreshToken = refresh_token

      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)

      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

      // Opsional: Langsung panggil fetchUser setelah login berhasil
      await this.fetchUser()

      return response.data
    },

    // Logout user dan hapus token
    logout() {
      this.token = null
      this.refreshToken = null
      this.user = null
      this.gyms = []

      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      delete api.defaults.headers.common['Authorization']
    },
  },
})
