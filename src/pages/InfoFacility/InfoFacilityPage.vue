<template>
  <q-page class="q-pa-lg bg-grey-2">
    <div v-if="gymStore.loading" class="flex flex-center q-pa-xl">
      <q-spinner-dots color="black" size="40px" />
      <div class="q-ml-md text-grey-7">Memuat informasi gym...</div>
    </div>

    <template v-else>
      <q-card flat class="rounded-borders q-mb-md q-pa-md">
        <q-card-section>
          <div class="row items-center justify-between q-mb-lg">
            <div class="text-h5 text-weight-bold">
              {{ gymData.name || 'Detail Informasi Gym' }}
            </div>
            <q-btn
              unelevated
              label="Edit Info"
              no-caps
              class="btn-edit q-px-lg"
              @click="editInfo"
            />
          </div>

          <q-carousel
            v-if="gymData.gymImage && gymData.gymImage.length > 0"
            animated
            v-model="slide"
            swipeable
            thumbnails
            infinite
            class="rounded-borders shadow-1 q-mb-lg"
          >
            <q-carousel-slide
              v-for="(img, index) in gymData.gymImage"
              :key="img.id"
              :name="index"
              :img-src="img.url"
            />
          </q-carousel>

          <div class="row q-col-gutter-xl">
            <div class="col-12 col-md-7">
              <div class="q-gutter-y-md">
                <div class="info-block">
                  <div
                    class="text-subtitle2 text-weight-bold text-grey-7 q-mb-xs uppercase tracking-widest"
                  >
                    Alamat
                  </div>
                  <div class="text-body1">{{ gymData.address || '-' }}</div>
                </div>

                <div class="row q-col-gutter-md">
                  <div class="col-6">
                    <div class="info-block">
                      <div class="text-subtitle2 text-weight-bold text-grey-7 q-mb-xs uppercase">
                        Kapasitas
                      </div>
                      <div class="text-body1">{{ gymData.maxCapacity }} Orang</div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="info-block">
                      <div class="text-subtitle2 text-weight-bold text-grey-7 q-mb-xs uppercase">
                        Verifikasi
                      </div>
                      <q-badge
                        :color="gymData.verified === 'APPROVED' ? 'green-7' : 'orange-8'"
                        class="q-pa-xs px-sm"
                      >
                        {{ gymData.verified }}
                      </q-badge>
                    </div>
                  </div>
                </div>

                <div class="info-block">
                  <div class="text-subtitle2 text-weight-bold text-grey-7 q-mb-xs uppercase">
                    Jam Operasional
                  </div>
                  <div class="text-body1">{{ gymData.jamOperasional || '-' }}</div>
                </div>

                <div class="info-block">
                  <div class="text-subtitle2 text-weight-bold text-grey-7 q-mb-xs uppercase">
                    Deskripsi
                  </div>
                  <div class="text-body1 text-grey-8 leading-relaxed">
                    {{ gymData.description || '-' }}
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12 col-md-5">
              <div class="text-subtitle2 text-weight-bold q-mb-sm">Fasilitas Utama</div>
              <div class="row q-gutter-xs q-mb-lg">
                <q-chip
                  v-for="fac in gymData.facility"
                  :key="fac"
                  outline
                  color="black"
                  icon="check_circle"
                >
                  {{ fac }}
                </q-chip>
              </div>

              <div class="text-subtitle2 text-weight-bold q-mb-sm">Tags</div>
              <div class="row q-gutter-xs">
                <q-chip
                  v-for="tag in formattedTags"
                  :key="tag"
                  color="black"
                  text-color="white"
                  square
                >
                  {{ tag }}
                </q-chip>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card flat class="rounded-borders q-mb-md q-pa-md">
        <q-card-section>
          <div class="text-h6 text-weight-bold q-mb-md">Paket Berlangganan</div>
          <div class="row q-col-gutter-lg">
            <div v-for="plan in subscriptionPlans" :key="plan.id" class="col-12 col-sm-4 col-md-3">
              <q-card flat class="package-card bg-grey-1">
                <q-card-section class="q-pa-md">
                  <div class="row items-center justify-between q-mb-sm">
                    <div class="text-subtitle1 text-weight-bold">{{ plan.title }}</div>
                    <div class="row q-gutter-xs">
                      <q-btn
                        round
                        dense
                        icon="edit"
                        size="xs"
                        color="blue"
                        @click="editPlan(plan)"
                      />
                      <q-btn
                        round
                        dense
                        icon="delete"
                        size="xs"
                        color="red"
                        @click="confirmDeletePlan(plan)"
                      />
                    </div>
                  </div>
                  <div class="text-h6 text-weight-bolder">
                    {{ plan.price }}<span class="text-caption">/bln</span>
                  </div>
                  <q-separator class="q-my-sm" />
                  <div v-for="f in plan.features" :key="f" class="row no-wrap items-start q-mb-xs">
                    <q-icon name="circle" size="6px" class="q-mt-sm q-mr-xs" />
                    <div class="text-caption">{{ f }}</div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-sm-4 col-md-3">
              <div class="plan-add-box flex flex-center" @click="addPlan">
                <q-icon name="add_circle" size="42px" color="grey-5" />
                <div class="text-grey-7 q-mt-sm full-width text-center">Tambah Paket</div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card flat class="rounded-borders q-pa-md">
        <q-card-section>
          <div class="row items-center justify-between q-mb-lg">
            <div class="text-h6 text-weight-bold">Daftar Alat Gym</div>
            <q-btn
              unelevated
              label="Tambah Alat"
              icon="add"
              no-caps
              class="btn-tambah"
              @click="goToTambahAlat"
            />
          </div>

          <q-input
            outlined
            dense
            v-model="search"
            placeholder="Cari alat..."
            class="q-mb-md bg-white"
          >
            <template v-slot:prepend><q-icon name="search" /></template>
          </q-input>

          <q-table
            flat
            :rows="equipments"
            :columns="columns"
            row-key="id"
            :filter="search"
            class="facilities-table"
          >
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  outline
                  label="Detail"
                  dense
                  no-caps
                  class="q-px-md"
                  color="black"
                  @click="goToDetail(props.row.id)"
                />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </template>

    <q-dialog v-model="showAddDialog">
      <q-card style="width: 400px" class="q-pa-md">
        <div class="text-h6 q-mb-md">{{ editingPlanId ? 'Edit' : 'Tambah' }} Paket</div>
        <q-input
          v-model="newPlan.title"
          label="Nama Paket (e.g. Member Pro)"
          outlined
          dense
          class="q-mb-sm"
        />
        <q-input
          v-model="newPlan.price"
          label="Harga (e.g. Rp 200.000)"
          outlined
          dense
          class="q-mb-md"
        />

        <div class="text-caption text-weight-bold q-mb-sm">Fitur Paket:</div>
        <div v-for="(feat, index) in newPlan.features" :key="index" class="row q-gutter-xs q-mb-sm">
          <q-input
            v-model="newPlan.features[index]"
            outlined
            dense
            class="col"
            placeholder="Akses Kolam..."
          />
          <q-btn
            icon="remove"
            color="red"
            flat
            @click="newPlan.features.splice(index, 1)"
            v-if="newPlan.features.length > 1"
          />
        </div>
        <q-btn
          label="Tambah Fitur"
          icon="add"
          flat
          color="primary"
          no-caps
          class="full-width q-mb-lg"
          @click="newPlan.features.push('')"
        />

        <div class="row justify-end q-gutter-sm">
          <q-btn label="Batal" v-close-popup flat />
          <q-btn label="Simpan Paket" color="primary" @click="submitNewPlan" />
        </div>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showDeletePlanDialog">
      <q-card class="q-pa-md">
        <q-card-section>Apakah Anda yakin ingin menghapus paket ini?</q-card-section>
        <q-card-actions align="right">
          <q-btn label="Batal" v-close-popup flat />
          <q-btn label="Ya, Hapus" color="red" @click="executeDelete" />
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

