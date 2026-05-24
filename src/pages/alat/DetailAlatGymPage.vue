<template>
  <q-page class="q-pa-lg bg-grey-2">
    <!-- Header Card -->
    <q-card flat class="custom-card shadow-1 q-mb-lg bg-white">
      <q-card-section class="header-height q-pa-md row items-center">
        <div style="width: 42px" class="row items-center justify-start">
          <q-btn flat round icon="arrow_back" color="grey-7" size="md" dense @click="goBack" />
        </div>

        <q-icon name="fitness_center" color="dark" size="32px" class="q-mr-md" />
        <div class="text-h5 text-weight-bold text-dark">Equipment Details</div>

        <q-space />
        <q-spinner-dots v-if="loading" color="grey-7" size="2em" />
      </q-card-section>
    </q-card>

    <!-- Main Content Card -->
    <q-card flat class="custom-card shadow-1 bg-white">
      <q-card-section class="q-pa-xl">
        <div v-if="!loading" class="row q-col-gutter-lg">
          <!-- Name -->
          <div class="col-12">
            <div class="text-subtitle2 q-mb-xs text-weight-bold text-dark">Equipment Name</div>
            <q-input
              v-model="equipment.name"
              outlined
              dense
              class="custom-input-detail shadow-none"
            />
          </div>

          <!-- Quantity -->
          <div class="col-12 col-md-4">
            <div class="text-subtitle2 q-mb-xs text-weight-bold text-dark">Quantity</div>
            <q-input
              v-model="equipment.jumlah"
              type="number"
              outlined
              dense
              class="custom-input-detail"
            >
              <template v-slot:append>
                <span class="text-caption text-grey-7 text-weight-bold">UNITS</span>
              </template>
            </q-input>
          </div>

          <!-- Condition -->
          <div class="col-12 col-md-4">
            <div class="text-subtitle2 q-mb-xs text-weight-bold text-dark">Condition Status</div>
            <q-select
              v-model="equipment.healthStatus"
              :options="healthStatusOptions"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              outlined
              dense
              class="custom-input-detail"
            >
              <template v-slot:append>
                <q-icon name="expand_more" />
              </template>
            </q-select>
          </div>

          <!-- Video URL -->
          <div class="col-12 col-md-4">
            <div class="text-subtitle2 q-mb-xs text-weight-bold text-dark">
              Tutorial Video (URL)
            </div>
            <q-input v-model="equipment.videoURL" outlined dense class="custom-input-detail">
              <template v-slot:prepend>
                <q-icon name="play_circle" :color="equipment.videoURL ? 'negative' : 'grey-4'" />
              </template>
              <template v-if="equipment.videoURL" v-slot:append>
                <q-btn
                  flat
                  round
                  color="primary"
                  icon="open_in_new"
                  size="sm"
                  @click="openLink(equipment.videoURL)"
                />
              </template>
            </q-input>
          </div>

          <!-- Description -->
          <div class="col-12">
            <div class="text-subtitle2 q-mb-xs text-weight-bold text-dark">Description</div>
            <q-input
              v-model="equipment.description"
              type="textarea"
              outlined
              dense
              autogrow
              class="custom-input-detail"
            />
          </div>

          <!-- Upload Image -->
          <div class="col-12 col-md-6">
            <div class="text-subtitle2 q-mb-xs text-weight-bold text-dark">
              Equipment Photo (Upload)
            </div>
            <q-file
              v-model="equipment.imageFile"
              accept="image/*"
              outlined
              dense
              label="Choose Photo"
              class="custom-input-detail"
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="image" />
              </template>
            </q-file>
            <q-img
              v-if="imagePreview"
              :src="imagePreview"
              style="height: 220px; border-radius: 4px; border: 1px solid #e5e7eb"
              class="q-mt-md"
              fit="cover"
            />
            <div v-else class="text-caption text-grey-6 q-mt-sm">
              * If you don't upload a new photo, the old photo will be kept.
            </div>
          </div>
        </div>

        <!-- Skeleton -->
        <div v-else class="row q-col-gutter-lg">
          <div class="col-12"><q-skeleton type="QInput" /></div>
          <div class="col-4"><q-skeleton type="QInput" /></div>
          <div class="col-4"><q-skeleton type="QInput" /></div>
          <div class="col-4"><q-skeleton type="QInput" /></div>
          <div class="col-12"><q-skeleton type="QInput" /></div>
          <div class="col-6"><q-skeleton type="QInput" /></div>
        </div>

        <q-separator class="q-my-xl" />

        <!-- Action Buttons -->
        <div class="row justify-between items-center">
          <q-btn flat label="Back" class="btn-cancel" no-caps @click="goBack" />

          <div class="row q-gutter-md">
            <q-btn
              unelevated
              label="Delete"
              icon="delete_outline"
              class="btn-delete"
              no-caps
              :disabled="loading"
              @click="showConfirmDelete = true"
            />
            <q-btn
              unelevated
              label="Save Changes"
              icon="save"
              class="btn-save"
              no-caps
              :disabled="loading"
              @click="showConfirmUpdate = true"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Confirm Update Dialog -->
    <q-dialog v-model="showConfirmUpdate" persistent>
      <q-card class="dialog-card q-pa-md">
        <q-btn icon="close" flat round dense v-close-popup class="close-btn text-grey-6" />
        <q-card-section class="text-center q-pt-lg">
          <q-icon name="info" size="80px" color="dark" class="q-mb-md" />
          <div class="text-h6 text-weight-bolder text-dark">Save Changes?</div>
          <div class="text-body2 text-grey-7 q-mt-sm">
            Are you sure you want to update the data for <strong>{{ equipment.name }}</strong
            >?
          </div>
        </q-card-section>
        <q-card-actions align="center" class="q-pb-lg q-gutter-x-md">
          <q-btn flat label="Cancel" v-close-popup class="btn-dialog-cancel" no-caps />
          <q-btn
            unelevated
            label="Yes, Save"
            class="btn-dialog-save"
            no-caps
            :loading="updateLoading"
            @click="handleUpdate"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Confirm Delete Dialog -->
    <q-dialog v-model="showConfirmDelete" persistent>
      <q-card class="dialog-card q-pa-md">
        <q-btn icon="close" flat round dense v-close-popup class="close-btn text-grey-6" />
        <q-card-section class="text-center q-pt-lg">
          <q-icon name="warning" size="80px" color="negative" class="q-mb-md" />
          <div class="text-h6 text-weight-bolder text-dark">Delete Equipment?</div>
          <div class="text-body2 text-grey-7 q-mt-sm">
            Are you sure you want to permanently delete <strong>{{ equipment.name }}</strong
            >?
          </div>
        </q-card-section>
        <q-card-actions align="center" class="q-pb-lg q-gutter-x-md">
          <q-btn flat label="Cancel" v-close-popup class="btn-dialog-cancel" no-caps />
          <q-btn
            unelevated
            label="Yes, Delete"
            class="btn-dialog-delete"
            no-caps
            :loading="deleteLoading"
            @click="handleDelete"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useGymStore } from 'src/stores/Gym'
