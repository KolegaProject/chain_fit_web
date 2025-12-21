<template>
  <q-layout>
    <q-page-container>
      <q-page class="row">
        <div class="col-12 col-md-6 left-side q-pa-xl gt-sm flex flex-vertical justify-between">
          <div class="logo-placeholder"></div>

          <div class="text-box q-mt-auto">
            <p class="text-body2 text-dark">
              Lorem Ipsum adalah contoh teks atau dummy dalam industri percetakan dan penataan huruf
              atau typesetting.
            </p>
            <p class="text-caption text-weight-bold">bye Lorem</p>
          </div>
        </div>

        <div class="col-12 col-md-6 flex flex-center bg-white">
          <div class="form-container q-pa-lg">
            <div class="text-center q-mb-xl">
              <h2 class="text-h5 text-weight-bolder q-mb-xs">Masuk dengan Akun Anda</h2>
              <p class="text-grey-7">Kami Senang Anda Kembali</p>
            </div>

            <q-form @submit="handleLogin" class="q-gutter-y-md">
              <q-input
                outlined
                v-model="email"
                type="email"
                placeholder="Email"
                bg-color="white"
                dense
                required
              />

              <q-input
                outlined
                v-model="password"
                type="password"
                placeholder="Password"
                bg-color="white"
                dense
                required
              />

              <q-btn type="submit" label="Continue" class="full-width btn-continue" unelevated />
            </q-form>

            <div class="row items-center q-my-lg">
              <q-separator class="col" />
              <span class="q-px-sm text-caption text-grey-7">Or continue with</span>
              <q-separator class="col" />
            </div>

            <div class="row justify-center q-gutter-x-md q-mb-lg">
              <q-btn flat round @click="socialRedirect">
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

const router = useRouter()
const $q = useQuasar()

const email = ref('')
const password = ref('')

const handleLogin = () => {
  $q.notify({
    message: 'Login berhasil!',
    color: 'positive',
    icon: 'check_circle',
  })
  router.push('/dashboard')
}

const socialRedirect = () => {
  router.push('/register')
}
</script>

<style lang="scss" scoped>
.left-side {
  background-color: #d6d6d6;
  min-height: 100vh;
}

.logo-placeholder {
  width: 120px;
  height: 35px;
  border: 1px solid #000;
  border-radius: 6px;
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

.flex-vertical {
  flex-direction: column;
}
</style>
