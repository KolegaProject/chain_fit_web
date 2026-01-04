# Dokumentasi Proyek Chain Fit Web

## 📋 Ringkasan Proyek

**Chain Fit** adalah aplikasi web manajemen gym modern dengan fitur:

- **Framework**: Vue 3 + Quasar 2
- **Bahasa**: JavaScript (ES6+)
- **Router**: Vue Router 4
- **State Management**: Pinia
- **HTTP Client**: Axios
- **Build Tool**: Vite + Quasar CLI
- **Tipe**: Single Page Application (SPA)

---

## 🏗️ Arsitektur Proyek

### Struktur Direktori Utama

```
chain_fit_web/
├── src/
│   ├── App.vue                    # Root component
│   ├── router/
│   │   ├── index.js              # Konfigurasi router
│   │   └── routes.js             # Definisi routes
│   ├── layouts/
│   │   └── MainLayout.vue        # Layout utama dengan sidebar
│   ├── pages/                    # Halaman/screens aplikasi
│   │   ├── dashboard/
│   │   ├── staff/
│   │   ├── anggota/
│   │   ├── alat/
│   │   ├── InfoFacility/
│   │   ├── daftarGym/
│   │   ├── managementKeuangan/
│   │   ├── login/
│   │   ├── register/
│   │   └── error/
│   ├── components/               # Reusable components
│   ├── assets/                   # Gambar, logo, popup, alatgym, staff
│   ├── css/                      # Global styles (SCSS)
│   ├── fonts/                    # Custom fonts
│   └── boot/                     # Boot files (plugins: axios, persist, login)
├── quasar.config.js              # Konfigurasi Quasar
├── package.json                  # Dependencies & scripts
├── jsconfig.json                 # JS tooling config
├── postcss.config.js             # PostCSS config
├── eslint.config.js              # Linting config
└── index.html                    # Entry point
```

---

## 🔄 Alur Kerja / Workflow

### 1. **Startup Application**

```
Browser → index.html
    ↓
main.js (Quasar wrapper)
    ↓
App.vue (Root Component)
    ↓
Router (vue-router)
    ↓
MainLayout + Pages (sesuai route)
```

### 2. **User Flow (Alur Pengguna Utama)**

```
START
  ↓
[/login] - Login Page
  ├─ User input email & password
  ├─ Click "Login" → validasi ke API (jika sukses, simpan token)
  └─ Redirect ke /dashboard
  ↓
[/dashboard] - Dashboard Page
  ├─ Menampilkan statistik gym, ringkasan anggota, staff, alat, keuangan
  └─ Navigasi ke fitur utama
  ↓
[MainLayout] - Sidebar & Header
  ├─ Dashboard
  ├─ Daftar Gym
  ├─ Manajemen Keuangan
  ├─ Staff
  ├─ Anggota Gym
  ├─ Informasi & Fasilitas
  └─ Logout
  ↓
Staff Management (/staff)
  ├─ Lihat daftar staff (fetch dari API)
  ├─ Tambah staff (/staff/tambah) → form + upload avatar
  ├─ Edit staff (/staff/edit/:id/:userId)
  └─ Hapus staff (API)
  ↓
Member Management (/anggota)
  ├─ Lihat daftar anggota (API)
  ├─ Tambah anggota (/anggota/tambah)
  ├─ Edit anggota (/anggota/edit/:id)
  └─ Hapus anggota
  ↓
Equipment Info (/info)
  ├─ Lihat daftar alat gym (API)
  ├─ Detail alat (/info/alat/:id)
  ├─ Tambah alat (/info/alat/tambah)
  ├─ Edit alat (/info/alat/edit/:id)
  └─ Hapus alat
  ↓
Financial Management (/finance)
  └─ Manajemen keuangan gym (API)
```

---

## 🗄️ Data Management (Penyimpanan Data)

### Status Koneksi API: ✅ **SUDAH TERHUBUNG KE API**

#### Saat Ini (Current State):

- ✅ Data utama (staff, anggota, alat, gym, paket) diambil & disimpan via **API** (axios, endpoint backend)
- ✅ State management menggunakan **Pinia** (store per fitur)
- ✅ Token login disimpan di localStorage & dikirim via header Authorization
- ❌ Beberapa fitur (keuangan, validasi, error handling) masih dalam pengembangan

