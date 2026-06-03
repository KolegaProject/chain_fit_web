<template>
  <q-page class="q-pa-lg bg-grey-2">
    <q-card flat bordered class="main-form-card overflow-hidden">
      <!-- Form Header -->
      <q-card-section class="bg-white q-pa-xl border-bottom">
        <div class="col-12 col-sm-auto column items-start">
          <div class="row items-center">
            <q-icon name="add_business" size="md" class="q-mr-sm" color="dark" />
            <h1 class="text-h5 text-weight-bolder text-dark q-ma-none">New Gym Registration</h1>
          </div>
          <p class="text-body2 text-grey-7 q-mt-xs q-mb-none">
            Complete the details below to register your gym facility.
          </p>
        </div>
      </q-card-section>

      <q-separator />

      <!-- Form Body -->
      <q-card-section class="q-pa-xl">
        <q-form @submit="onSubmit" class="row q-col-gutter-xl">
          <!-- LEFT COLUMN: Basic Information -->
          <div class="col-12 col-md-6">
            <div class="section-label q-mb-md">BASIC INFORMATION</div>

            <div class="row q-col-gutter-md">
              <div class="col-12">
                <label class="input-label">Gym Name</label>
                <q-input
                  outlined
                  color="black"
                  v-model="form.namaGym"
                  placeholder="e.g., Elite Fitness Studio"
                  class="custom-input"
                  :rules="[(val) => !!val || 'Required field']"
                />
              </div>

              <div class="col-12">
                <label class="input-label">Maximum Capacity (People)</label>
                <q-input
                  outlined
                  color="black"
                  type="number"
                  v-model="form.maxCapacity"
                  placeholder="e.g., 150"
                  class="custom-input"
                  :rules="[(val) => !!val || 'Required field']"
                />
              </div>

              <div class="col-12">
                <label class="input-label">Full Address</label>
                <q-input
                  outlined
                  color="black"
                  v-model="form.address"
                  type="textarea"
                  rows="2"
                  placeholder="e.g., 123 Sudirman Avenue, South Jakarta, 12190"
                  class="custom-input"
                />
              </div>

              <!-- Map iframe -->
              <div class="col-12 q-mb-sm">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.301708428178!2d107.62912447430588!3d-6.973646368285519!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e9ad06914565%3A0x6734181f0b094191!2sTelkom%20University!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                  width="100%"
                  height="180"
                  style="border-radius: 4px; border: 1px solid #e0e0e0"
                  allowfullscreen
                  loading="lazy"
                ></iframe>
              </div>

              <div class="col-6">
                <label class="input-label">Latitude</label>
                <q-input
                  disable
                  outlined
                  color="black"
                  v-model="form.lat"
                  placeholder="-6.973646"
                  class="custom-input bg-grey-1"
                />
              </div>
              <div class="col-6">
                <label class="input-label">Longitude</label>
                <q-input
                  disable
                  outlined
                  color="black"
                  v-model="form.long"
                  placeholder="107.629124"
                  class="custom-input bg-grey-1"
                />
              </div>

              <div class="col-12">
                <label class="input-label">Facility Description</label>
                <q-input
                  outlined
                  color="black"
                  type="textarea"
                  rows="3"
                  v-model="form.description"
                  placeholder="e.g., A premium facility featuring state-of-the-art cardio equipment, a dedicated free-weight zone, and professional personal trainers."
                  class="custom-input"
                />
              </div>
            </div>
          </div>

          <!-- RIGHT COLUMN: Hours & Facilities -->
          <div class="col-12 col-md-6">
            <div class="section-label q-mb-md">HOURS & FACILITIES</div>

            <!-- Operating Hours (AM/PM Format) -->
            <div class="q-mb-lg">
              <label class="input-label">Operating Hours (Per Day)</label>
              <div
                class="op-container rounded-borders q-pa-sm bg-grey-1 shadow-2xl"
                style="border-radius: 4px; border: 1px solid #e0e0e0"
              >
                <div
                  v-for="day in operationalDays"
                  :key="day.name"
                  class="row items-center q-py-xs day-row"
                >
                  <q-checkbox
                    v-model="day.active"
                    :label="day.name"
                    class="col-4"
                    dense
                    color="dark"
                  />

                  <div class="col-8 row items-center no-wrap q-gutter-x-xs" v-if="day.active">
                    <!-- Open Time Input with Picker -->
                    <q-input
                      outlined
                      color="black"
                      dense
                      v-model="day.open"
                      mask="##:## AA"
                      bg-color="white"
                      class="time-input custom-input"
                    >
                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer text-grey-7" size="20px">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-time v-model="day.open" mask="hh:mm A" color="dark">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="dark" flat />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>

                    <span class="text-grey-5">-</span>

                    <!-- Close Time Input with Picker -->
                    <q-input
                      outlined
                      color="black"
                      dense
                      v-model="day.close"
                      mask="##:## AA"
                      bg-color="white"
                      class="time-input custom-input"
                    >
                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer text-grey-7" size="20px">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-time v-model="day.close" mask="hh:mm A" color="dark">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="dark" flat />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div class="col-8 text-grey-5 text-caption q-pl-sm q-py-sm text-italic" v-else>
                    Closed
                  </div>
                </div>
              </div>
            </div>

            <!-- Facilities -->
            <div class="q-mb-lg">
              <label class="input-label">Facilities (Multiple Choice)</label>
              <q-select
                outlined
                color="black"
                v-model="form.facility"
                :options="[
                  'Sauna',
                  'Locker Room',
                  'Shower',
                  'Swimming Pool',
                  'Free Parking',
                  'High-Speed WiFi',
                  'Cafeteria',
                ]"
                multiple
                use-chips
                class="custom-input"
              />
            </div>

            <!-- Tags -->
            <div class="q-mb-lg">
              <label class="input-label">Tags / Categories</label>
              <q-input
                color="black"
                outlined
                v-model="form.tag"
                placeholder="e.g., crossfit, 24-hours, powerlifting, personal training"
                class="custom-input"
              />
            </div>

            <!-- Image Upload -->
            <div class="q-mb-lg">
              <label class="input-label">Main Gym Photo</label>
              <q-file
                outlined
                color="black"
                v-model="form.image"
                label="Choose a high-resolution image"
                accept="image/*"
                class="custom-input"
              >
                <template v-slot:prepend>
                  <q-icon name="image" />
                </template>
              </q-file>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="col-12 q-pt-xl row justify-end q-gutter-sm">
            <q-btn
              label="Cancel"
              flat
              color="grey-8"
              no-caps
              class="q-px-md"
              @click="$router.back()"
            />
            <q-btn
              label="Register Now"
              type="submit"
              @click="onSubmit"
              :loading="loading"
              unelevated
              class="btn-continue q-px-xl text-weight-medium"
              no-caps
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useGymStore } from '../../stores/Gym'

