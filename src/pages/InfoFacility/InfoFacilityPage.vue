<template>
  <q-page class="q-pa-lg bg-grey-2">
    <!-- ================= SKELETON LOADER ================= -->
    <template v-if="gymStore.loading">
      <q-card flat class="custom-card q-mb-md q-pa-md">
        <q-card-section>
          <div class="row items-center justify-between q-mb-lg">
            <q-skeleton type="text" width="30%" height="40px" />
            <q-skeleton type="rect" width="120px" height="36px" class="custom-card" />
          </div>

          <q-skeleton height="350px" square class="custom-card q-mb-lg" />

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
                  class="custom-card"
                />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card flat class="custom-card q-mb-md q-pa-md">
        <q-card-section>
          <q-skeleton type="text" width="20%" height="30px" class="q-mb-md" />
          <div class="row q-col-gutter-lg">
            <div v-for="i in 4" :key="'plan-' + i" class="col-12 col-sm-4 col-md-3">
              <q-card flat class="bg-grey-1 custom-card q-pa-md" style="height: 250px">
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

    <!-- ================= MAIN CONTENT ================= -->
    <template v-else>
      <!-- GYM DETAILS CARD -->
      <q-card flat class="gym-card custom-card q-mb-md q-pa-md shadow-1">
        <q-card-section>
          <!-- Header -->
          <div class="row items-center q-col-gutter-sm q-mb-lg">
            <div class="col-12 col-sm">
              <q-badge
                v-if="gymData.verified"
                :color="gymData.verified === 'APPROVED' ? 'positive' : 'orange-8'"
                class="verify-badge q-py-xs q-px-sm q-mb-xs"
              >
                {{ gymData.verified }}
              </q-badge>

              <div class="text-h5 text-weight-bold text-dark">
                {{ gymData.name || 'Gym Information Details' }}
              </div>
            </div>

            <div class="col-12 col-sm-auto">
              <q-btn
                unelevated
                label="Edit Gym Info"
                icon="edit"
                no-caps
                class="btn-dark q-px-md header-action"
                @click="editInfo"
              />
            </div>
          </div>

          <!-- Carousel -->
          <q-carousel
            v-if="gymData.gymImage && gymData.gymImage.length > 0"
            animated
            v-model="slide"
            swipeable
            thumbnails
            infinite
            class="gym-carousel custom-card shadow-1 q-mb-lg"
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
              <div v-if="gymDescription" class="info-block">
                <div class="text-subtitle2 text-weight-bold text-dark q-mb-sm">Description</div>
                <div class="text-body2 text-grey-8 description-text">{{ gymDescription }}</div>
              </div>
              <div class="q-gutter-y-md">
                <div class="info-block">
                  <div class="text-subtitle2 text-weight-bold text-dark q-mb-sm">Address</div>
                  <div class="text-body1 text-grey-8">{{ gymData.address || '-' }}</div>
                </div>

                <div class="row q-col-gutter-md">
                  <div class="col-6">
                    <div class="info-block">
                      <div class="text-subtitle2 text-weight-bold text-dark q-mb-sm">Capacity</div>
                      <div class="text-body1 text-grey-8">{{ gymData.maxCapacity }} People</div>
                    </div>
                  </div>
                </div>

                <div class="info-block">
                  <div class="text-subtitle2 text-weight-bold text-dark q-mb-sm">
                    Operating Hours
                  </div>
                  <div class="text-body1 text-grey-8">{{ gymData.jamOperasional || '-' }}</div>
                </div>
              </div>
            </div>

            <div class="col-12 col-md-5">
              <div class="text-subtitle2 text-weight-bold text-dark q-mb-sm">Main Facilities</div>
              <div class="row q-gutter-xs q-mb-lg chip-wrap">
                <q-chip
                  v-for="fac in gymData.facility"
                  :key="fac"
                  outline
                  color="dark"
                  icon="check_circle"
                >
                  {{ fac }}
                </q-chip>
              </div>

              <div class="text-subtitle2 text-weight-bold text-dark q-mb-sm">Tags</div>
              <div class="row q-gutter-xs chip-wrap">
                <q-chip
                  v-for="tag in formattedTags"
                  :key="tag"
                  color="dark"
                  text-color="white"
                  square
                  class="custom-chip-border"
                >
                  {{ tag }}
                </q-chip>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- SUBSCRIPTION PLANS CARD -->
      <q-card flat class="custom-card shadow-1 q-mb-md q-pa-md">
        <q-card-section>
          <div class="text-h6 text-weight-bold text-dark q-mb-md">Subscription Plans</div>
          <div class="row q-col-gutter-lg">
            <div v-for="plan in subscriptionPlans" :key="plan.id" class="col-12 col-sm-4 col-md-3">
              <q-card flat class="package-card bg-grey-1">
                <q-card-section class="q-pa-md">
                  <div class="row no-wrap items-center justify-between q-mb-sm">
                    <div class="text-subtitle1 text-weight-bold text-dark ellipsis q-pr-sm">
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
                          <q-item-section avatar>
                            <q-icon name="edit" color="primary" size="20px" />
                          </q-item-section>
                          <q-item-section>Edit</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup @click="confirmDeletePlan(plan)">
                          <q-item-section avatar>
                            <q-icon name="delete" color="negative" size="20px" />
                          </q-item-section>
                          <q-item-section>Delete</q-item-section>
                        </q-item>
                      </q-list>
                    </q-btn-dropdown>
                  </div>
                  <div class="text-h6 text-weight-bolder text-dark">
                    Rp {{ Number(plan.price).toLocaleString() }}
                    <span class="text-caption text-grey-7">/ {{ plan.durationDays }} Days</span>
                  </div>
                  <q-separator class="q-my-sm" />
                  <div class="benefit-scroll-area">
                    <div
                      v-for="(benefit, index) in plan.benefit"
                      :key="index"
                      class="row no-wrap items-start q-mb-xs"
                    >
                      <q-icon name="check" size="14px" color="positive" class="q-mt-xs q-mr-sm" />
                      <div class="text-caption text-grey-9">{{ benefit }}</div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Add Plan Box -->
            <div class="col-12 col-sm-4 col-md-3">
              <div class="plan-add-box flex flex-center" @click="addPlan">
                <q-icon name="add_circle" size="42px" color="grey-5" />
                <div class="text-grey-7 q-mt-sm full-width text-center font-weight-medium">
                  Add Plan
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- EQUIPMENT LIST CARD -->
      <q-card flat class="custom-card shadow-1 q-pa-md">
        <q-card-section>
          <div class="row items-center justify-between q-mb-lg">
            <div class="text-h6 text-weight-bold text-dark">Gym Equipment List</div>
            <q-btn
              unelevated
              label="Add Equipment"
              icon="add"
              no-caps
              class="btn-dark"
              @click="goToTambahAlat"
            />
          </div>
          <q-table
            flat
            :rows="equipments"
            :columns="equipmentColumns"
            row-key="id"
            :filter="search"
            class="dashboard-table"
          >
            <!-- Custom Table Cells untuk Status Kondisi -->
            <template v-slot:body-cell-healthStatus="props">
              <q-td :props="props" class="text-center">
                <q-badge
                  :color="getStatusColor(props.value).bg"
                  :text-color="getStatusColor(props.value).text"
                  class="text-weight-bold q-pa-sm"
                  unelevated
                >
                  {{ formatStatus(props.value) }}
                </q-badge>
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="text-right">
                <q-btn
                  outline
                  label="Details"
                  dense
                  no-caps
                  class="btn-outline-dark q-px-md"
                  @click="goToDetail(props.row.id)"
                />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </template>

    <!-- ================= ADD/EDIT PLAN DIALOG ================= -->
    <q-dialog v-model="showAddDialog">
      <q-card style="width: 400px; border-radius: 8px" class="q-pa-md">
        <div class="text-h6 text-dark text-weight-bold q-mb-md">
          {{ editingPlanId ? 'Edit' : 'Add' }} Plan
        </div>

        <q-input
          v-model="newPlan.name"
          label="Plan Name"
          color="black"
          outlined
          dense
          class="custom-input q-mb-sm"
          :disable="!!editingPlanId"
        />
        <q-input
          v-model="newPlan.price"
          label="Price (Numeric)"
          color="black"
          type="number"
          outlined
          dense
          class="custom-input q-mb-sm"
          :disable="!!editingPlanId"
        />
        <q-input
          v-model="newPlan.durationDays"
          label="Duration (Days)"
          color="black"
          type="number"
          outlined
          dense
          class="custom-input q-mb-md"
          :disable="!!editingPlanId"
        />

        <div class="text-caption text-weight-bold text-dark q-mb-sm">Edit Benefits:</div>
        <div v-for="(b, index) in newPlan.benefit" :key="index" class="row q-gutter-xs q-mb-sm">
          <q-input
            v-model="newPlan.benefit[index]"
            color="black"
            outlined
            dense
            class="custom-input col"
          />
          <q-btn
            icon="remove"
            color="negative"
            flat
            @click="newPlan.benefit.splice(index, 1)"
            v-if="newPlan.benefit.length > 1"
          />
        </div>

        <q-btn
          label="Add Benefit"
          icon="add"
          flat
          color="dark"
          no-caps
          class="full-width q-mb-md"
          @click="newPlan.benefit.push('')"
        />

        <q-card-actions align="right" class="q-pa-none">
          <q-btn label="Cancel" color="grey-8" flat no-caps @click="showAddDialog = false" />
          <q-btn label="Save" class="btn-dark" unelevated no-caps @click="submitNewPlan" />
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

