# 🏪 UMKM Sitebuilder v2 — Platform Website Toko Online No-Code Multi-Tenant

> **Platform no-code sederhana namun powerful yang memungkinkan pelaku UMKM Indonesia membuat, mengkustomisasi, dan mempublikasikan website toko online mereka tanpa keahlian coding.**

---

## 📌 Fitur Utama & Keunggulan Arsitektur

- **Multi-Tenant Single Application**: Seluruh toko UMKM berjalan dalam satu aplikasi tunggal (backend & frontend menyatu), dibedakan secara dinamis berdasarkan URL Slug toko (misal: `/toko/dapur-sambal-bu-nani`).
- **10 Desain Template Autentik**: 10 pilihan template toko dengan identitas visual, tipografi, dan *signature feature* yang disesuaikan untuk masing-masing bidang usaha UMKM.
- **Pemesanan WhatsApp Otomatis**: Integrasi tombol *Order via WA* yang menyusun rincian produk, harga satuan, dan kalkulasi total belanjaan pembeli secara rapi.
- **Kustomisasi Tanpa Koding**: Pemilik toko dapat mengubah warna aksen, mengunggah logo/banner toko, serta menyesuaikan teks hero dan informasi kontak secara instan dari Dashboard.
- **Mode Pratinjau Privat & 1-Click Publish**: Pemilik toko dapat melihat hasil perubahan secara privat (Preview Mode) sebelum dipublikasikan ke pengunjung umum.
- **SEO & Open Graph Dynamic Meta**: Setiap toko publik otomatis dilengkapi tag meta SEO dan Open Graph untuk tampilan memikat saat link toko dibagikan ke WhatsApp & sosial media.

---

## 🔑 Kredensial Akun Demo (Seeder)

Untuk mencoba langsung seluruh fitur platform (Dashboard, Manajemen Produk, Kustomisasi Layout 10 Template, dan Publish Toko), gunakan akun contoh yang sudah disediakan:

- **Email Demo**: `pemilik@umkmsitebuilder.test`
- **Password Demo**: `password`

> **Note**: Akun demo ini telah dilengkapi dengan 10 Toko Aktif (mewakili 10 bidang usaha berbeda) dan 50+ Produk contoh beserta foto produk beresolusi tinggi.

---

## 🎨 Galeri 10 Template Berkarakter

| # | Nama Template | Kategori Usaha | Signature Visual Element |
|---|---|---|---|
| 1 | **Selera Rempah Nusantara** | Kuliner & F&B | Fixed Live Receipt Order Pad (65:35 Split) + Indikator Pedas 🌶️ |
| 2 | **Wastra Couture Atelier** | Fashion & Butik | Fixed Left Sidebar Navigation (280px) + Interactive Size Selector |
| 3 | **Earthy Craft Heritage** | Kriya & Kerajinan | Artisan Process Storybook Booklet + Batch Typewriter Stamp |
| 4 | **Botanical Glow Apothecary** | Skincare & Kecantikan | Interactive Routine Step-by-Step Wizard (Step 1-2-3) |
| 5 | **Monochrome Studio Agency** | Jasa & Fotografi | Package Feature Comparison Matrix + Session Booking Slot Calculator |
| 6 | **Harvest Fresh Market** | Pertanian & Fresh | Harvest Weight Selector (500g/1kg) + Total Weight Counter (Kg) |
| 7 | **Pasar Tetangga Sembako** | Kelontong & Sembako | Quick Bulk Quantity Counter (+1/-1 Direct Table) + Wholesale Tier |
| 8 | **Digital & Custom Print Lab** | Digital & Print | File Format Selector (.PNG/.PDF/.SVG) + 300 DPI Print Spec |
| 9 | **Nordic Home Living** | Furnitur & Interior | Spatial Room Hotspot Pins + Dimension Configurator (PxLxT cm) |
| 10 | **Summit Trail Expedition** | Olahraga & Outdoor | Tactical Spec Sheet + Waterproof Rating + Altitude Tested Badge |

---

## 💻 Tech Stack

- **Backend API**: PHP 8.x, Laravel (Sanctum Token Authentication, REST API, API Resources)
- **Frontend SPA**: React, TypeScript, Vite, Tailwind CSS
- **Database**: MySQL / PostgreSQL
- **Storage**: Local Storage Disk / Cloud Storage Ready (`storage/app/public`)

---

## 🚀 Cara Instalasi & Menjalankan di Lokal (Local Setup)

### 1. Prasyarat Sistem
- PHP >= 8.1
- Composer
- Node.js >= 18.x & NPM
- MySQL Database Engine

---

### 2. Setup Backend (Laravel API)

```bash
# 1. Masuk ke direktori backend
cd backend

# 2. Install dependensi PHP
composer install

# 3. Salin file environment & konfigurasi database
cp .env.example .env

# 4. Generate Application Key
php artisan key:generate

# 5. Konfigurasi koneksi MySQL di file .env
# DB_DATABASE=umkmsitebuilder
# DB_USERNAME=root
# DB_PASSWORD=

# 6. Jalankan Migrasi & Database Seeder (Membuat Akun Demo + 10 Toko + 50 Produk)
php artisan migrate:fresh --seed

# 7. Buat Symbolic Link Storage (Agar foto produk & logo dapat diakses publik)
php artisan storage:link

# 8. Jalankan Server Development Backend (Port 8000)
php artisan serve --port=8000
```

---

### 3. Setup Frontend (React + TypeScript)

```bash
# 1. Masuk ke direktori frontend
cd ../frontend

# 2. Install dependensi Node.js
npm install

# 3. Jalankan Server Development Frontend (Port 5173)
npm run dev -- --port 5173
```

Aplikasi sekarang dapat diakses melalui browser di:
- **Landing Page**: `http://localhost:5173/`
- **Halaman Login**: `http://localhost:5173/login`
- **Dashboard Pemilik**: `http://localhost:5173/dashboard`
- **Contoh Toko Publik**: `http://localhost:5173/toko/dapur-sambal-bu-nani`

---

## 🧪 Menjalankan Pengujian (Testing)

Proyek ini telah dilengkapi dengan suite pengujian otomatis (Feature & Unit Tests) untuk memastikan seluruh alur autentikasi, manajemen produk, kustomisasi slug, dan otorisasi toko berjalan 100% aman:

```bash
# Jalankan test suite pada backend
cd backend
php artisan test
```

---

## 🌐 Panduan Deployment (Production Setup)

### 1. Deploy Frontend (React SPA) ke Vercel / Netlify
1. Hubungkan repository GitHub ke **Vercel**.
2. Set Root Directory ke `frontend`.
3. Set Build Command: `npm run build` dan Output Directory: `dist`.
4. Tambahkan Environment Variable:
   - `VITE_API_BASE_URL=https://domain-backend-anda.up.railway.app/api`

### 2. Deploy Backend (Laravel API) ke Railway / Render
1. Hubungkan repository GitHub ke **Railway** atau **Render**.
2. Set Root Directory ke `backend`.
3. Tambahkan Database MySQL di Railway/Render.
4. Tambahkan Environment Variables di Server Backend:
   - `APP_ENV=production`
   - `APP_KEY=base64:...`
   - `APP_URL=https://domain-backend-anda.up.railway.app`
   - `FRONTEND_URL=https://domain-frontend-anda.vercel.app`
5. Jalankan perintah migrasi & storage link saat build/start:
   ```bash
   php artisan migrate --force && php artisan storage:link
   ```

---

© 2026 **UMKM Sitebuilder Team**. Hak Cipta Dilindungi.