import { useEquipmentStore } from 'src/stores/Equipment'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const gymStore = useGymStore()
const equipmentStore = useEquipmentStore()

const showConfirmDelete = ref(false)
const showConfirmUpdate = ref(false)
const loading = ref(false)
const deleteLoading = ref(false)
const updateLoading = ref(false)

// Tetap menggunakan value backend untuk database, tapi label bahasa Inggris
const healthStatusOptions = [
  { label: 'Good', value: 'BAIK' },
  { label: 'Needs Maintenance', value: 'BUTUH_PERAWATAN' },
  { label: 'Damaged', value: 'RUSAK' },
]

const equipment = reactive({
  id: null,
  name: '',
  jumlah: 0,
  videoURL: '',
  description: '',
  healthStatus: 'BAIK',
  imageFile: null,
  imageUrl: '',
})

const imagePreview = computed(() => {
  if (equipment.imageFile instanceof File) return URL.createObjectURL(equipment.imageFile)
  return equipment.imageUrl || ''
})

const fetchDetail = async () => {
  const gymId = gymStore.selectedGymId
  const equipId = route.params.id
  if (!gymId || !equipId) return

  loading.value = true
  try {
    const data = await equipmentStore.fetchEquipmentDetail(gymId, equipId)

    equipment.id = data.id ?? data.equipId ?? equipId
    equipment.name = data.name ?? ''
    equipment.jumlah = Number(data.jumlah ?? data.qty ?? 0)

    equipment.videoURL = data.videoURL ?? data.videoUrl ?? data.video ?? ''
    equipment.description = data.description ?? ''
    equipment.healthStatus = data.healthStatus ?? data.status ?? 'BAIK'

    equipment.imageUrl = data.imageUrl ?? data.image ?? data.photoUrl ?? ''
    equipment.imageFile = null
  } catch (e) {
    console.error(e)
    $q.notify({ type: 'negative', message: 'Failed to retrieve data', position: 'top' })
  } finally {
    loading.value = false
  }
}

