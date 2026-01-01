<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">
    <q-header flat class="bg-white text-black border-bottom">
      <q-toolbar class="q-py-md q-px-lg">
        <q-toolbar-title class="text-h5 text-weight-bold">
          {{ $route.meta.title || 'Dashboard' }}
        </q-toolbar-title>

        <q-space />

        <div class="row items-center q-gutter-sm">
          <q-btn flat dense icon="notifications" class="bg-grey-2 q-pa-sm" size="sm" />
          <q-avatar class="q-ml-md" size="35px">
            <img src="https://i.scdn.co/image/ab67616d00001e02d45ec66aa3cf3864205fd068" />
          </q-avatar>
          <span class="text-weight-medium q-ml-md">
            {{ authStore.user?.name || 'Tamu' }}
          </span>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      :mini="miniState"
      :width="260"
      :mini-width="80"
      class="q-pa-md overflow-hidden"
    >
      <div class="logo-container q-mb-lg no-wrap row items-center justify-between">
        <q-img
          v-if="!miniState"
          class="bg-black"
          style="height: 50px; width: 140px; border-radius: 6px"
          src="../assets/ChainFitLogo.png"
        />

        <q-avatar
          clickable
          @click="miniState = !miniState"
          v-else
          color="white"
          text-color="black"
          icon="menu"
          rounded
        />

        <q-btn
          v-if="!miniState"
          flat
          dense
          icon="chevron_left"
          color="black"
          @click.stop="miniState = true"
        />
      </div>

      <div v-if="!miniState" class="gym-section q-mb-lg">
        <div class="text-caption text-weight-bold q-mb-xs">Gym</div>
        <div class="row no-wrap q-gutter-xs">
          <q-select
            :disable="authStore.gyms.length === 0"
            outlined
            dense
            v-model="selectedGym"
            :options="gymOptions"
            class="col bg-grey-1"
          />
          <q-btn
            dense
            outline
            color="grey-4"
            text-color="black"
            icon="add"
            class="bg-white q-ml-sm"
            @click="goToDaftarGym"
          />
        </div>
      </div>

      <q-list>
        <q-item
          class="rounded-borders q-mb-md text-grey-8 q-py-sm"
          clickable
          v-ripple
          v-if="miniState"
          @click="goToDaftarGym"
        >
          <q-item-section avatar class="">
            <q-icon name="add" size="22px" />
            <q-tooltip v-if="miniState"> Add </q-tooltip>
          </q-item-section>
          <q-item-section>add</q-item-section>
        </q-item>
        <q-item
          :disable="authStore.gyms.length === 0"
          v-for="link in menuLinks"
          :key="link.title"
          clickable
          v-ripple
          :to="link.to"
          active-class="nav-active"
          class="rounded-borders q-mb-md text-grey-8 q-py-sm"
        >
          <q-item-section avatar class="">
            <q-icon :name="link.icon" size="22px" />
            <q-tooltip v-if="miniState">
              {{ link.title }}
            </q-tooltip>
          </q-item-section>
          <q-item-section>{{ link.title }}</q-item-section>
        </q-item>
      </q-list>

      <div v-if="!miniState" class="absolute-bottom q-pa-md">
        <q-btn
          flat
          class="full-width text-grey-7"
          icon="logout"
          label="Logout"
          no-caps
          align="left"
          @click="handleLogout"
        />
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue' // Tambahkan onMounted & computed
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '../stores/Auth'
import { useGymStore } from '../stores/Gym'

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()
const gymStore = useGymStore()

const leftDrawerOpen = ref(true)
const miniState = ref(false)
const gymOptions = ref([])

onMounted(async () => {
  try {
    await authStore.fetchUser()
    console.log('Data user berhasil dimuat:', authStore.user)

    // Map data gym dari authStore ke options
    gymOptions.value = authStore.gyms.map((gym) => ({
      label: gym.name,
      value: gym.id,
    }))

    console.log('Opsi gym(id):', gymStore.selectedGymId)
    // Jika store kosong (pertama kali login), set ke gym pertama
    if (gymOptions.value.length > 0 && !gymStore.selectedGymId) {
      gymStore.setSelectedGymId(gymOptions.value[0].value)
    }
  } catch (error) {
    console.error('Gagal memuat data user', error)
  }
})

const selectedGym = computed({
  get: () => {
    // Cari object option yang sesuai dengan ID yang tersimpan di store
    return gymOptions.value.find((opt) => opt.value === gymStore.selectedGymId) || null
  },
  set: (newVal) => {
    if (newVal) {
      gymStore.setSelectedGymId(newVal.value)
    }
  },
})

const handleLogout = () => {
  $q.dialog({
    title: 'Konfirmasi',
    message: 'Apakah anda yakin ingin keluar?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    authStore.logout()
    $q.notify({ type: 'positive', message: 'Berhasil keluar' })
    router.push('/login')
  })
}

const goToDaftarGym = () => router.push('/daftar-gym')

const menuLinks = [
  { title: 'Dashboard', icon: 'grid_view', to: '/dashboard' },
  { title: 'Informasi & Fasilitas', icon: 'info', to: '/info' },
  { title: 'Manajemen Keuangan', icon: 'payments', to: '/finance' },
  { title: 'Staff', icon: 'people', to: '/staff' },
  { title: 'Anggota Gym', icon: 'sentiment_satisfied_alt', to: '/anggota' },
]
</script>

<style lang="scss">
.border-bottom {
  border-bottom: 1px solid #e2e8f0;
}

.nav-active {
  background-color: #0f172a !important;
  color: white !important;
}

/* Transitions for smoother mini/full switching */
.q-drawer--mini-animate {
  transition: width 0.3s ease-in-out;
}

.logo-container {
  min-height: 60px;
}
</style>
