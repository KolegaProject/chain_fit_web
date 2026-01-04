const routes = [
  // {
  //   path: '/',
  //   component: () => import('layouts/MainLayout.vue'),
  //   children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  // },

  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: 'dashboard' },
      {
        path: 'dashboard',
        component: () => import('pages/dashboard/DashboardPage.vue'),
        meta: { title: 'Dashboard' },
      },
      {
        path: 'daftar-gym',
        component: () => import('pages/daftarGym/DaftarGymPage.vue'),
        meta: { title: 'Pendaftaran Gym' },
      },
      {
        path: 'finance',
        component: () => import('pages/managementKeuangan/ManajemenKeuanganPage.vue'),
        meta: { title: 'Manajemen Keuangan' },
      },
      {
        path: 'staff',
        component: () => import('pages/staff/StaffPage.vue'),
        meta: { title: 'Staff' },
      },
      {
        path: 'staff/tambah',
        component: () => import('pages/staff/TambahStaffPage.vue'),
      },
      {
        // :id untuk Gym, :userId untuk Staff
        path: 'staff/edit/:id/:userId',
        component: () => import('pages/staff/EditStaffPage.vue'),
      },
      {
        path: 'anggota',
        component: () => import('pages/anggota/MemberPage.vue'),
        meta: { title: 'Anggota Gym' },
      },

      {
        path: 'anggota/tambah',
        component: () => import('pages/anggota/TambahMemberPage.vue'),
      },

      {
        path: 'anggota/edit/:id',
        component: () => import('pages/anggota/EditMemberPage.vue'),
        meta: { title: 'Edit Anggota' },
      },

      {
        path: 'info',
        component: () => import('pages/InfoFacility/InfoFacilityPage.vue'),
        meta: { title: 'Informasi & Fasilitas' },
      },
      {
        path: 'info/alat/tambah',
        component: () => import('pages/alat/TambahAlatGymPage.vue'),
        meta: { title: 'Tambah Alat Gym' },
      },
      {
        path: 'info/alat/:id',
        component: () => import('pages/alat/DetailAlatGymPage.vue'),
        meta: { title: 'Detail Alat Gym' },
      },
      {
        path: 'info/alat/edit/:id',
        component: () => import('pages/alat/EditAlatGymPage.vue'),
        meta: { title: 'Edit Alat Gym' },
      },
      {
        path: 'info/edit',
        component: () => import('pages/InfoFacility/EditInfoFacilityPage.vue'),
        meta: { title: 'Edit Informasi & Fasilitas' },
      },
    ],
  },

  {
    path: '/login',
    component: () => import('pages/login/LoginPage.vue'),
  },

  {
    path: '/register',
    component: () => import('pages/register/RegisterPage.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it

  // {
  //   path: '/dashboard',
  //   component: () => import('pages/DashboardPage.vue'),
  // },

  // {
  //   path: '/staff',
  //   component: () => import('pages/StaffPage.vue'),
  // },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/error/ErrorNotFound.vue'),
  },
]

export default routes
