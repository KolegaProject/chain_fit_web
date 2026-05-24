<template>
  <q-page class="q-pa-lg bg-grey-2">
    <!-- ================= MEMBERS LIST ================= -->
    <q-card flat class="custom-card q-mb-lg bg-white">
      <q-card-section>
        <div class="text-h6 text-weight-bold q-mb-lg text-dark">Gym Members</div>

        <div class="row items-center q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-9">
            <q-input
              dense
              outlined
              v-model="filterAnggota"
              placeholder="Search by name or email..."
              class="custom-input"
            >
              <template #prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3 text-right">
            <q-btn
              label="Add New Member"
              unelevated
              no-caps
              class="btn-dark full-width"
              @click="goToTambahAnggota"
            />
          </div>
        </div>

        <q-table
          flat
          :rows="rowsAnggota"
          :columns="columnsAnggota"
          row-key="id"
          :filter="filterAnggota"
          :pagination="paginationConfig"
          separator="none"
          class="dashboard-table"
        >
          <template #body-cell-status="props">
            <q-td :props="props">
              <q-badge
                :color="props.value === 'AKTIF' ? 'positive' : 'negative'"
                class="q-px-sm q-py-xs"
                style="border-radius: 4px"
              >
                {{ props.value === 'AKTIF' ? 'Active' : 'Inactive' }}
              </q-badge>
            </q-td>
          </template>

          <template #body-cell-masaAktif="props">
            <q-td :props="props">
              <div class="masa-aktif">
                <span class="dot" :class="getDotClass(props.value)" />
                {{ props.value }} days left
              </div>
            </q-td>
          </template>

          <template #body-cell-actions="props">
            <q-td :props="props" class="text-right q-gutter-sm">
              <!-- Tombol Edit dengan desain konsisten -->
              <q-btn
                unelevated
                label="Edit"
                no-caps
                class="btn-edit"
                @click="editAnggota(props.row)"
              />
              <q-btn
                unelevated
                label="Delete"
                no-caps
                class="btn-delete"
                @click="deleteAnggota(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- ================= ATTENDANCE HISTORY ================= -->
    <q-card flat class="custom-card q-mt-xl bg-white">
      <q-card-section>
        <div class="text-h6 text-weight-bold q-mb-lg text-dark">Attendance History</div>

        <div class="row items-center q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-6">
            <q-input
              dense
              outlined
              v-model="filterAbsensi"
              placeholder="Search member..."
              class="custom-input"
            >
              <template #prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-3">
            <q-input dense outlined v-model="filterTanggal" type="date" class="custom-input" />
          </div>
        </div>

        <q-table
          flat
          :rows="filteredAbsensi"
          :columns="columnsAbsensi"
          row-key="id"
          :pagination="paginationConfig"
          separator="none"
          class="dashboard-table"
        />
      </q-card-section>
    </q-card>

    <!-- DELETE CONFIRMATION DIALOG -->
    <q-dialog v-model="showConfirmDelete" persistent>
      <q-card class="dialog-card q-pa-md">
        <q-btn icon="close" flat round dense v-close-popup class="close-btn text-grey-6" />
        <q-card-section class="text-center q-pt-lg">
          <q-icon name="warning" size="60px" color="negative" class="q-mb-md" />
          <div class="text-h6 text-weight-bold text-dark">Delete Member?</div>
          <div class="text-body2 text-grey-7 q-mt-sm">
            Are you sure you want to delete <strong>{{ selectedMemberToDelete?.nama }}</strong
            >? This action cannot be undone.
          </div>
        </q-card-section>
        <q-card-actions align="center" class="q-pb-lg q-gutter-x-md">
          <q-btn flat label="Cancel" v-close-popup class="btn-dialog-flat" no-caps />
          <q-btn
            unelevated
            label="Yes, Delete"
            class="btn-delete"
            no-caps
            :loading="deleting"
            @click="executeDelete"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAnggotaStore } from 'src/stores/Anggota.js'
import { useGymStore } from 'src/stores/Gym'
import { storeToRefs } from 'pinia'

const router = useRouter()
const $q = useQuasar()
const anggotaStore = useAnggotaStore()
const gymStore = useGymStore()

const { rows, riwayatAbsensi } = storeToRefs(anggotaStore)
const gymId = computed(() => gymStore.selectedGymId)

const filterAnggota = ref('')
const filterAbsensi = ref('')
const filterTanggal = ref('')
const showConfirmDelete = ref(false)
const selectedMemberToDelete = ref(null)
const deleting = ref(false)

