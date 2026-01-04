<template>
  <q-page class="q-pa-lg bg-grey-2">
    <q-card flat class="card">
      <q-card-section>
        <div class="title">Anggota Gym</div>
        <div class="row items-center q-col-gutter-md q-mb-md">
          <div class="col-9">
            <q-input
              dense
              outlined
              v-model="filterAnggota"
              placeholder="Cari Nama atau Email..."
              class="search-input-full"
            >
              <template #prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <div class="col-3 text-right">
            <q-btn
              label="Tambah"
              unelevated
              class="btn-dark"
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
          class="custom-table"
        >
          <template #body-cell-status="props">
            <q-td :props="props">
              <q-chip
                dense
                class="status-chip"
                :class="props.value === 'AKTIF' ? 'status-aktif' : 'status-nonaktif'"
              >
                {{ props.value === 'AKTIF' ? 'Aktif' : 'Tidak Aktif' }}
              </q-chip>
            </q-td>
          </template>

          <template #body-cell-masaAktif="props">
            <q-td :props="props">
              <div class="masa-aktif">
                <span class="dot" :class="getDotClass(props.value)" />
                {{ props.value }} hari
              </div>
            </q-td>
          </template>

          <template #body-cell-actions="props">
            <q-td :props="props" class="text-right q-gutter-sm">
              <q-btn
                unelevated
                label="Edit"
                class="btn-edit"
                @click="editAnggota(props.row)"
              />
              <q-btn
                unelevated
                label="Hapus"
                class="btn-delete"
                @click="deleteAnggota(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-card flat class="card q-mt-xl">
      <q-card-section>
        <div class="title">Riwayat Absensi</div>

        <div class="row items-center q-col-gutter-md q-mb-md">
          <div class="col-6">
            <q-input
              dense
              outlined
              v-model="filterAbsensi"
              placeholder="Search..."
              class="search-input-full"
            >
              <template #prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <div class="col-3">
            <q-input
              dense
              outlined
              v-model="filterTanggal"
              type="date"
            />
          </div>
        </div>

        <q-table
          flat
          :rows="filteredAbsensi"
          :columns="columnsAbsensi"
          row-key="id"
          :pagination="paginationConfig"
          separator="none"
          class="custom-table"
        />
      </q-card-section>
    </q-card>
    <q-dialog v-model="showConfirmDelete" persistent>
      <q-card class="dialog-card q-pa-md">
        <q-btn icon="close" flat round dense v-close-popup class="close-btn text-grey-6" />
        <q-card-section class="text-center q-pt-lg">
          <q-img
            src="../../assets/popup/hapus.png"
            style="width: 140px; height: auto"
            class="q-mb-md"
          />
          <div class="text-h6 text-weight-bolder">Hapus Data Anggota?</div>
          <div class="text-body2 text-grey-7 q-mt-sm">
            Hapus anggota <strong>{{ selectedMemberToDelete?.nama }}</strong>? Data tidak dapat dipulihkan.
          </div>
        </q-card-section>
        <q-card-actions align="center" class="q-pb-lg q-gutter-x-md">
          <q-btn flat label="Batal" v-close-popup class="btn-dialog-flat" no-caps />
          <q-btn
            unelevated
            label="Ya, Hapus"
            class="btn-dialog-gradient"
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

// const showAddAbsensi = ref(false)

const paginationConfig = ref({
  rowsPerPage: 10,
  page: 1
})

const columnsAnggota = [
  { name: 'nama', label: 'Nama', field: 'nama', align: 'left' },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'status', label: 'Status Member', field: 'status', align: 'center' },
  { name: 'masaAktif', label: 'Masa Aktif', field: 'masaAktif', align: 'center' },
  { name: 'actions', label: '', field: 'actions', align: 'right' }
]

const columnsAbsensi = [
  { name: 'nama', label: 'Nama', field: 'nama', align: 'left' },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'tanggal', label: 'Tanggal', field: 'tanggal', align: 'center' },
  { name: 'waktu', label: 'Waktu', field: 'waktu', align: 'center' }
]

onMounted(() => {
  if (gymId.value) {
    anggotaStore.fetchAnggota(gymId.value)
    anggotaStore.fetchRiwayatAbsensi(gymId.value)
  }
})

const rowsAnggota = computed(() =>
  (rows.value || []).map(item => ({
    id: item.id,
    nama: item.name ?? '-',
    email: item.email ?? '-',
    status: item.status,
    masaAktif: item.masaAktifHari ?? 0
  }))
)