const gymDescription = computed(() => {
  const d = gymData.value.description ?? gymData.value.deskripsi ?? ''
  return String(d).trim()
})

const equipmentColumns = [
  { name: 'name', label: 'Equipment Name', field: 'name', align: 'left', sortable: true },
  { name: 'healthStatus', label: 'Condition Status', field: 'healthStatus', align: 'center' },
  { name: 'jumlah', label: 'Total Units', field: 'jumlah', align: 'center', sortable: true },
  { name: 'actions', label: 'Options', field: 'actions', align: 'right' },
]

// --- Helper untuk Warna & Text Status ---
const getStatusColor = (status) => {
  const s = String(status || '').toUpperCase()
  if (s === 'BAIK' || s === 'GOOD') return { bg: 'green-1', text: 'positive' }
  if (s === 'BUTUH_PERAWATAN' || s === 'BUTUH PERAWATAN' || s === 'NEEDS MAINTENANCE') return { bg: 'orange-1', text: 'orange-8' }
  if (s === 'RUSAK' || s === 'DAMAGED') return { bg: 'red-1', text: 'negative' }
  return { bg: 'grey-2', text: 'grey-8' }
}

const formatStatus = (status) => {
  const s = String(status || '').toUpperCase()
  if (s === 'BAIK' || s === 'GOOD') return 'Good'
  if (s === 'BUTUH_PERAWATAN' || s === 'BUTUH PERAWATAN' || s === 'NEEDS MAINTENANCE') return 'Needs Maintenance'
  if (s === 'RUSAK' || s === 'DAMAGED') return 'Damaged'
  return status || '-'
}
// ---------------------------------------

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

    await packageStore.fetchPlans(gymId)

    showAddDialog.value = false
    $q.notify({
      type: 'positive',
      icon: 'check_circle',
      position: 'top',
      message: 'Plan data successfully updated',
    })
  } catch (err) {
    console.error(err)
    $q.notify({
      type: 'negative',
      icon: 'warning',
      position: 'top',
      message: 'Failed to process plan',
    })
  }
}

