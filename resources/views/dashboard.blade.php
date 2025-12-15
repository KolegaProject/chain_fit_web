<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Informasi & Fasilitas - Dashboard Gym</title>
  <link rel="stylesheet" href="{{ asset('css/dashboard.css') }}" />
</head>
<body>
  <!-- ===== Sidebar ===== -->
  <aside class="sidebar">
    <div>
      <div class="logo">Logo</div>

      <div class="gym-select">
        <label for="gymList">Gym</label>
        <div class="gym-dropdown">
          <select id="gymList">
            <option>Urban Gym</option>
          </select>
          <button id="addGymBtn">+</button>
        </div>
      </div>

      <nav class="nav">
        <a href="../dashboard_arzu/index.html" class="nav-link active">Dashboard</a>
        <a href="../informations_and_facilities_rifki/index.html" class="nav-link">Informasi & Fasilitas</a>
        <a href="#" class="nav-link">Manajemen Keuangan</a>
        <a href="../staff_aryo/index.html" class="nav-link">Staff</a>
        <a href="../member_gym_bintang/index.html" class="nav-link">Anggota Gym</a>
      </nav>
    </div>
  </aside>

  <!-- ===== Main Content ===== -->
  <main class="main">
    <header class="header">
      <h2>Informasi & Fasilitas</h2>
      <div class="profile">
         <button class="bell-btn">
      <i class="bell-icon">🔔</i>
    </button>
        <img src="https://i.scdn.co/image/ab67616d00001e02d45ec66aa3cf3864205fd068" alt="Profile" />
        <span>John Doe</span>
      </div>
    </header>

    <section class="content">
  <div class="card">
    <h3 style="text-align:center; font-weight:600;">Pendaftaran Gym Baru</h3>

    <form id="gymForm" class="gym-form">
      <div class="form-grid">
        <!-- Kiri -->
        <div class="form-left">
          <label>Nama</label>
          <input type="text" placeholder="Urban Gym" required />

          <label>Lokasi</label>
          <input type="text" placeholder="Jl. Telekomunikasi No.20 blablabla..." required />
          <div class="map-box">
            <iframe
              src="https://www.google.com/maps?q=telkom+university&output=embed"
              width="100%"
              height="200"
              style="border:0; border-radius:6px;"
              allowfullscreen=""
              loading="lazy">
            </iframe>
          </div>

          <label>Catatan</label>
          <textarea placeholder="Hari Jumat tutup sementara dari 11:40 - 13.00"></textarea>

          <label>Tag</label>
          <input type="text" placeholder="Kardio, Pilates, Sauna" />

          <label>Paket Langganan</label>
          <div class="paket-add-box">+</div>
        </div>

        <!-- Kanan -->
        <div class="form-right">
          <label>Jam Operasional</label>
          <div class="days">
            <div class="day">
              <input type="checkbox" checked /> Senin
              <input type="time" value="08:30:00" /> -
              <input type="time" value="21:00:00" />
            </div>
            <div class="day">
              <input type="checkbox" checked /> Selasa
              <input type="time" value="08:30:00" /> -
              <input type="time" value="21:00:00" />
            </div>
            <div class="day">
              <input type="checkbox" /> Rabu
              <input type="time" value="08:30:00" /> -
              <input type="time" value="21:00:00" />
            </div>
            <div class="day">
              <input type="checkbox" /> Kamis
              <input type="time" value="08:30:00" /> -
              <input type="time" value="21:00:00" />
            </div>
            <div class="day">
              <input type="checkbox" checked /> Jumat
              <input type="time" value="08:30:00" /> -
              <input type="time" value="21:00:00" />
            </div>
            <div class="day">
              <input type="checkbox" checked /> Sabtu
              <input type="time" value="08:30:00" /> -
              <input type="time" value="21:00:00" />
            </div>
            <div class="day">
              <input type="checkbox" checked /> Minggu
              <input type="time" value="08:30:00" /> -
              <input type="time" value="21:00:00" />
            </div>
            <div class="day">
              <input type="checkbox" /> Buka pada Tanggal Merah
            </div>
          </div>

          <label>Foto Gym</label>
          <input type="file" />
        </div>
      </div>

      <div class="form-buttons">
        <button type="submit" class="submit">Daftar</button>
        <button type="button" class="cancel">Batal</button>
      </div>
    </form>
  </div>
</section>

  </main>

  <script src="{{ asset('js/dashboard.js') }}"></script>
</body>
</html>
