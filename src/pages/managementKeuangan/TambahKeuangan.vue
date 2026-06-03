<template>
  <q-page class="q-pa-lg bg-grey-2">
    <div class="row items-center justify-between q-mb-xl">
      <div class="row items-center">
        <q-icon name="account_balance_wallet" size="28px" class="q-mr-sm" />
        <div class="text-h5 text-weight-bold text-dark">Add Transaction</div>
      </div>
      <q-btn
        flat
        unelevated
        color="dark"
        class="border-radius-4 q-px-md"
        icon="arrow_back"
        label="Back"
        no-caps
        @click="kembali"
      />
    </div>

    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-7">
        <q-card flat bordered class="custom-card q-pa-xl">
          <div class="text-subtitle1 text-weight-bold q-mb-md text-dark">Transaction Details</div>

          <q-separator class="q-mb-lg" />

          <div class="row bg-grey-2 q-pa-xs border-radius-4 q-mb-lg">
            <q-btn
              class="col border-radius-4 text-weight-bold"
              :unelevated="form.jenis === 'income'"
              :flat="form.jenis !== 'income'"
              :color="form.jenis === 'income' ? 'dark' : 'transparent'"
              :text-color="form.jenis === 'income' ? 'white' : 'grey-7'"
              label="Income"
              @click="form.jenis = 'income'"
              no-caps
            />
            <q-btn
              class="col border-radius-4 text-weight-bold"
              :unelevated="form.jenis === 'expense'"
              :flat="form.jenis !== 'expense'"
              :color="form.jenis === 'expense' ? 'dark' : 'transparent'"
              :text-color="form.jenis === 'expense' ? 'white' : 'grey-7'"
              label="Expense"
              @click="form.jenis = 'expense'"
              no-caps
            />
          </div>

          <div class="q-mb-md">
            <label class="text-caption text-weight-bold text-grey-9 q-mb-xs block">
              Transaction Name
            </label>
            <q-input
              outlined
              dense
              v-model="form.nama"
              placeholder="e.g., Monthly Membership"
              class="bg-white custom-input"
            />
          </div>

          <div class="q-mb-md">
            <label class="text-caption text-weight-bold text-grey-9 q-mb-xs block">
              Amount (Rp)
            </label>
            <q-input
              outlined
              dense
              v-model="form.jumlah"
              type="number"
              placeholder="0"
              class="bg-white custom-input"
            />
          </div>

          <div class="q-mb-lg">
            <label class="text-caption text-weight-bold text-grey-9 q-mb-xs block">
              Payment Method
            </label>
            <q-select
              outlined
              dense
              v-model="form.metode"
              :options="metodeOptions"
              placeholder="Select Bank/E-Wallet"
              class="bg-white custom-input"
              dropdown-icon="expand_more"
            />
          </div>

          <div class="row justify-end q-gutter-sm q-mt-lg">
            <q-btn
              flat
              color="dark"
              label="Cancel"
              class="border-radius-4 q-px-md"
              no-caps
              @click="kembali"
            />
            <q-btn
              unelevated
              color="dark"
              label="Save Transaction"
              class="border-radius-4 q-px-md"
              no-caps
              :loading="isSaving"
              @click="simpanTransaksi"
            />
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'

const router = useRouter()
const $q = useQuasar()

const isSaving = ref(false)
const form = reactive({
  jenis: 'income',
  nama: '',
  jumlah: '',
  metode: null,
})

const metodeOptions = ['BNI', 'Mandiri', 'BCA', 'Gopay', 'OVO', 'Dana', 'Cash']

const kembali = () => {
  router.push('/finance')
}

const simpanTransaksi = async () => {
  if (!form.nama || !form.jumlah || !form.metode) {
    $q.notify({
      message: 'Mohon lengkapi semua data transaksi!',
      color: 'warning',
      position: 'top',
    })
    return
  }

  isSaving.value = true

  try {
    const gymId = localStorage.getItem('gymId') || 12

    const today = new Date().toISOString().split('T')[0]

    const payload = {
      name: form.nama,
      amount: Number(form.jumlah),
      transactionType: form.jenis === 'income' ? 'PENDAPATAN' : 'PENGELUARAN',
      cashflowType: form.metode === 'Cash' ? 'CASH' : 'CASHLESS',
      date: today,
      note: `Transaksi: ${form.nama}`,
    }

    await api.post(`/api/v1/gym/${gymId}/cashflow`, payload)

    $q.notify({
      type: 'positive',
      icon: 'check_circle',
      message: 'Transaction saved successfully',
      position: 'top',
    })

    router.push('/finance')
  } catch (error) {
    console.error('Save transaction error:', error)
    $q.notify({
      type: 'negative',
      icon: 'error_outline',
      message: error.response?.data?.message || 'Failed to save transaction',
      position: 'top',
    })
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped lang="scss">
.custom-card {
  border-radius: 8px;
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

.border-radius-4 {
  border-radius: 4px;
}

.block {
  display: block;
}
</style>
