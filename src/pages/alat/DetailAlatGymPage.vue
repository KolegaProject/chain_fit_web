<template>
  <q-page class="q-pa-lg bg-grey-2">
    <q-card flat class="rounded-borders shadow-1 q-mb-lg bg-white">
      <q-card-section class="header-height q-pa-md row items-center">
        <div style="width: 42px" class="row items-center justify-start">
          <q-btn flat round icon="arrow_back" color="grey-7" size="md" dense @click="goBack" />
        </div>
        <q-icon name="fitness_center" color="black" size="32px" class="q-mr-md" />
        <div class="text-h5 text-weight-bold">Detail Alat Gym</div>

        <q-space />
        <q-spinner-dots v-if="loading" color="grey-7" size="2em" />
      </q-card-section>
    </q-card>

    <q-card flat class="rounded-borders shadow-1 bg-white">
      <q-card-section class="q-pa-xl">
        <div v-if="!loading" class="row q-col-gutter-lg">
          <div class="col-12">
            <div class="text-subtitle2 q-mb-xs text-weight-bold text-grey-9">Nama Alat</div>
            <q-input
              v-model="equipment.name"
              outlined
              dense
              class="custom-input-detail shadow-none"
            />
          </div>

          <div class="col-12 col-md-4">
            <div class="text-subtitle2 q-mb-xs text-weight-bold text-grey-9">Jumlah Unit</div>
            <q-input
              v-model="equipment.jumlah"
              type="number"
              outlined
              dense
              class="custom-input-detail"
            >
              <template v-slot:append>
                <span class="text-caption text-grey-6 text-weight-bold">UNIT</span>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-8">
            <div class="text-subtitle2 q-mb-xs text-weight-bold text-grey-9">
              Video Tutorial (URL)
            </div>
            <q-input
              readonly
              v-model="equipment.videoURL"
              outlined
              dense
              class="custom-input-detail"
            >
              <template v-slot:prepend>
                <q-icon name="play_circle" :color="equipment.videoURL ? 'red-7' : 'grey-4'" />
              </template>
              <template v-if="equipment.videoURL" v-slot:append>
                <q-btn
                  flat
                  round
                  color="blue-8"
                  icon="open_in_new"
                  size="sm"
                  @click="openLink(equipment.videoURL)"
                />
              </template>
            </q-input>
          </div>
        </div>

        <div v-else class="row q-col-gutter-lg">
          <div class="col-12"><q-skeleton type="QInput" /></div>
          <div class="col-4"><q-skeleton type="QInput" /></div>
          <div class="col-8"><q-skeleton type="QInput" /></div>
        </div>

        <q-separator class="q-my-xl" />

        <div class="row justify-between items-center">
          <q-btn flat label="Kembali" class="btn-batal" no-caps @click="goBack" />

          <div class="row q-gutter-md">
            <q-btn
              unelevated
              label="Simpan Perubahan"
              icon="save"
              class="btn-edit"
              no-caps
              :disabled="loading"
              @click="showConfirmUpdate = true"
            />
            <q-btn
              unelevated
              label="Hapus"
              icon="delete"
              class="btn-hapus"
              no-caps
              :disabled="loading"
              @click="showConfirmDelete = true"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-dialog v-model="showConfirmUpdate" persistent>
      <q-card class="dialog-card q-pa-md">
        <q-btn icon="close" flat round dense v-close-popup class="close-btn text-grey-6" />
        <q-card-section class="text-center q-pt-lg">
          <q-icon name="info" size="80px" color="blue-7" class="q-mb-md" />
          <div class="text-h6 text-weight-bolder">Simpan Perubahan?</div>
          <div class="text-body2 text-grey-7 q-mt-sm">
            Apakah Anda yakin ingin memperbarui data <strong>{{ equipment.name }}</strong
            >?
          </div>
        </q-card-section>
        <q-card-actions align="center" class="q-pb-lg q-gutter-x-md">
          <q-btn flat label="Batal" v-close-popup class="btn-dialog-flat" no-caps />
          <q-btn
            unelevated
            label="Ya, Simpan"
            class="btn-dialog-gradient-blue"
            no-caps
            :loading="updateLoading"
            @click="handleUpdate"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showConfirmDelete" persistent>
      <q-card class="dialog-card q-pa-md">
        <q-btn icon="close" flat round dense v-close-popup class="close-btn text-grey-6" />
        <q-card-section class="text-center q-pt-lg">
          <q-img
            src="../../assets/popup/hapus.png"
            style="width: 140px; height: auto"
            class="q-mb-md"
          />
          <div class="text-h6 text-weight-bolder">Hapus Data Alat?</div>
          <div class="text-body2 text-grey-7 q-mt-sm">
            Apakah Anda yakin ingin menghapus <strong>{{ equipment.name }}</strong
            >?
          </div>
        </q-card-section>
        <q-card-actions align="center" class="q-pb-lg q-gutter-x-md">
          <q-btn flat label="Batal" v-close-popup class="btn-dialog-flat" no-caps />
          <q-btn
            unelevated
            label="Ya, Hapus"
            class="btn-dialog-gradient"
            no-caps
            :loading="deleteLoading"
            @click="handleDelete"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useGymStore } from 'src/stores/Gym'
