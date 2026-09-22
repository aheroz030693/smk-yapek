<?php
/**
 * Konfigurasi Koneksi Database MySQL / XAMPP
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
    if (!headers_sent()) {
        header('Content-Type: text/html; charset=utf-8');
        http_response_code(500);
    }
    echo '<!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <title>Koneksi MySQL Gagal - SMK YAPEK Gombong</title>
        <style>
            body { font-family: sans-serif; background: #f8fafc; color: #1e293b; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
            .card { background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px; max-width: 540px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
            h2 { color: #dc2626; margin-top: 0; }
            code { background: #f1f5f9; padding: 3px 8px; border-radius: 6px; font-weight: bold; }
            .btn { display: inline-block; background: #0f4374; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 16px; }
        </style>
    </head>
    <body>
        <div class="card">
            <h2>⚠️ Gagal Terhubung ke Database MySQL XAMPP</h2>
            <p><strong>Pesan Sistem:</strong> ' . htmlspecialchars($e->getMessage()) . '</p>
            <hr style="border:0;border-top:1px solid #e2e8f0;margin:16px 0;">
            <h3>Langkah Perbaikan di XAMPP:</h3>
            <ol>
                <li>Buka <strong>XAMPP Control Panel</strong> lalu klik <strong>Start</strong> pada baris <strong>MySQL</strong>.</li>
                <li>Buka browser ke <code>http://localhost/phpmyadmin</code>.</li>
                <li>Buat database baru bernama <code>smk_yapek_db</code>.</li>
                <li>Import berkas <code>database_mysql_xampp.sql</code> ke dalam database tersebut.</li>
            </ol>
            <a href="javascript:location.reload()" class="btn">🔄 Muat Ulang Halaman</a>
        </div>
    </body>
    </html>';
    exit;
}
