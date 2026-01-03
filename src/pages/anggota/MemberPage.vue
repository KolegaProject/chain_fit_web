<template>
  <q-page class="q-pa-lg bg-grey-2">

    <!-- ================= ANGGOOTA GYM ================= -->
    <q-card flat class="card">
      <q-card-section>
        <div class="title">Anggota Gym</div>

        <div class="row items-center q-mb-md">
          <q-input
            dense
            outlined
            v-model="filterAnggota"
            placeholder="Search..."
            class="col search-input"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-btn
            label="Tambah"
            unelevated
            class="btn-dark q-ml-md"
            @click="goToTambahAnggota"
          />
        </div>

        <q-table
          flat
          :rows="rowsAnggota"
          :columns="columnsAnggota"
          row-key="id"
          :filter="filterAnggota"
          hide-bottom
          separator="none"
          class="custom-table"
        >
          <!-- STATUS -->
          <template #body-cell-status="props">
            <q-td>
              <q-chip
                dense
                class="status-chip"
                :class="props.value === 'AKTIF' ? 'status-aktif' : 'status-nonaktif'"
              >
                {{ props.value === 'AKTIF' ? 'Aktif' : 'Tidak Aktif' }}
              </q-chip>
            </q-td>
          </template>

          <!-- MASA AKTIF -->
          <template #body-cell-masaAktif="props">
            <q-td>
              <div class="masa-aktif">
                <span class="dot" :class="getDotClass(props.value)" />
                {{ props.value }} hari
              </div>
            </q-td>
          </template>

          <!-- ACTION -->
          <template #body-cell-actions="props">
            <q-td class="text-right q-gutter-sm">
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

    <!-- ================= RIWAYAT ABSENSI ================= -->
    <q-card flat class="card q-mt-xl">
      <q-card-section>
        <div class="title">Riwayat Absensi</div>

        <div class="row items-center q-mb-md">
          <q-input
            dense
            outlined
            v-model="filterAbsensi"
            placeholder="Search..."
            class="col search-input"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-input
            dense
            outlined
            v-model="filterTanggal"
            placeholder="Filter Tanggal"
            class="q-ml-md"
            mask="####-##-##"
          >
            <template #append>
              <q-icon name="event" />
            </template>
          </q-input>

          <q-btn
            label="Tambah"
            unelevated
            class="btn-dark q-ml-md"
          />
        </div>

        <q-table
          flat
          :rows="filteredAbsensi"
          :columns="columnsAbsensi"
          row-key="id"
          hide-bottom
          separator="none"
          class="custom-table"
        />
      </q-card-section>
    </q-card>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAnggotaStore } from 'src/stores/anggota'
import { storeToRefs } from 'pinia'

const router = useRouter()
const anggotaStore = useAnggotaStore()
const { rows, riwayatAbsensi } = storeToRefs(anggotaStore)

const GYM_ID = 1

/* ================= STATE ================= */
const filterAnggota = ref('')
const filterAbsensi = ref('')
const filterTanggal = ref('')

/* ================= COLUMNS ================= */
const columnsAnggota = [
  { name: 'nama', label: 'Nama', field: 'nama' },
  { name: 'email', label: 'Email', field: 'email' },
  { name: 'status', label: 'Status Member', field: 'status' },
  { name: 'masaAktif', label: 'Masa Aktif', field: 'masaAktif' },
  { name: 'actions', label: '', field: 'actions' }
]

const columnsAbsensi = [
  { name: 'tanggal', label: 'yyyy-MM-dd', field: 'tanggal' },
  { name: 'waktu', label: 'Waktu', field: 'waktu' }
]

/* ================= FETCH ================= */
onMounted(() => {
  anggotaStore.fetchAnggota(GYM_ID)
  anggotaStore.fetchRiwayatAbsensi(GYM_ID)
})

/* ================= MAPPING ================= */
const rowsAnggota = computed(() =>
  rows.value.map(item => ({
    id: item.id,
    nama: item.name,
    email: item.email,
    status: item.status,
    masaAktif: item.masaAktifHari
  }))
)

const mappedAbsensi = computed(() =>
  (riwayatAbsensi.value || []).map(item => {
    const date = new Date(item.checkInAt)
    return {
      id: item.id,
      tanggal: date.toISOString().slice(0, 10),
      waktu: date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  })
)

const filteredAbsensi = computed(() => {
  let data = mappedAbsensi.value

  if (filterTanggal.value) {
    data = data.filter(r => r.tanggal === filterTanggal.value)
  }

  if (filterAbsensi.value) {
    data = data.filter(r =>
      r.tanggal.includes(filterAbsensi.value) ||
      r.waktu.includes(filterAbsensi.value)
    )
  }

  return data
})

/* ================= ACTION ================= */
const goToTambahAnggota = () => router.push('/anggota/tambah')
const editAnggota = row => router.push(`/anggota/edit/${row.id}`)
const deleteAnggota = row => console.log('delete', row)

const getDotClass = days => {
  if (days >= 10) return 'dot-green'
  if (days > 0) return 'dot-orange'
  return 'dot-red'
}
</script>

<style scoped>
.card {
  border-radius: 20px;
  background: white;
}

/* TITLE */
.title {
  font-size: 20px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 20px;
}

/* TABLE */
.custom-table :deep(th) {
  font-weight: 800;
  font-size: 15px;
}

.custom-table :deep(td) {
  font-size: 14px;
}

/* SEARCH */
.search-input {
  max-width: 400px;
}

/* STATUS */
.status-chip {
  min-width: 90px;
  justify-content: center;
  font-weight: 700;
  border-radius: 12px;
}

.status-aktif {
  background: #16a34a;
  color: white;
}

.status-nonaktif {
  background: #be123c;
  color: white;
}

/* MASA AKTIF */
.masa-aktif {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 12px;
  background: #dcfce7;
  font-weight: 600;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.dot-green { background: #16a34a }
.dot-orange { background: #f97316 }
.dot-red { background: #dc2626 }

/* BUTTON */
.btn-dark {
  background: #0c0c0c;
  color: white;
  border-radius: 10px;
}

.btn-edit {
  background: #2563eb;
  color: white;
  border-radius: 10px;
}

.btn-delete {
  background: #dc2626;
  color: white;
  border-radius: 10px;
}
</style>
