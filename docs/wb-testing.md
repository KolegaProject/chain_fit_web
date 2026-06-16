# Blackbox Testing - Chain Fit Web

Dokumen ini berisi test case blackbox testing berdasarkan tabel yang diberikan untuk fitur utama aplikasi Chain Fit.

## Tujuan

Memverifikasi bahwa alur utama aplikasi berjalan sesuai kebutuhan pengguna dari sisi fungsional tanpa melihat implementasi internal.

## Prasyarat

- Aplikasi Chain Fit Web sudah berjalan.
- Akun Gym Owner tersedia.
- Data member, alat gym, transaksi, dan pengaturan gym tersedia untuk pengujian.

## Daftar Test Case

| Test Case ID | Test Scenario (Based on User Story) | Test Steps | Expected Result |
| --- | --- | --- | --- |
| TC-BB-001 | Melihat ringkasan pendapatan dan pengeluaran pada dashboard finansial (User Story 1) | 1. Masuk ke aplikasi sebagai Gym Owner.<br>2. Buka menu "Dashboard Finansial".<br>3. Perhatikan grafik ringkasan dan angka total pendapatan/pengeluaran. | Dashboard menampilkan grafik ringkasan finansial dan total pendapatan/pengeluaran dengan benar. |
| TC-BB-002 | Memantau kondisi peralatan gym (User Story 2) | 1. Buka menu "Monitoring Alat".<br>2. Lihat daftar status peralatan.<br>3. Klik salah satu alat yang berstatus "Rusak". | Daftar alat tampil sesuai status dan detail alat rusak dapat dibuka. |
| TC-BB-003 | Memantau riwayat kehadiran member (User Story 3) | 1. Buka menu "Absensi & Kehadiran".<br>2. Filter berdasarkan rentang tanggal tertentu.<br>3. Lihat tren grafik kunjungan. | Data kehadiran terfilter sesuai tanggal dan grafik tren kunjungan tampil. |
| TC-BB-004 | Mengelola data dan status keanggotaan member (User Story 4) | 1. Masuk ke menu "Manajemen Member".<br>2. Pilih salah satu member aktif.<br>3. Ubah statusnya menjadi "Non-Aktif".<br>4. Klik "Simpan". | Status member berhasil berubah menjadi non-aktif dan perubahan tersimpan. |
| TC-BB-005 | Mengelola catatan transaksi keuangan (User Story 5) | 1. Buka menu "Transaksi Keuangan".<br>2. Klik tombol "Tambah Catatan".<br>3. Isi data pengeluaran (misal: beli sabun/handuk).<br>4. Klik "Simpan Transaksi". | Catatan transaksi baru berhasil disimpan dan tampil di daftar transaksi. |
| TC-BB-006 | Menerima notifikasi aktivitas sistem yang penting (User Story 6) | 1. Buka ikon "Pusat Notifikasi" atau lonceng di pojok kanan atas dashboard. | Daftar notifikasi sistem tampil dan notifikasi penting dapat dibaca. |
| TC-BB-007 | Mengubah informasi operasional gym (User Story 7) | 1. Masuk ke menu "Pengaturan Gym".<br>2. Ubah jam operasional (misal: dari jam 06.00-22.00 menjadi 07.00-23.00).<br>3. Klik "Perbarui Informasi". | Informasi operasional gym berhasil diperbarui dan data baru tersimpan. |

## Cara Menjalankannya

Blackbox testing ini sudah disiapkan sebagai automated E2E test memakai Playwright.

1. Install dependency jika belum: `npm install`
2. Jalankan suite blackbox: `npm run test:wb`
3. Jika ingin menjalankan semua E2E test yang ada, pakai: `npm run test:e2e`
4. Jika ingin melihat browser saat test berjalan, pakai: `npm run test:wb -- --headed`
5. Hasil test akan tampil di terminal, dan screenshot atau trace hanya muncul kalau ada kegagalan.

## Format Hasil Pengujian

| Test Case ID | Status | Catatan |
| --- | --- | --- |
| TC-BB-001 |  |  |
| TC-BB-002 |  |  |
| TC-BB-003 |  |  |
| TC-BB-004 |  |  |
| TC-BB-005 |  |  |
| TC-BB-006 |  |  |
| TC-BB-007 |  |  |

## Catatan

- Suite otomatisnya ada di [tests/e2e/wb.spec.js](tests/e2e/wb.spec.js).
- Playwright config sudah otomatis menyalakan aplikasi lewat `webServer`, jadi tidak perlu start app manual saat menjalankan test.
- Untuk kebutuhan laporan manual, tetap bisa pakai tabel hasil pengujian di bawah.