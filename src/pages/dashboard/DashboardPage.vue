<template>
  <q-page class="q-pa-lg bg-grey-2">
    <div class="row q-col-gutter-md q-mb-lg">
      <div v-for="(stats, index) in summaryStats" :key="index" class="col-12 col-sm-6 col-md-3">
        <q-card flat class="custom-card shadow-1 item-card">
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
                <div class="text-h5 text-weight-bolder text-dark">{{ stats.value }}</div>
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
        <q-card flat class="custom-card q-pa-md shadow-1 chart-card">
          <div v-if="isLoading">
            <div class="row justify-between q-mb-md">
              <q-skeleton type="text" width="40%" height="24px" />
              <q-skeleton type="rect" width="80px" height="20px" />
            </div>
            <q-skeleton height="300px" square class="custom-card" />
          </div>
          <template v-else>
            <div class="row items-center justify-between q-mb-md">
              <div class="text-subtitle1 text-weight-bold text-dark">Income Trend</div>
              <q-badge class="q-pa-sm" outline color="positive" label="Monthly" />
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
        <q-card flat class="custom-card q-pa-md shadow-1 chart-card">
          <div v-if="isLoading">
            <div class="row justify-between q-mb-md">
              <q-skeleton type="text" width="40%" height="24px" />
              <q-skeleton type="rect" width="80px" height="20px" />
            </div>
            <q-skeleton height="300px" square class="custom-card" />
          </div>
          <template v-else>
            <div class="row items-center justify-between q-mb-md">
              <div class="text-subtitle1 text-weight-bold text-dark">Expense Trend</div>
              <q-badge class="q-pa-sm" outline color="negative" label="Monthly" />
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
        <q-card flat class="custom-card shadow-1 overflow-hidden bg-white">
          <div class="row">
            <div class="col-12 col-md-7 q-pa-md border-right-md column justify-between">
              <div>
                <div class="row items-center q-mb-md">
                  <q-icon name="history" color="dark" size="24px" class="q-mr-sm" />
                  <div class="text-h6 text-weight-bold text-dark">Recent Transactions</div>
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
                  :rows="recentTransactions"
                  :columns="transactionColumns"
                  hide-bottom
                  :rows-per-page-options="[0]"
                  class="dashboard-table no-shadow"
                >
                  <template v-slot:body-cell-type="props">
                    <q-td :props="props">
                      <q-badge
                        :color="props.value === 'Income' ? 'positive' : 'negative'"
                        rounded
                        class="q-mr-xs"
                      />
                      {{ props.value }}
                    </q-td>
                  </template>
                  <template v-slot:body-cell-amount="props">
                    <q-td
                      :props="props"
                      :class="props.row.type === 'Income' ? 'text-positive' : 'text-negative'"
                      class="text-weight-bold"
                    >
                      {{ props.value }}
                    </q-td>
                  </template>
                  <template v-slot:no-data>
                    <div class="full-width row flex-center text-grey q-pa-md">
                      No recent transactions
                    </div>
                  </template>
                </q-table>
              </div>

              <div class="q-mt-lg text-center" v-if="!isLoading">
                <q-btn
                  flat
                  color="dark"
                  label="View All Transactions"
                  no-caps
                  class="full-width border-radius-4 bg-grey-2"
                  @click="$router.push('/finance')"
                />
              </div>
            </div>

            <div class="col-12 col-md-5 q-pa-md column justify-between">
              <div>
                <div class="row items-center q-mb-md">
                  <q-icon name="fitness_center" color="dark" size="24px" class="q-mr-sm" />
                  <div class="text-h6 text-weight-bold text-dark">Facility Condition</div>
                </div>

                <div v-if="isLoading" class="q-gutter-y-lg q-px-sm">
                  <div v-for="i in 3" :key="'skeleton-fac-' + i">
                    <div class="row justify-between q-mb-xs">
                      <q-skeleton type="text" width="40%" />
                      <q-skeleton type="text" width="20%" />
                    </div>
                    <q-skeleton type="rect" height="10px" class="custom-card" />
                  </div>
                </div>

                <div v-else class="q-gutter-y-lg q-px-sm">
                  <div v-if="equipmentSummary.length === 0" class="text-grey-6 text-center q-py-md">
                    No equipment data found.
                  </div>
                  <div v-for="item in equipmentSummary" :key="item.id">
                    <div class="row justify-between items-center q-mb-xs">
                      <span class="text-weight-bold text-grey-9">{{ item.name }}</span>
                      <q-badge
                        :color="
                          item.status === 'Damaged'
                            ? 'red-1'
                            : item.status === 'Needs Maintenance'
                              ? 'orange-1'
                              : 'green-1'
                        "
                        :text-color="
                          item.status === 'Damaged'
                            ? 'red-7'
                            : item.status === 'Needs Maintenance'
                              ? 'orange-8'
                              : 'green-7'
                        "
                        class="text-weight-bold"
                        unelevated
                      >
                        {{ item.status }}
                      </q-badge>
                    </div>
                    <q-linear-progress
                      :value="item.condition / 100"
                      :color="
                        item.condition < 40
                          ? 'negative'
                          : item.condition < 80
                            ? 'warning'
                            : 'positive'
                      "
                      size="8px"
                      class="custom-card"
                    />
                    <div class="text-right text-caption text-grey-6 q-mt-xs">Condition Level</div>
                  </div>
                </div>
              </div>

              <div class="q-mt-lg" v-if="!isLoading">
                <q-btn
                  outline
                  color="dark"
                  label="View All Equipment"
                  class="full-width btn-outline-dark"
                  no-caps
                  icon-right="chevron_right"
                  @click="$router.push('/info')"
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
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { api } from 'src/boot/axios'
import { useAnggotaStore } from 'src/stores/Anggota.js'
import { useGymStore } from 'src/stores/Gym'
import apexchart from 'vue3-apexcharts'

