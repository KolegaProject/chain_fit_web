<template>
  <q-page class="q-pa-lg bg-grey-2">
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
        <q-icon name="person_add" color="black" size="32px" class="q-mr-md" />
        <div class="text-h5 text-weight-bold">Tambah Staff Baru</div>
      </q-card-section>
    </q-card>

    <q-card flat class="rounded-borders shadow-1 bg-white">
      <q-form @submit="submitForm">
        <q-card-section class="q-pa-xl">
          <div class="row q-col-gutter-lg">
            <div class="col-12">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <div class="text-subtitle2 q-mb-xs text-weight-bold text-grey-9">
                    Nama Lengkap
                  </div>
                  <q-input
                    outlined
                    v-model="form.nama"
                    placeholder="Masukkan nama lengkap"
                    dense
                    class="custom-input"
                    lazy-rules
                    :rules="[(val) => !!val || 'Nama wajib diisi']"
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <div class="text-subtitle2 q-mb-xs text-weight-bold text-grey-9">Username</div>
                  <q-input
                    outlined
                    v-model="form.username"
                    placeholder="Masukkan username"
                    dense
                    class="custom-input"
                    lazy-rules
                    :rules="[(val) => !!val || 'Username wajib diisi']"
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <div class="text-subtitle2 q-mb-xs text-weight-bold text-grey-9">Email</div>
                  <q-input
                    outlined
                    v-model="form.email"
                    type="email"
                    placeholder="email@example.com"
                    dense
                    class="custom-input"
                    lazy-rules
                    :rules="[
                      (val) => !!val || 'Email wajib diisi',
                      (val) => /.+@.+\..+/.test(val) || 'Format salah',
                    ]"
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <div class="text-subtitle2 q-mb-xs text-weight-bold text-grey-9">Password</div>
                  <q-input
                    outlined
                    type="password"
                    v-model="form.password"
                    placeholder="Min. 6 karakter"
                    dense
                    class="custom-input"
                    lazy-rules
                    :rules="[(val) => val.length >= 6 || 'Minimal 6 karakter']"
                  />
                </div>
              </div>
            </div>
          </div>

          <q-separator class="q-my-xl" />

          <div class="row justify-end q-gutter-sm">
            <q-btn flat label="Batal" class="btn-cancel" no-caps @click="goBack" />
            <q-btn
              unelevated
              type="submit"
              label="Simpan Data Staff"
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStaffStore } from 'src/stores/staff' // Import Store
import { useGymStore } from 'src/stores/Gym' // Asumsi Anda punya store Gym untuk ambil ID

const router = useRouter()
const staffStore = useStaffStore()
const gymStore = useGymStore() // Ambil ID gym dari sini

const form = ref({
  nama: '',
  username: '',
  email: '',
  password: '',
})

const goBack = () => router.push('/staff')

const submitForm = async () => {
  // Gunakan ID gym yang dinamis, atau hardcode '1' jika API belum dinamis
  const gymId = gymStore.selectedGymId || 1

  const success = await staffStore.createStaff(gymId, form.value)

  if (success) {
    goBack()
  }
}
</script>

<style lang="scss" scoped>
/* Style tetap sama seperti sebelumnya */
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
.btn-cancel {
  min-width: 120px;
  background-color: #f0f2f5;
  border-radius: 10px;
  font-weight: 700;
  color: #555;
}
.btn-save {
  min-width: 180px;
  background: black;
  color: white;
  border-radius: 10px;
  font-weight: 700;
}
</style>
