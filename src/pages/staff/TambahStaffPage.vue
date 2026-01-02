<template>
  <q-page class="q-pa-lg bg-grey-2">
    <q-card flat class="rounded-borders q-mb-lg bg-white shadow-sm">
      <q-card-section class="q-pa-md row items-center">
        <q-btn flat round icon="arrow_back" color="grey-7" @click="goBack" class="q-mr-sm" />
        <q-icon name="edit" color="primary" size="32px" class="q-mr-md" />
        <div>
          <div class="text-h5 text-weight-bold">Edit Data Staff</div>
          <div class="text-caption text-grey-6">Perbarui informasi profil dan hak akses staff</div>
        </div>
        <q-space />
        <q-badge v-if="staffStore.loading" color="primary" label="Memuat Data..." />
      </q-card-section>
    </q-card>

    <q-card flat class="rounded-borders shadow-1 bg-white">
      <q-form @submit="submitForm">
        <q-card-section class="q-pa-xl">
          <div class="row q-col-gutter-xl">
            <div class="col-12 col-md-8">
              <div class="row q-col-gutter-y-lg q-col-gutter-x-md">
                <div class="col-12 col-sm-6">
                  <div class="label-text">Nama Lengkap</div>
                  <q-input
                    outlined
                    v-model="form.nama"
                    placeholder="Masukkan nama lengkap"
                    dense
                    class="custom-input"
                    :rules="[(val) => !!val || 'Nama wajib diisi']"
                  />
                </div>

                <div class="col-12 col-sm-6">
                  <div class="label-text">Username</div>
                  <q-input
                    outlined
                    v-model="form.username"
                    dense
                    disable
                    class="custom-input bg-grey-1"
                    hint="Username tidak dapat diubah"
                  />
                </div>

                <div class="col-12 col-sm-6">
                  <div class="label-text">Email</div>
                  <q-input
                    outlined
                    v-model="form.email"
                    placeholder="email@example.com"
                    dense
                    class="custom-input"
                    :rules="[(val) => /.+@.+\..+/.test(val) || 'Format email salah']"
                  />
                </div>

                <div class="col-12 col-sm-6">
                  <div class="label-text">Role</div>
                  <q-input
                    outlined
                    v-model="form.role"
                    dense
                    disable
                    class="custom-input bg-grey-1"
                  />
                </div>
              </div>
            </div>

            <div class="col-12 col-md-4 flex flex-center">
              <div class="column items-center">
                <div class="label-text q-mb-md">Foto Profil</div>

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
                    color="primary"
                    icon="photo_camera"
                    @click="triggerFileInput"
                  >
                    <q-tooltip>Unggah Foto</q-tooltip>
                  </q-btn>
                  <q-btn
                    unelevated
                    round
                    dense
                    color="negative"
                    icon="delete"
                    :disable="!imagePreview"
                    @click="removePhoto"
                  >
                    <q-tooltip>Hapus Foto</q-tooltip>
                  </q-btn>
                </div>
                <input ref="fileInput" type="file" accept="image/*" @change="onFileChange" hidden />
                <div class="text-caption text-grey-6 q-mt-sm">Format: JPG, PNG (Maks 2MB)</div>
              </div>
            </div>
          </div>

          <q-separator class="q-my-xl opacity-50" />

          <div class="row justify-end q-gutter-md">
            <q-btn flat label="Batal" class="btn-cancel" no-caps @click="goBack" />
            <q-btn
              unelevated
              type="submit"
              label="Simpan Perubahan"
              class="btn-save"
              no-caps
              :loading="staffStore.loading"
            />
          </div>
        </q-card-section>
      </q-form>
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

// State
const userId = route.params.userId // Pastikan nama param sesuai di router.js
const gymId = route.params.id // Pastikan nama param sesuai di router.js
const fileInput = ref(null)
const imagePreview = ref('')
const imageFile = ref(null)
const defaultPhoto = 'https://cdn.quasar.dev/img/avatar.png'

const form = ref({
  nama: '',
  username: '',
  email: '',
  role: '',
})

// --- LifeCycle: GET DATA ---
onMounted(async () => {
  if (gymId && userId) {
    const data = await staffStore.fetchStaffById(gymId, userId)
    if (data) {
      form.value.nama = data.name
      form.value.username = data.username || 'N/A'
      form.value.email = data.email
      form.value.role = data.role
      imagePreview.value = data.profileImage
    }
  }
})

// --- Handlers ---
const triggerFileInput = () => fileInput.value.click()

const onFileChange = (evt) => {
  const file = evt.target.files[0]
  if (!file) return
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

const removePhoto = () => {
  imageFile.value = null
  imagePreview.value = ''
  if (fileInput.value) fileInput.value.value = ''
}

const goBack = () => router.push('/staff')

const submitForm = async () => {
  const payload = {
    nama: form.value.nama,
    email: form.value.email,
    imageFile: imageFile.value, // Dikirim sebagai File Object untuk FormData
  }

  const success = await staffStore.updateStaff(gymId, userId, payload)
  if (success) goBack()
}
</script>

<style lang="scss" scoped>
.rounded-borders {
  border-radius: 12px;
}

.label-text {
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 6px;
  font-size: 0.875rem;
}

.custom-input {
  :deep(.q-field__control) {
    border-radius: 10px;
    background-color: #fafafa;
    transition: all 0.3s;
    &:before {
      border: 1px solid #e2e8f0 !important;
    }
    &:hover:before {
      border-color: #4a5568 !important;
    }
  }
}

.photo-container {
  width: 200px;
  height: 240px;
  border-radius: 16px;
  overflow: hidden;
  border: 2px dashed #cbd5e0;
  background: #f7fafc;
}

.btn-cancel {
  width: 120px;
  background-color: #edf2f7;
  border-radius: 10px;
  font-weight: 600;
  color: #4a5568;
}

.btn-save {
  min-width: 180px;
  background: #1a202c;
  color: white;
  border-radius: 10px;
  font-weight: 600;
  &:hover {
    background: #000;
  }
}

.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
</style>
