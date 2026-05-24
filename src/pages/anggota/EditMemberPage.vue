<template>
  <q-page class="q-pa-lg bg-grey-2">
    <q-card flat class="custom-card q-pa-xl shadow-1">
      <q-card-section>
        <div class="text-h5 text-center text-weight-bold q-mb-xl text-dark">Membership Renewal</div>

        <div class="row q-col-gutter-x-md q-col-gutter-y-lg">
          <div class="col-12">
            <div class="text-weight-bold q-mb-md text-dark">Subscription Plan</div>
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
                    <div class="col-auto row items-baseline">
                      <div class="text-h4 text-weight-bolder">{{ paket.durasi }}</div>
                      <div class="text-caption q-ml-xs">days</div>
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
          <q-btn flat label="Cancel" class="btn-cancel" no-caps @click="goBack" />
          <q-btn unelevated label="Save Changes" class="btn-save" no-caps @click="onSaveClick" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAnggotaStore } from 'src/stores/Anggota'
import { storeToRefs } from 'pinia'
import { usePackageStore } from 'stores/Package.js'
import { useGymStore } from 'src/stores/Gym'

const gymId = computed(() => gymStore.selectedGymId)
const packageStore = usePackageStore()
const router = useRouter()
const route = useRoute()
const $q = useQuasar()
const anggotaStore = useAnggotaStore()
const { rows } = storeToRefs(anggotaStore)
const gymStore = useGymStore()
const { subscriptionPlans } = storeToRefs(packageStore)
const MEMBER_ID = route.params.id

const form = ref({
  memberId: MEMBER_ID,
  selectedPaket: null,
})

const errors = reactive({
  selectedPaket: '',
})

const paketOptions = computed(() =>
  subscriptionPlans.value.map((p) => ({
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

const validate = () => {
  if (!form.value.selectedPaket) {
    errors.selectedPaket = 'Please select a plan'
    $q.notify({ type: 'warning', message: 'Please select a plan first', position: 'top' })
    return false
  }
  return true
}

const onSaveClick = async () => {
  if (!validate()) return

  try {
    const member = rows.value.find((r) => String(r.id) === String(MEMBER_ID))
    if (!member) throw new Error('Member not found')

    const paket = subscriptionPlans.value.find((p) => p.id === form.value.selectedPaket)
    if (!paket) throw new Error('Plan not found')

    await anggotaStore.updateMembership(gymId.value, MEMBER_ID, {
      paketId: form.value.selectedPaket,
    })

    $q.notify({
      type: 'positive',
      icon: 'check_circle',
      message: `Membership successfully renewed (+${paket.durationDays} days)`,
      position: 'top',
    })

    router.push('/anggota')
  } catch (err) {
    console.error(err)
    $q.notify({
      type: 'negative',
      message: err.message || 'Failed to update membership',
      position: 'top',
    })
  }
}

onMounted(async () => {
  if (!gymId.value) return

  try {
    await packageStore.fetchPlans(gymId.value)
    const member = rows.value.find((r) => String(r.id) === String(MEMBER_ID))
    if (member) {
      form.value.selectedPaket = member.paketId ?? null
    }
  } catch (err) {
    console.error('Failed to load membership data:', err)
  }
})
</script>

<style lang="scss" scoped>
.custom-card {
  border-radius: 8px;
  border: 1px solid #f3f4f6;
  max-width: 1000px;
  margin: 0 auto;
}

.paket-card {
  border-radius: 4px;
  background: #f9fafb;
  color: #374151;
  transition: all 0.2s ease;
  border: 2px solid #e5e7eb;
  cursor: pointer;

  &:hover {
    border-color: #9ca3af;
  }
}

.paket-selected {
  background: #111827;
  color: white;
  border-color: #111827;
}

.btn-cancel {
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-weight: 500;
  padding: 0 25px;
  color: #374151;
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
