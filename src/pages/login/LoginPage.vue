<template>
  <q-layout>
    <q-page-container>
      <q-page class="row">
        <div class="col-12 col-md-6 gt-sm">
          <q-img src="../../assets/LoginPage-asset1.jpg" class="full-height-img" :ratio="1">
            <div class="absolute-full column justify-between q-pa-xl bg-transparent-overlay">
              <div class="logo-wrapper q-pl-lg">
                <q-img
                  src="../../assets/ChainFitLogo.png"
                  spinner-color="white"
                  style="height: 140px; max-width: 150px"
                />
              </div>

              <div
                class="text-box q-pa-md q-ma-xl"
                style="border-radius: 12px; background-color: rgba(217, 217, 217, 0.09)"
              >
                <p class="text-h6 text-white text-weight-light">
                  Welcome back!. Stay consistent, lanjutkan apa yang sudah kamu mulai, Semua kontrol
                  ada di tanganmu.
                </p>
              </div>
            </div>
          </q-img>
        </div>

        <div class="col-12 col-md-6 flex flex-center bg-white">
          <div class="form-container q-pa-lg">
            <div class="text-center q-mb-xl">
              <h2 class="text-h5 text-weight-bolder q-mb-xs">Selamat Datang Kembali</h2>
              <p class="text-grey-7">Lanjutkan progres yang sudah kamu mulai</p>
            </div>

            <q-form @submit="handleLogin" class="q-gutter-y-md">
              <q-input
                color="black"
                outlined
                v-model="username"
                placeholder="Username"
                bg-color="white"
                dense
                required
              />

              <q-input
                color="black"
                outlined
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Password"
                bg-color="white"
                dense
                required
              >
                <template #append>
                  <q-icon
                    :name="showPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>


              <q-btn
                type="submit"
                label="Login"
                class="full-width btn-continue"
                unelevated
                :loading="loading"
              />
            </q-form>

            <div class="row items-center q-my-lg">
              <q-separator class="col" />
              <span class="q-px-sm text-caption text-grey-7">Or continue with</span>
              <q-separator class="col" />
            </div>

            <div class="row justify-center q-gutter-x-md q-mb-lg">
              <q-btn flat round @click="handleGoogleLogin">
                <q-avatar size="32px">
                  <img src="https://www.svgrepo.com/show/355037/google.svg" />
                </q-avatar>
              </q-btn>
              <q-btn flat round @click="socialRedirect">
                <q-avatar size="32px">
                  <img src="https://www.svgrepo.com/show/452196/facebook-1.svg" />
                </q-avatar>
              </q-btn>
            </div>

            <div class="text-center text-body2">
              Belum punya akun?
              <router-link to="/register" class="text-weight-bold text-black no-decoration">
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
  loading.value = true;
  try {
    const googleResponse = await googleTokenLogin();

    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${googleResponse.access_token}` },
    })
    const userGoogleInfo = await userInfoResponse.json();
    const username = userGoogleInfo.email.split('@')[0];

    const res = await authStore.loginSocialAccount({
      username: username,
      provider: 'google'
    });

    console.log('Login Google Berhasil! Response:', res);
    console.log('Token yang didapat:', res.data.access_token);

    $q.notify({
      message: 'Selamat Datang Kembali!',
      color: 'positive',
      icon: 'check_circle',
      position: 'top',
    })

    router.push('/dashboard') 
  } catch (error) {
    console.error('Google Login Error', error);
    
    const errorMsg = error.response?.data?.message || 'Login Gagal, periksa username/password'
    $q.notify({
      message: errorMsg || 'Gagal login dengan Google',
      color: 'negative',
      icon: 'error'
    });
  } finally {
    loading.value = false;
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
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.6) 100%
  );
}

.form-container {
  width: 100%;
  max-width: 400px;
}

.btn-continue {
  background-color: #0a0f1f !important;
  color: white;
  text-transform: none;
  border-radius: 6px;
  height: 44px;

  &:hover {
    background-color: #131a32 !important;
  }
}

.no-decoration {
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}

</style>
