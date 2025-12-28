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
            <q-input
              outlined
              dense
              v-model="equipment.name"
              class="bg-white rounded-input"
            />
          </div>

          <div class="col-12 col-md-4">
            <div class="text-subtitle1 text-weight-bold q-mb-sm">Jumlah</div>
            <q-input
              outlined
              dense
              type="number"
              v-model="equipment.qty"
              class="bg-white rounded-input"
            />
          </div>

          <div class="col-12 col-md-4">
            <div class="text-subtitle1 text-weight-bold q-mb-sm">Status</div>
            <q-select
              outlined
              dense
              v-model="equipment.status"
              :options="statusOptions"
              class="bg-white rounded-input"
            >
              <template v-slot:append>
                <q-icon name="expand_more" />
              </template>
            </q-select>
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-img
              :src="equipment.images[0] || 'https://via.placeholder.com/600x400?text=Bench+Press'"
              class="rounded-borders full-height"
              style="border: 1px solid #ccc; min-height: 300px;"
              fit="contain"
            />
          </div>

          <div class="col-12 col-md-6">
            <div class="row q-col-gutter-sm">
              <div v-for="(img, idx) in equipment.imagesPreview" :key="idx" class="col-6">
                <q-img
                  :src="img"
                  class="rounded-borders"
                  style="border: 1px solid #ccc; aspect-ratio: 16/9;"
                  fit="contain"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="row justify-between q-gutter-md q-mt-xl">
          <div>
            <q-btn flat label="Kembali" class="q-ml-sm" @click="goBack" />
          </div>

          <div>
            <q-btn
              unelevated
              label="Edit"
              color="primary"
              class="q-px-xl text-weight-bold q-mr-sm"
              no-caps
              @click="editEquipment"
            />
            <q-btn
              unelevated
              label="Hapus"
              color="negative"
              class="q-px-xl text-weight-bold"
              no-caps
              @click="deleteEquipment"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const equipment = reactive({
  id: null,
  name: 'Alat 1',
  qty: 10,
  status: 'Baik',
  images: [
    'https://via.placeholder.com/600x400?text=Bench+Press'
  ],
  imagesPreview: []
})

const statusOptions = [
  'Baik',
  'Butuh Perawatan',
  'Rusak'
]

onMounted(() => {
  const rawId = route.params.id
  const id = rawId !== undefined && rawId !== null ? String(rawId) : null
  if (id) {
    equipment.id = id
  }

  try {
    const raw = localStorage.getItem('equipments')
    if (raw) {
      const list = JSON.parse(raw)
      const found = list.find(e => String(e.id) === String(id))
      if (found) {
        equipment.id = found.id ?? equipment.id
        equipment.name = found.name ?? equipment.name
        equipment.qty = Number(found.qty) || equipment.qty
        equipment.status = found.status ?? equipment.status
        equipment.images = Array.isArray(found.images) && found.images.length ? found.images : equipment.images
      }
    }
  } catch (err) {
    // keep defaults if parse fails
    console.warn('Cannot load equipments from localStorage', err)
  }

  // ensure arrays exist and prepare images preview
  if (!Array.isArray(equipment.images)) equipment.images = []
  equipment.imagesPreview = equipment.images.length
    ? equipment.images
    : ['https://via.placeholder.com/400x225']
})

const goBack = () => router.back()

const editEquipment = () => {
  if (!equipment.id) {
    $q.notify({ message: 'ID alat tidak tersedia', color: 'negative' })
    return
  }
  // navigate to the edit route for this equipment id
  router.push({ path: `/info/alat/edit/${equipment.id}` })
}

const deleteEquipment = () => {
  $q.dialog({
    title: 'Konfirmasi',
    message: `Hapus alat "${equipment.name}"?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    try {
      const raw = localStorage.getItem('equipments')
      if (raw) {
        let list = JSON.parse(raw)
        list = list.filter(e => String(e.id) !== String(equipment.id))
        localStorage.setItem('equipments', JSON.stringify(list))
      }
    } catch (err) {
      console.warn('Gagal menghapus dari localStorage', err)
    }

    $q.notify({ message: 'Alat dihapus', color: 'positive' })
    router.back()
  }).onCancel(() => {
    // cancelled
  })
}
</script>

<style scoped lang="scss">
.rounded-input {
  :deep(.q-field__control) {
    border-radius: 8px;
    // Menyesuaikan ketebalan border agar mirip desain
    border: 1.5px solid #000;
  }
}

// Changed deep selector to target pseudo-element reliably in scoped styles
:deep(.q-field--outlined) .q-field__control::before {
  border: 1.5px solid #000;
}

.text-subtitle1 {
  color: #000;
}
</style>
