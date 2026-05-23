<template>
  <q-page class="q-pa-lg bg-grey-1">
    <!-- Header Section -->
    <div class="q-mb-xl">
      <h1 class="text-h5 text-weight-bold q-ma-none q-mb-xs">Profil Pengguna</h1>
      <div class="text-grey-7 text-body2">Kelola informasi pribadi dan keamanan akun Anda.</div>
    </div>

    <div class="row q-col-gutter-lg">
      <!-- Left Column: Informasi Profil -->
      <div class="col-12 col-md-7 col-lg-8">
        <q-card flat bordered class="profile-card q-pa-lg">
          <!-- Avatar & Info -->
          <div class="row items-center q-mb-lg">
            <div class="relative-position q-mr-lg">
              <q-avatar size="80px">
                <!-- Ganti src dengan URL foto profil asli -->
                <img src="https://cdn.quasar.dev/img/avatar4.jpg" alt="Foto Profil" />
              </q-avatar>
              <!-- Tombol Edit Avatar -->
              <q-btn
                round
                dense
                color="blue-7"
                icon="edit"
                size="sm"
                class="absolute-bottom-right"
                style="margin-bottom: -2px; margin-right: -2px"
              />
            </div>
            <div>
              <div class="text-subtitle1 text-weight-bold">Foto Profil</div>
              <div class="text-body2 text-grey-7 q-mt-xs" style="max-width: 300px">
                Disarankan menggunakan gambar beresolusi tinggi dengan rasio 1:1.
              </div>
            </div>
          </div>

          <q-separator class="q-my-lg" />

          <!-- Form Biodata -->
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <label class="text-caption text-weight-bold text-grey-9 q-mb-xs block"
                >Nama Lengkap</label
              >
              <q-input
                outlined
                dense
                v-model="profile.namaLengkap"
                placeholder="Masukkan nama lengkap"
                class="bg-white"
              />
            </div>
            <div class="col-12 col-md-6">
              <label class="text-caption text-weight-bold text-grey-9 q-mb-xs block"
                >Username</label
              >
              <q-input
                outlined
                dense
                v-model="profile.username"
                placeholder="Masukkan username"
                class="bg-white"
              />
            </div>
            <div class="col-12 col-md-6">
              <label class="text-caption text-weight-bold text-grey-9 q-mb-xs block">Email</label>
              <q-input
                outlined
                dense
                v-model="profile.email"
                type="email"
                placeholder="Masukkan email"
                class="bg-white"
              />
            </div>
            <div class="col-12 col-md-6">
              <label class="text-caption text-weight-bold text-grey-9 q-mb-xs block"
                >Nomor Telepon</label
              >
              <q-input
                outlined
                dense
                v-model="profile.nomorTelepon"
                placeholder="Masukkan nomor telepon"
                class="bg-white"
              />
            </div>
          </div>

          <!-- Tombol Simpan -->
          <div class="row justify-end q-mt-xl">
            <q-btn
              unelevated
              color="dark"
              label="Simpan Perubahan"
              no-caps
              class="q-px-md radius-8"
              :loading="isSavingProfile"
              @click="simpanProfil"
            />
          </div>
        </q-card>
      </div>

      <!-- Right Column: Ganti Kata Sandi -->
      <div class="col-12 col-md-5 col-lg-4">
        <q-card flat bordered class="profile-card q-pa-lg">
          <!-- Header Card -->
          <div class="row items-center q-mb-md">
            <q-icon name="lock_outline" color="blue-7" size="sm" class="q-mr-sm" />
            <div class="text-subtitle1 text-weight-bold">Ganti Kata Sandi</div>
          </div>

          <q-separator class="q-my-lg" />

          <!-- Form Kata Sandi -->
          <div class="q-mb-md">
            <label class="text-caption text-weight-bold text-grey-9 q-mb-xs block"
              >Kata Sandi Saat Ini</label
            >
            <q-input
              outlined
              dense
              v-model="password.current"
              :type="showCurrentPwd ? 'text' : 'password'"
              placeholder="••••••••"
              class="bg-white"
            >
              <template v-slot:append>
                <q-icon
                  :name="showCurrentPwd ? 'visibility' : 'visibility_off'"
                  class="cursor-pointer"
                  @click="showCurrentPwd = !showCurrentPwd"
                />
              </template>
            </q-input>
          </div>

          <div class="q-mb-md">
            <label class="text-caption text-weight-bold text-grey-9 q-mb-xs block"
              >Kata Sandi Baru</label
            >
            <q-input
              outlined
              dense
              v-model="password.new"
              :type="showNewPwd ? 'text' : 'password'"
              placeholder="Minimal 8 karakter"
              class="bg-white"
            >
              <template v-slot:append>
                <q-icon
                  :name="showNewPwd ? 'visibility' : 'visibility_off'"
                  class="cursor-pointer"
                  @click="showNewPwd = !showNewPwd"
                />
              </template>
            </q-input>
          </div>

          <div class="q-mb-lg">
            <label class="text-caption text-weight-bold text-grey-9 q-mb-xs block"
              >Konfirmasi Kata Sandi Baru</label
            >
            <q-input
              outlined
              dense
              v-model="password.confirm"
              :type="showConfirmPwd ? 'text' : 'password'"
              placeholder="Ketik ulang kata sandi baru"
              class="bg-white"
            >
              <template v-slot:append>
                <q-icon
                  :name="showConfirmPwd ? 'visibility' : 'visibility_off'"
                  class="cursor-pointer"
                  @click="showConfirmPwd = !showConfirmPwd"
                />
              </template>
            </q-input>
          </div>

          <!-- Tombol Perbarui -->
          <div class="q-mt-xl">
            <q-btn
              unelevated
              color="dark"
              class="full-width radius-8"
              label="Perbarui Kata Sandi"
              no-caps
              :loading="isSavingPassword"
              @click="perbaruiPassword"
            />
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useQuasar } from 'quasar'

