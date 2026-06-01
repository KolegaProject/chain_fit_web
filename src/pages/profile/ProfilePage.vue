<template>
  <q-page class="q-pa-lg bg-grey-2">
    <!-- Header Section -->
    <div class="q-mb-xl">
      <h1 class="text-h5 text-weight-bold q-ma-none q-mb-xs text-dark">User Profile</h1>
      <div class="text-grey-7 text-body2">Manage your personal information.</div>
    </div>

    <div class="row q-col-gutter-lg">
      <!-- Main Column: Profile Information -->
      <div class="col-12 col-md-8 col-lg-7">
        <q-card flat class="custom-card shadow-1 q-pa-lg bg-white">
          <!-- Avatar & Info -->
          <div class="row items-center q-mb-lg">
            <div class="relative-position q-mr-lg">
              <q-avatar size="80px" class="shadow-1">
                <img
                  :src="profile.profileImage || 'https://cdn.quasar.dev/img/avatar4.jpg'"
                  alt="Profile Photo"
                  style="object-fit: cover"
                />
              </q-avatar>
              <!-- Edit Avatar Button -->
              <q-btn
                round
                dense
                color="primary"
                icon="photo_camera"
                size="sm"
                class="absolute-bottom-right"
                style="margin-bottom: -2px; margin-right: -2px"
                @click="triggerFileInput"
              />
              <input
                type="file"
                ref="fileInput"
                accept="image/*"
                @change="onFileChange"
                style="display: none"
              />
            </div>
            <div>
              <div class="text-subtitle1 text-weight-bold text-dark">Profile Picture</div>
              <div class="text-body2 text-grey-7 q-mt-xs" style="max-width: 300px">
                Recommended to use a high-resolution image with a 1:1 ratio. Max size 2MB.
              </div>
            </div>
          </div>

          <q-separator class="q-my-lg" />

          <!-- Biodata Form -->
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <label class="text-caption text-weight-bold text-dark q-mb-xs block">Full Name</label>
              <q-input
                outlined
                dense
                v-model="profile.name"
                placeholder="Enter full name"
                class="custom-input"
                autocomplete="off"
              />
            </div>
            <div class="col-12 col-md-6">
              <label class="text-caption text-weight-bold text-dark q-mb-xs block">Username</label>
              <q-input
                outlined
                dense
                v-model="profile.username"
                placeholder="Enter username"
                class="custom-input"
                autocomplete="off"
              />
            </div>
            <div class="col-12">
              <label class="text-caption text-weight-bold text-dark q-mb-xs block">Email</label>
              <q-input
                outlined
                dense
                disable
                v-model="profile.email"
                type="email"
                class="custom-input bg-grey-1"
                hint="Email cannot be changed"
              />
            </div>
          </div>

          <!-- Save Button -->
          <div class="row justify-end q-mt-xl">
            <q-btn
              unelevated
              label="Save Changes"
              no-caps
              class="btn-save"
              :loading="isSavingProfile"
              @click="simpanProfil"
            />
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { useAuthStore } from 'src/stores/Auth'

const $q = useQuasar()
const authStore = useAuthStore()

// State Data Profil
const profile = reactive({
  name: '',
  username: '',
  email: '',
  profileImage: '',
})

// UI State
const isSavingProfile = ref(false)
const fileInput = ref(null)
const selectedFile = ref(null)

onMounted(async () => {
  try {
    await authStore.fetchUser()
    const userData = authStore.user

    if (userData) {
      profile.name = userData.name || userData.nama || userData.username || ''
      profile.username = userData.username || userData.name || ''
      profile.email = userData.email || ''
      profile.profileImage = userData.profileImage || userData.avatar || ''
    }
  } catch (error) {
    console.error('Error saat fetch profil:', error)
    $q.notify({ type: 'negative', message: 'Gagal memuat data profil.' })
  }
})

// Fungsi Upload File
const triggerFileInput = () => fileInput.value.click()
const onFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    profile.profileImage = URL.createObjectURL(file)
  }
}

// Fungsi Simpan Profil
const simpanProfil = async () => {
  isSavingProfile.value = true
  try {
    const formData = new FormData()
    formData.append('name', profile.name)
    formData.append('username', profile.username)
    if (selectedFile.value) {
      formData.append('image', selectedFile.value)
    }

    // Method spoofing untuk update profil di Laravel
    formData.append('_method', 'PUT')

    await api.post('/api/v1/auth/me/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    await authStore.fetchUser()
    $q.notify({ type: 'positive', message: 'Profile updated successfully.', icon: 'check_circle' })
  } catch (error) {
    console.error('Update profile error:', error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to update profile.',
    })
  } finally {
    isSavingProfile.value = false
  }
}
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

.btn-save {
  background-color: #111827 !important;
  color: white;
  border-radius: 4px;
  font-weight: 500;
  padding: 0 24px;
  height: 40px;
  transition: all 0.3s ease;
  &:hover {
    background-color: #1f2937 !important;
  }
}

.block {
  display: block;
}
</style>
