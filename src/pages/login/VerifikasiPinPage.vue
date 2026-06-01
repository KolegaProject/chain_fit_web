<template>
  <q-layout>
    <q-page-container>
      <q-page class="row">
        <div class="col-12 col-md-6 gt-sm relative-position">
          <q-img
            src="../../assets/login-register/VerifikasiPinPage.jpeg"
            class="full-height-img"
            fit="cover"
          >
            <div class="absolute-full column justify-between q-pa-xl bg-transparent-overlay">
              <div class="logo-wrapper q-pt-md">
                <q-img
                  src="../../assets/ChainFitLogo.png"
                  spinner-color="white"
                  style="height: auto; max-width: 150px"
                />
              </div>

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
                  Your account security is our priority. Verify this step to ensure your training
                  progress remains safe.
                </p>
              </div>
            </div>
          </q-img>
        </div>

        <div class="col-12 col-md-6 flex flex-center bg-white">
          <div class="form-container q-pa-lg text-center">
            <div class="q-mb-md">
              <h1 class="text-h4 text-weight-bold q-mb-sm text-dark q-mt-none">Verify Account</h1>
              <p class="text-body1 text-grey-7">Enter the 6-digit PIN code sent to your email.</p>
            </div>

            <div class="q-mb-xl">
              <div
                class="bg-grey-2 inline-block q-px-md q-py-sm text-weight-bold text-dark text-caption"
                style="border-radius: 20px"
              >
                Code sent to {{ userEmail || 'your email' }}
              </div>
            </div>

            <q-form @submit.prevent="handleVerifikasi" class="q-gutter-y-lg">
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

              <q-btn
                type="submit"
                label="Verify"
                class="full-width btn-continue"
                unelevated
                :loading="loading"
              />
            </q-form>

            <div class="q-mt-xl text-body2 text-grey-7">
              Haven't received the code?
              <span v-if="timeLeft > 0" class="text-dark text-weight-bold q-ml-xs">
                Resend code in {{ formattedTime }}
              </span>
              <span
                v-else
                class="text-dark text-weight-bold q-ml-xs cursor-pointer hover-underline"
                @click="resendCode"
              >
                Resend now
              </span>
            </div>

            <q-separator class="q-my-xl bg-grey-3" />

            <router-link
              to="/login"
              class="text-body2 text-grey-8 no-decoration row items-center justify-center transition-color hover-underline"
            >
              <q-icon name="arrow_back" size="16px" class="q-mr-sm" />
              Back to login
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
import { useRouter, useRoute } from 'vue-router'
import { api } from 'src/boot/axios'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const loading = ref(false)
const pin = ref(['', '', '', '', '', ''])
const pinRefs = ref([])
const timeLeft = ref(59)
let timerInterval = null

// Menangkap email dari halaman Lupa Password (contoh: /verifikasi-pin?email=xxx@gmail.com)
const userEmail = ref(route.query.email || '')

const handleInput = (index, event) => {
  const value = event.target.value
  if (!/^\d*$/.test(value)) {
    pin.value[index] = ''
    return
  }
  if (value && index < 5) {
    pinRefs.value[index + 1].focus()
  }
}

const handleDelete = (index) => {
  if (!pin.value[index] && index > 0) {
    pinRefs.value[index - 1].focus()
  }
}

const handleVerifikasi = async () => {
  const kodePin = pin.value.join('')

  if (kodePin.length < 6) {
    $q.notify({ message: 'Please enter the full 6-digit PIN.', color: 'warning', position: 'top' })
    return
  }

  loading.value = true
  try {
    /* * TODO: Ganti ini dengan endpoint verifikasi PIN yang sebenarnya dari backend kamu.
     * Karena di Postman tidak ada, saya asumsikan PIN ini valid dan kita melempar "id" dummy (1)
     * ke halaman reset password.
     */
    // const response = await api.post('/api/v1/auth/verify-pin', { email: userEmail.value, pin: kodePin })
    // const userId = response.data.data.id

    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulasi loading

    $q.notify({
      message: 'Verification successful!',
      color: 'positive',
      icon: 'check_circle',
      position: 'top',
    })

    // Arahkan ke reset password sambil membawa ID user (Asumsi ID = 1 untuk sementara)
    router.push({ path: '/reset-password', query: { id: 1 } })
  } catch (error) {
    console.error('Verification failed:', error)
    $q.notify({
      message: 'Invalid or expired PIN.',
      color: 'negative',
      icon: 'error',
      position: 'top',
    })
  } finally {
    loading.value = false
  }
}

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
  try {
    await api.post('/api/v1/auth/email-reset-password', { email: userEmail.value })
    $q.notify({
      message: 'A new PIN code has been sent to your email.',
      color: 'positive',
      position: 'top',
    })
    startTimer()
  } catch {
    // <-- Hapus kata (error) di sini
    $q.notify({ message: 'Failed to resend PIN.', color: 'negative', position: 'top' })
  }
}

onMounted(() => startTimer())
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
  max-width: 460px;
}
.otp-input {
  width: 52px;
  height: 56px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
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
  font-weight: 400;
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
