<template>
  <q-page class="q-pa-lg bg-grey-2">
    <q-card flat class="rounded-borders q-pa-xl shadow-1">
      <q-card-section>
        <div class="text-h5 text-weight-bold text-center q-mb-xl">
          Detail Alat Gym
        </div>

        <div class="row q-col-gutter-lg q-mb-xl">
          <div class="col-12 col-md-4">
            <div class="text-subtitle1 text-weight-bold q-mb-sm">Nama Alat</div>
            <div class="text-body1 bg-white q-pa-sm rounded-borders bordered-box px-md">
              {{ equipment.name }}
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="text-subtitle1 text-weight-bold q-mb-sm">Jumlah</div>
            <div class="text-body1 bg-white q-pa-sm rounded-borders bordered-box px-md">
              {{ equipment.qty }}
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="text-subtitle1 text-weight-bold q-mb-sm">Status</div>
            <div class="text-body1 bg-white q-pa-sm rounded-borders bordered-box px-md">
              {{ equipment.status }}
            </div>
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <div class="video-wrapper bg-black rounded-borders flex flex-center">
              <video
                controls
                class="full-width"
                style="max-height: 400px; object-fit: contain;"
              >
                <source src="~assets/alatgym/videoAlat.mp4" type="video/mp4">
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          <div class="col-12 col-md-6">
            <div class="image-grid-container">
              <div class="grid-item">
                <q-img :src="localImages[0]" class="full-height bordered-image" fit="cover" />
              </div>
              <div class="grid-item">
                <q-img :src="localImages[1]" class="full-height bordered-image" fit="cover" />
              </div>
              <div class="grid-item">
                <q-img :src="localImages[2]" class="full-height bordered-image" fit="cover" />
              </div>
              <div class="grid-item">
                <q-img :src="localImages[3]" class="full-height bordered-image" fit="cover" />
              </div>
            </div>
          </div>
        </div>

        <div class="row justify-between q-gutter-md q-mt-xl">
          <div>
            <q-btn
              flat
              label="Kembali"
              no-caps
              class="btn-kembali q-ml-sm"
              @click="goBack"
            />
          </div>

          <div class="row q-gutter-sm">
            <q-btn
              unelevated
              label="Edit"
              class="btn-edit q-px-xl text-weight-bold"
              no-caps
              @click="editEquipment"
            />
            <q-btn
              unelevated
              label="Hapus"
              class="btn-hapus q-px-xl text-weight-bold"
              no-caps
              @click="showConfirmDelete = true"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Confirmation Popup -->
    <q-dialog v-model="showConfirmDelete" persistent>
      <q-card class="dialog-card q-pa-lg text-center">
        <q-btn icon="close" flat round dense v-close-popup class="close-btn text-grey-6" />

        <q-card-section class="q-pt-md">
          <q-img
            src="../../assets/popup/hapus.png"
            style="width: 150px; height: auto"
            class="q-mb-md"
          />

          <div class="text-h6 text-weight-bolder q-mb-sm">Apakah Anda yakin ingin melanjutkan?</div>
          <div class="text-body2 text-grey-8">
            Data alat gym yang dihapus tidak dapat dipulihkan.
          </div>
        </q-card-section>

        <q-card-actions align="center" class="q-pb-md q-gutter-x-md">
          <q-btn
            flat
            label="Batal"
            v-close-popup
            class="btn-action-dialog btn-batal-dialog"
            no-caps
          />
          <q-btn
            unelevated
            label="Ya, Hapus Data"
            class="btn-action-dialog btn-konfirmasi-dialog"
            no-caps
            @click="confirmDelete"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
const localImages = [
  new URL('../../assets/alatgym/alat1.jpeg', import.meta.url).href,
  new URL('../../assets/alatgym/alat2.jpeg', import.meta.url).href,
  new URL('../../assets/alatgym/alat3.jpeg', import.meta.url).href,
  new URL('../../assets/alatgym/alat4.jpeg', import.meta.url).href
]

import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const showConfirmDelete = ref(false)

const equipment = reactive({
  id: null,
  name: 'Loading...',
  qty: 0,
  status: '-',
  images: [],
  imagesPreview: []
})

// add this handler so detail page can reload when edit page dispatches an update
const handleUpdate = () => {
  const id = route.params.id ? String(route.params.id) : null
  if (id) loadData(id)
}

onMounted(() => {
  const id = route.params.id ? String(route.params.id) : null
  if (id) {
    equipment.id = id
    loadData(id)
  }
  window.addEventListener('equipments:updated', handleUpdate)
})

onBeforeUnmount(() => {
  window.removeEventListener('equipments:updated', handleUpdate)
})

const loadData = (id) => {
  try {
    const raw = localStorage.getItem('equipments')
    if (raw) {
      const list = JSON.parse(raw)
      const found = list.find(e => String(e.id) === String(id))
      if (found) {
        equipment.name = found.name || 'Alat Gym'
        equipment.qty = Number(found.qty) || 0
        equipment.status = found.status || 'Baik'
        equipment.images = Array.isArray(found.images) ? found.images : []
        equipment.imagesPreview = equipment.images.length > 0 ? found.images : []
      }
    }
  } catch {
    console.error('Failed to parse localStorage data')
  }
}

const goBack = () => router.back()

const editEquipment = () => {
  router.push({ path: `/info/alat/edit/${equipment.id}` })
}

const deleteEquipment = () => {
  try {
    const raw = localStorage.getItem('equipments')
    if (raw) {
      let list = JSON.parse(raw)
      list = list.filter(e => String(e.id) !== String(equipment.id))

      localStorage.setItem('equipments', JSON.stringify(list))

      $q.notify({
        message: 'Data alat berhasil dihapus',
        color: 'positive',
        icon: 'check'
      })

      router.push('/info')
    }
  } catch (err) {
    $q.notify({
      message: 'Gagal menghapus data',
      color: 'negative'
    })
    console.error(err)
  }
}

const confirmDelete = () => {
  showConfirmDelete.value = false
  setTimeout(() => {
    deleteEquipment()
  }, 150)
}
</script>

<style scoped lang="scss">
.bordered-box {
  border: 1px solid #ccc;
  border-radius: 8px;
  min-height: 40px;
  display: flex;
  align-items: center;
  padding: 0 12px;
}

.video-wrapper {
  border: 1px solid #ccc;
  height: 400px;
  overflow: hidden;
}

.image-grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 8px;
  height: 400px;
}

.grid-item {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.bordered-image {
  border: 2px solid #ddd;
  border-radius: 8px;
  transition: transform 0.2s ease-in-out;
}

.bordered-image:hover {
  transform: scale(1.05);
  border-color: #bbb;
}

.btn-kembali {
  background-color: #0c0c0c;
  color: white;
  border-radius: 8px;
  min-width: 100px;
}

.btn-edit {
  background-color: #2563eb;
  color: white;
  border-radius: 8px;
}

.btn-hapus {
  background-color: #ef4444;
  color: white;
  border-radius: 8px;
}

.dialog-card {
  width: 100%;
  max-width: 450px;
  border-radius: 20px;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #f0f0f0;
}

.btn-action-dialog {
  width: 140px;
  height: 44px;
  border-radius: 12px;
  font-weight: bold;
}

.btn-batal-dialog {
  background: #f0f0f0;
  color: black;
}

.btn-konfirmasi-dialog {
  background: linear-gradient(to bottom, #a0a0a0, #666666);
  color: white;
}
</style>