import { useEquipmentStore } from 'src/stores/Equipment'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const gymStore = useGymStore()
const equipmentStore = useEquipmentStore()

const showConfirmDelete = ref(false)
const showConfirmUpdate = ref(false)
const loading = ref(false)
const deleteLoading = ref(false)
const updateLoading = ref(false)

const equipment = reactive({
  id: null,
  name: '',
  jumlah: 0,
  videoURL: '',
})

const fetchDetail = async () => {
  const gymId = gymStore.selectedGymId
  const equipId = route.params.id
  if (!gymId || !equipId) return

  loading.value = true
  try {
    const data = await equipmentStore.fetchEquipmentDetail(gymId, equipId)
    Object.assign(equipment, data)
  } catch {
    $q.notify({ type: 'negative', message: 'Gagal mengambil data' })
  } finally {
    loading.value = false
  }
}

const handleUpdate = async () => {
  const gymId = gymStore.selectedGymId
  const equipId = equipment.id // Pastikan ID alat tersedia

  if (!gymId || !equipId) {
    $q.notify({ type: 'warning', message: 'Data ID tidak ditemukan' })
    return
  }

  updateLoading.value = true
  try {
    const payload = {
      name: equipment.name,
      jumlah: equipment.jumlah,
    }

    await equipmentStore.updateEquipment(gymId, equipId, payload)

    $q.notify({
      type: 'positive',
      message: 'Berhasil memperbarui nama dan jumlah alat',
      position: 'top',
    })

    showConfirmUpdate.value = false
    await fetchDetail() // Refresh data dari server
  } catch (error) {
    console.error('Component Update Error:', error)
    $q.notify({
      type: 'negative',
      message: 'Gagal memperbarui data. Periksa koneksi atau input Anda.',
      position: 'top',
    })
  } finally {
    updateLoading.value = false
  }
}

const handleDelete = async () => {
  const gymId = gymStore.selectedGymId
  deleteLoading.value = true
  try {
    await equipmentStore.deleteEquipment(gymId, equipment.id)
    $q.notify({ type: 'positive', message: 'Alat berhasil dihapus' })
    router.push('/info')
  } catch {
    $q.notify({ type: 'negative', message: 'Gagal menghapus alat' })
  } finally {
    deleteLoading.value = false
    showConfirmDelete.value = false
  }
}

const openLink = (url) => {
  if (url) window.open(url, '_blank')
}
const goBack = () => router.back()

onMounted(fetchDetail)
</script>

<style scoped lang="scss">
.header-height {
  height: 68px;
}
.rounded-borders {
  border-radius: 12px;
}

.custom-input-detail {
  :deep(.q-field__control) {
    border-radius: 10px;
    background-color: #fafafa !important;
    &:before {
      border: 1px solid #e0e0e0 !important;
    }
  }
  :deep(.q-field__native) {
    font-weight: 500;
    color: #222;
  }
}

.btn-batal {
  min-width: 120px;
  background-color: #f0f2f5;
  border-radius: 10px;
  font-weight: 700;
  color: #555;
}
.btn-edit {
  min-width: 140px;
  background: #2563eb;
  color: white;
  border-radius: 10px;
  font-weight: 700;
}
.btn-hapus {
  min-width: 140px;
  background: #ef4444;
  color: white;
  border-radius: 10px;
  font-weight: 700;
}

.dialog-card {
  width: 100%;
  max-width: 440px;
  border-radius: 24px;
  position: relative;
}
.btn-dialog-flat {
  width: 130px;
  background-color: #f0f2f5;
  border-radius: 12px;
  font-weight: bold;
}
.btn-dialog-gradient {
  width: 130px;
  background: black;
  color: white;
  border-radius: 12px;
  font-weight: bold;
}
.btn-dialog-gradient-blue {
  width: 130px;
  background: #2563eb;
  color: white;
  border-radius: 12px;
  font-weight: bold;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: #f0f0f0;
  z-index: 10;
}
.shadow-1 {
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05) !important;
}
</style>
