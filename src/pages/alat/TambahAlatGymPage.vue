<template>
  <q-page class="q-pa-lg bg-grey-2">
    <q-card flat class="rounded-borders shadow-1 q-pa-md">
      <q-card-section>
        <div class="row items-center q-mb-xl">
          <q-btn icon="arrow_back" flat round dense @click="goBack" class="q-mr-sm" />
          <div class="text-h5 text-weight-bold">Tambah Alat Gym Baru</div>
        </div>

        <div class="row q-col-gutter-x-md q-col-gutter-y-lg">
          <div class="col-12 col-md-6">
            <div class="text-subtitle2 text-weight-bold q-mb-xs">Nama Alat</div>
            <q-input
              outlined
              dense
              v-model="newEquipment.name"
              placeholder="Contoh: Smith Machine"
              class="bg-white custom-field"
            />
          </div>

          <div class="col-12 col-md-6">
            <div class="text-subtitle2 text-weight-bold q-mb-xs">Kondisi/Status</div>
            <q-select
              outlined
              dense
              v-model="newEquipment.status"
              :options="statusOptions"
              class="bg-white custom-field"
            />
          </div>

          <div class="col-12 col-md-4">
            <div class="text-subtitle2 text-weight-bold q-mb-xs">Jumlah Unit</div>
            <q-input
              outlined
              dense
              type="number"
              v-model="newEquipment.qty"
              class="bg-white custom-field"
            />
          </div>

          <div class="col-12 col-md-8">
            <div class="text-subtitle2 text-weight-bold q-mb-xs">Link Video Tutorial (YouTube)</div>
            <q-input
              outlined
              dense
              v-model="newEquipment.videoUrl"
              placeholder="https://youtube.com/watch?v=..."
              class="bg-white custom-field"
            >
              <template v-slot:prepend>
                <q-icon name="play_circle" color="red" />
              </template>
            </q-input>
          </div>
        </div>

        <div v-if="youtubeId" class="q-mt-lg">
          <div class="text-caption text-grey-7 q-mb-sm">Preview Video:</div>
          <q-video
            :ratio="16 / 9"
            :src="`https://www.youtube.com/embed/${youtubeId}`"
            class="rounded-borders shadow-2"
            style="max-width: 400px"
          />
        </div>

        <q-separator class="q-my-xl" />

        <div class="row justify-end q-gutter-sm">
          <q-btn unelevated label="Batal" no-caps class="btn-batal" @click="goBack" />
          <q-btn
            unelevated
            label="Simpan Alat"
            color="black"
            class="btn-submit q-px-xl"
            no-caps
            @click="submitEquipment"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useGymStore } from 'src/stores/Gym'
import { useEquipmentStore } from 'src/stores/Equipment' // Import store baru

const $q = useQuasar()
const router = useRouter()
const gymStore = useGymStore()
const equipmentStore = useEquipmentStore() // Inisialisasi

const newEquipment = reactive({
  name: '',
  qty: 1,
  healthStatus: '', // Field ini tetap ada di UI, tapi tidak dikirim ke API sesuai spec Anda
  videoUrl: '',
})

const statusOptions = ['Baik', 'Butuh Perawatan', 'Rusak']

// Logika untuk mendapatkan ID Youtube (untuk preview)
const youtubeId = computed(() => {
  if (!newEquipment.videoUrl) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = newEquipment.videoUrl.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
})

const submitEquipment = async () => {
  // Validasi sederhana
  if (!newEquipment.name) {
    $q.notify({ message: 'Nama alat wajib diisi', color: 'negative' })
    return
  }

  const gymId = gymStore.selectedGymId
  if (!gymId) {
    $q.notify({ message: 'ID Gym tidak ditemukan', color: 'negative' })
    return
  }

  try {
    // Memanggil action dari store
    await equipmentStore.createEquipment(gymId, newEquipment)

    $q.notify({
      type: 'positive',
      message: 'Alat gym berhasil ditambahkan ke server',
    })

    router.push('/info')
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: err.response?.data?.message || 'Gagal menyimpan ke server',
    })
  } finally {
  }
}

const goBack = () => router.back()
</script>

<style scoped lang="scss">
.custom-field {
  :deep(.q-field__control) {
    border-radius: 8px;
    transition: all 0.3s;
    &:hover {
      border-color: #000;
    }
  }
}

.btn-submit {
  border-radius: 8px;
  height: 44px;
  font-weight: 700;
}

.btn-batal {
  color: #666;
  border-radius: 8px;
  height: 44px;
  padding: 0 25px;
  font-weight: 600;
}

.rounded-borders {
  border-radius: 16px;
}
</style>
