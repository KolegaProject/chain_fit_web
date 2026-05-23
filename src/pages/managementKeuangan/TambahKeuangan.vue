<template>
  <q-page class="q-pa-lg bg-grey-1">
    <!-- Header Halaman -->
    <div class="row items-center justify-between q-mb-xl">
      <div class="row items-center">
        <q-icon name="account_balance_wallet" size="28px" class="q-mr-sm" />
        <div class="text-h5 text-weight-bold">Tambah Transaksi</div>
      </div>
      <q-btn
        flat
        unelevated
        color="primary"
        class="bg-blue-1 text-weight-medium border-radius-8 q-px-md"
        icon="arrow_back"
        label="Kembali"
        no-caps
        @click="kembali"
      />
    </div>

    <!-- Area Card Form -->
    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-7">
        <q-card flat bordered class="border-radius-12 q-pa-xl">
          <div class="text-subtitle1 text-weight-bold q-mb-md">Detail Transaksi</div>

          <q-separator class="q-mb-lg" />

          <!-- Toggle Pemasukan / Pengeluaran -->
          <div class="row bg-blue-1 q-pa-xs border-radius-8 q-mb-lg">
            <q-btn
              class="col border-radius-6 text-weight-bold"
              :unelevated="form.jenis === 'pemasukan'"
              :flat="form.jenis !== 'pemasukan'"
              :color="form.jenis === 'pemasukan' ? 'white' : 'transparent'"
              :text-color="form.jenis === 'pemasukan' ? 'primary' : 'grey-7'"
              label="Pemasukan"
              @click="form.jenis = 'pemasukan'"
              no-caps
            />
            <q-btn
              class="col border-radius-6 text-weight-bold"
              :unelevated="form.jenis === 'pengeluaran'"
              :flat="form.jenis !== 'pengeluaran'"
              :color="form.jenis === 'pengeluaran' ? 'white' : 'transparent'"
              :text-color="form.jenis === 'pengeluaran' ? 'primary' : 'grey-7'"
              label="Pengeluaran"
              @click="form.jenis = 'pengeluaran'"
              no-caps
            />
          </div>

          <!-- Form Input -->
          <div class="q-mb-md">
            <label class="text-caption text-weight-bold text-grey-9 q-mb-xs block"
              >Nama Transaksi</label
            >
            <q-input
              outlined
              dense
              v-model="form.nama"
              placeholder="Contoh: Paket Membership"
              class="bg-white border-radius-8"
            />
          </div>

          <div class="q-mb-md">
            <label class="text-caption text-weight-bold text-grey-9 q-mb-xs block"
              >Jumlah (Rp)</label
            >
            <q-input
              outlined
              dense
              v-model="form.jumlah"
              type="number"
              placeholder="0"
              class="bg-white border-radius-8"
            />
          </div>

          <div class="q-mb-lg">
            <label class="text-caption text-weight-bold text-grey-9 q-mb-xs block"
              >Metode Pembayaran</label
            >
            <q-select
              outlined
              dense
              v-model="form.metode"
              :options="metodeOptions"
              placeholder="Pilih Bank/E-Wallet"
              class="bg-white border-radius-8"
              dropdown-icon="expand_more"
            />
          </div>

          <!-- Tombol Tambah ke Daftar -->
          <q-btn
            unelevated
            color="dark"
            class="full-width border-radius-8 q-mb-xl q-py-sm"
            icon="add"
            label="Tambah ke Daftar"
            no-caps
          />

          <q-separator class="q-mb-lg" />

          <!-- Action Buttons (Batal & Simpan) -->
          <div class="row justify-end q-gutter-sm">
            <q-btn
              outline
              color="dark"
              label="Batal"
              class="border-radius-8 q-px-md"
              no-caps
              @click="kembali"
            />
            <q-btn
              unelevated
              color="dark"
              label="Simpan Transaksi"
              class="border-radius-8 q-px-md"
              no-caps
              @click="simpanTransaksi"
            />
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

// State Form
const form = reactive({
  jenis: 'pemasukan',
  nama: '',
  jumlah: '',
  metode: null,
})

// Opsi Select
const metodeOptions = ['BNI', 'Mandiri', 'BCA', 'Gopay', 'OVO', 'Dana', 'Cash']

// Aksi Navigasi
const kembali = () => {
  router.push('/finance')
}

// Aksi Simpan
const simpanTransaksi = () => {
  // Tambahkan logika simpan API di sini
  console.log('Menyimpan transaksi:', form)

  $q.notify({
    type: 'positive',
    message: 'Transaksi berhasil disimpan',
    position: 'top',
  })

  // Kembali ke halaman manajemen keuangan
  router.push('/finance')
}
</script>

<style scoped>
.border-radius-12 {
  border-radius: 12px;
}
.border-radius-8 {
  border-radius: 8px;
}
.border-radius-6 {
  border-radius: 6px;
}
.block {
  display: block;
}
</style>
