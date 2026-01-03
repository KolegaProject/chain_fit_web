<template>
  <q-page class="q-pa-lg bg-grey-2">
    <q-card flat class="rounded-borders shadow-1 q-mb-lg bg-white">
      <q-card-section class="q-pa-md row items-center justify-between">
        <div class="row items-center">
          <q-skeleton v-if="isLoading" type="QAvatar" size="32px" class="q-mr-md" />
          <q-icon v-else name="payments" color="black" size="32px" class="q-mr-md" />

          <q-skeleton v-if="isLoading" type="text" width="150px" height="30px" />
          <div v-else class="text-h5 text-weight-bold">Laporan Keuangan</div>
        </div>

        <q-skeleton
          v-if="isLoading"
          type="rect"
          width="160px"
          height="36px"
          class="rounded-borders"
        />
        <q-btn
          v-else
          unelevated
          label="Tambah Transaksi"
          icon="add"
          color="primary"
          no-caps
          class="rounded-borders q-px-md"
          @click="showAddAbsensi = true"
        />
      </q-card-section>
    </q-card>

    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-6">
        <q-card flat class="rounded-borders q-pa-md shadow-1 chart-card">
          <div class="row items-center justify-between q-mb-md">
            <q-skeleton v-if="isLoading" type="text" width="120px" />
            <div v-else class="text-subtitle1 text-weight-bold">Tren Pemasukan</div>

            <q-skeleton v-if="isLoading" type="rect" width="60px" height="20px" />
            <q-badge v-else class="q-pa-sm" outline color="positive" label="Bulanan" />
          </div>

          <div class="chart-wrapper">
            <q-skeleton v-if="isLoading" height="280px" square class="rounded-borders" />
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

      <div class="col-12 col-md-6">
        <q-card flat class="rounded-borders q-pa-md shadow-1 chart-card">
          <div class="row items-center justify-between q-mb-md">
            <q-skeleton v-if="isLoading" type="text" width="120px" />
            <div v-else class="text-subtitle1 text-weight-bold">Tren Pengeluaran</div>

            <q-skeleton v-if="isLoading" type="rect" width="60px" height="20px" />
            <q-badge v-else class="q-pa-sm" outline color="negative" label="Bulanan" />
          </div>

          <div class="chart-wrapper">
            <q-skeleton v-if="isLoading" height="280px" square class="rounded-borders" />
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

    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card flat class="rounded-borders shadow-1 overflow-hidden bg-white">
          <div class="row">
            <div class="col-12 col-md-6 q-pa-md border-right-md">
              <div class="row items-center q-mb-md">
                <q-skeleton v-if="isLoading" type="QAvatar" size="24px" class="q-mr-sm" />
                <q-icon v-else name="arrow_downward" color="positive" size="24px" class="q-mr-sm" />

                <q-skeleton v-if="isLoading" type="text" width="140px" />
                <div v-else class="text-h6 text-weight-bold">Daftar Pemasukan</div>
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
              />
            </div>

            <div class="col-12 col-md-6 q-pa-md">
              <div class="row items-center q-mb-md">
                <q-skeleton v-if="isLoading" type="QAvatar" size="24px" class="q-mr-sm" />
                <q-icon v-else name="arrow_upward" color="negative" size="24px" class="q-mr-sm" />

                <q-skeleton v-if="isLoading" type="text" width="140px" />
                <div v-else class="text-h6 text-weight-bold">Daftar Pengeluaran</div>
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
              />
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="showAddAbsensi" persistent>
      <q-card class="dialog-card q-pa-md">
        <q-btn icon="close" flat round dense v-close-popup class="close-btn text-grey-6" />
        <q-card-section class="text-center q-pt-lg">
          <div class="text-h6 text-weight-bolder">Tambah Transaksi Baru</div>
        </q-card-section>
        <q-card-section>
          <div class="text-subtitle1 text-weight-bold q-mb-xs">Nama Item</div>
          <q-input
            outlined
            v-model="search"
            placeholder="Contoh: Listrik, Paket A..."
            dense
            class="custom-search-input"
          />
        </q-card-section>
        <q-card-actions align="center" class="q-pb-lg q-gutter-x-md">
          <q-btn flat label="Batal" v-close-popup class="btn-dialog-flat" no-caps />
          <q-btn unelevated label="Konfirmasi" class="btn-dialog-gradient" no-caps />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const apexchart = VueApexCharts
const showAddAbsensi = ref(false)
const search = ref('')
const isLoading = ref(true)

const incomeSeries = [{ name: 'Pemasukan', data: [30, 40, 35, 50, 49, 60, 70] }]
const incomeChartOptions = {
  chart: { toolbar: { show: false }, fontFamily: 'inherit' },
  colors: ['#21BA45'],
  stroke: { curve: 'smooth', width: 3 },
  xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul'] },
  dataLabels: { enabled: false },
  grid: { borderColor: '#f1f1f1' },
}

const expenseSeries = [{ name: 'Pengeluaran', data: [20, 30, 25, 45, 30, 40, 35] }]
const expenseChartOptions = {
  chart: { toolbar: { show: false }, fontFamily: 'inherit' },
  colors: ['#c62828'],
  plotOptions: { bar: { borderRadius: 4, columnWidth: '50%' } },
  xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul'] },
  dataLabels: { enabled: false },
}

const columns = [
  { name: 'no', label: 'No', field: 'no', align: 'left' },
  { name: 'nama', label: 'Nama', field: 'nama', align: 'left' },
  { name: 'jumlah', label: 'Jumlah', field: 'jumlah', align: 'left' },
  { name: 'pembayaran', label: 'Pembayaran', field: 'pembayaran', align: 'left' },
]

const rowsPengeluaran = [
  { no: '01', nama: 'Listrik', jumlah: 'Rp 100,000', pembayaran: 'BNI' },
  { no: '02', nama: 'Air Mineral', jumlah: 'Rp 100,000', pembayaran: 'Mandiri' },
  { no: '03', nama: 'Perbaikan alat', jumlah: 'Rp 100,000', pembayaran: 'BNI' },
]

const rowsPemasukan = [
  { no: '01', nama: 'Paket A', jumlah: 'Rp 100,000', pembayaran: 'BNI' },
  { no: '02', nama: 'Paket B', jumlah: 'Rp 100,000', pembayaran: 'BNI' },
  { no: '03', nama: 'Paket C', jumlah: 'Rp 100,000', pembayaran: 'Mandiri' },
]

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})
</script>

<style lang="scss" scoped>
.chart-wrapper {
  min-height: 280px;
}

.rounded-borders {
  border-radius: 12px;
}

.border-right-md {
  @media (min-width: 1024px) {
    border-right: 1px dashed #e0e0e0;
  }
}

.dashboard-table {
  background: transparent;
  :deep(thead tr th) {
    font-weight: 800;
    background-color: #f8f9fa;
    color: #333;
    border-bottom: 1px solid #eee;
    font-size: 13px;
  }
  :deep(tbody tr td) {
    border-bottom: 1px solid #f5f5f5;
    font-size: 14px;
    padding: 12px 16px;
  }
}

.dialog-card {
  width: 100%;
  max-width: 480px;
  border-radius: 24px;
}

.btn-dialog-flat {
  width: 140px;
  background-color: #f0f2f5;
  border-radius: 12px;
  font-weight: bold;
}

.btn-dialog-gradient {
  width: 140px;
  background: linear-gradient(to bottom, #a0a0a0, #666666);
  color: white;
  border-radius: 12px;
  font-weight: bold;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: #f0f0f0;
}

</style>
