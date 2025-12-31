<template>
  <q-page class="q-pa-lg flex flex-center bg-grey-2">
    <div class="full-width" style="max-width: 1100px">
      <q-card flat class="q-pa-md q-pa-md-xl shadow-2 rounded-20 bg-white">
        <q-card-section class="text-center q-pb-xl">
          <div class="text-h5 text-weight-bolder text-dark">Pendaftaran Gym Baru</div>
          <div class="text-caption text-grey-7 q-mt-xs">Lengkapi data di bawah ini untuk mendaftarkan fasilitas gym Anda</div>
        </q-card-section>

        <q-form @submit="onSubmit" class="row q-col-gutter-x-xl q-col-gutter-y-md">
          <div class="col-12 col-md-6">
            <div class="section-title q-mb-md text-weight-bold">Informasi Dasar</div>

            <div class="input-group q-mb-md">
              <label class="custom-label">Nama Gym</label>
              <q-input
                outlined
                dense
                v-model="form.nama"
                placeholder="Contoh: Urban Gym Center"
                bg-color="white"
                :rules="[(val) => !!val || 'Wajib diisi']"
              />
            </div>

            <div class="input-group q-mb-md">
              <label class="custom-label">Lokasi / Alamat</label>
              <q-input
                outlined
                dense
                v-model="form.lokasi"
                placeholder="Masukkan alamat lengkap..."
                bg-color="white"
              >
                <template v-slot:prepend><q-icon name="place" size="xs" /></template>
              </q-input>
            </div>

            <div class="map-box q-mb-md rounded-borders overflow-hidden shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.301708428178!2d107.62912447430588!3d-6.973646368285519!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e9ad06914565%3A0x6734181f0b094191!2sTelkom%20University!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                width="100%"
                height="180"
                style="border: 0"
                allowfullscreen
                loading="lazy"
              ></iframe>
            </div>

            <div class="input-group q-mb-md">
              <label class="custom-label">Tag / Kategori</label>
              <q-input
                outlined
                dense
                v-model="form.tag"
                placeholder="Kardio, Pilates, Sauna (pisahkan dengan koma)"
                bg-color="white"
              />
            </div>

            <div class="input-group">
              <label class="custom-label">Paket Langganan</label>
              <div class="paket-add-box flex flex-center cursor-pointer q-mt-xs" @click="addPaket">
                <q-icon name="add_circle_outline" size="sm" />
                <div class="text-caption text-weight-bold q-mt-xs">Tambah Paket Baru</div>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-6">
            <div class="section-title q-mb-md text-weight-bold">Waktu & Fasilitas</div>

            <label class="custom-label">Jam Operasional</label>
            <div class="operational-container q-pa-md rounded-borders bg-grey-1 q-mt-xs">
              <div v-for="day in operationalDays" :key="day.name" class="row items-center q-mb-sm no-wrap">
                <q-checkbox v-model="day.active" :label="day.name" class="col-4" dense color="dark" />

                <div class="col-8 row items-center no-wrap q-gutter-x-xs" v-if="day.active">
                  <q-input outlined dense v-model="day.open" type="time" bg-color="white" class="time-input" />
                  <span class="text-grey-6">-</span>
                  <q-input outlined dense v-model="day.close" type="time" bg-color="white" class="time-input" />
                </div>
                <div class="col-8 text-grey-5 q-pl-md text-caption text-italic" v-else>Tutup sementara</div>
              </div>
            </div>

            <q-checkbox v-model="form.liburBuka" label="Buka pada Hari Libur Nasional" class="q-mt-sm text-caption" color="dark" />

            <div class="input-group q-mt-lg">
              <label class="custom-label">Catatan Tambahan</label>
              <q-input
                outlined
                dense
                type="textarea"
                v-model="form.catatan"
                placeholder="Contoh: Member wanita hanya hari rabu..."
                rows="2"
                bg-color="white"
              />
            </div>

            <div class="input-group q-mt-md">
              <label class="custom-label">Foto Utama Gym</label>
              <q-file outlined dense v-model="form.foto" label="Klik untuk unggah foto" bg-color="white">
                <template v-slot:prepend>
                  <q-icon name="image" size="xs" />
                </template>
              </q-file>
            </div>
          </div>

          <div class="col-12 q-mt-xl row justify-end q-gutter-md">
            <q-btn label="Batal" flat color="grey-7" class="q-px-lg rounded-8" @click="$router.back()" no-caps />
            <q-btn label="Daftar Sekarang" color="dark" type="submit" unelevated class="q-px-xl rounded-8 text-weight-bold" no-caps />
          </div>
        </q-form>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const form = reactive({
  nama: '',
  lokasi: '',
  catatan: '',
  tag: '',
  foto: null,
  liburBuka: false,
})

const operationalDays = ref([
  { name: 'Senin', active: true, open: '08:00', close: '21:00' },
  { name: 'Selasa', active: true, open: '08:00', close: '21:00' },
  { name: 'Rabu', active: true, open: '08:00', close: '21:00' },
  { name: 'Kamis', active: true, open: '08:00', close: '21:00' },
  { name: 'Jumat', active: true, open: '08:00', close: '21:00' },
  { name: 'Sabtu', active: false, open: '08:00', close: '21:00' },
  { name: 'Minggu', active: false, open: '08:00', close: '21:00' },
])

const onSubmit = () => {
  $q.notify({
    message: 'Pendaftaran Berhasil!',
    caption: 'Data gym Anda sedang diproses.',
    color: 'dark',
    icon: 'done_all',
    position: 'top',
  })
}

const addPaket = () => {
  $q.notify({ message: 'Fitur Tambah Paket akan segera hadir', color: 'info' })
}
</script>

<style scoped>
.rounded-20 {
  border-radius: 20px;
}
.rounded-8 {
  border-radius: 8px;
}

.section-title {
  font-size: 1.1rem;
  color: #1a1a1a;
  border-left: 4px solid #1a1a1a;
  padding-left: 12px;
}

.custom-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 4px;
}

.map-box {
  border: 1px solid #e2e8f0;
}

.paket-add-box {
  width: 100%;
  height: 80px;
  border: 2px dashed #cbd5e1;
  color: #64748b;
  border-radius: 12px;
  transition: all 0.2s ease;
  flex-direction: column;
}

.paket-add-box:hover {
  background: #f8fafc;
  border-color: #1a1a1a;
  color: #1a1a1a;
}

.operational-container {
  border: 1px solid #e2e8f0;
}

.time-input {
  width: 100%;
}

:deep(.q-field--outlined .q-field__control) {
  border-radius: 8px;
}

:deep(.q-field--dense .q-field__control),
:deep(.q-field--dense .q-field__marginal) {
  height: 44px;
}
</style>
