<template>
  <q-page class="q-pa-lg bg-grey-2">
    <q-card flat class="custom-card q-pa-xl bg-white shadow-1">
      <q-card-section>
        <div class="text-h5 text-center text-weight-bold q-mb-xl text-dark">Add New Member</div>

        <div class="row q-col-gutter-x-md q-col-gutter-y-lg">
          <div class="col-12 col-sm-6">
            <div class="text-weight-bold q-mb-sm text-dark">Full Name</div>
            <q-input
              outlined
              dense
              v-model="form.nama"
              placeholder="e.g., John Doe"
              class="custom-input"
              :error="!!errors.nama"
              :error-message="errors.nama"
              @update:model-value="errors.nama = ''"
            />
          </div>

          <div class="col-12 col-sm-6">
            <div class="text-weight-bold q-mb-sm text-dark">Email Address</div>
            <q-input
              outlined
              dense
              v-model="form.email"
              placeholder="e.g., johndoe@email.com"
              class="custom-input"
              :error="!!errors.email"
              :error-message="errors.email"
              @update:model-value="errors.email = ''"
            />
          </div>

          <div class="col-12">
            <div class="text-weight-bold q-mb-md text-dark">Membership Plan</div>

            <div class="row q-col-gutter-md">
              <div v-for="paket in paketOptions" :key="paket.id" class="col-12 col-sm-4">
                <q-card
                  flat
                  class="paket-card cursor-pointer"
                  :class="{ 'paket-selected': form.selectedPaket === paket.id }"
                  @click="selectPaket(paket.id)"
                >
                  <q-card-section class="row items-center no-wrap q-pa-md">
                    <div class="col">
                      <div class="text-subtitle1 text-weight-bolder">{{ paket.nama }}</div>
                      <div class="text-body2 text-weight-bold">
                        Rp {{ paket.harga.toLocaleString() }}
                      </div>
                    </div>
                    <div class="col-auto text-right">
                      <div class="text-h4 text-weight-bolder">{{ paket.durasi }}</div>
                      <div class="text-caption">days</div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <div v-if="errors.selectedPaket" class="error-text q-mt-sm">
              {{ errors.selectedPaket }}
            </div>
          </div>
        </div>

        <div class="row justify-end q-mt-xl q-gutter-md">
          <q-btn flat no-caps label="Cancel" class="btn-cancel" @click="goBack" />
          <q-btn unelevated no-caps label="Add Member" class="btn-save" @click="submitForm" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'
import { api } from 'src/boot/axios'
import { useGymStore } from 'src/stores/Gym'
import { usePackageStore } from 'src/stores/Package'

const $q = useQuasar()
const router = useRouter()
const gymStore = useGymStore()
const packageStore = usePackageStore()
const { subscriptionPlans } = storeToRefs(packageStore)

const gymId = computed(() => gymStore.selectedGymId)

const form = ref({
  nama: '',
  email: '',
  selectedPaket: null,
})

const errors = reactive({
  nama: '',
  email: '',
  selectedPaket: '',
})

onMounted(async () => {
  if (!gymId.value) {
    $q.notify({ type: 'negative', message: 'Gym not selected. Please select a gym first.' })
    router.push('/daftar-gym')
    return
  }

  try {
    await packageStore.fetchPlans(gymId.value)
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Failed to load gym plans' })
  }
})

const paketOptions = computed(() =>
  (subscriptionPlans.value || []).map((p) => ({
    id: p.id,
    nama: p.name,
    harga: Number(p.price),
    durasi: p.durationDays,
  })),
)

const goBack = () => router.push('/anggota')

const selectPaket = (id) => {
  form.value.selectedPaket = id
  errors.selectedPaket = ''
}

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const submitForm = async () => {
  errors.nama = ''
  errors.email = ''
  errors.selectedPaket = ''

  if (!gymId.value) return

  if (!form.value.nama.trim()) {
    errors.nama = 'Name is required'
    return
  }
  if (!form.value.email.trim()) {
    errors.email = 'Email is required'
    return
  }
  if (!validateEmail(form.value.email)) {
    errors.email = 'Invalid email format'
    return
  }
  if (!form.value.selectedPaket) {
    errors.selectedPaket = 'Please select a plan'
    return
  }

  try {
    await api.post(`/api/v1/gym/${gymId.value}/memberships`, {
      name: form.value.nama,
      email: form.value.email,
      paketId: form.value.selectedPaket,
    })

    $q.notify({ type: 'positive', icon: 'check_circle', message: 'Member successfully added' })
    router.push('/anggota')
  } catch (err) {
    console.error(err)
    $q.notify({
      type: 'negative',
      message: err.response?.data?.message || 'Failed to add member',
    })
  }
}
</script>

<style lang="scss" scoped>
.custom-card {
  border-radius: 8px;
  max-width: 1000px;
  margin: 0 auto;
  border: 1px solid #f3f4f6;
}

.custom-input {
  :deep(.q-field__control) {
    border-radius: 4px;
  }
  :deep(.q-field__control:before) {
    border-color: #e5e7eb;
  }
}

.paket-card {
  border-radius: 4px;
  background-color: #f9fafb;
  color: #374151;
  border: 2px solid #e5e7eb;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: #9ca3af;
  }
}

.paket-selected {
  background-color: #111827;
  color: white;
  border-color: #111827;
}

.btn-cancel {
  border: 1px solid #d1d5db;
  border-radius: 4px;
  color: #374151;
  padding: 0 25px;
}

.btn-save {
  background-color: #111827 !important;
  color: white;
  border-radius: 4px;
  font-weight: 500;
  height: 40px;
  padding: 0 35px;
}

.error-text {
  color: #ef4444;
  font-size: 13px;
  font-weight: 600;
}
</style>
