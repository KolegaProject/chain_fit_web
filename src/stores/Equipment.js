import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'boot/axios'

export const useEquipmentStore = defineStore('equipment', {
  state: () => ({
    equipments: [],
    loading: false,
  }),

  actions: {
    async fetchEquipments(gymId) {
      try {
        this.loading = true
        const response = await api.get(`/api/v1/gym/${gymId}/equipment`)
        // Sesuaikan dengan struktur return API Anda: response.data.data
        this.equipments = response.data.data || []
        return this.equipments
      } catch (error) {
        console.error('Error fetching equipments:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async createEquipment(gymId, data) {
      try {
        this.loading = true
        const payload = {
          name: data.name,
          videoURL: data.videoUrl,
          jumlah: Number(data.qty),
        }
        const response = await api.post(`/api/v1/gym/${gymId}/equipment`, payload)
        return response.data
      } catch (error) {
        console.error('Error creating equipment:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEquipmentStore, import.meta.hot))
}
