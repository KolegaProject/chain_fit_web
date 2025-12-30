<template>
  <q-page class="q-pa-lg bg-grey-2">
    <q-card flat class="rounded-borders q-pa-xl shadow-1">
      <q-card-section>
        <div class="text-h5 text-weight-bold text-center q-mb-xl">
          Tambah Alat Gym
        </div>

        <div class="row q-col-gutter-lg q-mb-lg">
          <div class="col-12 col-md-4">
            <div class="text-subtitle1 text-weight-bold q-mb-sm">Nama Alat</div>
            <q-input
              outlined
              dense
              v-model="newEquipment.name"
              placeholder="Masukkan nama"
              class="bg-white custom-field"
            />
          </div>

          <div class="col-12 col-md-4">
            <div class="text-subtitle1 text-weight-bold q-mb-sm">Jumlah</div>
            <q-input
              outlined
              dense
              type="number"
              v-model="newEquipment.qty"
              placeholder="0"
              class="bg-white custom-field"
            />
          </div>

          <div class="col-12 col-md-4">
            <div class="text-subtitle1 text-weight-bold q-mb-sm">Status</div>
            <q-select
              outlined
              dense
              v-model="newEquipment.status"
              :options="statusOptions"
              class="bg-white custom-field"
            >
              <template v-slot:append>
                <q-icon name="expand_more" />
              </template>
            </q-select>
          </div>
        </div>

        <div class="row q-col-gutter-md q-mb-xl">
          <div class="col-12 col-md-5">
            <div
              class="upload-box video-upload flex flex-center cursor-pointer"
              @click="triggerUpload('video')"
            >
              <div class="text-center">
                <q-icon name="add" size="32px" color="grey-7" />
                <div class="text-grey-8 text-weight-medium">Tambah Video</div>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-3">
            <div
              class="upload-box photo-upload flex flex-center cursor-pointer"
              @click="triggerUpload('photo')"
            >
              <div class="text-center">
                <q-icon name="add" size="24px" color="grey-7" />
                <div class="text-grey-8 text-weight-medium">Tambah Foto</div>
              </div>
            </div>
          </div>
        </div>

        <div class="row justify-end">
          <q-btn
            unelevated
            label="Batal"
            no-caps
            class="btn-batal q-px-lg q-mr-sm"
            @click="goBack"
          />
          <q-btn
            unelevated
            label="Tambah"
            color="black"
            class="q-px-xl text-weight-bold btn-submit"
            no-caps
            @click="submitEquipment"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { reactive } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()

const newEquipment = reactive({
  name: '',
  qty: 0,
  status: 'Baik',
  images: []
})

const statusOptions = ['Baik', 'Butuh Perawatan', 'Rusak']

const triggerUpload = (type) => {
  $q.notify({
    message: `Membuka galeri untuk ${type}...`,
    color: 'info',
    position: 'top'
  })
}

const submitEquipment = () => {
  if (!newEquipment.name) {
    $q.notify({
      message: 'Nama alat harus diisi',
      color: 'negative',
      position: 'top'
    })
    return
  }

  try {
    const raw = localStorage.getItem('equipments')
    const list = raw ? JSON.parse(raw) : []
    const maxId = list.length ? Math.max(...list.map(e => Number(e.id) || 0)) : 0
    const newId = maxId + 1

    const payload = {
      id: newId,
      name: newEquipment.name,
      qty: Number(newEquipment.qty) || 0,
      status: newEquipment.status,
      images: Array.isArray(newEquipment.images) ? newEquipment.images : []
    }

    list.push(payload)
    localStorage.setItem('equipments', JSON.stringify(list))

    $q.notify({
      message: 'Alat gym berhasil ditambahkan!',
      color: 'positive',
      position: 'top'
    })

    router.push('/info')
  } catch (err) {
    console.error('Failed to save equipment', err)
    $q.notify({
      message: 'Gagal menyimpan data alat',
      color: 'negative',
      position: 'top'
    })
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
    border: 1px solid #000; // Border hitam tegas sesuai desain
    &:before {
      border: none;
    }
    &:after {
      border: none;
    }
  }
}

.upload-box {
  border: 2px solid #9ca3af;
  border-radius: 12px;
  background-color: #e5e7eb;
  transition: all 0.3s ease;

  &:hover {
    background-color: #d1d5db;
    border-color: #6b7280;
  }
}

.video-upload {
  aspect-ratio: 16 / 10;
  max-width: 400px;
}

.photo-upload {
  aspect-ratio: 1 / 1;
  max-width: 200px;
}

.btn-submit {
  border-radius: 8px;
  height: 40px;
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

.text-subtitle1 {
  color: #000;
}
</style>
