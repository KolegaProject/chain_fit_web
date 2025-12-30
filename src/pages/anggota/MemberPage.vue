<template>
  <q-page class="q-pa-lg bg-grey-2">
    <q-card flat class="rounded-borders shadow-1 q-mb-xl custom-card">
      <q-card-section class="q-pa-xl">
        <div class="text-h5 text-center text-weight-bolder q-mb-xl">Anggota Gym</div>

        <div class="row q-col-gutter-md q-mb-lg items-center">
          <div class="col">
            <q-input outlined dense v-model="filterAnggota" placeholder="Search..." class="search-input">
              <template v-slot:prepend><q-icon name="search" size="xs" /></template>
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
          :pagination="{ rowsPerPage: 10 }"
        >
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-chip dense text-color="white" :class="props.value === 'Aktif' ? 'bg-positive' : 'bg-negative'" class="status-chip">
                {{ props.value }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-masaAktif="props">
            <q-td :props="props">
              <q-chip dense :class="getMasaAktifClass(props.value)" class="masa-aktif-chip">
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

        <!-- replaced: search row for Riwayat Absensi -->
        <div class="row q-col-gutter-md q-mb-lg items-center">
          <div class="col">
            <q-input outlined dense v-model="filterAbsensi" placeholder="Search..." class="search-input">
              <template v-slot:prepend><q-icon name="search" size="xs" /></template>
            </q-input>
          </div>

          <div class="col-auto" style="min-width: 200px">
            <q-input outlined dense v-model="filterTanggal" placeholder="Filter Tanggal" class="search-input" mask="####-##-##">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="filterTanggal" mask="YYYY-MM-DD">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                        <q-btn v-close-popup label="Reset" color="negative" flat @click="filterTanggal = ''" />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <div class="col-auto">
            <q-btn unelevated label="Tambah Absen" class="btn-tambah q-px-lg" @click="showAddAbsensi = true" />
          </div>
        </div>

        <q-table
          flat
          :rows="filteredAbsensi"
          :columns="columnsAbsensi"
          row-key="id"
          class="custom-table"
          hide-bottom
          :pagination="{ rowsPerPage: 10 }"
        />
      </q-card-section>
    </q-card>

    <q-dialog v-model="showAddAbsensi" persistent>
      <q-card class="dialog-card q-pa-md">
        <q-btn icon="close" flat round dense v-close-popup class="close-btn text-grey-6" />

        <q-card-section class="text-center q-pt-lg">
          <div class="text-h6 text-weight-bolder">Tambah Absensi</div>
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle1 text-weight-bold q-mb-xs">Nama anggota</div>
          <q-input
            outlined
            v-model="namaAbsen"
            placeholder="Search..."
            class="custom-search-input"
            dense
            @keyup.enter="confirmAbsensi"
          />
        </q-card-section>

        <q-card-actions align="center" class="q-pb-lg q-gutter-x-md">
          <q-btn flat label="Batal" v-close-popup class="btn-action-dialog btn-batal-dialog" no-caps />
          <q-btn unelevated label="Konfirmasi" class="btn-action-dialog btn-konfirmasi-dialog" no-caps @click="confirmAbsensi" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showConfirmDelete" persistent>
      <q-card class="dialog-card q-pa-lg text-center">
        <q-btn icon="close" flat round dense v-close-popup class="close-btn text-grey-6" />

        <q-card-section class="q-pt-md">
          <q-img
            src="../../assets/popup/hapus.png"
            style="width: 150px; height: auto"
            class="q-mb-md"
          />

          <div class="text-h6 text-weight-bolder q-mb-sm">Apakah Anda yakin ingin melanjutkan?</div>
          <div class="text-body2 text-grey-8">
            Data staff yang dihapus tidak dapat dipulihkan.
          </div>
        </q-card-section>

        <q-card-actions align="center" class="q-pb-md q-gutter-x-md">
          <q-btn
            flat
            label="Batal"
            v-close-popup
            class="btn-action-dialog btn-batal-dialog"
            no-caps
          />
          <q-btn
            unelevated
            label="Ya, Hapus Data"
            class="btn-action-dialog btn-konfirmasi-dialog"
            no-caps
            v-close-popup  @click="executeDelete"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>

</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()

const filterAnggota = ref('')
const rowsAnggota = ref([])

const showAddAbsensi = ref(false)
const namaAbsen = ref('')
const showConfirmDelete = ref(false)
const selectedMemberToDelete = ref(null)

const filterTanggal = ref('') // Format default: YYYY-MM-DD

const columnsAnggota = [
  { name: 'nama', align: 'left', label: 'Nama', field: 'nama', sortable: true },
  { name: 'email', align: 'left', label: 'Email', field: 'email', sortable: true },
  { name: 'status', align: 'center', label: 'Status Member', field: 'status' },
  { name: 'masaAktif', align: 'center', label: 'Masa Aktif', field: 'masaAktif' },
  { name: 'actions', align: 'right', label: '', field: 'actions' },
]

const filterAbsensi = ref('')
const rowsAbsensi = ref([])

const columnsAbsensi = [
  { name: 'nama', align: 'left', label: 'Nama', field: 'nama' },
  { name: 'email', align: 'left', label: 'Email', field: 'email' },
  { name: 'tanggal', align: 'center', label: 'Tanggal', field: 'tanggal' },
  { name: 'waktu', align: 'center', label: 'Waktu', field: 'waktu' },
]

const handleMembersUpdated = () => {
  loadMembers()
}

onMounted(() => {
  loadMembers()
  loadAbsensi()

  window.addEventListener('members:updated', handleMembersUpdated)
})

onBeforeUnmount(() => {
  window.removeEventListener('members:updated', handleMembersUpdated)
})

const loadMembers = () => {
  try {
    const raw = localStorage.getItem('members')
    if (raw) {
      const parsed = JSON.parse(raw)
      rowsAnggota.value = parsed.map(m => ({
        ...m,
        masaAktif: Number(m.masaAktif) || 0
      }))
    } else {
      rowsAnggota.value = []
    }
  } catch (err) {
    console.warn('Failed to load members:', err)
    rowsAnggota.value = []
  }
}

const loadAbsensi = () => {
  try {
    const raw = localStorage.getItem('absensi')
    if (raw) {
      rowsAbsensi.value = JSON.parse(raw)
    } else {
      rowsAbsensi.value = []
    }
  } catch (err) {
    console.warn('Failed to load absensi:', err)
    rowsAbsensi.value = []
  }
}

const filteredAbsensi = computed(() => {
  let data = rowsAbsensi.value || []

  if (filterTanggal.value) {
    const targetDate = String(filterTanggal.value).replace(/\//g, '-')
    data = data.filter(row => row.tanggal === targetDate)
  }

  const query = (filterAbsensi.value || '').toLowerCase().trim()
  if (query) {
    data = data.filter(row =>
      String(row.nama || '').toLowerCase().includes(query) ||
      String(row.email || '').toLowerCase().includes(query)
    )
  }

  return data
})

const goToTambahAnggota = () => {
  router.push('/anggota/tambah')
}

const persistMembers = () => {
  try {
    localStorage.setItem('members', JSON.stringify(rowsAnggota.value))
  } catch (err) {
    console.warn('Failed to persist members:', err)
  }
}

const editAnggota = (row) => {
  if (!row) return
  router.push(`/anggota/edit/${row.id}`)
}

const deleteAnggota = (row) => {
  if (!row) return
  selectedMemberToDelete.value = row
  showConfirmDelete.value = true
}

const executeDelete = () => {
  if (selectedMemberToDelete.value) {
    rowsAnggota.value = rowsAnggota.value.filter(r => r.id !== selectedMemberToDelete.value.id)
    persistMembers()
    $q.notify({ type: 'positive', message: 'Anggota berhasil dihapus' })
    showConfirmDelete.value = false
    selectedMemberToDelete.value = null
  }
}

const getMasaAktifClass = (days) => {
  const d = Number(days) || 0
  if (d >= 10) return 'bg-green-2 text-green-9'
  if (d > 0) return 'bg-orange-2 text-orange-9'
  return 'bg-red-2 text-red-9'
}

const confirmAbsensi = () => {
  if (!namaAbsen.value.trim()) {
    $q.notify({ type: 'negative', message: 'Nama anggota harus diisi!' })
    return
  }

  const now = new Date()
  const tanggal = now.toISOString().split('T')[0]
  const waktu = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')

  const newEntry = {
    id: Date.now(),
    nama: namaAbsen.value,
    email: `${namaAbsen.value.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
    tanggal,
    waktu
  }

  rowsAbsensi.value.unshift(newEntry)

  localStorage.setItem('absensi', JSON.stringify(rowsAbsensi.value))

  namaAbsen.value = ''
  showAddAbsensi.value = false

  $q.notify({ type: 'positive', message: 'Absensi berhasil dikonfirmasi' })
}
</script>

<style lang="scss" scoped>
.custom-card { border-radius: 15px; }
.custom-table {
  :deep(thead tr th) { font-weight: 800; color: black; border-bottom: none; font-size: 16px; }
  :deep(tbody tr td) { border-bottom: none; vertical-align: middle; font-size: 14px; }
  :deep(tbody tr:nth-child(even)) { background-color: #f8f9fa; }
  :deep(tbody tr:nth-child(odd)) { background-color: #ffffff; }
}
.search-absensi {
  width: 220px;
  max-width: 40vw;
  :deep(.q-field__control) {
    border-radius: 8px;
  }
}
.btn-tambah {
  background-color: #0c0c0c;
  color: white;
  border-radius: 8px;
  text-transform: none;
  font-weight: bold;
  height: 36px;
}
.btn-dark-custom {
  background-color: #0c0c0c;
  color: white;
  border-radius: 8px;
  text-transform: none;
  font-weight: bold;
  height: 36px;
}

.status-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  min-width: 92px;
  padding: 0 12px;
  font-weight: 700;
  border-radius: 10px;
  font-size: 13px;
  text-transform: none;
}
.masa-aktif-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  min-width: 120px;
  padding: 0 12px;
  font-weight: 700;
  border-radius: 10px;
  font-size: 13px;
  text-transform: none;
}
.btn-edit {
  background-color: #2563eb;
  color: white;
  border-radius: 6px;
  text-transform: none;
}
.btn-delete {
  background-color: #ef4444;
  color: white;
  border-radius: 6px;
  text-transform: none;
}
.search-input {
  max-width: 100%;
  :deep(.q-field__control) {
    border-radius: 8px;
  }
}

.dialog-card {
  width: 100%;
  max-width: 450px;
  border-radius: 20px;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #f0f0f0;
}

.custom-search-input {
  :deep(.q-field__control) {
    border-radius: 12px;
    border: 1.5px solid #555;
    &:before, &:after { display: none; }
  }
}

.btn-action-dialog {
  width: 140px;
  height: 44px;
  border-radius: 12px;
  font-weight: bold;
}

.btn-batal-dialog {
  background: #f0f0f0;
  color: black;
}

.btn-konfirmasi-dialog {
  background: linear-gradient(to bottom, #a0a0a0, #666666);
  color: white;
}
</style>
