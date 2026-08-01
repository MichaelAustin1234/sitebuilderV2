# AGENTS.md

Panduan ini untuk AI coding agent (Antigravity/Gemini, Claude Code, dll) yang bekerja di proyek ini. Baca sebelum membuat atau mengubah file apapun.

## Tentang Proyek

UMKM Sitebuilder v2 — platform no-code yang memungkinkan pelaku UMKM membuat, mengkustomisasi, dan mempublikasikan website toko mereka sendiri tanpa keahlian coding.

Arsitektur: **multi-tenant dalam satu aplikasi**. Semua toko UMKM hidup di dalam satu backend + satu frontend yang sama, dibedakan lewat routing berbasis slug toko (mis. `/toko/warung-budi`) dan data di database — BUKAN deployment terpisah per toko. Jangan buat mekanisme yang men-generate deployment Vercel baru per toko; ini di luar scope proyek.

## Alur Pengguna (User Flow)

1. **Landing page** — halaman marketing platform, ajakan daftar toko
2. **Registrasi & login** — pemilik UMKM buat akun + toko
3. **Dashboard toko** — ringkasan status toko (draft/published), jumlah produk
4. **Pemilihan & kustomisasi layout** — pilih dari galeri template (dengan thumbnail preview), lalu kustomisasi (warna, teks, logo/banner)
5. **Manajemen produk** — CRUD produk: nama, harga, foto, deskripsi, kategori
6. **Preview real-time** — pratinjau toko sebelum publish, terpisah dari mode live
7. **Publish/deploy** — toko jadi bisa diakses publik lewat URL unik (mis. `sitebuilder-domain.vercel.app/toko/{slug}`)

## Tech Stack

- Backend: PHP 8.x, Laravel (versi stabil terbaru), REST API
- Frontend: React + TypeScript + Tailwind CSS
- Database: MySQL
- Storage file (foto produk, logo): simpan path di database, file fisik di storage lokal Laravel (`storage/app/public`) untuk development; jangan asumsikan ada layanan cloud storage kecuali diminta
- Auth: Laravel Sanctum untuk autentikasi API (token-based, cocok untuk SPA React terpisah)

## Deployment

- Frontend React → Vercel (gratis)
- Backend Laravel (API) → Railway atau Render (Vercel tidak menjalankan PHP secara native — jangan sarankan deploy Laravel ke Vercel)
- Database MySQL → menyatu dengan layanan backend (Railway/Render) atau PlanetScale
- Toko pelanggan akhir diakses lewat subdomain/path pada domain gratis dari Vercel — tidak ada domain custom berbayar dalam scope ini
- Setiap kali menambah variabel environment baru, WAJIB update `.env.example` juga (jangan biarkan file ini basi) — penting supaya proyek gampang di-setup ulang oleh siapapun yang clone repo, termasuk saat recruiter mencoba menjalankannya sendiri.

## Prinsip Desain Template — WAJIB DIBACA, INI PALING PENTING

Tujuan utama proyek ini adalah portofolio yang menonjol, BUKAN cuma "berfungsi". Template yang dihasilkan tidak boleh terlihat seperti hasil AI generik. Ikuti aturan ini ketat:

