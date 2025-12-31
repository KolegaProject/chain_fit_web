<template>
  <q-page class="q-pa-lg bg-grey-2">
    <q-card flat class="rounded-borders q-pa-xl shadow-1">
      <q-card-section>
        <div class="text-h5 text-weight-bold text-center q-mb-xl">
          Edit Alat Gym
        </div>

        <div class="row q-col-gutter-lg q-mb-xl">
          <div class="col-12 col-md-4">
            <div class="text-subtitle1 text-weight-bold q-mb-sm">Nama Alat</div>
            <q-input
              outlined
              dense
              v-model="equipment.name"
              class="bg-white custom-field"
            />
          </div>

          <div class="col-12 col-md-4">
            <div class="text-subtitle1 text-weight-bold q-mb-sm">Jumlah</div>
            <q-input
              outlined
              dense
              type="number"
              v-model="equipment.qty"
              class="bg-white custom-field"
            />
          </div>

          <div class="col-12 col-md-4">
            <div class="text-subtitle1 text-weight-bold q-mb-sm">Status</div>
            <q-select
              outlined
              dense
              v-model="equipment.status"
              :options="statusOptions"
              class="bg-white custom-field"
            >
              <template v-slot:append>
                <q-icon name="expand_more" />
              </template>
            </q-select>
          </div>
        </div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <div class="media-grid media-grid--video">
              <div class="media-item" v-for="i in 4" :key="'vid-' + i">
                <template v-if="equipment.videos && equipment.videos[i-1]">
                  <div class="media-wrap">
                    <video controls :src="equipment.videos[i-1]" class="media-element" />
                    <div class="media-overlay">
                      <q-btn dense round flat icon="edit" color="white" @click="editMedia('video', i-1)" />
                      <q-btn dense round flat icon="delete" color="white" @click="removeMedia('video', i-1)" />
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="media-placeholder flex flex-center cursor-pointer" @click="uploadMedia('video', i-1)">
                    <div class="text-center">
                      <q-icon name="add" size="24px" color="grey-7" />
                      <div class="text-caption text-grey-8 q-mt-sm">Tambah Video</div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <!-- Image grid -->
          <div class="col-12 col-md-6">
            <div class="media-grid media-grid--image">
              <div class="media-item" v-for="i in 4" :key="'img-' + i">
                <template v-if="equipment.images && equipment.images[i-1]">
                  <div class="media-wrap">
                    <q-img :src="equipment.images[i-1]" class="media-element bordered-image" fit="cover" />
                    <div class="media-overlay">
                      <q-btn dense round flat icon="edit" color="white" @click="editMedia('foto', i-1)" />
                      <q-btn dense round flat icon="delete" color="white" @click="removeMedia('foto', i-1)" />
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="media-placeholder flex flex-center cursor-pointer" @click="uploadMedia('foto', i-1)">
                    <div class="text-center">
                      <q-icon name="add" size="24px" color="grey-7" />
                      <div class="text-caption text-grey-8 q-mt-sm">Tambah Foto</div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>

        <div class="row justify-end q-mt-xl">
          <q-btn
            unelevated
            label="Batal"
            no-caps
            class="btn-batal q-px-xl q-mr-sm"
            @click="goBack"
          />
          <q-btn
            unelevated
            label="Simpan"
            color="black"
            class="q-px-xl text-weight-bold rounded-borders"
            no-caps
            @click="saveData"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const equipment = reactive({
  id: null,
  name: 'Alat 1',
  qty: 10,
  status: 'Baik',
  images: [],
  videos: []
})

const statusOptions = ['Baik', 'Butuh Perawatan', 'Rusak']

onMounted(() => {
  const paramId = route.params.id ?? route.query.id
  if (paramId) {
    try {
      const raw = localStorage.getItem('equipments')
      if (raw) {
        const list = JSON.parse(raw)
        const found = list.find(e => String(e.id) === String(paramId))
        if (found) {
          equipment.id = found.id
          equipment.name = found.name ?? equipment.name
          equipment.qty = Number(found.qty) || equipment.qty
          equipment.status = found.status ?? equipment.status
          equipment.images = Array.isArray(found.images) ? found.images.slice(0,4) : []
          equipment.videos = Array.isArray(found.videos) ? found.videos.slice(0,4) : []
        }
      }
    } catch (err) {
      console.warn('Failed to load equipment for edit', err)
    }
  }
})

