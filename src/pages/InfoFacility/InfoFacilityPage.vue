<template>
  <q-page class="q-pa-lg bg-grey-2">
    <template v-if="gymStore.loading">
      <q-card flat class="rounded-borders q-mb-md q-pa-md">
        <q-card-section>
          <div class="row items-center justify-between q-mb-lg">
            <q-skeleton type="text" width="30%" height="40px" />
            <q-skeleton type="rect" width="120px" height="36px" class="rounded-borders" />
          </div>

          <q-skeleton height="350px" square class="rounded-borders q-mb-lg" />

          <div class="row q-col-gutter-xl">
            <div class="col-12 col-md-7">
              <div class="q-gutter-y-md">
                <div v-for="i in 3" :key="'skel-info-' + i">
                  <q-skeleton type="text" width="20%" class="q-mb-xs" />
                  <q-skeleton type="text" width="60%" height="25px" />
                </div>
              </div>
            </div>
            <div class="col-12 col-md-5">
              <q-skeleton type="text" width="40%" class="q-mb-md" />
              <div class="row q-gutter-xs q-mb-lg">
                <q-skeleton v-for="i in 4" :key="'chip-' + i" type="QChip" width="80px" />
              </div>
              <q-skeleton type="text" width="30%" class="q-mb-md" />
              <div class="row q-gutter-xs">
                <q-skeleton
                  v-for="i in 3"
                  :key="'tag-' + i"
                  type="rect"
                  width="60px"
                  height="30px"
                  class="rounded-borders"
                />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card flat class="rounded-borders q-mb-md q-pa-md">
        <q-card-section>
          <q-skeleton type="text" width="20%" height="30px" class="q-mb-md" />
          <div class="row q-col-gutter-lg">
            <div v-for="i in 4" :key="'plan-' + i" class="col-12 col-sm-4 col-md-3">
              <q-card flat class="bg-grey-1 rounded-borders q-pa-md" style="height: 250px">
                <q-skeleton type="text" width="70%" class="q-mb-sm" />
                <q-skeleton type="text" width="50%" height="30px" class="q-mb-md" />
                <q-separator class="q-my-sm" />
                <q-skeleton v-for="j in 3" :key="j" type="text" width="90%" class="q-mt-xs" />
              </q-card>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </template>

    <template v-else>
      <q-card flat class="rounded-borders q-mb-md q-pa-md">
        <q-card-section>
          <div class="row items-center justify-between q-mb-lg">
            <div class="text-h5 text-weight-bold">{{ gymData.name || 'Detail Informasi Gym' }}</div>
            <q-btn
              unelevated
              label="Edit Info Gym"
              icon="edit"
              color="primary"
              no-caps
              class="rounded-borders q-px-md"
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
            height="400px"
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
                          <q-item-section avatar
                            ><q-icon name="edit" color="blue" size="20px"
                          /></q-item-section>
                          <q-item-section>Edit</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup @click="confirmDeletePlan(plan)">
                          <q-item-section avatar
                            ><q-icon name="delete" color="red" size="20px"
                          /></q-item-section>
                          <q-item-section>Hapus</q-item-section>
                        </q-item>
                      </q-list>
                    </q-btn-dropdown>
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
          <q-table
            flat
            :rows="equipments"
            :columns="equipmentColumns"
            row-key="id"
            :filter="search"
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
        <div class="text-caption text-weight-bold q-mb-sm">Edit Benefit:</div>
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
import { usePackageStore } from 'src/stores/Package'
import { useEquipmentStore } from 'src/stores/Equipment'

const router = useRouter()
const $q = useQuasar()
const slide = ref(0)
const search = ref('')
const gymStore = useGymStore()
const packageStore = usePackageStore()
const equipmentStore = useEquipmentStore()
const gymData = computed(() => gymStore.currentGym || {})
const subscriptionPlans = computed(() => packageStore.subscriptionPlans)
const equipments = computed(() => equipmentStore.equipments)

const formattedTags = computed(() => {
  const t = gymData.value.tag
  return t ? t.split(',').map((s) => s.trim()) : []
})

const equipmentColumns = [
  { name: 'name', label: 'Nama Alat', field: 'name', align: 'left', sortable: true },
  { name: 'healthStatus', label: 'Status Kondisi', field: 'healthStatus', align: 'center' },
  { name: 'jumlah', label: 'Jumlah Unit', field: 'jumlah', align: 'center', sortable: true },
  { name: 'actions', label: 'Opsi', field: 'actions', align: 'right' },
]

const showAddDialog = ref(false)
const editingPlanId = ref(null)

const newPlan = reactive({ name: '', price: '', durationDays: 30, benefit: [''] })

const loadAllData = async (gymId) => {
  if (!gymId) return
  try {
    await Promise.all([
      gymStore.fetchGymDetail(gymId),
      packageStore.fetchPlans(gymId),
      equipmentStore.fetchEquipments(gymId),
    ])
  } catch (err) {
    console.error(err)
  }
}

watch(
  () => gymStore.selectedGymId,
  (newId) => {
    if (newId) loadAllData(newId)
  },
)

onMounted(() => {
  if (gymStore.selectedGymId) loadAllData(gymStore.selectedGymId)
})

const addPlan = () => {
  editingPlanId.value = null
  Object.assign(newPlan, { name: '', price: '', durationDays: 30, benefit: [''] })
  showAddDialog.value = true
}

const editPlan = (plan) => {
  editingPlanId.value = plan.id
  Object.assign(newPlan, JSON.parse(JSON.stringify(plan)))
  showAddDialog.value = true
}

const submitNewPlan = async () => {
  const gymId = gymStore.selectedGymId
  try {
    const cleanedBenefits = newPlan.benefit.filter((b) => b.trim() !== '')
    if (editingPlanId.value) {
      await packageStore.updatePlanBenefit(gymId, editingPlanId.value, cleanedBenefits)
    } else {
      await packageStore.createPlan(gymId, { ...newPlan, benefit: cleanedBenefits })
    }
    showAddDialog.value = false
    $q.notify({ type: 'positive', message: 'Data paket diperbarui' })
  } catch {
    $q.notify({ type: 'negative', message: 'Gagal memproses paket' })
  }
}

const confirmDeletePlan = (plan) => {
  $q.dialog({
    title: 'Hapus Paket?',
    message: `Anda akan menghapus paket ${plan.name}.`,
    cancel: true,
    ok: { color: 'red-9', label: 'Hapus', unelevated: true },
  }).onOk(async () => {
    await packageStore.deletePlan(gymStore.selectedGymId, plan.id)
    $q.notify({ type: 'positive', message: 'Paket dihapus' })
  })
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
}

.package-card {
  border-radius: 12px;
  border: 1px solid #dee2e6;
  min-height: 250px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
}

.plan-add-box {
  height: 100%;
  min-height: 250px;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  cursor: pointer;
  &:hover {
    background: #f8fafc;
    border-color: #94a3b8;
  }
}

.btn-tambah {
  background: #000;
  color: white;
  font-weight: bold;
}
.rounded-borders {
  border-radius: 12px;
}

.benefit-scroll-area {
  max-height: 120px;
  overflow-y: auto;
  padding-right: 4px;
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
}

</style>
