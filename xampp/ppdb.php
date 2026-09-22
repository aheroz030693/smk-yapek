<?php
/**
 * FORM PENDAFTARAN PPDB ONLINE (PHP NATIVE + MYSQL)
 * SMK YAPEK GOMBONG
 * 100% Tanpa API - Menggunakan Form POST & PDO Prepared Statements Langsung
 */

require_once __DIR__ . '/koneksi.php';

$success_message = '';
$error_message = '';
$new_applicant_id = '';

// Ambil data sekolah
$stmt = $pdo->prepare("SELECT name, short_name, logo, phone, email FROM school_identity WHERE id = ? LIMIT 1");
$stmt->execute(['yapek-main']);
$school = $stmt->fetch();

// Ambil daftar jurusan dari MySQL
$stmt = $pdo->query("SELECT code, name FROM majors ORDER BY code ASC");
$majors = $stmt->fetchAll();

// PROSES FORM SUBMISSION LANGSUNG (TANPA API)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nisn = trim($_POST['nisn'] ?? '');
    $full_name = trim($_POST['full_name'] ?? '');
    $gender = $_POST['gender'] ?? 'Laki-laki';
    $birth_place = trim($_POST['birth_place'] ?? '');
    $birth_date = !empty($_POST['birth_date']) ? $_POST['birth_date'] : null;
    $origin_school = trim($_POST['origin_school'] ?? '');
    $parent_name = trim($_POST['parent_name'] ?? '');
    $parent_phone = trim($_POST['parent_phone'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $address = trim($_POST['address'] ?? '');
    $first_major = $_POST['first_major'] ?? 'TKJ';
    $second_major = $_POST['second_major'] ?? '';
    $track = $_POST['track'] ?? 'Reguler';
    $avg_report_score = !empty($_POST['avg_report_score']) ? floatval($_POST['avg_report_score']) : 80.00;

    if (empty($nisn) || empty($full_name)) {
        $error_message = 'NISN dan Nama Lengkap wajib diisi!';
    } else {
        try {
            // Cek apakah NISN sudah pernah mendaftar
            $stmt = $pdo->prepare("SELECT id FROM ppdb_applicants WHERE nisn = ? LIMIT 1");
            $stmt->execute([$nisn]);
            $existing = $stmt->fetch();

            if ($existing) {
                $error_message = "NISN {$nisn} sudah terdaftar dengan ID: {$existing['id']}. Silakan hubungi panitia PPDB jika ada kesalahan data.";
            } else {
                $new_applicant_id = 'PPDB-' . date('Ymd') . '-' . rand(1000, 9999);
                $registered_at = date('d F Y');

                $insert_sql = "INSERT INTO ppdb_applicants (
                    id, nisn, full_name, gender, birth_place, birth_date,
                    origin_school, parent_name, parent_phone, email,
                    address, first_major, second_major, track,
                    avg_report_score, status, registered_at
                ) VALUES (
                    ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?,
                    ?, ?, ?, ?,
                    ?, 'Menunggu Verifikasi', ?
                )";

                $stmt = $pdo->prepare($insert_sql);
                $stmt->execute([
                    $new_applicant_id,
                    $nisn,
                    $full_name,
                    $gender,
                    $birth_place,
                    $birth_date,
                    $origin_school,
                    $parent_name,
                    $parent_phone,
                    $email,
                    $address,
                    $first_major,
                    $second_major,
                    $track,
                    $avg_report_score,
                    $registered_at
                ]);

                $success_message = "Alhamdulillah! Pendaftaran pendaftar baru atas nama <strong>" . htmlspecialchars($full_name) . "</strong> berhasil disimpan ke database MySQL!";
            }
        } catch (PDOException $e) {
            $error_message = "Gagal menyimpan pendaftaran ke MySQL: " . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pendaftaran PPDB Online - <?= htmlspecialchars($school['name'] ?? 'SMK YAPEK Gombong') ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>body { font-family: 'Plus Jakarta Sans', sans-serif; }</style>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen">

    <!-- TOP HEADER -->
    <header class="bg-[#0F4374] text-white py-4 px-4 shadow-md">
        <div class="max-w-4xl mx-auto flex items-center justify-between">
            <a href="index.php" class="flex items-center gap-3">
                <span class="text-xl">←</span>
                <div>
                    <h1 class="font-extrabold text-base sm:text-lg"><?= htmlspecialchars($school['name'] ?? 'SMK YAPEK Gombong') ?></h1>
                    <p class="text-xs text-blue-200">Formulir PPDB Online 2026/2027 (Native MySQL)</p>
                </div>
            </a>
            <a href="index.php" class="text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg border border-white/20 transition-all">
                Kembali ke Beranda
            </a>
        </div>
    </header>

    <main class="max-w-3xl mx-auto p-4 sm:p-6 my-6">

        <!-- NOTIFIKASI SUKSES / GAGAL -->
        <?php if (!empty($success_message)): ?>
            <div class="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 mb-6 shadow-sm space-y-3">
                <div class="flex items-center gap-3">
                    <span class="text-2xl">🎉</span>
                    <h2 class="text-lg font-black text-emerald-900">Pendaftaran Berhasil Terverifikasi!</h2>
                </div>
                <p class="text-sm leading-relaxed"><?= $success_message ?></p>
                <div class="p-4 rounded-2xl bg-white border border-emerald-200 text-xs font-mono space-y-1">
                    <div>No. Registrasi: <strong><?= htmlspecialchars($new_applicant_id) ?></strong></div>
                    <div>Status: <span class="text-emerald-700 font-bold">Menunggu Verifikasi Panitia</span></div>
                </div>
                <div class="flex gap-3 pt-2">
                    <a href="index.php" class="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs">
                        Ke Halaman Depan
                    </a>
                    <a href="ppdb.php" class="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs">
                        Daftar Calon Siswa Baru Lainnya
                    </a>
                </div>
            </div>
        <?php endif; ?>

        <?php if (!empty($error_message)): ?>
            <div class="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 mb-6 text-xs font-semibold">
                ⚠️ <?= htmlspecialchars($error_message) ?>
            </div>
        <?php endif; ?>

        <!-- FORMULIR PPDB -->
        <div class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div class="border-b border-slate-100 pb-4">
                <span class="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                    Tahun Ajaran 2026/2027
                </span>
                <h2 class="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                    Formulir Registrasi Calon Peserta Didik Baru
                </h2>
                <p class="text-xs text-slate-500 mt-1">
                    Data Anda akan langsung tersimpan ke database MySQL lokal (Tabel: <code>ppdb_applicants</code>).
                </p>
            </div>

            <!-- Native HTML Form with POST -->
            <form action="ppdb.php" method="POST" class="space-y-5 text-xs">
                
                <!-- DATA PRIBADI -->
                <div class="space-y-4">
                    <h3 class="text-sm font-extrabold text-[#0F4374] uppercase tracking-wider">
                        1. Identitas Calon Siswa
                    </h3>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-bold text-slate-700 mb-1">Nomor Induk Siswa Nasional (NISN) *</label>
                            <input type="text" name="nisn" required maxlength="20" placeholder="Contoh: 0071234567" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0F4374] focus:outline-none font-mono">
                        </div>
                        <div>
                            <label class="block font-bold text-slate-700 mb-1">Nama Lengkap (Sesuai Ijazah SMP) *</label>
                            <input type="text" name="full_name" required placeholder="Contoh: Muhammad Rizki Pratama" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0F4374] focus:outline-none">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label class="block font-bold text-slate-700 mb-1">Jenis Kelamin</label>
                            <select name="gender" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0F4374] focus:outline-none bg-white">
                                <option value="Laki-laki">Laki-laki</option>
                                <option value="Perempuan">Perempuan</option>
                            </select>
                        </div>
                        <div>
                            <label class="block font-bold text-slate-700 mb-1">Tempat Lahir</label>
                            <input type="text" name="birth_place" placeholder="Kebumen" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0F4374] focus:outline-none">
                        </div>
                        <div>
                            <label class="block font-bold text-slate-700 mb-1">Tanggal Lahir</label>
                            <input type="date" name="birth_date" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0F4374] focus:outline-none bg-white">
                        </div>
                    </div>

                    <div>
                        <label class="block font-bold text-slate-700 mb-1">Asal Sekolah (SMP / MTs)</label>
                        <input type="text" name="origin_school" placeholder="Contoh: SMP Negeri 1 Gombong" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0F4374] focus:outline-none">
                    </div>
                </div>

                <!-- PILIHAN JURUSAN -->
                <div class="space-y-4 pt-4 border-t border-slate-100">
                    <h3 class="text-sm font-extrabold text-[#0F4374] uppercase tracking-wider">
                        2. Program Keahlian Yang Diminati
                    </h3>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-bold text-slate-700 mb-1">Pilihan Jurusan 1 (Utama) *</label>
                            <select name="first_major" required class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0F4374] focus:outline-none bg-white font-bold">
                                <?php foreach ($majors as $m): ?>
                                    <option value="<?= htmlspecialchars($m['code']) ?>">
                                        <?= htmlspecialchars($m['code']) ?> - <?= htmlspecialchars($m['name']) ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>

                        <div>
                            <label class="block font-bold text-slate-700 mb-1">Pilihan Jurusan 2 (Cadangan)</label>
                            <select name="second_major" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0F4374] focus:outline-none bg-white">
                                <option value="">-- Pilih Jurusan Cadangan --</option>
                                <?php foreach ($majors as $m): ?>
                                    <option value="<?= htmlspecialchars($m['code']) ?>">
                                        <?= htmlspecialchars($m['code']) ?> - <?= htmlspecialchars($m['name']) ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-bold text-slate-700 mb-1">Jalur Pendaftaran</label>
                            <select name="track" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0F4374] focus:outline-none bg-white">
                                <option value="Reguler">Reguler</option>
                                <option value="Prestasi">Prestasi Akademik / Non-Akademik</option>
                                <option value="Afirmasi / KIP">Afirmasi / KIP</option>
                            </select>
                        </div>
                        <div>
                            <label class="block font-bold text-slate-700 mb-1">Rata-rata Nilai Rapor SMP</label>
                            <input type="number" step="0.1" min="0" max="100" name="avg_report_score" placeholder="85.5" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0F4374] focus:outline-none font-mono">
                        </div>
                    </div>
                </div>

                <!-- DATA ORANG TUA & KONTAK -->
                <div class="space-y-4 pt-4 border-t border-slate-100">
                    <h3 class="text-sm font-extrabold text-[#0F4374] uppercase tracking-wider">
                        3. Data Orang Tua / Wali & Kontak
                    </h3>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-bold text-slate-700 mb-1">Nama Orang Tua / Wali *</label>
                            <input type="text" name="parent_name" required placeholder="Nama Ayah / Ibu / Wali" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0F4374] focus:outline-none">
                        </div>
                        <div>
                            <label class="block font-bold text-slate-700 mb-1">No. WhatsApp / HP Orang Tua *</label>
                            <input type="tel" name="parent_phone" required placeholder="081234567890" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0F4374] focus:outline-none font-mono">
                        </div>
                    </div>

                    <div>
                        <label class="block font-bold text-slate-700 mb-1">Alamat Tempat Tinggal Lengkap</label>
                        <textarea name="address" rows="3" placeholder="Nama Jalan, RT/RW, Desa/Kelurahan, Kecamatan, Kabupaten..." class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0F4374] focus:outline-none"></textarea>
                    </div>
                </div>

                <!-- SUBMIT BUTTON -->
                <div class="pt-4">
                    <button type="submit" class="w-full py-3.5 rounded-2xl bg-[#0F4374] hover:bg-blue-900 text-white font-black text-sm shadow-xl transition-all">
                        Kirim Formulir Pendaftaran PPDB ke Database MySQL
                    </button>
                    <p class="text-[11px] text-slate-400 text-center mt-2">
                        Data disimpan langsung dengan aman via PDO MySQL tanpa menggunakan perantara API eksternal.
                    </p>
                </div>
            </form>
        </div>
    </main>

</body>
</html>