#### Contoh Implementasi Fetch Data Staff:

```js
// src/stores/Staff.js
async fetchStaffData() {
  const gymId = ... // dari store
  const response = await api.get(`/api/v1/gym/${gymId}/gym-staff`)
  this.rows = response.data.data
}
```

---

## 🚀 Routes & Pages

### Public Routes (Tanpa login)

| Path        | Component        | Fungsi           |
| ----------- | ---------------- | ---------------- |
| `/login`    | LoginPage.vue    | Halaman login    |
| `/register` | RegisterPage.vue | Halaman register |

### Protected Routes (Login diperlukan)

| Path                      | Component                 | Fungsi                    |
| ------------------------- | ------------------------- | ------------------------- |
| `/` (root)                | Redirect ke /dashboard    |
| `/dashboard`              | DashboardPage.vue         | Statistik & ringkasan gym |
| `/daftar-gym`             | DaftarGymPage.vue         | Daftar & pilih gym        |
| `/finance`                | ManajemenKeuanganPage.vue | Manajemen keuangan        |
| `/staff`                  | StaffPage.vue             | Daftar staff              |
| `/staff/tambah`           | TambahStaffPage.vue       | Tambah staff baru         |
| `/staff/edit/:id/:userId` | EditStaffPage.vue         | Edit data staff           |
| `/anggota`                | MemberPage.vue            | Daftar anggota/member     |
| `/anggota/tambah`         | TambahMemberPage.vue      | Tambah member baru        |
| `/anggota/edit/:id`       | EditMemberPage.vue        | Edit member               |
| `/info`                   | InfoFacilityPage.vue      | Informasi fasilitas       |
| `/info/edit`              | EditInfoFacilityPage.vue  | Edit fasilitas            |
| `/info/alat/tambah`       | TambahAlatGymPage.vue     | Tambah alat gym           |
| `/info/alat/:id`          | DetailAlatGymPage.vue     | Detail alat gym           |
| `/info/alat/edit/:id`     | EditAlatGymPage.vue       | Edit alat gym             |

---

## 🔧 Cara Kerja Fitur Utama

### 1. **Staff Management**

**File**: `StaffPage.vue`, `TambahStaffPage.vue`, `EditStaffPage.vue`, `src/stores/Staff.js`

**Flow**:

```
View Staff (Table, fetch dari API)
  ↓
Search/Filter → real-time filter
  ↓
[Tambah] → Navigate ke form (TambahStaffPage)
       ↓
     Upload foto (q-file, FormData)
     ↓
     Submit → POST ke API
     ↓
     Kembali ke daftar

[Edit] → Navigate ke edit form dengan :id/:userId
      ↓
      Load data dari API
      ↓
      Update → PUT ke API
      ↓
      Kembali

[Hapus] → Show confirm dialog
       ↓
       DELETE ke API
```

### 2. **User Interface Components**

Menggunakan **Quasar Components**:

- `q-page`, `q-card`, `q-table`, `q-btn`, `q-input`, `q-dialog`, `q-avatar`, `q-toolbar`, `q-drawer`, `q-list`, `q-form`, `q-select`, `q-skeleton`, `q-notify`, dll.

### 3. **Styling**

- **SCSS** (`css/app.scss`)
- **Quasar CSS Classes**: `q-pa-lg`, `q-mb-xl`, `text-h5`, `bg-white`, dll
- **Custom CSS**: di `<style scoped>` tiap komponen

---

## 📊 Layout Structure

### MainLayout.vue

```
┌─────────────────────────────────────┐
│          HEADER (Toolbar)           │
│  ← Title | Notifications | Profile  │
├──────────────┬──────────────────────┤
│   SIDEBAR    │                      │
│              │   PAGE CONTENT       │
│  - Dashboard │   (RouterView)       │
│  - Finance   │                      │
│  - Staff     │                      │
│  - Members   │                      │
│  - Info      │                      │
│              │                      │
└──────────────┴──────────────────────┘
```

**Sidebar Features**:

- Gym selector dropdown
- Collapsible menu (mini state)
- Navigation links
- Logo

---

## ⚙️ Configuration Files

### 1. **quasar.config.js**

- Build configuration Quasar
- Vue Router mode: `hash` (default) atau `history`
- CSS global: `app.scss`
- Extras: Roboto font, Material icons
- Vite plugins configuration

