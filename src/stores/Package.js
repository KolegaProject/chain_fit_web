import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const usePackageStore = defineStore('package', {
  state: () => ({
    subscriptionPlans: [],
    loading: false,
  }),

  actions: {
    async fetchPlans(gymId) {
      this.loading = true
      try {
        const response = await api.get(`/api/v1/gym/${gymId}/paket-member`)
        this.subscriptionPlans = response.data.data
      } catch (error) {
        console.error('Gagal mengambil paket:', error)
      } finally {
        this.loading = false
      }
    },

    // Action untuk membuat paket baru
    async createPlan(gymId, planData) {
      try {
        // Bungkus planData ke dalam Array sesuai contoh request Anda
        const payload = [
          {
            name: planData.name,
            price: String(planData.price), // Pastikan string jika backend minta string
            durationDays: Number(planData.durationDays),
            benefit: planData.benefit,
          },
        ]
        await api.post(`/api/v1/gym/${gymId}/paket-member`, payload)
      } catch (error) {
        console.error('Error creating plan:', error)
        throw error
      }
    },

    async updatePlanBenefit(gymId, paketId, benefits) {
      try {
        const payload = {
          benefit: benefits, // Sesuai format: { "benefit": ["...", "..."] }
        }
        await api.put(`/api/v1/gym/${gymId}/paket-member/${paketId}`, payload)
      } catch (error) {
        console.error('Gagal update benefit:', error)
        throw error
      }
    },

    async deletePlan(gymId, paketId) {
      try {
        await api.delete(`/api/v1/gym/${gymId}/paket-member/${paketId}`)
        this.subscriptionPlans = this.subscriptionPlans.filter((p) => p.id !== paketId)
      } catch (error) {
        throw error
      }
    },
  },
})
