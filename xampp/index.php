<?php
/**
 * PORTAL RESMI SMK YAPEK GOMBONG (PHP NATIVE + MYSQL)
 * Berjalan 100% Tanpa API di XAMPP / Apache / phpMyAdmin
 */

require_once __DIR__ . '/koneksi.php';

// 1. Ambil data Identitas Sekolah dari MySQL
$stmt = $pdo->prepare("SELECT * FROM school_identity WHERE id = ? LIMIT 1");
$stmt->execute(['yapek-main']);
$identity = $stmt->fetch();

if (!$identity) {
    $identity = [
        'name' => 'SMK YAPEK GOMBONG',
        'short_name' => 'SMK YAPEK',
        'tagline' => 'Lembaga Pendidikan Kejuruan Terakreditasi A (Unggul)',
        'motto' => 'Disiplin, Terampil, Mandiri, Berakhlak Mulia',
        'logo' => '/logo-emblem.svg',
        'address' => 'Jl. Yos Sudarso No. 123, Gombong, Kabupaten Kebumen, Jawa Tengah 54412',
        'phone' => '(0287) 471234',
        'email' => 'smkyapekgombong@gmail.com',
        'website' => 'www.smkyapekgombong.sch.id',
        'accreditation' => 'A (Unggul)'
    ];
}

// 2. Ambil data Kepala Sekolah
$stmt = $pdo->query("SELECT * FROM headmaster_profile LIMIT 1");
$kepsek = $stmt->fetch();

// 3. Ambil 6 Program Keahlian / Jurusan
$stmt = $pdo->query("SELECT * FROM majors ORDER BY code ASC");
$majors = $stmt->fetchAll();

// 4. Ambil 6 Berita Terbaru
$stmt = $pdo->query("SELECT * FROM news WHERE status = 'published' ORDER BY created_at DESC LIMIT 6");
$newsList = $stmt->fetchAll();

// 5. Ambil Lowongan Kerja BKK
$stmt = $pdo->query("SELECT * FROM job_postings ORDER BY created_at DESC LIMIT 3");
$jobPostings = $stmt->fetchAll();

// 6. Ambil Testimoni Alumni
$stmt = $pdo->query("SELECT * FROM alumni_testimonials WHERE status = 'approved' ORDER BY id ASC LIMIT 3");
$testimonials = $stmt->fetchAll();

// Hitung statistik untuk badge
$countNews = count($newsList);
$countMajors = count($majors);
?>
<!DOCTYPE html>
<html lang="id" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($identity['name']) ?> - Portal Resmi (MySQL Native)</title>
    <link rel="icon" type="image/svg+xml" href="logo-emblem.svg">
    <!-- Tailwind CSS CDN (Tanpa build node_modules) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
    </style>
