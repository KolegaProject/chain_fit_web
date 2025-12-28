<template>
  <q-page class="q-pa-lg bg-grey-2">
    <q-card flat class="rounded-borders shadow-1 q-mb-xl custom-card">
      <q-card-section class="q-pa-xl">
        <div class="text-h5 text-center text-weight-bolder q-mb-xl">Anggota Gym</div>

        <div class="row q-col-gutter-md q-mb-lg items-center">
          <div class="col">
            <q-input outlined dense v-model="filterAnggota" placeholder="Search..." class="search-input">
              <template v-slot:prepend>
                <q-icon name="search" size="xs" />
              </template>
            </q-input>
          </div>
          <div class="col-auto">
            <q-btn unelevated class="btn-dark-custom q-px-lg" label="Tambah" @click="goToTambahAnggota" />
          </div>
        </div>

        <q-table
          flat
          :rows="rowsAnggota"
          :columns="columnsAnggota"
          row-key="id"
          :filter="filterAnggota"
          class="custom-table"
          hide-bottom
          :pagination="{ rowsPerPage: 0 }"
        >
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-chip
                dense
                text-color="white"
                :class="props.value === 'Aktif' ? 'bg-positive' : 'bg-negative'"
                class="q-px-md status-chip"
                label="Aktif"
                v-if="props.value === 'Aktif'"
              />
              <q-chip
                dense
                text-color="white"
                class="bg-negative q-px-md status-chip"
                label="Tidak Aktif"
                v-else
              />
            </q-td>
          </template>

          <template v-slot:body-cell-masaAktif="props">
            <q-td :props="props">
              <q-chip
                dense
                :class="getMasaAktifClass(props.value)"
                class="q-px-md masa-aktif-chip"
                icon="fiber_manual_record"
              >
                {{ props.value }} hari
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="text-right no-wrap">
              <q-btn unelevated dense label="Edit" class="btn-edit q-px-md q-mr-sm" @click="editAnggota(props.row)" />
              <q-btn unelevated dense label="Hapus" class="btn-delete q-px-md" @click="deleteAnggota(props.row)" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-card flat class="rounded-borders shadow-1 custom-card">
      <q-card-section class="q-pa-xl">
        <div class="text-h5 text-center text-weight-bolder q-mb-xl">Riwayat Absensi</div>

        <div class="row q-col-gutter-md q-mb-lg items-center">
          <div class="col">
            <q-input outlined dense v-model="filterAbsensi" placeholder="Search..." class="search-input">
              <template v-slot:prepend>
                <q-icon name="search" size="xs" />
              </template>
            </q-input>
          </div>
          <div class="col-auto">
            <q-btn unelevated class="btn-dark-custom q-px-lg" label="Tambah" />
          </div>
        </div>

        <q-table
          flat
          :rows="rowsAbsensi"
          :columns="columnsAbsensi"
          row-key="id"
          :filter="filterAbsensi"
          class="custom-table"
          hide-bottom
          :pagination="{ rowsPerPage: 0 }"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const filterAnggota = ref('')
const filterAbsensi = ref('')

const columnsAnggota = [
  { name: 'nama', align: 'left', label: 'Nama', field: 'nama', sortable: true },
  { name: 'email', align: 'left', label: 'Email', field: 'email', sortable: true },
  { name: 'status', align: 'center', label: 'Status Member', field: 'status' },
  { name: 'masaAktif', align: 'center', label: 'Masa Aktif', field: 'masaAktif' },
  { name: 'actions', align: 'right', label: '', field: 'actions' },
]

const rowsAnggota = ref([
  { id: 1, nama: 'Budi', email: 'budi@gmail.com', status: 'Aktif', masaAktif: 27 },
  { id: 2, nama: 'Dodit', email: 'dodit@gmail.com', status: 'Aktif', masaAktif: 27 },
  { id: 3, nama: 'Siti', email: 'sity@gmail.com', status: 'Aktif', masaAktif: 6 },
  { id: 4, nama: 'Akmal', email: 'akmal@gmail.com', status: 'Tidak Aktif', masaAktif: 0 },
  { id: 5, nama: 'Joko', email: 'joko@gmail.com', status: 'Aktif', masaAktif: 27 },
])

const columnsAbsensi = [
  { name: 'nama', align: 'left', label: 'Nama', field: 'nama' },
  { name: 'email', align: 'left', label: 'Email', field: 'email' },
  { name: 'tanggal', align: 'center', label: 'yyyy-MM-dd', field: 'tanggal' },
  { name: 'waktu', align: 'center', label: 'Waktu', field: 'waktu' },
]

const rowsAbsensi = ref([
  { id: 1, nama: 'Budi', email: 'budi@gmail.com', tanggal: '2025-12-14', waktu: '18 : 00' },
  { id: 2, nama: 'Dodit', email: 'dodit@gmail.com', tanggal: '2025-12-14', waktu: '18 : 30' },
  { id: 3, nama: 'Siti', email: 'sity@gmail.com', tanggal: '2025-12-14', waktu: '18 : 30' },
  { id: 4, nama: 'Akmal', email: 'akmal@gmail.com', tanggal: '2025-12-14', waktu: '18 : 45' },
  { id: 5, nama: 'Joko', email: 'joko@gmail.com', tanggal: '2025-12-14', waktu: '18 : 55' },
])

const getMasaAktifClass = (days) => {
  if (days >= 10) return 'bg-green-2 text-green-9'
  if (days > 0) return 'bg-orange-2 text-orange-9'
  return 'bg-red-2 text-red-9'
}

const goToTambahAnggota = () => {
  router.push('/anggota/tambah')
}
</script>

<style lang="scss" scoped>
.custom-card {
  border-radius: 15px;
}

.search-input {
  :deep(.q-field__control) {
    border-radius: 8px;
    background-color: white;
  }
}

.btn-dark-custom {
  background-color: #0c0c0c;
  color: white;
  border-radius: 8px;
  text-transform: none;
  font-weight: bold;
}

.custom-table {
  background: transparent;
  :deep(thead tr th) {
    font-weight: 800;
    color: black;
    font-size: 14px;
    border-bottom: none;
  }
  :deep(tbody tr td) {
    border-bottom: none;
    font-size: 14px;
    vertical-align: middle; /* ensure chips align vertically center */
    padding-top: 10px;
    padding-bottom: 10px;
  }
}

/* Adjusted status chip: fixed height, centered, consistent padding */
.status-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 34px;
  min-width: 96px; /* ensures similar width for labels */
  padding: 0 10px;
  font-weight: 700;
  border-radius: 10px;
  font-size: 13px;
  text-transform: none;
}

/* Adjusted masa aktif chip: aligned icon + text, tidy spacing */
.masa-aktif-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 34px;
  min-width: 110px;
  padding: 0 10px;
  font-weight: 700;
  border-radius: 10px;
  font-size: 13px;
  text-transform: none;

  :deep(.q-icon) {
    font-size: 8px; /* smaller dot icon */
    margin-top: 2px; /* visually center the icon with text */
  }
}

/* Keep button styles consistent */
.btn-edit {
  background-color: #2563eb;
  color: white;
  text-transform: none;
  border-radius: 6px;
  font-weight: 500;
}

.btn-delete {
  background-color: #ef4444;
  color: white;
  text-transform: none;
  border-radius: 6px;
  font-weight: 500;
}

/* Membuat baris belang (zebra) jika diperlukan,
    tapi desain Anda terlihat bersih putih */
:deep(tbody tr:nth-child(even)) {
  background-color: #f8fafc;
}
</style>
