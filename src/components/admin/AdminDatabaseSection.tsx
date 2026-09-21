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
  FileSpreadsheet, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Terminal,
  Cpu
} from 'lucide-react';
import { dbConfig, getConnectionStrings, DATABASE_TABLES_SCHEMA } from '../../db/config';
import { RAW_DATABASE_SQL } from '../../db/sqlData';
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
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [activeSqlTab, setActiveSqlTab] = useState<'all' | 'news' | 'ppdb' | 'majors'>('all');
  const [searchTableQuery, setSearchTableQuery] = useState('');

  const connectionStrings = getConnectionStrings();

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => {
      setCopiedType(null);
    }, 2500);
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

  // Filtered SQL snippet based on active tab
  const getSelectedSql = () => {
    if (activeSqlTab === 'news') {
      return `-- SKEMA TABEL BERITA, LAMPIRAN DOKUMEN & FOTO DOKUMENTASI
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
    related_article_ids_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS news_attachments (
    id VARCHAR(50) PRIMARY KEY,
    news_id VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    file_type VARCHAR(20) NOT NULL,
    file_size VARCHAR(50) NOT NULL,
    url TEXT NOT NULL,
    upload_date VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attachment_news FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS news_content_images (
    id VARCHAR(50) PRIMARY KEY,
    news_id VARCHAR(50) NOT NULL,
    url TEXT NOT NULL,
    caption TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_content_image_news FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE
);`;
    }

    if (activeSqlTab === 'ppdb') {
      return `-- SKEMA TABEL PPDB ONLINE & PENDAFTAR SISWA BARU
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
    track VARCHAR(50) DEFAULT 'Reguler',
    avg_report_score DECIMAL(5, 2),
    status VARCHAR(50) DEFAULT 'Menunggu Verifikasi',
    registered_at VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ppdb_nisn ON ppdb_applicants(nisn);
CREATE INDEX IF NOT EXISTS idx_ppdb_status ON ppdb_applicants(status);`;
    }

    if (activeSqlTab === 'majors') {
      return `-- SKEMA TABEL PROGRAM KEAHLIAN & PROFIL SEKOLAH
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
    missions_json TEXT,
    stats_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
    skills_json TEXT,
    career_prospects_json TEXT,
    facilities_json TEXT,
    partners_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;
    }

    return RAW_DATABASE_SQL;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-[#0F4374] via-[#15538e] to-[#0A2E50] text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider flex items-center gap-1">
              <Database className="w-3 h-3" />
              <span>Database Engine & Skema SQL</span>
            </span>
            <span className="text-xs text-blue-200">12 Tabel Terelasi & Skrip DDL/DML Lengkap</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Konfigurasi Database & SQL SMK YAPEK Gombong
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
            Mendukung PostgreSQL (Cloud SQL / Supabase / Neon) dan MySQL / MariaDB (cPanel / XAMPP / VPS). Skrip berisi pembuatan tabel (DDL), index relasi, dan data awal (seed data).
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10 self-start md:self-auto">
          <button
            type="button"
            onClick={() => downloadDatabaseSqlFile()}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>Unduh File .SQL</span>
          </button>
          
          <button
            type="button"
            onClick={() => handleCopy(RAW_DATABASE_SQL, 'all-sql')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 border border-white/20 transition-all backdrop-blur-sm"
          >
            {copiedType === 'all-sql' ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin Seluruh SQL</span>
              </>
            )}
          </button>
        </div>
      </div>

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
                  Parameter Koneksi Database (Config)
                </h3>
                <p className="text-xs text-slate-400">
                  Konfigurasi driver PostgreSQL & MySQL aktif di sistem
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
                {dbConfig.client}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-semibold text-slate-400 block uppercase">Host Server</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                {dbConfig.host}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-semibold text-slate-400 block uppercase">Port Default</span>
              <span className="text-sm font-bold text-[#0F4374] dark:text-sky-400 font-mono">
                {dbConfig.port}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-semibold text-slate-400 block uppercase">Database Name</span>
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400 font-mono">
                {dbConfig.database}
              </span>
            </div>
          </div>

          {/* Connection URI Box */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Standard DATABASE_URL String (PostgreSQL):</span>
              <button
                type="button"
                onClick={() => handleCopy(connectionStrings.postgresUri, 'pg-uri')}
                className="text-[11px] text-[#0F4374] dark:text-sky-400 hover:underline flex items-center gap-1 font-semibold"
              >
                {copiedType === 'pg-uri' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedType === 'pg-uri' ? 'Tersalin' : 'Salin URI'}</span>
              </button>
            </label>
            <div className="p-3 rounded-xl bg-slate-950 font-mono text-[11px] text-emerald-400 border border-slate-800 overflow-x-auto select-all">
              {connectionStrings.postgresUri}
            </div>
          </div>

          {/* CLI Terminal Command Box */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-amber-500" />
                <span>Perintah Import Cepat via Terminal / Bash:</span>
              </span>
              <button
                type="button"
                onClick={() => handleCopy(`${connectionStrings.psqlCli} < database.sql`, 'cli-cmd')}
                className="text-[11px] text-[#0F4374] dark:text-sky-400 hover:underline flex items-center gap-1 font-semibold"
              >
                {copiedType === 'cli-cmd' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedType === 'cli-cmd' ? 'Tersalin' : 'Salin Perintah'}</span>
              </button>
            </label>
            <div className="p-3 rounded-xl bg-slate-900 dark:bg-slate-950 font-mono text-[11px] text-amber-300 border border-slate-800 flex items-center justify-between gap-2 overflow-x-auto">
              <code>{`${connectionStrings.psqlCli} < database.sql`}</code>
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
                <p className="text-xs text-slate-400">Tersedia di file .env.example</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Anda dapat mengarahkan aplikasi ke database produksi (seperti Supabase, PostgreSQL di VPS, atau MySQL cPanel) hanya dengan mengisi variabel berikut:
            </p>

            <div className="p-3 rounded-2xl bg-slate-950 font-mono text-[11px] text-slate-300 space-y-1 border border-slate-800">
              <div className="text-emerald-400">DB_CLIENT=postgresql</div>
              <div>DB_HOST=localhost</div>
              <div>DB_PORT=5432</div>
              <div className="text-amber-300">DB_NAME=smk_yapek_db</div>
              <div>DB_USER=yapek_admin</div>
              <div className="text-rose-400">DB_PASSWORD=******</div>
              <div>DB_SSL=false</div>
              <div>DB_POOL_MAX=10</div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => handleCopy(`DATABASE_URL="${connectionStrings.postgresUri}"\nDB_CLIENT="postgresql"\nDB_HOST="localhost"\nDB_PORT="5432"\nDB_NAME="smk_yapek_db"\nDB_USER="yapek_admin"\nDB_PASSWORD="yapek_secure_password_2026"\nDB_SSL="false"`, 'env-vars')}
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
              Struktur tabel terelasi untuk manajemen konten berita, lampiran, pendaftar PPDB, dan profil lembaga
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
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Pratinjau Kode SQL (DDL + Data Awal)
              </h3>
              <p className="text-xs text-slate-400">
                Skrip SQL murni siap dieksekusi di pgAdmin, phpMyAdmin, DBeaver, atau Cloud Shell
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
          </div>
        </div>

        {/* Code Box with Action Bar */}
        <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-400">
            <span className="font-mono text-[11px] text-amber-400">smk_yapek_database.sql</span>
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
                onClick={() => downloadDatabaseSqlFile(getSelectedSql(), `smk_yapek_${activeSqlTab}.sql`)}
                className="px-2.5 py-1 rounded-lg bg-sky-900/60 hover:bg-sky-800 text-sky-200 text-xs font-semibold flex items-center gap-1 transition-colors"
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
