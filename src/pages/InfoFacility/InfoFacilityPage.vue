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
            <div class="text-h5 text-weight-bold">{{ gymData.name || 'Detail Informasi Gym' }}</div>
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
                  >{{ fac }}</q-chip
                >
              </div>
              <div class="text-subtitle2 text-weight-bold q-mb-sm">Tags</div>
              <div class="row q-gutter-xs">
                <q-chip
                  v-for="tag in formattedTags"
                  :key="tag"
                  color="black"
                  text-color="white"
                  square
                  >{{ tag }}</q-chip
                >
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
                  <div class="row no-wrap items-center justify-between q-mb-sm">
                    <div class="text-subtitle1 text-weight-bold ellipsis q-pr-sm">
                      {{ plan.name }}
                      <q-tooltip>{{ plan.name }}</q-tooltip>
                    </div>

                    <div class="row items-center shrink-0">
                      <q-btn-dropdown
                        flat
                        round
                        dense
                        dropdown-icon="more_vert"
                        no-icon-animation
                        color="grey-7"
                        class="no-shadow"
                      >
                        <q-list style="min-width: 100px">
                          <q-item clickable v-close-popup @click="editPlan(plan)">
                            <q-item-section avatar>
                              <q-icon name="edit" color="blue" size="20px" />
                            </q-item-section>
                            <q-item-section>Edit</q-item-section>
                          </q-item>

                          <q-item clickable v-close-popup @click="confirmDeletePlan(plan)">
                            <q-item-section avatar>
                              <q-icon name="delete" color="red" size="20px" />
                            </q-item-section>
                            <q-item-section>Hapus</q-item-section>
                          </q-item>
                        </q-list>
                      </q-btn-dropdown>
                    </div>
                  </div>
                  <div class="text-h6 text-weight-bolder">
                    Rp {{ Number(plan.price).toLocaleString() }}
                    <span class="text-caption">/ {{ plan.durationDays }} Hari</span>
                  </div>
                  <q-separator class="q-my-sm" />

                  <div class="benefit-scroll-area">
                    <div
                      v-for="(benefit, index) in plan.benefit"
                      :key="index"
                      class="row no-wrap items-start q-mb-xs"
                    >
                      <q-icon name="check" size="14px" color="green" class="q-mt-xs q-mr-sm" />
                      <div class="text-caption text-grey-9">{{ benefit }}</div>
                    </div>
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
          <q-table flat :rows="equipments" :columns="columns" row-key="id" :filter="search">
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
          v-model="newPlan.name"
          label="Nama Paket"
          outlined
          dense
          class="q-mb-sm"
          :disable="!!editingPlanId"
        />
        <q-input
          v-model="newPlan.price"
          label="Harga (Angka)"
          type="number"
          outlined
          dense
          class="q-mb-sm"
          :disable="!!editingPlanId"
        />
        <q-input
          v-model="newPlan.durationDays"
          label="Durasi (Hari)"
          type="number"
          outlined
          dense
          class="q-mb-md"
          :disable="!!editingPlanId"
        />

        <div class="text-caption text-weight-bold q-mb-sm">
          Edit Benefit {{ editingPlanId ? '(Hanya bagian ini yang akan tersimpan)' : '' }}:
        </div>
        <div v-for="(b, index) in newPlan.benefit" :key="index" class="row q-gutter-xs q-mb-sm">
          <q-input v-model="newPlan.benefit[index]" outlined dense class="col" />
          <q-btn
            icon="remove"
            color="red"
            flat
            @click="newPlan.benefit.splice(index, 1)"
            v-if="newPlan.benefit.length > 1"
          />
        </div>
        <q-btn
          label="Tambah Benefit"
          icon="add"
          flat
          color="primary"
          no-caps
          class="full-width"
          @click="newPlan.benefit.push('')"
        />

        <q-card-actions align="right">
          <q-btn label="Batal" v-close-popup flat />
          <q-btn label="Simpan" color="primary" @click="submitNewPlan" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useGymStore } from 'src/stores/Gym'
import { api } from 'src/boot/axios' // Pastikan axios terkonfigurasi
import { usePackageStore } from 'src/stores/Package'

const slide = ref(0)
const search = ref('')
const router = useRouter()
const $q = useQuasar()
const gymStore = useGymStore()

// --- DATA DINAMIS ---
const gymData = computed(() => gymStore.currentGym || {})
const formattedTags = computed(() => {
  const t = gymData.value.tag
  return t ? t.split(',').map((s) => s.trim()) : []
})

