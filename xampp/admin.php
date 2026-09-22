<?php
/**
 * CMS ADMIN PANEL SMK YAPEK GOMBONG (PHP NATIVE + MYSQL)
 * 100% Tanpa API - Mengelola Database Langsung dengan Query SQL Native
 */

require_once __DIR__ . '/koneksi.php';

$message = '';
$message_type = 'success';

// PROSES TAMBAH BERITA BARU LANGSUNG (TANPA API)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'add_news') {
    $title = trim($_POST['title'] ?? '');
    $category = $_POST['category'] ?? 'Kegiatan Sekolah';
    $image = trim($_POST['image'] ?? '');
    $summary = trim($_POST['summary'] ?? '');
    $content = trim($_POST['content'] ?? '');
    $author = trim($_POST['author'] ?? 'Admin SMK YAPEK');

    if (empty($title) || empty($content)) {
        $message = 'Judul dan isi berita wajib diisi!';
        $message_type = 'danger';
    } else {
        try {
            $news_id = 'news-' . time();
            $date_text = date('d M Y');
            if (empty($image)) {
                $image = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80';
            }

            $stmt = $pdo->prepare("INSERT INTO news (id, title, category, date_text, image, summary, content, author, views, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 'published')");
            $stmt->execute([$news_id, $title, $category, $date_text, $image, $summary, $content, $author]);

            $message = 'Berita baru berhasil disimpan langsung ke tabel `news` di MySQL!';
            $message_type = 'success';
        } catch (PDOException $e) {
            $message = 'Gagal menyimpan berita: ' . $e->getMessage();
            $message_type = 'danger';
        }
    }
}

// PROSES HAPUS PENDAFTAR PPDB (JIKA DIPERLUKAN)
if (isset($_GET['delete_ppdb'])) {
    $del_id = $_GET['delete_ppdb'];
    try {
        $stmt = $pdo->prepare("DELETE FROM ppdb_applicants WHERE id = ?");
        $stmt->execute([$del_id]);
        $message = 'Data pendaftar berhasil dihapus dari database.';
    } catch (PDOException $e) {
        $message = 'Gagal menghapus: ' . $e->getMessage();
        $message_type = 'danger';
    }
}

// Ambil data statistik dari MySQL
$count_ppdb = $pdo->query("SELECT COUNT(*) FROM ppdb_applicants")->fetchColumn();
$count_news = $pdo->query("SELECT COUNT(*) FROM news")->fetchColumn();
$count_majors = $pdo->query("SELECT COUNT(*) FROM majors")->fetchColumn();

// Ambil data pendaftar PPDB terbaru
$applicants = $pdo->query("SELECT * FROM ppdb_applicants ORDER BY created_at DESC LIMIT 20")->fetchAll();

// Ambil daftar berita
$news_items = $pdo->query("SELECT id, title, category, date_text, views FROM news ORDER BY created_at DESC LIMIT 10")->fetchAll();

