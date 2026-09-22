-- ==============================================================================
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
CREATE DATABASE IF NOT EXISTS `smk_yapek_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `smk_yapek_db`;

-- ==============================================================================
-- TABEL 1: school_identity (Profil & Identitas Resmi Sekolah)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS `school_identity` (
    `id` VARCHAR(50) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `short_name` VARCHAR(50) NOT NULL,
    `motto` VARCHAR(255) DEFAULT NULL,
    `tagline` TEXT DEFAULT NULL,
    `logo` TEXT DEFAULT NULL,
    `npsn` VARCHAR(20) NOT NULL,
    `accreditation` VARCHAR(20) DEFAULT 'A (Unggul)',
    `established_year` VARCHAR(10) DEFAULT '1967',
    `address` TEXT NOT NULL,
    `phone` VARCHAR(50) DEFAULT NULL,
    `alt_phone` VARCHAR(50) DEFAULT NULL,
    `whatsapp` VARCHAR(50) DEFAULT NULL,
    `email` VARCHAR(100) DEFAULT NULL,
    `website` VARCHAR(150) DEFAULT NULL,
    `instagram` VARCHAR(150) DEFAULT NULL,
    `instagram_handle` VARCHAR(50) DEFAULT NULL,
    `vision` TEXT DEFAULT NULL,
    `missions_json` LONGTEXT DEFAULT NULL,
    `stats_json` LONGTEXT DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- TABEL 2: headmaster_profile (Profil & Sambutan Kepala Sekolah)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS `headmaster_profile` (
    `id` VARCHAR(50) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `nip` VARCHAR(50) DEFAULT NULL,
    `avatar` TEXT DEFAULT NULL,
    `period` VARCHAR(50) DEFAULT NULL,
    `quote` TEXT DEFAULT NULL,
    `speech_greeting` VARCHAR(255) DEFAULT NULL,
    `speech_content_1` TEXT DEFAULT NULL,
    `speech_content_2` TEXT DEFAULT NULL,
    `speech_closing` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- TABEL 3: majors (6 Program Kompetensi Keahlian SMK)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS `majors` (
    `id` VARCHAR(50) NOT NULL,
    `code` VARCHAR(20) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `english_name` VARCHAR(255) DEFAULT NULL,
    `tagline` VARCHAR(255) DEFAULT NULL,
    `icon_name` VARCHAR(50) NOT NULL,
    `color_hex` VARCHAR(20) NOT NULL,
    `image` TEXT DEFAULT NULL,
    `short_desc` TEXT DEFAULT NULL,
    `description` LONGTEXT DEFAULT NULL,
    `competencies_json` LONGTEXT DEFAULT NULL,
    `career_opportunities_json` LONGTEXT DEFAULT NULL,
    `facilities_json` LONGTEXT DEFAULT NULL,
    `industry_partners_json` LONGTEXT DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `idx_major_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- TABEL 4: news (Warta Berita, Pengumuman & Prestasi)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS `news` (
    `id` VARCHAR(50) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `category` VARCHAR(50) NOT NULL,
    `date_text` VARCHAR(50) NOT NULL,
    `image` TEXT NOT NULL,
    `summary` TEXT NOT NULL,
    `content` LONGTEXT NOT NULL,
    `author` VARCHAR(150) NOT NULL,
    `views` INT DEFAULT 0,
    `status` VARCHAR(20) DEFAULT 'published',
    `tags_json` LONGTEXT DEFAULT NULL,
    `related_article_ids_json` LONGTEXT DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_news_category` (`category`),
    KEY `idx_news_status` (`status`),
    KEY `idx_news_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- TABEL 5: news_attachments (Lampiran Dokumen PDF/DOCX Berita)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS `news_attachments` (
    `id` VARCHAR(50) NOT NULL,
    `news_id` VARCHAR(50) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `size` VARCHAR(50) DEFAULT NULL,
    `file_type` VARCHAR(50) DEFAULT 'pdf',
    `url` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_attachment_news_id` (`news_id`),
    CONSTRAINT `fk_attachment_news` FOREIGN KEY (`news_id`) REFERENCES `news` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- TABEL 6: news_content_images (Galeri Foto Dokumentasi Berita)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS `news_content_images` (
    `id` VARCHAR(50) NOT NULL,
    `news_id` VARCHAR(50) NOT NULL,
    `url` TEXT NOT NULL,
    `caption` TEXT DEFAULT NULL,
    `sort_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_content_image_news_id` (`news_id`),
    CONSTRAINT `fk_content_image_news` FOREIGN KEY (`news_id`) REFERENCES `news` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- TABEL 7: ppdb_applicants (Pendaftar PPDB Online Siswa Baru)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS `ppdb_applicants` (
    `id` VARCHAR(50) NOT NULL,
    `nisn` VARCHAR(20) NOT NULL,
    `full_name` VARCHAR(255) NOT NULL,
    `gender` VARCHAR(20) NOT NULL,
    `birth_place` VARCHAR(100) DEFAULT NULL,
    `birth_date` DATE DEFAULT NULL,
    `origin_school` VARCHAR(255) DEFAULT NULL,
    `parent_name` VARCHAR(255) DEFAULT NULL,
    `parent_phone` VARCHAR(50) DEFAULT NULL,
    `email` VARCHAR(100) DEFAULT NULL,
    `address` TEXT DEFAULT NULL,
    `first_major` VARCHAR(50) NOT NULL,
    `second_major` VARCHAR(50) DEFAULT NULL,
    `track` VARCHAR(50) DEFAULT 'Reguler',
    `avg_report_score` DECIMAL(5,2) DEFAULT NULL,
    `status` VARCHAR(50) DEFAULT 'Menunggu Verifikasi',
    `registered_at` VARCHAR(50) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_ppdb_nisn` (`nisn`),
    KEY `idx_ppdb_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- TABEL 8: job_postings (Lowongan Bursa Kerja Khusus - BKK)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS `job_postings` (
    `id` VARCHAR(50) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `company` VARCHAR(255) NOT NULL,
    `logo` TEXT DEFAULT NULL,
    `location` VARCHAR(150) DEFAULT NULL,
    `type` VARCHAR(50) DEFAULT 'Full-time',
    `majors_required_json` LONGTEXT DEFAULT NULL,
    `salary_range` VARCHAR(100) DEFAULT NULL,
    `deadline` VARCHAR(50) DEFAULT NULL,
    `description` LONGTEXT DEFAULT NULL,
    `requirements_json` LONGTEXT DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- TABEL 9: alumni_testimonials (Tracer Study & Kesaksian Alumni)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS `alumni_testimonials` (
    `id` VARCHAR(50) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `graduation_year` INT NOT NULL,
    `major` VARCHAR(150) NOT NULL,
    `role` VARCHAR(150) NOT NULL,
    `company` VARCHAR(255) NOT NULL,
    `location` VARCHAR(150) DEFAULT NULL,
    `quote` TEXT NOT NULL,
    `avatar` TEXT DEFAULT NULL,
    `linkedin` VARCHAR(150) DEFAULT NULL,
    `rating` INT DEFAULT 5,
    `featured` TINYINT(1) DEFAULT 0,
    `status` VARCHAR(20) DEFAULT 'approved',
    `submitted_at` VARCHAR(50) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_testimonials_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- TABEL 10: activity_gallery (Arsip Galeri Dokumentasi Aktivitas)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS `activity_gallery` (
    `id` VARCHAR(50) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `activity_type` VARCHAR(50) NOT NULL,
    `date` VARCHAR(50) NOT NULL,
    `location` VARCHAR(150) DEFAULT NULL,
    `image` TEXT NOT NULL,
    `caption` TEXT DEFAULT NULL,
    `photographer` VARCHAR(150) DEFAULT NULL,
    `featured` TINYINT(1) DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_gallery_type` (`activity_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- TABEL 11: admin_users (Akun Pengelola CMS & Hak Akses Role)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS `admin_users` (
    `id` VARCHAR(50) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `role` VARCHAR(50) NOT NULL,
    `department` VARCHAR(100) DEFAULT NULL,
    `phone` VARCHAR(50) DEFAULT NULL,
    `status` VARCHAR(20) DEFAULT 'active',
    `avatar` TEXT DEFAULT NULL,
    `password_hash` VARCHAR(255) DEFAULT NULL,
    `permissions_json` LONGTEXT DEFAULT NULL,
    `last_login` VARCHAR(50) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `idx_admin_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- TABEL 12: visitor_logs (Log Kunjungan Analitik Portal)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS `visitor_logs` (
    `id` VARCHAR(50) NOT NULL,
    `ip_masked` VARCHAR(50) DEFAULT NULL,
    `page` VARCHAR(150) DEFAULT NULL,
    `source` VARCHAR(100) DEFAULT NULL,
    `device` VARCHAR(50) DEFAULT NULL,
    `city` VARCHAR(100) DEFAULT NULL,
    `visit_time` VARCHAR(50) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- DATA AWAL (SEED DATA LENGKAP - MYSQL / XAMPP READY)
-- ==============================================================================

-- 1. IDENTITAS SEKOLAH
INSERT INTO `school_identity` (
    `id`, `name`, `short_name`, `motto`, `tagline`, `logo`, `npsn`, `accreditation`, `established_year`,
    `address`, `phone`, `alt_phone`, `whatsapp`, `email`, `website`, `instagram`, `instagram_handle`,
    `vision`, `missions_json`, `stats_json`
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
) ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 2. KEPALA SEKOLAH
INSERT INTO `headmaster_profile` (
    `id`, `name`, `title`, `nip`, `avatar`, `period`, `quote`, `speech_greeting`,
    `speech_content_1`, `speech_content_2`, `speech_closing`
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
) ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 3. ENAM KOMPETENSI KEAHLIAN (JURUSAN)
INSERT INTO `majors` (
    `id`, `code`, `name`, `english_name`, `tagline`, `icon_name`, `color_hex`,
    `image`, `short_desc`, `description`, `competencies_json`, `career_opportunities_json`, `facilities_json`, `industry_partners_json`
) VALUES
(
    'tkj',
    'TKJ',
    'Teknik Komputer dan Jaringan',
    'Computer & Network Engineering',
    'Membangun Infrastruktur Digital Masa Depan',
    'Network',
    '#0F4374',
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    'Spesialisasi keahlian perakitan komputer, instalasi jaringan kabel & fiber optic, administrasi server Linux/Windows, cloud computing, serta keamanan siber.',
    'Program Keahlian Teknik Komputer dan Jaringan (TKJ) SMK YAPEK Gombong mendidik siswa menjadi teknisi jaringan andal yang menguasai teknologi mikrotik, cisco, konfigurasi server cloud, dan cyber security berbasis sertifikasi industri resmi.',
    '["Administrasi Server Linux & Windows", "Konfigurasi MikroTik MTCNA & Cisco CCNA", "Instalasi Fiber Optic & Wireless Network", "Cloud Computing & Virtualization", "Keamanan Siber & Troubleshooting Hardware"]',
    '["Network Administrator", "Cloud & System Engineer", "Technical Support Specialist", "Cyber Security Analyst", "ISP Field Technician"]',
    '["Laboratorium Komputer Jaringan Ber-AC", "Rak Server Dell PowerEdge & Rackmount Switch", "Fusion Splicer Fiber Optic & OTDR", "MikroTik Academy Training Center"]',
    '["PT Telkom Indonesia", "PT Indonesia Comnets Plus (ICON+)", "MikroTik Latvia (Academy Partner)", "Lintasarta"]'
),
(
    'akl',
    'AKL',
    'Akuntansi dan Keuangan Lembaga',
    'Accounting & Institutional Finance',
    'Presisi Finansial di Era Digital Banking',
    'Calculator',
    '#0284C7',
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    'Keahlian tata kelola akuntansi keuangan, perpajakan modern, spreadsheet analisis, serta aplikasi komputer akuntansi Accurate dan MYOB.',
    'Kompetensi Keahlian Akuntansi dan Keuangan Lembaga (AKL) membekali siswa dengan pemahaman mendalam tentang siklus akuntansi perusahaan jasa, dagang, dan manufaktur, serta akuntansi perbankan syariah dan perpajakan elektronik (e-Faktur/e-SPT).',
    '["Siklus Akuntansi Keuangan Perusahaan", "Aplikasi Komputer Akuntansi MYOB & Accurate", "Perpajakan (PPh, PPN & e-Faktur)", "Akuntansi Perbankan & Lembaga Keuangan Mikro", "Analisis Spreadsheet Keuangan Tingkat Lanjut"]',
    '["Staf Akuntansi & Finance", "Junior Auditor", "Teller & Customer Service Bank", "Konsultan Pajak Muda", "Pengelola Keuangan BUMDes / Koperasi"]',
    '["Mini Bank Sekolah (Bank Mini YAPEK)", "Laboratorium Komputer Akuntansi Berlisensi Accurate", "Software Simulasi Pajak DJP Online", "Mesin Hitung Finansial & Kasir"]',
    '["Bank Jateng", "Bank Rakyat Indonesia (BRI)", "Kantor Pelayanan Pajak (KPP) Kebumen", "KSP Sahabat Mitra Sejati"]'
),
(
    'otkp',
    'OTKP',
    'Otomatisasi & Tata Kelola Perkantoran',
    'Office Automation & Governance',
    'Profesionalisme Administrasi Korporat',
    'FileText',
    '#F59E0B',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
    'Manajemen administrasi perkantoran modern, korespondensi dwibahasa, kearsipan elektronik, protokoler, serta public relations.',
    'OTKP SMK YAPEK Gombong melatih calon sekretaris dan asisten eksekutif modern yang cakap memanfaatkan aplikasi otomasi kantor, tata naskah dinas, etika profesi, serta kemampuan komunikasi bisnis tingkat tinggi.',
    '["Korespondensi Bahasa Indonesia & Inggris Bisnis", "Kearsipan Digital & Cloud Document Filing", "Manajemen Rapat, Acara & Protokoler Humas", "Otomatisasi Perkantoran Microsoft 365 / Google Workspace", "Pengelolaan Kas Kecil & Logistik Kantor"]',
    '["Sekretaris Eksekutif", "Administrative Officer", "Public Relations Assistant", "Event Organizer Coordinator", "Customer Care Specialist"]',
    '["Laboratorium Simulasi Perkantoran Modern", "Mesin Fax, PABX & Teleconference Unit", "Filing Cabinet Elektronik", "Ruang Rapat & Presentasi Eksekutif"]',
    '["Sekretariat Daerah (Setda) Kab. Kebumen", "PT Pos Indonesia", "PT Kereta Api Indonesia (Persero)", "Hotel Mexolie Kebumen"]'
),
(
    'bdp',
    'BDP',
    'Bisnis Daring dan Pemasaran',
    'Digital Business & Marketing',
    'Merajai Ekosistem E-Commerce & Retail Modern',
    'TrendingUp',
    '#10B981',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    'Strategi pemasaran digital, manajemen toko online, copywriting iklan, visual merchandising retail, serta live streaming selling.',
    'Program Keahlian Bisnis Daring dan Pemasaran (BDP) mengasah kemampuan kewirausahaan digital siswa dalam mengelola marketplace, digital advertising (Meta Ads, Google Ads, TikTok Ads), customer relationship management, dan operasional ritel waralaba.',
    '["Digital Marketing Strategy & Content Creation", "Pengelolaan Toko Marketplace (Shopee, Tokopedia, TikTok)", "Penataan Produk / Visual Merchandising Retail", "Copywriting, SEO & Social Media Ads", "Teknik Negosiasi & Sales Presentation"]',
    '["Digital Marketer & Ads Specialist", "E-Commerce Store Manager", "Retail Store Supervisor", "Content Creator & Live Streamer Seller", "Technopreneur / Wirausahawan Muda"]',
    '["Yapek Mart (Laboratorium Retail Modern)", "Studio Live Streaming & Content Creation", "Point of Sales (POS) Barcode Scanner Unit", "Ruang Display Merchandise Kreatif"]',
    '["PT Sumber Alfaria Trijaya (Alfamart Class)", "PT Indomarco Prismatama (Indomaret)", "Shopee Indonesia", "Pusat Oleh-Oleh Khas Kebumen"]'
),
(
    'tkkr',
    'TKKR',
    'Tata Kecantikan Kulit dan Rambut',
    'Skin Care & Hair Styling',
    'Kreativitas Estetika & Industri Beauty Care',
    'Sparkles',
    '#EC4899',
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    'Perawatan kulit wajah modern, tata rias pengantin & panggung, styling rambut, nail art, serta manajemen salon kecantikan profesional.',
    'Kompetensi Keahlian TKKR membentuk ahli kecantikan berstandar salon kecantikan terkemuka dengan keahlian tata rias korektif, sanggul tradisional dan modern, perawatan tubuh (body spa), facial treatment, dan etika kecantikan.',
    '["Perawatan Kulit Wajah & Facial Elektrik", "Tata Rias Pengantin Tradisional & Bridal Modern", "Pemangkasan, Pewarnaan & Hair Styling", "Manicure, Pedicure & Nail Art Design", "Manajemen Operasional Salon & Spa"]',
    '["Professional Make-Up Artist (MUA)", "Hair Stylist & Colorist", "Beauty Therapist / Konsultan Kecantikan", "Pengusaha Salon Kecantikan & Bridal", "Trainer & Brand Ambassador Kosmetik"]',
    '["Laboratorium Beauty Salon Ber-AC", "Bed Facial Elektrik & Alat Galvanic", "Set Meja Rias Make-Up Mirror Ring Light", "Washing Bak Cuci Rambut Standar Salon"]',
    '["Martha Tilaar Group", "Wardah Cosmetics (PT Paragon Technology and Innovation)", "Rudy Hadisuwarno Organization", "LPPKS Tiara Kusuma"]'
),
(
    'tkr',
    'TKR',
    'Teknik Kendaraan Ringan Otomotif',
    'Light Vehicle Automotive Engineering',
    'Tenaga Penggerak Inovasi Otomotif Modern',
    'Wrench',
    '#6366F1',
    'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
    'Pemeliharaan mesin kendaraan bermotor, sistem EFI elektrikal, transmisi otomatis/manual, rem ABS, AC mobil, dan diagnosa scanner OBD-II.',
    'Teknik Kendaraan Ringan (TKR) mendidik mekanik ahli mobil yang terlatih melakukan tune-up, overhaul mesin bensin & diesel common rail, perbaikan chasis & suspensi, kelistrikan bodi mobil, serta pengenalan kendaraan ramah lingkungan / hybrid.',
    '["Perawatan & Overhaul Mesin Bensin & Diesel", "Sistem Kelistrikan Bodi & AC Mobil", "Sistem Rem ABS & Chasis Suspensi", "Diagnosa Komputer Scanner OBD-II / ECU", "Sistem Transmisi Manual & Otomatis (AT/CVT)"]',
    '["Teknisi Bengkel Resmi Otomotif (Authorized Dealer)", "Service Advisor & Kepala Regu Bengkel", "Quality Control Inspector Pabrik Otomotif", "Spesialis Kelistrikan & AC Mobil", "Wirausaha Bengkel Mobil Mandiri"]',
    '["Bengkel Otomotif Lengkap Berstandar ATPM", "Two-Post Car Lift & Four-Post Lift", "Engine Diagnostic Scanner OBD-II", "Unit Mobil Praktik EFI & Diesel Common Rail"]',
    '["PT Astra Daihatsu Motor", "PT Nasmoco Toyota Jawa Tengah", "PT Suzuki Indomobil Motor", "BOS (Bengkel Otomotif Semarang)"]'
)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 4. ARTIKEL BERITA & PENGUMUMAN
INSERT INTO `news` (
    `id`, `title`, `category`, `date_text`, `image`, `summary`, `content`, `author`, `views`, `status`
) VALUES
(
    'news-1',
    'Pelepasan 128 Lulusan SMK YAPEK Gombong Bekerja di Industri Otomotif Nasional',
    'Bursa Kerja',
    '18 Mei 2026',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
    'Bursa Kerja Khusus (BKK) SMK YAPEK Gombong kembali mencatatkan prestasi membanggakan dengan memberangkatkan 128 wisudawan angkatan 2026 langsung terserap kerja di kawasan industri Cikarang dan Karawang.',
    '<p>Kebumen — Suasana haru dan bangga menyelimuti aula utama SMK YAPEK Gombong pada hari Senin (18/05/2026) dalam acara seremoni resmi pelepasan 128 alumni yang lolos rekrutmen kerja massal PT Astra Otoparts Group dan PT Sumber Alfaria Trijaya Tbk.</p><p>Kepala SMK YAPEK Gombong, Drs. H. Suwarno, M.M., dalam sambutannya menyampaikan bahwa keterserapan kerja lulusan sebelum ijazah resmi terbit merupakan bukti nyata kurikulum vokasi SMK YAPEK yang selaras dengan standar kebutuhan dunia kerja (link and match).</p><p>Para alumni ini telah melalui serangkaian tahapan seleksi ketat meliputi tes psikotes, wawancara teknis, hingga medical check-up yang diselenggarakan langsung di kampus SMK YAPEK Gombong bekerjasama dengan BKK Kabupaten Kebumen.</p>',
    'Humas SMK YAPEK',
    1420,
    'published'
),
(
    'news-2',
    'Siswa Jurusan TKJ Raih Juara 1 LKS Tingkat Provinsi Jawa Tengah Bidang Cyber Security',
    'Prestasi',
    '02 Mei 2026',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80',
    'Raihan medali emas berhasil dipersembahkan oleh ananda Dimas Pratama, siswa kelas XII TKJ dalam ajang bergengsi Lomba Kompetensi Siswa (LKS) SMK tingkat Provinsi Jawa Tengah 2026.',
    '<p>Semarang — Kontingen SMK YAPEK Gombong berhasil menorehkan tinta emas pada Lomba Kompetensi Siswa (LKS) SMK Tingkat Provinsi Jawa Tengah ke-34 yang berlangsung di Semarang. Dimas Pratama berhasil keluar sebagai Juara 1 pada bidang lomba Cyber Security.</p><p>Dalam kompetisi tersebut, peserta diuji kemampuannya dalam menambal celah keamanan sistem server, melakukan penetration testing, digital forensics, serta merancang arsitektur jaringan pertahanan siber multi-tier.</p><p>Dengan kemenangan ini, Dimas berhak mewakili Provinsi Jawa Tengah pada LKS Tingkat Nasional yang dijadwalkan berlangsung di Jakarta pada bulan Agustus 2026 mendatang.</p>',
    'Redaksi Warta',
    2150,
    'published'
),
(
    'news-3',
    'SMK YAPEK Resmikan Laboratorium Teaching Factory Ritel Bekerjasama dengan Alfamart',
    'Kemitraan',
    '24 April 2026',
    'https://images.unsplash.com/photo-1580828343064-fde4fc206bc6?auto=format&fit=crop&w=1000&q=80',
    'Tingkatkan keterampilan nyata peserta didik program keahlian Bisnis Daring dan Pemasaran, sekolah meluncurkan mini market Teaching Factory Alfamart Class berstandar industri ritel modern.',
    '<p>Gombong — Guna mewujudkan ekosistem belajar yang kontekstual dan menyerupai lingkungan kerja sebenarnya, SMK YAPEK Gombong meresmikan Teaching Factory Ritel "Yapek Mart" bekerjasama dengan PT Sumber Alfaria Trijaya Tbk.</p><p>Fasilitas ini dilengkapi sistem kasir komputer terpusat, rak display gondola modern, barcode scanner, pendingin chiller, serta ruang pergudangan terstandar. Di mini market ini, siswa jurusan BDP bertugas mengelola perputaran barang, kasir, promosi digital mingguan, hingga pembukuan keuangan harian.</p>',
    'Biro Kemitraan DU/DI',
    980,
    'published'
)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- 5. LAMPIRAN DOKUMEN WARTA
INSERT INTO `news_attachments` (
    `id`, `news_id`, `name`, `size`, `file_type`, `url`
) VALUES
(
    'att-1',
    'news-1',
    'Daftar-Nama-Siswa-Lolos-Rekrutmen-Astra-2026.pdf',
    '2.4 MB',
    'pdf',
    'https://example.com/docs/rekrutmen-astra-2026.pdf'
),
(
    'att-2',
    'news-2',
    'Sertifikat-Juara-1-LKS-Provinsi-Cyber-Security.pdf',
    '1.8 MB',
    'pdf',
    'https://example.com/docs/sertifikat-lks-cyber-security.pdf'
)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 6. PENDAFTAR PPDB ONLINE
INSERT INTO `ppdb_applicants` (
    `id`, `nisn`, `full_name`, `gender`, `birth_place`, `birth_date`, `origin_school`,
    `parent_name`, `parent_phone`, `email`, `address`, `first_major`, `second_major`,
    `track`, `avg_report_score`, `status`, `registered_at`
) VALUES
(
    'ppdb-1',
    '0078129384',
    'Bagus Kurniawan',
    'Laki-laki',
    'Kebumen',
    '2010-06-14',
    'SMP Negeri 1 Gombong',
    'Suryadi',
    '081329847162',
    'bagus.k@gmail.com',
    'Ds. Wonokriyo RT 02/03, Kec. Gombong, Kab. Kebumen',
    'TKJ',
    'TKR',
    'Prestasi',
    88.50,
    'Terverifikasi & Diterima',
    '15 Januari 2026'
),
(
    'ppdb-2',
    '0081239841',
    'Anisa Nur Cahyani',
    'Perempuan',
    'Gombong',
    '2010-09-21',
    'SMP Negeri 2 Gombong',
    'Bambang Susilo',
    '081298371625',
    'anisa.cahya@gmail.com',
    'Jl. Puring No. 12, Gombong, Kebumen',
    'AKL',
    'OTKP',
    'Reguler',
    86.20,
    'Menunggu Verifikasi Berkas',
    '20 Januari 2026'
),
(
    'ppdb-3',
    '0076251938',
    'Rian Hidayat',
    'Laki-laki',
    'Karanganyar',
    '2010-03-05',
    'MTs Negeri 1 Kebumen',
    'Haryanto',
    '085612847192',
    'rian.hidayat@gmail.com',
    'Ds. Jatiluhur RT 01/01, Kec. Rowokele, Kebumen',
    'TKR',
    'TKJ',
    'Afirmasi / KIP',
    84.75,
    'Terverifikasi & Diterima',
    '28 Januari 2026'
)
ON DUPLICATE KEY UPDATE `full_name` = VALUES(`full_name`);

-- 7. KISAH SUKSES ALUMNI (TRACER STUDY)
INSERT INTO `alumni_testimonials` (
    `id`, `name`, `graduation_year`, `major`, `role`, `company`, `location`,
    `quote`, `avatar`, `rating`, `featured`, `status`, `submitted_at`
) VALUES
(
    'alumni-1',
    'Fajar Prasetyo, S.Kom.',
    2018,
    'Teknik Komputer dan Jaringan',
    'Senior Cloud Network Engineer',
    'PT Lintasarta Telekomunikasi',
    'Jakarta Selatan',
    'Fondasi praktikum MikroTik dan Linux di SMK YAPEK Gombong luar biasa kokoh. Saya mampu langsung bersaing di Jakarta dan melanjutkan studi sarjana sambil berkarir di industri telekomunikasi.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    5,
    1,
    'approved',
    '10 Februari 2026'
),
(
    'alumni-2',
    'Dewi Anggraeni, A.Md.Ak.',
    2019,
    'Akuntansi dan Keuangan Lembaga',
    'Senior Finance Officer',
    'Bank Jateng KC Kebumen',
    'Kebumen, Jawa Tengah',
    'Sertifikasi Accurate dan bimbingan guru-guru AKL membentuk karakter teliti dan jujur. Begitu lulus dari SMK YAPEK, langsung dipercaya bergabung dengan perbankan daerah.',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    5,
    1,
    'approved',
    '15 Februari 2026'
)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 8. AKUN PENGELOLA CMS (ADMIN RBAC)
INSERT INTO `admin_users` (
    `id`, `name`, `email`, `role`, `department`, `phone`, `status`, `avatar`,
    `password_hash`, `permissions_json`, `last_login`
) VALUES
(
    'admin-1',
    'Administrator Utama CMS',
    'admin@smkyapekgombong.sch.id',
    'Super Admin CMS',
    'Pusat Sistem Informasi & Humas',
    '081226789020',
    'active',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    '$2y$10$YourHashedPasswordHereForLocalAuth123',
    '["articles", "ppdb", "majors", "gallery", "identity", "bkk", "database", "analytics"]',
    'Hari ini, 09:15 WIB'
),
(
    'admin-2',
    'Biro Humas & Redaksi Warta',
    'humas@smkyapekgombong.sch.id',
    'Admin Humas & Redaksi',
    'Biro Hubungan Masyarakat',
    '081398765432',
    'active',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    '$2y$10$YourHashedPasswordHereForLocalAuth456',
    '["articles", "gallery"]',
    'Kemarin, 14:30 WIB'
)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;

-- ==============================================================================
-- DATABASE INITIALIZATION COMPLETE - SIAP DIGUNAKAN DI XAMPP / PHPMYADMIN
-- ==============================================================================