// --- STATE PAKET & ALAT ---
const equipments = ref([])
const showAddDialog = ref(false)
const editingPlanId = ref(null)
const newPlan = reactive({ name: '', price: '', durationDays: 30, benefit: [''] })
const packageStore = usePackageStore()

const subscriptionPlans = computed(() => packageStore.subscriptionPlans)

const loadAllGymData = async (id) => {
  if (!id) return

  try {
    // Memanggil API secara paralel agar lebih cepat
    await Promise.all([gymStore.fetchGymDetail(id), packageStore.fetchPlans(id)])
    loadEquipments() // Load data dari localStorage
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Gagal memuat data gym' })
  }
}

// --- WATCHER ---
// Setiap kali ID di store berubah (dari select di layout), jalankan fungsi load data
watch(
  () => gymStore.selectedGymId,
  async (newId) => {
    if (newId) {
      await loadAllGymData(newId)
    }
  },
)

onMounted(async () => {
  if (gymStore.selectedGymId) {
    await loadAllGymData(gymStore.selectedGymId)
  }
})

const confirmDeletePlan = (plan) => {
  $q.dialog({
    title: 'Konfirmasi Hapus',
    message: `Apakah Anda yakin ingin menghapus paket ${plan.name}?`,
    cancel: true,
    persistent: true,
    ok: { label: 'Hapus', color: 'red', unelevated: true },
  }).onOk(async () => {
    try {
      await packageStore.deletePlan(gymStore.selectedGymId, plan.id)
      $q.notify({ type: 'positive', message: 'Paket berhasil dihapus' })
    } catch (err) {
      $q.notify({ type: 'negative', message: 'Gagal menghapus paket' })
    } finally {
    }
  })
}

// --- LOGIC PAKET ---
const addPlan = () => {
  editingPlanId.value = null
  Object.assign(newPlan, { name: '', price: '', durationDays: 30, benefit: [''] })
  showAddDialog.value = true
}

const columns = [
  { name: 'name', label: 'Nama Alat', field: 'name', align: 'left', sortable: true },
  { name: 'qty', label: 'Jumlah', field: 'qty', align: 'center' },
  { name: 'actions', label: 'Aksi', field: 'actions', align: 'right' },
]

const editPlan = (plan) => {
  editingPlanId.value = plan.id
  Object.assign(newPlan, JSON.parse(JSON.stringify(plan)))
  showAddDialog.value = true
}

const submitNewPlan = async () => {
  const gymId = gymStore.selectedGymId
  if (!gymId) return

  try {
    // Bersihkan benefit dari string kosong
    const cleanedBenefits = newPlan.benefit.filter((b) => b.trim() !== '')

    if (editingPlanId.value) {
      // LOGIKA EDIT (Hanya Benefit)
      await packageStore.updatePlanBenefit(gymId, editingPlanId.value, cleanedBenefits)
      $q.notify({ type: 'positive', message: 'Benefit paket berhasil diperbarui' })
    } else {
      // LOGIKA TAMBAH BARU (Semua Field)
      const payloadBaru = {
        ...newPlan,
        benefit: cleanedBenefits,
      }
      await packageStore.createPlan(gymId, payloadBaru)
      $q.notify({ type: 'positive', message: 'Paket berhasil ditambahkan' })
    }

    // Refresh data & tutup dialog
    await packageStore.fetchPlans(gymId)
    showAddDialog.value = false
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Gagal menyimpan data',
    })
  } finally {
  }
}

// --- LOGIC LAINNYA ---
const loadEquipments = () => {
  const raw = localStorage.getItem(`equipments_${gymStore.selectedGymId}`)
  equipments.value = raw ? JSON.parse(raw) : []
}
const goToTambahAlat = () => router.push('/info/alat/tambah')
const goToDetail = (id) => router.push(`/info/alat/${id}`)
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

//test

.package-card {
  /* Berikan tinggi minimal agar card yang benefit-nya sedikit tidak terlalu pendek */
  min-height: 250px;
  display: flex;
  flex-direction: column;
}

.benefit-scroll-area {
  /* Tinggi maksimal area benefit sebelum scroll muncul */
  max-height: 120px;
  overflow-y: auto;
  padding-right: 4px; /* Ruang agar scrollbar tidak menutupi teks */

  /* Membuat scrollbar terlihat lebih minimalis */
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #e0e0e0;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #bdbdbd;
  }
}

/* Memastikan kartu tambah paket tingginya mengikuti kartu paket lainnya */
.plan-add-box {
  height: 100%;
  min-height: 250px;
  /* ... rest of your style ... */
}
</style>
