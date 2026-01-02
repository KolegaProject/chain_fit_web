import { defineStore } from 'pinia'
import { api } from 'boot/axios' // Pastikan axios sudah terkonfigurasi
import { Notify } from 'quasar'

export const useStaffStore = defineStore('staff', {
  state: () => ({
    rows: [],
    loading: false,
  }),

  actions: {
    async fetchStaffData() {
      this.loading = true
      try {
        // Ganti :id dengan id gym yang dinamis jika perlu
        const response = await api.get('/api/v1/gym/1/gym-staff')
        if (response.data.code === 200) {
          this.rows = response.data.data
        }
      } catch {
        Notify.create({ type: 'negative', message: 'Gagal memuat data staff' })
      } finally {
        this.loading = false
      }
    },

    async deleteStaff(id) {
      try {
        // Logika hapus ke API
        // await api.delete(`/api/v1/gym/1/gym-staff/${id}`)
        this.rows = this.rows.filter((item) => item.id !== id)
        Notify.create({ type: 'positive', message: 'Staff berhasil dihapus' })
      } catch {
        Notify.create({ type: 'negative', message: 'Gagal menghapus staff' })
      }
    },
  },
})
