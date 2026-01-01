import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useGymStore = defineStore('gym', {
  state: () => ({
    myGyms: [], // Menyimpan daftar gym yang dikelola user
    currentGym: null, // Menyimpan detail gym yang sedang dipilih/diedit
    selectedGymId: null,
    loading: false,
  }),

  persist: true,

  actions: {
    /**
     * Mendaftarkan Gym Baru
     * Menggunakan FormData karena mengirimkan File (Image)
     */
    setSelectedGymId(id) {
      this.selectedGymId = id
    },

    async registerGym(formData) {
      this.loading = true
      try {
        const response = await api.post('api/v1/gym', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        // Opsional: Update list gym lokal setelah berhasil daftar
        if (response.data.data) {
          this.myGyms.push(response.data.data)
        }

        return response.data
      } catch (error) {
        console.error('Error registering gym:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Mengambil semua gym milik owner yang sedang login
     */
    async fetchMyGyms() {
      this.loading = true
      try {
        const response = await api.get('api/v1/gym/my-gyms')
        this.myGyms = response.data.data
        return response.data
      } catch (error) {
        console.error('Error fetching gyms:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Mengambil detail satu gym berdasarkan ID
     */
    async fetchGymDetail(id) {
      this.loading = true
      try {
        const response = await api.get(`api/v1/gym/${id}`)
        this.currentGym = response.data.data
        return response.data
      } catch (error) {
        console.error('Error fetching gym detail:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Menghapus Gym
     */
    async deleteGym(id) {
      try {
        await api.delete(`api/v1/gym/${id}`)
        this.myGyms = this.myGyms.filter((gym) => gym.id !== id)
      } catch (error) {
        console.error('Error deleting gym:', error)
        throw error
      }
    },
  },
})
