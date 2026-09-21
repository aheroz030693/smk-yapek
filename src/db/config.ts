/**
 * Database Configuration & Connection Profile
 * SMK YAPEK Gombong Portal & SIA System
 * 
 * Mendukung PostgreSQL (Supabase, Neon, Cloud SQL, Local) dan MySQL / MariaDB (cPanel, XAMPP, VPS).
 */

export interface DatabaseConnectionConfig {
  client: 'postgresql' | 'mysql';
  host: string;
  port: number;
  database: string;
  user: string;
  password?: string;
  ssl: boolean;
  pool: {
    min: number;
    max: number;
    idleTimeoutMillis?: number;
    connectionTimeoutMillis?: number;
  };
  connectionString?: string;
}

// Default production/development config loaded from environment variables
export const dbConfig: DatabaseConnectionConfig = {
  client: (typeof process !== 'undefined' && process.env?.DB_CLIENT === 'mysql') ? 'mysql' : 'postgresql',
  host: (typeof process !== 'undefined' && process.env?.DB_HOST) || 'localhost',
  port: (typeof process !== 'undefined' && process.env?.DB_PORT) 
    ? parseInt(process.env.DB_PORT, 10) 
    : ((typeof process !== 'undefined' && process.env?.DB_CLIENT === 'mysql') ? 3306 : 5432),
  database: (typeof process !== 'undefined' && process.env?.DB_NAME) || 'smk_yapek_db',
  user: (typeof process !== 'undefined' && process.env?.DB_USER) || 'yapek_admin',
  password: (typeof process !== 'undefined' && process.env?.DB_PASSWORD) || 'yapek_secure_password_2026',
  ssl: (typeof process !== 'undefined' && process.env?.DB_SSL === 'true'),
  pool: {
    min: (typeof process !== 'undefined' && process.env?.DB_POOL_MIN) ? parseInt(process.env.DB_POOL_MIN, 10) : 2,
    max: (typeof process !== 'undefined' && process.env?.DB_POOL_MAX) ? parseInt(process.env.DB_POOL_MAX, 10) : 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  },
  connectionString: (typeof process !== 'undefined' && process.env?.DATABASE_URL) 
    || 'postgresql://yapek_admin:yapek_secure_password_2026@localhost:5432/smk_yapek_db?sslmode=disable'
};

/**
 * Format string koneksi untuk berbagai driver/CLI:
 */
export const getConnectionStrings = () => {
  const { host, port, database, user, password } = dbConfig;
  return {
    postgresUri: `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password || '')}@${host}:${port}/${database}?sslmode=disable`,
    mysqlUri: `mysql://${encodeURIComponent(user)}:${encodeURIComponent(password || '')}@${host}:${port}/${database}`,
    psqlCli: `psql -h ${host} -p ${port} -U ${user} -d ${database}`,
    mysqlCli: `mysql -h ${host} -P ${port} -u ${user} -p ${database}`
  };
};

/**
 * Rincian Tabel Database SMK YAPEK Gombong
 */
export interface TableSchemaMeta {
  name: string;
  description: string;
  category: string;
  columnsCount: number;
  primaryKey: string;
  foreignKeys?: string[];
}

export const DATABASE_TABLES_SCHEMA: TableSchemaMeta[] = [
  {
    name: 'school_identity',
    description: 'Profil identitas sekolah, visi-misi, akreditasi, kontak, dan statistik lembaga',
    category: 'Profil Lembaga',
    columnsCount: 19,
    primaryKey: 'id (VARCHAR(50))'
  },
  {
    name: 'headmaster_profile',
    description: 'Data kepala sekolah, foto resmi, NIP, sambutan, dan periode jabatan',
    category: 'Profil Lembaga',
    columnsCount: 12,
    primaryKey: 'id (VARCHAR(50))'
  },
  {
    name: 'majors',
    description: '6 Kompetensi Keahlian (TKJ, AKL, OTKP, BDP, TKKR, TKR), kurikulum & mitra industri',
    category: 'Akademik',
    columnsCount: 14,
    primaryKey: 'id (VARCHAR(50))'
  },
  {
    name: 'news',
    description: 'Naskah warta, berita acara resmi, pengumuman, kategori, jumlah views, dan status terbit',
    category: 'Humas & Publikasi',
    columnsCount: 14,
    primaryKey: 'id (VARCHAR(50))'
  },
  {
    name: 'news_attachments',
    description: 'Berkas lampiran dokumen warta (PDF, DOCX, XLSX, Juknis, dsb.) dengan relasi ke tabel news',
    category: 'Humas & Publikasi',
    columnsCount: 8,
    primaryKey: 'id (VARCHAR(50))',
    foreignKeys: ['news_id -> news(id) ON DELETE CASCADE']
  },
  {
    name: 'news_content_images',
    description: 'Foto dokumentasi & galeri kegiatan pendukung naskah warta dengan relasi ke tabel news',
    category: 'Humas & Publikasi',
    columnsCount: 6,
    primaryKey: 'id (VARCHAR(50))',
    foreignKeys: ['news_id -> news(id) ON DELETE CASCADE']
  },
  {
    name: 'ppdb_applicants',
    description: 'Data pendaftaran calon siswa baru (NISN, data wali, pilihan jurusan, jalur, status berkas)',
    category: 'Kesiswaan & PPDB',
    columnsCount: 18,
    primaryKey: 'id (VARCHAR(50))'
  },
  {
    name: 'job_postings',
    description: 'Lowongan kerja industri Bursa Kerja Khusus (BKK) untuk siswa & alumni',
    category: 'Bursa Kerja Khusus',
    columnsCount: 12,
    primaryKey: 'id (VARCHAR(50))'
  },
  {
    name: 'alumni_testimonials',
    description: 'Kisah sukses alumni, nama perusahaan/usaha, rating, sorotan prestasi, dan moderasi',
    category: 'Tracer Study Alumni',
    columnsCount: 14,
    primaryKey: 'id (VARCHAR(50))'
  },
  {
    name: 'activity_gallery',
    description: 'Arsip foto dokumentasi kegiatan sekolah, upacara, praktik, dan kejuaraan',
    category: 'Dokumentasi Sekolah',
    columnsCount: 10,
    primaryKey: 'id (VARCHAR(50))'
  },
  {
    name: 'admin_users',
    description: 'Akun pengelola CMS Humas, Kepala Sekolah, dan Redaksi dengan role dan hak akses',
    category: 'Manajemen Sistem',
    columnsCount: 8,
    primaryKey: 'id (VARCHAR(50))'
  },
  {
    name: 'visitor_logs',
    description: 'Log kunjungan portal sekolah, IP tersensor, halaman favorit, perangkat, dan lokasi',
    category: 'Statistik & Analitik',
    columnsCount: 8,
    primaryKey: 'id (VARCHAR(50))'
  }
];
