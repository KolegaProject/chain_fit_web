<template>
  <q-layout>
    <q-page-container>
      <q-page class="row">
        <!-- ================= LEFT SIDE (IMAGE) ================= -->
        <div class="col-12 col-md-6 gt-sm relative-position">
          <q-img src="../../assets/login-register/RegisterPage.jpg" class="full-height-img" fit="cover">
            <div class="absolute-full column justify-between q-pa-xl bg-transparent-overlay">
              <!-- Logo -->
              <div class="logo-wrapper q-pt-md">
                <q-img
                  src="../../assets/ChainFitLogo.png"
                  spinner-color="white"
                  style="height: auto; max-width: 180px"
                />
              </div>

              <!-- Bottom Overlay Text -->
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
                  The gym platform for those who dislike hassle and love full control. Build your
                  body, build your mindset, and become part of the future gym community.
                </p>
              </div>
            </div>
          </q-img>
        </div>

        <!-- ================= RIGHT SIDE (FORM) ================= -->
        <div class="col-12 col-md-6 flex flex-center bg-white">
          <div class="form-container q-pa-lg">
            <!-- Header -->
            <div class="text-center q-mb-xl">
              <h2 class="text-h6 text-weight-bold q-mb-sm text-dark q-mt-none">
                Create Your Account
              </h2>
              <p class="text-body2 text-grey-8">Start your journey with us</p>
            </div>

            <!-- Form -->
            <q-form @submit="handleRegister" class="q-gutter-y-lg">
              <q-input
                color="black"
                outlined
                v-model="form.name"
                placeholder="Full Name"
                bg-color="white"
                class="custom-input"
                :error="!!errors.name"
                :error-message="errors.name"
                required
              />

              <q-input
                color="black"
                outlined
                v-model="form.username"
                placeholder="Username"
                bg-color="white"
                class="custom-input"
                :error="!!errors.username"
                :error-message="errors.username"
                required
              />

              <q-input
                color="black"
                outlined
                v-model="form.email"
                type="email"
                placeholder="Email Address"
                bg-color="white"
                class="custom-input"
                :error="!!errors.email"
                :error-message="errors.email"
                required
              />

              <q-input
                color="black"
                outlined
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Password"
                bg-color="white"
                class="custom-input"
                :error="!!errors.password"
                :error-message="errors.password"
                required
              >
                <template v-slot:append>
                  <q-icon
                    :name="showPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer text-grey-7"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>

              <q-input
                color="black"
                outlined
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Confirm Password"
                bg-color="white"
                class="custom-input"
                :rules="[(val) => val === form.password || 'Passwords do not match']"
                lazy-rules
                required
              >
                <template v-slot:append>
                  <q-icon
                    :name="showConfirmPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer text-grey-7"
                    @click="showConfirmPassword = !showConfirmPassword"
                  />
                </template>
              </q-input>

              <!-- Register Button -->
              <q-btn
                type="submit"
                label="Sign Up"
                class="full-width btn-continue q-mt-md"
                unelevated
                :loading="loading"
              />
            </q-form>

            <!-- Divider -->
            <div class="row items-center q-my-xl">
              <q-separator class="col bg-grey-3" />
              <span class="q-px-md text-body2 text-grey-7">Or sign up with</span>
              <q-separator class="col bg-grey-3" />
            </div>

            <!-- Social Media Buttons -->
            <div class="row justify-center q-gutter-x-lg q-mb-xl">
              <q-btn outline round color="grey-4" class="q-pa-sm" @click="handleGoogleLogin">
                <q-avatar size="24px">
                  <img src="https://www.svgrepo.com/show/355037/google.svg" />
                </q-avatar>
              </q-btn>
              <q-btn outline round color="grey-4" class="q-pa-sm" @click="handleFacebookLogin">
                <q-avatar size="24px">
                  <img src="https://www.svgrepo.com/show/452196/facebook-1.svg" />
                </q-avatar>
              </q-btn>
            </div>

            <!-- Footer -->
            <div class="text-center text-body2 text-grey-8">
              Already have an account?
              <router-link to="/login" class="text-weight-medium text-dark no-decoration q-ml-xs">
                Log in
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
import { useAuthStore } from '../../stores/Auth'

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

