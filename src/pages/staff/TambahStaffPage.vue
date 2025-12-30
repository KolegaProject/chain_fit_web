<template>
  <q-page class="bg-grey-1 q-pa-lg">

    <q-card flat class="main-card q-pa-xl">
      <div class="text-h5 text-weight-bolder text-center q-mb-xl">Tambah Staff</div>

      <div class="row q-col-gutter-xl">
        <div class="col-12 col-md-8">
          <div class="row q-col-gutter-x-md q-col-gutter-y-lg">
            <div class="col-12 col-sm-6">
              <label class="text-weight-bold block q-mb-xs">Nama</label>
              <q-input
                outlined
                v-model="form.nama"
                placeholder="Masukkan nama lengkap"
                dense
                class="custom-input"
              />
            </div>
            <div class="col-12 col-sm-6">
              <label class="text-weight-bold block q-mb-xs">Username</label>
              <q-input
                outlined
                v-model="form.username"
                placeholder="Masukkan username"
                dense
                class="custom-input"
              />
            </div>
            <div class="col-12 col-sm-6">
              <label class="text-weight-bold block q-mb-xs">Email</label>
              <q-input
                outlined
                v-model="form.email"
                placeholder="Masukkan email aktif"
                dense
                class="custom-input"
              />
            </div>
            <div class="col-12 col-sm-6">
              <label class="text-weight-bold block q-mb-xs">Password</label>
              <q-input
                outlined
                type="password"
                v-model="form.password"
                placeholder="Masukkan password (min. 6 karakter)"
                dense
                class="custom-input"
              />
            </div>
          </div>
        </div>

        <div class="col-12 col-md-4 flex justify-center">
          <div class="col-12 col-md-4 flex justify-center">
            <div class="photo-wrapper column items-center">

              <div class="photo-inner">
                <q-img
                  :src="form.avatarUrl || defaultPhoto"
                  class="photo-img"
                  fit="cover"
                />
              </div>

              <div class="photo-actions-container row justify-center q-mt-md q-gutter-x-sm">
                <q-btn dense round unelevated icon="photo_camera" class="action-btn" @click="triggerFileInput" />
                <q-btn dense round unelevated icon="edit" class="action-btn" @click="triggerFileInput" />
                <q-btn dense round unelevated icon="delete" class="action-btn" color="negative" :disable="!form.avatarUrl" @click="removePhoto" />
              </div>

              <input ref="fileInput" type="file" accept="image/*" @change="onFileChange" hidden />
            </div>
          </div>
        </div>
      </div>

      <div class="row justify-end q-mt-xl q-gutter-md">
        <q-btn
          unelevated
          label="Batal"
          class="btn-action btn-cancel"
          @click="goBack"
        />
        <q-btn
          unelevated
          label="Tambah"
          class="btn-action btn-save"
          @click="submitForm"
        />
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref({
  nama: '',
  username: '',
  email: '',
  password: '',
  avatarUrl: ''
})

// default placeholder image
const defaultPhoto = '../../assets/staff/profile.png'

// file input ref and handlers
const fileInput = ref(null)
const triggerFileInput = () => {
  fileInput.value && fileInput.value.click()
}
const onFileChange = (evt) => {
  const file = evt.target.files && evt.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    form.value.avatarUrl = reader.result
  }
  reader.readAsDataURL(file)
}
const removePhoto = () => {
  form.value.avatarUrl = ''
  if (fileInput.value) fileInput.value.value = ''
}

const goBack = () => router.push('/staff')

const submitForm = () => {
  const avatarToSave = form.value.avatarUrl && form.value.avatarUrl.trim()
    ? form.value.avatarUrl
    : defaultPhoto

  const newStaff = {
    id: Date.now(),
    nama: form.value.nama,
    username: form.value.username,
    email: form.value.email,
    password: form.value.password,
    avatarUrl: avatarToSave
  }

  try {
    const raw = localStorage.getItem('staff')
    const staffList = raw ? JSON.parse(raw) : []
    staffList.push(newStaff)
    localStorage.setItem('staff', JSON.stringify(staffList))
    console.log('Staff saved:', newStaff)
  } catch (e) {
    console.error('Failed to save staff to localStorage', e)
  }

  goBack()
}
</script>

<style lang="scss" scoped>
// Kotak Putih Utama
.main-card {
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  max-width: 1200px;
  margin: 0 auto;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.03) !important;
}

.custom-input {
  :deep(.q-field__control) {
    border-radius: 12px;
    &:before {
      border: 1.5px solid #2d2d2d !important;
    }
    &:after {
      border-width: 2px;
    }
  }
}

.photo-wrapper {
  width: 180px;
  background: transparent;
}

.photo-inner {
  width: 180px;
  height: 220px;
  border: 1.5px solid #2d2d2d;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
}

.photo-img {
  width: 100%;
  height: 100%;
}

.photo-actions-container {
  width: 100%;
}

.action-btn {
  background-color: #f0f0f0; // Warna abu-abu terang agar bersih
  color: #1a1a1a;
  width: 32px;  // Ukuran diperkecil sesuai permintaan
  height: 32px;
  min-height: 32px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);

  :deep(.q-icon) {
    font-size: 18px;
  }
}

.action-btn.bg-negative {
  background-color: #e53935 !important;
  color: white;
}

.action-btn[disabled] {
  opacity: 0.4;
}


.photo-overlay {
  position: absolute;
  bottom: -22px;
  left: 50%;
  transform: translateX(-50%);
  gap: 8px;
  z-index: 10;
  background: transparent;
}

.overlay-btn {
  background: rgba(255,255,255,0.98);
  box-shadow: 0 2px 6px rgba(0,0,0,0.12);
  min-width: 34px;
  height: 34px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #1a1a1a;
  font-size: 16px;
}

.overlay-btn[disabled] {
  opacity: 0.45;
  pointer-events: none;
}

.photo-actions { display: none; }

// Tombol
.btn-action {
  border-radius: 8px;
  padding: 8px 30px;
  font-weight: bold;
  text-transform: none;
}

.btn-cancel {
  background-color: #e53935 !important;
  color: white;
}

.btn-save {
  background-color: #1a1a1a !important;
  color: white;
  min-width: 120px;
}
</style>
