<template>
  <q-layout>
    <q-page-container>
      <q-page class="row">
        <!-- ================= BAGIAN KIRI (FORM) ================= -->
        <div class="col-12 col-md-6 bg-white flex column justify-center q-pa-xl">
          <div class="form-container" style="max-width: 460px; margin: 0 auto; width: 100%">
            <!-- Tombol Kembali ke Login -->
            <router-link
              to="/login"
              class="row items-center text-dark no-decoration q-mb-xl text-weight-medium transition-color hover-underline"
            >
              <q-icon name="arrow_back" class="q-mr-sm" size="20px" />
              Back to login
            </router-link>

            <!-- Judul & Deskripsi -->
            <h1 class="text-h4 text-weight-bold q-mt-none q-mb-sm text-dark">Forgot Password</h1>
            <p class="text-body1 text-grey-7 q-mb-xl" style="line-height: 1.5">
              Select which contact details should we use to reset your password.
            </p>

            <!-- Pilihan Metode Pemulihan -->
            <div class="q-gutter-y-md q-mb-lg">
              <!-- Opsi 1: Email -->
              <div
                class="method-card row items-center q-pa-md cursor-pointer transition-all"
                :class="selectedMethod === 'email' ? 'method-active' : 'method-inactive'"
                @click="selectedMethod = 'email'"
              >
                <div class="icon-wrapper q-mr-md flex flex-center bg-grey-1">
                  <q-icon
                    name="mail_outline"
                    size="24px"
                    :color="selectedMethod === 'email' ? 'dark' : 'grey-7'"
                  />
                </div>
                <div>
                  <div class="text-caption text-grey-7">via Email</div>
                  <div class="text-body1 text-weight-bold text-dark">a***@chainfit.com</div>
                </div>
              </div>

              <!-- Opsi 2: SMS / WhatsApp -->
              <div
                class="method-card row items-center q-pa-md cursor-pointer transition-all"
                :class="selectedMethod === 'sms' ? 'method-active' : 'method-inactive'"
                @click="selectedMethod = 'sms'"
              >
                <div class="icon-wrapper q-mr-md flex flex-center bg-grey-1">
                  <q-icon
                    name="chat_bubble_outline"
                    size="24px"
                    :color="selectedMethod === 'sms' ? 'dark' : 'grey-7'"
                  />
                </div>
                <div>
                  <div class="text-caption text-grey-7">via SMS / WhatsApp</div>
                  <div class="text-body1 text-weight-bold text-dark">+1 *** *** 7890</div>
                </div>
              </div>
            </div>

            <!-- Tombol Continue -->
            <q-btn
              label="Continue"
              icon-right="arrow_forward"
              class="full-width btn-continue q-mt-md"
              unelevated
              @click="handleContinue"
            />
          </div>
        </div>

        <!-- ================= BAGIAN KANAN (GAMBAR) ================= -->
        <div class="col-12 col-md-6 gt-sm relative-position">
          <!-- Sesuaikan path gambar aslimu di sini -->
          <q-img src="../../assets/LoginPage-asset1.jpg" class="full-height-img" fit="cover">
            <!-- Box Overlay Hitam di Bawah -->
            <div class="absolute-bottom q-pa-xl" style="background: transparent">
              <div
                class="text-box q-pa-xl"
                style="
                  border-radius: 12px;
                  background-color: rgba(17, 24, 39, 0.75);
                  backdrop-filter: blur(8px);
                  border: 1px solid rgba(255, 255, 255, 0.05);
                "
              >
                <!-- Logo -->
                <q-img
                  src="../../assets/ChainFitLogo.png"
                  spinner-color="white"
                  style="height: auto; max-width: 140px"
                  class="q-mb-lg"
                />

                <!-- Quote -->
                <p
                  class="text-body1 text-white text-weight-regular q-ma-none"
                  style="line-height: 1.6"
                >
                  "Discipline is the bridge between goals and accomplishment. Recover your access
                  and get back to the grind."
                </p>
              </div>
            </div>
          </q-img>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// State untuk menyimpan pilihan pengguna (default ke 'email')
const selectedMethod = ref('email')

const handleContinue = () => {
  console.log('Metode pemulihan yang dipilih:', selectedMethod.value)
  // Navigasi ke halaman verifikasi PIN
  router.push('/verifikasi-pin')
}
</script>

<style lang="scss" scoped>
.full-height-img {
  height: 100vh;
  width: 100%;
}

/* Styling untuk Kartu Pilihan Metode */
.method-card {
  border-radius: 8px;
  border: 2px solid transparent;
}

.method-active {
  border-color: #111827; /* Border hitam tebal jika dipilih */
  background-color: #ffffff;
}

.method-inactive {
  border-color: #e5e7eb; /* Border abu-abu tipis jika tidak dipilih */
  background-color: #ffffff;
}

.method-inactive:hover {
  border-color: #d1d5db;
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 8px;
}

/* Tombol Continue */
.btn-continue {
  background-color: #111827 !important;
  color: white;
  text-transform: none;
  border-radius: 8px;
  height: 56px;
  font-size: 16px;
  font-weight: 500;

  &:hover {
    background-color: #1f2937 !important;
  }

  /* Menjauhkan sedikit jarak ikon panah dengan teks */
  :deep(.q-icon) {
    margin-left: 8px;
  }
}

.no-decoration {
  text-decoration: none;
}

.hover-underline:hover {
  text-decoration: underline;
}

.transition-all {
  transition: all 0.2s ease-in-out;
}
</style>
