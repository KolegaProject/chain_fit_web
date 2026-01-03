<template>
  <q-page class="q-pa-lg bg-grey-2">
    <q-card flat class="rounded-borders shadow-1 q-mb-lg bg-white">
      <q-card-section class="header-height q-pa-md row items-center justify-between header-section">
        <div class="row items-center">
          <div style="width: 42px" v-if="false"></div>
          <q-icon name="badge" color="black" size="32px" class="q-mr-md" />
          <div class="text-h5 text-weight-bold">Manajemen Staff Gym</div>
        </div>
        <q-btn
          unelevated
          label="Tambah Staff"
          icon="add"
          color="primary"
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
              placeholder="Cari nama atau email..."
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
          :rows="loading ? [] : rows"
          :columns="columns"
          row-key="id"
          :filter="filter"
          class="staff-table"
          :pagination="{ rowsPerPage: 10 }"
        >
          <template v-slot:no-data v-if="loading">
            <div class="full-width">
              <div v-for="n in 5" :key="n" class="row q-pa-md items-center border-bottom">
                <div class="col-1 q-pr-md">
                  <q-skeleton type="QAvatar" size="48px" />
                </div>
                <div class="col-3 q-pr-md">
                  <q-skeleton type="text" width="60%" class="q-mb-sm" />
                  <q-skeleton type="text" width="40%" />
                </div>
                <div class="col-3 q-pr-md">
                  <q-skeleton type="text" width="50%" />
                </div>
                <div class="col-3 q-pr-md">
                  <q-skeleton type="text" width="80%" />
                </div>
                <div class="col-2 row justify-center">
                  <q-skeleton type="rect" width="60px" height="30px" />
                </div>
              </div>
            </div>
          </template>

          <template v-slot:body-cell-avatar="props">
            <q-td :props="props" width="80px">
              <q-avatar size="48px" color="grey-3" text-color="grey-8">
                <img v-if="props.row.profileImage" :src="props.row.profileImage" />
                <q-icon v-else name="person" size="28px" />
              </q-avatar>
            </q-td>
          </template>

          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              <div class="text-subtitle2 text-weight-bold text-grey-10">{{ props.value }}</div>
            </q-td>
          </template>

          <template v-slot:body-cell-role="props">
            <q-td :props="props">
              <div class="text-subtitle2 text-grey-8">{{ props.value }}</div>
            </q-td>
          </template>

          <template v-slot:body-cell-email="props">
            <q-td :props="props">
              <div
                class="text-subtitle2 text-blue-8 text-weight-medium"
                style="text-decoration: underline"
              >
                {{ props.value }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <div class="row no-wrap justify-center q-gutter-x-sm">
                <q-btn
                  flat
                  round
                  color="blue-7"
                  icon="edit"
                  size="md"
                  @click="editMember(props.row)"
                />
                <q-btn
                  flat
                  round
                  color="negative"
                  icon="delete"
                  size="md"
                  @click="deleteMember(props.row)"
                />
              </div>
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
            Hapus staff <strong>{{ selectedMemberToDelete?.name }}</strong
            >? Data tidak dapat dipulihkan.
          </div>
        </q-card-section>
        <q-card-actions align="center" class="q-pb-lg q-gutter-x-md">
          <q-btn flat label="Batal" v-close-popup class="btn-dialog-flat" no-caps />
          <q-btn
            unelevated
            label="Ya, Hapus"
            class="btn-dialog-gradient"
            no-caps
            :loading="deleting"
            @click="executeDelete"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStaffStore } from 'src/stores/Staff'
import { storeToRefs } from 'pinia'
import { useGymStore } from 'src/stores/Gym'

const gymStore = useGymStore()
const router = useRouter()
const staffStore = useStaffStore()
const { rows, loading } = storeToRefs(staffStore)

const filter = ref('')
const showConfirmDelete = ref(false)
const selectedMemberToDelete = ref(null)
const deleting = ref(false)

const columns = [
  { name: 'avatar', align: 'left', label: '', field: 'profileImage' },
  { name: 'name', align: 'left', label: 'Nama', field: 'name', sortable: true },
  { name: 'role', align: 'left', label: 'Role', field: 'role', sortable: true },
  { name: 'email', align: 'left', label: 'Email', field: 'email', sortable: true },
  { name: 'actions', align: 'center', label: 'Opsi', field: 'actions' },
]

onMounted(() => {
  staffStore.fetchStaffData()
})

const addMember = () => router.push('/staff/tambah')
const editMember = (member) => {
  // Ambil ID Gym dari store agar konsisten
  const gymId = gymStore.selectedGymId || 1
  router.push(`/staff/edit/${gymId}/${member.id}`)
}

const deleteMember = (member) => {
  selectedMemberToDelete.value = member
  showConfirmDelete.value = true
}

const executeDelete = async () => {
  if (!selectedMemberToDelete.value) return

  deleting.value = true

  const gymId = gymStore.selectedGymId || 1

  const success = await staffStore.deleteStaff(gymId, selectedMemberToDelete.value.id)

  if (success) {
    showConfirmDelete.value = false
    selectedMemberToDelete.value = null
  }

  deleting.value = false
}
</script>

<style lang="scss" scoped>
.staff-table {
  background: transparent;

  :deep(thead tr th) {
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.75rem;
    letter-spacing: 0.00937em;
    color: #222;
    background-color: #f8f9fa;
    padding: 18px 16px;
  }

  :deep(tbody tr td) {
    font-size: 15px;
    color: #333;
    padding: 16px;
    border-bottom: 1px solid #f5f5f5;
  }

  :deep(tbody tr:hover) {
    background-color: #fafafa;
  }
}

.search-input {
  font-size: 15px;
  :deep(.q-field__control) {
    height: 48px;
    border-radius: 10px;
  }
}

.rounded-borders {
  border-radius: 12px;
}
.border-bottom {
  border-bottom: 1px solid #f0f0f0;
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
  background: black;
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

.header-height {
  height: 68px;
}
</style>
