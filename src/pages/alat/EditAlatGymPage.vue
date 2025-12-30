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
          <div v-for="n in 6" :key="n" class="col-6 col-sm-3">
            <q-img
              :src="equipment.imageUrl"
              class="rounded-borders border-grey"
              style="aspect-ratio: 4/3;"
            />
          </div>

          <div class="col-6 col-sm-3">
            <div class="media-placeholder flex flex-center cursor-pointer" @click="uploadMedia('video')">
              <div class="text-center">
                <q-icon name="add" size="24px" color="grey-7" />
                <div class="text-caption text-grey-8">Tambah Video</div>
              </div>
            </div>
          </div>

          <div class="col-6 col-sm-3">
            <div class="media-placeholder flex flex-center cursor-pointer" @click="uploadMedia('foto')">
              <div class="text-center">
                <q-icon name="add" size="24px" color="grey-7" />
                <div class="text-caption text-grey-8">Tambah Foto</div>
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
  imageUrl: 'https://via.placeholder.com/300x200?text=Gym+Equipment'
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
          equipment.imageUrl = (Array.isArray(found.images) && found.images[0]) || found.imageUrl
        }
      }
    } catch (err) {
      console.warn('Failed to load equipment for edit', err)
    }
  }
})

const uploadMedia = (type) => {
  $q.notify({ message: `Fitur upload ${type} akan segera hadir`, color: 'grey-8' })
}

const saveData = () => {
  try {
    const raw = localStorage.getItem('equipments')
    const list = raw ? JSON.parse(raw) : []
    if (equipment.id != null) {
      const idx = list.findIndex(e => String(e.id) === String(equipment.id))
      if (idx !== -1) {
        list[idx] = {
          ...list[idx],
          name: equipment.name,
          qty: Number(equipment.qty) || 0,
          status: equipment.status,
          images: [equipment.imageUrl]
        }
      } else {
        list.push({
          id: equipment.id,
          name: equipment.name,
          qty: Number(equipment.qty) || 0,
          status: equipment.status,
          images: [equipment.imageUrl]
        })
      }
    } else {
      const maxId = list.length ? Math.max(...list.map(e => Number(e.id) || 0)) : 0
      const newId = maxId + 1
      list.push({
        id: newId,
        name: equipment.name,
        qty: Number(equipment.qty) || 0,
        status: equipment.status,
        images: [equipment.imageUrl]
      })
      equipment.id = newId
    }
    localStorage.setItem('equipments', JSON.stringify(list))

    $q.notify({ message: 'Data alat berhasil diperbarui!', color: 'positive', icon: 'check' })
    router.push(`/info/alat/${equipment.id}`)
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
    &:before, &:after {
      display: none;
    }
  }
}

.border-grey {
  border: 1.5px solid #000;
}

.media-placeholder {
  aspect-ratio: 4/3;
  background-color: #e0e0e0;
  border: 1.5px solid #000;
  border-radius: 8px;
  transition: background 0.2s;

  &:hover {
    background-color: #d6d6d6;
  }
}

.text-subtitle1 {
  color: #000;
}

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