const slide = ref(0)
const router = useRouter()
const $q = useQuasar()
const gymStore = useGymStore()

// --- DATA DINAMIS API ---
const gymData = computed(() => gymStore.currentGym || {})
const formattedTags = computed(() => {
  const t = gymData.value.tag
  if (!t) return []
  return t.split(',').map((s) => s.trim())
})

// --- STATE PAKET BERLANGGANAN ---
const subscriptionPlans = ref([
  {
    id: 1,
    title: 'Paket Basic',
    price: 'Rp 150.000',
    features: ['Akses Gym 24/7', 'Loker Standard'],
  },
])
const showAddDialog = ref(false)
const showDeletePlanDialog = ref(false)
const editingPlanId = ref(null)
const planToDelete = ref(null)
const newPlan = reactive({ title: '', price: '', features: [''] })

// --- STATE ALAT (EQUIPMENTS) ---
const search = ref('')
const equipments = ref([])
const columns = [
  { name: 'name', label: 'Nama Alat', field: 'name', align: 'left', sortable: true },
  { name: 'qty', label: 'Jumlah', field: 'qty', align: 'center' },
  { name: 'actions', label: 'Aksi', field: 'actions', align: 'right' },
]

// --- LIFECYCLE ---
onMounted(async () => {
  const id = gymStore.selectedGymId
  if (id) {
    try {
      await gymStore.fetchGymDetail(id)
      loadEquipments()
    } catch {
      $q.notify({ type: 'negative', message: 'Gagal sinkronisasi data API' })
    }
  }
})

// --- LOGIC: ALAT ---
const loadEquipments = () => {
  const raw = localStorage.getItem(`equipments_${gymStore.selectedGymId}`)
  equipments.value = raw
    ? JSON.parse(raw)
    : [
        { id: 1, name: 'Treadmill Pro-X', qty: 5 },
        { id: 2, name: 'Dumbbell Set 1-10kg', qty: 2 },
      ]
}

const goToTambahAlat = () => router.push('/info/alat/tambah')
const goToDetail = (id) => router.push(`/info/alat/${id}`)

// --- LOGIC: PAKET ---
const addPlan = () => {
  editingPlanId.value = null
  Object.assign(newPlan, { title: '', price: '', features: [''] })
  showAddDialog.value = true
}

const editPlan = (plan) => {
  editingPlanId.value = plan.id
  Object.assign(newPlan, JSON.parse(JSON.stringify(plan)))
  showAddDialog.value = true
}

const submitNewPlan = () => {
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
}

const editInfo = () => router.push('/info/edit')
</script>

<style scoped lang="scss">
.info-block {
  .uppercase {
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 11px;
  }
  .leading-relaxed {
    line-height: 1.6;
  }
}
.package-card {
  border-radius: 12px;
  border: 1px solid #dee2e6;
  min-height: 180px;
  transition: all 0.3s;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
}
.plan-add-box {
  height: 100%;
  min-height: 180px;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  cursor: pointer;
  &:hover {
    background: #f8fafc;
    border-color: #94a3b8;
  }
}
.btn-edit {
  background: #2563eb;
  color: white;
}
.btn-tambah {
  background: #000;
  color: white;
  font-weight: bold;
}

.rounded-borders {
  border-radius: 12px;
}
</style>