const uploadMedia = (type, idx) => {
  const label = type === 'foto' ? 'image' : 'video'
  const url = window.prompt(`Paste ${label} URL (or cancel):`)
  if (!url) return
  if (type === 'foto') {
    equipment.images[idx] = url
    equipment.images = equipment.images.filter(Boolean).slice(0,4)
  } else {
    equipment.videos[idx] = url
    equipment.videos = equipment.videos.filter(Boolean).slice(0,4)
  }
  $q.notify({ message: `${label} berhasil ditambahkan`, color: 'positive' })
}

const editMedia = (type, idx) => {
  const current = type === 'foto' ? equipment.images[idx] : equipment.videos[idx]
  const label = type === 'foto' ? 'image' : 'video'
  const url = window.prompt(`Edit ${label} URL (leave empty to cancel):`, current || '')
  if (!url) return
  if (type === 'foto') equipment.images[idx] = url
  else equipment.videos[idx] = url
  $q.notify({ message: `${label} diperbarui`, color: 'positive' })
}

const removeMedia = (type, idx) => {
  if (type === 'foto') {
    equipment.images.splice(idx, 1)
    equipment.images = equipment.images.slice(0,4)
  } else {
    equipment.videos.splice(idx, 1)
    equipment.videos = equipment.videos.slice(0,4)
  }
  $q.notify({ message: 'Media dihapus', color: 'positive' })
}

const saveData = async () => {
  try {
    const raw = localStorage.getItem('equipments')
    const list = raw ? JSON.parse(raw) : []

    const payload = {
      id: equipment.id != null ? equipment.id : Date.now(),
      name: equipment.name,
      qty: Number(equipment.qty) || 0,
      status: equipment.status,
      images: (Array.isArray(equipment.images) ? equipment.images : []).filter(Boolean).slice(0,4),
      videos: (Array.isArray(equipment.videos) ? equipment.videos : []).filter(Boolean).slice(0,4)
    }

    const idx = list.findIndex(e => String(e.id) === String(payload.id))
    if (idx !== -1) list[idx] = { ...list[idx], ...payload }
    else list.push(payload)

    localStorage.setItem('equipments', JSON.stringify(list))

    $q.notify({ message: 'Data alat berhasil diperbarui!', color: 'positive', icon: 'check' })

    try {
      await router.push(`/info/alat/${payload.id}`)
      try { window.dispatchEvent(new Event('equipments:updated')) } catch { /* ignore */ }
    } catch (navErr) {
      console.warn('Navigation failed after save:', navErr)
      try { router.push(`/info/alat/${payload.id}`) } catch { /* ignore */ }
      try { window.dispatchEvent(new Event('equipments:updated')) } catch { /* ignore */ }
    }
  } catch (err) {
    console.error('Failed to save equipment', err)
    $q.notify({ message: 'Gagal menyimpan data alat', color: 'negative' })
  }
}

const goBack = () => {
  router.back()
}
</script>

<style scoped lang="scss">
.custom-field {
  :deep(.q-field__control) {
    border-radius: 8px;
    border: 1.5px solid #000;
    &:before, &:after { display: none; }
  }
}

.border-grey {
  border: 1.5px solid #000;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 12px;
}

.media-item {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
  border-radius: 8px;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.media-element {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.media-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e5e7eb;
  border: 1.5px dashed #9ca3af;
  border-radius: 8px;
  text-align: center;
}

.media-wrap { width:100%; height:100%; position:relative; display:block; }
.media-overlay {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 6px;
}

.bordered-image {
  border: 2px solid #ddd;
  border-radius: 8px;
  transition: transform 0.15s ease-in-out;
}

.bordered-image:hover { transform: scale(1.02); border-color:#ccc; }

.text-subtitle1 { color: #000; }

.btn-batal {
  background-color: #e53935;
  color: white;
  border-radius: 8px;
  height: 40px;
  min-width: 100px;
  font-weight: bold;
  text-transform: none;
}
</style>
