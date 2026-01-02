<template>
  <q-page class="q-pa-lg bg-grey-2">
    <q-card flat class="rounded-borders shadow-1 q-mb-lg bg-white">
      <q-card-section class="header-height q-pa-md row items-center">
        <div style="width: 42px" class="row items-center justify-start">
          <q-btn flat round icon="arrow_back" color="grey-7" size="md" dense @click="goBack" />
        </div>
        <q-icon name="fitness_center" color="black" size="32px" class="q-mr-md" />
        <div class="text-h5 text-weight-bold">Tambah Alat Gym Baru</div>
      </q-card-section>
    </q-card>

    <q-card flat class="rounded-borders shadow-1 bg-white">
      <q-card-section class="q-pa-xl">
        <div class="row q-col-gutter-lg">
          <div class="col-12">
            <div class="text-subtitle2 q-mb-xs text-weight-bold text-grey-9">Nama Alat</div>
            <q-input
              outlined
              dense
              v-model="newEquipment.name"
              placeholder="Contoh: Smith Machine, Leg Press..."
              class="custom-input shadow-none"
            />
          </div>

          <div class="col-12 col-md-4">
            <div class="text-subtitle2 q-mb-xs text-weight-bold text-grey-9">Jumlah Unit</div>
            <q-input
              outlined
              dense
              type="number"
              v-model="newEquipment.qty"
              class="custom-input"
              min="1"
            >
              <template v-slot:append>
                <div class="text-caption text-grey-6 text-weight-medium">UNIT</div>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-8">
            <div class="text-subtitle2 q-mb-xs text-weight-bold text-grey-9">
              Link Video Tutorial (YouTube)
            </div>
            <q-input
              outlined
              dense
              v-model="newEquipment.videoUrl"
              placeholder="https://www.youtube.com/watch?v=..."
              class="custom-input"
            >
              <template v-slot:prepend>
                <q-icon name="play_circle" color="red-7" />
              </template>
            </q-input>
          </div>
        </div>

        <q-separator class="q-my-xl" />

        <div class="row justify-end q-gutter-md">
          <q-btn flat label="Batal" class="btn-batal" no-caps @click="goBack" />
          <q-btn
            unelevated
            label="Simpan Data Alat"
            class="btn-simpan"
            no-caps
            :loading="loading"
            @click="submitEquipment"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useGymStore } from 'src/stores/Gym'
import { useEquipmentStore } from 'src/stores/Equipment'

const $q = useQuasar()
const router = useRouter()
const gymStore = useGymStore()
const equipmentStore = useEquipmentStore()

const loading = ref(false)

const newEquipment = reactive({
  name: '',
  qty: 1,
  videoUrl: '',
})

const submitEquipment = async () => {
  if (!newEquipment.name) {
    $q.notify({ message: 'Nama alat wajib diisi', color: 'negative', position: 'top' })
    return
  }

  const gymId = gymStore.selectedGymId
  if (!gymId) {
    $q.notify({ message: 'Silahkan pilih Gym terlebih dahulu', color: 'negative', position: 'top' })
    return
  }

  loading.value = true
  try {
    await equipmentStore.createEquipment(gymId, {
      name: newEquipment.name,
      qty: parseInt(newEquipment.qty),
      videoUrl: newEquipment.videoUrl,
    })

    $q.notify({
      type: 'positive',
      message: 'Alat gym berhasil ditambahkan',
      position: 'top',
    })

    router.push('/info')
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: err.response?.data?.message || 'Gagal menyimpan ke server',
      position: 'top',
    })
  } finally {
    loading.value = false
  }
}

const goBack = () => router.back()
</script>

<style scoped lang="scss">
.header-height {
  height: 68px;
}

.rounded-borders {
  border-radius: 12px;
}

.custom-input {
  :deep(.q-field__control) {
    border-radius: 10px;
    background-color: #fafafa;
    transition: all 0.3s ease;

    &:before {
      border: 1px solid #e0e0e0 !important;
    }

    &:hover:before {
      border-color: #222 !important;
    }

    &.q-field__control--focused:after {
      border-color: #000 !important;
    }
  }
}

.btn-batal {
  min-width: 120px;
  background-color: #f0f2f5;
  border-radius: 10px;
  font-weight: 700;
  color: #555;
}

.btn-simpan {
  min-width: 180px;
  background: linear-gradient(135deg, #444 0%, #000 100%);
  color: white;
  border-radius: 10px;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.shadow-1 {
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05) !important;
}
</style>
