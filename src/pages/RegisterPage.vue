<template>
  <q-layout>
    <q-page-container>
      <q-page class="row">
        <div class="col-12 col-md-6 gt-sm">
          <q-img src="../assets/RegisterPage-asset1.jpg" class="full-height-img" :ratio="1">
            <div class="absolute-full column justify-between q-pa-xl bg-transparent-overlay">
              <div class="logo-wrapper q-pl-lg">
                <q-img
                  src="../assets/ChainFitLogo.png"
                  spinner-color="white"
                  style="height: 140px; max-width: 150px"
                />
              </div>

              <div
                class="text-box q-pa-md q-ma-xl"
                style="border-radius: 12px; background-color: rgba(217, 217, 217, 0.09)"
              >
                <p class="text-h6 text-white text-weight-light">
                  Platform gym untuk kamu yang anti ribet dan suka kontrol penuh, Bangun badan,
                  bangun mindset, dan jadi bagian dari komunitas gym masa depan.
                </p>
              </div>
            </div>
          </q-img>
        </div>

        <div class="col-12 col-md-6 flex flex-center bg-white">
          <div class="form-container q-pa-lg">
            <div class="text-center q-mb-lg">
              <h2 class="text-h5 text-weight-bolder q-mb-xs">Buat Akun Anda</h2>
              <p class="text-grey-7">Mulai Perjalanan Anda Dengan Kami</p>
            </div>

            <q-form @submit="handleRegister" class="q-gutter-y-sm">
              <q-input
                color="black"
                outlined
                dense
                v-model="form.name"
                placeholder="Nama"
                required
              />
              <q-input
                color="black"
                outlined
                dense
                v-model="form.email"
                type="email"
                placeholder="Email"
                required
              />
              <q-input
                color="black"
                outlined
                dense
                v-model="form.phone"
                type="tel"
                placeholder="No Telepon"
                required
              />

              <q-input
                color="black"
                outlined
                dense
                v-model="form.password"
                type="password"
                placeholder="Password"
                required
              />

              <q-input
                color="black"
                outlined
                dense
                v-model="form.confirmPassword"
                type="password"
                placeholder="Konfirmasi Password"
                :rules="[(val) => val === form.password || 'Password tidak cocok']"
                lazy-rules
                required
              />

              <q-btn
                type="submit"
                label="Register"
                class="full-width btn-continue q-mt-md"
                unelevated
              />
            </q-form>

            <div class="row items-center q-my-lg">
              <q-separator class="col" />
              <span class="q-px-sm text-caption text-grey-7">Or continue with</span>
              <q-separator class="col" />
            </div>

            <div class="row justify-center q-gutter-x-md q-mb-lg">
              <q-btn flat round @click="goToLogin">
                <q-avatar size="32px">
                  <img src="https://www.svgrepo.com/show/355037/google.svg" />
                </q-avatar>
              </q-btn>
              <q-btn flat round @click="goToLogin">
                <q-avatar size="32px">
                  <img src="https://www.svgrepo.com/show/452196/facebook-1.svg" />
                </q-avatar>
              </q-btn>
            </div>

            <div class="text-center text-body2">
              Sudah punya akun?
              <router-link to="/login" class="text-weight-bold text-black no-decoration">
                Masuk
              </router-link>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

const form = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
})

const handleRegister = () => {
  $q.notify({
    message: 'Akun berhasil dibuat!',
    color: 'positive',
    icon: 'person_add',
  })
  router.push('/login')
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.full-height-img {
  height: 100vh;
  width: 100%;
}

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

/* Ensure validation error doesn't push layout too much */
:deep(.q-field--with-bottom) {
  padding-bottom: 12px;
}
</style>