const isLoading = ref(true)

const anggotaStore = useAnggotaStore()
const { rows: anggotaRows } = storeToRefs(anggotaStore)

const gymStore = useGymStore()
const gymId = computed(() => gymStore.selectedGymId)

const statsData = reactive({
  staff: 0,
  equipment: 0,
  revenue: 0,
})

const recentTransactions = ref([])
const equipmentSummary = ref([])

const totalMembersCount = computed(() => {
  return anggotaRows.value ? anggotaRows.value.length : 0
})

const summaryStats = computed(() => [
  { label: 'Total Members', value: totalMembersCount.value, icon: 'groups', color: 'blue-7' },
  { label: 'Active Staff', value: statsData.staff, icon: 'badge', color: 'orange-8' },
  {
    label: 'Total Equipment',
    value: statsData.equipment,
    icon: 'fitness_center',
    color: 'green-7',
  },
  {
    label: 'Total Revenue',
    value: formatRupiah(statsData.revenue),
    icon: 'payments',
    color: 'positive',
  },
])

const incomeSeries = ref([{ name: 'Income', data: [] }])
const expenseSeries = ref([{ name: 'Expense', data: [] }])

const incomeChartOptions = ref({
  chart: { toolbar: { show: false }, zoom: { enabled: false }, fontFamily: 'inherit' },
  colors: ['#21BA45'],
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 3 },
  fill: {
    type: 'gradient',
    gradient: { shadeIntensity: 1, opacityFrom: 0.5, opacityTo: 0, stops: [0, 90, 100] },
  },
  xaxis: { categories: [], axisBorder: { show: false } },
  yaxis: { show: false },
  grid: { borderColor: '#f1f1f1' },
})

const expenseChartOptions = ref({
  chart: { toolbar: { show: false }, fontFamily: 'inherit' },
  colors: ['#C10015'],
  plotOptions: { bar: { borderRadius: 4, columnWidth: '45%' } },
  dataLabels: { enabled: false },
  xaxis: { categories: [], axisBorder: { show: false } },
  grid: { strokeDashArray: 4 },
})

