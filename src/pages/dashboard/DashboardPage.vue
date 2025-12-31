<template>
  <q-page class="q-pa-lg bg-grey-2">
    <div class="row q-col-gutter-md q-mb-lg">
      <div v-for="(stats, index) in summaryStats" :key="index" class="col-12 col-sm-6 col-md-3">
        <q-card flat class="rounded-borders shadow-1 item-card">
          <q-card-section class="row items-center no-wrap">
            <div class="col">
              <div class="text-grey-7 text-caption text-uppercase text-weight-bold">{{ stats.label }}</div>
              <div class="text-h5 text-weight-bolder">{{ stats.value }}</div>
            </div>
            <div class="col-auto">
              <q-avatar :color="stats.color" :icon="stats.icon" text-color="white" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md q-mb-xl">
      <div class="col-12 col-md-6">
        <q-card flat class="rounded-borders q-pa-md shadow-1 chart-card">
          <div class="row items-center justify-between q-mb-md">
            <div class="text-subtitle1 text-weight-bold">Tren Pemasukan</div>
            <q-badge outline color="positive" label="+12% bulan ini" />
          </div>
          <div class="chart-container flex flex-center bg-grey-1 rounded-borders">
            <div class="text-center">
              <q-icon name="bar_chart" size="64px" color="grey-4" />
              <div class="text-grey-6">Visualisasi Grafik Pemasukan</div>
            </div>
          </div>
        </q-card>
      </div>
      <div class="col-12 col-md-6">
        <q-card flat class="rounded-borders q-pa-md shadow-1 chart-card">
          <div class="row items-center justify-between q-mb-md">
            <div class="text-subtitle1 text-weight-bold">Tren Pengeluaran</div>
            <q-badge outline color="negative" label="-5% bulan ini" />
          </div>
          <div class="chart-container flex flex-center bg-grey-1 rounded-borders">
            <div class="text-center">
              <q-icon name="show_chart" size="64px" color="grey-4" />
              <div class="text-grey-6">Visualisasi Grafik Pengeluaran</div>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-lg-7">
        <div class="text-h6 text-weight-bold q-mb-sm row items-center">
          <q-icon name="history" class="q-mr-sm" /> Transaksi Terakhir
        </div>
        <q-card flat class="rounded-borders shadow-1 overflow-hidden">
          <q-table
            flat
            :rows="allTransactions"
            :columns="transactionColumns"
            hide-bottom
            class="dashboard-table"
          >
            <template v-slot:body-cell-type="props">
              <q-td :props="props">
                <q-badge :color="props.value === 'Pemasukan' ? 'positive' : 'negative'" rounded />
                {{ props.value }}
              </q-td>
            </template>
          </q-table>
        </q-card>
      </div>

      <div class="col-12 col-lg-5">
        <div class="text-h6 text-weight-bold q-mb-sm row items-center">
          <q-icon name="fitness_center" class="q-mr-sm" /> Kondisi Fasilitas
        </div>
        <q-card flat class="rounded-borders shadow-1 q-pa-md">
          <div v-for="item in equipmentSummary" :key="item.id" class="q-mb-md">
            <div class="row justify-between q-mb-xs">
              <span class="text-weight-bold">{{ item.name }}</span>
              <span class="text-caption" :class="item.status === 'Rusak' ? 'text-red' : 'text-green'">{{ item.status }}</span>
            </div>
            <q-linear-progress :value="item.condition / 100" :color="item.condition < 40 ? 'red' : 'primary'" class="rounded-borders" />
          </div>
          <q-btn outline color="dark" label="Lihat Semua Alat" class="full-width q-mt-sm" no-caps @click="router.push('/info')" />
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Data Ringkasan (KPI)
const totalMembers = ref(0)
const totalStaff = ref(0)
const totalEquipment = ref(0)
const totalRevenue = ref('Rp 0')

const summaryStats = computed(() => [
  { label: 'Total Member', value: totalMembers.value, icon: 'groups', color: 'blue-7' },
  { label: 'Staff Aktif', value: totalStaff.value, icon: 'badge', color: 'orange-8' },
  { label: 'Total Alat', value: totalEquipment.value, icon: 'fitness_center', color: 'green-7' },
  { label: 'Pemasukan', value: totalRevenue.value, icon: 'payments', color: 'positive' }
])

// Data Transaksi
const transactionColumns = [
  { name: 'nama', label: 'Item/Kebutuhan', field: 'nama', align: 'left' },
  { name: 'type', label: 'Tipe', field: 'type', align: 'left' },
  { name: 'jumlah', label: 'Nominal', field: 'jumlah', align: 'right' },
]

const allTransactions = [
  { nama: 'Pendaftaran Member Baru', type: 'Pemasukan', jumlah: 'Rp 250,000' },
  { nama: 'Tagihan Listrik', type: 'Pengeluaran', jumlah: 'Rp 1,200,000' },
  { nama: 'Service Treadmill', type: 'Pengeluaran', jumlah: 'Rp 450,000' },
  { nama: 'Renewal Paket Gold', type: 'Pemasukan', jumlah: 'Rp 1,500,000' },
]

const equipmentSummary = ref([
  { id: 1, name: 'Treadmill Area', condition: 90, status: 'Baik' },
  { id: 2, name: 'Bench Press', condition: 30, status: 'Rusak' },
  { id: 3, name: 'Dumbbell Set', condition: 100, status: 'Baik' }
])

onMounted(() => {
  // Ambil data dari LocalStorage yang ada di page lain
  const members = JSON.parse(localStorage.getItem('members') || '[]')
  const staff = [1,2,3,4,5,6,7] // Dummy atau ambil dari localStorage staff jika ada
  const equipments = JSON.parse(localStorage.getItem('equipments') || '[]')

  totalMembers.value = members.length
  totalStaff.value = staff.length
  totalEquipment.value = equipments.length
  totalRevenue.value = 'Rp 12,450,000' // Contoh kalkulasi revenue
})
</script>

<style lang="scss" scoped>
.item-card {
  transition: all 0.3s;
  &:hover {
    transform: translateY(-5px);
  }
}

.chart-card {
  min-height: 380px;
}

.chart-container {
  height: 300px;
}

.dashboard-table {
  :deep(thead tr th) {
    font-weight: 800;
    background-color: #f8f9fa;
  }
}

.rounded-borders {
  border-radius: 12px;
}
</style>
