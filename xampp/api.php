<?php
/**
 * REST API Endpoint PHP untuk XAMPP
 * SMK YAPEK Gombong Portal
 * 
 * Penggunaan:
 * GET  http://localhost/smk-yapek/api.php?action=status
 * GET  http://localhost/smk-yapek/api.php?action=identity
 * GET  http://localhost/smk-yapek/api.php?action=majors
 * GET  http://localhost/smk-yapek/api.php?action=news
 * GET  http://localhost/smk-yapek/api.php?action=ppdb
 * POST http://localhost/smk-yapek/api.php?action=register_ppdb
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/koneksi.php';

$action = isset($_GET['action']) ? $_GET['action'] : 'status';

switch ($action) {
    case 'status':
        try {
            $stmt = $pdo->query("SELECT VERSION() as mysql_version, DATABASE() as db_name");
            $info = $stmt->fetch();
            echo json_encode([
                'status' => 'success',
                'connected' => true,
                'driver' => 'MySQL / MariaDB (XAMPP PDO)',
                'mysql_version' => $info['mysql_version'],
                'database' => $info['db_name'],
                'timestamp' => date('Y-m-d H:i:s')
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'identity':
        try {
            $stmt = $pdo->query("SELECT * FROM school_identity WHERE id = 'yapek-main' LIMIT 1");
            $identity = $stmt->fetch();
            if ($identity) {
                $identity['missions'] = json_decode($identity['missions_json'] ?? '[]', true);
                $identity['stats'] = json_decode($identity['stats_json'] ?? '{}', true);
            }
            echo json_encode(['status' => 'success', 'data' => $identity]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'majors':
        try {
            $stmt = $pdo->query("SELECT * FROM majors ORDER BY code ASC");
            $majors = $stmt->fetchAll();
            foreach ($majors as &$m) {
                $m['competencies'] = json_decode($m['competencies_json'] ?? '[]', true);
                $m['careerOpportunities'] = json_decode($m['career_opportunities_json'] ?? '[]', true);
                $m['facilities'] = json_decode($m['facilities_json'] ?? '[]', true);
                $m['industryPartners'] = json_decode($m['industry_partners_json'] ?? '[]', true);
            }
            echo json_encode(['status' => 'success', 'data' => $majors]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'news':
        try {
            $stmt = $pdo->query("SELECT * FROM news WHERE status = 'published' ORDER BY created_at DESC");
            $news = $stmt->fetchAll();
            echo json_encode(['status' => 'success', 'data' => $news]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'ppdb':
        try {
            $stmt = $pdo->query("SELECT * FROM ppdb_applicants ORDER BY created_at DESC");
            $applicants = $stmt->fetchAll();
            echo json_encode(['status' => 'success', 'data' => $applicants]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'register_ppdb':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['status' => 'error', 'message' => 'Hanya menerima request POST']);
            exit;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || empty($input['fullName']) || empty($input['nisn'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Nama lengkap dan NISN wajib diisi']);
            exit;
        }

        try {
            $id = 'ppdb-' . time();
            $stmt = $pdo->prepare("INSERT INTO ppdb_applicants 
                (id, nisn, full_name, gender, birth_place, origin_school, parent_name, parent_phone, email, address, first_major, second_major, track, avg_report_score, status, registered_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Menunggu Verifikasi', ?)");

            $registered_at = date('d F Y');
            $stmt->execute([
                $id,
                $input['nisn'],
                $input['fullName'],
                $input['gender'] ?? 'Laki-laki',
                $input['birthPlace'] ?? '',
                $input['originSchool'] ?? '',
                $input['parentName'] ?? '',
                $input['parentPhone'] ?? '',
                $input['email'] ?? '',
                $input['address'] ?? '',
                $input['firstMajor'] ?? 'TKJ',
                $input['secondMajor'] ?? '',
                $input['track'] ?? 'Reguler',
                $input['avgReportScore'] ?? 0,
                $registered_at
            ]);

            echo json_encode([
                'status' => 'success',
                'message' => 'Pendaftaran PPDB berhasil disimpan ke database MySQL XAMPP',
                'applicant_id' => $id
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Gagal mendaftar: ' . $e->getMessage()]);
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Action API tidak dikenali']);
        break;
}