// Ambil identitas sekolah
$identity = $pdo->query("SELECT * FROM school_identity WHERE id = 'yapek-main'")->fetch();
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CMS Admin (PHP Native & MySQL) - SMK YAPEK Gombong</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>body { font-family: 'Plus Jakarta Sans', sans-serif; }</style>
</head>
<body class="bg-slate-100 text-slate-900 min-h-screen">

    <!-- HEADER ADMIN -->
    <header class="bg-[#0A2E50] text-white py-4 px-6 shadow-md">
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div class="flex items-center gap-3">
                <span class="p-2 rounded-xl bg-amber-400 text-slate-950 font-black text-sm">ADMIN</span>
                <div>
                    <h1 class="font-extrabold text-base">Panel Kontrol CMS (PHP Native + MySQL)</h1>
                    <p class="text-xs text-blue-200">Terhubung langsung ke database <strong>smk_yapek_db</strong> (Tanpa API)</p>
                </div>
            </div>
            <div class="flex items-center gap-3 text-xs">
                <a href="index.php" class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 font-bold transition-all">
                    🌐 Buka Portal Publik
                </a>
            </div>
        </div>
    </header>

    <main class="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">

        <!-- NOTIFIKASI PESAN -->
        <?php if (!empty($message)): ?>
            <div class="p-4 rounded-2xl text-xs font-bold <?= $message_type === 'success' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-rose-100 text-rose-900 border border-rose-300' ?>">
                <?= htmlspecialchars($message) ?>
            </div>
        <?php endif; ?>

        <!-- KARTU STATISTIK DATABASE -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
                <span class="text-xs font-bold text-slate-400 uppercase">Pendaftar PPDB Online</span>
                <div class="text-3xl font-black text-[#0F4374]"><?= $count_ppdb ?> Siswa</div>
                <p class="text-[11px] text-slate-500">Tabel: <code>ppdb_applicants</code></p>
            </div>
            <div class="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
                <span class="text-xs font-bold text-slate-400 uppercase">Total Artikel Berita</span>
                <div class="text-3xl font-black text-amber-600"><?= $count_news ?> Warta</div>
                <p class="text-[11px] text-slate-500">Tabel: <code>news</code></p>
            </div>
            <div class="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
                <span class="text-xs font-bold text-slate-400 uppercase">Program Keahlian</span>
                <div class="text-3xl font-black text-emerald-600"><?= $count_majors ?> Jurusan</div>
                <p class="text-[11px] text-slate-500">Tabel: <code>majors</code></p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

            <!-- FORM TAMBAH BERITA LANGSUNG KE MYSQL -->
            <div class="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div class="border-b border-slate-100 pb-3">
                    <h2 class="text-base font-black text-slate-900">✍️ Terbitkan Berita Baru</h2>
                    <p class="text-xs text-slate-500">Langsung tersimpan via SQL <code>INSERT INTO news</code></p>
                </div>

                <form action="admin.php" method="POST" class="space-y-3 text-xs">
                    <input type="hidden" name="action" value="add_news">

                    <div>
                        <label class="block font-bold text-slate-700 mb-1">Judul Warta / Kegiatan *</label>
                        <input type="text" name="title" required placeholder="Contoh: Siswa SMK YAPEK Raih Juara LKS..." class="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600">
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block font-bold text-slate-700 mb-1">Kategori</label>
                            <select name="category" class="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none bg-white">
                                <option value="Kegiatan Sekolah">Kegiatan Sekolah</option>
                                <option value="Prestasi Siswa">Prestasi Siswa</option>
                                <option value="Pengumuman">Pengumuman</option>
                                <option value="Info BKK">Info BKK</option>
                            </select>
                        </div>
                        <div>
                            <label class="block font-bold text-slate-700 mb-1">Penulis</label>
                            <input type="text" name="author" value="Humas SMK YAPEK" class="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none">
                        </div>
                    </div>

                    <div>
                        <label class="block font-bold text-slate-700 mb-1">URL Foto Dokumentasi</label>
                        <input type="url" name="image" placeholder="https://images.unsplash.com/..." class="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none">
                    </div>

                    <div>
                        <label class="block font-bold text-slate-700 mb-1">Ringkasan Berita</label>
                        <textarea name="summary" rows="2" placeholder="Ringkasan singkat yang muncul di halaman depan..." class="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none"></textarea>
                    </div>

                    <div>
                        <label class="block font-bold text-slate-700 mb-1">Isi Lengkap Berita *</label>
                        <textarea name="content" required rows="5" placeholder="Tulis rincian berita selengkapnya..." class="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none"></textarea>
                    </div>

                    <button type="submit" class="w-full py-3 rounded-xl bg-[#0F4374] hover:bg-blue-900 text-white font-bold text-xs transition-all shadow-sm">
                        Simpan & Publikasikan ke MySQL
                    </button>
                </form>
            </div>

            <!-- TABEL PENDAFTAR PPDB ONLINE DARI MYSQL -->
            <div class="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                        <h2 class="text-base font-black text-slate-900">📋 Data Pendaftar PPDB Online</h2>
                        <p class="text-xs text-slate-500">Query langsung dari tabel <code>ppdb_applicants</code></p>
                    </div>
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                        <?= count($applicants) ?> Data Terkini
                    </span>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr class="border-b border-slate-200 text-[11px] text-slate-400 font-bold uppercase">
                                <th class="pb-2">NISN</th>
                                <th class="pb-2">Nama Calon Siswa</th>
                                <th class="pb-2">Jurusan</th>
                                <th class="pb-2">Asal Sekolah</th>
                                <th class="pb-2">Status</th>
                                <th class="pb-2 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <?php if (empty($applicants)): ?>
                                <tr>
                                    <td colspan="6" class="py-4 text-center text-slate-400 italic">Belum ada calon siswa yang mendaftar.</td>
                                </tr>
                            <?php else: ?>
                                <?php foreach ($applicants as $app): ?>
                                <tr class="hover:bg-slate-50">
                                    <td class="py-2.5 font-mono text-slate-600"><?= htmlspecialchars($app['nisn']) ?></td>
                                    <td class="py-2.5 font-bold text-slate-900"><?= htmlspecialchars($app['full_name']) ?></td>
                                    <td class="py-2.5">
                                        <span class="px-2 py-0.5 rounded font-bold text-[10px] bg-blue-50 text-blue-800 border border-blue-200">
                                            <?= htmlspecialchars($app['first_major']) ?>
                                        </span>
                                    </td>
                                    <td class="py-2.5 text-slate-600"><?= htmlspecialchars($app['origin_school'] ?? '-') ?></td>
                                    <td class="py-2.5">
                                        <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                            <?= htmlspecialchars($app['status']) ?>
                                        </span>
                                    </td>
                                    <td class="py-2.5 text-right">
                                        <a href="admin.php?delete_ppdb=<?= urlencode($app['id']) ?>" onclick="return confirm('Hapus data pendaftar ini?')" class="text-rose-600 hover:text-rose-800 font-bold text-[11px]">
                                            Hapus
                                        </a>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>

    </main>

</body>
</html>
