<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="q-mb-md text-h5 text-weight-bold">Informasi & Fasilitas</div>

    <q-card flat class="rounded-borders shadow-1 q-mb-lg">
      <q-card-section class="q-pa-lg">
        <div class="text-h6 text-weight-bold q-mb-md">Uget Uget Gym</div>

        <div class="q-gutter-y-sm text-body2">
          <p>
            <strong>Lokasi:</strong> Jl. Telekomunikasi Terusan Buahbatu No.1, Sukapura, Kec.
            Dayeuhkolot, Kabupaten Bandung, Jawa Barat 40257
          </p>
          <p>
            <strong>Jam Operasional:</strong> Senin - Jumat: 06:00 - 22:00, Sabtu - Minggu: 08:00 -
            18:00
          </p>
          <p class="text-grey-8 line-height-relaxed">
            <strong>Deskripsi:</strong> Uget Uget Gym menawarkan peralatan canggih, berbagai kelas
            kebugaran, dan pelatih ahli untuk membantu Anda mencapai tujuan kebugaran Anda. Dengan
            pilihan keanggotaan fleksibel dan suasana yang memotivasi, ini adalah tempat sempurna
            untuk memulai perjalanan kebugaran Anda.
          </p>
        </div>

        <div class="row q-gutter-sm q-mt-md">
          <q-chip
            v-for="tag in tags"
            :key="tag"
            label
            :content-class="'bg-indigo-1 text-indigo-9'"
            size="sm"
            class="text-weight-medium"
          >
            {{ tag }}
          </q-chip>
        </div>

        <div class="text-subtitle1 text-weight-bold q-mt-xl q-mb-md">Paket Berlangganan</div>
        <div class="row q-col-gutter-md">
          <div v-for="plan in subscriptionPlans" :key="plan.title" class="col-12 col-sm-4 col-md-3">
            <q-card flat bordered class="bg-grey-1 full-height">
              <q-card-section>
                <div class="text-weight-bold">{{ plan.title }}</div>
                <div class="text-h6 text-weight-bolder q-mt-sm">
                  {{ plan.price }} <span class="text-caption text-weight-regular">/bulan</span>
                </div>
                <q-list dense class="q-mt-sm">
                  <q-item
                    v-for="feature in plan.features"
                    :key="feature"
                    class="q-px-none min-height-auto"
                  >
                    <q-item-section side class="q-pr-xs">
                      <q-icon name="check" size="14px" color="positive" />
                    </q-item-section>
                    <q-item-section class="text-caption">{{ feature }}</q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-sm-4 col-md-3">
            <div class="plan-add-box flex flex-center" @click="addPlan">
              <q-icon name="add" size="lg" color="grey-5" />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card flat class="rounded-borders shadow-1">
      <q-card-section class="q-pa-lg">
        <div class="text-h6 text-weight-bold q-mb-md">Fasilitas</div>

        <div class="row q-col-gutter-md q-mb-lg items-center">
          <div class="col-12 col-sm-9">
            <q-input outlined dense v-model="search" placeholder="Cari alat..." class="bg-white">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-3 text-right">
            <q-btn
              unelevated
              color="slate-dark"
              class="full-width btn-dark-custom"
              label="Tambah"
              @click="addEquipment"
            />
          </div>
        </div>

        <q-table
          flat
          :rows="equipments"
          :columns="columns"
          row-key="id"
          :filter="search"
          class="equipment-table"
        >
          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="text-right">
              <q-btn
                unelevated
                dense
                color="primary"
                label="Edit"
                class="q-px-md q-mr-sm"
                @click="editEquipment(props.row)"
              />
              <q-btn
                unelevated
                dense
                color="negative"
                label="Hapus"
                class="q-px-md"
                @click="deleteEquipment(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const search = ref('')

const tags = ['Pilates', 'Kardio', 'Sauna']

const subscriptionPlans = ref([
  {
    title: 'Paket Basic',
    price: 'Rp 250.000',
    features: ['Akses Gym Dasar', '2x Kelas Grup per Minggu', 'Locker Pribadi'],
  },
])

const columns = [
  { name: 'name', align: 'left', label: 'Nama Alat', field: 'name', sortable: true },
  { name: 'actions', align: 'right', label: 'Aksi', field: 'actions' },
]

const equipments = ref([
  { id: 1, name: 'Treadmill' },
  { id: 2, name: 'Dumbbell Set' },
])

// Logic Functions
const addEquipment = () => {
  $q.dialog({
    title: 'Tambah Alat',
    message: 'Masukkan nama alat baru:',
    prompt: { model: '', type: 'text' },
    cancel: true,
  }).onOk((val) => {
    if (val) equipments.value.push({ id: Date.now(), name: val })
  })
}

const editEquipment = (item) => {
  $q.dialog({
    title: 'Edit Alat',
    message: 'Ubah nama alat:',
    prompt: { model: item.name, type: 'text' },
    cancel: true,
  }).onOk((val) => {
    const target = equipments.value.find((e) => e.id === item.id)
    if (target) target.name = val
  })
}

const deleteEquipment = (item) => {
  equipments.value = equipments.value.filter((e) => e.id !== item.id)
}

const addPlan = () => {
  $q.notify({ message: 'Fitur tambah paket segera hadir', color: 'info' })
}
</script>

<style lang="scss" scoped>
.btn-dark-custom {
  background-color: #0f172a !important;
  color: white;
  border-radius: 6px;
  text-transform: none;
}

.plan-add-box {
  height: 100%;
  min-height: 140px;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background-color: #f1f5f9;
  }
}

.equipment-table {
  :deep(thead tr th) {
    font-weight: bold;
    color: #1e293b;
  }
}

.min-height-auto {
  min-height: unset;
}

.line-height-relaxed {
  line-height: 1.6;
}
</style>
