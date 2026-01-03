<template>
  <q-layout>
    <q-page-container>
      <q-page class="row">
        <div class="col-12 col-md-6 gt-sm">
          <q-img src="../../assets/RegisterPage-asset1.jpg" class="full-height-img" :ratio="1">
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
                style="border-radius: 12px; background-color: rgba(217, 217, 217, 0.3)"
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

            <q-form @submit="handleRegister" class="q-gutter-y-md">
              <q-input
                color="black"
                outlined
                dense
                v-model="form.name"
                placeholder="Nama"
                :error="!!errors.name"
                :error-message="errors.name"
                required
              />
              <q-input
                color="black"
                outlined
                dense
                v-model="form.username"
                placeholder="Username"
                :error="!!errors.username"
                :error-message="errors.username"
                required
              />
              <q-input
                color="black"
                outlined
                dense
                v-model="form.email"
                type="email"
                placeholder="Email"
                :error="!!errors.email"
                :error-message="errors.email"
                required
              />

              <q-input
                color="black"
                outlined
                dense
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Password"
                :error="!!errors.password"
                :error-message="errors.password"
                required
              >
                <template v-slot:append>
                  <q-icon
                    :name="showPassword ? 'visibility' : 'visibility_off'"
                    class="cursor-pointer"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>

              <q-input
                color="black"
                outlined
                dense
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Konfirmasi Password"
                :rules="[(val) => val === form.password || 'Password tidak cocok']"
                lazy-rules
                required
              >
                <template v-slot:append>
                  <q-icon
                    :name="showConfirmPassword ? 'visibility' : 'visibility_off'"
                    class="cursor-pointer"
                    @click="showConfirmPassword = !showConfirmPassword"
                  />
                </template>
              </q-input>

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
              <q-btn flat round @click="handleGoogleLogin">
                <q-avatar size="32px">
                  <img src="https://www.svgrepo.com/show/355037/google.svg" />
                </q-avatar>
              </q-btn>
              <q-btn flat round @click="handleFacebookLogin">
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
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { googleTokenLogin } from 'vue3-google-login'

const router = useRouter()
const $q = useQuasar()

const form = reactive({
  name: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const errors = reactive({
  name: '',
  username: '',
  email: '',
  password: '',
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const handleRegister = async () => {
  Object.keys(errors).forEach((key) => (errors[key] = ''))

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/register-owner`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          username: form.username,
          password: form.password,
          email: form.email,
        }),
      },
    )

    const data = await response.json()

    if (response.ok && data.code === 200) {
      $q.notify({
        message: data.data?.message || 'Registrasi berhasil!',
        color: 'positive',
        icon: 'check_circle',
      })
      router.push('/login')
    } else {
      // Handle Validation Errors
      if (data.status === 'Bad Request' && data.errors?.validation) {
        const validationErrors = data.errors.validation
        Object.keys(validationErrors).forEach((field) => {
          if (Object.prototype.hasOwnProperty.call(errors, field)) {
            errors[field] = validationErrors[field][0]
          }
        })
        throw new Error(data.errors.message || 'Cek kembali inputan anda')
      }

      throw new Error(data.data?.message || data.message || 'Terjadi kesalahan saat registrasi')
    }
  } catch (error) {
    console.error('Registration error:', error)
    $q.notify({
      message: error.message || 'Gagal menghubungkan ke server',
      color: 'negative',
      icon: 'error',
    })
  }
}

const handleGoogleLogin = async () => {
  try {
    const googleResponse = await googleTokenLogin()

    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${googleResponse.access_token}` },
    })
    const userInfo = await userInfoResponse.json()

    const randomString = Math.random().toString(36).slice(-8)
    const generatedPassword = `G-Auth${randomString}!`

    const generatedUsername = userInfo.email.split('@')[0]

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/register-owner`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userInfo.name,
          username: generatedUsername,
          password: generatedPassword,
          email: userInfo.email,
        }),
      },
    )

    const data = await response.json()

    if (response.ok && data.code === 200) {
      $q.notify({
        message: 'Login Google berhasil! Akun telah dibuat.',
        color: 'positive',
        icon: 'check_circle',
      })
      router.push('/login')
    } else {
      throw new Error(data.message || data.data?.message || 'Gagal registrasi dengan Google')
    }
  } catch (error) {
    console.error('Google Login Error', error)
    $q.notify({
      message: error.message || 'Gagal login dengan Google',
      color: 'negative',
      icon: 'error',
    })
  }
}

const handleFacebookLogin = () => {
  FB.login(
    (response) => {
      if (response.authResponse) {
        FB.api('/me', { fields: 'name, email' }, async (userInfo) => {
          try {
            if (!userInfo.email) {
              throw new Error('Email tidak ditemukan di akun Facebook Anda.')
            }

            const randomString = Math.random().toString(36).slice(-8)
            const generatedPassword = `F-Auth${randomString}!`

            const generatedUsername = userInfo.email.split('@')[0]

            const apiResponse = await fetch(
              `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/register-owner`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  name: userInfo.name,
                  username: generatedUsername,
                  password: generatedPassword,
                  email: userInfo.email,
                }),
              },
            )

            const data = await apiResponse.json()

            if (apiResponse.ok && data.code === 200) {
              $q.notify({
                message: 'Login Facebook berhasil! Akun telah dibuat.',
                color: 'positive',
                icon: 'check_circle',
              })
              router.push('/login')
            } else {
              throw new Error(
                data.message || data.data?.message || 'Gagal registrasi dengan Facebook',
              )
            }
          } catch (error) {
            console.error('Facebook Auth API Error', error)
            $q.notify({
              message: error.message || 'Gagal login dengan Facebook',
              color: 'negative',
              icon: 'error',
            })
          }
        })
      } else {
        console.log('User cancelled login or did not fully authorize.')
      }
    },
    { scope: 'public_profile,email' },
  )
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

:deep(.q-field--with-bottom) {
  padding-bottom: 12px;
}

</style>