const handleUpdate = async () => {
  const gymId = gymStore.selectedGymId
  const equipId = equipment.id ?? route.params.id

  if (!gymId || !equipId) {
    $q.notify({ type: 'warning', message: 'Data ID not found', position: 'top' })
    return
  }

  updateLoading.value = true
  try {
    const payload = {
      name: equipment.name,
      qty: equipment.jumlah,
      description: equipment.description,
      healthStatus: equipment.healthStatus,
      imageFile: equipment.imageFile,
    }

    await equipmentStore.updateEquipment(gymId, equipId, payload)

    $q.notify({
      type: 'positive',
      icon: 'check_circle',
      message: 'Equipment data successfully updated',
      position: 'top',
    })

    showConfirmUpdate.value = false
    await fetchDetail()
    router.back()
  } catch (error) {
    console.error('Component Update Error:', error)
    $q.notify({
      type: 'negative',
      icon: 'error',
      message: 'Update failed. Please check your inputs or connection.',
      position: 'top',
    })
  } finally {
    updateLoading.value = false
  }
}

const handleDelete = async () => {
  const gymId = gymStore.selectedGymId
  deleteLoading.value = true
  try {
    await equipmentStore.deleteEquipment(gymId, equipment.id ?? route.params.id)
    $q.notify({
      type: 'positive',
      icon: 'check_circle',
      message: 'Equipment deleted successfully',
      position: 'top',
    })
    router.push('/info')
  } catch (e) {
    console.error(e)
    $q.notify({
      type: 'negative',
      icon: 'error',
      message: 'Failed to delete equipment',
      position: 'top',
    })
  } finally {
    deleteLoading.value = false
    showConfirmDelete.value = false
  }
}

const openLink = (url) => {
  if (url) window.open(url, '_blank')
}

const goBack = () => router.back()

onMounted(fetchDetail)
</script>

<style scoped lang="scss">
.header-height {
  height: 68px;
}

.custom-card {
  border-radius: 8px;
  border: 1px solid #f3f4f6;
}

.custom-input-detail {
  :deep(.q-field__control) {
    border-radius: 4px;
    background-color: #fafafa !important;
    &:before {
      border-color: #e5e7eb !important;
    }
  }
  :deep(.q-field__native) {
    font-weight: 500;
    color: #111827;
  }
}

/* Button Styling */
.btn-cancel {
  min-width: 100px;
  color: #4b5563;
  border-radius: 4px;
  font-weight: 500;
}

.btn-save {
  min-width: 140px;
  background-color: #111827 !important;
  color: white;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.3s ease;
  &:hover {
    background-color: #1f2937 !important;
  }
}

.btn-delete {
  min-width: 120px;
  background-color: #ef4444 !important;
  color: white;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.3s ease;
  &:hover {
    background-color: #dc2626 !important;
  }
}

/* Dialog Styling */
.dialog-card {
  width: 100%;
  max-width: 440px;
  border-radius: 8px; /* Konsisten dengan card lainnya */
  position: relative;
}

.btn-dialog-cancel {
  width: 120px;
  color: #4b5563;
  border-radius: 4px;
  font-weight: 500;
  background-color: #f3f4f6;
}

.btn-dialog-save {
  width: 120px;
  background-color: #111827 !important;
  color: white;
  border-radius: 4px;
  font-weight: 500;
}

.btn-dialog-delete {
  width: 120px;
  background-color: #ef4444 !important;
  color: white;
  border-radius: 4px;
  font-weight: 500;
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
}

.shadow-1 {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03) !important;
}
</style>
