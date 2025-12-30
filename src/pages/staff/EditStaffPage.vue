<template>
  <q-page class="q-pa-lg bg-grey-2">
    <q-card flat class="rounded-borders shadow-1 custom-card">
      <q-card-section class="q-pa-xl">
        <div class="text-h5 text-center text-weight-bolder q-mb-xl">Edit Data Staff</div>

        <div class="row q-col-gutter-xl items-start">
          <div class="col-12 col-md-8">
            <div class="row q-col-gutter-y-lg q-col-gutter-x-md">
              <div class="col-12 col-sm-6">
                <div class="text-weight-bold q-mb-sm">Nama</div>
                <q-input
                  outlined
                  dense
                  v-model="form.nama"
                  class="custom-input"
                />
              </div>

              <div class="col-12 col-sm-6">
                <div class="text-weight-bold q-mb-sm">Username</div>
                <q-input
                  outlined
                  dense
                  v-model="form.username"
                  class="custom-input"
                />
              </div>

              <div class="col-12 col-sm-6">
                <div class="text-weight-bold q-mb-sm">Email</div>
                <q-input
                  outlined
                  dense
                  v-model="form.email"
                  class="custom-input"
                />
              </div>

              <div class="col-12 col-sm-6">
                <div class="text-weight-bold q-mb-sm">Password</div>
                <q-input
                  outlined
                  dense
                  type="password"
                  v-model="form.password"
                  class="custom-input"
                />
              </div>
            </div>
          </div>

          <div class="col-12 col-md-4 flex justify-center">
            <div class="photo-container column items-center">

              <div class="photo-inner">
                <q-img
                  :src="form.avatarUrl || defaultAvatar"
                  class="photo-box"
                  fit="cover"
                />
              </div>

              <div class="photo-actions-row row justify-center q-mt-md q-gutter-x-sm">
                <q-btn dense round unelevated icon="photo_camera" class="action-btn" @click="triggerFileInput" />
                <q-btn dense round unelevated icon="edit" class="action-btn" @click="triggerFileInput" />
                <q-btn dense round unelevated icon="delete" class="action-btn" color="negative" :disable="!form.avatarUrl" @click="removePhoto" />
              </div>

              <input ref="fileInput" type="file" accept="image/*" @change="onFileChange" hidden />
            </div>
          </div>
        </div>

        <div class="row justify-end q-mt-xl q-gutter-md">
          <q-btn
            unelevated
            no-caps
            label="Batal"
            class="btn-batal q-px-xl"
            @click="goBack"
          />
          <q-btn
            unelevated
            no-caps
            label="Simpan"
            class="btn-simpan q-px-xl"
            @click="saveChanges"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const form = ref({
  nama: '',
  username: '',
  email: '',
  password: '',
  avatarUrl: ''
})

const defaultAvatar = '../../assets/staff/rora.jpeg'

onMounted(() => {
  // Prefer query parameters (we push these from StaffPage for prefill)
  if (route.query && route.query.nama) {
    form.value.nama = route.query.nama
    form.value.username = route.query.username || ''
    form.value.email = route.query.email || ''
    form.value.avatarUrl = route.query.avatarUrl || ''
    form.value.password = '' // do not prefill real password
    return
  }

  // Fallback: if an id param is present, you can fetch the staff by id here.
  // For now we set a placeholder note if no query data available.
  if (route.params && route.params.id) {
    // TODO: fetch staff data by ID from API/store
    // Example placeholder behavior:
    form.value.nama = `Staff #${route.params.id}`
    form.value.username = ''
    form.value.email = ''
    form.value.password = ''
    form.value.avatarUrl = ''
  }
})

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

const saveChanges = () => {
  console.log('Menyimpan perubahan:', form.value)
  // Tambahkan logika update API di sini
  goBack()
}
</script>

<style lang="scss" scoped>
.custom-card {
  border-radius: 15px;
  max-width: 1100px;
  margin: 0 auto;
}

.custom-input {
  :deep(.q-field__control) {
    border-radius: 10px;
    background-color: white;
    border: 1.5px solid #000;
  }
}

.photo-container {
  width: 200px;
}

/* inner box holds border and image */
.photo-inner {
  width: 100%;
  height: 240px; /* Tinggi kotak */
  border: 1.5px solid #000;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
}

.photo-box {
  width: 100%;
  height: 100%;
}

.photo-actions-row {
  width: 100%;
}

.action-btn {
  background: #f0f0f0; /* Abu-abu terang agar kontras */
  color: #1a1a1a;
  width: 32px; /* Ukuran tombol lebih kecil */
  height: 32px;
  min-height: 32px;

  /* Ukuran icon di dalam tombol */
  :deep(.q-icon) {
    font-size: 18px;
  }
}

.action-btn[disabled] {
  opacity: 0.4;
}

.action-btn.bg-negative {
  background-color: #e53935 !important;
  color: white;
}

.photo-overlay {
  position: absolute;
  bottom: -22px;
  left: 50%;
  transform: translateX(-50%);
  gap: 10px;
  z-index: 10;
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

.btn-batal {
  background-color: #e53935;
  color: white;
  border-radius: 10px;
  font-weight: bold;
}

.btn-simpan {
  background-color: #1a1a1a;
  color: white;
  border-radius: 10px;
  font-weight: bold;
}
</style>
