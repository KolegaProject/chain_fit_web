<template>
  <q-page class="q-pa-lg bg-grey-2">
    <q-card flat class="custom-card q-mb-lg bg-white shadow-1">
      <q-card-section class="header-height q-pa-md row items-center justify-between header-section">
        <div class="row items-center">
          <q-icon name="badge" color="dark" size="32px" class="q-mr-md" />
          <div class="text-h5 text-weight-bold text-dark">Gym Staff Management</div>
        </div>
        <q-btn
          unelevated
          label="Add Staff"
          icon="add"
          no-caps
          class="btn-dark q-px-md"
          @click="addMember"
        />
      </q-card-section>
    </q-card>

    <q-card flat class="custom-card shadow-1 overflow-hidden bg-white">
      <q-card-section class="q-pa-none">
        <div class="row q-pa-md border-bottom">
          <div class="col-12 col-md-4">
            <q-input
              outlined
              dense
              v-model="filter"
              placeholder="Search by name or email..."
              class="custom-input"
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
          class="dashboard-table"
          :pagination="{ rowsPerPage: 10 }"
        >
          <template v-slot:no-data v-if="loading">
            <div class="full-width">
              <div v-for="n in 5" :key="n" class="row q-pa-md items-center border-bottom">
                <div class="col-1 q-pr-md"><q-skeleton type="QAvatar" size="48px" /></div>
                <div class="col-3 q-pr-md">
                  <q-skeleton type="text" width="60%" class="q-mb-sm" />
                  <q-skeleton type="text" width="40%" />
                </div>
                <div class="col-3 q-pr-md"><q-skeleton type="text" width="50%" /></div>
                <div class="col-3 q-pr-md"><q-skeleton type="text" width="80%" /></div>
                <div class="col-2 row justify-center"><q-skeleton type="rect" width="60px" height="30px" /></div>
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
              <div class="text-subtitle2 text-weight-bold text-dark">{{ props.value }}</div>
            </q-td>
          </template>

          <template v-slot:body-cell-role="props">
            <q-td :props="props">
              <div class="text-subtitle2 text-grey-8">{{ props.value }}</div>
            </q-td>
          </template>

          <template v-slot:body-cell-email="props">
            <q-td :props="props">
              <div class="text-subtitle2 text-primary text-weight-medium" style="text-decoration: underline">
                {{ props.value }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <div class="row no-wrap justify-center q-gutter-x-sm">
                <q-btn
                  unelevated
                  label="Edit"
                  no-caps
                  class="btn-edit"
                  @click="editMember(props.row)"
                />
                <q-btn
                  unelevated
                  label="Delete"
                  no-caps
                  class="btn-delete"
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
          <q-icon name="warning" size="60px" color="negative" class="q-mb-md" />
          <div class="text-h6 text-weight-bold text-dark">Delete Staff?</div>
          <div class="text-body2 text-grey-7 q-mt-sm">
            Are you sure you want to delete <strong>{{ selectedMemberToDelete?.name }}</strong>? This action cannot be undone.
          </div>
        </q-card-section>
        <q-card-actions align="center" class="q-pb-lg q-gutter-x-md">
          <q-btn flat label="Cancel" v-close-popup class="btn-dialog-flat" no-caps />
          <q-btn
            unelevated
            label="Yes, Delete"
            class="btn-delete"
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
  { name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true },
  { name: 'role', align: 'left', label: 'Role', field: 'role', sortable: true },
  { name: 'email', align: 'left', label: 'Email', field: 'email', sortable: true },
  { name: 'actions', align: 'center', label: 'Options', field: 'actions' },
]

onMounted(() => {
  staffStore.fetchStaffData()
})

const addMember = () => router.push('/staff/tambah')
const editMember = (member) => {
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
  try {
    await staffStore.deleteStaff(gymId, selectedMemberToDelete.value.id)
    showConfirmDelete.value = false
    selectedMemberToDelete.value = null
  } catch (err) {
    console.error('Delete error:', err)
  } finally {
    deleting.value = false
  }
}
</script>

<style lang="scss" scoped>
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

.dashboard-table {
  background: transparent;
  :deep(thead tr th) {
    font-size: 14px;
    font-weight: 700;
    background-color: #f9fafb;
    color: #374151;
    padding: 12px 16px;
    border-bottom: 1px solid #e5e7eb;
  }
  :deep(tbody tr td) {
    font-size: 14px;
    padding: 16px;
    border-bottom: 1px solid #f3f4f6;
  }
}

.btn-dark {
  background-color: #111827 !important;
  color: white;
  border-radius: 4px;
  font-weight: 500;
  height: 40px;
}

.btn-edit {
  border-radius: 4px;
  border: 1px solid #111827;
  color: #111827;
  font-weight: 500;
  background-color: transparent !important;
  transition: all 0.3s ease;
  padding: 0 16px;

  &:hover {
    background-color: #111827 !important;
    color: white !important;
  }
}

.btn-delete {
  border-radius: 4px;
  background-color: #ef4444;
  color: white;
  font-weight: 500;
  padding: 0 16px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #dc2626 !important;
  }
}

.dialog-card { width: 100%; max-width: 400px; border-radius: 8px; }
.btn-dialog-flat { width: 100px; background-color: #f3f4f6; border-radius: 4px; color: #374151; }
.close-btn { position: absolute; top: 8px; right: 8px; }
.header-height { height: 68px; }
</style>
