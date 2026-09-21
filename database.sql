-- ==============================================================================
-- DATABASE CONFIGURATION & INITIALIZATION SCHEMA
-- SISTEM INFORMASI & PORTAL RESMI SMK YAPEK GOMBONG
-- KABUPATEN KEBUMEN, JAWA TENGAH
--
-- Kompatibel dengan: PostgreSQL 12+, MySQL 5.7 / 8.0+, MariaDB 10.3+, SQLite 3
-- Karakter encoding: UTF-8 / utf8mb4
-- ==============================================================================

-- 1. PEMBUATAN DATABASE (Opsional jika belum dibuat)
-- CREATE DATABASE smk_yapek_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE smk_yapek_db;

-- ==============================================================================
-- TABEL 1: school_identity (Profil & Identitas Sekolah)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS school_identity (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(50) NOT NULL,
    motto VARCHAR(255),
    tagline TEXT,
    npsn VARCHAR(20) NOT NULL,
    accreditation VARCHAR(20) DEFAULT 'A (Unggul)',
    established_year VARCHAR(10) DEFAULT '1967',
    address TEXT NOT NULL,
    phone VARCHAR(50),
    alt_phone VARCHAR(50),
    whatsapp VARCHAR(50),
    email VARCHAR(100),
    website VARCHAR(150),
    instagram VARCHAR(150),
    instagram_handle VARCHAR(50),
    vision TEXT,
    missions_json TEXT,         -- Array JSON misi sekolah
    stats_json TEXT,            -- Statistik jumlah siswa, alumni, dsb
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- TABEL 2: headmaster_profile (Profil Kepala Sekolah)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS headmaster_profile (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(150) NOT NULL,
    nip VARCHAR(50),
    avatar TEXT,
    period VARCHAR(50),
    quote TEXT,
    speech_greeting TEXT,
    speech_content_1 TEXT,
    speech_content_2 TEXT,
    speech_closing TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- TABEL 3: majors (6 Program Keahlian / Jurusan SMK YAPEK)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS majors (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(30) NOT NULL,
    name VARCHAR(255) NOT NULL,
    short_desc TEXT,
    full_desc TEXT,
    icon_name VARCHAR(50),
    color VARCHAR(30),
    accreditation VARCHAR(10) DEFAULT 'A',
    image TEXT,
    skills_json TEXT,           -- Array keahlian utama
    career_prospects_json TEXT, -- Peluang karir lulusan
    facilities_json TEXT,       -- Sarana & lab praktik
    partners_json TEXT,         -- Rekanan industri DU/DI
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- TABEL 4: news (Warta & Berita Resmi Sekolah)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS news (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- Akademik, Prestasi, Kegiatan, PPDB, BKK
    date_text VARCHAR(50) NOT NULL,
    image TEXT NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(150) NOT NULL,
    views INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'published', -- published, draft, archived
    tags_json TEXT,
    related_article_ids_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- TABEL 5: news_attachments (Berkas Lampiran Dokumen Warta: PDF, DOCX, XLSX, dsb)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS news_attachments (
    id VARCHAR(50) PRIMARY KEY,
    news_id VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    file_type VARCHAR(20) NOT NULL, -- pdf, docx, doc, xlsx, xls, pptx, image, other
    file_size VARCHAR(50) NOT NULL,
    url TEXT NOT NULL,
    upload_date VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attachment_news FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE
);

-- ==============================================================================
-- TABEL 6: news_content_images (Galeri Foto Dokumentasi Kegiatan Berita)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS news_content_images (
    id VARCHAR(50) PRIMARY KEY,
    news_id VARCHAR(50) NOT NULL,
    url TEXT NOT NULL,
    caption TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_content_image_news FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE
);

-- ==============================================================================
-- TABEL 7: ppdb_applicants (Pendaftar PPDB Online)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS ppdb_applicants (
    id VARCHAR(50) PRIMARY KEY,
    nisn VARCHAR(20) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    birth_place VARCHAR(100),
    birth_date DATE,
    origin_school VARCHAR(255),
    parent_name VARCHAR(255),
    parent_phone VARCHAR(50),
    email VARCHAR(100),
    address TEXT,
    first_major VARCHAR(50) NOT NULL,
    second_major VARCHAR(50),
    track VARCHAR(50) DEFAULT 'Reguler', -- Reguler, Prestasi, Afirmasi / KIP
    avg_report_score DECIMAL(5, 2),
    status VARCHAR(50) DEFAULT 'Menunggu Verifikasi',
    registered_at VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- TABEL 8: job_postings (Lowongan Bursa Kerja Khusus - BKK)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS job_postings (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    logo TEXT,
    location VARCHAR(150),
    type VARCHAR(50) DEFAULT 'Full-time', -- Full-time, Magang / PKL, Kontrak
    majors_required_json TEXT,
    salary_range VARCHAR(100),
    deadline VARCHAR(50),
    description TEXT,
    requirements_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- TABEL 9: alumni_testimonials (Kisah Sukses Alumni / Tracer Study)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS alumni_testimonials (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    graduation_year INT NOT NULL,
    major VARCHAR(150) NOT NULL,
    role VARCHAR(150) NOT NULL,
    company VARCHAR(255) NOT NULL,
    avatar TEXT,
    content TEXT NOT NULL,
    rating INT DEFAULT 5,
    highlight VARCHAR(255),
    status VARCHAR(20) DEFAULT 'approved', -- approved, pending, rejected
    submitted_at VARCHAR(50),
    shared_at VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- TABEL 10: activity_gallery (Galeri Dokumentasi Foto Kegiatan Sekolah)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS activity_gallery (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    activity_type VARCHAR(100) NOT NULL, -- Praktik Kejuruan, Ekstrakurikuler, Upacara & Apel, Kunjungan Industri, Lomba & Prestasi, Sosial & Rohani
    date_text VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    image TEXT NOT NULL,
    caption TEXT,
    photographer VARCHAR(150),
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- TABEL 11: admin_users (Akun Pengelola & Redaksi)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS admin_users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL, -- Super Admin CMS, Admin Humas & Redaksi, Kepala Sekolah
    avatar TEXT,
    password_hash VARCHAR(255),
    last_login VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- TABEL 12: visitor_logs (Log Kunjungan Analitik Portal)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS visitor_logs (
    id VARCHAR(50) PRIMARY KEY,
    ip_masked VARCHAR(50),
    page VARCHAR(150),
    source VARCHAR(100),
    device VARCHAR(50),
    city VARCHAR(100),
    visit_time VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- INDEXING UNTUK OPTIMASI PERFORMA PENCARIAN
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_status ON news(status);
CREATE INDEX IF NOT EXISTS idx_news_date ON news(created_at);
CREATE INDEX IF NOT EXISTS idx_attachment_news ON news_attachments(news_id);
CREATE INDEX IF NOT EXISTS idx_content_image_news ON news_content_images(news_id);
CREATE INDEX IF NOT EXISTS idx_ppdb_nisn ON ppdb_applicants(nisn);
CREATE INDEX IF NOT EXISTS idx_ppdb_status ON ppdb_applicants(status);
CREATE INDEX IF NOT EXISTS idx_testimonials_status ON alumni_testimonials(status);
CREATE INDEX IF NOT EXISTS idx_gallery_type ON activity_gallery(activity_type);

-- ==============================================================================
-- DATA AWAL (SEED DATA)
-- ==============================================================================

-- 1. IDENTITAS SEKOLAH
INSERT INTO school_identity (
    id, name, short_name, motto, tagline, npsn, accreditation, established_year,
    address, phone, alt_phone, whatsapp, email, website, instagram, instagram_handle,
    vision, missions_json, stats_json
) VALUES (
    'yapek-main',
    'SMK YAPEK GOMBONG',
    'SMK YAGO',
    'Lembaga Pendidikan Kejuruan Berkualitas',
    'Beriman, Kompeten, Kreatif, Mandiri & Berdaya Saing Global',
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
) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 2. KEPALA SEKOLAH
INSERT INTO headmaster_profile (
    id, name, title, nip, avatar, period, quote, speech_greeting,
    speech_content_1, speech_content_2, speech_closing
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
) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 3. ENAM PROGRAM KEAHLIAN / JURUSAN
INSERT INTO majors (
    id, code, name, short_desc, full_desc, icon_name, color, accreditation, image,
    skills_json, career_prospects_json, facilities_json, partners_json
) VALUES 
(
    'tkj',
    'TKJ',
    'Teknik Komputer & Jaringan',
    'Spesialisasi rekayasa jaringan, konfigurasi server cloud, keamanan siber, dan infrastruktur IT enterprise.',
    'Program Keahlian TKJ SMK YAPEK Gombong membekali peserta didik dengan keahlian praktis merakit komputer, instalasi sistem operasi, routing Mikrotik/Cisco, administrasi server Linux/Windows, fiber optic, dan internet security berstandar industri.',
    'Network',
    '#0284c7',
    'A',
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=900&q=80',
    '["Mikrotik Certified Network Associate (MTCNA)", "Instalasi & Konfigurasi Jaringan Fiber Optic", "Administrasi Linux Server & Cloud Computing", "Cyber Security & Firewall Management", "Maintenance & Hardware Troubleshooting"]',
    '["Network Administrator & Engineer", "Technical Support Specialist", "Cloud & Server Administrator", "Cyber Security Junior Analyst", "Wirausaha ISP / Teknisi Jaringan"]',
    '["Lab Komputer TKJ Ber-AC & Jaringan Gigabit", "Mikrotik & Cisco Hardware Lab", "Splicer & OTDR Fiber Optic Toolset", "Server Rack & Data Center Mini"]',
    '["PT Telkom Indonesia", "MikroTik Academy", "Biznet Networks", "Lintasarta"]'
),
(
    'akl',
    'AKL',
    'Akuntansi & Keuangan Lembaga',
    'Pakar pembukuan digital, perpajakan, audit keuangan, dan aplikasi sistem akuntansi akurat.',
    'Jurusan AKL SMK YAPEK Gombong berfokus pada penguasaan siklus akuntansi perusahaan jasa, dagang, dan manufaktur, akuntansi perbankan, perpajakan modern, serta software akuntansi komputer mutakhir seperti Accurate dan MYOB.',
    'Calculator',
    '#059669',
    'A',
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=900&q=80',
    '["Komputer Akuntansi (Accurate & MYOB)", "Pengelolaan Kas & Pembukuan Keuangan", "Perpajakan PPh, PPN & e-Faktur", "Akuntansi Perbankan & Syariah", "Audit Sederhana & Penyusunan Laporan Keuangan"]',
    '["Staff Accounting & Finance Perusahaan", "Teller & Customer Service Perbankan", "Staff Administrasi Perpajakan", "Kasir & Payroll Officer", "Konsultan Pembukuan Mandiri"]',
    '["Bank Mini YAGO (Mini Bank Praktik Siswa)", "Lab Komputer Akuntansi Terlisensi Accurate", "Ruang Simulasi Transaksi Keuangan"]',
    '["Bank Jateng", "Bank Mandiri", "BPR Kebumen", "Kantor Akuntan Publik (KAP)"]'
),
(
    'otkp',
    'MP / OTKP',
    'Manajemen Perkantoran & Layanan Bisnis',
    'Mencetak tenaga administrasi profesional, sekretaris eksekutif, dan pengelola operasional kantor cerdas.',
    'Membekali siswa dengan kompetensi tata kelola surat menyurat digital, kearsipan elektronik (e-filing), public relations, event management, protokoler, serta korespondensi bisnis dwibahasa (Indonesia & Inggris).',
    'Briefcase',
    '#d97706',
    'A',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=900&q=80',
    '["Otomatisasi Tata Kelola Perkantoran Digital", "Manajemen Kearsipan Modern & E-Filing", "Korespondensi Bisnis & Komunikasi Publik", "Pengelolaan Rapat & Protokoler Resmi", "Aplikasi Perkantoran Terpadu (MS 365 & Google Workspace)"]',
    '["Sekretaris Eksekutif & Asisten Manajer", "Staff Administrasi Kantor & Pemerintahan", "Public Relations / Front Office Staff", "Data Entry Operator & Arsiparis Digital", "Event & Meeting Organizer"]',
    '["Ruang Simulasi Perkantoran Modern", "Lab Mesin & Teknologi Kantor", "Smart Meeting & Conference Room"]',
    '["Dinas Tenaga Kerja Kebumen", "PT POS Indonesia", "BUMN & Korporasi Swasta"]'
),
(
    'bdp',
    'BDP / PM',
    'Pemasaran & Bisnis Digital',
    'Menguasai strategi e-commerce, content marketing, ritel modern, dan kewirausahaan digital.',
    'Mempersiapkan siswa menjadi praktisi pemasaran tangguh di era digital. Mempelajari social media marketing, SEO/SEM, fotografi produk, live streaming commerce, display toko modern, dan manajemen ritel berstandar industri.',
    'ShoppingBag',
    '#ea580c',
    'A',
    'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=900&q=80',
    '["Digital & Social Media Marketing (TikTok Shop, Shopee, IG)", "Copywriting & Content Creation", "Manajemen Ritel Modern & Point of Sale (POS)", "Customer Relationship Management (CRM)", "Wirausaha & E-Commerce Operasional"]',
    '["Digital Marketing Specialist", "Supervisor / Manager Toko Ritel Modern", "Content Creator & Live Streamer Seller", "Sales Executive & Account Officer", "Entrepreneur / Pemilik Bisnis Online"]',
    '["YAGO Business Center & Minimarket Praktik", "Studio Live Streaming & Fotografi Produk", "Lab Digital Marketing & E-Commerce"]',
    '["PT Sumber Alfaria Trijaya (Alfamart)", "PT Indomarco Prismatama (Indomaret)", "Shopee Indonesia"]'
),
(
    'tkkr',
    'TKKR',
    'Tata Kecantikan Kulit & Rambut',
    'Jurusan unggulan pelopor kecantikan profesional, tata rias artistik, perawatan kulit, dan hair styling modern.',
    'Jurusan TKKR SMK YAPEK Gombong merupakan salah satu program unggulan kebanggaan Kebumen. Dilengkapi salon dan spa kecantikan standar industri untuk pelatihan bridal makeup, facial treatment, body spa, nail art, hingga hair colouring dan hair styling komersial.',
    'Sparkles',
    '#e11d48',
    'A',
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80',
    '["Tata Rias Pengantin Tradisional & Modern (Bridal MUA)", "Perawatan Kulit Wajah & Facial Elektrik", "Pemangkasan, Penataan & Pewarnaan Rambut", "Body Spa, Manicure, Pedicure & Nail Art", "Manajemen Bisnis Salon & Beauty Clinic"]',
    '["Professional Make-Up Artist (MUA)", "Beauty Therapist & Skin Consultant", "Hair Stylist & Salon Director", "Beauty Advisor Brand Kosmetik Ternama", "Owner Beauty Salon, Barbershop & Spa"]',
    '["Beauty Center Salon & Spa Terstandar", "Studio Rias Pengantin & Foto Portofolio", "Peralatan Facial High Frequency & Bed Treatment Modern"]',
    '["PT Paragon Technology (Wardah / Make Over)", "Martha Tilaar", "Rudy Hadisuwarno", "Asosiasi MUA Indonesia"]'
),
(
    'tkr',
    'TKR',
    'Teknik Kendaraan Ringan Otomotif',
    'Spesialis mesin otomotif modern, Electronic Fuel Injection (EFI), chasis, dan kelistrikan mobil.',
    'Mendidik calon mekanik dan teknisi otomotif andal dengan penguasaan diagnosis komputer (engine scanner), overhaul mesin bensin & diesel, sistem AC mobil, rem ABS, spooring & balancing, serta keselamatan kerja bengkel standar pabrikan.',
    'Wrench',
    '#4f46e5',
    'A',
    'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=900&q=80',
    '["Tune-Up & Overhaul Mesin Otomotif (EFI & Diesel)", "Diagnosis Komputer Engine Scanner", "Troubleshooting Kelistrikan Bodi & ECU", "Service Transmisi Otomatis & Manual", "Perawatan Sistem Rem ABS, Kemudi, & Suspensi"]',
    '["Teknisi Mekanik Bengkel Resmi Agen Pemegang Merek (APM)", "Service Advisor Otomotif", "Quality Control Industri Perakitan Mobil", "Teknisi Audio & Kelistrikan Mobil", "Pemilik Bengkel Otomotif Mandiri"]',
    '["Bengkel Otomotif Standar Bengkel Resmi", "Unit Mobil Praktik EFI & Diesel Common Rail", "Car Lift Hidrolik, Scanner Diagnostic, & Tire Changer"]',
    '["PT Astra Honda Motor", "Auto2000", "Suzuki Indomobil", "Bengkel Mitra Terpercaya"]'
) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 4. DATA BERITA & WARTA RESMI
INSERT INTO news (
    id, title, category, date_text, image, summary, content, author, views, status,
    tags_json, related_article_ids_json
) VALUES 
(
    'news-1',
    'Penerimaan Peserta Didik Baru (PPDB) SMK YAPEK Gombong Tahun Ajaran 2026/2027 Dibuka',
    'PPDB',
    '20 September 2026',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    'SMK YAPEK Gombong membuka pendaftaran calon peserta didik baru melalui jalur Reguler, Prestasi, dan Afirmasi dengan beasiswa bebas biaya gedung untuk siswa berprestasi.',
    'Gombong, Kebumen — SMK YAPEK Gombong secara resmi membuka Penerimaan Peserta Didik Baru (PPDB) untuk Tahun Ajaran 2026/2027. Pembukaan pendaftaran ini disambut antusias oleh ratusan calon siswa lulusan SMP/MTs di wilayah Kabupaten Kebumen, Banyumas, dan sekitarnya.\n\nKepala SMK YAPEK Gombong, Drs. H. Suwarno, M.M., menyampaikan bahwa pada tahun ajaran ini pihak sekolah menyediakan kuota untuk 6 program keahlian unggulan berakreditasi A, yaitu TKJ, AKL, Manajemen Perkantoran (OTKP), Bisnis Daring & Pemasaran, Tata Kecantikan Kulit dan Rambut (TKKR), serta Teknik Kendaraan Ringan (TKR).\n\n"Kami berkomitmen memberikan akses pendidikan vokasi berkualitas dengan fasilitas laboratorium berstandar industri. Bagi siswa berprestasi peringkat 1 sampai 3 di sekolah asal, kami memberikan beasiswa khusus pembebasan biaya Sumbangan Pengembangan Institusi (SPI)," jelas beliau.\n\nPendaftaran dapat dilakukan secara daring (online) melalui portal resmi sekolah atau hadir langsung di Sekretariat Panitia PPDB Kampus SMK YAPEK Gombong Jl. Merbabu No. 64 Wero, Gombong setiap hari kerja pukul 07.30 - 14.30 WIB.',
    'Panitia PPDB 2026',
    1420,
    'published',
    '["PPDB 2026", "Pendaftaran", "Beasiswa", "Gombong"]',
    '["news-2", "news-3"]'
),
(
    'news-2',
    'Siswa TKJ SMK YAPEK Raih Juara 1 LKS Tingkat Karesidenan Kedu Bidang Network System',
    'Prestasi',
    '14 September 2026',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    'Prestasi membanggakan kembali diukir oleh ananda Dwi Cahyo siswa kelas XII TKJ yang menyabet medali emas Lomba Kompetensi Siswa (LKS) bidang IT Network System Administration.',
    'Magelang — Kabar membanggakan datang dari ajang Lomba Kompetensi Siswa (LKS) SMK Tingkat Karesidenan Kedu tahun 2026. Dwi Cahyo, siswa kelas XII Teknik Komputer dan Jaringan (TKJ) SMK YAPEK Gombong berhasil menorehkan medali emas setelah menundukkan 18 kontestan perwakilan SMK se-Karesidenan Kedu.\n\nDalam perlombaan yang berlangsung selama dua hari penuh ini, para peserta diuji kemampuannya dalam melakukan konfigurasi Cisco Router & Switch, routing dinamis BGP/OSPF, virtualisasi Proxmox, keamanan firewall, dan fiber optic troubleshooting.\n\nPembimbing lomba, Budi Santoso, S.Kom., mengungkapkan rasa syukur dan bangganya atas dedikasi dan kerja keras yang ditunjukkan ananda Dwi Cahyo selama masa karantina di laboratorium jaringan sekolah.\n\n"Kemenangan ini membuktikan bahwa kompetensi peserta didik SMK YAPEK Gombong mampu bersaing di level tertinggi. Selanjutnya ananda Dwi Cahyo akan mewakili Karesidenan Kedu di LKS Tingkat Provinsi Jawa Tengah," tutur beliau.',
    'Humas SMK YAGO',
    980,
    'published',
    '["Prestasi", "TKJ", "LKS Kedu", "Medali Emas"]',
    '["news-1", "news-3"]'
),
(
    'news-3',
    'Bursa Kerja Khusus (BKK) YAPEK Gelar Rekrutmen Langsung Bersama PT Astra & Alfamart Group',
    'BKK',
    '08 September 2026',
    'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80',
    'Sebanyak 180 calon lulusan dan alumni mengikuti walk-in interview dan tes psikotes penempatan kerja industri di aula utama SMK YAPEK Gombong.',
    'Gombong — Komitmen SMK YAPEK Gombong dalam menjamin masa depan lulusannya kembali terwujud melalui kegiatan rekrutmen kerja massal (Campus Hiring) yang digelar oleh Bursa Kerja Khusus (BKK) YAPEK bekerja sama dengan PT Astra Honda Motor dan PT Sumber Alfaria Trijaya Tbk (Alfamart Group).\n\nAcara yang dipusatkan di Aula Utama SMK YAPEK Gombong ini diikuti oleh lebih dari 180 pelamar yang terdiri atas alumni lintas angkatan serta calon lulusan kelas XII. Tahapan seleksi meliputi verifikasi berkas administrasi, tes potensi akademik, psikotes digital, dan walk-in interview bersama Human Resource Department (HRD) perusahaan mitra.\n\nKoordinator BKK SMK YAPEK Gombong menyatakan bahwa kegiatan penyaluran kerja seperti ini diadakan secara berkala tiap kuartal guna memastikan tingkat keterserapan lulusan tetap berada di atas 89%.\n\nBagi para alumni yang dinyatakan lolos seleksi final, mereka akan langsung menandatangani kontrak kerja dan diberangkatkan menuju fasilitas pabrik perakitan dan jaringan ritel nasional.',
    'Koordinator BKK',
    1850,
    'published',
    '["BKK", "Lowongan Kerja", "Astra", "Alfamart"]',
    '["news-1", "news-4"]'
),
(
    'news-4',
    'Workshop Beauty Demo & Masterclass Bridal Makeup bersama Brand Kosmetik Nasional',
    'Kegiatan',
    '02 September 2026',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
    'Jurusan Tata Kecantikan Kulit dan Rambut (TKKR) menggelar workshop inspiratif tren rias pengantin adat nusantara dan modern glamor bersama praktisi MUA profesional.',
    'Gombong — Ruang Praktik Siswa (RPS) Tata Kecantikan SMK YAPEK Gombong semarak dengan digelarnya Workshop Beauty Demo & Masterclass bertajuk "Eksplorasi Rias Pengantin Nusantara Modern dan Tata Rias Komersial".\n\nAcara ini menghadirkan praktisi Make-Up Artist (MUA) tersohor dan perwakilan tim edukasi brand kecantikan nasional. Sebanyak 75 siswi jurusan Tata Kecantikan Kulit dan Rambut (TKKR) mengikuti setiap sesi praktik secara langsung, mulai dari teknik skin preparation yang tepat, teknik blending complexion tahan lama, hingga pemasangan hijab do dan sanggul modern.\n\nKetua Program Keahlian TKKR menuturkan bahwa kegiatan workshop praktisi mengajar ini merupakan bagian integral dari program link and match kurikulum vokasi, sehingga para siswi telah memiliki standar industri dan portofolio profesional sebelum lulus.',
    'Ketua Program TKKR',
    760,
    'published',
    '["Tata Kecantikan", "TKKR", "Workshop", "MUA"]',
    '["news-1", "news-2"]'
) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

-- 5. DATA BERKAS LAMPIRAN DOKUMEN WARTA (ATTACHMENTS)
INSERT INTO news_attachments (id, news_id, name, file_type, file_size, url, upload_date) VALUES 
('att-1', 'news-1', 'Juknis_PPDB_SMK_YAPEK_2026_2027.pdf', 'pdf', '2.4 MB', '#', '20 Sep 2026'),
('att-2', 'news-1', 'Formulir_Pendaftaran_Siswa_Baru_2026.docx', 'docx', '485 KB', '#', '20 Sep 2026'),
('att-3', 'news-2', 'Berita_Acara_Hasil_Penilaian_LKS_Karesidenan_Kedu.pdf', 'pdf', '1.8 MB', '#', '14 Sep 2026'),
('att-4', 'news-3', 'Daftar_Peserta_Lolos_Seleksi_Campus_Hiring.xlsx', 'xlsx', '320 KB', '#', '08 Sep 2026')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 6. DATA FOTO DOKUMENTASI KONTEN BERITA
INSERT INTO news_content_images (id, news_id, url, caption, sort_order) VALUES
('cimg-1', 'news-1', 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80', 'Pelayanan verifikasi berkas PPDB di ruang sekretariat', 1),
('cimg-2', 'news-2', 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=800&q=80', 'Penyerahan medali emas dan trofi juara LKS Karesidenan Kedu', 2)
ON CONFLICT (id) DO UPDATE SET caption = EXCLUDED.caption;

-- 7. PENDAFTAR PPDB ONLINE
INSERT INTO ppdb_applicants (
    id, nisn, full_name, gender, birth_place, birth_date, origin_school,
    parent_name, parent_phone, email, address, first_major, second_major,
    track, avg_report_score, status, registered_at
) VALUES 
(
    'YAGO-2026-001',
    '0089281721',
    'Rizky Pratama Yudha',
    'Laki-laki',
    'Kebumen',
    '2010-04-15',
    'SMP Negeri 1 Gombong',
    'Bambang Sugiono',
    '081234567890',
    'rizky.pratama@gmail.com',
    'Jl. Yos Sudarso No. 12, Wero, Gombong',
    'TKJ',
    'TKR',
    'Prestasi',
    88.50,
    'Lolos Seleksi Administrasi',
    '2026-09-18 10:30'
),
(
    'YAGO-2026-002',
    '0091827364',
    'Anisa Nur Rahmawati',
    'Perempuan',
    'Gombong',
    '2010-08-22',
    'MTs Negeri 1 Kebumen',
    'Siti Aminah',
    '082198765432',
    'anisa.nur@gmail.com',
    'Desa Semondo, RT 02/03, Gombong',
    'AKL',
    'MP / OTKP',
    'Reguler',
    86.00,
    'Berkas Lengkap',
    '2026-09-19 14:15'
),
(
    'YAGO-2026-003',
    '0087654321',
    'Nabila Putri Anggraeni',
    'Perempuan',
    'Kebumen',
    '2010-11-05',
    'SMP Negeri 2 Karanganyar',
    'Haryanto',
    '085712345678',
    'nabila.putri@gmail.com',
    'Jl. Raya Karanganyar Km. 3, Kebumen',
    'TKKR',
    'BDP / PM',
    'Afirmasi / KIP',
    84.80,
    'Menunggu Verifikasi',
    '2026-09-20 09:00'
) ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

-- 8. LOWONGAN BURSA KERJA KHUSUS (BKK)
INSERT INTO job_postings (
    id, title, company, logo, location, type, majors_required_json,
    salary_range, deadline, description, requirements_json
) VALUES 
(
    'job-1',
    'Staff Junior Network Engineer & IT Support',
    'PT Telkom Akses / Mitra Gombong',
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=150&q=80',
    'Kebumen & Purwokerto',
    'Full-time',
    '["TKJ"]',
    'Rp 2.800.000 - Rp 3.800.000',
    '10 Oktober 2026',
    'Bertanggung jawab melakukan pemeliharaan jaringan kabel fiber optik, setup router ONT, dan konfigurasi akses point pelanggan.',
    '["Lulusan SMK Jurusan TKJ (fresh graduate dipersilakan)", "Memahami dasar TCP/IP, Mikrotik, dan fiber optik", "Memiliki SIM C aktif dan kendaraan sendiri", "Disiplin, jujur, dan berorientasi pada pelayanan"]'
),
(
    'job-2',
    'Junior Accounting & Kasir Toko Ritel',
    'PT Sumber Alfaria Trijaya Tbk (Alfamart)',
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=150&q=80',
    'Gombong, Kebumen & Banyumas',
    'Full-time',
    '["AKL", "BDP / PM"]',
    'Rp 2.600.000 - Rp 3.400.000',
    '15 Oktober 2026',
    'Mengelola transaksi kasir POS, pencatatan stock opname harian, rekonsiliasi kas masuk-keluar, serta laporan harian toko.',
    '["Lulusan SMK Jurusan AKL atau BDP", "Teliti berhitung dan menguasai Excel dasar", "Komunikatif, berpenampilan rapi dan ramah", "Bersedia bekerja dalam sistem shift kerja ritel"]'
),
(
    'job-3',
    'Beauty Therapist & Hair Stylist Trainee',
    'Glow Beauty Clinic & Salon Premium',
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=150&q=80',
    'Kebumen Kota & Gombong',
    'Full-time',
    '["TKKR"]',
    'Rp 2.700.000 + Insentif Treatment',
    '25 Oktober 2026',
    'Melakukan pelayanan facial treatment modern, creambath spa, manicure pedicure, dan penataan rambut konsumen klinik.',
    '["Lulusan SMK Jurusan Tata Kecantikan Kulit & Rambut", "Menyukai dunia estetika dan hospitality", "Memiliki sertifikasi kompetensi keahlian menjadi nilai plus", "Siap mengikuti training SOP klinik kecantikan"]'
),
(
    'job-4',
    'Staff Administrasi & Customer Service',
    'PT Mandiri Finance Cabang Kebumen',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=150&q=80',
    'Gombong - Kebumen',
    'Kontrak',
    '["MP / OTKP", "AKL"]',
    'Rp 2.900.000 - Rp 3.500.000',
    '30 Oktober 2026',
    'Pengarsipan dokumen nasabah, input data aplikasi pembiayaan, verifikasi kelengkapan berkas, dan menyambut tamu kantor.',
    '["Lulusan SMK Jurusan Manajemen Perkantoran / OTKP", "Cekatan mengetik dan mengoperasikan MS Office", "Kemampuan komunikasi verbal yang santun dan jelas"]'
) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

-- 9. KISAH SUKSES ALUMNI (TRACER STUDY)
INSERT INTO alumni_testimonials (
    id, name, graduation_year, major, role, company, avatar, content, rating, highlight, status, shared_at
) VALUES 
(
    'testi-1',
    'Bagas Prasetyo, S.Kom.',
    2025,
    'Teknik Komputer & Jaringan (TKJ)',
    'Junior Cloud & Network Engineer',
    'PT Telkom Akses Regional Jawa Tengah',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    'Berkat sertifikasi Mikrotik dan kurikulum fiber optic di SMK YAPEK Gombong, saat tes teknis di PT Telkom Akses saya sudah sangat terbiasa dengan konfigurasi routing dan teknik splicing kabel. BKK sekolah sangat proaktif menghubungkan lulusan langsung dengan dunia industri.',
    5,
    'Diterima kerja sebelum wisuda melalui Campus Hiring BKK YAPEK',
    'approved',
    '15 Januari 2026'
),
(
    'testi-2',
    'Rina Novita Sari',
    2025,
    'Akuntansi & Keuangan Lembaga (AKL)',
    'Junior Auditor & Finance Staff',
    'Kantor Akuntan Publik (KAP) Semarang',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    'Praktik akuntansi komputer dan software Accurate di lab komputer SMK YAPEK benar-benar mencerminkan kondisi riil di kantor audit. Guru-guru AKL sangat telaten membimbing hingga kami mengantongi sertifikasi kompetensi BNSP resmi.',
    5,
    'Sertifikasi BNSP Teknisi Akuntansi Yunior',
    'approved',
    '20 Januari 2026'
),
(
    'testi-3',
    'Dimas Arya Saputra',
    2024,
    'Teknik Kendaraan Ringan (TKR)',
    'Diagnostic Master Technician',
    'Auto2000 Kebumen & Yogyakarta',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    'Fasilitas bengkel dan unit mesin injeksi EFI di SMK YAPEK sangat memadai dan selalu mengikuti perkembangan teknologi mobil modern. Disiplin ala industri dan budaya kerja 5R yang ditanamkan membuat saya cepat beradaptasi dengan ritme kerja bengkel resmi Toyota.',
    5,
    'Juara 1 LKS Otomotif Karesidenan Kedu 2024',
    'approved',
    '05 Februari 2026'
),
(
    'testi-4',
    'Siti Nurhaliza',
    2024,
    'Tata Kecantikan Kulit & Rambut (TKKR)',
    'Founder & Lead Beauty Stylist',
    'Eliza Bridal & Beauty Studio Gombong',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
    'Di jurusan Tata Kecantikan SMK YAPEK, kami tidak hanya diajari teknik rias pengantin modern dan perawatan kulit berstandar salon ternama, tetapi juga manajemen bisnis dan hospitality. Kini saya mandiri membuka studio salon sendiri dan mempekerjakan 4 asisten.',
    5,
    'Wirausahawan Muda Sukses Beromzet Puluhan Juta',
    'approved',
    '12 Februari 2026'
) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 10. GALERI DOKUMENTASI KEGIATAN
INSERT INTO activity_gallery (
    id, title, activity_type, date_text, location, image, caption, photographer, featured
) VALUES 
(
    'gal-1',
    'Praktik Uji Diagnostik Sistem Injeksi Otomotif TKR',
    'Praktik Kejuruan',
    '18 September 2026',
    'Bengkel Otomotif Modern SMK YAPEK',
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    'Siswa kelas XII Teknik Kendaraan Ringan (TKR) mempraktikkan diagnosis kelistrikan mesin menggunakan scanner scanner OBD-II berstandar bengkel resmi APM.',
    'Tim Dokumentasi Humas',
    TRUE
),
(
    'gal-2',
    'Konfigurasi Server & Fiber Optic di Laboratorium TKJ',
    'Praktik Kejuruan',
    '14 September 2026',
    'Laboratorium Cisco & Fiber Optic TKJ',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    'Pelaksanaan praktikum splicing kabel fiber optic dan routing Mikrotik bersama instruktur industri mitra telekomunikasi.',
    'Humas SMK YAPEK',
    TRUE
),
(
    'gal-3',
    'Latihan Kedisiplinan & Formasi Pasukan Paskibraka',
    'Ekstrakurikuler',
    '10 September 2026',
    'Lapangan Upacara Utama SMK YAPEK',
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    'Anggota Paskibra SMK YAPEK Gombong rutin mengasah kekompakan formasi baris berbaris dan kepemimpinan berkarakter unggul.',
    'Eskul Paskibraka',
    FALSE
),
(
    'gal-4',
    'Upacara Peringatan Hari Kemerdekaan RI Ke-81',
    'Upacara & Apel',
    '17 Agustus 2026',
    'Plaza Upacara SMK YAPEK Gombong',
    'https://images.unsplash.com/photo-1526976668912-1a811878dd37?auto=format&fit=crop&w=800&q=80',
    'Keluarga besar SMK YAPEK Gombong melangsungkan upacara bendera dengan khidmat, diikuti oleh seluruh dewan guru, karyawan, dan 1.400 siswa.',
    'Tim Media Sekolah',
    TRUE
) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

-- 11. AKUN ADMIN CMS & REDAKSI
INSERT INTO admin_users (id, name, email, role, avatar, last_login) VALUES 
('admin-1', 'Admin Utama Humas & IT', 'admin@smkyapekgombong.sch.id', 'Super Admin CMS', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', 'Hari ini, 08:30 WIB'),
('admin-2', 'Drs. H. Suwarno, M.M.', 'kepsek@smkyapekgombong.sch.id', 'Kepala Sekolah', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', 'Kemarin, 16:45 WIB'),
('admin-3', 'Tim Redaksi & Humas BKK', 'redaksi@smkyapekgombong.sch.id', 'Admin Humas & Redaksi', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', '2 hari yang lalu')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 12. LOG KUNJUNGAN ANALITIK
INSERT INTO visitor_logs (id, ip_masked, page, source, device, city, visit_time) VALUES
('log-1', '182.253.***.24', 'Portal PPDB Online', 'Instagram Stories', 'Mobile', 'Gombong, Kebumen', 'Baru saja'),
('log-2', '114.122.***.89', 'Program Keahlian TKJ', 'Google Search', 'Mobile', 'Purwokerto', '1 menit lalu'),
('log-3', '36.85.***.112', 'Lowongan Kerja PT Telkom Akses', 'WhatsApp Direct', 'Desktop', 'Kebumen Kota', '3 menit lalu'),
('log-4', '125.163.***.45', 'Beranda & Sambutan Kepala Sekolah', 'Direct URL', 'Desktop', 'Cilacap', '5 menit lalu'),
('log-5', '180.246.***.73', 'Testimoni Alumni Sukses', 'Instagram Bio', 'Mobile', 'Kutoarjo, Purworejo', '8 menit lalu')
ON CONFLICT (id) DO UPDATE SET page = EXCLUDED.page;

-- ==============================================================================
-- AKHIR DARI FILE DATABASE & INISIALISASI TABEL SMK YAPEK GOMBONG
-- ==============================================================================
