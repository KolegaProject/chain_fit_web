<template>
  <q-page class="q-pa-lg bg-grey-2">
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

    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-6">
        <q-card flat class="custom-card q-pa-md shadow-1 chart-card">
          <div class="row items-center justify-between q-mb-md">
            <q-skeleton v-if="isLoading" type="text" width="120px" />
            <div v-else class="text-subtitle1 text-weight-bold text-dark">Income Trend</div>
            <q-badge v-if="!isLoading" class="q-pa-sm" outline color="positive" label="Monthly" />
          </div>
          <div class="chart-wrapper">
            <q-skeleton v-if="isLoading" height="280px" square class="custom-card" />
            <apexchart
              v-if="!isLoading"
              type="area"
              height="280"
              :options="incomeChartOptions"
              :series="incomeSeries"
            />
          </div>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card flat class="custom-card q-pa-md shadow-1 chart-card">
          <div class="row items-center justify-between q-mb-md">
            <q-skeleton v-if="isLoading" type="text" width="120px" />
            <div v-else class="text-subtitle1 text-weight-bold text-dark">Expense Trend</div>
            <q-badge v-if="!isLoading" class="q-pa-sm" outline color="negative" label="Monthly" />
          </div>
          <div class="chart-wrapper">
            <q-skeleton v-if="isLoading" height="280px" square class="custom-card" />
            <apexchart
              v-if="!isLoading"
              type="bar"
              height="280"
              :options="expenseChartOptions"
              :series="expenseSeries"
            />
          </div>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card flat class="custom-card shadow-1 overflow-hidden bg-white">
          <div class="row">
            <div class="col-12 col-md-6 q-pa-md border-right-md">
              <div class="row items-center justify-between q-mb-md">
                <div class="row items-center">
                  <q-icon name="arrow_downward" color="positive" size="24px" class="q-mr-sm" />
                  <div class="text-h6 text-weight-bold text-dark">Income Data</div>
                </div>
                <q-input
                  v-model="searchIncome"
                  dense
                  outlined
                  placeholder="Search..."
                  class="bg-white"
                  style="max-width: 200px"
                >
                  <template v-slot:append><q-icon name="search" /></template>
                </q-input>
              </div>

              <q-table
                flat
                :rows="rowsPemasukan"
                :columns="columns"
                :filter="searchIncome"
                :pagination="paginationIncome"
                class="dashboard-table no-shadow"
                :loading="isLoading"
              >
                <template v-slot:body-cell-no="props">
                  <q-td :props="props">{{
                      (paginationIncome.page - 1) * paginationIncome.rowsPerPage + props.rowIndex + 1
                    }}</q-td>
                </template>
                <template v-slot:body-cell-amount="props">
                  <q-td :props="props" class="text-weight-bold text-positive">{{
                      props.value
                    }}</q-td>
                </template>
                <template v-slot:body-cell-actions="props">
                  <q-td :props="props" class="q-gutter-x-sm">
                    <q-btn
                      flat
                      round
                      dense
                      color="grey-7"
                      icon="edit"
                      size="sm"
                      @click="bukaEditModal(props.row)"
                    />
                    <q-btn
                      flat
                      round
                      dense
                      color="negative"
                      icon="delete"
                      size="sm"
                      @click="hapusTransaksi(props.row.id)"
                    />
                  </q-td>
                </template>
              </q-table>
            </div>

            <div class="col-12 col-md-6 q-pa-md">
              <div class="row items-center justify-between q-mb-md">
                <div class="row items-center">
                  <q-icon name="arrow_upward" color="negative" size="24px" class="q-mr-sm" />
                  <div class="text-h6 text-weight-bold text-dark">Expense Data</div>
                </div>
                <q-input
                  v-model="searchExpense"
                  dense
                  outlined
                  placeholder="Search..."
                  class="bg-white"
                  style="max-width: 200px"
                >
                  <template v-slot:append><q-icon name="search" /></template>
                </q-input>
              </div>

              <q-table
                flat
                :rows="rowsPengeluaran"
                :columns="columns"
                :filter="searchExpense"
                :pagination="paginationExpense"
                class="dashboard-table no-shadow"
                :loading="isLoading"
              >
                <template v-slot:body-cell-no="props">
                  <q-td :props="props">{{
                      (paginationExpense.page - 1) * paginationExpense.rowsPerPage +
                      props.rowIndex +
                      1
                    }}</q-td>
                </template>
                <template v-slot:body-cell-amount="props">
                  <q-td :props="props" class="text-weight-bold text-negative">{{
                      props.value
                    }}</q-td>
                </template>
                <template v-slot:body-cell-actions="props">
                  <q-td :props="props" class="q-gutter-x-sm">
                    <q-btn
                      flat
                      round
                      dense
                      color="grey-7"
                      icon="edit"
                      size="sm"
                      @click="bukaEditModal(props.row)"
                    />
                    <q-btn
                      flat
                      round
                      dense
                      color="negative"
                      icon="delete"
                      size="sm"
                      @click="hapusTransaksi(props.row.id)"
                    />
                  </q-td>
                </template>
              </q-table>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="isEditModalOpen" persistent>
      <q-card style="min-width: 400px; border-radius: 8px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">Edit Transaction</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <q-form @submit.prevent="simpanEditTransaksi">
            <div class="q-mb-md">
              <label class="text-caption text-weight-bold text-grey-9 q-mb-xs block"
              >Transaction Name</label
              >
              <q-input
                outlined
                dense
                v-model="editForm.name"
                required
                class="bg-white custom-input"
              />
            </div>

            <div class="q-mb-md">
              <label class="text-caption text-weight-bold text-grey-9 q-mb-xs block"
              >Amount (Rp)</label
              >
              <q-input
                outlined
                dense
                v-model="editForm.amount"
                type="number"
                required
                class="bg-white custom-input"
              />
            </div>

            <div class="q-mb-md">
              <label class="text-caption text-weight-bold text-grey-9 q-mb-xs block">Type</label>
              <q-select
                outlined
                dense
                v-model="editForm.transactionType"
                :options="['PENDAPATAN', 'PENGELUARAN']"
                class="bg-white custom-input"
              />
            </div>

            <div class="q-mb-lg">
              <label class="text-caption text-weight-bold text-grey-9 q-mb-xs block"
              >Payment Method</label
              >
              <q-select
                outlined
                dense
                v-model="editForm.cashflowType"
                :options="['CASH', 'CASHLESS']"
                class="bg-white custom-input"
              />
            </div>

            <div class="row justify-end q-gutter-sm">
              <q-btn flat color="dark" label="Cancel" no-caps v-close-popup />
              <q-btn
                unelevated
                color="dark"
                label="Save Changes"
                type="submit"
                no-caps
                :loading="isSavingEdit"
                class="btn-dark"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue' // Tambahkan computed dan watch
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import VueApexCharts from 'vue3-apexcharts'
import { useGymStore } from 'src/stores/Gym' // Import GymStore

