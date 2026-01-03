import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useAnggotaStore = defineStore('anggota', {
  state: () => ({
    rows: [],
    riwayatAbsensi: [],
    paketMember: [],

    loading: false,
    loadingRiwayat: false,
    loadingPaket: false,

    total: 0
  }),

  actions: {
    async fetchAnggota(gymId) {
      this.loading = true
      try {
        const res = await api.get(`/api/v1/gym/${gymId}/memberships`)

        this.rows = res.data.data.map(item => ({
          id: item.id, // ID MEMBERSHIP
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

    // Get riwayat absensi anggota
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

    // Delete anggota
    async deleteAnggota(gymId, membershipId) {
      try {
        await api.delete(`/api/v1/gym/${gymId}/memberships/${membershipId}`)
        this.rows = this.rows.filter(r => r.id !== membershipId)
      } catch (err) {
        console.error('Gagal menghapus anggota:', err)
        throw err
      }
    },

    // Update membership anggota
    async updateMembership(gymId, membershipId, payload) {
      try {
        return await api.put(
          `/api/v1/gym/${gymId}/memberships/${membershipId}`,
          payload
        )
      } catch (err) {
        console.error('Gagal update membership:', err)
        throw err
      }
    }
  }
})
