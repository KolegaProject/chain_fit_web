<template>
  <q-page class="q-pa-lg bg-grey-2">

    <q-card flat class="rounded-borders shadow-1 custom-card">
      <q-card-section class="q-pa-xl">
        <div class="text-h5 text-center text-weight-bolder q-mb-xl">Staff</div>

        <div class="row q-col-gutter-md q-mb-lg items-center">
          <div class="col">
            <q-input
              outlined
              dense
              v-model="filter"
              placeholder="Search..."
              class="search-input"
            >
              <template v-slot:prepend>
                <q-icon name="search" size="xs" />
              </template>
            </q-input>
          </div>
          <div class="col-auto">
            <q-btn
              unelevated
              class="btn-tambah q-px-lg"
              label="Tambah"
              @click="addMember"
            />
          </div>
        </div>

        <q-table
          flat
          :rows="rows"
          :columns="columns"
          row-key="id"
          :filter="filter"
          class="staff-table"
          :pagination="{ rowsPerPage: 10 }"
          hide-bottom
        >
          <template v-slot:body-cell-avatar="props">
            <q-td :props="props" width="50px">
              <q-avatar size="40px" rounded>
                <img :src="props.row.avatarUrl" alt="Staff Profile" />
              </q-avatar>
            </q-td>
          </template>

          <template v-slot:body-cell-email="props">
            <q-td :props="props">
              <span class="text-underline">{{ props.value }}</span>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="text-right no-wrap">
              <q-btn
                unelevated
                dense
                label="Edit"
                class="btn-edit q-px-md q-mr-sm"
                @click="editMember(props.row)"
              />
              <q-btn
                unelevated
                dense
                label="Hapus"
                class="btn-delete q-px-md"
                @click="deleteMember(props.row)"
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

const columns = [
  { name: 'avatar', align: 'left', label: '', field: 'avatar' },
  { name: 'nama', align: 'left', label: 'Nama Staff', field: 'nama', sortable: true },
  { name: 'username', align: 'left', label: 'Username', field: 'username', sortable: true },
  { name: 'email', align: 'left', label: 'Email', field: 'email', sortable: true },
  { name: 'password', align: 'left', label: 'Pasword', field: 'password' }, // Mengikuti typo "Pasword" di desain
  { name: 'actions', align: 'right', label: '', field: 'actions' },
]

const rows = ref([
  {
    id: 1,
    nama: 'Karina',
    username: 'karinagym',
    email: 'karinaaa@gmail.com',
    password: 'karina123',
    // ASSET FOTO: Ganti URL di bawah ini dengan path lokal/asset Anda
    avatarUrl: new URL('../../assets/staff/karina.jpeg', import.meta.url).href  },
  {
    id: 2,
    nama: 'Rora',
    username: 'roragym',
    email: 'rora@gmail.com',
    password: 'rora123',
    avatarUrl: new URL('../../assets/staff/rora.jpeg', import.meta.url).href
  },
  {
    id: 3,
    nama: 'Rosse',
    username: 'rossegym',
    email: 'rosse@gmail.com',
    password: 'rosse123',
    avatarUrl: new URL('../../assets/staff/rosse.jpeg', import.meta.url).href
  },
  {
    id: 4,
    nama: 'Song Min',
    username: 'songmingym',
    email: 'songmin@gmail.com',
    password: 'songmin123',
    avatarUrl: new URL('../../assets/staff/songmin.jpeg', import.meta.url).href
  },
  {
    id: 5,
    nama: 'Winter',
    username: 'wintergym',
    email: 'winter@gmail.com',
    password: 'winter123',
    avatarUrl: new URL('../../assets/staff/wintar.jpeg', import.meta.url).href
  },
  {
    id: 6,
    nama: 'Jennie',
    username: 'jenniegym',
    email: 'jennie@gmail.com',
    password: 'jennie123',
    avatarUrl: new URL('../../assets/staff/jennie.jpg', import.meta.url).href
  },
  {
    id: 7,
    nama: 'Yoon Jung',
    username: 'yoonjunggym',
    email: 'yoonjung@gmail.com',
    password: 'yoonjung123',
    avatarUrl: new URL('../../assets/staff/yoonjung.jpeg', import.meta.url).href
  },




  // ... ulangi data lainnya
])

// Functions (simple, working implementations)
const addMember = () => {
  // placeholder: open form/dialog or navigate to add page later
  $q.notify({ type: 'info', message: 'Tambah anggota (placeholder)' })
}

const editMember = (member) => {
  if (!member) return
  // placeholder: open edit form/dialog or navigate to edit page later
  $q.notify({ type: 'info', message: `Edit anggota: ${member.nama}` })
}

const deleteMember = (member) => {
  if (!member) return
  $q.dialog({
    title: 'Konfirmasi',
    message: `Hapus anggota "${member.nama}"?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    rows.value = rows.value.filter(r => r.id !== member.id)
    $q.notify({ type: 'positive', message: 'Anggota dihapus' })
  }).onCancel(() => {
    // cancelled
  })
}
</script>

<style lang="scss" scoped>
.custom-card {
  border-radius: 12px;
}

.search-input {
  max-width: 100%;
  :deep(.q-field__control) {
    border-radius: 8px;
  }
}

.btn-tambah {
  background-color: #0c0c0c;
  color: white;
  border-radius: 8px;
  text-transform: none;
  font-weight: bold;
  height: 40px;
}

.btn-edit {
  background-color: #2563eb;
  color: white;
  text-transform: none;
  border-radius: 6px;
  font-weight: 500;
}

.btn-delete {
  background-color: #ef4444;
  color: white;
  text-transform: none;
  border-radius: 6px;
  font-weight: 500;
}

.text-underline {
  text-decoration: underline;
  cursor: pointer;
}

.staff-table {
  background: transparent;

  :deep(thead tr th) {
    font-size: 15px;
    font-weight: 800; /* Extra Bold sesuai desain */
    color: #000000;
    border-bottom: none;
    padding-bottom: 20px;
  }

  :deep(tbody tr td) {
    font-size: 14px;
    color: #000000;
    border-bottom: none;
    padding-top: 12px;
    padding-bottom: 12px;
  }

  /* Membuat baris belang (zebra) jika diperlukan,
     tapi desain Anda terlihat bersih putih */
  :deep(tbody tr:nth-child(even)) {
    background-color: #f8fafc;
  }
}
</style>
