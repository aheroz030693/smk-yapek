# Panduan Menjalankan Portal SMK YAPEK Gombong di MySQL / XAMPP
## (100% NATIVE PHP & MYSQL — TANPA MENGGUNAKAN API)

Portal SMK YAPEK Gombong dapat dijalankan **100% tanpa menggunakan API eksternal atau server REST API**. Cukup gunakan web server **Apache + MySQL / MariaDB bawaan XAMPP**, seluruh data disimpan dan diproses langsung menggunakan script PHP murni dan query PDO SQL.

---

## 🛠️ Ringkasan Berkas Native PHP (Tanpa API)
Seluruh berkas siap pakai berada di dalam folder `xampp/`:
- 📄 **`koneksi.php`** — Skrip koneksi PDO ke MySQL `localhost:3306` (database: `smk_yapek_db`, user: `root`, password: `""`).
- 📄 **`index.php`** — Halaman utama portal publik (menampilkan logo, profil sekolah, sambutan kepala sekolah, 6 jurusan, warta berita, bursa kerja BKK, dan testimoni alumni).
- 📄 **`ppdb.php`** — Formulir pendaftaran siswa baru online. Data langsung di-insert ke tabel `ppdb_applicants` tanpa perantara API.
- 📄 **`berita.php`** — Halaman baca detail warta dan unduh lampiran dokumen resmi.
- 📄 **`admin.php`** — Dashboard panel admin CMS untuk mempublikasikan berita baru dan melihat daftar pendaftar PPDB langsung dari MySQL.
- 📄 **`database_mysql_xampp.sql`** — Skrip skema tabel MySQL lengkap dengan data awal.

---

## 🚀 Langkah 1: Nyalakan Modul di XAMPP Control Panel
1. Buka aplikasi **XAMPP Control Panel**.
2. Klik tombol **Start** pada baris **Apache**.
3. Klik tombol **Start** pada baris **MySQL**.
4. Pastikan teks *Apache* dan *MySQL* berlatar hijau (Apache port: `80, 443`, MySQL port: `3306`).

---

## 🗄️ Langkah 2: Buat Database & Import File SQL di phpMyAdmin
1. Buka browser, lalu akses alamat:  
   👉 **`http://localhost/phpmyadmin`**
2. Pada panel navigasi kiri, klik tombol **New** (Baru).
3. Masukkan nama database: **`smk_yapek_db`**.
4. Pilih collation: **`utf8mb4_unicode_ci`** atau **`utf8mb4_general_ci`**.
5. Klik tombol **Create** (Buat).
6. Klik database **`smk_yapek_db`** yang baru saja Anda buat.
7. Pada menu navigasi tab bagian atas, klik tab **Import**.
8. Klik tombol **Choose File** (Pilih Berkas), lalu pilih file:  
   📄 **`database_mysql_xampp.sql`**
9. Gulir ke bagian paling bawah dan klik tombol **Go** (Kirim).
10. Tunggu beberapa detik hingga muncul pemberitahuan sukses hijau. 12 tabel terelasi beserta data awal sekolah telah siap!

---

## 📂 Langkah 3: Salin Folder ke `htdocs` XAMPP
Salin isi berkas di dalam folder `xampp/` ke folder `htdocs` XAMPP Anda:

- **Lokasi di Windows:**  
  `C:\xampp\htdocs\smk-yapek\`
- **Lokasi di macOS:**  
  `/Applications/XAMPP/xamppfiles/htdocs/smk-yapek/`
- **Lokasi di Linux:**  
  `/opt/lampp/htdocs/smk-yapek/`

---

## 🌐 Langkah 4: Buka di Browser Web (Tanpa API!)
Buka browser web Google Chrome, Edge, atau Mozilla Firefox, lalu akses:

1. **Halaman Utama Portal Sekolah:**  
   👉 **`http://localhost/smk-yapek/index.php`**  
   *(atau cukup `http://localhost/smk-yapek/`)*

2. **Formulir Pendaftaran Siswa Baru (PPDB):**  
   👉 **`http://localhost/smk-yapek/ppdb.php`**  
   *(Mengisi data langsung tersimpan ke tabel MySQL `ppdb_applicants`)*

3. **Panel Kontrol CMS Admin:**  
   👉 **`http://localhost/smk-yapek/admin.php`**  
   *(Menerbitkan berita baru, memantau pendaftar PPDB, menghapus data)*

---

## 💡 Keuntungan Mode Tanpa API:
- ✅ **Tidak Perlu Koneksi Internet**: Berjalan lancar di jaringan intranet laboratorium komputer sekolah atau komputer lokal (offline).
- ✅ **Tanpa API Key atau Token**: Tidak memerlukan token otentikasi, REST client, maupun layanan cloud eksternal.
- ✅ **Ringan & Cepat**: Dieksekusi langsung oleh server Apache PHP bawaan XAMPP.
- ✅ **Mudah Dipelajari & Dikembangkan**: Menggunakan sintaks PHP standar (PDO) dan MySQL yang umum diajarkan di jurusan RPL/TKJ SMK.
