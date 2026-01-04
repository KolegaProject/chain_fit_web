<template>
  <q-page class="q-pa-lg bg-grey-2">
    <q-card flat class="rounded-borders shadow-1 custom-card">
      <q-card-section class="q-pa-xl">
        <div class="text-h5 text-center text-weight-bolder q-mb-xl">
          Tambah Anggota
        </div>

        <div class="row q-col-gutter-x-md q-col-gutter-y-lg">
          <div class="col-12 col-sm-6">
            <div class="text-weight-bold q-mb-sm">Nama</div>
            <q-input
              outlined
              dense
              v-model="form.nama"
              placeholder="Masukkan nama anggota"
              :error="!!errors.nama"
              :error-message="errors.nama"
              @update:model-value="errors.nama = ''"
            />
          </div>

          <!-- Email -->
          <div class="col-12 col-sm-6">
            <div class="text-weight-bold q-mb-sm">Email</div>
            <q-input
              outlined
              dense
              v-model="form.email"
              placeholder="Masukkan email anggota"
              :error="!!errors.email"
              :error-message="errors.email"
              @update:model-value="errors.email = ''"
            />
          </div>

          <div class="col-12">
            <div class="text-weight-bold q-mb-md">Paket Gym</div>

            <div class="row q-col-gutter-md">
              <div
                v-for="paket in paketOptions"
                :key="paket.id"
                class="col-12 col-sm-4"
              >
                <q-card
                  flat
                  bordered
                  class="paket-card cursor-pointer"
                  :class="{ 'paket-selected': form.selectedPaket === paket.id }"
                  @click="selectPaket(paket.id)"
                >
                  <q-card-section class="row items-center no-wrap">
                    <div class="col">
                      <div class="text-h6 text-weight-bolder">
                        {{ paket.nama }}
                      </div>
                      <div class="text-caption text-weight-bold">
                        Rp {{ paket.harga.toLocaleString() }}
                      </div>
                    </div>
                    <div class="col-auto text-right">
                      <span class="text-h4 text-weight-bolder">
                        {{ paket.durasi }}
                      </span>
                      <span class="text-caption"> hari</span>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <div v-if="errors.selectedPaket" class="error-text q-mt-sm">
              {{ errors.selectedPaket }}
            </div>
          </div>
        </div>

        <div class="row justify-end q-mt-xl q-gutter-sm">
          <q-btn
            unelevated
            no-caps
            label="Batal"
            class="btn-batal q-px-lg"
            @click="goBack"
          />
          <q-btn
            unelevated
            no-caps
            label="Tambah"
            class="btn-tambah q-px-xl"
            @click="submitForm"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'
import { api } from 'src/boot/axios'

import { useGymStore } from 'src/stores/Gym'
import { usePackageStore } from 'src/stores/Package'

const $q = useQuasar()
const router = useRouter()

const gymStore = useGymStore()
const packageStore = usePackageStore()
const { subscriptionPlans } = storeToRefs(packageStore)

const gymId = computed(() => gymStore.selectedGymId)

const form = ref({
  nama: '',
  email: '',
  selectedPaket: null
})

const errors = reactive({
  nama: '',
  email: '',
  selectedPaket: ''
})


onMounted(async () => {
  if (!gymId.value) {
    $q.notify({
      type: 'negative',
      message: 'Gym belum dipilih. Silakan daftar atau pilih gym terlebih dahulu.'
    })
    router.push('/daftar-gym')
    return
  }

  try {
    await packageStore.fetchPlans(gymId.value)
  } catch (err) {
    console.error(err)
    $q.notify({
      type: 'negative',
      message: 'Gagal memuat paket gym'
    })
  }
})

const paketOptions = computed(() =>
  (subscriptionPlans.value || []).map(p => ({
    id: p.id,
    nama: p.name,
    harga: Number(p.price),
    durasi: p.durationDays
  }))
)

const goBack = () => {
  router.push('/anggota')
}

const selectPaket = (id) => {
  form.value.selectedPaket = id
  errors.selectedPaket = ''
}

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const submitForm = async () => {
  errors.nama = ''
  errors.email = ''
  errors.selectedPaket = ''

  if (!gymId.value) {
    $q.notify({
      type: 'negative',
      message: 'Gym ID tidak ditemukan'
    })
    return
  }

  if (!form.value.nama.trim()) {
    errors.nama = 'Nama wajib diisi'
    return
  }

  if (!form.value.email.trim()) {
    errors.email = 'Email wajib diisi'
    return
  }

  if (!validateEmail(form.value.email)) {
    errors.email = 'Format email tidak valid'
    return
  }

  if (!form.value.selectedPaket) {
    errors.selectedPaket = 'Silakan pilih paket'
    return
  }

  try {
    await api.post(`/api/v1/gym/${gymId.value}/memberships`, {
      name: form.value.nama,
      email: form.value.email,
      paketId: form.value.selectedPaket
    })

    $q.notify({
      type: 'positive',
      message: 'Anggota berhasil ditambahkan'
    })

    router.push('/anggota')
  } catch (err) {
    console.error(err)
    $q.notify({
      type: 'negative',
      message: err.response?.data?.message || 'Gagal menambah anggota'
    })
  }
}
</script>

<style scoped>
.custom-card {
  border-radius: 15px;
  max-width: 1000px;
  margin: 0 auto;
}

.paket-card {
  border-radius: 12px;
  background-color: #94a3b8;
  color: white;
  border: 2px solid transparent;
}

.paket-selected {
  background-color: #475569;
  border-color: #000;
}

.btn-tambah {
  background-color: #000;
  color: white;
  border-radius: 10px;
  font-weight: bold;
  height: 44px;
}

.btn-batal {
  background-color: #e53935;
  color: white;
  border-radius: 10px;
  font-weight: bold;
  height: 44px;
}

.error-text {
  color: #ef4444;
  font-size: 13px;
  font-weight: 600;
}
</style>


// const absensiForm = ref({
//   membershipId: null
// })






