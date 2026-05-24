<template>
  <q-layout>
    <q-page-container>
      <q-page class="row">
        <!-- ================= BAGIAN KIRI (GAMBAR) ================= -->
        <div class="col-12 col-md-6 gt-sm relative-position">
          <q-img src="../../assets/LoginPage-asset1.jpg" class="full-height-img" fit="cover">
            <div class="absolute-full column justify-between q-pa-xl bg-transparent-overlay">
              <!-- Logo Atas -->
              <div class="logo-wrapper q-pt-md">
                <q-img
                  src="../../assets/ChainFitLogo.png"
                  spinner-color="white"
                  style="height: auto; max-width: 180px"
                />
              </div>

              <div
                class="text-box q-pa-lg"
                style="
                  border-radius: 16px;
                  background-color: rgba(0, 0, 0, 0.4);
                  backdrop-filter: blur(4px);
                "
              >
                <p
                  class="text-body1 text-white text-weight-regular q-ma-none"
                  style="line-height: 1.6"
                >
                  Welcome back!. Stay consistent, lanjutkan apa yang sudah kamu mulai, Semua kontrol
                  ada di tanganmu.
                </p>
              </div>
            </div>
          </q-img>
        </div>

        <div class="col-12 col-md-6 flex flex-center bg-white">
          <!-- Diperlebar max-width nya agar input tampak seperti di desain -->
          <div class="form-container q-pa-lg">
            <div class="text-center q-mb-xl">
              <div class="text-h6 text-weight-bold q-mb-sm text-dark">Selamat Datang Kembali</div>
              <div class="text-body2 text-grey-8">Lanjutkan progres yang sudah kamu mulai</div>
            </div>

            <q-form @submit="handleLogin" class="q-gutter-y-lg">
              <q-input
                color="black"
                outlined
                v-model="username"
                placeholder="Email"
                bg-color="white"
                class="custom-input"
                required
              />

              <div>
                <q-input
                  color="black"
                  outlined
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Password"
                  bg-color="white"
                  class="custom-input"
                  required
                >
                  <template #append>
                    <q-icon
                      :name="showPassword ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer text-grey-7"
                      @click="showPassword = !showPassword"
                    />
                  </template>
                </q-input>

                <div class="row justify-end q-mt-sm">
                  <!-- 👇 Ini yang diubah menjadi span @click 👇 -->
                  <span
                    class="text-body2 text-dark cursor-pointer no-decoration"
                    @click="$router.push('/lupa-password')"
                  >
                    Lupa Password?
                  </span>
                  <!-- 👆 ===================================== 👆 -->
                </div>
              </div>

              <q-btn
                type="submit"
                label="Login"
                class="full-width btn-continue q-mt-md"
                unelevated
                :loading="loading"
              />
            </q-form>

            <!-- Garis Or continue with -->
            <div class="row items-center q-my-xl">
              <q-separator class="col bg-grey-3" />
              <span class="q-px-md text-body2 text-grey-7">Or continue with</span>
              <q-separator class="col bg-grey-3" />
            </div>

            <!-- Tombol Sosial Media (Dibuat outline sesuai desain) -->
            <div class="row justify-center q-gutter-x-lg q-mb-xl">
              <q-btn outline round color="grey-4" class="q-pa-sm" @click="handleGoogleLogin">
                <q-avatar size="24px">
                  <img src="https://www.svgrepo.com/show/355037/google.svg" />
                </q-avatar>
              </q-btn>
              <q-btn outline round color="grey-4" class="q-pa-sm" @click="socialRedirect">
                <q-avatar size="24px">
                  <img src="https://www.svgrepo.com/show/452196/facebook-1.svg" />
                </q-avatar>
              </q-btn>
            </div>

            <!-- Footer Daftar -->
            <div class="text-center text-body2 text-grey-8">
              Belum punya akun ?
              <router-link
                to="/register"
                class="text-weight-medium text-dark no-decoration q-ml-xs"
              >
                Daftar
              </router-link>
            </div>
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
import { useAuthStore } from '../../stores/Auth'
import { googleTokenLogin } from 'vue3-google-login'

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

// State Form
const username = ref('')
const password = ref('')
const loading = ref(false)
const showPassword = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    console.log('Mengirim data login:', { username: username.value, password: password.value })

    const res = await authStore.login({
      username: username.value,
      password: password.value,
    })

    console.log('Login Berhasil! Response:', res)
    console.log('Token yang didapat:', res.data.access_token)

    $q.notify({
      message: 'Selamat Datang Kembali!',
      color: 'positive',
      icon: 'check_circle',
      position: 'top',
    })

    router.push('/dashboard')
  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Login Gagal, periksa username/password'
    $q.notify({
      message: errorMsg,
      color: 'negative',
      icon: 'warning',
      position: 'top',
    })
  } finally {
    loading.value = false
  }
}

const handleGoogleLogin = async () => {
  loading.value = true
  try {
    const googleResponse = await googleTokenLogin()

    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${googleResponse.access_token}` },
    })
    const userGoogleInfo = await userInfoResponse.json()
    const username = userGoogleInfo.email.split('@')[0]

    const res = await authStore.loginSocialAccount({
      username: username,
      provider: 'google',
    })

    console.log('Login Google Berhasil! Response:', res)
    console.log('Token yang didapat:', res.data.access_token)

    $q.notify({
      message: 'Selamat Datang Kembali!',
      color: 'positive',
      icon: 'check_circle',
      position: 'top',
    })

    router.push('/dashboard')
  } catch (error) {
    console.error('Google Login Error', error)

    const errorMsg = error.response?.data?.message || 'Login Gagal, periksa username/password'
    $q.notify({
      message: errorMsg || 'Gagal login dengan Google',
      color: 'negative',
      icon: 'error',
    })
  } finally {
    loading.value = false
  }
}

const socialRedirect = () => {
  router.push('/register')
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
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0.05) 40%,
    rgba(0, 0, 0, 0.8) 100%
  );
}

.form-container {
  width: 100%;
  max-width: 460px;
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
  font-weight: 400;

  &:hover {
    background-color: #1f2937 !important;
  }
}

.no-decoration {
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}

.cursor-pointer {
  cursor: pointer;
}
</style>
