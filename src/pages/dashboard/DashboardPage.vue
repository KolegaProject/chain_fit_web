<template>
  <q-page class="q-pa-lg bg-grey-2">
    <div class="row q-col-gutter-md q-mb-lg">
      <div v-for="(stats, index) in summaryStats" :key="index" class="col-12 col-sm-6 col-md-3">
        <q-card flat class="rounded-borders shadow-1 item-card">
          <q-card-section class="row items-center no-wrap">
            <div class="col">
              <div class="text-grey-7 text-caption text-uppercase text-weight-bold">
                {{ stats.label }}
              </div>
              <div class="text-h5 text-weight-bolder">{{ stats.value }}</div>
            </div>
            <div class="col-auto">
              <q-avatar :color="stats.color" :icon="stats.icon" text-color="white" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-6">
        <q-card flat class="rounded-borders q-pa-md shadow-1 chart-card">
          <div class="row items-center justify-between q-mb-md">
            <div class="text-subtitle1 text-weight-bold">Tren Pemasukan (7 Hari Terakhir)</div>
            <q-badge class="q-pa-sm" outline color="positive" label="+12% bulan ini" />
          </div>
          <div class="chart-wrapper">
            <apexchart
              type="area"
              height="300"
              :options="incomeChartOptions"
              :series="incomeSeries"
            />
          </div>
        </q-card>
      </div>
      <div class="col-12 col-md-6">
        <q-card flat class="rounded-borders q-pa-md shadow-1 chart-card">
          <div class="row items-center justify-between q-mb-md">
            <div class="text-subtitle1 text-weight-bold">Tren Pengeluaran</div>
            <q-badge class="q-pa-sm" outline color="negative" label="-5% bulan ini" />
          </div>
          <div class="chart-wrapper">
            <apexchart
              type="bar"
              height="300"
              :options="expenseChartOptions"
              :series="expenseSeries"
            />
          </div>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card flat class="rounded-borders shadow-1 overflow-hidden bg-white">
          <div class="row">
            <div class="col-12 col-md-7 q-pa-md border-right-md">
              <div class="row items-center q-mb-md">
                <q-icon name="history" color="primary" size="24px" class="q-mr-sm" />
                <div class="text-h6 text-weight-bold">Transaksi Terakhir</div>
              </div>
              <q-table
                flat
                :rows="allTransactions"
                :columns="transactionColumns"
                hide-bottom
                class="dashboard-table no-shadow"
              >
                <template v-slot:body-cell-type="props">
                  <q-td :props="props">
                    <q-badge
                      :color="props.value === 'Pemasukan' ? 'positive' : 'negative'"
                      rounded
                      class="q-mr-xs"
                    />
                    {{ props.value }}
                  </q-td>
                </template>
              </q-table>
            </div>

            <div class="col-12 col-md-5 q-pa-md">
              <div class="row items-center q-mb-md">
                <q-icon name="fitness_center" color="primary" size="24px" class="q-mr-sm" />
                <div class="text-h6 text-weight-bold">Kondisi Fasilitas</div>
              </div>
              <div class="q-gutter-y-lg q-px-sm">
                <div v-for="item in equipmentSummary" :key="item.id">
                  <div class="row justify-between items-center q-mb-xs">
                    <span class="text-weight-bold text-grey-9">{{ item.name }}</span>
                    <q-badge
                      :color="item.status === 'Rusak' ? 'red-1' : 'green-1'"
                      :text-color="item.status === 'Rusak' ? 'red-7' : 'green-7'"
                      class="text-weight-bold"
                      unelevated
                    >
                      {{ item.status }}
                    </q-badge>
                  </div>
                  <q-linear-progress
                    :value="item.condition / 100"
                    :color="item.condition < 40 ? 'red' : 'primary'"
                    size="8px"
                    class="rounded-borders"
                  />
                  <div class="text-right text-caption text-grey-6 q-mt-xs">
                    Kondisi: {{ item.condition }}%
                  </div>
                </div>

                <q-btn
                  outline
                  color="dark"
                  label="Lihat Semua Alat"
                  class="full-width q-mt-md"
                  no-caps
                  icon-right="chevron_right"
                  @click="router.push('/info')"
                />
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import VueApexCharts from 'vue3-apexcharts'

const router = useRouter()
const apexchart = VueApexCharts

const totalMembers = ref(0)
const totalStaff = ref(7)
const totalEquipment = ref(0)
const totalRevenue = ref('Rp 12,450,000')

const summaryStats = computed(() => [
  { label: 'Total Member', value: totalMembers.value, icon: 'groups', color: 'blue-7' },
  { label: 'Staff Aktif', value: totalStaff.value, icon: 'badge', color: 'orange-8' },
  { label: 'Total Alat', value: totalEquipment.value, icon: 'fitness_center', color: 'green-7' },
  { label: 'Pemasukan', value: totalRevenue.value, icon: 'payments', color: 'positive' },
])

// Charts Configuration
const incomeSeries = ref([{ name: 'Pemasukan', data: [31, 40, 28, 51, 42, 109, 100] }])
const incomeChartOptions = {
  chart: { toolbar: { show: false }, zoom: { enabled: false } },
  colors: ['#21BA45'],
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 3 },
  fill: {
    type: 'gradient',
    gradient: { shadeIntensity: 1, opacityFrom: 0.5, opacityTo: 0, stops: [0, 90, 100] },
  },
  xaxis: {
    categories: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
    axisBorder: { show: false },
  },
  yaxis: { show: false },
  grid: { borderColor: '#f1f1f1' },
}

const expenseSeries = ref([{ name: 'Pengeluaran', data: [15, 23, 18, 40, 25, 30, 20] }])
const expenseChartOptions = {
  chart: { toolbar: { show: false } },
  colors: ['#C10015'],
  plotOptions: { bar: { borderRadius: 6, columnWidth: '45%' } },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
    axisBorder: { show: false },
  },
  grid: { strokeDashArray: 4 },
}

// Table & Facilities Data
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
  { id: 3, name: 'Dumbbell Set', condition: 100, status: 'Baik' },
])

onMounted(() => {
  const members = JSON.parse(localStorage.getItem('members') || '[]')
  const equipments = JSON.parse(localStorage.getItem('equipments') || '[]')
  totalMembers.value = members.length
  totalEquipment.value = equipments.length
})
</script>

<style lang="scss" scoped>
.chart-wrapper {
  width: 100%;
  min-height: 300px;
}
.item-card {
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-5px);
  }
}
.rounded-borders {
  border-radius: 12px;
}
.dashboard-table {
  background: transparent;
  :deep(thead tr th) {
    font-weight: 800;
    background-color: #f8f9fa;
    color: #444;
  }
}

.border-right-md {
  @media (min-width: 1024px) {
    border-right: 1px dashed #e0e0e0;
  }
}
</style>
