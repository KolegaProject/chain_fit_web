import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { Notify } from 'quasar'
import { useGymStore } from 'src/stores/Gym'

export const useStaffStore = defineStore('staff', {
  state: () => ({
    rows: [],
    loading: false,
  }),

  actions: {
    async fetchStaffData() {
      const gymStore = useGymStore()
      const gymId = gymStore.selectedGymId || 1 // Ambil dari store atau default 1

      this.loading = true
      try {
        // Perbaikan: gymId sekarang sudah terdefinisi
        const response = await api.get(`/api/v1/gym/${gymId}/gym-staff`)
        if (response.data.code === 200) {
          this.rows = response.data.data
        }
      } catch {
        Notify.create({ type: 'negative', message: 'Gagal memuat data staff' })
      } finally {
        this.loading = false
      }
    },

    async updateStaff(gymId, userId, payload) {
      this.loading = true
      try {
        // Gunakan FormData karena API menerima File (image)
        const formData = new FormData()
        formData.append('name', payload.nama)
        formData.append('email', payload.email)

        // Append file jika ada (payload.image adalah objek File dari input)
        if (payload.imageFile) {
          formData.append('image', payload.imageFile)
        }

        const response = await api.put(`/api/v1/gym/${gymId}/gym-staff/${userId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        if (response.status === 200 || response.data.code === 200) {
          Notify.create({
            type: 'positive',
            message: 'Data staff berhasil diperbarui',
            position: 'top',
          })
          return true
        }
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Gagal memperbarui staff'
        Notify.create({ type: 'negative', message: errorMsg, position: 'top' })
        return false
      } finally {
        this.loading = false
      }
    },

    async createStaff(gymId, payload) {
      this.loading = true
      try {
        const body = {
          name: payload.nama,
          username: payload.username,
          password: payload.password,
          email: payload.email,
        }
        const response = await api.post(`/api/v1/gym/${gymId}/gym-staff`, body)

        if (response.status === 201 || response.data.code === 200) {
          // OPTIMASI: Tambahkan data yang baru dibuat ke dalam state local
          // Jika API mengembalikan data object staff yang baru, gunakan itu:
          if (response.data.data) {
            this.rows.push(response.data.data)
          }

          Notify.create({
            type: 'positive',
            message: 'Staff berhasil ditambahkan',
            position: 'top',
          })
          return true
        }
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Gagal menambahkan staff'
        Notify.create({
          type: 'negative',
          message: errorMsg,
          position: 'top',
        })
        return false
      } finally {
        this.loading = false
      }
    },

    // ... state lainnya

    async fetchStaffById(gymId, userId) {
      this.loading = true
      try {
        const response = await api.get(`/api/v1/gym/${gymId}/gym-staff/${userId}`)
        if (response.data.code === 200) {
          return response.data.data
        }
      } catch {
        Notify.create({ type: 'negative', message: 'Gagal mengambil detail staff' })
        return null
      } finally {
        this.loading = false
      }
    },

    async deleteStaff(gymId, userId) {
      try {
        // URL sekarang menggunakan gymId dinamis dari parameter
        const response = await api.delete(`/api/v1/gym/${gymId}/gym-staff/${userId}`)

        if (response.status === 200 || response.data.code === 200) {
          // Hapus dari state lokal agar tabel langsung terupdate
          this.rows = this.rows.filter((item) => item.id !== userId)

          Notify.create({
            type: 'positive',
            message: 'Staff berhasil dihapus',
            position: 'top',
          })
          return true
        }
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Gagal menghapus staff'
        Notify.create({
          type: 'negative',
          message: errorMsg,
          position: 'top',
        })
        return false
      }
    },
  },
})
