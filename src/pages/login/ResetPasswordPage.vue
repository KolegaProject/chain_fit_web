<template>
  <q-layout>
    <q-page-container>
      <q-page class="row">
        <div class="col-12 col-md-6 gt-sm relative-position">
          <q-img
            src="../../assets/login-register/ResetPasswordPage.jpeg"
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
                  background-color: rgba(30, 33, 40, 0.85);
                  border: 1px solid rgba(255, 255, 255, 0.05);
                "
              >
                <p
                  class="text-body1 text-white text-weight-regular q-ma-none"
                  style="line-height: 1.6"
                >
                  Your account security is our priority. Make sure to create a strong and unique
                  password to keep your training progress data safe.
                </p>
              </div>
            </div>
          </q-img>
        </div>

        <div class="col-12 col-md-6 flex flex-center bg-white">
          <div class="form-container q-pa-lg text-center">
            <div class="q-mb-xl">
              <h1 class="text-h4 text-weight-bold q-mb-md text-dark q-mt-none">Reset Password</h1>
              <p class="text-body1 text-grey-7">Create a new, strong password for your account.</p>
            </div>

            <q-form @submit.prevent="handleSimpanPassword" class="q-gutter-y-md text-left">
              <div>
                <label class="text-caption text-weight-bold text-dark q-mb-xs block"
                  >New Password</label
                >
                <q-input
                  color="black"
                  outlined
                  dense
                  v-model="password.new"
                  :type="showNewPwd ? 'text' : 'password'"
                  placeholder="Enter new password"
                  class="custom-input"
                  required
                >
                  <template #append>
                    <q-icon
                      :name="showNewPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer text-grey-7"
                      @click.stop.prevent="showNewPwd = !showNewPwd"
                    />
                  </template>
                </q-input>
                <div class="text-caption text-grey-6 q-mt-xs" style="font-size: 11px">
                  Minimum 8 characters.
                </div>
              </div>

              <div class="q-mt-md">
                <label class="text-caption text-weight-bold text-dark q-mb-xs block"
                  >Confirm New Password</label
                >
                <q-input
                  color="black"
                  outlined
                  dense
                  v-model="password.confirm"
                  :type="showConfirmPwd ? 'text' : 'password'"
                  placeholder="Repeat new password"
                  class="custom-input"
                  required
                >
                  <template #append>
                    <q-icon
                      :name="showConfirmPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer text-grey-7"
                      @click.stop.prevent="showConfirmPwd = !showConfirmPwd"
                    />
                  </template>
                </q-input>
              </div>

              <q-btn
                type="submit"
                label="Save Password"
                class="full-width btn-continue q-mt-lg"
                unelevated
                :loading="loading"
              />
            </q-form>

            <q-separator class="q-my-xl bg-transparent" />

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
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const loading = ref(false)
const showNewPwd = ref(false)
const showConfirmPwd = ref(false)

const password = reactive({
  new: '',
  confirm: '',
})

const handleSimpanPassword = async () => {
  if (password.new !== password.confirm) {
    $q.notify({
      message: 'New password and confirmation do not match!',
      color: 'warning',
      position: 'top',
    })
    return
  }

  if (password.new.length < 8) {
    $q.notify({
      message: 'Password must be at least 8 characters long.',
      color: 'warning',
      position: 'top',
    })
    return
  }

  loading.value = true
  try {
    // Mengambil ID dari URL, jika kosong kita set default 1 untuk testing
    const userId = route.query.id || 1

    // Memanggil API sesuai dengan format Postman
    await api.post('/api/v1/auth/reset-password', {
      id: Number(userId),
      new_password: password.new,
      confirm_password: password.confirm,
    })

    $q.notify({
      message: 'Password successfully reset! Please log in.',
      color: 'positive',
      icon: 'check_circle',
      position: 'top',
    })

    // Arahkan ke halaman login setelah berhasil
    router.push('/login')
  } catch (error) {
    console.error('Failed to reset password:', error)
    $q.notify({
      message: error.response?.data?.message || 'An error occurred, please try again.',
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
  max-width: 460px;
}
.block {
  display: block;
}
.custom-input {
  :deep(.q-field__control) {
    border-radius: 4px;
    height: 48px;
  }
  :deep(.q-field__control:before) {
    border-color: #e5e7eb;
  }
}
.btn-continue {
  background-color: #111827 !important;
  color: white;
  text-transform: none;
  border-radius: 4px;
  height: 48px;
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
