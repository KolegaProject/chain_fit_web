<template>
  <q-page class="q-pa-lg bg-grey-2">
    <q-card flat class="rounded-borders q-mb-lg bg-white shadow-1">
      <q-card-section class="header-height q-pa-md row items-center justify-between">
        <div class="row items-center">
          <div style="width: 42px" class="row items-center justify-start">
            <q-btn flat round icon="arrow_back" color="grey-7" size="md" dense @click="goBack" />
          </div>
          <q-icon name="edit" color="black" size="32px" class="q-mr-md" />
          <div class="text-h5 text-weight-bold">Edit Staff</div>
        </div>

        <q-spinner-dots v-if="staffStore.loading" color="primary" size="2em" />
      </q-card-section>
    </q-card>

    <q-card flat class="rounded-borders shadow-1 bg-white">
      <q-card-section class="q-pa-xl">
        <div class="row q-col-gutter-xl">
          <div class="col-12 col-md-8">
            <div class="row q-col-gutter-y-lg q-col-gutter-x-md">
              <div class="col-12 col-sm-6">
                <div class="text-subtitle2 q-mb-xs text-weight-bold text-grey-9">Nama Lengkap</div>
                <q-input
                  outlined
                  v-model="form.nama"
                  placeholder="Masukkan nama lengkap"
                  dense
                  class="custom-input"
                />
              </div>

              <div class="col-12 col-sm-6">
                <div class="text-subtitle2 q-mb-xs text-weight-bold text-grey-9">Email</div>
                <q-input
                  outlined
                  disable
                  v-model="form.email"
                  placeholder="email@example.com"
                  dense
                  class="custom-input"
                />
              </div>

              <div class="col-12 col-sm-6">
                <div class="text-subtitle2 q-mb-xs text-weight-bold text-grey-9">Role</div>
                <q-input
                  outlined
                  v-model="form.role"
                  dense
                  disable
                  class="custom-input bg-grey-1"
                  hint="Role tidak dapat diubah di halaman ini"
                />
              </div>

              <div class="col-12 col-sm-6">
                <div class="text-subtitle2 q-mb-xs text-weight-bold text-grey-9">Instansi Gym</div>
                <q-input
                  outlined
                  v-model="form.gymName"
                  dense
                  disable
                  class="custom-input bg-grey-1"
                />
              </div>
            </div>
          </div>

          <div class="col-12 col-md-4 flex flex-center">
            <div class="column items-center">
              <div class="text-subtitle2 q-mb-md text-weight-bold text-grey-9 text-center">
                Foto Profil
              </div>

              <div class="photo-container shadow-1">
                <q-img :src="imagePreview || defaultPhoto" class="full-height" fit="cover">
                  <template v-slot:error>
                    <div class="absolute-full flex flex-center bg-grey-3 text-grey-7">
                      <q-icon name="person" size="64px" />
                    </div>
                  </template>
                </q-img>
              </div>

              <div class="row q-gutter-sm q-mt-md">
                <q-btn
                  unelevated
                  round
                  dense
                  color="blue-7"
                  icon="photo_camera"
                  @click="triggerFileInput"
                />
                <q-btn
                  unelevated
                  round
                  dense
                  color="negative"
                  icon="delete"
                  :disable="!imagePreview"
                  @click="removePhoto"
                />
              </div>

              <input ref="fileInput" type="file" accept="image/*" @change="onFileChange" hidden />
              <div class="text-caption text-grey-6 q-mt-sm">Format: JPG, PNG (Maks 2MB)</div>
            </div>
          </div>
        </div>

        <q-separator class="q-my-xl" />

        <div class="row justify-end q-gutter-md">
          <q-btn flat label="Batal" class="btn-dialog-flat" no-caps @click="goBack" />
          <q-btn
            unelevated
            label="Simpan Perubahan"
            class="btn-dialog-gradient"
            no-caps
            :loading="staffStore.loading"
            @click="submitUpdate"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStaffStore } from 'src/stores/Staff'

const router = useRouter()
const route = useRoute()
const staffStore = useStaffStore()

// State Form
const form = ref({
  nama: '',
  email: '',
  role: '',
  gymName: '',
})

// Image State
const imagePreview = ref('')
const imageFile = ref(null)
const defaultPhoto =
  'https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg'
const fileInput = ref(null)

// Params dari URL
const gymId = route.params.id // Asumsi route: /staff/edit/:id/:userId
const userId = route.params.userId

// --- 1. PANGGIL DATA SAAT MOUNTED ---
onMounted(async () => {
  // Ambil parameter dari URL
  const gId = route.params.id
  const uId = route.params.userId

  console.log('Fetching Data for Gym:', gId, 'User:', uId)

  if (gId && uId) {
    const data = await staffStore.fetchStaffById(gId, uId)

    if (data) {
      // MAPPING: Pastikan field kiri sesuai dengan form, field kanan sesuai API
      form.value.nama = data.name || data.nama || ''
      form.value.email = data.email || ''
      form.value.role = data.role || ''
      form.value.gymName = data.gym?.name || 'Instansi Gym'

      // Foto Profil
      imagePreview.value = data.profileImage || ''
    }
  } else {
    console.error('Parameter ID tidak lengkap di URL')
  }
})
// --- handlers ---
const triggerFileInput = () => fileInput.value.click()

const onFileChange = (evt) => {
  const file = evt.target.files[0]
  if (!file) return

  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file) // Preview instan
}

const removePhoto = () => {
  imagePreview.value = ''
  imageFile.value = null
  if (fileInput.value) fileInput.value.value = ''
}

const goBack = () => router.push('/staff')

const submitUpdate = async () => {
  const payload = {
    nama: form.value.nama,
    email: form.value.email,
    imageFile: imageFile.value, // Dikirim sebagai file asli untuk FormData
  }

  const success = await staffStore.updateStaff(gymId, userId, payload)
  if (success) {
    goBack()
  }
}
</script>

<style lang="scss" scoped>
.rounded-borders {
  border-radius: 12px;
}

.custom-input {
  :deep(.q-field__control) {
    border-radius: 10px;
    background-color: #fafafa;
    &:before {
      border: 1px solid #e0e0e0 !important;
    }
    &:hover:before {
      border-color: #222 !important;
    }
  }
}

.photo-container {
  width: 200px;
  height: 240px;
  border-radius: 16px;
  overflow: hidden;
  border: 2px dashed #e0e0e0;
  background: #fff;
}

.btn-dialog-flat {
  width: 140px;
  background-color: #f0f2f5;
  border-radius: 12px;
  font-weight: bold;
  color: #555;
}

.btn-dialog-gradient {
  min-width: 180px;
  background: black;
  color: white;
  border-radius: 12px;
  font-weight: bold;
}

.header-height {
  height: 68px;
}
</style>