const paginationConfig = ref({ rowsPerPage: 10, page: 1 })

const columnsAnggota = [
  { name: 'nama', label: 'Name', field: 'nama', align: 'left', sortable: true },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'masaAktif', label: 'Membership Period', field: 'masaAktif', align: 'center' },
  { name: 'actions', label: 'Options', field: 'actions', align: 'right' },
]

const columnsAbsensi = [
  { name: 'nama', label: 'Name', field: 'nama', align: 'left' },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'tanggal', label: 'Date', field: 'tanggal', align: 'center' },
  { name: 'waktu', label: 'Time', field: 'waktu', align: 'center' },
]

onMounted(() => {
  if (gymId.value) {
    anggotaStore.fetchAnggota(gymId.value)
    anggotaStore.fetchRiwayatAbsensi(gymId.value)
  }
})

const rowsAnggota = computed(() =>
  (rows.value || []).map((item) => ({
    id: item.id,
    nama: item.name ?? '-',
    email: item.email ?? '-',
    status: item.status,
    masaAktif: item.masaAktifHari ?? 0,
  })),
)

const mappedAbsensi = computed(() =>
  (riwayatAbsensi.value || []).map((item) => {
    const date = new Date(item.checkInAt)
    return {
      id: item.id,
      nama: item.membership?.user?.name ?? '-',
      email: item.membership?.user?.email ?? '-',
      tanggal: date.toISOString().slice(0, 10),
      waktu: date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    }
  }),
)

const filteredAbsensi = computed(() => {
  let data = mappedAbsensi.value
  if (filterTanggal.value) data = data.filter((r) => r.tanggal === filterTanggal.value)
  if (filterAbsensi.value) {
    const search = filterAbsensi.value.toLowerCase()
    data = data.filter(
      (r) => r.nama.toLowerCase().includes(search) || r.email.toLowerCase().includes(search),
    )
  }
  return data
})

const goToTambahAnggota = () => router.push('/anggota/tambah')
const editAnggota = (row) => router.push(`/anggota/edit/${row.id}`)

const deleteAnggota = (row) => {
  if (row.status === 'AKTIF') {
    $q.notify({ type: 'warning', message: 'Active members cannot be deleted.' })
    return
  }
  selectedMemberToDelete.value = row
  showConfirmDelete.value = true
}

const executeDelete = async () => {
  deleting.value = true
  try {
    await anggotaStore.deleteAnggota(gymId.value, selectedMemberToDelete.value.id)
    $q.notify({ type: 'positive', message: 'Member successfully deleted' })
    showConfirmDelete.value = false
  } catch (err) {
    console.error('Delete error:', err)
    $q.notify({ type: 'negative', message: 'Failed to delete member' })
  } finally {
    deleting.value = false
  }
}

const getDotClass = (days) => {
  if (days >= 10) return 'dot-green'
  if (days > 0) return 'dot-orange'
  return 'dot-red'
}

watch(gymId, (newId) => {
  if (newId) {
    anggotaStore.fetchAnggota(newId)
    anggotaStore.fetchRiwayatAbsensi(newId)
  }
})
</script>

<style scoped lang="scss">
.custom-card {
  border-radius: 8px;
  border: 1px solid #f3f4f6;
}

.custom-input {
  :deep(.q-field__control) {
    border-radius: 4px;
  }
  :deep(.q-field__control:before) {
    border-color: #e5e7eb;
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
  }
}

.btn-dark {
  background-color: #111827 !important;
  color: white;
  border-radius: 4px;
  font-weight: 500;
  height: 40px;
}

.btn-edit {
  border-radius: 4px;
  border: 1px solid #111827;
  color: #111827;
  font-weight: 500;
  background-color: transparent !important;
  transition: all 0.3s ease;

  &:hover {
    background-color: #111827 !important;
    color: white !important;
  }
}

.btn-delete {
  border-radius: 4px;
  background-color: #ef4444;
  color: white;
  font-weight: 500;
}

.masa-aktif {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  border-radius: 4px;
  background: #f9fafb;
  font-size: 13px;
  font-weight: 600;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.dot-green {
  background: #16a34a;
}
.dot-orange {
  background: #f97316;
}
.dot-red {
  background: #dc2626;
}

.dialog-card {
  width: 100%;
  max-width: 400px;
  border-radius: 8px;
}
.btn-dialog-flat {
  width: 100px;
  background-color: #f3f4f6;
  border-radius: 4px;
}
.close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
}
</style>
