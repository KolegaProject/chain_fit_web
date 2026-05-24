<template>
  <q-layout>
    <q-page-container>
      <q-page class="row">
        <!-- ================= BAGIAN KIRI (GAMBAR) ================= -->
        <div class="col-12 col-md-6 gt-sm relative-position">
          <!-- Sesuaikan nama gambar aslimu -->
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
                  background-color: rgba(25, 28, 36, 0.8);
                  border: 1px solid rgba(255, 255, 255, 0.1);
                "
              >
                <p
                  class="text-body1 text-white text-weight-regular q-ma-none"
                  style="line-height: 1.6"
                >
                  Keamanan akun Anda adalah prioritas kami. Verifikasi langkah ini untuk memastikan
                  progres latihan Anda tetap aman.
                </p>
              </div>
            </div>
          </q-img>
        </div>

        <!-- ================= BAGIAN KANAN (FORM VERIFIKASI) ================= -->
        <div class="col-12 col-md-6 flex flex-center bg-white">
          <div class="form-container q-pa-lg text-center">
            <!-- Judul & Subjudul -->
            <div class="q-mb-md">
              <h1 class="text-h4 text-weight-bold q-mb-sm text-dark q-mt-none">Verifikasi Akun</h1>
              <p class="text-body1 text-grey-7">
                Masukkan 6 digit kode PIN yang dikirim ke email Anda.
              </p>
            </div>

            <!-- Pill Info Email -->
            <div class="q-mb-xl">
              <div
                class="bg-grey-2 inline-block q-px-md q-py-sm text-weight-bold text-dark text-caption"
                style="border-radius: 20px"
              >
                Kode telah dikirim ke a***@chainfit.com
              </div>
            </div>

            <!-- Form PIN -->
            <q-form @submit="handleVerifikasi" class="q-gutter-y-lg">
              <!-- Kotak Input OTP (6 Digit) -->
              <div class="row justify-center q-gutter-x-sm q-mb-lg">
                <input
                  v-for="(digit, index) in 6"
                  :key="index"
                  :ref="
                    (el) => {
                      if (el) pinRefs[index] = el
                    }
                  "
                  v-model="pin[index]"
                  type="text"
                  inputmode="numeric"
                  maxlength="1"
                  class="otp-input"
                  @input="handleInput(index, $event)"
                  @keydown.delete="handleDelete(index)"
                />
              </div>

              <!-- Tombol Verifikasi -->
              <q-btn
                type="submit"
                label="Verifikasi"
                class="full-width btn-continue"
                unelevated
                :loading="loading"
              />
            </q-form>

            <!-- Teks Kirim Ulang -->
            <div class="q-mt-xl text-body2 text-grey-7">
              Belum menerima kode?
              <span v-if="timeLeft > 0" class="text-dark text-weight-bold q-ml-xs">
                Kirim ulang kode dalam {{ formattedTime }}
              </span>
              <span
                v-else
                class="text-dark text-weight-bold q-ml-xs cursor-pointer hover-underline"
                @click="resendCode"
              >
                Kirim ulang sekarang
              </span>
            </div>

            <q-separator class="q-my-xl bg-grey-3" />

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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
// import useRouter dihapus sementara karena belum digunakan

const $q = useQuasar()

const loading = ref(false)

// State untuk OTP/PIN
const pin = ref(['', '', '', '', '', ''])
const pinRefs = ref([])

// State untuk Timer Hitung Mundur
const timeLeft = ref(59)
let timerInterval = null

// --- LOGIKA INPUT OTP ---
const handleInput = (index, event) => {
  const value = event.target.value
  // Pastikan hanya angka yang dimasukkan
  if (!/^\d*$/.test(value)) {
    pin.value[index] = ''
    return
  }

  // Otomatis pindah ke kotak berikutnya jika sudah terisi
  if (value && index < 5) {
    pinRefs.value[index + 1].focus()
  }
}

// parameter 'event' dihapus agar tidak error ESLint
const handleDelete = (index) => {
  // Pindah ke kotak sebelumnya jika kotak saat ini kosong dan tombol backspace ditekan
  if (!pin.value[index] && index > 0) {
    pinRefs.value[index - 1].focus()
  }
}

// --- LOGIKA VERIFIKASI ---
const handleVerifikasi = async () => {
  const kodePin = pin.value.join('')

  // Validasi: Pastikan 6 digit terisi
  if (kodePin.length < 6) {
    $q.notify({
      message: 'Harap masukkan 6 digit PIN secara lengkap.',
      color: 'warning',
      position: 'top',
    })
    return
  }

  loading.value = true
  try {
    // Simulasi request API
    await new Promise((resolve) => setTimeout(resolve, 1500))

    $q.notify({
      message: 'Verifikasi berhasil!',
      color: 'positive',
      icon: 'check_circle',
      position: 'top',
    })
  } catch (error) {
    // Variabel error digunakan dengan console.error
    console.error('Verifikasi gagal:', error)
    $q.notify({
      message: 'PIN salah atau kadaluarsa.',
      color: 'negative',
      icon: 'error',
      position: 'top',
    })
  } finally {
    loading.value = false
  }
}

// --- LOGIKA TIMER ---
const formattedTime = computed(() => {
  const seconds = timeLeft.value.toString().padStart(2, '0')
  return `00:${seconds}`
})

const startTimer = () => {
  timeLeft.value = 59
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      clearInterval(timerInterval)
    }
  }, 1000)
}

const resendCode = async () => {
  // Logika kirim ulang API di sini
  $q.notify({
    message: 'Kode PIN baru telah dikirim ke email Anda.',
    color: 'positive',
    position: 'top',
  })
  // Mulai ulang timer
  startTimer()
}

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
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
    rgba(0, 0, 0, 0.7) 100%
  );
}

.form-container {
  width: 100%;
  max-width: 480px;
}

/* Styling Kotak OTP Custom */
.otp-input {
  width: 52px;
  height: 56px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  transition: all 0.2s ease;
  background-color: transparent;

  &:focus {
    border-color: #111827;
    border-width: 2px;
    outline: none;
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

.hover-underline:hover {
  text-decoration: underline;
}
</style>