- **Setiap template HARUS punya identitas visual yang benar-benar berbeda** satu sama lain — bukan cuma beda warna dari struktur HTML/komponen yang sama. Beda struktur layout, beda perlakuan tipografi, beda "kepribadian" (mis. satu template untuk kuliner terasa hangat dan organik, satu untuk fashion terasa clean dan editorial, satu untuk kerajinan terasa earthy dan bertekstur).
- **HINDARI 4 pola default AI generik ini** — jangan pakai kecuali memang dipilih secara sadar dan punya alasan kuat untuk brief tertentu:
  1. Background krem hangat (~#F4F1EA) + serif display kontras tinggi + aksen terracotta/warm-clay (~#D97757)
  2. Background nyaris hitam + satu aksen hijau/vermillion terang
  3. Layout ala broadsheet/koran — hairline rules, border-radius nol, kolom rapat
  4. **Warna biru/ungu/indigo sebagai warna utama atau gradasi** (mis. gradasi biru-ke-ungu, ungu-ke-pink) — ini warna "default AI/SaaS" yang paling sering muncul dan langsung terlihat seperti template AI generik. Palet warna tiap template harus diturunkan dari karakter usaha UMKM-nya (mis. kuliner: warna hangat earthy seperti terracotta/mustard/hijau zaitun; kerajinan: warna natural seperti coklat kayu/krem/hijau sage; fashion: bisa monokrom tegas atau warna berani sesuai brand, TAPI hindari biru-ungu sebagai default pilihan aman).
- **Tiap template minimal harus punya:** palet warna sendiri (4-6 hex bernama, bukan asal pilih), pasangan tipografi sendiri (display + body + utility, jangan font yang sama dipakai ulang di semua template), konsep layout sendiri, dan satu "signature element" — satu hal unik yang jadi ciri khas template itu.
- **Sebelum implementasi tiap template**, agent harus tulis dulu rencana desainnya singkat (token warna, tipografi, layout, signature element) dan mengecek: apakah ini pilihan sadar untuk konteks UMKM tersebut, atau jawaban template yang akan muncul di brief manapun? Kalau jawabannya generik, revisi dulu sebelum coding.
- Konten dummy/contoh di tiap template harus terasa relevan dengan jenis usahanya (nama produk, kategori, gaya penulisan deskripsi) — bukan Lorem Ipsum atau "Nama Produk 1/2/3".
- Tetap jaga kualitas dasar di semua template: responsif sampai mobile, fokus keyboard terlihat jelas, hormati preferensi reduced-motion pengguna.
- Animasi/motion dipakai secukupnya dan bertujuan (mis. transisi hover, reveal saat scroll) — jangan berlebihan, animasi yang terlalu banyak justru membuat kesan "dibuat AI".

## Detail Fitur & Aturan Bisnis

### Toko & Slug
- Slug dibuat otomatis dari nama toko (lowercase, spasi jadi `-`, hapus karakter selain huruf/angka/strip).
- User boleh edit slug secara manual sebelum publish pertama kali; setelah published, ubah slug harus lewat konfirmasi eksplisit (karena akan mengubah URL publik yang mungkin sudah dibagikan).
- Kalau slug bentrok dengan toko lain, tolak dan minta user pilih slug lain (jangan auto-tambah angka tanpa sepengetahuan user — ini bisa membingungkan).
- Nama toko: wajib diisi, 3-50 karakter.

### Produk
- Nama produk: wajib, 3-100 karakter.
- Harga: wajib, angka, harus > 0.
- Deskripsi: opsional, maksimal 500 karakter.
- Kategori: pilih dari daftar kategori per toko (user bisa buat kategori sendiri) atau kosong ("Tanpa kategori").
- Foto produk: format jpg/png/webp saja, ukuran maksimal 2MB per file, minimal 1 foto per produk direkomendasikan tapi tidak wajib.

### Upload Gambar (logo, banner, foto produk)
- Validasi tipe file di sisi server (jangan percaya ekstensi file saja — cek MIME type asli).
- Ukuran maksimal: 2MB per file.
- Resize otomatis ke ukuran wajar (mis. maksimal 1600px sisi terpanjang) sebelum disimpan, untuk menghemat storage dan mempercepat loading.

### Galeri Template
- Sediakan **10 template** dengan identitas visual berbeda total (lihat Prinsip Desain Template di atas) — 10 template berkualitas tinggi yang benar-benar berbeda, bukan variasi warna dari struktur yang sama.
- Kategori jenis usaha yang perlu dicover (10 kategori, pilih karakter visual sejauh mungkin berbeda satu sama lain): kuliner/F&B, fashion/butik, kerajinan tangan/kriya, kecantikan & perawatan (skincare/salon), jasa profesional (fotografi/konsultan/percetakan), pertanian/produk segar (sayur/buah/madu), toko kelontong/sembako, produk digital/percetakan custom, dekorasi rumah/furnitur, olahraga & outdoor.
- Tiap template baru WAJIB melalui proses yang sama seperti template pertama: rencana desain dulu (palet, tipografi, layout, signature element) → cek apakah genuinely beda dari SEMUA template yang sudah ada sebelumnya (bukan cuma yang terakhir dibuat) → baru implementasi. Kalau jumlah template sudah banyak (mendekati 10), agent wajib eksplisit menulis daftar template yang sudah ada beserta ciri khasnya masing-masing sebelum merancang yang baru, untuk memastikan tidak ada duplikasi karakter.
- Tiap template punya thumbnail preview asli (screenshot render template, bukan placeholder gambar) yang ditampilkan di galeri pemilihan.
- Kustomisasi yang boleh diubah user per template: warna aksen (dari palet terbatas yang tetap harmonis dengan desain template), logo, banner, teks (nama toko, tentang kami, kontak). User TIDAK bebas mengubah struktur layout/tipografi template — itu yang menjaga kualitas visual tetap terjaga.

### Halaman Publik Toko
Struktur halaman publik toko (yang diakses pengunjung via slug) minimal terdiri dari:
- Halaman utama toko: banner/hero, tentang singkat, daftar produk (grid/list sesuai desain template)
- Halaman detail produk: foto, nama, harga, deskripsi lengkap
- Bagian kontak (nomor WA/telepon, alamat jika diisi) — cukup sebagai bagian di halaman utama, tidak perlu halaman terpisah di versi awal

### Preview vs Publish
- Mode preview: hanya bisa diakses pemilik toko yang sedang login, menampilkan perubahan belum tersimpan/belum published.
- Mode publish: begitu user klik "Terbitkan", data tersimpan sebagai versi live dan halaman publik toko langsung menampilkan versi ini ke pengunjung.

## Konfigurasi Cross-Domain (CORS)

Frontend (Vercel) dan backend (Railway/Render) berada di domain berbeda. Wajib:
- Konfigurasi `config/cors.php` di Laravel agar mengizinkan domain frontend Vercel (termasuk domain preview Vercel yang biasanya berpola `*-git-*.vercel.app` saat development).
- Karena pakai Sanctum token-based (bukan cookie session), pastikan request dari frontend mengirim header `Authorization: Bearer {token}`, bukan mengandalkan cookie — ini menghindari masalah CORS/cookie cross-site yang jauh lebih rumit.
- Simpan URL frontend sebagai variabel environment (`FRONTEND_URL`) di backend, jangan hardcode.

## SEO Dasar Halaman Publik Toko

Karena produk ini adalah "website" sungguhan untuk UMKM, tiap halaman toko publik wajib punya:
- `<title>` dinamis berisi nama toko (bukan judul generik seperti "Toko Online")
- Meta description dari kolom "tentang toko" (potong ke ~150 karakter kalau perlu)
- Open Graph tag dasar (og:title, og:description, og:image pakai logo/banner toko) supaya link toko terlihat baik saat dibagikan ke WhatsApp/media sosial — ini penting untuk UMKM yang biasanya promosi lewat WA/IG

## Kondisi Kosong & Gagal (Empty & Error States)

- Toko belum ada produk: tampilkan pesan jelas + ajakan aksi (mis. "Belum ada produk. Tambahkan produk pertama Anda." + tombol tambah), bukan halaman kosong tanpa keterangan.
- Upload gagal (format salah/ukuran kelebihan): tampilkan alasan spesifik ("Ukuran file melebihi 2MB" atau "Format tidak didukung, gunakan JPG/PNG/WEBP"), bukan pesan generik "Terjadi kesalahan".
- Toko belum di-publish: pengunjung yang akses slug toko berstatus draft harus dapat halaman "Toko belum tersedia" yang jelas, bukan error 500 atau halaman kosong.
- Ikuti nada bicara aktif dan spesifik untuk semua pesan sistem — jelaskan apa yang terjadi dan bagaimana mengatasinya, bukan cuma "Error" atau "Gagal".

## Konvensi Git

- Commit message format: `<tipe>: <deskripsi singkat>` (mis. `feat: tambah CRUD produk`, `fix: validasi upload gambar`, `test: tambah test publish toko`).
- Satu commit untuk satu perubahan logis — jangan gabungkan banyak fitur tidak berkaitan dalam satu commit.
- Buat branch terpisah per fitur besar kalau bekerja bertahap (mis. `feature/manajemen-produk`), merge ke main setelah fitur selesai dan test lulus.

## Keamanan & Skalabilitas Dasar

- **Rate limiting endpoint auth** — pasang Laravel throttle middleware pada endpoint login/registrasi (mis. maksimal 5 percobaan per menit per IP) untuk mencegah brute force.
- **Alt text gambar produk** — setiap foto produk wajib punya atribut alt yang bermakna (otomatis dari nama produk kalau user tidak isi manual), bukan dikosongkan. Ini membantu aksesibilitas sekaligus SEO.
- **Pagination daftar produk** — halaman publik toko dan dashboard manajemen produk wajib dipaginasi (mis. 12-20 produk per halaman), jangan load semua produk sekaligus tanpa batas.

## README.md untuk Manusia (Terpisah dari AGENTS.md)

Di akhir proyek, buat `README.md` terpisah yang ditujukan untuk pembaca manusia (recruiter/reviewer), bukan AI agent. Isinya wajib mencakup:
- Deskripsi singkat proyek + screenshot tiap template
- Cara install & run lokal (langkah composer install, npm install, migrate, seed, serve)
- **Kredensial akun demo** (email + password akun contoh yang sudah di-seed) supaya reviewer bisa langsung coba tanpa perlu daftar akun sendiri
- Link demo live (setelah deploy)

## Konvensi Kode

- PSR-12 untuk gaya kode PHP.
- Logika bisnis dipisah ke **Service/Action classes** (`app/Actions/` atau `app/Services/`), controller hanya orkestrasi request-response.
- Gunakan Eloquent + migration untuk semua tabel; hindari raw query kecuali perlu dan didokumentasikan alasannya.
- Response API selalu lewat Laravel API Resource (`JsonResource`).
- Komponen React dipisah per fitur (`components/toko/`, `components/produk/`, `components/layout-editor/`, `components/templates/{nama-template}/`), gunakan TypeScript strict, hindari `any`.
- Styling pakai Tailwind utility classes; kalau satu template butuh gaya visual yang tidak bisa dicapai lewat utility class standar (mis. custom font pairing, efek tekstur), boleh tambah CSS terpisah khusus template itu — jangan paksakan semua template terlihat sama demi kemudahan teknis.

## Struktur Data Inti (skema awal, bisa berkembang)

- `users` — pemilik akun (default Laravel + Sanctum)
- `toko` — user_id, nama_toko, slug (unik), status (draft/published), template_id, konfigurasi_layout (JSON: warna_aksen, logo_path, banner_path, teks_kustom, kontak)
- `template` — id, nama, deskripsi, thumbnail_path, token_desain (JSON: palet warna, font, deskripsi signature element)
- `kategori` — toko_id, nama
- `produk` — toko_id, kategori_id (nullable), nama, harga, deskripsi, foto_path

Jangan ubah skema tanpa migration baru — jangan edit migration lama yang sudah dijalankan.

## Testing

- Setiap Service/Action class wajib punya test (Pest atau PHPUnit): kasus normal DAN kasus gagal (slug duplikat, upload file gagal/format salah, validasi form salah, harga negatif, dll).
- Test rute penting: registrasi, login, CRUD produk, pemilihan template, publish toko, akses halaman publik toko via slug (termasuk slug yang tidak ada → 404 yang jelas).
- Jalankan test dengan:
  ```
  php artisan test
  ```
  atau:
  ```
  ./vendor/bin/pest
  ```

## Yang Harus Dihindari

- Jangan buat mekanisme deploy-per-toko ke Vercel API — arsitekturnya multi-tenant satu aplikasi.
- Jangan taruh kredensial/API key langsung di kode — selalu lewat `.env` dan `config/`, dan selalu update `.env.example`.
- Jangan gabungkan seluruh logika fitur jadi satu Controller method besar — pecah per Service/Action agar mudah diuji.
- Jangan asumsikan ada layanan cloud storage/CDN kecuali sudah dikonfirmasi dan dikonfigurasi eksplisit.
- Jangan buat template yang cuma beda warna dari struktur yang sama — lihat Prinsip Desain Template.
- Jangan pakai Lorem Ipsum atau konten placeholder generik untuk data contoh/seeder — buat data dummy yang terasa nyata dan relevan dengan jenis usahanya.

## Sebelum Menyelesaikan Task

- Pastikan migration bisa jalan bersih dari awal: `php artisan migrate:fresh --seed`
- Pastikan seeder menghasilkan minimal 2-3 toko dummy dengan jenis usaha berbeda (mis. kuliner, fashion, kerajinan), tiap toko pakai template berbeda, lengkap dengan produk contoh yang relevan.
- Jalankan test sebelum menganggap task selesai.
- Pecah task besar (mis. "buat fitur manajemen produk") menjadi langkah kecil (migration → model → controller → test → frontend) dan minta review tiap tahap, bukan sekaligus.
- Untuk task yang menyangkut template/desain, ikuti proses di Prinsip Desain Template: rencana singkat dulu → cek apakah generik → revisi kalau perlu → baru implementasi.
