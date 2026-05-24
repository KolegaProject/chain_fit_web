<template>
  <q-page class="q-pa-lg bg-grey-2">
    <!-- ================= HEADER ================= -->
    <q-card flat class="custom-card shadow-1 q-mb-lg bg-white">
      <q-card-section class="q-pa-md row items-center justify-between">
        <div class="row items-center">
          <q-skeleton v-if="isLoading" type="QAvatar" size="32px" class="q-mr-md" />
          <q-icon v-else name="payments" color="dark" size="32px" class="q-mr-md" />

          <q-skeleton v-if="isLoading" type="text" width="150px" height="30px" />
          <div v-else class="text-h5 text-weight-bold text-dark">Financial Report</div>
        </div>

        <q-skeleton v-if="isLoading" type="rect" width="160px" height="36px" class="custom-card" />
        <q-btn
          v-else
          unelevated
          label="Add Transaction"
          icon="add"
          no-caps
          class="btn-dark q-px-md"
          @click="$router.push('/finance/tambah')"
        />
      </q-card-section>
    </q-card>

    <!-- ================= CHARTS ================= -->
    <div class="row q-col-gutter-md q-mb-lg">
      <!-- Income Chart -->
      <div class="col-12 col-md-6">
        <q-card flat class="custom-card q-pa-md shadow-1 chart-card">
          <div class="row items-center justify-between q-mb-md">
            <q-skeleton v-if="isLoading" type="text" width="120px" />
            <div v-else class="text-subtitle1 text-weight-bold text-dark">Income Trend</div>

            <q-skeleton v-if="isLoading" type="rect" width="60px" height="20px" />
            <q-badge v-else class="q-pa-sm" outline color="positive" label="Monthly" />
          </div>

          <div class="chart-wrapper">
            <q-skeleton v-if="isLoading" height="280px" square class="custom-card" />
            <apexchart
              v-else
              type="area"
              height="280"
              :options="incomeChartOptions"
              :series="incomeSeries"
            />
          </div>
        </q-card>
      </div>

      <!-- Expense Chart -->
      <div class="col-12 col-md-6">
        <q-card flat class="custom-card q-pa-md shadow-1 chart-card">
          <div class="row items-center justify-between q-mb-md">
            <q-skeleton v-if="isLoading" type="text" width="120px" />
            <div v-else class="text-subtitle1 text-weight-bold text-dark">Expense Trend</div>

            <q-skeleton v-if="isLoading" type="rect" width="60px" height="20px" />
            <q-badge v-else class="q-pa-sm" outline color="negative" label="Monthly" />
          </div>

          <div class="chart-wrapper">
            <q-skeleton v-if="isLoading" height="280px" square class="custom-card" />
            <apexchart
              v-else
              type="bar"
              height="280"
              :options="expenseChartOptions"
              :series="expenseSeries"
            />
          </div>
        </q-card>
      </div>
    </div>

    <!-- ================= TRANSACTION TABLES ================= -->
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card flat class="custom-card shadow-1 overflow-hidden bg-white">
          <div class="row">
            <!-- Income Table -->
            <div class="col-12 col-md-6 q-pa-md border-right-md">
              <div class="row items-center q-mb-md">
                <q-skeleton v-if="isLoading" type="QAvatar" size="24px" class="q-mr-sm" />
                <q-icon v-else name="arrow_downward" color="positive" size="24px" class="q-mr-sm" />

                <q-skeleton v-if="isLoading" type="text" width="140px" />
                <div v-else class="text-h6 text-weight-bold text-dark">Recent Income</div>
              </div>

              <div v-if="isLoading">
                <q-skeleton
                  v-for="n in 4"
                  :key="'skel-in-' + n"
                  type="text"
                  class="q-mb-sm"
                  height="40px"
                />
              </div>
              <q-table
                v-else
                flat
                :rows="rowsPemasukan"
                :columns="columns"
                hide-bottom
                class="dashboard-table no-shadow"
              >
                <!-- Custom styling for amount to make it pop -->
                <template v-slot:body-cell-amount="props">
                  <q-td :props="props" class="text-weight-bold text-positive">
                    {{ props.value }}
                  </q-td>
                </template>
              </q-table>
            </div>

            <!-- Expense Table -->
            <div class="col-12 col-md-6 q-pa-md">
              <div class="row items-center q-mb-md">
                <q-skeleton v-if="isLoading" type="QAvatar" size="24px" class="q-mr-sm" />
                <q-icon v-else name="arrow_upward" color="negative" size="24px" class="q-mr-sm" />

                <q-skeleton v-if="isLoading" type="text" width="140px" />
                <div v-else class="text-h6 text-weight-bold text-dark">Recent Expenses</div>
              </div>

              <div v-if="isLoading">
                <q-skeleton
                  v-for="n in 4"
                  :key="'skel-out-' + n"
                  type="text"
                  class="q-mb-sm"
                  height="40px"
                />
              </div>
              <q-table
                v-else
                flat
                :rows="rowsPengeluaran"
                :columns="columns"
                hide-bottom
                class="dashboard-table no-shadow"
              >
                <!-- Custom styling for amount to make it pop -->
                <template v-slot:body-cell-amount="props">
                  <q-td :props="props" class="text-weight-bold text-negative">
                    {{ props.value }}
                  </q-td>
                </template>
              </q-table>
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const apexchart = VueApexCharts
const isLoading = ref(true)

