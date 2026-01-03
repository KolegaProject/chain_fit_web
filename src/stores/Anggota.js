import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useAnggotaStore = defineStore('anggota', {
  state: () => ({
    rows: [],
    riwayatAbsensi: [],
    loading: false,
    loadingRiwayat: false,
    total: 0
  }),

  actions: {
    // =============================
    // GET LIST ANGGOTA GYM
    // =============================
    async fetchAnggota(gymId) {
      this.loading = true
      try {
        const res = await api.get(`/api/v1/gym/${gymId}/memberships`)

        this.rows = res.data.data.map(item => ({
          id: item.id,
          name: item.user?.name ?? '-',
          email: item.user?.email ?? '-',
          status: item.status,
          masaAktifHari: item.masaAktifHari
        }))

        this.total = res.data.recordsTotal
      } catch (error) {
        console.error('Gagal mengambil data anggota:', error)
        this.rows = []
      } finally {
        this.loading = false
      }
    },

    // =============================
    // GET RIWAYAT ABSENSI
    // =============================
    async fetchRiwayatAbsensi(gymId) {
      this.loadingRiwayat = true
      try {
        const res = await api.get(`/api/v1/attendance/history/${gymId}`)
        this.riwayatAbsensi = res.data.data
      } catch (error) {
        console.error('Gagal mengambil riwayat absensi:', error)
        this.riwayatAbsensi = []
      } finally {
        this.loadingRiwayat = false
      }
    },

    // =============================
    // DELETE ANGGOTA
    // =============================
    async deleteAnggota(memberId) {
      try {
        // try to call backend delete endpoint if available
        await api.delete(`/api/v1/membership/${memberId}`)
        // remove from local rows
        this.rows = (this.rows || []).filter(r => r.id !== memberId)
      } catch (err) {
        // if API fails, still attempt local removal so UI can update
        console.error('deleteAnggota error:', err)
        this.rows = (this.rows || []).filter(r => r.id !== memberId)
        throw err
      }
    }
  }
})