const transactionColumns = [
  { name: 'description', label: 'Item/Description', field: 'description', align: 'left' },
  { name: 'type', label: 'Type', field: 'type', align: 'left' },
  { name: 'amount', label: 'Amount', field: 'amount', align: 'right' },
]

const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(Number(angka))
}

const fetchDashboardData = async (idGym) => {
  if (!idGym) return

  isLoading.value = true
  try {
    const [, staffRes, equipmentRes, overviewRes, cashflowRes] = await Promise.allSettled([
      anggotaStore.fetchAnggota(idGym),
      api.get(`/api/v1/gym/${idGym}/gym-staff`),
      api.get(`/api/v1/gym/${idGym}/equipment`),
      api.get(`/api/v1/gym/${idGym}/cashflow/overview`),
      api.get(`/api/v1/gym/${idGym}/cashflow`),
    ])

    if (staffRes.status === 'fulfilled') {
      statsData.staff = staffRes.value.data.recordsTotal || 0
    }

    if (equipmentRes.status === 'fulfilled') {
      const eqData = equipmentRes.value.data
      statsData.equipment = eqData.recordsTotal || 0

      equipmentSummary.value = (eqData.data || []).slice(0, 4).map((eq) => {
        let cond = 100
        let statLabel = 'Good'

        if (eq.healthStatus === 'RUSAK' || eq.healthStatus === 'DAMAGED') {
          cond = 20
          statLabel = 'Damaged'
        } else if (
          eq.healthStatus === 'BUTUH_PERAWATAN' ||
          eq.healthStatus === 'NEEDS MAINTENANCE'
        ) {
          cond = 60
          statLabel = 'Needs Maintenance'
        }

        return { id: eq.id, name: eq.name, condition: cond, status: statLabel }
      })
    }

    if (overviewRes.status === 'fulfilled') {
      const overviewData = overviewRes.value.data.data
      statsData.revenue = overviewData.summary?.totalIncome || 0

      if (overviewData.incomeTrend) {
        incomeChartOptions.value = {
          ...incomeChartOptions.value,
          xaxis: { categories: overviewData.incomeTrend.map((i) => i.month) },
        }
        incomeSeries.value = [
          { name: 'Income', data: overviewData.incomeTrend.map((i) => Number(i.total)) },
        ]
      }
      if (overviewData.expenseTrend) {
        expenseChartOptions.value = {
          ...expenseChartOptions.value,
          xaxis: { categories: overviewData.expenseTrend.map((i) => i.month) },
        }
        expenseSeries.value = [
          { name: 'Expense', data: overviewData.expenseTrend.map((i) => Number(i.total)) },
        ]
      }
    }

    if (cashflowRes.status === 'fulfilled') {
      recentTransactions.value = (cashflowRes.value.data.data || []).slice(0, 5).map((item) => ({
        description: item.name,
        type: item.transactionType === 'PENDAPATAN' ? 'Income' : 'Expense',
        amount: formatRupiah(item.amount),
      }))
    }
  } catch (error) {
    console.error('Error loading dashboard:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (gymId.value) {
    fetchDashboardData(gymId.value)
  }
})

watch(gymId, (newId) => {
  if (newId) {
    fetchDashboardData(newId)
  }
})
</script>

<style lang="scss" scoped>
.custom-card {
  border-radius: 8px;
}
.item-card {
  transition: all 0.3s ease;
  border: 1px solid #f3f4f6;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05) !important;
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
    font-weight: 700;
    background-color: #f9fafb;
    color: #374151;
    padding: 12px 16px;
    border-bottom: 1px solid #e5e7eb;
  }
  :deep(tbody tr td) {
    font-size: 15px;
    padding: 14px 16px;
    border-bottom: 1px solid #f3f4f6;
  }
}
.border-right-md {
  @media (min-width: 1024px) {
    border-right: 1px dashed #e5e7eb;
  }
}
.chart-card {
  border: 1px solid #f3f4f6;
}
.btn-outline-dark {
  border-radius: 4px;
  height: 44px;
  font-weight: 500;
  transition: all 0.3s ease;
  &:hover {
    background-color: #111827 !important;
    color: white !important;
  }
}
</style>
