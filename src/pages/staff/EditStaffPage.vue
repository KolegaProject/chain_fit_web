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
            <div class="photo-container">
              <q-img
                :src="form.avatarUrl || '../../assets/staff/rora.jpeg'"
                class="photo-box"
                fit="cover"
              />
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
  border: 1.5px solid #000;
  border-radius: 15px;
  padding: 5px;
  width: 200px;
  height: 240px;
}

.photo-box {
  width: 100%;
  height: 100%;
  border-radius: 10px;
}

/* Warna Tombol Sesuai Design Edit */
.btn-batal {
  background-color: #e53935; /* Merah sesuai design */
  color: white;
  border-radius: 10px;
  font-weight: bold;
}

.btn-simpan {
  background-color: #1a1a1a; /* Hitam sesuai design */
  color: white;
  border-radius: 10px;
  font-weight: bold;
}
</style>
