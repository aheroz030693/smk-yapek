<?php
/**
 * DETAIL WARTA & BERITA (PHP NATIVE + MYSQL)
 * SMK YAPEK GOMBONG
 * 100% Tanpa API
 */

require_once __DIR__ . '/koneksi.php';

$news_id = $_GET['id'] ?? '';

// Ambil artikel dari MySQL
$stmt = $pdo->prepare("SELECT * FROM news WHERE id = ? LIMIT 1");
$stmt->execute([$news_id]);
$article = $stmt->fetch();

// Jika artikel tidak ditemukan, ambil artikel pertama
if (!$article) {
    $stmt = $pdo->query("SELECT * FROM news ORDER BY created_at DESC LIMIT 1");
    $article = $stmt->fetch();
}

// Tambah view counter langsung di MySQL
if ($article) {
    $stmt = $pdo->prepare("UPDATE news SET views = views + 1 WHERE id = ?");
    $stmt->execute([$article['id']]);
}

// Ambil lampiran dokumen
$attachments = [];
if ($article) {
    $stmt = $pdo->prepare("SELECT * FROM news_attachments WHERE news_id = ?");
    $stmt->execute([$article['id']]);
    $attachments = $stmt->fetchAll();
}

// Ambil 3 artikel terkait
$related = [];
if ($article) {
    $stmt = $pdo->prepare("SELECT id, title, image, date_text FROM news WHERE id != ? AND category = ? LIMIT 3");
    $stmt->execute([$article['id'], $article['category']]);
    $related = $stmt->fetchAll();
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($article['title'] ?? 'Berita') ?> - SMK YAPEK Gombong</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>body { font-family: 'Plus Jakarta Sans', sans-serif; }</style>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen">

    <header class="bg-[#0F4374] text-white py-4 px-4 shadow-md sticky top-0 z-30">
        <div class="max-w-4xl mx-auto flex items-center justify-between">
            <a href="index.php" class="flex items-center gap-2 font-bold text-sm">
                <span>← Kembali ke Beranda</span>
            </a>
            <span class="text-xs text-blue-200">SMK YAPEK Gombong Warta</span>
        </div>
    </header>

    <main class="max-w-4xl mx-auto p-4 sm:p-6 my-6">
        <?php if ($article): ?>
        <article class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm p-6 sm:p-8 space-y-6">
            <div class="space-y-3">
                <div class="flex items-center gap-2">
                    <span class="px-3 py-1 rounded-full bg-blue-100 text-[#0F4374] text-xs font-bold">
                        <?= htmlspecialchars($article['category']) ?>
                    </span>
                    <span class="text-xs text-slate-500">
                        📅 <?= htmlspecialchars($article['date_text']) ?>
                    </span>
                    <span class="text-xs text-slate-500">
                        ✍️ <?= htmlspecialchars($article['author']) ?>
                    </span>
                </div>
                <h1 class="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
                    <?= htmlspecialchars($article['title']) ?>
                </h1>
            </div>

            <!-- Gambar Utama -->
            <div class="rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 max-h-[450px]">
                <img src="<?= htmlspecialchars($article['image']) ?>" alt="<?= htmlspecialchars($article['title']) ?>" class="w-full h-full object-cover">
            </div>

            <!-- Isi Berita -->
            <div class="text-sm sm:text-base text-slate-700 leading-relaxed space-y-4 pt-2 border-t border-slate-100">
                <p class="font-semibold text-slate-900 text-lg leading-relaxed">
                    <?= nl2br(htmlspecialchars($article['summary'])) ?>
                </p>
                <div class="text-slate-700 leading-loose">
                    <?= nl2br(htmlspecialchars($article['content'])) ?>
                </div>
            </div>

            <!-- Lampiran Berita Jika Ada -->
            <?php if (!empty($attachments)): ?>
            <div class="pt-6 border-t border-slate-100 space-y-3">
                <h3 class="text-sm font-bold text-slate-900">📎 Dokumen Lampiran Resmi:</h3>
                <div class="space-y-2">
                    <?php foreach ($attachments as $att): ?>
                    <a href="<?= htmlspecialchars($att['url']) ?>" download class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-blue-50 text-xs font-semibold text-slate-800">
                        <span>📄 <?= htmlspecialchars($att['name']) ?></span>
                        <span class="text-[#0F4374] font-bold">Unduh File</span>
                    </a>
                    <?php endforeach; ?>
                </div>
            </div>
            <?php endif; ?>
        </article>
        <?php else: ?>
            <div class="p-8 text-center bg-white rounded-3xl border border-slate-200">
                <p>Artikel tidak ditemukan.</p>
                <a href="index.php" class="text-blue-600 underline font-bold mt-2 inline-block">Kembali</a>
            </div>
        <?php endif; ?>
    </main>

</body>
</html>
