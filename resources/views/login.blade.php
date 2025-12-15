<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Masuk Akun Anda</title>
  <link rel="stylesheet" href="{{ asset('css/login.css') }}" />
</head>
<body>
  <div class="container">
    <!-- BAGIAN KIRI -->
    <div class="left-side">
      <div class="logo"></div>
      <div class="text-box">
        <p>
          Lorem Ipsum adalah contoh teks atau dummy dalam industri percetakan dan penataan huruf atau typesetting.
        </p>
        <p>bye Lorem</p>
      </div>
    </div>

    <!-- BAGIAN KANAN -->
    <div class="right-side">
      <div class="form-container">
        <h2>Masuk dengan Akun Anda</h2>
        <p class="subtitle">Kami Senang Anda Kembali</p>

        <form id="loginForm">
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />

          <button type="submit">Continue</button>
        </form>

        <div class="divider">
          <span>Or continue with</span>
        </div>

        <div class="social-login">
          <button class="google-btn">
            <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" />
          </button>
          <button class="facebook-btn">
            <img src="https://www.svgrepo.com/show/452196/facebook-1.svg" alt="Facebook" />
          </button>
        </div>

        <p class="register-link">
          Belum punya akun? <a href="#">Daftar</a>
        </p>
      </div>
    </div>
  </div>

  <script src="{{ asset('js/login.js') }}"></script>
</body>
</html>
