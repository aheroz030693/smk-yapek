/**
 * Skrip SQL Khusus MySQL / MariaDB / XAMPP phpMyAdmin
 * SMK YAPEK Gombong Portal & SIA System
 */

export const RAW_MYSQL_XAMPP_SQL = `-- ==============================================================================
-- DATABASE CONFIGURATION & INITIALIZATION SCHEMA (MYSQL / XAMPP / PHPMYADMIN)
-- PORTAL RESMI & SISTEM INFORMASI AKADEMIK SMK YAPEK GOMBONG
-- KABUPATEN KEBUMEN, JAWA TENGAH
--
-- Kompatibel dengan: XAMPP (Apache + MySQL/MariaDB), phpMyAdmin, Laragon, cPanel
-- Karakter encoding: utf8mb4 / utf8mb4_unicode_ci
-- Mesin Penyimpanan: InnoDB
-- ==============================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+07:00";

-- 1. PEMBUATAN DATABASE
CREATE DATABASE IF NOT EXISTS \`smk_yapek_db\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`smk_yapek_db\`;

-- TABEL 1: school_identity (Profil & Identitas Resmi Sekolah)
CREATE TABLE IF NOT EXISTS \`school_identity\` (
    \`id\` VARCHAR(50) NOT NULL,
    \`name\` VARCHAR(255) NOT NULL,
    \`short_name\` VARCHAR(50) NOT NULL,
    \`motto\` VARCHAR(255) DEFAULT NULL,
    \`tagline\` TEXT DEFAULT NULL,
    \`logo\` TEXT DEFAULT NULL,
    \`npsn\` VARCHAR(20) NOT NULL,
    \`accreditation\` VARCHAR(20) DEFAULT 'A (Unggul)',
    \`established_year\` VARCHAR(10) DEFAULT '1967',
    \`address\` TEXT NOT NULL,
    \`phone\` VARCHAR(50) DEFAULT NULL,
    \`alt_phone\` VARCHAR(50) DEFAULT NULL,
    \`whatsapp\` VARCHAR(50) DEFAULT NULL,
    \`email\` VARCHAR(100) DEFAULT NULL,
    \`website\` VARCHAR(150) DEFAULT NULL,
    \`instagram\` VARCHAR(150) DEFAULT NULL,
    \`instagram_handle\` VARCHAR(50) DEFAULT NULL,
    \`vision\` TEXT DEFAULT NULL,
    \`missions_json\` LONGTEXT DEFAULT NULL,
    \`stats_json\` LONGTEXT DEFAULT NULL,
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABEL 2: headmaster_profile (Profil & Sambutan Kepala Sekolah)
CREATE TABLE IF NOT EXISTS \`headmaster_profile\` (
    \`id\` VARCHAR(50) NOT NULL,
    \`name\` VARCHAR(255) NOT NULL,
    \`title\` VARCHAR(150) NOT NULL,
    \`nip\` VARCHAR(50) DEFAULT NULL,
    \`avatar\` TEXT DEFAULT NULL,
    \`period\` VARCHAR(50) DEFAULT NULL,
    \`quote\` TEXT DEFAULT NULL,
    \`speech_greeting\` VARCHAR(255) DEFAULT NULL,
    \`speech_content_1\` TEXT DEFAULT NULL,
    \`speech_content_2\` TEXT DEFAULT NULL,
    \`speech_closing\` TEXT DEFAULT NULL,
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABEL 3: majors (6 Program Kompetensi Keahlian SMK)
CREATE TABLE IF NOT EXISTS \`majors\` (
    \`id\` VARCHAR(50) NOT NULL,
    \`code\` VARCHAR(20) NOT NULL,
    \`name\` VARCHAR(255) NOT NULL,
    \`english_name\` VARCHAR(255) DEFAULT NULL,
    \`tagline\` VARCHAR(255) DEFAULT NULL,
    \`icon_name\` VARCHAR(50) NOT NULL,
    \`color_hex\` VARCHAR(20) NOT NULL,
    \`image\` TEXT DEFAULT NULL,
    \`short_desc\` TEXT DEFAULT NULL,
    \`description\` LONGTEXT DEFAULT NULL,
    \`competencies_json\` LONGTEXT DEFAULT NULL,
    \`career_opportunities_json\` LONGTEXT DEFAULT NULL,
    \`facilities_json\` LONGTEXT DEFAULT NULL,
    \`industry_partners_json\` LONGTEXT DEFAULT NULL,
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (\`id\`),
    UNIQUE KEY \`idx_major_code\` (\`code\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABEL 4: news (Warta Berita, Pengumuman & Prestasi)
CREATE TABLE IF NOT EXISTS \`news\` (
    \`id\` VARCHAR(50) NOT NULL,
    \`title\` VARCHAR(255) NOT NULL,
    \`category\` VARCHAR(50) NOT NULL,
    \`date_text\` VARCHAR(50) NOT NULL,
    \`image\` TEXT NOT NULL,
    \`summary\` TEXT NOT NULL,
    \`content\` LONGTEXT NOT NULL,
    \`author\` VARCHAR(150) NOT NULL,
    \`views\` INT DEFAULT 0,
    \`status\` VARCHAR(20) DEFAULT 'published',
    \`tags_json\` LONGTEXT DEFAULT NULL,
    \`related_article_ids_json\` LONGTEXT DEFAULT NULL,
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (\`id\`),
    KEY \`idx_news_category\` (\`category\`),
    KEY \`idx_news_status\` (\`status\`),
    KEY \`idx_news_created\` (\`created_at\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABEL 5: news_attachments (Lampiran Dokumen PDF/DOCX Berita)
CREATE TABLE IF NOT EXISTS \`news_attachments\` (
    \`id\` VARCHAR(50) NOT NULL,
    \`news_id\` VARCHAR(50) NOT NULL,
    \`name\` VARCHAR(255) NOT NULL,
    \`size\` VARCHAR(50) DEFAULT NULL,
    \`file_type\` VARCHAR(50) DEFAULT 'pdf',
    \`url\` TEXT NOT NULL,
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (\`id\`),
    KEY \`idx_attachment_news_id\` (\`news_id\`),
    CONSTRAINT \`fk_attachment_news\` FOREIGN KEY (\`news_id\`) REFERENCES \`news\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABEL 6: news_content_images (Galeri Foto Dokumentasi Berita)
CREATE TABLE IF NOT EXISTS \`news_content_images\` (
    \`id\` VARCHAR(50) NOT NULL,
    \`news_id\` VARCHAR(50) NOT NULL,
    \`url\` TEXT NOT NULL,
    \`caption\` TEXT DEFAULT NULL,
    \`sort_order\` INT DEFAULT 0,
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (\`id\`),
    KEY \`idx_content_image_news_id\` (\`news_id\`),
    CONSTRAINT \`fk_content_image_news\` FOREIGN KEY (\`news_id\`) REFERENCES \`news\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABEL 7: ppdb_applicants (Pendaftar PPDB Online Siswa Baru)
CREATE TABLE IF NOT EXISTS \`ppdb_applicants\` (
    \`id\` VARCHAR(50) NOT NULL,
    \`nisn\` VARCHAR(20) NOT NULL,
    \`full_name\` VARCHAR(255) NOT NULL,
    \`gender\` VARCHAR(20) NOT NULL,
    \`birth_place\` VARCHAR(100) DEFAULT NULL,
    \`birth_date\` DATE DEFAULT NULL,
    \`origin_school\` VARCHAR(255) DEFAULT NULL,
    \`parent_name\` VARCHAR(255) DEFAULT NULL,
    \`parent_phone\` VARCHAR(50) DEFAULT NULL,
    \`email\` VARCHAR(100) DEFAULT NULL,
    \`address\` TEXT DEFAULT NULL,
    \`first_major\` VARCHAR(50) NOT NULL,
    \`second_major\` VARCHAR(50) DEFAULT NULL,
    \`track\` VARCHAR(50) DEFAULT 'Reguler',
    \`avg_report_score\` DECIMAL(5,2) DEFAULT NULL,
    \`status\` VARCHAR(50) DEFAULT 'Menunggu Verifikasi',
    \`registered_at\` VARCHAR(50) DEFAULT NULL,
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (\`id\`),
    KEY \`idx_ppdb_nisn\` (\`nisn\`),
    KEY \`idx_ppdb_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABEL 8: job_postings (Lowongan Bursa Kerja Khusus - BKK)
CREATE TABLE IF NOT EXISTS \`job_postings\` (
    \`id\` VARCHAR(50) NOT NULL,
    \`title\` VARCHAR(255) NOT NULL,
    \`company\` VARCHAR(255) NOT NULL,
    \`logo\` TEXT DEFAULT NULL,
    \`location\` VARCHAR(150) DEFAULT NULL,
    \`type\` VARCHAR(50) DEFAULT 'Full-time',
    \`majors_required_json\` LONGTEXT DEFAULT NULL,
    \`salary_range\` VARCHAR(100) DEFAULT NULL,
    \`deadline\` VARCHAR(50) DEFAULT NULL,
    \`description\` LONGTEXT DEFAULT NULL,
    \`requirements_json\` LONGTEXT DEFAULT NULL,
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABEL 9: alumni_testimonials (Tracer Study & Kesaksian Alumni)
CREATE TABLE IF NOT EXISTS \`alumni_testimonials\` (
    \`id\` VARCHAR(50) NOT NULL,
    \`name\` VARCHAR(255) NOT NULL,
    \`graduation_year\` INT NOT NULL,
    \`major\` VARCHAR(150) NOT NULL,
    \`role\` VARCHAR(150) NOT NULL,
    \`company\` VARCHAR(255) NOT NULL,
    \`location\` VARCHAR(150) DEFAULT NULL,
    \`quote\` TEXT NOT NULL,
    \`avatar\` TEXT DEFAULT NULL,
    \`linkedin\` VARCHAR(150) DEFAULT NULL,
    \`rating\` INT DEFAULT 5,
    \`featured\` TINYINT(1) DEFAULT 0,
    \`status\` VARCHAR(20) DEFAULT 'approved',
    \`submitted_at\` VARCHAR(50) DEFAULT NULL,
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (\`id\`),
    KEY \`idx_testimonials_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABEL 10: activity_gallery (Arsip Galeri Dokumentasi Aktivitas)
CREATE TABLE IF NOT EXISTS \`activity_gallery\` (
    \`id\` VARCHAR(50) NOT NULL,
    \`title\` VARCHAR(255) NOT NULL,
    \`activity_type\` VARCHAR(50) NOT NULL,
    \`date\` VARCHAR(50) NOT NULL,
    \`location\` VARCHAR(150) DEFAULT NULL,
    \`image\` TEXT NOT NULL,
    \`caption\` TEXT DEFAULT NULL,
    \`photographer\` VARCHAR(150) DEFAULT NULL,
    \`featured\` TINYINT(1) DEFAULT 0,
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (\`id\`),
    KEY \`idx_gallery_type\` (\`activity_type\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABEL 11: admin_users (Akun Pengelola CMS & Hak Akses Role)
CREATE TABLE IF NOT EXISTS \`admin_users\` (
    \`id\` VARCHAR(50) NOT NULL,
    \`name\` VARCHAR(255) NOT NULL,
    \`email\` VARCHAR(150) NOT NULL,
    \`role\` VARCHAR(50) NOT NULL,
    \`department\` VARCHAR(100) DEFAULT NULL,
    \`phone\` VARCHAR(50) DEFAULT NULL,
    \`status\` VARCHAR(20) DEFAULT 'active',
    \`avatar\` TEXT DEFAULT NULL,
    \`password_hash\` VARCHAR(255) DEFAULT NULL,
    \`permissions_json\` LONGTEXT DEFAULT NULL,
    \`last_login\` VARCHAR(50) DEFAULT NULL,
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (\`id\`),
    UNIQUE KEY \`idx_admin_email\` (\`email\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABEL 12: visitor_logs (Log Kunjungan Analitik Portal)
CREATE TABLE IF NOT EXISTS \`visitor_logs\` (
    \`id\` VARCHAR(50) NOT NULL,
    \`ip_masked\` VARCHAR(50) DEFAULT NULL,
    \`page\` VARCHAR(150) DEFAULT NULL,
    \`source\` VARCHAR(100) DEFAULT NULL,
    \`device\` VARCHAR(50) DEFAULT NULL,
    \`city\` VARCHAR(100) DEFAULT NULL,
    \`visit_time\` VARCHAR(50) DEFAULT NULL,
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- DATA AWAL (SEED DATA LENGKAP - MYSQL / XAMPP READY)
-- ==============================================================================

-- 1. IDENTITAS SEKOLAH
INSERT INTO \`school_identity\` (
    \`id\`, \`name\`, \`short_name\`, \`motto\`, \`tagline\`, \`logo\`, \`npsn\`, \`accreditation\`, \`established_year\`,
    \`address\`, \`phone\`, \`alt_phone\`, \`whatsapp\`, \`email\`, \`website\`, \`instagram\`, \`instagram_handle\`,
    \`vision\`, \`missions_json\`, \`stats_json\`
) VALUES (
    'yapek-main',
    'SMK YAPEK GOMBONG',
    'SMK YAGO',
    'Lembaga Pendidikan Kejuruan Berkualitas',
    'Beriman, Kompeten, Kreatif, Mandiri & Berdaya Saing Global',
    '/logo-emblem.svg',
    '20330310',
    'A (Unggul)',
    '1967',
    'Jl. Merbabu No. 64, Wero, Gombong, Kab. Kebumen, Jawa Tengah 54416',
    '(0287) 472316',
    '(0287) 471326',
    '+6281226789020',
    'smkyapekgombong@gmail.com',
    'https://smkyapekgombong.sch.id',
    'https://www.instagram.com/smkyapekgombong/',
    '@smkyapekgombong',
    'Menjadi Lembaga Pendidikan dan Pelatihan Kejuruan yang Unggul, Berakhlak Mulia, Berstandar Nasional dan Berdaya Saing Global pada Tahun 2030.',
    '["Menyelenggarakan proses pembelajaran berbasis industri (Teaching Factory) dan sertifikasi kompetensi BNSP.", "Membina karakter peserta didik yang beriman, bertakwa, disiplin, berjiwa wirausaha dan berakhlak mulia.", "Memperluas jejaring kemitraan strategis dengan dunia usaha dan industri (DU/DI) skala nasional maupun internasional.", "Mengoptimalkan peran Bursa Kerja Khusus (BKK) dalam penyaluran tenaga kerja lulusan yang siap kerja dan mandiri."]',
    '{"students": "1.450+", "alumni": "18.200+", "industryPartners": "65+", "jobPlacementRate": "89.4%", "teachers": "78"}'
) ON DUPLICATE KEY UPDATE \`name\` = VALUES(\`name\`);

-- 2. KEPALA SEKOLAH
INSERT INTO \`headmaster_profile\` (
    \`id\`, \`name\`, \`title\`, \`nip\`, \`avatar\`, \`period\`, \`quote\`, \`speech_greeting\`,
    \`speech_content_1\`, \`speech_content_2\`, \`speech_closing\`
) VALUES (
    'kepsek-1',
    'Drs. H. Suwarno, M.M.',
    'Kepala SMK YAPEK Gombong',
    '19680512 199403 1 004',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
    '2020 - Sekarang',
    'Mempersiapkan Generasi Berkeahlian Nyata, Siap Kerja dan Berakhlakul Karimah',
    'Assalamu’alaikum Warahmatullahi Wabarakatuh.',
    'Selamat datang di portal resmi SMK YAPEK Gombong. Pendidikan vokasi saat ini dituntut tidak hanya adaptif terhadap lompatan teknologi digital dan otomatisasi industri, melainkan juga harus kokoh menanamkan karakter integritas, kedisiplinan kerja, kejujuran, dan kemandirian berwirausaha bagi setiap peserta didik.',
    'Melalui 6 program kompetensi keahlian unggulan kami, sarana prasarana laboratorium berstandar industri, tenaga pendidik yang tersertifikasi asesor BNSP, serta jejaring kemitraan Bursa Kerja Khusus (BKK) yang terpercaya, kami bertekad mengawal setiap siswa mewujudkan impian karir terbaiknya.',
    'Mari bersama melangkah pasti dan menjemput masa depan gemilang di SMK YAPEK Gombong. SMK Bisa, SMK Hebat, Vokasi Kuat Menguatkan Indonesia! Wassalamu’alaikum Warahmatullahi Wabarakatuh.'
) ON DUPLICATE KEY UPDATE \`name\` = VALUES(\`name\`);

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
`;

