<template>
  <q-page class="q-pa-lg bg-grey-2">
    <q-card flat class="rounded-borders shadow-1 q-pa-md">
      <q-card-section>
        <div class="row items-center justify-end q-mb-lg">
          <q-btn
            unelevated
            label="Simpan"
            no-caps
            class="btn-save q-px-xl text-weight-bold"
            @click="saveChanges"
          />
        </div>

        <div class="q-gutter-y-lg">
          <div class="input-group">
            <div class="text-subtitle1 text-weight-bold q-mb-xs">Nama Gym</div>
            <q-input
              outlined
              dense
              v-model="gymData.name"
              placeholder="Masukkan nama gym"
              class="bg-white custom-input"
            />
          </div>

          <div class="input-group">
            <div class="text-subtitle1 text-weight-bold q-mb-xs">Lokasi</div>
            <q-input
              outlined
              dense
              v-model="gymData.location"
              placeholder="Masukkan lokasi"
              class="bg-white custom-input"
            />
          </div>

          <div class="input-group">
            <div class="text-subtitle1 text-weight-bold q-mb-xs">Jam Operasional</div>
            <q-input
              outlined
              dense
              v-model="gymData.operationalHours"
              placeholder="Contoh: Senin - Jumat: 06:00 - 22:00"
              class="bg-white custom-input"
            />
          </div>

          <div class="input-group">
            <div class="text-subtitle1 text-weight-bold q-mb-xs">Deskripsi</div>
            <q-input
              outlined
              type="textarea"
              v-model="gymData.description"
              placeholder="Masukkan deskripsi lengkap gym..."
              class="bg-white custom-input"
              rows="5"
            />
          </div>

          <div class="input-group">
            <div class="text-subtitle1 text-weight-bold q-mb-xs">Tag</div>
            <div class="row q-gutter-sm q-mb-sm">
              <q-chip
                v-for="(tag, index) in gymData.tags"
                :key="index"
                removable
                @remove="removeTag(index)"
                square
                color="grey-8"
                text-color="white"
                class="q-px-md"
              >
                {{ tag }}
              </q-chip>
            </div>

            <div class="row items-center q-gutter-x-md">
              <div class="text-body1 text-weight-medium">Tags</div>
              <q-input
                outlined
                dense
                v-model="newTag"
                placeholder="Tambah tag baru"
                class="bg-white col-4"
                @keyup.enter="addTag"
              />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const newTag = ref('')

const gymData = reactive({
  name: 'Urban Gym',
  location:
    'Jl. Telekomunikasi Terusan Buahbatu No.1, Sukapura, Kec. Dayeuhkolot, Kabupaten Bandung, Jawa Barat 40257',
  operationalHours: 'Senin - Jumat: 06:00 - 22:00, Sabtu - Minggu: 08:00 - 18:00',
  description:
    'Uget Uget Gym menawarkan peralatan canggih, berbagai kelas kebugaran, dan pelatih ahli untuk membantu Anda mencapai tujuan kebugaran Anda. Dengan pilihan keanggotaan yang fleksibel dan suasana yang memotivasi, ini adalah tempat yang sempurna untuk memulai atau melanjutkan perjalanan kebugaran Anda. Rasakan pengalaman latihan yang inovatif dan komunitas yang mendukung.',
  tags: ['Pilates', 'Sauna', 'GymBro'],
})

const addTag = () => {
  if (newTag.value.trim() !== '') {
    gymData.tags.push(newTag.value.trim())
    newTag.value = ''
  }
}

const removeTag = (index) => {
  gymData.tags.splice(index, 1)
}

const saveChanges = () => {
  $q.notify({
    message: 'Data berhasil disimpan!',
    color: 'positive',
    icon: 'check',
    position: 'top',
  })
  console.log('Saved Data:', gymData)
}
</script>

<style scoped lang="scss">
.custom-input {
  :deep(.q-field__control) {
    border-radius: 8px;
  }
}

.input-group {
  .text-subtitle1 {
    color: #1a1a1a;
  }
}

:deep(.q-textarea .q-field__native) {
  line-height: 1.6;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #f0f0f0;
}

.btn-save {
  background: #0a0f1f;
  color: #fff;
  border-radius: 8px;
  height: 40px;
  font-weight: 700;
  text-transform: none;
}

</style>