// --- Income Chart Data ---
const incomeSeries = [{ name: 'Income', data: [30, 40, 35, 50, 49, 60, 70] }]
const incomeChartOptions = {
  chart: { toolbar: { show: false }, fontFamily: 'inherit' },
  colors: ['#21BA45'],
  stroke: { curve: 'smooth', width: 3 },
  xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
  dataLabels: { enabled: false },
  grid: { borderColor: '#f1f1f1' },
}

// --- Expense Chart Data ---
const expenseSeries = [{ name: 'Expense', data: [20, 30, 25, 45, 30, 40, 35] }]
const expenseChartOptions = {
  chart: { toolbar: { show: false }, fontFamily: 'inherit' },
  colors: ['#c62828'],
  plotOptions: { bar: { borderRadius: 4, columnWidth: '50%' } },
  xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
  dataLabels: { enabled: false },
}

// --- Table Columns ---
const columns = [
  { name: 'no', label: 'No.', field: 'no', align: 'left' },
  { name: 'description', label: 'Description', field: 'description', align: 'left' },
  { name: 'amount', label: 'Amount', field: 'amount', align: 'left' },
  { name: 'payment', label: 'Payment Method', field: 'payment', align: 'left' },
]

// --- Dummy Data ---
const rowsPengeluaran = [
  { no: '01', description: 'Electricity Bill', amount: 'Rp 1,200,000', payment: 'Bank Transfer' },
  { no: '02', description: 'Maintenance Services', amount: 'Rp 850,000', payment: 'Credit Card' },
  { no: '03', description: 'Cleaning Supplies', amount: 'Rp 300,000', payment: 'Cash' },
]

const rowsPemasukan = [
  { no: '01', description: 'Gold Package Sub.', amount: 'Rp 1,500,000', payment: 'Credit Card' },
  { no: '02', description: 'Silver Package Sub.', amount: 'Rp 800,000', payment: 'Bank Transfer' },
  { no: '03', description: 'Daily Pass', amount: 'Rp 150,000', payment: 'Cash' },
]

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})
</script>

<style lang="scss" scoped>
.custom-card {
  border-radius: 8px; /* Konsisten dengan desain sebelumnya */
  border: 1px solid #f3f4f6;
}

.chart-wrapper {
  min-height: 280px;
}

.border-right-md {
  @media (min-width: 1024px) {
    border-right: 1px dashed #e5e7eb;
  }
}

/* Button Styling */
.btn-dark {
  background-color: #111827 !important;
  color: white;
  border-radius: 4px;
  font-weight: 500;
  height: 40px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #1f2937 !important;
  }
}

/* Table Styling (Sama persis dengan Dashboard) */
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
    font-size: 14px;
    padding: 14px 16px;
    border-bottom: 1px solid #f3f4f6;
    color: #4b5563;
  }
}
</style>
