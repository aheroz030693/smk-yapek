import React, { useState } from 'react';
import { 
  Database, 
  Download, 
  Copy, 
  Check, 
  Server, 
  KeyRound, 
  Table, 
  Layers, 
  Code2, 
  ExternalLink,
  Terminal,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FolderDown,
  FileCode,
  Zap,
  HelpCircle
} from 'lucide-react';
import { dbConfig, getConnectionStrings, DATABASE_TABLES_SCHEMA } from '../../db/config';
import { RAW_DATABASE_SQL } from '../../db/sqlData';
import { RAW_MYSQL_XAMPP_SQL, downloadMysqlXamppSqlFile, RAW_PHP_KONEKSI, RAW_PHP_PPDB, downloadFileContent } from '../../db/mysqlData';
import { downloadDatabaseSqlFile } from '../../db';
import { NewsItem, PPDBApplicant, AlumniTestimonial, ActivityGalleryItem } from '../../types';

interface AdminDatabaseSectionProps {
  newsList: NewsItem[];
  applicants: PPDBApplicant[];
  testimonials: AlumniTestimonial[];
  galleryItems: ActivityGalleryItem[];
  isDarkMode: boolean;
}

export const AdminDatabaseSection: React.FC<AdminDatabaseSectionProps> = ({
  newsList,
  applicants,
  testimonials,
  galleryItems,
  isDarkMode
}) => {
  // Database Driver Choice: 'mysql' (Default for XAMPP users) or 'postgresql'
  const [selectedDriver, setSelectedDriver] = useState<'mysql' | 'postgresql'>('mysql');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [activeSqlTab, setActiveSqlTab] = useState<'all' | 'news' | 'ppdb' | 'majors' | 'php_koneksi' | 'php_ppdb'>('all');
  const [searchTableQuery, setSearchTableQuery] = useState('');

  // Interactive MySQL / XAMPP Connection Tester state
  const [testHost, setTestHost] = useState('127.0.0.1');
  const [testPort, setTestPort] = useState('3306');
  const [testUser, setTestUser] = useState('root');
  const [testPassword, setTestPassword] = useState('');
  const [testDb, setTestDb] = useState('smk_yapek_db');
  const [isTestingConn, setIsTestingConn] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    hint?: string;
    version?: string;
    testedAt?: string;
  } | null>(null);

  const connectionStrings = getConnectionStrings();

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => {
      setCopiedType(null);
    }, 2500);
  };

  // Test live connection to MySQL / XAMPP
  const handleTestConnection = async () => {
    setIsTestingConn(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/db/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client: 'mysql',
          host: testHost.trim() || '127.0.0.1',
          port: parseInt(testPort, 10) || 3306,
          user: testUser.trim() || 'root',
          password: testPassword,
          database: testDb.trim() || 'smk_yapek_db'
        })
      });

      const data = await res.json();
      setTestResult({
        success: !!data.success,
        message: data.message || (data.success ? 'Koneksi MySQL / XAMPP Sukses!' : 'Gagal terhubung'),
        hint: data.hint,
        version: data.data?.[0]?.mysql_version,
        testedAt: new Date().toLocaleTimeString('id-ID')
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Tidak dapat memanggil backend API pengujian: ${err.message}`,
        hint: 'Pastikan dev server sedang berjalan (`npm run dev`) dan port 3000 aktif.',
        testedAt: new Date().toLocaleTimeString('id-ID')
      });
    } finally {
      setIsTestingConn(false);
    }
  };

  // Download standalone PHP connection file or any XAMPP native file
  const handleDownloadXamppFile = (filename: string) => {
    // Attempt download via API endpoint, with fallback to browser blob
    try {
      const link = document.createElement('a');
      link.href = `/api/db/export/xampp-file?file=${filename}`;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      if (filename === 'koneksi.php') {
        downloadFileContent(RAW_PHP_KONEKSI, 'koneksi.php', 'application/x-httpd-php;charset=utf-8;');
      } else if (filename === 'ppdb.php') {
        downloadFileContent(RAW_PHP_PPDB, 'ppdb.php', 'application/x-httpd-php;charset=utf-8;');
      } else if (filename === 'database_mysql_xampp.sql') {
        downloadMysqlXamppSqlFile();
      }
    }
  };

  const handleDownloadPhpKoneksi = () => {
    handleDownloadXamppFile('koneksi.php');
  };

  // Calculate live row count for key tables
  const totalAttachments = newsList.reduce((acc, item) => acc + (item.attachments?.length || 0), 0);
  const totalContentImages = newsList.reduce((acc, item) => acc + (item.contentImages?.length || 0), 0);

  const getRowCount = (tableName: string): number => {
    switch (tableName) {
      case 'school_identity': return 1;
      case 'headmaster_profile': return 1;
      case 'majors': return 6;
      case 'news': return newsList.length;
      case 'news_attachments': return totalAttachments;
      case 'news_content_images': return totalContentImages;
      case 'ppdb_applicants': return applicants.length;
      case 'job_postings': return 4;
      case 'alumni_testimonials': return testimonials.length;
      case 'activity_gallery': return galleryItems.length;
      case 'admin_users': return 3;
      case 'visitor_logs': return 7;
      default: return 0;
    }
  };

  // Filtered tables
  const filteredTables = DATABASE_TABLES_SCHEMA.filter(t => 
    t.name.toLowerCase().includes(searchTableQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTableQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTableQuery.toLowerCase())
  );

  // Active SQL content based on selected driver and tab
  const getSelectedSql = () => {
    if (selectedDriver === 'mysql') {
      if (activeSqlTab === 'news') {
        return `-- TABEL 4: news (Warta Berita, Pengumuman & Prestasi) - MYSQL / XAMPP
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;
      }

      if (activeSqlTab === 'ppdb') {
        return `-- TABEL 7: ppdb_applicants (Pendaftar PPDB Online Siswa Baru) - MYSQL / XAMPP
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;
      }

      if (activeSqlTab === 'php_koneksi') {
        return RAW_PHP_KONEKSI;
      }

      if (activeSqlTab === 'php_ppdb') {
        return RAW_PHP_PPDB;
      }

      if (activeSqlTab === 'majors') {
        return `-- TABEL 1 & 3: Identitas Sekolah & 6 Program Keahlian - MYSQL / XAMPP
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
    \`email\` VARCHAR(100) DEFAULT NULL,
    \`website\` VARCHAR(150) DEFAULT NULL,
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS \`majors\` (
    \`id\` VARCHAR(50) NOT NULL,
    \`code\` VARCHAR(20) NOT NULL,
    \`name\` VARCHAR(255) NOT NULL,
    \`english_name\` VARCHAR(255) DEFAULT NULL,
    \`tagline\` VARCHAR(255) DEFAULT NULL,
    \`icon_name\` VARCHAR(50) NOT NULL,
    \`color_hex\` VARCHAR(20) NOT NULL,
    \`short_desc\` TEXT DEFAULT NULL,
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (\`id\`),
    UNIQUE KEY \`idx_major_code\` (\`code\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;
      }

      return RAW_MYSQL_XAMPP_SQL;
    }

    // PostgreSQL branch
    if (activeSqlTab === 'news') {
      return `-- SKEMA TABEL BERITA (POSTGRESQL)
CREATE TABLE IF NOT EXISTS news (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    date_text VARCHAR(50) NOT NULL,
    image TEXT NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(150) NOT NULL,
    views INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'published',
    tags_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;
    }

    if (activeSqlTab === 'ppdb') {
      return `-- SKEMA TABEL PPDB ONLINE (POSTGRESQL)
CREATE TABLE IF NOT EXISTS ppdb_applicants (
    id VARCHAR(50) PRIMARY KEY,
    nisn VARCHAR(20) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    origin_school VARCHAR(255),
    first_major VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'Menunggu Verifikasi',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;
    }

    return RAW_DATABASE_SQL;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Database Driver Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-[#0F4374] via-[#15538e] to-[#0A2E50] text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider flex items-center gap-1">
              <Database className="w-3 h-3" />
              <span>Pilihan Database Engine</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/40">
              {selectedDriver === 'mysql' ? 'MySQL / MariaDB (XAMPP / phpMyAdmin)' : 'PostgreSQL / Cloud SQL'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Database & Integrasi MySQL / XAMPP SMK YAPEK
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
            Pilih dan jalankan portal menggunakan database <strong>MySQL / XAMPP (phpMyAdmin)</strong> untuk instalasi lokal komputer sekolah, atau <strong>PostgreSQL</strong> untuk server cloud.
          </p>
        </div>

        {/* Engine Switcher & Quick Download Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 relative z-10 self-start md:self-auto">
          {/* Driver Toggle */}
          <div className="flex items-center p-1 rounded-2xl bg-black/30 border border-white/20 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setSelectedDriver('mysql')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                selectedDriver === 'mysql'
                  ? 'bg-amber-400 text-slate-950 shadow-md scale-100'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>MySQL / XAMPP</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedDriver('postgresql')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                selectedDriver === 'postgresql'
                  ? 'bg-amber-400 text-slate-950 shadow-md scale-100'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>PostgreSQL</span>
            </button>
          </div>

          {/* Download SQL Button */}
          {selectedDriver === 'mysql' ? (
            <button
              type="button"
              onClick={() => downloadMysqlXamppSqlFile()}
              className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
              title="Unduh file SQL khusus MySQL phpMyAdmin"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>Download SQL MySQL (.sql)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => downloadDatabaseSqlFile()}
              className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>Download SQL Postgres</span>
            </button>
          )}
        </div>
      </div>

      {/* SPECIAL SECTION: PANDUAN CEPAT MENJALANKAN DI MYSQL / XAMPP */}
      {selectedDriver === 'mysql' && (
        <div className="p-6 sm:p-7 rounded-3xl border-2 border-emerald-300/80 dark:border-emerald-500/40 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-200/80 dark:border-emerald-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shadow-inner">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Panduan Menjalankan di XAMPP / MySQL Lokal</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950">
                    Sangat Mudah
                  </span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Ikuti 5 langkah ringkas ini untuk mengaktifkan database di komputer sekolah atau laptop lokal Anda.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadPhpKoneksi}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-slate-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                title="Download file koneksi.php untuk folder htdocs XAMPP"
              >
                <FileCode className="w-3.5 h-3.5 text-emerald-600" />
                <span>Unduh koneksi.php</span>
              </button>

              <button
                type="button"
                onClick={() => downloadMysqlXamppSqlFile()}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <FolderDown className="w-3.5 h-3.5" />
                <span>Unduh database_mysql_xampp.sql</span>
              </button>
            </div>
          </div>

          {/* 5-Step Visual Workflow Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
            {/* Step 1 */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200/90 dark:border-emerald-800/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center">
                  1
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">XAMPP Control</span>
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Start Apache & MySQL
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                Buka aplikasi XAMPP Control Panel, lalu klik tombol <strong>Start</strong> pada modul <strong>Apache</strong> dan <strong>MySQL</strong>.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200/90 dark:border-emerald-800/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center">
                  2
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">phpMyAdmin</span>
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Buka phpMyAdmin
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                Buka browser web ke tautan: <br />
                <code className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">http://localhost/phpmyadmin</code>
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200/90 dark:border-emerald-800/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center">
                  3
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Database</span>
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Buat Database Baru
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                Klik menu <strong>New</strong>, ketik nama database: <br />
                <code className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">smk_yapek_db</code>, lalu klik Create.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200/90 dark:border-emerald-800/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center">
                  4
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Import Data</span>
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Import File SQL
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                Pilih database <code>smk_yapek_db</code>, klik tab <strong>Import</strong>, pilih file <strong>database_mysql_xampp.sql</strong>, dan klik <strong>Go</strong>.
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200/90 dark:border-emerald-800/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center">
                  5
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Selesai (Tanpa API)</span>
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Buka di Browser
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                Salin file ke <code>C:\xampp\htdocs\smk-yapek\</code>, lalu buka <code className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">http://localhost/smk-yapek/</code>.
              </p>
            </div>
          </div>

          {/* DEDICATED CARDS: PAKET BERKAS PHP NATIVE 100% TANPA API */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-[#0F4374] to-[#0A2E50] text-white shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 uppercase">
                    Pilihan: Tanpa Menggunakan API
                  </span>
                  <span className="text-xs text-blue-200">
                    Murni PHP Native + PDO SQL Langsung ke Database
                  </span>
                </div>
                <h4 className="text-base font-black">
                  Paket Web Portal Sekolah SMK YAPEK Siap Pakai di XAMPP htdocs
                </h4>
                <p className="text-xs text-blue-100 max-w-2xl leading-relaxed">
                  Semua berkas di bawah ini dirancang untuk dieksekusi langsung oleh server Apache PHP bawaan XAMPP tanpa perantara API eksternal, tanpa Node.js, dan tanpa koneksi internet (100% offline).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleDownloadXamppFile('index.php');
                    setTimeout(() => handleDownloadXamppFile('koneksi.php'), 300);
                    setTimeout(() => handleDownloadXamppFile('ppdb.php'), 600);
                    setTimeout(() => handleDownloadXamppFile('admin.php'), 900);
                    setTimeout(() => handleDownloadXamppFile('berita.php'), 1200);
                    setTimeout(() => downloadMysqlXamppSqlFile(), 1500);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg transition-all"
                  title="Unduh semua berkas PHP Native dan SQL sekaligus"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Semua Berkas PHP & SQL</span>
                </button>
              </div>
            </div>

            {/* Grid 6 Files */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 text-xs">
              {/* File 1: index.php */}
              <div className="p-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition-all flex flex-col justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-300 flex items-center gap-1.5">
                      <FileCode className="w-4 h-4 text-amber-400" />
                      <span>index.php</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                      Portal Utama
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-100 leading-snug">
                    Halaman depan sekolah: logo identitas, sambutan kepala sekolah, 6 jurusan, warta berita, bursa kerja BKK & testimoni alumni.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-[10px] text-blue-200">Akses: <code>/smk-yapek/</code></span>
                  <button
                    type="button"
                    onClick={() => handleDownloadXamppFile('index.php')}
                    className="px-2.5 py-1 rounded-lg bg-white text-slate-900 hover:bg-blue-50 font-bold text-[11px] flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Unduh</span>
                  </button>
                </div>
              </div>

              {/* File 2: ppdb.php */}
              <div className="p-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition-all flex flex-col justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-300 flex items-center gap-1.5">
                      <FileCode className="w-4 h-4 text-amber-400" />
                      <span>ppdb.php</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-200 font-bold">
                      Formulir PPDB
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-100 leading-snug">
                    Pendaftaran calon siswa baru. Form POST langsung menyimpan data ke tabel MySQL <code>ppdb_applicants</code> tanpa API.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-[10px] text-blue-200">Akses: <code>/ppdb.php</code></span>
                  <button
                    type="button"
                    onClick={() => handleDownloadXamppFile('ppdb.php')}
                    className="px-2.5 py-1 rounded-lg bg-white text-slate-900 hover:bg-blue-50 font-bold text-[11px] flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Unduh</span>
                  </button>
                </div>
              </div>

              {/* File 3: admin.php */}
              <div className="p-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition-all flex flex-col justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-300 flex items-center gap-1.5">
                      <FileCode className="w-4 h-4 text-amber-400" />
                      <span>admin.php</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                      Panel CMS
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-100 leading-snug">
                    Panel administrator untuk menerbitkan berita baru (SQL INSERT) dan memantau daftar calon siswa yang mendaftar PPDB.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-[10px] text-blue-200">Akses: <code>/admin.php</code></span>
                  <button
                    type="button"
                    onClick={() => handleDownloadXamppFile('admin.php')}
                    className="px-2.5 py-1 rounded-lg bg-white text-slate-900 hover:bg-blue-50 font-bold text-[11px] flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Unduh</span>
                  </button>
                </div>
              </div>

              {/* File 4: berita.php */}
              <div className="p-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition-all flex flex-col justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-300 flex items-center gap-1.5">
                      <FileCode className="w-4 h-4 text-amber-400" />
                      <span>berita.php</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 font-bold">
                      Warta & Dokumen
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-100 leading-snug">
                    Halaman membaca artikel warta lengkap beserta daftar dokumen lampiran resmi yang dapat diunduh langsung.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-[10px] text-blue-200">Akses: <code>/berita.php?id=...</code></span>
                  <button
                    type="button"
                    onClick={() => handleDownloadXamppFile('berita.php')}
                    className="px-2.5 py-1 rounded-lg bg-white text-slate-900 hover:bg-blue-50 font-bold text-[11px] flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Unduh</span>
                  </button>
                </div>
              </div>

              {/* File 5: koneksi.php */}
              <div className="p-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition-all flex flex-col justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-300 flex items-center gap-1.5">
                      <FileCode className="w-4 h-4 text-amber-400" />
                      <span>koneksi.php</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                      Koneksi PDO
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-100 leading-snug">
                    Konfigurasi koneksi PDO ke MySQL port 3306 (user root tanpa password) dengan penanganan error visual ramah pemula.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-[10px] text-blue-200">DB: <code>smk_yapek_db</code></span>
                  <button
                    type="button"
                    onClick={() => handleDownloadXamppFile('koneksi.php')}
                    className="px-2.5 py-1 rounded-lg bg-white text-slate-900 hover:bg-blue-50 font-bold text-[11px] flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Unduh</span>
                  </button>
                </div>
              </div>

              {/* File 6: database_mysql_xampp.sql */}
              <div className="p-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition-all flex flex-col justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-emerald-300 flex items-center gap-1.5">
                      <FolderDown className="w-4 h-4 text-emerald-400" />
                      <span>database_mysql_xampp.sql</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 font-bold">
                      12 Tabel SQL
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-100 leading-snug">
                    Skema database MySQL lengkap dengan 12 tabel InnoDB terelasi dan data awal identitas sekolah SMK YAPEK.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-[10px] text-blue-200">Format: SQL DUMP</span>
                  <button
                    type="button"
                    onClick={() => downloadMysqlXamppSqlFile()}
                    className="px-2.5 py-1 rounded-lg bg-emerald-400 text-slate-950 hover:bg-emerald-300 font-bold text-[11px] flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Unduh SQL</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Tester Box for MySQL / XAMPP */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Uji Koneksi Langsung ke MySQL / XAMPP (Live Connection Tester)</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Uji apakah port 3306 dan kredensial database XAMPP Anda sudah dapat dijangkau oleh server aplikasi.
                </p>
              </div>

              <span className="text-[11px] font-semibold text-slate-500">
                Default XAMPP: User <code className="font-bold text-slate-800 dark:text-slate-200">root</code> & Password <code className="font-bold text-slate-800 dark:text-slate-200">(kosong)</code>
              </span>
            </div>

            {/* Input Form Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Host Server
                </label>
                <input
                  type="text"
                  value={testHost}
                  onChange={(e) => setTestHost(e.target.value)}
                  placeholder="127.0.0.1"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Port MySQL
                </label>
                <input
                  type="text"
                  value={testPort}
                  onChange={(e) => setTestPort(e.target.value)}
                  placeholder="3306"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  User MySQL
                </label>
                <input
                  type="text"
                  value={testUser}
                  onChange={(e) => setTestUser(e.target.value)}
                  placeholder="root"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                  placeholder="(kosong untuk XAMPP)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Database
                </label>
                <input
                  type="text"
                  value={testDb}
                  onChange={(e) => setTestDb(e.target.value)}
                  placeholder="smk_yapek_db"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTestingConn}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                {isTestingConn ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Menghubungi MySQL Port {testPort}...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Uji Koneksi MySQL Sekarang</span>
                  </>
                )}
              </button>

              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Panggilan API: <code className="font-mono text-emerald-600 dark:text-emerald-400">POST /api/db/test-connection</code>
              </span>
            </div>

            {/* Test Result Feedback Box */}
            {testResult && (
              <div className={`p-4 rounded-2xl text-xs flex items-start gap-3 animate-fade-in border ${
                testResult.success
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
              }`}>
                {testResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="space-y-1 flex-1">
                  <div className="font-black text-sm flex items-center justify-between">
                    <span>{testResult.message}</span>
                    <span className="text-[10px] opacity-75 font-normal">{testResult.testedAt}</span>
                  </div>
                  {testResult.version && (
                    <div className="text-[11px] font-mono">
                      Versi Server MySQL: <strong>{testResult.version}</strong>
                    </div>
                  )}
                  {testResult.hint && (
                    <div className="text-[11px] text-amber-800 dark:text-amber-300 pt-1">
                      💡 <strong>Petunjuk:</strong> {testResult.hint}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grid: Database Connection Profile & Environment Config */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connection Parameters Card */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#0F4374]/10 dark:bg-sky-950/60 text-[#0F4374] dark:text-sky-400">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Parameter Koneksi Database Aktif ({selectedDriver.toUpperCase()})
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedDriver === 'mysql' 
                    ? 'Konfigurasi MySQL / MariaDB lokal untuk XAMPP phpMyAdmin' 
                    : 'Konfigurasi PostgreSQL untuk Cloud SQL / Supabase / Neon'}
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              ● Siap Digunakan
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-semibold text-slate-400 block uppercase">Driver / Engine</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white font-mono uppercase">
                {selectedDriver === 'mysql' ? 'MySQL 8 / MariaDB' : 'PostgreSQL 15+'}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-semibold text-slate-400 block uppercase">Host Server</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                {selectedDriver === 'mysql' ? '127.0.0.1 (localhost)' : dbConfig.host}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-semibold text-slate-400 block uppercase">Port Default</span>
              <span className="text-sm font-bold text-[#0F4374] dark:text-sky-400 font-mono">
                {selectedDriver === 'mysql' ? '3306' : '5432'}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-semibold text-slate-400 block uppercase">Database Name</span>
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400 font-mono">
                smk_yapek_db
              </span>
            </div>
          </div>

          {/* Connection URI Box */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>
                {selectedDriver === 'mysql' 
                  ? 'MySQL Connection URI (XAMPP PDO / Node MySQL2):' 
                  : 'Standard DATABASE_URL String (PostgreSQL):'}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(
                  selectedDriver === 'mysql'
                    ? 'mysql://root@127.0.0.1:3306/smk_yapek_db'
                    : connectionStrings.postgresUri,
                  'uri'
                )}
                className="text-[11px] text-[#0F4374] dark:text-sky-400 hover:underline flex items-center gap-1 font-semibold"
              >
                {copiedType === 'uri' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedType === 'uri' ? 'Tersalin' : 'Salin URI'}</span>
              </button>
            </label>
            <div className="p-3 rounded-xl bg-slate-950 font-mono text-[11px] text-emerald-400 border border-slate-800 overflow-x-auto select-all">
              {selectedDriver === 'mysql'
                ? 'mysql://root@127.0.0.1:3306/smk_yapek_db'
                : connectionStrings.postgresUri}
            </div>
          </div>

          {/* CLI Terminal Command Box */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-amber-500" />
                <span>Perintah Eksekusi Cepat via Terminal / Bash:</span>
              </span>
              <button
                type="button"
                onClick={() => handleCopy(
                  selectedDriver === 'mysql'
                    ? 'mysql -u root -p smk_yapek_db < database_mysql_xampp.sql'
                    : `${connectionStrings.psqlCli} < database.sql`,
                  'cli-cmd'
                )}
                className="text-[11px] text-[#0F4374] dark:text-sky-400 hover:underline flex items-center gap-1 font-semibold"
              >
                {copiedType === 'cli-cmd' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedType === 'cli-cmd' ? 'Tersalin' : 'Salin Perintah'}</span>
              </button>
            </label>
            <div className="p-3 rounded-xl bg-slate-900 dark:bg-slate-950 font-mono text-[11px] text-amber-300 border border-slate-800 flex items-center justify-between gap-2 overflow-x-auto">
              <code>
                {selectedDriver === 'mysql'
                  ? 'mysql -u root -p smk_yapek_db < database_mysql_xampp.sql'
                  : `${connectionStrings.psqlCli} < database.sql`}
              </code>
            </div>
          </div>
        </div>

        {/* Environment File (.env) Info */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Variabel Lingkungan (.env)
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedDriver === 'mysql' ? 'Konfigurasi XAMPP Bawaan' : 'Konfigurasi PostgreSQL'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {selectedDriver === 'mysql' ? (
                <span>Untuk menghubungkan ke MySQL lokal di XAMPP, gunakan variabel berikut di file <code>.env</code> Anda:</span>
              ) : (
                <span>Konfigurasi variabel untuk PostgreSQL produksi (Supabase / Cloud SQL / VPS):</span>
              )}
            </p>

            <div className="p-3 rounded-2xl bg-slate-950 font-mono text-[11px] text-slate-300 space-y-1 border border-slate-800">
              <div className="text-emerald-400">DB_CLIENT={selectedDriver === 'mysql' ? 'mysql' : 'postgresql'}</div>
              <div>DB_HOST={selectedDriver === 'mysql' ? '127.0.0.1' : 'localhost'}</div>
              <div>DB_PORT={selectedDriver === 'mysql' ? '3306' : '5432'}</div>
              <div className="text-amber-300">DB_NAME=smk_yapek_db</div>
              <div>DB_USER={selectedDriver === 'mysql' ? 'root' : 'yapek_admin'}</div>
              <div className="text-rose-400">DB_PASSWORD={selectedDriver === 'mysql' ? '""' : '******'}</div>
              <div>DB_SSL=false</div>
              <div>DB_POOL_MAX=10</div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => handleCopy(
                selectedDriver === 'mysql'
                  ? `DB_CLIENT="mysql"\nDB_HOST="127.0.0.1"\nDB_PORT="3306"\nDB_NAME="smk_yapek_db"\nDB_USER="root"\nDB_PASSWORD=""\nDB_SSL="false"\nDB_POOL_MIN="2"\nDB_POOL_MAX="10"`
                  : `DATABASE_URL="${connectionStrings.postgresUri}"\nDB_CLIENT="postgresql"\nDB_HOST="localhost"\nDB_PORT="5432"\nDB_NAME="smk_yapek_db"\nDB_USER="yapek_admin"\nDB_PASSWORD="yapek_secure_password_2026"\nDB_SSL="false"`,
                'env-vars'
              )}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
            >
              {copiedType === 'env-vars' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedType === 'env-vars' ? 'Konfigurasi .env Tersalin' : 'Salin Snippet .env'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Database Schema Explorer (12 Tables) */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Table className="w-5 h-5 text-[#0F4374] dark:text-sky-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Daftar 12 Tabel Skema Database SMK YAPEK
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Struktur tabel terelasi untuk manajemen konten berita, lampiran, pendaftar PPDB, dan profil lembaga (Mesin InnoDB / UTF-8)
            </p>
          </div>

          {/* Search Table Filter */}
          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Cari nama tabel..."
              value={searchTableQuery}
              onChange={(e) => setSearchTableQuery(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Table Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredTables.map((table) => {
            const rowCount = getRowCount(table.name);
            return (
              <div 
                key={table.name}
                className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-sky-300 dark:hover:border-sky-700 transition-all flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-[#0F4374] dark:text-sky-300 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-amber-500" />
                      <span>{table.name}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {rowCount} Data
                    </span>
                  </div>
                  <span className="inline-block mt-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    {table.category}
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {table.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span>Primary Key:</span>
                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{table.primaryKey}</span>
                  </div>
                  {table.foreignKeys && table.foreignKeys.length > 0 && (
                    <div className="flex items-start justify-between text-rose-600 dark:text-rose-400 text-[10px]">
                      <span>Relasi:</span>
                      <span className="font-mono font-medium">{table.foreignKeys[0]}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SQL Script Viewer & Copy Hub */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Pratinjau Kode SQL ({selectedDriver === 'mysql' ? 'MySQL / phpMyAdmin' : 'PostgreSQL'})</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                  {selectedDriver === 'mysql' ? 'InnoDB utf8mb4' : 'Postgres 12+'}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Skrip SQL murni siap dieksekusi di phpMyAdmin, HeidiSQL, DBeaver, atau Terminal
              </p>
            </div>
          </div>

          {/* Tab Selector for SQL Snippets */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              type="button"
              onClick={() => setActiveSqlTab('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeSqlTab === 'all' 
                  ? 'bg-white dark:bg-slate-900 text-[#0F4374] dark:text-sky-300 shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Semua (12 Tabel)
            </button>
            <button
              type="button"
              onClick={() => setActiveSqlTab('news')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeSqlTab === 'news' 
                  ? 'bg-white dark:bg-slate-900 text-[#0F4374] dark:text-sky-300 shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Warta & Lampiran
            </button>
            <button
              type="button"
              onClick={() => setActiveSqlTab('ppdb')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeSqlTab === 'ppdb' 
                  ? 'bg-white dark:bg-slate-900 text-[#0F4374] dark:text-sky-300 shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              PPDB Online
            </button>
            <button
              type="button"
              onClick={() => setActiveSqlTab('majors')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeSqlTab === 'majors' 
                  ? 'bg-white dark:bg-slate-900 text-[#0F4374] dark:text-sky-300 shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Profil & Jurusan
            </button>
            {selectedDriver === 'mysql' && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveSqlTab('php_koneksi')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    activeSqlTab === 'php_koneksi' 
                      ? 'bg-amber-400 text-slate-950 shadow-xs' 
                      : 'text-amber-600 dark:text-amber-400 hover:text-amber-800'
                  }`}
                >
                  koneksi.php
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSqlTab('php_ppdb')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    activeSqlTab === 'php_ppdb' 
                      ? 'bg-amber-400 text-slate-950 shadow-xs' 
                      : 'text-amber-600 dark:text-amber-400 hover:text-amber-800'
                  }`}
                >
                  ppdb.php (Tanpa API)
                </button>
              </>
            )}
          </div>
        </div>

        {/* Code Box with Action Bar */}
        <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-400">
            <span className="font-mono text-[11px] text-amber-400">
              {activeSqlTab === 'php_koneksi'
                ? 'koneksi.php (PHP PDO Native - Tanpa API)'
                : activeSqlTab === 'php_ppdb'
                ? 'ppdb.php (Formulir PPDB Native - Tanpa API)'
                : selectedDriver === 'mysql'
                ? 'database_mysql_xampp.sql'
                : 'database_postgres.sql'}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopy(getSelectedSql(), 'active-sql')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                {copiedType === 'active-sql' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-300">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Salin Cuplikan Ini</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (selectedDriver === 'mysql') {
                    downloadMysqlXamppSqlFile(`smk_yapek_mysql_${activeSqlTab}.sql`);
                  } else {
                    downloadDatabaseSqlFile(getSelectedSql(), `smk_yapek_postgres_${activeSqlTab}.sql`);
                  }
                }}
                className="px-2.5 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Download className="w-3 h-3" />
                <span>Unduh Bagian Ini</span>
              </button>
            </div>
          </div>

          <pre className="p-4 text-xs font-mono text-slate-300 max-h-96 overflow-y-auto overflow-x-auto leading-relaxed scrollbar-thin">
            <code>{getSelectedSql()}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
