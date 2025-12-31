<template>
  <q-page class="q-pa-lg flex flex-center bg-grey-2">
    <div class="full-width" style="max-width: 1000px">
      <q-card flat bordered class="q-pa-md q-pa-md-xl shadow-1 rounded-borders bg-white">
        <div class="text-h5 text-center text-weight-bold q-mb-xl text-dark">
          Pendaftaran Gym Baru
        </div>

        <q-form @submit="onSubmit" class="row q-col-gutter-xl">
          <div class="col-12 col-md-6">
            <div class="text-subtitle2 q-mb-xs">Nama</div>
            <q-input
              outlined
              dense
              v-model="form.nama"
              placeholder="Urban Gym"
              lazy-rules
              :rules="[(val) => !!val || 'Wajib diisi']"
            />

            <div class="text-subtitle2 q-mt-md q-mb-xs">Lokasi</div>
            <q-input
              outlined
              dense
              v-model="form.lokasi"
              placeholder="Jl. Telekomunikasi No.20..."
            />

            <div class="map-box q-mt-sm rounded-borders overflow-hidden border-grey">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.307449221226!2d107.6291!3d-6.973!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNTgnMjIuOCJTIDEwN8KwMzcnNDQuOCJF!5e0!3m2!1sen!2sid!4v1"
                width="100%"
                height="200"
                style="border: 0"
                allowfullscreen
                loading="lazy"
              ></iframe>
            </div>

            <div class="text-subtitle2 q-mt-md q-mb-xs">Catatan</div>
            <q-input
              outlined
              dense
              type="textarea"
              v-model="form.catatan"
              placeholder="Hari Jumat tutup sementara..."
              rows="3"
            />

            <div class="text-subtitle2 q-mt-md q-mb-xs">Tag</div>
            <q-input outlined dense v-model="form.tag" placeholder="Kardio, Pilates, Sauna" />

            <div class="text-subtitle2 q-mt-md q-mb-xs">Paket Langganan</div>
            <div class="paket-add-box flex flex-center cursor-pointer" @click="addPaket">
              <q-icon name="add" size="lg" />
              <div class="text-caption q-mt-xs">Tambah Paket</div>
            </div>
          </div>

          <div class="col-12 col-md-6">
            <div class="text-subtitle2 q-mb-sm">Jam Operasional</div>
            <div class="operational-container q-pa-sm rounded-borders bg-grey-1">
              <div v-for="day in operationalDays" :key="day.name" class="row items-center q-mb-sm">
                <q-checkbox v-model="day.active" :label="day.name" class="col-4" dense />
                <div class="col-8 row items-center no-wrap q-gutter-xs" v-if="day.active">
                  <q-input outlined dense v-model="day.open" type="time" bg-color="white" />
                  <span class="text-grey-7">-</span>
                  <q-input outlined dense v-model="day.close" type="time" bg-color="white" />
                </div>
                <div class="col-8 text-grey-5 q-pl-md text-italic" v-else>Tutup</div>
              </div>
            </div>

            <q-checkbox v-model="form.liburBuka" label="Buka pada Tanggal Merah" class="q-mt-sm" />

            <div class="text-subtitle2 q-mt-xl q-mb-xs">Foto Gym</div>
            <q-file outlined dense v-model="form.foto" label="Pilih File Foto">
              <template v-slot:prepend>
                <q-icon name="cloud_upload" />
              </template>
            </q-file>
          </div>

          <div class="col-12 q-mt-xl row justify-end q-gutter-sm">
            <q-btn label="Batal" flat color="grey-7" class="q-px-lg" @click="$router.back()" />
            <q-btn label="Daftar Sekarang" color="dark" type="submit" unelevated class="q-px-xl" />
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
  { name: 'Senin', active: true, open: '08:30', close: '21:00' },
  { name: 'Selasa', active: true, open: '08:30', close: '21:00' },
  { name: 'Rabu', active: false, open: '08:30', close: '21:00' },
  { name: 'Kamis', active: false, open: '08:30', close: '21:00' },
  { name: 'Jumat', active: true, open: '08:30', close: '21:00' },
  { name: 'Sabtu', active: true, open: '08:30', close: '21:00' },
  { name: 'Minggu', active: true, open: '08:30', close: '21:00' },
])

const onSubmit = () => {
  $q.notify({
    message: 'Data gym berhasil didaftarkan!',
    color: 'positive',
    icon: 'check_circle',
    position: 'top',
  })
}

const addPaket = () => {
  $q.dialog({
    title: 'Paket Baru',
    message: 'Masukkan detail paket langganan baru:',
    prompt: { model: '', type: 'text' },
    cancel: true,
    persistent: true,
  })
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 12px;
}

.border-grey {
  border: 1px solid #e2e8f0;
}

.map-box {
  background: #eee;
}

.paket-add-box {
  width: 100%;
  max-width: 250px;
  height: 120px;
  border: 2px dashed #cbd5e1;
  color: #64748b;
  border-radius: 12px;
  transition: all 0.3s ease;
  flex-direction: column;
}

.paket-add-box:hover {
  background: #f1f5f9;
  border-color: #0f172a;
  color: #0f172a;
}

.operational-container {
  border: 1px solid #edf2f7;
}

/* Memastikan tampilan input jam tidak terlalu lebar */
input[type='time'] {
  min-width: 100px;
}
</style>