const $q = useQuasar()
const apexchart = VueApexCharts
const isLoading = ref(true)

// --- Integrasi GymStore ---
const gymStore = useGymStore()
const gymId = computed(() => gymStore.selectedGymId) // Reaktif memantau id gym aktif

// --- State Search & Pagination ---
const searchIncome = ref('')
const searchExpense = ref('')
const paginationIncome = ref({ page: 1, rowsPerPage: 5 })
const paginationExpense = ref({ page: 1, rowsPerPage: 5 })

// --- State Tables ---
const rowsPemasukan = ref([])
const rowsPengeluaran = ref([])

// --- State Edit Modal ---
const isEditModalOpen = ref(false)
const isSavingEdit = ref(false)
const editForm = ref({ id: null, name: '', amount: '', transactionType: '', cashflowType: '', date: '', note: '' })

// --- State Charts ---
const incomeSeries = ref([{ name: 'Income', data: [] }])
const incomeChartOptions = ref({
  chart: { toolbar: { show: false }, fontFamily: 'inherit' },
  colors: ['#21BA45'], stroke: { curve: 'smooth', width: 3 },
  xaxis: { categories: [] }, dataLabels: { enabled: false },
})
const expenseSeries = ref([{ name: 'Expense', data: [] }])
const expenseChartOptions = ref({
  chart: { toolbar: { show: false }, fontFamily: 'inherit' },
  colors: ['#c62828'], plotOptions: { bar: { borderRadius: 4, columnWidth: '50%' } },
  xaxis: { categories: [] }, dataLabels: { enabled: false },
})

const columns = [
  { name: 'no', label: 'No.', field: 'no', align: 'left' },
  { name: 'description', label: 'Description', field: 'description', align: 'left' },
  { name: 'amount', label: 'Amount', field: 'amount', align: 'left' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' },
]

const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(angka))
}

