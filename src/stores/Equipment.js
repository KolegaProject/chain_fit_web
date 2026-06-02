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

        const fd = new FormData()
        fd.append('name', data.name)
        fd.append('videoURL', data.videoUrl || '')
        fd.append('jum', String(Number(data.qty || 0)))
        fd.append('description', data.description || '')

        const file = Array.isArray(data.image) ? data.image[0] : data.image
        if (file) fd.append('image', file)

        const response = await api.post(`/api/v1/gym/${gymId}/equipment`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        return response.data.data
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
      } catch (error) {
        void error
      } finally {
        this.loading = false
      }
    },

    async deleteEquipment(gymId, equipId) {
      try {
        this.loading = true
        await api.delete(`/api/v1/gym/${gymId}/equipment/${equipId}`)
      } catch (error) {
        void error
      } finally {
        this.loading = false
      }
    },

    async updateEquipment(gymId, equipId, payload) {
      try {
        this.loading = true

        const fd = new FormData()
        fd.append('name', payload.name ?? '')
        fd.append('jumlah', String(payload.qty ?? payload.jumlah ?? 0))

        if (payload.description) fd.append('description', payload.description)
        if (payload.healthStatus) fd.append('healthStatus', payload.healthStatus)

        if (payload.imageFile instanceof File) {
          fd.append('image', payload.imageFile)
        }

        const response = await api.put(`/api/v1/gym/${gymId}/equipment/${equipId}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        return response.data.data
      } catch (error) {
        console.error('Store Update Error:', error.response?.data || error.message)
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