/**
 * Trigger download of any text/PHP/SQL file
 */
export const downloadFileContent = (content: string, filename: string, mimeType = 'text/plain;charset=utf-8;') => {
  if (typeof window === 'undefined') return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Trigger download of the MySQL/XAMPP database SQL file
 */
export const downloadMysqlXamppSqlFile = (filename = 'database_mysql_xampp.sql') => {
  downloadFileContent(RAW_MYSQL_XAMPP_SQL, filename, 'application/sql;charset=utf-8;');
};

export const RAW_PHP_KONEKSI = `<?php
/**
 * Konfigurasi Koneksi Database MySQL / XAMPP (100% Tanpa API)
 * SMK YAPEK Gombong Portal & Sistem Informasi
 * 
 * Pengaturan default XAMPP:
 * Host: localhost
 * User: root
 * Password: (kosong)
 * Port: 3306
 * Database: smk_yapek_db
 */

$db_host = 'localhost';
$db_port = '3306';
$db_name = 'smk_yapek_db';
$db_user = 'root';
$db_pass = ''; // Kosongkan untuk bawaan instalasi XAMPP baru

try {
    $dsn = "mysql:host={$db_host};port={$db_port};dbname={$db_name};charset=utf8mb4";
    $pdo = new PDO($dsn, $db_user, $db_pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
} catch (PDOException $e) {
    echo "<h2>Gagal Terhubung ke MySQL XAMPP: " . htmlspecialchars($e->getMessage()) . "</h2>";
    echo "<p>Pastikan modul MySQL di XAMPP Control Panel telah di-Start dan database smk_yapek_db telah di-import di phpMyAdmin.</p>";
    exit;
}
?>`;

export const RAW_PHP_PPDB = `<?php
/**
 * FORM PENDAFTARAN PPDB ONLINE (PHP NATIVE + MYSQL - TANPA API)
 * SMK YAPEK GOMBONG
 */
require_once __DIR__ . '/koneksi.php';

$success = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nisn = trim($_POST['nisn'] ?? '');
    $nama = trim($_POST['full_name'] ?? '');
    $jk = $_POST['gender'] ?? 'Laki-laki';
    $jurusan1 = $_POST['first_major'] ?? 'TKJ';
    $jurusan2 = $_POST['second_major'] ?? '';
    $asal_smp = trim($_POST['origin_school'] ?? '');
    $ortu = trim($_POST['parent_name'] ?? '');
    $hp = trim($_POST['parent_phone'] ?? '');

    if (empty($nisn) || empty($nama)) {
        $error = 'NISN dan Nama Lengkap wajib diisi!';
    } else {
        try {
            $id = 'PPDB-' . date('Ymd') . '-' . rand(1000, 9999);
            $stmt = $pdo->prepare("INSERT INTO ppdb_applicants (id, nisn, full_name, gender, origin_school, parent_name, parent_phone, first_major, second_major, status, registered_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Menunggu Verifikasi', ?)");
            $stmt->execute([$id, $nisn, $nama, $jk, $asal_smp, $ortu, $hp, $jurusan1, $jurusan2, date('d F Y')]);
            $success = "Pendaftaran calon siswa <strong>$nama</strong> berhasil disimpan ke MySQL!";
        } catch (PDOException $e) {
            $error = 'Gagal menyimpan: ' . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>PPDB Online SMK YAPEK Gombong (MySQL Native)</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 p-6">
    <div class="max-w-2xl mx-auto bg-white p-8 rounded-3xl border shadow-sm">
        <h1 class="text-2xl font-black text-[#0F4374] mb-2">Formulir PPDB Online</h1>
        <p class="text-xs text-slate-500 mb-6">Disimpan langsung ke database MySQL lokal tanpa API.</p>
        <?php if ($success): ?><div class="p-4 bg-emerald-100 text-emerald-800 rounded-xl mb-4 font-bold"><?= $success ?></div><?php endif; ?>
        <?php if ($error): ?><div class="p-4 bg-rose-100 text-rose-800 rounded-xl mb-4 font-bold"><?= $error ?></div><?php endif; ?>
        <form method="POST" class="space-y-4 text-xs">
            <div><label class="block font-bold mb-1">NISN *</label><input type="text" name="nisn" required class="w-full p-2.5 border rounded-xl"></div>
            <div><label class="block font-bold mb-1">Nama Lengkap *</label><input type="text" name="full_name" required class="w-full p-2.5 border rounded-xl"></div>
            <div><label class="block font-bold mb-1">Jenis Kelamin</label><select name="gender" class="w-full p-2.5 border rounded-xl"><option>Laki-laki</option><option>Perempuan</option></select></div>
            <div><label class="block font-bold mb-1">Pilihan Jurusan</label><select name="first_major" class="w-full p-2.5 border rounded-xl"><option value="TKJ">Teknik Komputer dan Jaringan</option><option value="AKL">Akuntansi dan Keuangan Lembaga</option><option value="OTKP">Otomatisasi Tata Kelola Perkantoran</option><option value="BDP">Bisnis Daring dan Pemasaran</option><option value="TKKR">Teknik Ketenagalistrikan</option><option value="TKR">Teknik Kendaraan Ringan</option></select></div>
            <div><label class="block font-bold mb-1">Asal SMP/MTs</label><input type="text" name="origin_school" class="w-full p-2.5 border rounded-xl"></div>
            <div><label class="block font-bold mb-1">Nama Orang Tua</label><input type="text" name="parent_name" class="w-full p-2.5 border rounded-xl"></div>
            <div><label class="block font-bold mb-1">No. WhatsApp Orang Tua</label><input type="tel" name="parent_phone" class="w-full p-2.5 border rounded-xl"></div>
            <button type="submit" class="w-full py-3 bg-[#0F4374] text-white rounded-xl font-bold">Kirim Pendaftaran ke MySQL</button>
        </form>
    </div>
</body>
</html>`;
