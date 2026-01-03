<template>
  <q-page class="q-pa-lg bg-grey-2">
    <q-card flat bordered class="main-form-card overflow-hidden">
      <q-card-section class="bg-white q-pa-xl border-bottom">
        <div class="row items-center justify-between">
          <div class="col-12 col-sm-auto text-center text-sm-left">
            <h1 class="text-h5 text-weight-bolder text-dark q-ma-none">
              <q-icon name="add_business" size="md" class="q-mr-sm" color="black" />
              Pendaftaran Gym Baru
            </h1>
            <p class="text-body2 text-grey-7 q-mt-xs q-mb-none">
              Lengkapi data di bawah ini untuk mendaftarkan fasilitas gym Anda
            </p>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-xl">
        <q-form @submit="onSubmit" class="row q-col-gutter-xl">
          <div class="col-12 col-md-6">
            <div class="section-label q-mb-md">INFORMASI DASAR</div>

            <div class="row q-col-gutter-md">
              <div class="col-12">
                <label class="input-label">Nama Gym</label>
                <q-input
                  outlined
                  color="black"
                  dense
                  v-model="form.namaGym"
                  placeholder="Contoh: Gym Zhafran suki suki"
                  :rules="[(val) => !!val || 'Wajib diisi']"
                />
              </div>

              <div class="col-12">
                <label class="input-label">Kapasitas Maksimal (Orang)</label>
                <q-input
                  outlined
                  color="black"
                  dense
                  type="number"
                  v-model="form.maxCapacity"
                  placeholder="55"
                  :rules="[(val) => !!val || 'Wajib diisi']"
                />
              </div>

              <div class="col-12 border-radius">
                <label class="input-label">Alamat Lengkap</label>
                <q-input
                  outlined
                  color="black"
                  dense
                  v-model="form.address"
                  type="textarea"
                  rows="2"
                  placeholder="Jl. Setiabudi No. 12, Bandung"
                />
              </div>

              <div class="col-12">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.301708428178!2d107.62912447430588!3d-6.973646368285519!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e9ad06914565%3A0x6734181f0b094191!2sTelkom%20University!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                  width="100%"
                  height="180"
                  style="border-radius: 8px; border: 0"
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
                  dense
                  v-model="form.lat"
                  placeholder="-6.9803"
                />
              </div>
              <div class="col-6">
                <label class="input-label">Longitude</label>
                <q-input
                  disable
                  outlined
                  color="black"
                  dense
                  v-model="form.long"
                  placeholder="107.6342"
                />
              </div>

              <div class="col-12">
                <label class="input-label">Deskripsi Fasilitas</label>
                <q-input
                  outlined
                  color="black"
                  dense
                  type="textarea"
                  rows="3"
                  v-model="form.description"
                  placeholder="Gym modern dengan area latihan luas..."
                />
              </div>
            </div>
          </div>

          <div class="col-12 col-md-6">
            <div class="section-label q-mb-md">WAKTU & FASILITAS</div>

            <div class="q-mb-md">
              <label class="input-label">Jam Operasional (Per Hari)</label>
              <div class="op-container rounded-borders q-pa-sm bg-grey-1 shadow-2xl">
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
                    color="black"
                  />

                  <div class="col-8 row items-center no-wrap q-gutter-x-xs" v-if="day.active">
                    <q-input
                      outlined
                      color="black"
                      dense
                      v-model="day.open"
                      type="time"
                      bg-color="white"
                      class="time-input"
                    />
                    <span class="text-grey-4">-</span>
                    <q-input
                      outlined
                      color="black"
                      dense
                      v-model="day.close"
                      type="time"
                      bg-color="white"
                      class="time-input"
                    />
                  </div>
                  <div class="col-8 text-grey-5 text-caption q-pl-sm q-py-sm italic" v-else>
                    Tutup
                  </div>
                </div>
              </div>
            </div>

            <div class="q-mb-md">
              <label class="input-label">Fasilitas (Pilih Banyak)</label>
              <q-select
                outlined
                color="black"
                dense
                v-model="form.facility"
                :options="['Sauna', 'Locker', 'Shower', 'Pool', 'Parking', 'WiFi']"
                multiple
                use-chips
              />
            </div>

            <div class="q-mb-md">
              <label class="input-label">Tag / Kategori</label>
              <q-input
                color="black"
                outlined
                dense
                v-model="form.tag"
                placeholder="Sauna, gym sehat, Harian"
              />
            </div>

            <div class="q-mb-md">
              <label class="input-label">Foto Utama Gym</label>
              <q-file
                outlined
                color="black"
                dense
                v-model="form.image"
                label="Pilih file gambar"
                accept="image/*"
              >
                <template v-slot:prepend><q-icon name="image" /></template>
              </q-file>
            </div>
          </div>

          <div class="col-12 q-pt-lg row justify-end q-gutter-sm">
            <q-btn label="Batalkan" flat color="grey-8" no-caps @click="$router.back()" />
            <q-btn
              label="Daftar Sekarang"
              color="black"
              type="submit"
              @click="onSubmit"
              :loading="loading"
              unelevated
              class="q-px-xl text-weight-bold"
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
  lat: '-6.9803',
  long: '107.6342',
  facility: [],
  tag: '',
  description: '',
  image: null,
})

const operationalDays = ref([
  { name: 'Senin', active: true, open: '12:00', close: '20:00' },
  { name: 'Selasa', active: true, open: '12:00', close: '20:00' },
  { name: 'Rabu', active: true, open: '12:00', close: '20:00' },
  { name: 'Kamis', active: true, open: '12:00', close: '20:00' },
  { name: 'Jumat', active: true, open: '12:00', close: '20:00' },
  { name: 'Sabtu', active: true, open: '08:00', close: '13:00' },
  { name: 'Minggu', active: false, open: '00:00', close: '00:00' },
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

    $q.notify({ type: 'positive', message: 'Pendaftaran Berhasil!' })
    router.push('/dashboard')
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Gagal mendaftar',
      caption: error.response?.data?.message || 'Terjadi kesalahan sistem',
    })
  } finally {
    loading.value = false
  }
}

</script>

<style scoped>
.border-radius {
  border-radius: 12px;
}

.max-width-container {
  max-width: 1100px;
}

.main-form-card {
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05) !important;
}

.section-label {
  font-size: 0.75rem;
  font-weight: 800;
  color: #000;
  letter-spacing: 1.2px;
}

.input-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #424242;
  margin-bottom: 4px;
}

.day-row {
  border-bottom: 1px solid #e0e0e0;
  transition: background 0.3s;
}

.day-row:hover {
  background: #fdfdfd;
}

.day-row:last-child {
  border-bottom: none;
}

.border-bottom {
  border-bottom: 1px solid #eee;
}

.border-top {
  border-top: 1px solid #eee;
}

.time-input {
  width: 100%;
}
</style>