</head>
<body class="bg-slate-50 text-slate-900 antialiased selection:bg-amber-500 selection:text-white">

    <!-- TOP BAR INFORMASI -->
    <div class="bg-[#0A2E50] text-blue-100 text-xs py-2 px-4 border-b border-blue-900/50">
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
            <div class="flex items-center gap-4">
                <span>📍 <?= htmlspecialchars($identity['address']) ?></span>
                <span class="hidden md:inline">📞 <?= htmlspecialchars($identity['phone'] ?? '') ?></span>
            </div>
            <div class="flex items-center gap-3">
                <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    Akreditasi: <?= htmlspecialchars($identity['accreditation'] ?? 'A') ?>
                </span>
                <a href="admin.php" class="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1">
                    🔐 Login CMS Admin
                </a>
            </div>
        </div>
    </div>

    <!-- NAVBAR UTAMA -->
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <a href="index.php" class="flex items-center gap-3">
                <?php if (!empty($identity['logo'])): ?>
                    <img src="<?= htmlspecialchars($identity['logo']) ?>" alt="Logo Sekolah" class="w-12 h-12 object-contain rounded-xl bg-slate-50 p-1 border border-slate-200 shadow-sm" onerror="this.src='logo-emblem.svg'">
                <?php else: ?>
                    <div class="w-12 h-12 rounded-xl bg-[#0F4374] text-white flex items-center justify-center font-black text-xl shadow-md">
                        Y
                    </div>
                <?php endif; ?>
                <div>
                    <h1 class="font-extrabold text-lg sm:text-xl text-[#0F4374] tracking-tight leading-tight">
                        <?= htmlspecialchars($identity['name']) ?>
                    </h1>
                    <p class="text-xs text-slate-500 font-semibold">
                        Gombong, Kebumen • Terakreditasi <?= htmlspecialchars($identity['accreditation'] ?? 'A') ?>
                    </p>
                </div>
            </a>

            <!-- Nav Links -->
            <nav class="hidden lg:flex items-center gap-6 text-sm font-bold text-slate-700">
                <a href="index.php" class="text-[#0F4374] hover:text-blue-700">Beranda</a>
                <a href="#jurusan" class="hover:text-[#0F4374]">Program Keahlian</a>
                <a href="#berita" class="hover:text-[#0F4374]">Warta & Berita</a>
                <a href="#bkk" class="hover:text-[#0F4374]">BKK & Karir</a>
                <a href="ppdb.php" class="hover:text-[#0F4374] flex items-center gap-1">
                    PPDB 2026/2027
                    <span class="px-1.5 py-0.5 rounded text-[10px] bg-amber-400 text-slate-950 font-black">Buka</span>
                </a>
                <a href="#kontak" class="hover:text-[#0F4374]">Kontak</a>
            </nav>

            <div class="flex items-center gap-2">
                <a href="ppdb.php" class="px-4 py-2.5 rounded-xl bg-[#0F4374] hover:bg-blue-900 text-white text-xs font-black shadow-md transition-all">
                    Daftar PPDB Online
                </a>
            </div>
        </div>
    </header>

    <!-- HERO SECTION -->
    <section class="relative bg-gradient-to-br from-[#0F4374] via-[#124d85] to-[#0A2E50] text-white py-16 sm:py-24 overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div class="lg:col-span-7 space-y-6">
                <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300">
                    <span>✨ Penerimaan Peserta Didik Baru (PPDB) 2026/2027 Telah Dibuka</span>
                </div>
                <h1 class="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                    Mencetak Generasi Unggul, Mandiri & Berakhlak Mulia
                </h1>
                <p class="text-sm sm:text-base text-blue-100 max-w-xl leading-relaxed">
                    <?= htmlspecialchars($identity['tagline'] ?? 'Lembaga Pendidikan Kejuruan Terakreditasi A di Gombong, Kebumen dengan kurikulum link and match industri.') ?>
                </p>
                <div class="flex flex-wrap items-center gap-3 pt-2">
                    <a href="ppdb.php" class="px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm shadow-xl transition-all">
                        🚀 Daftar PPDB Online Sekarang
                    </a>
                    <a href="#jurusan" class="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm backdrop-blur-md transition-all">
                        Lihat 6 Jurusan Unggulan
                    </a>
                </div>

                <!-- Live MySQL Badge -->
                <div class="pt-4 flex items-center gap-2 text-xs text-blue-200">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Terhubung langsung ke MySQL XAMPP (Database: <strong>smk_yapek_db</strong>) tanpa perantara API.</span>
                </div>
            </div>

            <!-- Card Identitas & Logo Utama -->
            <div class="lg:col-span-5">
                <div class="rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-8 text-center space-y-4 shadow-2xl">
                    <?php if (!empty($identity['logo'])): ?>
                        <div class="w-28 h-28 mx-auto bg-white rounded-3xl p-3 shadow-lg flex items-center justify-center">
                            <img src="<?= htmlspecialchars($identity['logo']) ?>" alt="Logo Sekolah" class="max-h-full max-w-full object-contain">
                        </div>
                    <?php endif; ?>
                    <h2 class="text-xl font-black text-white">
                        <?= htmlspecialchars($identity['name']) ?>
                    </h2>
                    <p class="text-xs text-amber-300 font-bold italic">
                        "<?= htmlspecialchars($identity['motto'] ?? 'Disiplin, Terampil, Mandiri') ?>"
                    </p>
                    <div class="grid grid-cols-2 gap-3 pt-2 text-left">
                        <div class="p-3 rounded-xl bg-black/20 border border-white/10">
                            <span class="text-[10px] text-blue-200 block uppercase">NPSN Sekolah</span>
                            <span class="text-sm font-bold text-white font-mono"><?= htmlspecialchars($identity['npsn'] ?? '20305001') ?></span>
                        </div>
                        <div class="p-3 rounded-xl bg-black/20 border border-white/10">
                            <span class="text-[10px] text-blue-200 block uppercase">Akreditasi</span>
                            <span class="text-sm font-bold text-emerald-300"><?= htmlspecialchars($identity['accreditation'] ?? 'A (Unggul)') ?></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- SAMBUTAN KEPALA SEKOLAH -->
    <?php if ($kepsek): ?>
    <section class="py-14 bg-white border-b border-slate-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div class="md:col-span-4 text-center md:text-left">
                <div class="relative inline-block">
                    <img src="<?= htmlspecialchars($kepsek['photo_url']) ?>" alt="<?= htmlspecialchars($kepsek['name']) ?>" class="w-56 h-64 object-cover rounded-3xl shadow-xl mx-auto border-4 border-slate-100" onerror="this.src='https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80'">
                    <span class="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-[#0F4374] text-white text-[10px] font-bold shadow-md">
                        Kepala Sekolah
                    </span>
                </div>
                <h3 class="text-base font-extrabold text-slate-900 mt-3"><?= htmlspecialchars($kepsek['name']) ?></h3>
                <p class="text-xs text-slate-500 font-mono"><?= htmlspecialchars($kepsek['nip'] ?? '') ?></p>
            </div>
            <div class="md:col-span-8 space-y-3">
                <span class="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-[#0F4374]">
                    Sambutan Resmi
                </span>
                <h2 class="text-2xl font-black text-slate-900">
                    <?= htmlspecialchars($kepsek['welcome_title'] ?? 'Mewujudkan Pendidikan Vokasi yang Relevan dengan Industri') ?>
                </h2>
                <div class="text-sm text-slate-600 leading-relaxed space-y-2">
                    <p><?= nl2br(htmlspecialchars($kepsek['welcome_speech'] ?? '')) ?></p>
                </div>
            </div>
        </div>
    </section>
    <?php endif; ?>

    <!-- 6 PROGRAM KEAHLIAN / JURUSAN -->
    <section id="jurusan" class="py-16 bg-slate-50 border-b border-slate-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div class="text-center max-w-2xl mx-auto space-y-2">
                <span class="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                    Pilihan Karir Masa Depan
                </span>
                <h2 class="text-3xl font-black text-slate-900">
                    6 Program Keahlian Unggulan
                </h2>
                <p class="text-sm text-slate-600">
                    Kurikulum berbasis kompetensi dan link and match dengan ratusan mitra industri terkemuka.
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <?php foreach ($majors as $m): ?>
                <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between">
                    <div class="space-y-3">
                        <div class="flex items-center justify-between">
                            <span class="px-3 py-1 rounded-xl text-xs font-extrabold bg-[#0F4374] text-white">
                                <?= htmlspecialchars($m['code']) ?>
                            </span>
                            <span class="text-xs font-bold text-amber-600">
                                Akreditasi A
                            </span>
                        </div>
                        <h3 class="text-lg font-black text-slate-900 leading-snug">
                            <?= htmlspecialchars($m['name']) ?>
                        </h3>
                        <p class="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                            <?= htmlspecialchars($m['short_desc'] ?? '') ?>
                        </p>
                    </div>

                    <div class="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                        <a href="ppdb.php?jurusan=<?= urlencode($m['code']) ?>" class="text-xs font-bold text-[#0F4374] hover:underline flex items-center gap-1">
                            <span>Pilih di PPDB</span> →
                        </a>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- WARTA BERITA & PRESTASI -->
    <section id="berita" class="py-16 bg-white border-b border-slate-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <span class="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-[#0F4374]">
                        Kabar Sekolah
                    </span>
                    <h2 class="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                        Warta & Pengumuman Terbaru
                    </h2>
                </div>
                <span class="text-xs font-semibold text-slate-500">
                    Data langsung dari tabel MySQL <code>news</code>
                </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <?php foreach ($newsList as $item): ?>
                <article class="bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                        <div class="h-44 bg-slate-200 overflow-hidden relative">
                            <img src="<?= htmlspecialchars($item['image']) ?>" alt="<?= htmlspecialchars($item['title']) ?>" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=80'">
                            <span class="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-[10px] font-bold text-slate-900 shadow-sm">
                                <?= htmlspecialchars($item['category']) ?>
                            </span>
                        </div>
                        <div class="p-5 space-y-2">
                            <div class="flex items-center justify-between text-[11px] text-slate-500">
                                <span>📅 <?= htmlspecialchars($item['date_text']) ?></span>
                                <span>✍️ <?= htmlspecialchars($item['author']) ?></span>
                            </div>
                            <h3 class="text-base font-extrabold text-slate-900 leading-snug line-clamp-2">
                                <?= htmlspecialchars($item['title']) ?>
                            </h3>
                            <p class="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                                <?= htmlspecialchars($item['summary']) ?>
                            </p>
                        </div>
                    </div>
                    <div class="p-5 pt-0">
                        <a href="berita.php?id=<?= urlencode($item['id']) ?>" class="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F4374] hover:text-blue-700">
                            <span>Baca Selengkapnya</span> →
                        </a>
                    </div>
                </article>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- SECTION BURSA KERJA KHUSUS (BKK) -->
    <section id="bkk" class="py-14 bg-slate-50 border-b border-slate-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        Peluang Karir Lulusan
                    </span>
                    <h2 class="text-2xl font-black text-slate-900 mt-2">
                        Bursa Kerja Khusus (BKK) Mitra Industri
                    </h2>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <?php foreach ($jobPostings as $job): ?>
                <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                    <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <?= htmlspecialchars($job['job_type'] ?? 'Penuh Waktu') ?>
                    </span>
                    <h3 class="text-sm font-bold text-slate-900"><?= htmlspecialchars($job['title']) ?></h3>
                    <p class="text-xs font-semibold text-slate-500">🏢 <?= htmlspecialchars($job['company_name']) ?> • <?= htmlspecialchars($job['location'] ?? 'Jawa Tengah') ?></p>
                    <p class="text-xs text-slate-600 line-clamp-2"><?= htmlspecialchars($job['description'] ?? '') ?></p>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- FOOTER LENGKAP -->
    <footer id="kontak" class="bg-[#0A2E50] text-blue-100 pt-12 pb-8 border-t border-blue-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-blue-900/60 text-xs">
            <div class="space-y-3 md:col-span-2">
                <div class="flex items-center gap-3">
                    <?php if (!empty($identity['logo'])): ?>
                        <img src="<?= htmlspecialchars($identity['logo']) ?>" alt="Logo" class="w-10 h-10 object-contain rounded-lg bg-white p-1" onerror="this.src='logo-emblem.svg'">
                    <?php endif; ?>
                    <span class="font-extrabold text-base text-white"><?= htmlspecialchars($identity['name']) ?></span>
                </div>
                <p class="text-blue-200 leading-relaxed max-w-md">
                    <?= htmlspecialchars($identity['tagline'] ?? '') ?>. Terakreditasi <?= htmlspecialchars($identity['accreditation'] ?? 'A') ?> dengan fasilitas praktek standar industri.
                </p>
                <div class="text-[11px] text-blue-300">
                    📍 <?= htmlspecialchars($identity['address']) ?><br>
                    📞 Telp: <?= htmlspecialchars($identity['phone'] ?? '') ?> • ✉️ Email: <?= htmlspecialchars($identity['email'] ?? '') ?>
                </div>
            </div>

            <div class="space-y-2">
                <h4 class="text-sm font-bold text-white uppercase tracking-wider">Tautan Pintas</h4>
                <ul class="space-y-1.5 text-blue-200">
                    <li><a href="index.php" class="hover:text-amber-400">Beranda</a></li>
                    <li><a href="#jurusan" class="hover:text-amber-400">Program Keahlian</a></li>
                    <li><a href="#berita" class="hover:text-amber-400">Warta Sekolah</a></li>
                    <li><a href="ppdb.php" class="hover:text-amber-400">PPDB Online</a></li>
                    <li><a href="admin.php" class="hover:text-amber-400">Login CMS Admin</a></li>
                </ul>
            </div>

            <div class="space-y-2">
                <h4 class="text-sm font-bold text-white uppercase tracking-wider">Basis Data XAMPP</h4>
                <div class="p-3 rounded-xl bg-blue-950/80 border border-blue-800 text-[11px] space-y-1 text-blue-300">
                    <div>Engine: <strong>MySQL / MariaDB</strong></div>
                    <div>Database: <code>smk_yapek_db</code></div>
                    <div>Koneksi: <strong>PHP PDO Native (Tanpa API)</strong></div>
                    <div class="text-emerald-400">● Status: Terkoneksi Aktif</div>
                </div>
            </div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-blue-300 gap-2">
            <div>
                &copy; <?= date('Y') ?> <?= htmlspecialchars($identity['name']) ?>. Hak Cipta Dilindungi.
            </div>
            <div>
                Sistem Informasi & Portal Sekolah Terpadu (Native PHP + MySQL)
            </div>
        </div>
    </footer>

</body>
</html>