### 2. **package.json**

- **Dependencies**:
  - `vue@3.5.22`, `quasar@2.16.0`, `vue-router@4.0.0`, `@quasar/extras@1.16.4`, `axios`, `pinia`, `pinia-plugin-persistedstate`, `apexcharts`, `vue3-apexcharts`, `vue3-google-login`
- **Dev Dependencies**:
  - ESLint, Prettier, Vite, PostCSS, dll

### 3. **router/index.js & routes.js**

- Konfigurasi router utama, middleware auth, dan daftar route di `routes.js`

---

## 🔌 API Integration Status

### ✅ Sudah Terhubung ke Backend

**Indikasi dari kode**:

1. Semua data utama diambil via API (lihat src/stores/\*)
2. axios sudah di-setup di `src/boot/axios.js` (baseURL: https://gym-be.xianly.cloud/)
3. Token login otomatis dikirim di header Authorization
4. State management per fitur (staff, anggota, gym, alat, paket) pakai Pinia
5. Contoh fetch data staff:

```js
// src/stores/Staff.js
async fetchStaffData() {
  const gymId = ...
  const response = await api.get(`/api/v1/gym/${gymId}/gym-staff`)
  this.rows = response.data.data
}
```

---

## 🎨 Styling & Theme

### Color Scheme

- **Primary**: Black (#2d2d2d, #000000)
- **Background**: Grey-1, Grey-2 (light grey)
- **Accent**: White (#ffffff)
- **Negative**: Red (untuk delete/danger actions)

### Typography

- **Headings**: text-h5, text-h6 (Quasar classes)
- **Body**: text-body2, text-caption
- **Font**: Roboto (dari Quasar extras)

### Spacing

- Menggunakan Quasar spacing scale: `q-pa-lg`, `q-mb-xl`, dll
- Gap: `q-gutter-md`, `q-gutter-x-lg`

---

## 📱 Responsive Design

- **Breakpoints** menggunakan Quasar responsive classes:
  - `col-12 col-md-6` - 100% mobile, 50% desktop
  - `gt-sm` - Greater than small (desktop only)
  - `lt-md` - Less than medium (mobile only)

---

## 🚀 Cara Menjalankan Proyek

### 1. Install Dependencies

```bash
npm install
```

### 2. Development Mode

```bash
npm run dev
```

Aplikasi akan berjalan di: `http://localhost:5173`

### 3. Build untuk Production

```bash
npm run build
```

### 4. Lint & Format Code

```bash
npm run lint
npm run format
```

---

## 📚 Tech Stack Summary

| Aspek            | Teknologi             | Versi                      |
| ---------------- | --------------------- | -------------------------- |
| Framework        | Vue                   | 3.5.22                     |
| UI Library       | Quasar                | 2.16.0                     |
| Router           | Vue Router            | 4.0.0                      |
| Build Tool       | Vite                  | (via Quasar)               |
| Language         | JavaScript ES6+       | -                          |
| Styling          | SCSS                  | -                          |
| State Management | Reactive Refs (Vue 3) | -                          |
| Data Storage     | Pinia + API           | (localStorage hanya token) |
| Icons            | Material Icons        | (from Quasar)              |
| Fonts            | Roboto                | (from Quasar)              |

---

## 🔐 Keamanan & TODO Items

### Belum/Lanjutan:

- ❌ Authorization (permission checks)
- ❌ Password hashing (handled backend)
- ❌ Error handling untuk API (masih minim)
- ❌ Input validation & sanitization (perlu ditingkatkan)
- ❌ CSRF protection

### Untuk Development Selanjutnya:

1. Sempurnakan error handling & validasi form
2. Implementasi fitur keuangan & laporan
3. Tambah unit testing
4. Sempurnakan UX & loading state

---

## 📦 Project Dependencies

```json
{
  "vue": "^3.5.22",
  "quasar": "^2.16.0",
  "vue-router": "^4.0.0",
  "@quasar/extras": "^1.16.4"
}
```

---

## 📞 Kontak & Notes

**Project**: Chain Fit - Manajemen Gym
**Author**: Kolega Team
**Version**: 0.0.1
**Status**: Development (Sudah terhubung API, fitur utama CRUD via backend)

---

**Last Updated**: Januari 2026
