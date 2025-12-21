<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="q-mb-md text-h5 text-weight-bold">Staff</div>

    <q-card flat class="rounded-borders shadow-1">
      <q-card-section>
        <div class="text-h6 q-mb-md">Staff List</div>

        <div class="row q-col-gutter-md q-mb-lg items-center">
          <div class="col-12 col-sm-8">
            <q-input outlined dense v-model="filter" placeholder="Search staff by name or email...">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-4 text-right">
            <q-btn
              unelevated
              color="slate-dark"
              label="Tambah"
              class="full-width-sm btn-dark-custom"
              icon="add"
              @click="addStaff"
            />
          </div>
        </div>

        <q-table
          flat
          :rows="rows"
          :columns="columns"
          row-key="id"
          :filter="filter"
          binary-state-sort
          class="staff-table"
          :pagination="initialPagination"
        >
          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="text-right">
              <q-btn
                unelevated
                dense
                color="slate-dark"
                label="Edit"
                class="q-px-md q-mr-sm btn-dark-custom"
                @click="editStaff(props.row)"
              />
              <q-btn
                unelevated
                dense
                color="negative"
                label="Hapus"
                class="q-px-md"
                @click="deleteStaff(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const filter = ref('')

// Table Setup
const columns = [
  { name: 'nama', align: 'left', label: 'Nama', field: 'nama', sortable: true },
  { name: 'email', align: 'left', label: 'Email', field: 'email', sortable: true },
  { name: 'actions', align: 'right', label: 'Aksi', field: 'actions' },
]

const rows = ref([
  { id: 1, nama: 'Budi', email: 'budi@gmail.com' },
  { id: 2, nama: 'Dodit', email: 'dodit@gmail.com' },
  { id: 3, nama: 'Siti', email: 'sity@gmail.com' },
  { id: 4, nama: 'Akmal', email: 'akmal@gmail.com' },
  { id: 5, nama: 'Joko', email: 'joko@gmail.com' },
])

const initialPagination = {
  rowsPerPage: 10,
}

// Logic: Add Staff
const addStaff = () => {
  $q.dialog({
    title: 'Tambah Staff',
    message: 'Masukkan data staff baru:',
    prompt: { model: '', type: 'text', isValid: (val) => val.length > 2 }, // Simple validation
    cancel: true,
    persistent: true,
  }).onOk((name) => {
    const email = name.toLowerCase().replace(' ', '') + '@gmail.com'
    rows.value.push({
      id: Date.now(),
      nama: name,
      email: email,
    })
  })
}

// Logic: Edit Staff
const editStaff = (staff) => {
  $q.dialog({
    title: 'Edit Staff',
    message: `Edit nama untuk ${staff.email}:`,
    prompt: { model: staff.nama, type: 'text' },
    cancel: true,
  }).onOk((newName) => {
    const index = rows.value.findIndex((r) => r.id === staff.id)
    if (index > -1) rows.value[index].nama = newName
  })
}

// Logic: Delete Staff
const deleteStaff = (staff) => {
  $q.dialog({
    title: 'Konfirmasi',
    message: `Apakah Anda yakin ingin menghapus ${staff.nama}?`,
    cancel: true,
    color: 'negative',
  }).onOk(() => {
    rows.value = rows.value.filter((r) => r.id !== staff.id)
    $q.notify({ message: 'Staff dihapus', color: 'orange' })
  })
}
</script>

<style lang="scss" scoped>
// Match your theme colors
.bg-slate-dark {
  background-color: #0f172a !important;
}

.btn-dark-custom {
  background-color: #0f172a !important;
  color: white;
  border-radius: 6px;
  text-transform: none;
}

.staff-table {
  /* Remove border from the table itself since it's inside a card */
  .q-table__card {
    box-shadow: none;
  }

  th {
    font-weight: bold;
    color: #64748b;
  }
}

@media (max-width: 600px) {
  .full-width-sm {
    width: 100%;
  }
}
</style>
