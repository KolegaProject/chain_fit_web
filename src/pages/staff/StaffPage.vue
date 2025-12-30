<template>
  <q-page class="q-pa-lg bg-grey-2">
    <q-card flat class="rounded-borders shadow-1 q-mb-xl custom-card">
      <q-card-section class="q-pa-xl">
        <div class="text-h5 text-center text-weight-bolder q-mb-xl">Staff Gym</div>

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
            <q-td :props="props" width="60px">
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

    <q-dialog v-model="showConfirmDelete" persistent>
      <q-card class="dialog-card q-pa-lg text-center">
        <q-btn icon="close" flat round dense v-close-popup class="close-btn text-grey-6" />

        <q-card-section class="q-pt-md">
          <q-img
            src="../../assets/popup/hapus.png"
            style="width: 150px; height: auto"
            class="q-mb-md"
          />

          <div class="text-h6 text-weight-bolder q-mb-sm">Apakah Anda yakin ingin melanjutkan?</div>
          <div class="text-body2 text-grey-8">
            Data staff yang dihapus tidak dapat dipulihkan.
          </div>
        </q-card-section>

        <q-card-actions align="center" class="q-pb-md q-gutter-x-md">
          <q-btn
            flat
            label="Batal"
            v-close-popup
            class="btn-action-dialog btn-batal-dialog"
            no-caps
          />
          <q-btn
            unelevated
            label="Ya, Hapus Data"
            class="btn-action-dialog btn-konfirmasi-dialog"
            no-caps
            v-close-popup
            @click="executeDelete"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()
const filter = ref('')

const showConfirmDelete = ref(false)
const selectedMemberToDelete = ref(null)

const columns = [
  { name: 'avatar', align: 'left', label: '', field: 'avatar' },
  { name: 'nama', align: 'left', label: 'Nama Staff', field: 'nama', sortable: true },
  { name: 'username', align: 'left', label: 'Username', field: 'username', sortable: true },
  { name: 'email', align: 'left', label: 'Email', field: 'email', sortable: true },
  { name: 'password', align: 'left', label: 'Password', field: 'password' },
  { name: 'actions', align: 'right', label: '', field: 'actions' },
]

const rows = ref([
  {
    id: 1,
    nama: 'Karina',
    username: 'karinagym',
    email: 'karinaaa@gmail.com',
    password: 'karina123',
    avatarUrl: new URL('../../assets/staff/karina.jpeg', import.meta.url).href
  },
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
])

const addMember = () => {
  router.push('/staff/tambah')
}

const editMember = (member) => {
  if (!member) return
  router.push({
    path: `/staff/edit/${member.id}`,
    query: {
      nama: member.nama,
      username: member.username,
      email: member.email,
      avatarUrl: member.avatarUrl
    }
  })
}

const deleteMember = (member) => {
  if (!member) return
  selectedMemberToDelete.value = member
  showConfirmDelete.value = true
}

const executeDelete = () => {
  if (!selectedMemberToDelete.value) return

  rows.value = rows.value.filter(r => r.id !== selectedMemberToDelete.value.id)

  $q.notify({ type: 'positive', message: 'Anggota berhasil dihapus' })

  // Reset state
  showConfirmDelete.value = false
  selectedMemberToDelete.value = null
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
    font-size: 16px;
    font-weight: 800;
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
  :deep(tbody tr:nth-child(even)) {
    background-color: #f8fafc;
  }
  :deep(tbody tr:nth-child(odd)) {
    background-color: #ffffff;
  }
}

.dialog-card {
  width: 100%;
  max-width: 450px;
  border-radius: 20px;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #f0f0f0;
}

.btn-action-dialog {
  width: 140px;
  height: 44px;
  border-radius: 12px;
  font-weight: bold;
}

.btn-batal-dialog {
  background: #f0f0f0;
  color: black;
}

.btn-konfirmasi-dialog {
  background: linear-gradient(to bottom, #a0a0a0, #666666);
  color: white;
}
</style>
