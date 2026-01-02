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

    async fetchEquipmentDetail(gymId, equipId) {
      try {
        this.loading = true
        const response = await api.get(`/api/v1/gym/${gymId}/equipment/${equipId}`)
        return response.data.data
      } catch {
        console.log('Failed to fetch equipment details')
      } finally {
        this.loading = false
      }
    },

    async deleteEquipment(gymId, equipId) {
      try {
        this.loading = true
        await api.delete(`/api/v1/gym/${gymId}/equipment/${equipId}`)
      } catch (error) {
        console.log('Failed to delete equipment:', error)
      } finally {
        this.loading = false
      }
    },

    // Di dalam actions: { ... }
    async updateEquipment(gymId, equipId, payload) {
      try {
        this.loading = true

        // Perbaikan: Konversi jumlah menjadi String sesuai permintaan API (Error 400)
        const response = await api.put(`/api/v1/gym/${gymId}/equipment/${equipId}`, {
          name: payload.name,
          jumlah: payload.jumlah.toString(), // Ubah ke String di sini
        })

        return response.data
      } catch (error) {
        console.error('Store Update Error:', error.response?.data || error.message)
        throw error
      } finally {
        this.loading = false
      }
    },
  },

  // Tambahkan di dalam actions: { ... }
  // src/stores/Equipment.js
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEquipmentStore, import.meta.hot))
}
