import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const usePackageStore = defineStore('package', {
  state: () => ({
    subscriptionPlans: [],
    loading: false,
  }),

  // Actions untuk mengelola paket member
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

    // Membuat paket member baru
    async createPlan(gymId, planData) {
      try {
        const payload = [
          {
            name: planData.name,
            price: String(planData.price),
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

    // Update benefit paket member
    async updatePlanBenefit(gymId, paketId, benefits) {
      try {
        const payload = {
          benefit: benefits,
        }
        await api.put(`/api/v1/gym/${gymId}/paket-member/${paketId}`, payload)
      } catch (error) {
        console.error('Gagal update benefit:', error)
        throw error
      }
    },

    // Delete paket member
    async deletePlan(gymId, paketId) {
      try {
        await api.delete(`/api/v1/gym/${gymId}/paket-member/${paketId}`)
        this.subscriptionPlans = this.subscriptionPlans.filter((p) => p.id !== paketId)
      } catch (error) {
        console.error('Gagal delete plan:', error)
      }
    },
  },
})
