<template>
  <q-layout>
    <q-page-container>
      <q-page class="row">
        <!-- ================= BAGIAN KIRI (GAMBAR) ================= -->
        <div class="col-12 col-md-6 gt-sm relative-position">
          <!-- 👇 Ganti nama file ini dengan gambar wanita angkat beban di asetmu 👇 -->
          <q-img src="../../assets/LoginPage-asset1.jpg" class="full-height-img" fit="cover">
            <div class="absolute-full column justify-between q-pa-xl bg-transparent-overlay">
              <!-- Logo Chain Fit -->
              <div class="logo-wrapper q-pt-md">
                <q-img
                  src="../../assets/ChainFitLogo.png"
                  spinner-color="white"
                  style="height: auto; max-width: 150px"
                />
              </div>

              <!-- Teks Overlay Bawah -->
              <div
                class="text-box q-pa-lg"
                style="
                  border-radius: 8px;
                  background-color: rgba(30, 33, 40, 0.85);
                  border: 1px solid rgba(255, 255, 255, 0.05);
                "
              >
                <p
                  class="text-body1 text-white text-weight-regular q-ma-none"
                  style="line-height: 1.6"
                >
                  Keamanan akun Anda adalah prioritas kami. Pastikan untuk membuat password yang
                  kuat dan unik untuk menjaga keamanan data progres latihan Anda.
                </p>
              </div>
            </div>
          </q-img>
        </div>

        <!-- ================= BAGIAN KANAN (FORM) ================= -->
        <div class="col-12 col-md-6 flex flex-center bg-white">
          <div class="form-container q-pa-lg text-center">
            <!-- Judul & Subjudul -->
            <div class="q-mb-xl">
              <h1 class="text-h4 text-weight-bold q-mb-md text-dark q-mt-none">Ganti Password</h1>
              <p class="text-body1 text-grey-7">Buat password baru yang kuat untuk akun Anda.</p>
            </div>

            <!-- Form -->
            <q-form @submit="handleSimpanPassword" class="q-gutter-y-md text-left">
              <!-- Input Password Baru -->
              <div>
                <label class="text-caption text-weight-bold text-grey-9 q-mb-xs block"
                  >Password Baru</label
                >
                <q-input
                  color="black"
                  outlined
                  v-model="password.new"
                  :type="showNewPwd ? 'text' : 'password'"
                  placeholder="Masukkan password baru"
                  bg-color="white"
                  class="custom-input"
                  required
                >
                  <template #append>
                    <q-icon
                      :name="showNewPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer text-grey-7"
                      @click="showNewPwd = !showNewPwd"
                    />
                  </template>
                </q-input>
                <div class="text-caption text-grey-6 q-mt-xs" style="font-size: 11px">
                  Minimal 8 karakter, kombinasi huruf dan angka.
                </div>
              </div>

              <!-- Input Konfirmasi Password -->
              <div class="q-mt-md">
                <label class="text-caption text-weight-bold text-grey-9 q-mb-xs block"
                  >Konfirmasi Password Baru</label
                >
                <q-input
                  color="black"
                  outlined
                  v-model="password.confirm"
                  :type="showConfirmPwd ? 'text' : 'password'"
                  placeholder="Ulangi password baru"
                  bg-color="white"
                  class="custom-input"
                  required
                >
                  <template #append>
                    <q-icon
                      :name="showConfirmPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer text-grey-7"
                      @click="showConfirmPwd = !showConfirmPwd"
                    />
                  </template>
                </q-input>
              </div>

              <!-- Tombol Simpan -->
              <q-btn
                type="submit"
                label="Simpan Password"
                class="full-width btn-continue q-mt-lg"
                unelevated
                :loading="loading"
              />
            </q-form>

            <q-separator class="q-my-xl bg-transparent" />

            <!-- Tombol Kembali ke Login -->
            <router-link
              to="/login"
              class="text-body2 text-grey-8 no-decoration row items-center justify-center transition-color"
            >
              <q-icon name="arrow_back" size="16px" class="q-mr-sm" />
              Kembali ke Login
            </router-link>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

const loading = ref(false)
const showNewPwd = ref(false)
const showConfirmPwd = ref(false)

const password = reactive({
  new: '',
  confirm: '',
})

const handleSimpanPassword = async () => {
  // Validasi kecocokan password
  if (password.new !== password.confirm) {
    $q.notify({
      message: 'Password baru dan konfirmasi tidak cocok!',
      color: 'warning',
      position: 'top',
    })
    return
  }

  // Validasi minimal 8 karakter (sederhana)
  if (password.new.length < 8) {
    $q.notify({
      message: 'Password minimal 8 karakter.',
      color: 'warning',
      position: 'top',
    })
    return
  }

  loading.value = true
  try {
    // Simulasi request API ke backend
    await new Promise((resolve) => setTimeout(resolve, 1500))

    $q.notify({
      message: 'Password berhasil diubah! Silakan login.',
      color: 'positive',
      icon: 'check_circle',
      position: 'top',
    })

    // Arahkan kembali ke halaman login
    router.push('/login')
  } catch (error) {
    console.error('Gagal reset password:', error)
    $q.notify({
      message: 'Terjadi kesalahan, silakan coba lagi.',
      color: 'negative',
      icon: 'warning',
      position: 'top',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.full-height-img {
  height: 100vh;
  width: 100%;
}

.bg-transparent-overlay {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0.1) 40%,
    rgba(0, 0, 0, 0.6) 100%
  );
}

.form-container {
  width: 100%;
  max-width: 480px;
}

.block {
  display: block;
}

.custom-input {
  :deep(.q-field__control) {
    border-radius: 4px;
  }
  :deep(.q-field__control:before) {
    border-color: #e0e0e0;
  }
}

.btn-continue {
  background-color: #111827 !important;
  color: white;
  text-transform: none;
  border-radius: 4px;
  height: 52px;
  font-size: 16px;
  font-weight: 500;

  &:hover {
    background-color: #1f2937 !important;
  }
}

.no-decoration {
  text-decoration: none;
}

.transition-color {
  transition: color 0.3s ease;
  &:hover {
    color: #111827 !important;
  }
}
</style>
