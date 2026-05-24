<template>
  <q-page class="q-pa-lg bg-grey-2">
    <!-- Header Card -->
    <q-card flat class="custom-card shadow-1 q-mb-lg bg-white">
      <q-card-section class="header-height q-pa-md row items-center">
        <div style="width: 42px" class="row items-center justify-start">
          <q-btn flat round icon="arrow_back" color="grey-7" size="md" dense @click="goBack" />
        </div>
        <q-icon name="fitness_center" color="dark" size="32px" class="q-mr-md" />
        <div class="text-h5 text-weight-bold text-dark">Add New Gym Equipment</div>
      </q-card-section>
    </q-card>

    <!-- Form Card -->
    <q-card flat class="custom-card shadow-1 bg-white">
      <q-card-section class="q-pa-xl">
        <div class="row q-col-gutter-lg">
          <div class="col-12">
            <div class="text-subtitle2 q-mb-xs text-weight-bold text-dark">Equipment Name</div>
            <q-input
              outlined
              dense
              v-model="newEquipment.name"
              placeholder="e.g., Smith Machine, Leg Press..."
              class="custom-input shadow-none"
            />
          </div>

          <div class="col-12 col-md-4">
            <div class="text-subtitle2 q-mb-xs text-weight-bold text-dark">Quantity</div>
            <q-input
              outlined
              dense
              type="number"
              v-model="newEquipment.qty"
              class="custom-input"
              min="1"
            >
              <template v-slot:append>
                <div class="text-caption text-grey-7 text-weight-medium">UNITS</div>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-8">
            <div class="text-subtitle2 q-mb-xs text-weight-bold text-dark">
              Tutorial Video Link (YouTube)
            </div>
            <q-input
              outlined
              dense
              v-model="newEquipment.videoUrl"
              placeholder="https://www.youtube.com/watch?v=..."
              class="custom-input"
            >
              <template v-slot:prepend>
                <q-icon name="play_circle" color="negative" />
              </template>
            </q-input>
          </div>

          <div class="col-12">
            <div class="text-subtitle2 q-mb-xs text-weight-bold text-dark">Description</div>
            <q-input
              outlined
              dense
              type="textarea"
              autogrow
              v-model="newEquipment.description"
              placeholder="e.g., Great for back exercises to improve posture and build muscle strength..."
              class="custom-input"
            />
          </div>

          <div class="col-12">
            <div class="text-subtitle2 q-mb-xs text-weight-bold text-dark">Photo</div>
            <q-file
              outlined
              dense
              v-model="newEquipment.image"
              accept="image/*"
              label="Upload equipment photo"
              class="custom-input"
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="image" />
              </template>
            </q-file>
          </div>
        </div>

        <q-separator class="q-my-xl" />

        <!-- Action Buttons -->
        <div class="row justify-end q-gutter-md">
          <q-btn flat label="Cancel" class="btn-cancel" no-caps @click="goBack" />
          <q-btn
            unelevated
            label="Save Equipment"
            class="btn-save"
            no-caps
            :loading="loading"
            @click="submitEquipment"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useGymStore } from 'src/stores/Gym'
import { useEquipmentStore } from 'src/stores/Equipment'

const $q = useQuasar()
const router = useRouter()
const gymStore = useGymStore()
const equipmentStore = useEquipmentStore()

const loading = ref(false)

const newEquipment = reactive({
  name: '',
  qty: 1,
  videoUrl: '',
  description: '',
  image: null,
})

const submitEquipment = async () => {
  if (!newEquipment.name) {
    $q.notify({
      message: 'Equipment name is required',
      color: 'warning',
      position: 'top',
    })
    return
  }

  const gymId = gymStore.selectedGymId
  if (!gymId) {
    $q.notify({
      message: 'Please select a Gym first',
      color: 'warning',
      position: 'top',
    })
    return
  }

  loading.value = true
  try {
    await equipmentStore.createEquipment(gymId, {
      name: newEquipment.name,
      qty: parseInt(newEquipment.qty),
      videoUrl: newEquipment.videoUrl,
      description: newEquipment.description,
      image: newEquipment.image,
    })

    $q.notify({
      type: 'positive',
      icon: 'check_circle',
      message: 'Gym equipment successfully added',
      position: 'top',
    })

    router.push('/info')
  } catch (err) {
    $q.notify({
      type: 'negative',
      icon: 'error',
      message: err.response?.data?.message || 'Failed to save to the server',
      position: 'top',
    })
  } finally {
    loading.value = false
  }
}

const goBack = () => router.back()
</script>

<style scoped lang="scss">
.header-height {
  height: 68px;
}

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

.btn-cancel {
  min-width: 120px;
  color: #4b5563;
  border-radius: 4px;
  font-weight: 500;
}

.btn-save {
  min-width: 180px;
  background-color: #111827 !important;
  color: white;
  border-radius: 4px;
  font-weight: 500;
  height: 44px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #1f2937 !important;
  }
}

.shadow-1 {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03) !important;
}
</style>
