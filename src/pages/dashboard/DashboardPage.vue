<template>
  <q-page class="q-pa-lg bg-grey-2">
    <div class="row q-col-gutter-md q-mb-lg">
      <div
        v-for="(stats, index) in isLoading ? 4 : summaryStats"
        :key="index"
        class="col-12 col-sm-6 col-md-3"
      >
        <q-card flat class="rounded-borders shadow-1 item-card">
          <q-card-section class="row items-center no-wrap">
            <div class="col">
              <template v-if="isLoading">
                <q-skeleton type="text" width="60%" class="q-mb-sm" />
                <q-skeleton type="rect" width="80%" height="32px" />
              </template>
              <template v-else>
                <div class="text-grey-7 text-caption text-uppercase text-weight-bold">
                  {{ stats.label }}
                </div>
                <div class="text-h5 text-weight-bolder">{{ stats.value }}</div>
              </template>
            </div>
            <div class="col-auto">
              <q-skeleton v-if="isLoading" type="QAvatar" size="48px" />
              <q-avatar
                v-else
                :color="stats.color"
                :icon="stats.icon"
                text-color="white"
                size="48px"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-6">
        <q-card flat class="rounded-borders q-pa-md shadow-1 chart-card">
          <div v-if="isLoading">
            <div class="row justify-between q-mb-md">
              <q-skeleton type="text" width="40%" height="24px" />
              <q-skeleton type="rect" width="80px" height="20px" />
            </div>
            <q-skeleton height="300px" square class="rounded-borders" />
          </div>
          <template v-else>
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
          </template>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card flat class="rounded-borders q-pa-md shadow-1 chart-card">
          <div v-if="isLoading">
            <div class="row justify-between q-mb-md">
              <q-skeleton type="text" width="40%" height="24px" />
              <q-skeleton type="rect" width="80px" height="20px" />
            </div>
            <q-skeleton height="300px" square class="rounded-borders" />
          </div>
          <template v-else>
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
          </template>
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

              <div v-if="isLoading">
                <q-table flat :columns="transactionColumns" :rows="[{}, {}, {}, {}]" hide-bottom>
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td v-for="col in props.cols" :key="col.name">
                        <q-skeleton type="text" />
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </div>

              <q-table
                v-else
                flat
                :rows="allTransactions"
                :columns="transactionColumns"
                hide-bottom
                class="dashboard-table no-shadow"
              >
                <template v-slot:body-cell-nama="props">
                  <q-td :props="props">
                    <div class="text-weight-bold text-grey-9">{{ props.value }}</div>
                  </q-td>
                </template>
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
                <template v-slot:body-cell-jumlah="props">
                  <q-td :props="props" class="text-weight-bold">
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

              <div v-if="isLoading" class="q-gutter-y-lg q-px-sm">
                <div v-for="i in 3" :key="'skeleton-fac-' + i">
                  <div class="row justify-between q-mb-xs">
                    <q-skeleton type="text" width="40%" />
                    <q-skeleton type="text" width="20%" />
                  </div>
                  <q-skeleton type="rect" height="10px" class="rounded-borders" />
                </div>
              </div>

              <div v-else class="q-gutter-y-lg q-px-sm">
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
                    size="10px"
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
const isLoading = ref(true)
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

const incomeSeries = ref([{ name: 'Pemasukan', data: [31, 40, 28, 51, 42, 109, 100] }])

const incomeChartOptions = {
  chart: { toolbar: { show: false }, zoom: { enabled: false }, fontFamily: 'inherit' },
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
  chart: { toolbar: { show: false }, fontFamily: 'inherit' },
  colors: ['#C10015'],
  plotOptions: { bar: { borderRadius: 6, columnWidth: '45%' } },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
    axisBorder: { show: false },
  },
  grid: { strokeDashArray: 4 },
}

const transactionColumns = [
  { name: 'nama', label: 'Item/Kebutuhan', field: 'nama', align: 'left' },
  { name: 'type', label: 'Tipe', field: 'type', align: 'left' },
  { name: 'jumlah', label: 'Nominal', field: 'jumlah', align: 'right' },
]

const allTransactions = ref([
  { nama: 'Pendaftaran Member Baru', type: 'Pemasukan', jumlah: 'Rp 250,000' },
  { nama: 'Tagihan Listrik', type: 'Pengeluaran', jumlah: 'Rp 1,200,000' },
  { nama: 'Service Treadmill', type: 'Pengeluaran', jumlah: 'Rp 450,000' },
  { nama: 'Renewal Paket Gold', type: 'Pemasukan', jumlah: 'Rp 1,500,000' },
])

const equipmentSummary = ref([
  { id: 1, name: 'Treadmill Area', condition: 90, status: 'Baik' },
  { id: 2, name: 'Bench Press', condition: 30, status: 'Rusak' },
  { id: 3, name: 'Dumbbell Set', condition: 100, status: 'Baik' },
])

onMounted(() => {
  setTimeout(() => {
    const members = JSON.parse(localStorage.getItem('members') || '[]')
    const equipments = JSON.parse(localStorage.getItem('equipments') || '[]')
    totalMembers.value = members.length
    totalEquipment.value = equipments.length
    isLoading.value = false
  }, 1000)
})

</script>

<style lang="scss" scoped>
.rounded-borders {
  border-radius: 12px;
}

.item-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
  }
}

.chart-wrapper {
  width: 100%;
  min-height: 300px;
}

.dashboard-table {
  background: transparent;
  :deep(thead tr th) {
    font-size: 14px;
    font-weight: 800;
    background-color: #f8f9fa;
    color: #444;
    padding: 12px 16px;
  }
  :deep(tbody tr td) {
    font-size: 15px; /* Sesuai request: Teks lebih besar */
    padding: 14px 16px;
  }
}

.border-right-md {
  @media (min-width: 1024px) {
    border-right: 1px dashed #e0e0e0;
  }
}

.chart-card {
  border: 1px solid rgba(0, 0, 0, 0.05);
}

</style>
