<template>
  <q-page class="q-pa-lg bg-grey-2">
    <!-- HEADER -->
    <q-card flat class="rounded-borders q-mb-lg bg-white shadow-1">
      <q-card-section class="header-height q-pa-md row items-center">
        <q-btn
          flat
          round
          icon="arrow_back"
          color="grey-7"
          size="md"
          dense
          @click="goBack"
          class="q-mr-sm"
        />
        <q-icon name="construction" size="22px" class="q-ml-sm q-mr-sm" color="dark" />
        <div class="text-h5 text-weight-bold text-dark">Edit Gym Info</div>
      </q-card-section>
    </q-card>

    <!-- FORM -->
    <q-card flat class="rounded-borders shadow-1 q-pa-md custom-card">
      <q-card-section>
        <!-- Save Action -->
        <div class="row items-center justify-end q-mb-lg">
          <q-btn
            unelevated
            label="Save Changes"
            no-caps
            class="btn-save q-px-xl text-weight-bold"
            :loading="saving"
            :disable="saving"
            @click="saveChanges"
          />
        </div>

        <div class="q-gutter-y-lg">
          <!-- Gym Name -->
          <div class="input-group">
            <div class="text-subtitle1 text-weight-bold text-dark q-mb-xs">Gym Name</div>
            <q-input
              outlined
              dense
              v-model="form.name"
              placeholder="e.g., Elite Fitness Studio"
              class="bg-white custom-input"
            />
          </div>

          <!-- Capacity -->
          <div class="input-group">
            <div class="text-subtitle1 text-weight-bold text-dark q-mb-xs">Capacity</div>
            <q-input
              outlined
              dense
              type="number"
              v-model="form.maxCp"
              placeholder="e.g., 150"
              class="bg-white custom-input"
            />
          </div>

          <!-- Address -->
          <div class="input-group">
            <div class="text-subtitle1 text-weight-bold text-dark q-mb-xs">Address</div>
            <q-input
              outlined
              dense
              v-model="form.address"
              placeholder="e.g., 123 Fitness Ave, West Java"
              class="bg-white custom-input"
            />
          </div>

          <!-- Current Location (GPS) -->
          <div class="row items-center q-gutter-sm">
            <q-btn
              outline
              no-caps
              icon="my_location"
              label="Use Current Location"
              color="dark"
              :loading="gettingLocation"
              :disable="gettingLocation"
              @click="useCurrentLocation"
            />
            <q-btn
              v-if="hasCoords"
              outline
              no-caps
              icon="close"
              label="Reset Location"
              color="negative"
              @click="resetLocation"
            />
          </div>

          <!-- Location Status -->
          <div v-if="hasCoords" class="row items-center q-gutter-sm">
            <q-chip
              color="positive"
              text-color="white"
              icon="check_circle"
              square
              class="custom-chip-border"
            >
              Location set successfully
            </q-chip>
            <div v-if="accuracyMeters != null" class="text-caption text-grey-7">
              Accuracy ±{{ Math.round(accuracyMeters) }} m
            </div>
          </div>

          <div v-else class="text-caption text-grey-7">
            Location not set. Click <b>Use Current Location</b> to automatically fill coordinates.
          </div>

          <!-- Operating Hours -->
          <div class="input-group">
            <div class="text-subtitle1 text-weight-bold text-dark q-mb-xs">Operating Hours</div>
            <q-input
              outlined
              dense
              v-model="form.jamOperasional"
              placeholder="e.g., Mon-Fri: 06:00 AM - 10:00 PM"
              class="bg-white custom-input"
            />
          </div>

          <!-- Description -->
          <div class="input-group">
            <div class="text-subtitle1 text-weight-bold text-dark q-mb-xs">Description</div>
            <q-input
              outlined
              type="textarea"
              v-model="form.description"
              placeholder="Enter a detailed description of the gym..."
              class="bg-white custom-input"
              rows="5"
            />
          </div>

          <!-- Facilities -->
          <div class="input-group">
            <div class="text-subtitle1 text-weight-bold text-dark q-mb-xs">Facilities</div>

            <div class="row q-gutter-sm q-mb-sm">
              <q-chip
                v-for="(f, index) in form.fac"
                :key="f + index"
                removable
                @remove="removeFacility(index)"
                square
                color="blue-grey-8"
                text-color="white"
                class="q-px-md custom-chip-border"
                icon="check_circle"
              >
                {{ f }}
              </q-chip>
            </div>

            <div class="row items-center q-gutter-x-md">
              <div class="text-body1 text-weight-medium text-dark">Add Facility</div>
              <q-input
                outlined
                dense
                v-model="newFacility"
                placeholder="e.g., Sauna"
                class="bg-white col-4 custom-input"
                @keyup.enter="addFacility"
                @blur="addFacility"
                @update:model-value="onFacilityTyping"
              />
            </div>
          </div>

          <!-- Tags -->
          <div class="input-group">
            <div class="text-subtitle1 text-weight-bold text-dark q-mb-xs">Tags / Categories</div>
            <div class="row q-gutter-sm q-mb-sm">
              <q-chip
                v-for="(tag, index) in form.tags"
                :key="tag + index"
                removable
                @remove="removeTag(index)"
                square
                color="dark"
                text-color="white"
                class="q-px-md custom-chip-border"
              >
                {{ tag }}
              </q-chip>
            </div>

            <div class="row items-center q-gutter-x-md">
              <div class="text-body1 text-weight-medium text-dark">Add Tag</div>
              <q-input
                outlined
                dense
                v-model="newTag"
                placeholder="Add a new tag"
                class="bg-white col-4 custom-input"
                @keyup.enter="addTag"
                @blur="addTag"
                @update:model-value="onTagTyping"
              />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useGymStore } from 'src/stores/Gym'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const gymStore = useGymStore()

