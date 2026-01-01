import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),

  actions: {
    // ESLint akan senang dengan kode ringkas ini
    async register(credential) {
      const response = await api.post('api/v1/auth/register-owner', credential)
      return response.data
    },
  },
})