// Tambahkan parameter idGym agar bisa di-fetch ulang saat ganti gym
const fetchFinanceData = async (idGym) => {
  if (!idGym) return

  isLoading.value = true
  try {
    const [overviewRes, cashflowRes] = await Promise.all([
      api.get(`/api/v1/gym/${idGym}/cashflow/overview`),
      api.get(`/api/v1/gym/${idGym}/cashflow`)
    ])

    const overviewData = overviewRes.data.data
    const allCashflow = cashflowRes.data.data

    if (overviewData.incomeTrend) {
      incomeChartOptions.value = { ...incomeChartOptions.value, xaxis: { categories: overviewData.incomeTrend.map(i => i.month) } }
      incomeSeries.value = [{ name: 'Income', data: overviewData.incomeTrend.map(i => Number(i.total)) }]
    }

    if (overviewData.expenseTrend) {
      expenseChartOptions.value = { ...expenseChartOptions.value, xaxis: { categories: overviewData.expenseTrend.map(i => i.month) } }
      expenseSeries.value = [{ name: 'Expense', data: overviewData.expenseTrend.map(i => Number(i.total)) }]
    }

    const tempPemasukan = []
    const tempPengeluaran = []

    allCashflow.forEach(item => {
      const row = {
        id: item.id,
        description: item.name,
        amount: formatRupiah(item.amount),
        raw: item // Simpan data mentah untuk modal Edit
      }

      if (item.transactionType === 'PENDAPATAN') tempPemasukan.push(row)
      else if (item.transactionType === 'PENGELUARAN') tempPengeluaran.push(row)
    })

    rowsPemasukan.value = tempPemasukan
    rowsPengeluaran.value = tempPengeluaran
  } catch (error) {
    console.error('Error:', error);
    $q.notify({ type: 'negative', message: 'Terjadi kesalahan.', position: 'top' });
  } finally {
    isLoading.value = false
  }
}

// ================= AKSI EDIT =================
const bukaEditModal = (row) => {
  const dataAsli = row.raw
  editForm.value = {
    id: dataAsli.id,
    name: dataAsli.name,
    amount: dataAsli.amount,
    transactionType: dataAsli.transactionType,
    cashflowType: dataAsli.cashflowType,
    date: dataAsli.date,
    note: dataAsli.note || `Update: ${dataAsli.name}`
  }
  isEditModalOpen.value = true
}

const simpanEditTransaksi = async () => {
  isSavingEdit.value = true
  try {
    const idGym = gymId.value // Gunakan idGym reaktif
    if (!idGym) return

    const payload = {
      name: editForm.value.name,
      amount: Number(editForm.value.amount),
      transactionType: editForm.value.transactionType,
      cashflowType: editForm.value.cashflowType,
      date: editForm.value.date || new Date().toISOString().split('T')[0],
      note: editForm.value.note
    }

    await api.put(`/api/v1/gym/${idGym}/cashflow/${editForm.value.id}`, payload)

    $q.notify({ type: 'positive', message: 'Transaction updated successfully!', position: 'top' })
    isEditModalOpen.value = false
    fetchFinanceData(idGym) // Refresh tabel untuk gym yang aktif
  } catch (error) {
    console.error('Error:', error);
    $q.notify({ type: 'negative', message: 'Terjadi kesalahan.', position: 'top' });
  } finally {
    isSavingEdit.value = false
  }
}

// ================= AKSI HAPUS =================
const hapusTransaksi = (id) => {
  $q.dialog({
    title: 'Delete Transaction',
    message: 'Are you sure you want to delete this transaction?',
    persistent: true,
    ok: { color: 'negative', label: 'Delete', unelevated: true, noCaps: true },
    cancel: { color: 'dark', flat: true, noCaps: true }
  }).onOk(async () => {
    try {
      const idGym = gymId.value // Gunakan idGym reaktif
      if (!idGym) return

      await api.delete(`/api/v1/gym/${idGym}/cashflow/${id}`)
      $q.notify({ type: 'positive', message: 'Transaction deleted.', position: 'top' })
      fetchFinanceData(idGym) // Refresh tabel
    } catch (error) {
      console.error('Error:', error);
      $q.notify({ type: 'negative', message: 'Terjadi kesalahan.', position: 'top' });
    }
  })
}

// ================= LIFECYCLE & WATCHERS =================
onMounted(() => {
  if (gymId.value) {
    fetchFinanceData(gymId.value)
  }
})

// Pantau perubahan pada dropdown Gym
watch(gymId, (newId) => {
  if (newId) {
    fetchFinanceData(newId)
  }
})
</script>

<style lang="scss" scoped>
.custom-card {
  border-radius: 8px;
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
.btn-dark {
  background-color: #111827 !important;
  color: white;
  border-radius: 4px;
  font-weight: 500;
  &:hover {
    background-color: #1f2937 !important;
  }
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
    font-size: 14px;
    padding: 14px 16px;
    border-bottom: 1px solid #f3f4f6;
    color: #4b5563;
  }
}
.custom-input {
  :deep(.q-field__control) {
    border-radius: 4px;
  }
  :deep(.q-field__control:before) {
    border-color: #e5e7eb;
  }
}
.block {
  display: block;
}
</style>
