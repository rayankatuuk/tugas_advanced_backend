# Dokumentasi Movie App Backend

## Deskripsi Proyek

Movie App adalah aplikasi streaming film dengan fitur lengkap yang dibangun menggunakan Node.js, Express, dan PostgreSQL. Backend aplikasi ini menyediakan API RESTful untuk autentikasi pengguna, manajemen film, pencarian dan pemfilteran, serta fitur upload gambar.

## Fitur Utama

1. **Autentikasi Pengguna**

   - Registrasi dengan verifikasi email
   - Login dengan JWT
   - Middleware otentikasi untuk route yang dilindungi

2. **Manajemen Film**

   - CRUD operasi untuk film
   - Relasi dengan genre dan series

3. **Query Parameter**

   - Filter berdasarkan genre dan kategori lainnya
   - Pengurutan (sort) berdasarkan berbagai field
   - Pencarian dengan kata kunci

4. **Upload Gambar**

   - Upload gambar poster film
   - Validasi tipe file dan ukuran
   - Penyimpanan aman

5. **Verifikasi Email**
   - Pengiriman token verifikasi via email
   - Validasi token untuk aktivasi akun

## Struktur Proyek

```
backend/
├── controllers/         # Logic untuk menangani request
│   ├── user.controller.js
│   ├── movie.controller.js
│   ├── genre.controller.js
│   └── ...
├── models/             # Model database Sequelize
│   ├── user.js
│   ├── movie.js
│   ├── genre.js
│   └── ...
├── routes/             # Definisi endpoint API
│   ├── user.routes.js
│   ├── movie.routes.js
│   └── ...
├── middleware/         # Middleware aplikasi
│   ├── authMiddleware.js
│   └── errorHandler.js
├── services/           # Service layer
│   └── upload.service.js
├── upload/             # Direktori untuk file yang diupload
├── app.js              # Konfigurasi Express
└── server.js           # Entry point aplikasi
```

## Endpoint API

| Endpoint        | Method | Keterangan                                | Payload                     | Params                                |
| --------------- | ------ | ----------------------------------------- | --------------------------- | ------------------------------------- |
| `/register`     | POST   | Menambah user ke database                 | -                           | -                                     |
| `/login`        | POST   | Melakukan login dengan email & password   | `{email: "", password: ""}` | -                                     |
| `/verify-email` | GET    | Untuk melakukan verifikasi token          | `{token: ""}`               | -                                     |
| `/movie`        | GET    | Mendapatkan data berdasarkan query params | -                           | `{genre: "", sortBy: "", search: ""}` |
| `/upload`       | POST   | Untuk melakukan upload gambar             | `{file: ""}`                | -                                     |

## Teknologi yang Digunakan

- Node.js & Express
- PostgreSQL & Sequelize ORM
- JWT untuk autentikasi
- Bcrypt untuk enkripsi password
- Multer untuk upload file
- Nodemailer untuk pengiriman email
- UUID untuk token verifikasi

## Import Data Awal Movies

Di folder `backend/seeder/` terdapat script untuk mengimpor data awal film ke database. Saya menggunakan supabase

### Cara Menggunakan Seeder

1. Pastikan database PostgreSQL sudah terkonfigurasi dan berjalan
2. Jalankan perintah berikut di terminal:

```bash
cd backend
node seeder/seedMovies.js
```

## Fitur Utama

### Autentikasi Pengguna

Implementasi mencakup:

- Enkripsi password dengan bcrypt
- Generasi dan validasi token JWT
- Pengiriman email verifikasi saat registrasi
- Endpoint untuk verifikasi email

### Upload File

Menggunakan multer untuk:

- Menyimpan file di direktori upload
- Memvalidasi tipe file (jpg, png, gif, webp)
- Membatasi ukuran file (5MB)
- Menggunakan nama file unik untuk menghindari konflik

### Query Parameters

Implementasi filter, sort, dan search

## Author

Dikembangkan sebagai bagian dari tugas Advanced Backend Harisenin Bootcamp.

```

```
