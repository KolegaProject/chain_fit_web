<template>
  <q-page class="q-pa-lg bg-grey-2">
    <q-card flat class="rounded-borders shadow-1 custom-card">
      <q-card-section class="q-pa-xl">
        <div class="text-h5 text-center text-weight-bolder q-mb-xl">Pembaruan Keanggotaan</div>

        <div class="row q-col-gutter-x-md q-col-gutter-y-lg">
          <div class="col-12">
            <div class="text-weight-bold q-mb-md">Paket Gym</div>
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
                      <div class="text-body2 text-weight-bold">Rp {{ paket.harga.toLocaleString() }}</div>
                    </div>
                    <div class="col-auto row items-baseline">
                      <div class="text-h3 text-weight-bolder">{{ paket.durasi }}</div>
                      <div class="text-caption q-ml-xs">/hari</div>
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
          <q-btn unelevated no-caps label="Batal" class="btn-batal" @click="goBack" />
          <q-btn unelevated no-caps label="Simpan" class="btn-tambah" @click="onSaveClick" />
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
  selectedPaket: null
})

const errors = reactive({
  selectedPaket: ''
})

const paketOptions = computed(() =>
  subscriptionPlans.value.map(p => ({
    id: p.id,
    nama: p.name,
    harga: Number(p.price),
    durasi: p.durationDays
  }))
)

const goBack = () => router.push('/anggota')

const selectPaket = id => {
  form.value.selectedPaket = id
  errors.selectedPaket = ''
}

const validate = () => {
  if (!form.value.selectedPaket) {
    errors.selectedPaket = 'Silakan pilih paket'
    $q.notify({ type: 'warning', message: 'Pilih paket terlebih dahulu' })
    return false
  }
  return true
}

const onSaveClick = async () => {
  if (!validate()) return

  try {
    const member = rows.value.find(
      r => String(r.id) === String(MEMBER_ID)
    )

    if (!member) {
      throw new Error('Member tidak ditemukan')
    }

    const paket = subscriptionPlans.value.find(
      p => p.id === form.value.selectedPaket
    )

    if (!paket) {
      throw new Error('Paket tidak ditemukan')
    }

    const masaAktifLama = Number(member.masaAktifHari ?? 0)
    const masaAktifBaru = masaAktifLama + Number(paket.durationDays)

    await anggotaStore.updateMembership(
      gymId.value,
      MEMBER_ID,
      {
        paketId: form.value.selectedPaket,
        masaAktifHari: masaAktifBaru
      }
    )

    $q.notify({
      type: 'positive',
      message: `Membership berhasil diperpanjang (+${paket.durationDays} hari)`
    })

    router.push('/anggota')

  } catch (err) {
    console.error(err)
    $q.notify({
      type: 'negative',
      message: err.message || 'Gagal memperbarui membership'
    })
  }
}

onMounted(async () => {
  if (!gymId.value) {
    console.warn('Gym ID belum tersedia')
    return
  }

  try {
    await packageStore.fetchPlans(gymId.value)

    const member = rows.value.find(
      r => String(r.id) === String(MEMBER_ID)
    )

    if (member) {
      form.value.selectedPaket = member.paketId ?? null
    }
  } catch (err) {
    console.error('Gagal load data edit membership:', err)
  }
})

</script>


<style lang="scss" scoped>
.custom-card {
  border-radius: 15px;
  max-width: 1000px;
  margin: 0 auto;
}

.paket-card {
  border-radius: 10px;
  background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
  color: white;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  cursor: pointer;
}

.paket-card:hover {
  transform: translateY(-4px);
}

.paket-selected {
  background: linear-gradient(135deg, #475569 0%, #1e293b 100%);
  border-color: #0c0c0c;
  transform: translateY(-2px);
}

.text-h3 {
  line-height: 1;
  letter-spacing: -1px;
}

.btn-batal {
  background-color: #e53935;
  color: white;
  border-radius: 8px;
  font-weight: bold;
  height: 40px;
  padding: 0 25px;
}

.btn-tambah {
  background-color: #0c0c0c;
  color: white;
  border-radius: 8px;
  font-weight: bold;
  height: 40px;
  padding: 0 35px;
}

.error-text {
  color: #ef4444;
  font-size: 13px;
  font-weight: 600;
}
</style>