const saving = ref(false)
const gettingLocation = ref(false)
const newTag = ref('')
const newFacility = ref('')

const accuracyMeters = ref(null)

const gymId = computed(() => route.params.id || gymStore.selectedGymId)

const normalizeList = (arr) => {
  return (arr || [])
    .map((t) => String(t).trim())
    .filter(Boolean)
    .filter((t, i, self) => self.indexOf(t) === i)
}

const onTagTyping = (val) => {
  if (typeof val !== 'string') return
  if (val.includes(',')) {
    addTag()
  }
}
const form = reactive({
  name: '',
  maxCp: '',
  address: '',
  jamOperasional: '',
  description: '',
  lat: '',
  long: '',
  fac: [],
  tags: [],
})

const hasCoords = computed(() => !!form.lat && !!form.long)

const goBack = () => router.push('/info')

const hydrateForm = (g) => {
  if (!g) return
  form.name = g.name ?? ''
  form.maxCp = g.maxCp ?? g.maxCapacity ?? ''
  form.address = g.address ?? ''
  form.jamOperasional = g.jamOperasional ?? ''
  form.description = g.description ?? ''
  form.lat = g.lat != null ? String(g.lat) : ''
  form.long = g.long != null ? String(g.long) : String(g.lng ?? '')

  form.fac = Array.isArray(g.fac) ? g.fac : Array.isArray(g.facility) ? g.facility : []

  const t = g.tag ?? ''
  form.tags = t
    ? t
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : []
}

const loadForEdit = async () => {
  const id = gymId.value
  if (!id) return

  if (!gymStore.currentGym || gymStore.currentGym.id !== id) {
    try {
      await gymStore.fetchGymDetail(id)
    } catch (e) {
      console.error(e)
      $q.notify({ type: 'negative', message: 'Failed to fetch gym details' })
      return
    }
  }
  hydrateForm(gymStore.currentGym)
}

onMounted(loadForEdit)
watch(gymId, loadForEdit)

const resetLocation = () => {
  form.lat = ''
  form.long = ''
  accuracyMeters.value = null
}

