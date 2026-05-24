<template>
  <q-page class="q-pa-lg bg-grey-2">
    <q-card flat class="custom-card q-mb-lg bg-white shadow-1">
      <q-card-section class="header-height q-pa-md row items-center justify-between">
        <div class="row items-center">
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
          <q-icon name="edit" color="dark" size="32px" class="q-mr-md" />
          <div class="text-h5 text-weight-bold text-dark">Edit Staff Member</div>
        </div>
        <q-spinner-dots v-if="staffStore.loading" color="primary" size="2em" />
      </q-card-section>
    </q-card>

    <q-card flat class="custom-card shadow-1 bg-white">
      <q-card-section class="q-pa-xl">
        <div class="row q-col-gutter-xl">
          <div class="col-12 col-md-8">
            <div class="row q-col-gutter-y-lg q-col-gutter-x-md">
              <div class="col-12 col-sm-6">
                <div class="text-subtitle2 q-mb-xs text-weight-bold text-dark">Full Name</div>
                <q-input
                  outlined
                  v-model="form.nama"
                  placeholder="e.g., John Doe"
                  dense
                  class="custom-input"
                />
              </div>

              <div class="col-12 col-sm-6">
                <div class="text-subtitle2 q-mb-xs text-weight-bold text-dark">Email</div>
                <q-input
                  outlined
                  disable
                  v-model="form.email"
                  placeholder="email@example.com"
                  dense
                  class="custom-input bg-grey-1"
                />
              </div>

              <div class="col-12 col-sm-6">
                <div class="text-subtitle2 q-mb-xs text-weight-bold text-dark">Role</div>
                <q-input
                  outlined
                  v-model="form.role"
                  dense
                  disable
                  class="custom-input bg-grey-1"
                />
              </div>

              <div class="col-12 col-sm-6">
                <div class="text-subtitle2 q-mb-xs text-weight-bold text-dark">Gym Branch</div>
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
              <div class="text-subtitle2 q-mb-md text-weight-bold text-dark text-center">
                Profile Photo
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
                  color="primary"
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
              <div class="text-caption text-grey-6 q-mt-sm">JPG, PNG (Max 2MB)</div>
            </div>
          </div>
        </div>

        <q-separator class="q-my-xl" />

        <div class="row justify-end q-gutter-md">
          <q-btn flat label="Cancel" class="btn-cancel" no-caps @click="goBack" />
          <q-btn
            unelevated
            label="Save Changes"
            class="btn-save"
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

const form = ref({ nama: '', email: '', role: '', gymName: '' })
const imagePreview = ref('')
const imageFile = ref(null)
const defaultPhoto =
  'https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg'
const fileInput = ref(null)

const gymId = route.params.id
const userId = route.params.userId

onMounted(async () => {
  if (gymId && userId) {
    const data = await staffStore.fetchStaffById(gymId, userId)
    if (data) {
      form.value.nama = data.name || data.nama || ''
      form.value.email = data.email || ''
      form.value.role = data.role || ''
      form.value.gymName = data.gym?.name || 'Gym Branch'
      imagePreview.value = data.profileImage || ''
    }
  }
})

const triggerFileInput = () => fileInput.value.click()

const onFileChange = (evt) => {
  const file = evt.target.files[0]
  if (!file) return
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
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
    imageFile: imageFile.value,
  }
  const success = await staffStore.updateStaff(gymId, userId, payload)
  if (success) goBack()
}
</script>

<style lang="scss" scoped>
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

.photo-container {
  width: 200px;
  height: 240px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  background: #fff;
}

.btn-cancel {
  border: 1px solid #d1d5db;
  border-radius: 4px;
  color: #374151;
  padding: 0 25px;
}

.btn-save {
  background-color: #111827 !important;
  color: white;
  border-radius: 4px;
  font-weight: 500;
  height: 40px;
  padding: 0 35px;
  transition: all 0.3s ease;
  &:hover {
    background-color: #1f2937 !important;
  }
}

.header-height {
  height: 68px;
}
</style>
