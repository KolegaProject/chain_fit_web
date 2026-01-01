<template>
  <q-page class="q-pa-lg bg-grey-2">
    <div v-if="gymStore.loading" class="flex flex-center q-pa-xl">
      <q-spinner-dots color="black" size="40px" />
      <div class="q-ml-md text-grey-7">Memuat informasi gym...</div>
    </div>

    <template v-else>
      <q-card flat class="rounded-borders q-mb-sm q-pa-md">
        <q-card-section>
          <div class="row items-center justify-between q-mb-lg">
            <div class="text-h5 text-weight-bold">
              {{ gymData.namaGym || 'Detail Informasi Gym' }}
            </div>
            <q-btn unelevated label="Edit" no-caps class="btn-edit q-px-lg" @click="editInfo" />
          </div>

          <div class="q-gutter-y-md">
            <div class="info-block">
              <div class="text-subtitle2 text-weight-bold q-mb-xs">Nama Gym</div>
              <div class="text-body1">{{ gymData.namaGym || '-' }}</div>
            </div>

            <div class="info-block">
              <div class="text-subtitle2 text-weight-bold q-mb-xs">Lokasi</div>
              <div class="text-body1 text-grey-9">
                {{ gymData.address || 'Alamat belum diatur' }}
              </div>
            </div>

            <div class="info-block">
              <div class="text-subtitle2 text-weight-bold q-mb-xs">Jam Operasional</div>
              <div class="text-body1 text-grey-9">
                {{ gymData.jamOperasional || 'Belum diatur' }}
              </div>
            </div>

            <div class="info-block">
              <div class="text-subtitle2 text-weight-bold q-mb-xs">Deskripsi</div>
              <div class="text-body1 text-grey-8 leading-relaxed">
                {{ gymData.description || 'Tidak ada deskripsi untuk gym ini.' }}
              </div>
            </div>
          </div>

          <div class="row q-gutter-sm q-mt-md">
            <template v-if="formattedTags.length > 0">
              <q-chip
                v-for="tag in formattedTags"
                :key="tag"
                square
                color="grey-8"
                text-color="white"
                class="q-px-md"
              >
                {{ tag }}
              </q-chip>
            </template>
            <div v-else class="text-caption text-grey-5 italic">Tidak ada tag.</div>
          </div>

          <div class="text-h6 text-weight-bold q-mt-xl q-mb-md">Paket Berlangganan</div>

          <div class="row q-col-gutter-lg">
            <div v-for="plan in subscriptionPlans" :key="plan.id" class="col-12 col-sm-4 col-md-3">
              <q-card flat class="package-card bg-grey-1">
                <q-card-section class="q-pa-md">
                  <div class="row items-center justify-between q-mb-sm">
                    <div class="text-h6 text-weight-bold">{{ plan.title }}</div>
                    <div class="row q-gutter-xs">
                      <q-btn
                        round
                        dense
                        icon="edit"
                        size="sm"
                        class="btn-icon-edit"
                        @click="editPlan(plan)"
                      />
                      <q-btn
                        round
                        dense
                        icon="delete"
                        size="sm"
                        class="btn-icon-delete"
                        @click="confirmDeletePlan(plan)"
                      />
                    </div>
                  </div>

                  <div class="text-h5 text-weight-bolder q-mb-md">
                    {{ plan.price }}<span class="text-caption text-weight-regular">/bulan</span>
                  </div>

                  <div class="feature-container">
                    <div
                      v-for="f in plan.features"
                      :key="f"
                      class="feature-item row no-wrap q-mb-sm"
                    >
                      <div class="dot q-mt-xs q-mr-sm"></div>
                      <div class="text-body2">{{ f }}</div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-12 col-sm-4 col-md-3">
              <div class="plan-add-box flex flex-center" @click="addPlan">
                <q-icon name="add" size="48px" color="grey-6" />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card flat class="rounded-borders q-pa-md">
        <q-card-section>
          <div class="text-h5 text-weight-bold text-center q-mb-xl">Fasilitas Gym (Alat)</div>

          <div class="row q-col-gutter-md q-mb-lg items-center">
            <div class="col">
              <q-input outlined dense v-model="search" placeholder="Cari alat..." class="bg-white">
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col-auto">
              <q-btn
                unelevated
                label="Tambah Alat"
                no-caps
                class="btn-tambah q-px-xl text-weight-bold"
                @click="goToTambahAlat"
              />
            </div>
          </div>

          <q-table
            flat
            :rows="equipments"
            :columns="columns"
            row-key="id"
            :filter="search"
            hide-bottom
            class="facilities-table"
          >
            <template v-slot:header="props">
              <q-tr :props="props" class="bg-white">
                <q-th
                  v-for="col in props.cols"
                  :key="col.name"
                  :props="props"
                  class="text-weight-bolder text-subtitle2"
                >
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  unelevated
                  label="Detail"
                  no-caps
                  class="btn-detail q-px-lg"
                  @click="goToDetail(props.row.id)"
                />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </template>

    <q-dialog v-model="showAddDialog" persistent>
      <q-card class="dialog-card q-pa-lg">
        <q-btn icon="close" flat round dense v-close-popup class="close-btn text-grey-6" />
        <q-card-section class="text-center q-pb-none">
          <div class="text-h6 text-weight-bolder">
            {{ editingPlanId ? 'Edit Paket' : 'Tambah Paket' }}
          </div>
        </q-card-section>
        <q-card-section class="q-gutter-y-md q-pt-lg">
          <q-input outlined dense v-model="newPlan.title" label="Nama Paket" />
          <q-input outlined dense v-model="newPlan.price" label="Harga" />
          <div
            v-for="(feature, index) in newPlan.features"
            :key="index"
            class="row items-center q-mb-sm"
          >
            <q-input
              outlined
              dense
              v-model="newPlan.features[index]"
              label="Fasilitas"
              class="col"
            />
            <q-btn
              flat
              round
              color="negative"
              icon="delete"
              size="sm"
              @click="removeFeatureInput(index)"
              v-if="newPlan.features.length > 1"
            />
          </div>
          <q-btn
            outline
            label="Tambah Fasilitas"
            icon="add"
            class="full-width"
            @click="addFeatureInput"
          />
        </q-card-section>
        <q-card-actions align="center">
          <q-btn flat label="Batal" v-close-popup class="btn-batal-dialog" no-caps />
          <q-btn
            unelevated
            label="Simpan"
            class="btn-konfirmasi-dialog"
            no-caps
            @click="submitNewPlan"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showDeletePlanDialog" persistent>
      <q-card class="dialog-card q-pa-lg text-center">
        <q-btn icon="close" flat round dense v-close-popup class="close-btn text-grey-6" />
        <q-card-section class="q-pt-md">
          <div class="text-h6 text-weight-bolder">Hapus paket ini?</div>
        </q-card-section>
        <q-card-actions align="center" class="q-gutter-x-md">
          <q-btn flat label="Batal" v-close-popup class="btn-batal-dialog" no-caps />
          <q-btn
            unelevated
            label="Ya, Hapus"
            class="btn-konfirmasi-dialog"
            no-caps
            @click="executeDelete"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useGymStore } from 'src/stores/Gym'