const loading = ref(false)

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
  // Reset errors
  Object.keys(errors).forEach((key) => (errors[key] = ''))
  loading.value = true

  try {
    const response = await authStore.register({
      name: form.name,
      username: form.username,
      password: form.password,
      email: form.email,
    })

    if (response.code === 200) {
      $q.notify({
        message: response.data?.message || 'Registration successful!',
        color: 'positive',
        icon: 'check_circle',
        position: 'top',
      })
      router.push('/login')
    } else {
      throw new Error(
        response.data?.message || response.message || 'An error occurred during registration.',
      )
    }
  } catch (error) {
    console.error('Registration error:', error)
    if (
      error.response?.data?.status === 'Bad Request' &&
      error.response?.data?.errors?.validation
    ) {
      const validationErrors = error.response.data.errors.validation
      Object.keys(validationErrors).forEach((field) => {
        if (Object.prototype.hasOwnProperty.call(errors, field)) {
          errors[field] = validationErrors[field][0]
        }
      })
      $q.notify({
        message: error.response.data.errors.message || 'Please check your inputs.',
        color: 'negative',
        icon: 'warning',
        position: 'top',
      })
    } else {
      $q.notify({
        message:
          error.message || error.response?.data?.message || 'Failed to connect to the server.',
        color: 'negative',
        icon: 'error',
        position: 'top',
      })
    }
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
    const userInfo = await userInfoResponse.json()

    const randomString = Math.random().toString(36).slice(-8)
    const generatedPassword = `G-Auth${randomString}!`
    const generatedUsername = userInfo.email.split('@')[0]

    const response = await authStore.register({
      name: userInfo.name,
      username: generatedUsername,
      password: generatedPassword,
      email: userInfo.email,
    })

    if (response.code === 200) {
      $q.notify({
        message: 'Google login successful! Account created.',
        color: 'positive',
        icon: 'check_circle',
        position: 'top',
      })
      router.push('/login')
    } else {
      throw new Error(
        response.message || response.data?.message || 'Failed to register with Google.',
      )
    }
  } catch (error) {
    console.error('Google Login Error', error)
    $q.notify({
      message: error.message || error.response?.data?.message || 'Failed to login with Google.',
      color: 'negative',
      icon: 'error',
      position: 'top',
    })
  } finally {
    loading.value = false
  }
}

const handleFacebookLogin = () => {
  FB.login(
    (response) => {
      if (response.authResponse) {
        FB.api('/me', { fields: 'name, email' }, async (userInfo) => {
          loading.value = true
          try {
            if (!userInfo.email) {
              throw new Error('Email not found in your Facebook account.')
            }

            const randomString = Math.random().toString(36).slice(-8)
            const generatedPassword = `F-Auth${randomString}!`
            const generatedUsername = userInfo.email.split('@')[0]

            const apiResponse = await authStore.register({
              name: userInfo.name,
              username: generatedUsername,
              password: generatedPassword,
              email: userInfo.email,
            })

            if (apiResponse.code === 200) {
              $q.notify({
                message: 'Facebook login successful! Account created.',
                color: 'positive',
                icon: 'check_circle',
                position: 'top',
              })
              router.push('/login')
            } else {
              throw new Error(
                apiResponse.message ||
                  apiResponse.data?.message ||
                  'Failed to register with Facebook.',
              )
            }
          } catch (error) {
            console.error('Facebook Auth API Error', error)
            $q.notify({
              message:
                error.message || error.response?.data?.message || 'Failed to login with Facebook.',
              color: 'negative',
              icon: 'error',
              position: 'top',
            })
          } finally {
            loading.value = false
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
  max-width: 460px; /* Lebar yang sama dengan halaman login */
}

/* Modifikasi input agar persis dengan login page */
.custom-input {
  :deep(.q-field__control) {
    border-radius: 4px;
  }
  :deep(.q-field__control:before) {
    border-color: #e0e0e0;
  }
}

:deep(.q-field--with-bottom) {
  padding-bottom: 8px; /* Mengurangi jarak error message yang terlalu jauh */
}

/* Tombol Sign Up */
.btn-continue {
  background-color: #111827 !important; /* Warna dark/navy yang sama */
  color: white;
  text-transform: none;
  border-radius: 4px;
  height: 52px; /* Tinggi yang sama dengan login page */
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