const mappedAbsensi = computed(() =>
  (riwayatAbsensi.value || []).map(item => {
    const date = new Date(item.checkInAt)
    return {
      id: item.id,
      nama: item.membership?.user?.name ?? '-',
      email: item.membership?.user?.email ?? '-',
      tanggal: date.toISOString().slice(0, 10),
      waktu: date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
  })
)

const filteredAbsensi = computed(() => {
  let data = mappedAbsensi.value
  if (filterTanggal.value) {
    data = data.filter(r => r.tanggal === filterTanggal.value)
  }
  if (filterAbsensi.value) {
    const search = filterAbsensi.value.toLowerCase()
    data = data.filter(r =>
      r.nama.toLowerCase().includes(search) ||
      r.email.toLowerCase().includes(search)
    )
  }
  return data
})

const goToTambahAnggota = () => router.push('/anggota/tambah')
const editAnggota = row => router.push(`/anggota/edit/${row.id}`)

const deleteAnggota = row => {
  if (!row) return
  // Validasi: Member aktif biasanya tidak boleh dihapus demi integritas data
  if (row.status === 'AKTIF') {
    $q.notify({
      type: 'negative',
      message: 'Member masih aktif. Member Tidak Bisa di Hapus.'
    })
    return
  }
  selectedMemberToDelete.value = row
  showConfirmDelete.value = true
}

const executeDelete = async () => {
  if (!selectedMemberToDelete.value) return
  deleting.value = true
  try {
    await anggotaStore.deleteAnggota(gymId.value, selectedMemberToDelete.value.id)
    $q.notify({ type: 'positive', message: 'Member berhasil dihapus' })
    showConfirmDelete.value = false
    selectedMemberToDelete.value = null
  } catch (err) {
    $q.notify({ type: 'negative', message: err.message || 'Gagal menghapus member' })
  } finally {
    deleting.value = false
  }
}

const getDotClass = days => {
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

<style scoped>
.card {
  border-radius: 20px;
  background: white;
}

.title {
  font-size: 20px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 20px;
}

.custom-table :deep(th) {
  text-align: center;
  font-weight: 800;
  font-size: 15px;
  color: #616161;
}

.custom-table :deep(.q-table__bottom) {
  border-top: 1px solid #edf2f7;
  justify-content: center; /* Merapikan posisi pagination */
}

.search-input-full {
  width: 100%;
}

.status-chip {
  min-width: 100px;
  justify-content: center;
  font-weight: 700;
  border-radius: 10px;
}

.status-aktif {
  background: #16a34a;
  color: white;
}

.status-nonaktif {
  background: #be123c;
  color: white;
}

.masa-aktif {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 12px;
  background: #f1f5f9;
  font-weight: 600;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.dot-green { background: #16a34a }
.dot-orange { background: #f97316 }
.dot-red { background: #dc2626 }

.btn-dark {
  background: #0c0c0c;
  color: white;
  border-radius: 10px;
  padding: 8px 20px;
}

.btn-edit {
  background: #2563eb;
  color: white;
  border-radius: 8px;
}

.btn-delete {
  background: #dc2626;
  color: white;
  border-radius: 8px;
}

.dialog-card {
  width: 100%;
  max-width: 440px;
  border-radius: 24px;
}

.btn-dialog-flat {
  width: 130px;
  background-color: #f0f2f5;
  border-radius: 12px;
  font-weight: bold;
}

.btn-dialog-gradient {
  width: 130px;
  background: black;
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

@media (max-width: 1024px) {
  .col-9, .col-3, .col-6 {
    width: 100% !important;
    text-align: left !important;
    margin-bottom: 10px;
  }
}
</style>

<!--          <div class="col-3 text-right">-->
<!--            <q-btn-->
<!--              label="Tambah Absensi"-->
<!--              unelevated-->
<!--              icon="add"-->
<!--              class="btn-dark"-->
<!--              @click="showAddAbsensi = true"-->
<!--            />-->
<!--          </div>-->

<!--    <q-dialog v-model="showAddAbsensi" persistent>-->
<!--      <q-card style="width: 420px" class="q-pa-md">-->
<!--        <div class="text-h6 q-mb-md">Tambah Absensi</div>-->

<!--        <q-select-->
<!--          v-model="absensiForm.membershipId"-->
<!--          :options="rowsAnggota"-->
<!--          option-label="nama"-->
<!--          option-value="id"-->
<!--          label="Pilih Member"-->
<!--          outlined-->
<!--          dense-->
<!--          emit-value-->
<!--          map-options-->
<!--          class="q-mb-md"-->
<!--        />-->

<!--        <q-card-actions align="right">-->
<!--          <q-btn flat label="Batal" v-close-popup />-->
<!--          <q-btn-->
<!--            label="Simpan"-->
<!--            color="primary"-->
<!--            unelevated-->
<!--            @click="submitAbsensi"-->
<!--          />-->
<!--        </q-card-actions>-->
<!--      </q-card>-->
<!--    </q-dialog>-->

<!--// const submitAbsensi = async () => {-->
<!--//   if (!absensiForm.value.membershipId) {-->
<!--//     $q.notify({-->
<!--//       type: 'negative',-->
<!--//       message: 'Silakan pilih member'-->
<!--//     })-->
<!--//     return-->
<!--//   }-->
<!--//-->
<!--//   try {-->
<!--//     await anggotaStore.createAbsensi(-->
<!--//       absensiForm.value.membershipId-->
<!--//     )-->
<!--//-->
<!--//-->
<!--//     await anggotaStore.fetchRiwayatAbsensi(gymId.value)-->
<!--//-->
<!--//     showAddAbsensi.value = false-->
<!--//     absensiForm.value.membershipId = null-->
<!--//-->
<!--//     $q.notify({-->
<!--//       type: 'positive',-->
<!--//       message: 'Absensi berhasil ditambahkan'-->
<!--//     })-->
<!--//   } catch (err) {-->
<!--//     console.error(err)-->
<!--//     $q.notify({-->
<!--//       type: 'negative',-->
<!--//       message: 'Gagal menambahkan absensi'-->
<!--//     })-->
<!--//   }-->
<!--// }-->

<!--// const absensiForm = ref({-->
<!--//   membershipId: null-->
<!--// })-->