// Inisialisasi Quasar untuk memanggil fungsi Notifikasi
const $q = useQuasar()

// State untuk Data Profil
const profile = reactive({
  namaLengkap: 'Budi Santoso',
  username: 'budisantoso_admin',
  email: 'budi.admin@chainfit.com',
  nomorTelepon: '+62 812 3456 7890',
})

// State untuk Form Password
const password = reactive({
  current: 'password123',
  new: '',
  confirm: '',
})

// State UI (Loading & Visibility)
const showCurrentPwd = ref(false)
const showNewPwd = ref(false)
const showConfirmPwd = ref(false)

const isSavingProfile = ref(false)
const isSavingPassword = ref(false)

// Fungsi Action: Simpan Profil
const simpanProfil = async () => {
  isSavingProfile.value = true

  try {
    // 1. Simulasi request ke backend (Ganti ini dengan request Axios ke Laravel nanti)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // 2. Jika sukses, tampilkan notifikasi hijau (positive)
    $q.notify({
      type: 'positive',
      message: 'Profil berhasil diperbarui.',
      position: 'top',
      icon: 'check_circle',
    })
  } catch (error) {
    // Menambahkan log ke console agar variabel 'error' digunakan dan membantu saat debugging API
    console.error('Gagal menyimpan data profil:', error)

    // 3. Jika gagal, tampilkan notifikasi merah (negative)
    $q.notify({
      type: 'negative',
      message: 'Gagal menyimpan profil. Silakan coba lagi.',
      position: 'top',
      icon: 'report_problem',
    })
  } finally {
    isSavingProfile.value = false
  }
}

// Fungsi Action: Perbarui Password
const perbaruiPassword = async () => {
  // Validasi sederhana sebelum kirim ke API
  if (password.new !== password.confirm) {
    $q.notify({
      type: 'warning',
      message: 'Kata sandi baru dan konfirmasi tidak cocok!',
      position: 'top',
    })
    return
  }

  isSavingPassword.value = true

  try {
    // Simulasi request API
    await new Promise((resolve) => setTimeout(resolve, 1500))

    $q.notify({
      type: 'positive',
      message: 'Kata sandi berhasil diperbarui.',
      position: 'top',
      icon: 'check_circle',
    })

    // Kosongkan form setelah sukses
    password.new = ''
    password.confirm = ''
  } catch (error) {
    // Menambahkan log ke console agar variabel 'error' digunakan
    console.error('Gagal menyimpan password baru:', error)

    $q.notify({
      type: 'negative',
      message: 'Gagal memperbarui kata sandi.',
      position: 'top',
    })
  } finally {
    isSavingPassword.value = false
  }
}
</script>

<style scoped>
.profile-card {
  border-radius: 8px;
  border-color: #e0e0e0;
}

.radius-8 {
  border-radius: 8px;
}

.block {
  display: block;
}
</style>
