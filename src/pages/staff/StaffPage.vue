<template>
  <q-page class="q-pa-lg bg-grey-2">
    <q-card flat class="rounded-borders shadow-1 q-mb-lg bg-white">
      <q-card-section class="q-pa-md row items-center justify-between">
        <div class="row items-center">
          <q-icon name="badge" color="black" size="32px" class="q-mr-md" />
          <div class="text-h5 text-weight-bold">Manajemen Staff Gym</div>
        </div>
        <q-btn
          unelevated
          label="Tambah Staff"
          icon="add"
          color="black"
          no-caps
          class="rounded-borders q-px-md"
          @click="addMember"
        />
      </q-card-section>
    </q-card>

    <q-card flat class="rounded-borders shadow-1 overflow-hidden bg-white">
      <q-card-section class="q-pa-none">
        <div class="row q-pa-md border-bottom">
          <div class="col-12 col-md-4">
            <q-input
              outlined
              dense
              v-model="filter"
              placeholder="Cari nama, username, atau email..."
              class="search-input"
            >
              <template v-slot:prepend>
                <q-icon name="search" size="xs" />
              </template>
            </q-input>
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
        >
          <template v-slot:body-cell-avatar="props">
            <q-td :props="props" width="60px">
              <q-avatar size="42px" class="shadow-1">
                <img :src="props.row.avatarUrl" />
              </q-avatar>
            </q-td>
          </template>

          <template v-slot:body-cell-nama="props">
            <q-td :props="props">
              <div class="text-weight-bold text-small">{{ props.value }}</div>
              <div class="text-caption text-grey-6">{{ props.row.username }}</div>
            </q-td>
          </template>

          <template v-slot:body-cell-email="props">
            <q-td :props="props">
              <div
                class="text-blue-8 text-weight-medium text-medium"
                style="text-decoration: underline"
              >
                {{ props.value }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="text-center">
              <q-btn flat round color="blue-7" icon="edit" @click="editMember(props.row)">
                <q-tooltip>Edit Data</q-tooltip>
              </q-btn>
              <q-btn flat round color="negative" icon="delete" @click="deleteMember(props.row)">
                <q-tooltip>Hapus Staff</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="showConfirmDelete" persistent>
      <q-card class="dialog-card q-pa-md">
        <q-btn icon="close" flat round dense v-close-popup class="close-btn text-grey-6" />

        <q-card-section class="text-center q-pt-lg">
          <q-img
            src="../../assets/popup/hapus.png"
            style="width: 140px; height: auto"
            class="q-mb-md"
          />
          <div class="text-h6 text-weight-bolder">Hapus Data Staff?</div>
          <div class="text-body2 text-grey-7 q-mt-sm">
            Tindakan ini akan menghapus akses staff
            <strong>{{ selectedMemberToDelete?.nama }}</strong
            >. Data yang dihapus tidak dapat dipulihkan.
          </div>
        </q-card-section>

        <q-card-actions align="center" class="q-pb-lg q-gutter-x-md">
          <q-btn flat label="Batal" v-close-popup class="btn-dialog-flat" no-caps />
          <q-btn
            unelevated
            label="Ya, Hapus"
            class="btn-dialog-gradient"
            no-caps
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
  { name: 'nama', align: 'left', label: 'Informasi Staff', field: 'nama', sortable: true },
  { name: 'email', align: 'left', label: 'Email', field: 'email', sortable: true },
  { name: 'password', align: 'left', label: 'Password', field: 'password' },
  { name: 'actions', align: 'center', label: 'Opsi', field: 'actions' },
]

const rows = ref([
  {
    id: 1,
    nama: 'Karina',
    username: 'karinagym',
    email: 'karinaaa@gmail.com',
    password: 'karina123',
    avatarUrl: new URL('../../assets/staff/karina.jpeg', import.meta.url).href,
  },
  {
    id: 2,
    nama: 'Rora',
    username: 'roragym',
    email: 'rora@gmail.com',
    password: 'rora123',
    avatarUrl: new URL('../../assets/staff/rora.jpeg', import.meta.url).href,
  },
  {
    id: 3,
    nama: 'Rosse',
    username: 'rossegym',
    email: 'rosse@gmail.com',
    password: 'rosse123',
    avatarUrl: new URL('../../assets/staff/rosse.jpeg', import.meta.url).href,
  },
  {
    id: 4,
    nama: 'Song Min',
    username: 'songmingym',
    email: 'songmin@gmail.com',
    password: 'songmin123',
    avatarUrl: new URL('../../assets/staff/songmin.jpeg', import.meta.url).href,
  },
  {
    id: 5,
    nama: 'Winter',
    username: 'wintergym',
    email: 'winter@gmail.com',
    password: 'winter123',
    avatarUrl: new URL('../../assets/staff/wintar.jpeg', import.meta.url).href,
  },
  {
    id: 6,
    nama: 'Jennie',
    username: 'jenniegym',
    email: 'jennie@gmail.com',
    password: 'jennie123',
    avatarUrl: new URL('../../assets/staff/jennie.jpg', import.meta.url).href,
  },
  {
    id: 7,
    nama: 'Yoon Jung',
    username: 'yoonjunggym',
    email: 'yoonjung@gmail.com',
    password: 'yoonjung123',
    avatarUrl: new URL('../../assets/staff/yoonjung.jpeg', import.meta.url).href,
  },
])

const addMember = () => router.push('/staff/tambah')

const editMember = (member) => {
  router.push({
    path: `/staff/edit/${member.id}`,
    query: { ...member },
  })
}

const deleteMember = (member) => {
  selectedMemberToDelete.value = member
  showConfirmDelete.value = true
}

const executeDelete = () => {
  rows.value = rows.value.filter((r) => r.id !== selectedMemberToDelete.value.id)
  $q.notify({ type: 'positive', message: 'Staff berhasil dihapus' })
  showConfirmDelete.value = false
}
</script>

<style lang="scss" scoped>
.rounded-borders {
  border-radius: 12px;
}

.border-bottom {
  border-bottom: 1px solid #f0f0f0;
}

.staff-table {
  background: transparent;
  :deep(thead tr th) {
    font-size: small;
    font-weight: 800;
    background-color: #f8f9fa;
    color: #333;
    border-bottom: 1px solid #eee;
    padding: 16px;
  }
  :deep(tbody tr td) {
    border-bottom: 1px solid #f5f5f5;
    padding: 12px 16px;
  }
  :deep(tbody tr:hover) {
    background-color: #fafafa;
  }
}

.search-input {
  :deep(.q-field__control) {
    border-radius: 10px;
    background-color: #f8f9fa;
  }
}

.dialog-card {
  width: 100%;
  max-width: 440px;
  border-radius: 24px;
}
.btn-dialog-flat {
  width: 130px;
  background-color: #f0f2f5;
  border-radius: 12px;
  font-weight: bold;
}
.btn-dialog-gradient {
  width: 130px;
  background: linear-gradient(to bottom, #a0a0a0, #666666);
  color: white;
  border-radius: 12px;
  font-weight: bold;
}
.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: #f0f0f0;
  z-index: 10;
}
</style>
