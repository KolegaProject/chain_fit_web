<template>
  <q-page class="q-pa-lg bg-grey-2">
    <div class="row q-col-gutter-md q-mb-xl">
      <div class="col-12 col-md-6">
        <q-card flat class="rounded-borders q-pa-md shadow-1">
          <div class="text-subtitle1 text-weight-bold q-mb-md">Pemasukkan</div>
          <div class="chart-container relative-position">
            <q-img src="/path_ke_grafik_pemasukan.png" class="full-height" fit="contain" />
          </div>
        </q-card>
      </div>
      <div class="col-12 col-md-6">
        <q-card flat class="rounded-borders q-pa-md shadow-1">
          <div class="text-subtitle1 text-weight-bold q-mb-md">Pengeluaran</div>
          <div class="chart-container relative-position">
            <q-img src="/path_ke_grafik_pengeluaran.png" class="full-height" fit="contain" />
          </div>
        </q-card>
      </div>
    </div>

    <div class="text-h6 text-weight-bold q-mb-sm">Pengeluaran</div>
    <q-table
      flat
      :rows="rowsPengeluaran"
      :columns="columns"
      hide-bottom
      class="custom-table q-mb-xl"
    />

    <div class="text-h6 text-weight-bold q-mb-sm">Pemasukan</div>
    <q-table
      flat
      :rows="rowsPemasukan"
      :columns="columns"
      hide-bottom
      class="custom-table q-mb-xl"
    />

    <q-dialog v-model="showAddAbsensi" persistent>
      <q-card class="dialog-card q-pa-md">
        <q-btn icon="close" flat round dense v-close-popup class="close-btn text-grey-6" />
        <q-card-section class="text-center q-pt-lg">
          <div class="text-h6 text-weight-bolder">Tambah Absensi</div>
        </q-card-section>
        <q-card-section>
          <div class="text-subtitle1 text-weight-bold q-mb-xs">Nama anggota</div>
          <q-input outlined v-model="search" placeholder="Search..." dense class="custom-search-input" />
        </q-card-section>
        <q-card-actions align="center" class="q-pb-lg q-gutter-x-md">
          <q-btn flat label="Batal" v-close-popup class="btn-dialog-flat" no-caps />
          <q-btn unelevated label="Konfirmasi" class="btn-dialog-gradient" no-caps />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showDeleteConfirm" persistent>
      <q-card class="dialog-card q-pa-lg text-center">
        <q-btn icon="close" flat round dense v-close-popup class="close-btn text-grey-6" />
        <q-card-section>
          <q-img src="/assets/popup/hapus.png" style="width: 150px" class="q-mb-md" />
          <div class="text-h6 text-weight-bolder">Apakah Anda yakin ingin melanjutkan?</div>
          <div class="text-body2 text-grey-7">Data staff yang dihapus tidak dapat dipulihkan.</div>
        </q-card-section>
        <q-card-actions align="center" class="q-pt-md q-gutter-x-md">
          <q-btn flat label="Batal" v-close-popup class="btn-dialog-flat" no-caps />
          <q-btn unelevated label="Ya, Hapus Data" class="btn-dialog-gradient" no-caps />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const showAddAbsensi = ref(false)
const showDeleteConfirm = ref(false)
const search = ref('')

const columns = [
  { name: 'no', label: 'No', field: 'no', align: 'left', sortable: true },
  { name: 'nama', label: 'Nama', field: 'nama', align: 'left' },
  { name: 'jumlah', label: 'Jumlah', field: 'jumlah', align: 'left' },
  { name: 'pembayaran', label: 'Pembayaran', field: 'pembayaran', align: 'left' },
]

const rowsPengeluaran = [
  { no: '01', nama: 'Listrik', jumlah: 'Rp 100,000', pembayaran: 'BNI' },
  { no: '02', nama: 'Air Mineral', jumlah: 'Rp 100,000', pembayaran: 'Mandiri' },
  { no: '02', nama: 'Perbaikan alat', jumlah: 'Rp 100,000', pembayaran: 'BNI' },
]

const rowsPemasukan = [
  { no: '01', nama: 'Paket A', jumlah: 'Rp 100,000', pembayaran: 'BNI' },
  { no: '02', nama: 'Paket B', jumlah: 'Rp 100,000', pembayaran: 'BNI' },
  { no: '02', nama: 'Paket C', jumlah: 'Rp 100,000', pembayaran: 'Mandiri' },
]
</script>

<style lang="scss" scoped>
/* TABEL KEUANGAN */
.custom-table {
  background: white;
  border-radius: 12px;
  :deep(thead tr th) {
    font-weight: 800;
    color: black;
    border-bottom: none;
    font-size: 15px;
    background-color: #f8f9fa;
  }
  :deep(tbody tr td) {
    border-bottom: 1px solid #f1f1f1;
    font-size: 14px;
  }

  :deep(table),
  :deep(thead th),
  :deep(tbody td) {
    box-sizing: border-box;
  }

  :deep(thead tr th:nth-child(1)),
  :deep(tbody tr td:nth-child(1)) {
    width: 80px;
    min-width: 80px;
    max-width: 80px;
    padding-left: 16px;
    text-align: left;
  }

  :deep(thead tr th:nth-child(2)),
  :deep(tbody tr td:nth-child(2)) {
    width: 260px;
    min-width: 160px;
    max-width: 320px;
    text-align: left;
  }

  :deep(thead tr th:nth-child(3)),
  :deep(tbody tr td:nth-child(3)) {
    width: 160px;
    min-width: 120px;
    max-width: 200px;
    text-align: left;
  }

  :deep(thead tr th:nth-child(4)),
  :deep(tbody tr td:nth-child(4)) {
    width: 160px;
    min-width: 120px;
    max-width: 200px;
    text-align: left;
  }
}

/* GRAFIK CONTAINER */
.chart-container {
  height: 280px;
  width: 100%;
}

/* DIALOGS (Sesuai Gambar Pop-up) */
.dialog-card {
  width: 100%;
  max-width: 480px;
  border-radius: 24px;
  position: relative;
}
.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: #f0f0f0;
}
.custom-search-input {
  :deep(.q-field__control) {
    border-radius: 15px;
    border: 2px solid #555;
    height: 52px;
    &:before, &:after { display: none; }
  }
}
.btn-dialog-flat {
  width: 160px;
  height: 48px;
  border-radius: 14px;
  background-color: #f0f2f5;
  color: black;
  font-weight: 800;
}
.btn-dialog-gradient {
  width: 160px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(to bottom, #a0a0a0, #666666);
  color: white;
  font-weight: 800;
}
</style>