const confirmDeletePlan = (plan) => {
  $q.dialog({
    title: 'Delete Plan?',
    message: `You are about to delete the ${plan.name} plan.`,
    cancel: true,
    ok: { color: 'negative', label: 'Delete', unelevated: true },
  }).onOk(async () => {
    await packageStore.deletePlan(gymStore.selectedGymId, plan.id)
    await packageStore.fetchPlans(gymStore.selectedGymId)
    $q.notify({
      type: 'positive',
      icon: 'check_circle',
      position: 'top',
      message: 'Plan deleted successfully',
    })
  })
}

const goToTambahAlat = () => router.push('/info/alat/tambah')
const goToDetail = (id) => router.push(`/info/alat/${id}`)
const editInfo = () => router.push('/info/edit')
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

.custom-chip-border {
  border-radius: 4px;
}

/* Button solid dark navy */
.btn-dark {
  background-color: #111827 !important;
  color: white;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background-color: #1f2937 !important;
  }
}

/* Button outline dark navy untuk "Details" */
.btn-outline-dark {
  border-radius: 4px;
  font-weight: 500;
  color: #111827 !important;
  border-color: #111827 !important;
  transition: all 0.3s ease;

  &:hover {
    background-color: #111827 !important;
    color: white !important;
  }
}

.info-block {
  margin-bottom: 16px;
  .uppercase {
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 11px;
  }
}

.package-card {
  border-radius: 8px;
  border: 1px solid #dee2e6;
  min-height: 250px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  }
}

.plan-add-box {
  height: 100%;
  min-height: 250px;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background: #f8fafc;
    border-color: #94a3b8;
  }
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
    font-size: 15px;
    padding: 14px 16px;
    border-bottom: 1px solid #f3f4f6;
  }
}
</style>
