<template>
  <q-layout>
    <q-page-container>
      <q-page class="row window-height bg-white">
        <div class="col-12 col-md-6 flex flex-center q-pa-xl">
          <div style="width: 100%; max-width: 420px">
            <q-btn
              flat
              dense
              no-caps
              icon="arrow_back"
              label="Back to login"
              class="text-weight-bold q-mb-xl text-dark"
              to="/login"
            />

            <h1 class="text-h4 text-weight-bolder q-ma-none q-mb-sm text-dark">Forgot Password</h1>
            <p class="text-grey-7 text-body1 q-mb-xl">
              Enter the email address associated with your account and we'll send you a link to
              reset your password.
            </p>

            <q-form @submit.prevent="submitForgot">
              <div class="q-mb-lg">
                <label class="text-caption text-weight-bold text-dark q-mb-xs block">
                  Email Address
                </label>
                <q-input
                  outlined
                  dense
                  v-model="email"
                  type="email"
                  placeholder="e.g., yourname@email.com"
                  class="custom-input"
                  lazy-rules
                  :rules="[
                    (val) => !!val || 'Email is required',
                    (val) => /.+@.+\..+/.test(val) || 'Enter a valid email format',
                  ]"
                >
                  <template v-slot:prepend>
                    <q-icon name="mail_outline" color="grey-6" />
                  </template>
                </q-input>
              </div>

              <q-btn
                unelevated
                type="submit"
                label="Send Reset Link"
                no-caps
                class="full-width btn-dark q-mt-sm"
                :loading="isLoading"
              >
                <template v-slot:loading>
                  <q-spinner-dots class="on-left" />
                  Sending...
                </template>
              </q-btn>
            </q-form>
          </div>
        </div>

        <div class="col-12 col-md-6 relative-position window-height hide-on-mobile">
          <q-img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
            class="fit"
            style="filter: brightness(0.8)"
          />
          <div class="absolute-bottom q-pa-xl">
            <q-card
              flat
              class="bg-dark text-white q-pa-lg"
              style="
                background: rgba(17, 24, 39, 0.85);
                border-radius: 12px;
                backdrop-filter: blur(10px);
              "
            >
              <div class="row items-center q-mb-md">
                <q-icon name="fitness_center" size="md" class="q-mr-sm" />
                <div class="text-h6 text-weight-bold">CHAIN FIT</div>
              </div>
              <div class="text-body1" style="line-height: 1.6">
                "Discipline is the bridge between goals and accomplishment. Recover your access and
                get back to the grind."
              </div>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'

const router = useRouter()
const $q = useQuasar()

const email = ref('')
const isLoading = ref(false)

const submitForgot = async () => {
  isLoading.value = true

  try {
    // Alamat URL API sudah disesuaikan dengan Postman
    await api.post('/api/v1/auth/email-reset-password', {
      email: email.value,
    })

    // Tampilkan notifikasi bahwa link telah dikirim ke email
    $q.notify({
      type: 'positive',
      icon: 'mark_email_read',
      message: 'Reset link sent! Please check your email inbox or spam folder.',
      position: 'top',
      timeout: 5000, // Beri waktu user untuk membaca pesan
    })

    // Beri jeda 3 detik, lalu arahkan user KEMBALI KE LOGIN (bukan ke halaman PIN lagi)
    setTimeout(() => {
      router.push('/login')
    }, 3000)
  } catch (error) {
    console.error('Forgot password error:', error)
    $q.notify({
      type: 'negative',
      icon: 'error_outline',
      message:
        error.response?.data?.message || 'Failed to send reset link. Is your email registered?',
      position: 'top',
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.custom-input {
  :deep(.q-field__control) {
    border-radius: 4px;
    height: 48px;
  }
  :deep(.q-field__control:before) {
    border-color: #e5e7eb;
  }
}

.btn-dark {
  background-color: #111827 !important;
  color: white;
  border-radius: 4px;
  font-weight: 600;
  height: 48px;
  font-size: 16px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #1f2937 !important;
  }
}

.block {
  display: block;
}

@media (max-width: 1023px) {
  .hide-on-mobile {
    display: none;
  }
}
</style>