// --- INISIALISASI ---
const router = useRouter()
const $q = useQuasar()
const gymStore = useGymStore()

// --- STATE MANAGEMENT ---
const search = ref('')
const showAddDialog = ref(false)
const showDeletePlanDialog = ref(false)
const planToDelete = ref(null)
const editingPlanId = ref(null)

const newPlan = reactive({
  title: '',
  price: '',
  features: [''],
})

// Data Alat (Sementara menggunakan localStorage sesuai kode Anda)
const equipments = ref([])
const columns = [
  { name: 'name', label: 'Nama Alat', field: 'name', align: 'left' },
  { name: 'qty', label: 'Jumlah', field: 'qty', align: 'center' },
  { name: 'actions', label: '', field: 'actions', align: 'right' },
]

// Mock data subscription (Bisa dipindahkan ke API nantinya)
const subscriptionPlans = ref([
  {
    id: 1,
    title: 'Paket Basic',
    price: 'Rp 150.000',
    features: ['Akses Gym', 'Loker'],
  },
])

// --- DATA DINAMIS DARI STORE (API) ---
const gymData = computed(() => gymStore.currentGym || {})

// Formatting Tags dari String API ke Array
const formattedTags = computed(() => {
  const t = gymData.value.tag
  if (!t) return []
  return Array.isArray(t) ? t : t.split(',').map((s) => s.trim())
})

