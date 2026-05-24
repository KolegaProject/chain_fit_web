<template>
  <q-layout>
    <q-page-container>
      <q-page class="row">
        <div class="col-12 col-md-6 gt-sm relative-position">
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
                  "Hambatan adalah jalan. Teruslah bergerak maju, fokus pada proses, dan kendalikan
                  pemulihanmu."
                </p>
              </div>
            </div>
          </q-img>
        </div>

        <!-- ================= BAGIAN KANAN (FORM) ================= -->
        <div class="col-12 col-md-6 flex flex-center bg-white">
          <div class="form-container q-pa-lg text-center">
            <!-- Judul & Subjudul -->
            <div class="q-mb-xl">
              <h1 class="text-h4 text-weight-bold q-mb-md text-dark q-mt-none">Lupa Password?</h1>
              <p class="text-body1 text-grey-7" style="line-height: 1.5">
                Masukkan email atau nomor telepon Anda untuk menerima instruksi pemulihan.
              </p>
            </div>

            <!-- Form -->
            <q-form @submit="handleKirimInstruksi" class="q-gutter-y-lg text-left">
              <q-input
                color="black"
                outlined
                v-model="contact"
                placeholder="Email atau Nomor Telepon"
                bg-color="white"
                class="custom-input"
                required
              />

              <q-btn
                type="submit"
                label="Kirim Instruksi"
                class="full-width btn-continue q-mt-md"
                unelevated
                :loading="loading"
              />
            </q-form>

            <!-- Garis Pemisah -->
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
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const contact = ref('')
const loading = ref(false)

const handleKirimInstruksi = async () => {
  loading.value = true
  try {
    // Simulasi loading API
    await new Promise((resolve) => setTimeout(resolve, 1500))

    $q.notify({
      message: 'Instruksi pemulihan telah dikirim!',
      color: 'positive',
      icon: 'check_circle',
      position: 'top',
    })

    contact.value = ''
  } catch (error) {
    console.error('Gagal mengirim instruksi:', error)
    $q.notify({
      message: 'Terjadi kesalahan, silakan coba lagi.',
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
    rgba(0, 0, 0, 0.5) 100%
  );
}

.form-container {
  width: 100%;
  max-width: 480px;
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
</style>
