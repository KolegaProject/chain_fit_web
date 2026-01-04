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
    async fetchAnggota(gymId) {
      this.loading = true
      try {
        const res = await api.get(`/api/v1/gym/${gymId}/memberships`)

        this.rows = res.data.data.map(item => ({
          id: item.id,
          name: item.user?.name ?? '-',
          email: item.user?.email ?? '-',
          status: item.status,
          masaAktifHari: item.masaAktifHari,
          paketId: item.paketId ?? null
        }))

        this.total = res.data.recordsTotal ?? this.rows.length
      } catch (err) {
        console.error('Gagal mengambil data anggota:', err)
        this.rows = []
      } finally {
        this.loading = false
      }
    },

    async fetchRiwayatAbsensi(gymId) {
      this.loadingRiwayat = true
      try {
        const res = await api.get(`/api/v1/attendance/history/${gymId}`)
        this.riwayatAbsensi = res.data.data ?? []
      } catch (err) {
        console.error('Gagal mengambil riwayat absensi:', err)
        this.riwayatAbsensi = []
      } finally {
        this.loadingRiwayat = false
      }
    },

    async deleteAnggota(gymId, membershipId) {
      try {
        await api.delete(`/api/v1/gym/${gymId}/memberships/${membershipId}`)
        this.rows = this.rows.filter(r => r.id !== membershipId)
      } catch (err) {
        const message =
          err.response?.data?.message ||
          'Member masih aktif dan tidak bisa dihapus'

        throw new Error(message)
      }
    },

    async updateMembership(gymId, membershipId, payload) {
      try {
        return await api.put(
          `/api/v1/gym/${gymId}/memberships/${membershipId}`,
          payload
        )
      } catch (err) {
        const message =
          err.response?.data?.message ||
          'Membership masih aktif, tidak dapat diubah'

        throw new Error(message)
      }
    },

    async createAbsensi(membershipId) {
      try {
        await api.post('/api/v1/attendance', {
          membershipId
        })
      } catch (err) {
        console.error('Gagal menambah absensi:', err)
        throw err
      }
    }
  }
})