const $q = useQuasar()
const router = useRouter()
const loading = ref(false)
const gymStore = useGymStore()

const form = reactive({
  namaGym: '',
  maxCapacity: '',
  address: '',
  lat: '-6.973646',
  long: '107.629124',
  facility: [],
  tag: '',
  description: '',
  image: null,
})

const operationalDays = ref([
  { name: 'Monday', active: true, open: '06:00 AM', close: '10:00 PM' },
  { name: 'Tuesday', active: true, open: '06:00 AM', close: '10:00 PM' },
  { name: 'Wednesday', active: true, open: '06:00 AM', close: '10:00 PM' },
  { name: 'Thursday', active: true, open: '06:00 AM', close: '10:00 PM' },
  { name: 'Friday', active: true, open: '06:00 AM', close: '10:00 PM' },
  { name: 'Saturday', active: true, open: '08:00 AM', close: '08:00 PM' },
  { name: 'Sunday', active: false, open: '12:00 AM', close: '12:00 AM' },
])

const onSubmit = async () => {
  loading.value = true
  try {
    const jamStr = operationalDays.value
      .filter((d) => d.active)
      .map((d) => `${d.name}: ${d.open} - ${d.close}`)
      .join(', ')

    const formData = new FormData()
    formData.append('namaGym', form.namaGym)
    formData.append('maxCapacity', form.maxCapacity)
    formData.append('address', form.address)
    formData.append('jamOperasional', jamStr)
    formData.append('lat', form.lat)
    formData.append('long', form.long)
    formData.append('tag', form.tag)
    formData.append('description', form.description)
    formData.append('facility', JSON.stringify(form.facility))

    if (form.image) {
      formData.append('image', form.image)
    }

    await gymStore.registerGym(formData)

    $q.notify({
      type: 'positive',
      message: 'Registration Successful!',
      icon: 'check_circle',
      position: 'top',
    })
    router.push('/dashboard')
  } catch (error) {
    console.error('Gym Registration Error:', error)
    $q.notify({
      type: 'negative',
      message: 'Registration Failed',
      caption: error.response?.data?.message || 'A system error occurred. Please try again.',
      icon: 'warning',
      position: 'top',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.main-form-card {
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03) !important;
  border-color: #f3f4f6;
}

.section-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #111827;
  letter-spacing: 1px;
}

.input-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}

.custom-input {
  :deep(.q-field__control) {
    border-radius: 4px;
  }
  :deep(.q-field__control:before) {
    border-color: #e5e7eb;
  }
}

.day-row {
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.2s;
  padding: 8px 4px;
}

.day-row:hover {
  background: #f9fafb;
}

.day-row:last-child {
  border-bottom: none;
}

.border-bottom {
  border-bottom: 1px solid #f3f4f6;
}

.time-input {
  width: 100%;
}

.btn-continue {
  background-color: #111827 !important;
  color: white;
  border-radius: 4px;
  height: 48px;
  font-size: 15px;
  font-weight: 500;

  &:hover {
    background-color: #1f2937 !important;
  }
}
</style>