const useCurrentLocation = async () => {
  if (
    !window.isSecureContext &&
    !location.hostname.includes('localhost') &&
    location.hostname !== '127.0.0.1'
  ) {
    $q.notify({
      type: 'negative',
      message: 'Geolocation requires HTTPS (or localhost). Please run on a secure origin.',
    })
    return
  }

  if (!('geolocation' in navigator)) {
    $q.notify({ type: 'negative', message: 'Browser does not support GPS' })
    return
  }

  gettingLocation.value = true

  const options = {
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 0,
  }

  const onSuccess = (pos) => {
    const { latitude, longitude, accuracy } = pos.coords
    form.lat = String(latitude)
    form.long = String(longitude)
    accuracyMeters.value = accuracy ?? null

    $q.notify({ type: 'positive', icon: 'my_location', message: 'Location retrieved successfully' })
    gettingLocation.value = false
  }

  const onError = (err) => {
    console.error(err)
    const msg =
      err.code === 1
        ? 'Location access denied. Please allow location access in your browser settings.'
        : err.code === 2
          ? 'Location unavailable. Ensure GPS/Location Services are enabled.'
          : 'Timeout or failed to get location. Try again or move to an area with better signal.'

    $q.notify({ type: 'negative', message: msg })

    // fallback
    let watchId = null
    try {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          navigator.geolocation.clearWatch(watchId)
          onSuccess(pos)
        },
        (e2) => {
          console.error(e2)
          if (watchId) navigator.geolocation.clearWatch(watchId)
          gettingLocation.value = false
        },
        { ...options, timeout: 30000 },
      )

      setTimeout(() => {
        if (watchId) navigator.geolocation.clearWatch(watchId)
        gettingLocation.value = false
      }, 8000)
    } catch {
      gettingLocation.value = false
    }
  }

  navigator.geolocation.getCurrentPosition(onSuccess, onError, options)
}

const addFacility = () => {
  const t = newFacility.value.trim()
  if (!t) return

  const parts = t
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  form.fac = normalizeList([...form.fac, ...parts])
  newFacility.value = ''
}

const removeFacility = (i) => {
  form.fac.splice(i, 1)
  form.fac = normalizeList(form.fac)
}

const onFacilityTyping = (val) => {
  if (typeof val !== 'string') return
  if (val.includes(',')) {
    addFacility()
  }
}

const addTag = () => {
  const t = newTag.value.trim()
  if (!t) return

  const parts = t
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  form.tags = normalizeList([...form.tags, ...parts])
  newTag.value = ''
}

const removeTag = (i) => {
  form.tags.splice(i, 1)
  form.tags = normalizeList(form.tags)
}

const saveChanges = async () => {
  const id = gymId.value
  if (!id) return

  if (!form.lat || !form.long) {
    $q.notify({ type: 'warning', message: 'Please get current location before saving.' })
    return
  }

  if (newTag.value.trim()) addTag()
  if (newFacility.value.trim()) addFacility()
  saving.value = true
  try {
    await gymStore.updateGym(id, {
      name: form.name,
      maxCp: form.maxCp,
      address: form.address,
      jamOperasional: form.jamOperasional,
      description: form.description,
      lat: form.lat,
      long: form.long,
      fac: form.fac,
      tag: normalizeList(form.tags).join(', '),
    })

    $q.notify({ type: 'positive', icon: 'check_circle', message: 'Data saved successfully!' })
    await gymStore.fetchGymDetail(id)
    goBack()
  } catch (e) {
    console.error(e)
    $q.notify({ type: 'negative', icon: 'error', message: 'Failed to save data' })
  } finally {
    saving.value = false
  }
}
</script>

<style scoped lang="scss">
.header-height {
  min-height: 64px;
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

.custom-chip-border {
  border-radius: 4px;
}

.input-group {
  .text-subtitle1 {
    color: #1a1a1a;
  }
}

:deep(.q-textarea .q-field__native) {
  line-height: 1.6;
}

/* Button style selaras dengan halaman lainnya */
.btn-save {
  background-color: #111827 !important;
  color: white;
  border-radius: 4px;
  height: 44px;
  font-weight: 500;
  text-transform: none;
  transition: all 0.3s ease;

  &:hover {
    background-color: #1f2937 !important;
  }
}
</style>
