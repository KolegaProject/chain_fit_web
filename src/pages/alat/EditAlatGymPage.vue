<template>
  <q-page class="q-pa-lg bg-grey-2">
    <!-- HEADER -->
    <q-card flat class="rounded-borders q-mb-lg bg-white shadow-1 custom-card">
      <q-card-section class="header-height q-pa-md row items-center">
        <div style="width: 42px" class="row items-center justify-start">
          <q-btn flat round icon="arrow_back" color="grey-7" size="md" dense @click="goBack" />
        </div>
        <q-icon name="fitness_center" color="dark" size="32px" class="q-mr-md" />
        <div class="text-h5 text-weight-bold text-dark">Edit Gym Equipment</div>
      </q-card-section>
    </q-card>

    <!-- FORM -->
    <q-card flat class="rounded-borders shadow-1 custom-card">
      <q-card-section class="q-pa-xl">
        <div class="row q-col-gutter-lg q-mb-xl">
          <div class="col-12 col-md-4">
            <div class="text-subtitle2 text-weight-bold text-dark q-mb-xs">Equipment Name</div>
            <q-input
              outlined
              dense
              v-model="equipment.name"
              class="bg-white custom-input"
            />
          </div>

          <div class="col-12 col-md-4">
            <div class="text-subtitle2 text-weight-bold text-dark q-mb-xs">Quantity</div>
            <q-input
              outlined
              dense
              type="number"
              v-model="equipment.qty"
              class="bg-white custom-input"
            />
          </div>

          <div class="col-12 col-md-4">
            <div class="text-subtitle2 text-weight-bold text-dark q-mb-xs">Condition Status</div>
            <q-select
              outlined
              dense
              v-model="equipment.status"
              :options="statusOptions"
              class="bg-white custom-input"
            >
              <template v-slot:append>
                <q-icon name="expand_more" />
              </template>
            </q-select>
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <!-- Video Section -->
          <div class="col-12 col-md-6">
            <div class="text-subtitle2 text-weight-bold text-dark q-mb-sm">Videos</div>
            <div class="media-grid media-grid--video">
              <div class="media-item custom-card" v-for="i in 4" :key="'vid-' + i">
                <template v-if="equipment.videos && equipment.videos[i-1]">
                  <div class="media-wrap">
                    <video controls :src="equipment.videos[i-1]" class="media-element" />
                    <div class="media-overlay">
                      <q-btn dense round flat icon="edit" color="white" @click="editMedia('video', i-1)" />
                      <q-btn dense round flat icon="delete" color="negative" @click="removeMedia('video', i-1)" />
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="media-placeholder flex flex-center cursor-pointer" @click="uploadMedia('video', i-1)">
                    <div class="text-center">
                      <q-icon name="add_circle_outline" size="28px" color="grey-6" />
                      <div class="text-caption text-grey-8 q-mt-xs">Add Video</div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <!-- Image Section -->
          <div class="col-12 col-md-6">
            <div class="text-subtitle2 text-weight-bold text-dark q-mb-sm">Photos</div>
            <div class="media-grid media-grid--image">
              <div class="media-item custom-card" v-for="i in 4" :key="'img-' + i">
                <template v-if="equipment.images && equipment.images[i-1]">
                  <div class="media-wrap">
                    <q-img :src="equipment.images[i-1]" class="media-element" fit="cover" />
                    <div class="media-overlay">
                      <q-btn dense round flat icon="edit" color="white" @click="editMedia('foto', i-1)" />
                      <q-btn dense round flat icon="delete" color="negative" @click="removeMedia('foto', i-1)" />
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="media-placeholder flex flex-center cursor-pointer" @click="uploadMedia('foto', i-1)">
                    <div class="text-center">
                      <q-icon name="add_photo_alternate" size="28px" color="grey-6" />
                      <div class="text-caption text-grey-8 q-mt-xs">Add Photo</div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>

        <q-separator class="q-my-xl" />

        <!-- Action Buttons -->
        <div class="row justify-end q-gutter-md">
          <q-btn
            flat
            label="Cancel"
            no-caps
            class="btn-cancel"
            @click="goBack"
          />
          <q-btn
            unelevated
            label="Save Changes"
            class="btn-save"
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
  name: '',
  qty: 1,
  status: 'Good',
  images: [],
  videos: []
})

// Translated status options
const statusOptions = ['Good', 'Needs Maintenance', 'Damaged']

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
          // Map old Indonesian status to English if needed
          if (found.status === 'Baik') equipment.status = 'Good'
          else if (found.status === 'Butuh Perawatan') equipment.status = 'Needs Maintenance'
          else if (found.status === 'Rusak') equipment.status = 'Damaged'
          else equipment.status = found.status ?? equipment.status

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
  $q.notify({ message: `${label} added successfully`, color: 'positive', position: 'top' })
}

const editMedia = (type, idx) => {
  const current = type === 'foto' ? equipment.images[idx] : equipment.videos[idx]
  const label = type === 'foto' ? 'image' : 'video'
  const url = window.prompt(`Edit ${label} URL (leave empty to cancel):`, current || '')
  if (!url) return
  if (type === 'foto') equipment.images[idx] = url
  else equipment.videos[idx] = url
  $q.notify({ message: `${label} updated`, color: 'positive', position: 'top' })
}

const removeMedia = (type, idx) => {
  if (type === 'foto') {
    equipment.images.splice(idx, 1)
    equipment.images = equipment.images.slice(0,4)
  } else {
    equipment.videos.splice(idx, 1)
    equipment.videos = equipment.videos.slice(0,4)
  }
  $q.notify({ message: 'Media removed', color: 'positive', position: 'top' })
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

    $q.notify({ message: 'Equipment data updated successfully!', color: 'positive', icon: 'check_circle', position: 'top' })

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
    $q.notify({ message: 'Failed to save equipment data', color: 'negative', icon: 'error', position: 'top' })
  }
}

const goBack = () => {
  router.back()
}
</script>

<style scoped lang="scss">
.header-height {
  height: 68px;
}

.custom-card {
  border-radius: 8px;
  border: 1px solid #f3f4f6;
}

.custom-input {
  :deep(.q-field__control) {
    border-radius: 4px;
  }
  :deep(.q-field__control:before) {
    border-color: #e5e7eb;
  }
}

/* Button Styling (Konsisten dengan Dark Navy Design) */
.btn-cancel {
  min-width: 120px;
  color: #4b5563;
  border-radius: 4px;
  font-weight: 500;
}

.btn-save {
  min-width: 180px;
  background-color: #111827 !important;
  color: white;
  border-radius: 4px;
  font-weight: 500;
  height: 44px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #1f2937 !important;
  }
}

/* Media Grid & Items */
.media-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 16px;
}

.media-item {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e7eb;
}

.media-element {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  border: 1px dashed #d1d5db;
  border-radius: 4px;
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    border-color: #9ca3af;
  }
}

.media-wrap {
  width: 100%;
  height: 100%;
  position: relative;
  display: block;
}

.media-overlay {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 8px;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background for better button visibility */
  border-radius: 20px;
  padding: 4px;
}

.shadow-1 {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03) !important;
}
</style>