// --- LIFECYCLE (FETCH DATA API) ---
onMounted(async () => {
  const id = gymStore.selectedGymId

  if (id) {
    try {
      // Memanggil API getGymDetailById
      await gymStore.fetchGymDetail(id)
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Gagal memuat detail gym dari server.',
        position: 'top',
      })
    }
  } else {
    // Jika tidak ada ID yang terpilih, arahkan ke halaman pilih gym
    router.push('/dashboard')
  }

  loadEquipments()
})

// --- METHODS: GYM INFO ---
const editInfo = () => {
  router.push('/info/edit')
}

// --- METHODS: ALAT (EQUIPMENTS) ---
const loadEquipments = () => {
  const raw = localStorage.getItem('equipments')
  if (raw) {
    equipments.value = JSON.parse(raw)
  } else {
    equipments.value = [{ id: 1, name: 'Treadmill Pro', qty: 5 }]
  }
}

const goToTambahAlat = () => router.push('/info/alat/tambah')
const goToDetail = (id) => router.push(`/info/alat/${id}`)

// --- METHODS: PAKET BERLANGGANAN ---
const addFeatureInput = () => newPlan.features.push('')
const removeFeatureInput = (index) => newPlan.features.splice(index, 1)

const addPlan = () => {
  editingPlanId.value = null
  newPlan.title = ''
  newPlan.price = ''
  newPlan.features = ['']
  showAddDialog.value = true
}

const editPlan = (plan) => {
  editingPlanId.value = plan.id
  // Copy data agar tidak mengubah state asli sebelum di-save
  Object.assign(newPlan, JSON.parse(JSON.stringify(plan)))
  showAddDialog.value = true
}

const submitNewPlan = () => {
  if (!newPlan.title || !newPlan.price) {
    $q.notify({ type: 'warning', message: 'Nama paket dan harga wajib diisi' })
    return
  }

  if (editingPlanId.value) {
    const idx = subscriptionPlans.value.findIndex((p) => p.id === editingPlanId.value)
    subscriptionPlans.value[idx] = { ...newPlan, id: editingPlanId.value }
  } else {
    subscriptionPlans.value.push({ ...newPlan, id: Date.now() })
  }
  showAddDialog.value = false
}

const confirmDeletePlan = (plan) => {
  planToDelete.value = plan
  showDeletePlanDialog.value = true
}

const executeDelete = () => {
  subscriptionPlans.value = subscriptionPlans.value.filter((p) => p.id !== planToDelete.value.id)
  showDeletePlanDialog.value = false
  $q.notify({ type: 'positive', message: 'Paket berhasil dihapus' })
}
</script>

<style scoped lang="scss">
.info-block {
  .text-subtitle2 {
    color: #000;
  }
  .leading-relaxed {
    line-height: 1.5;
  }
}

.package-card {
  border-radius: 12px;
  border: 1px solid #edf2f7;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-4px);
  }
}

.feature-item .dot {
  width: 4px;
  height: 4px;
  background-color: black;
  border-radius: 50%;
}

.plan-add-box {
  height: 100%;
  min-height: 200px;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  cursor: pointer;
  &:hover {
    background: #f8fafc;
    border-color: #94a3b8;
  }
}

.btn-edit {
  background-color: #2563eb;
  color: white;
  border-radius: 6px;
}
.btn-tambah {
  background-color: #0c0c0c;
  color: white;
  border-radius: 8px;
}
.btn-detail {
  background-color: #0c0c0c;
  color: white;
  border-radius: 8px;
}
.btn-icon-edit {
  background-color: #2563eb;
  color: white;
}
.btn-icon-delete {
  background-color: #ef4444;
  color: white;
}

.dialog-card {
  width: 100%;
  max-width: 450px;
  border-radius: 20px;
}
.btn-konfirmasi-dialog {
  background: linear-gradient(to bottom, #a0a0a0, #666666);
  color: white;
}
.btn-batal-dialog {
  background: #f0f0f0;
  color: black;
}
</style>
