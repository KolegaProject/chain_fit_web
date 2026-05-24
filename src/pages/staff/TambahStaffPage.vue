<template>
  <q-page class="q-pa-lg bg-grey-2">
    <q-card flat class="custom-card q-mb-lg bg-white shadow-1">
      <q-card-section class="header-height q-pa-md row items-center">
        <q-btn
          flat
          round
          icon="arrow_back"
          color="grey-7"
          size="md"
          dense
          @click="goBack"
          class="q-mr-sm"
        />
        <q-icon name="person_add" color="dark" size="32px" class="q-mr-md" />
        <div class="text-h5 text-weight-bold text-dark">Add New Staff</div>
      </q-card-section>
    </q-card>

    <q-card flat class="custom-card shadow-1 bg-white">
      <q-form @submit="submitForm">
        <q-card-section class="q-pa-xl">
          <div class="row q-col-gutter-lg">
            <div class="col-12">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <div class="text-subtitle2 q-mb-xs text-weight-bold text-dark">Full Name</div>
                  <q-input
                    outlined
                    dense
                    v-model="form.nama"
                    placeholder="e.g., John Doe"
                    class="custom-input"
                    lazy-rules
                    :rules="[(val) => !!val || 'Name is required']"
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <div class="text-subtitle2 q-mb-xs text-weight-bold text-dark">Username</div>
                  <q-input
                    outlined
                    dense
                    v-model="form.username"
                    placeholder="e.g., johndoe"
                    class="custom-input"
                    lazy-rules
                    :rules="[(val) => !!val || 'Username is required']"
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <div class="text-subtitle2 q-mb-xs text-weight-bold text-dark">Email</div>
                  <q-input
                    outlined
                    dense
                    v-model="form.email"
                    type="email"
                    placeholder="email@example.com"
                    class="custom-input"
                    lazy-rules
                    :rules="[
                      (val) => !!val || 'Email is required',
                      (val) => /.+@.+\..+/.test(val) || 'Invalid email format',
                    ]"
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <div class="text-subtitle2 q-mb-xs text-weight-bold text-dark">Password</div>
                  <q-input
                    outlined
                    dense
                    :type="showPassword ? 'text' : 'password'"
                    v-model="form.password"
                    placeholder="Min. 6 characters"
                    class="custom-input"
                    lazy-rules
                    :rules="[(val) => val.length >= 6 || 'Min. 6 characters required']"
                  >
                    <template #append>
                      <q-icon
                        :name="showPassword ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer text-grey-6"
                        @click="showPassword = !showPassword"
                      />
                    </template>
                  </q-input>
                </div>
              </div>
            </div>
          </div>

          <q-separator class="q-my-xl" />

          <div class="row justify-end q-gutter-sm">
            <q-btn flat label="Cancel" class="btn-cancel" no-caps @click="goBack" />
            <q-btn
              unelevated
              type="submit"
              label="Save Staff Data"
              class="btn-save"
              no-caps
              :loading="staffStore.loading"
            />
          </div>
        </q-card-section>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStaffStore } from 'src/stores/Staff'
import { useGymStore } from 'src/stores/Gym'

const router = useRouter()
const staffStore = useStaffStore()
const gymStore = useGymStore()
const showPassword = ref(false)

const form = ref({
  nama: '',
  username: '',
  email: '',
  password: '',
})

const goBack = () => router.push('/staff')

const submitForm = async () => {
  const gymId = gymStore.selectedGymId || 1
  const success = await staffStore.createStaff(gymId, form.value)
  if (success) {
    goBack()
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

.btn-cancel {
  border: 1px solid #d1d5db;
  border-radius: 4px;
  color: #374151;
  padding: 0 25px;
}

.btn-save {
  min-width: 180px;
  background-color: #111827 !important;
  color: white;
  border-radius: 4px;
  font-weight: 500;
  height: 40px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #1f2937 !important;
  }
}

.header-height {
  height: 68px;
}
</style>
