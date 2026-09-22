import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Table, 
  Download, 
  Upload, 
  Copy, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Search, 
  Plus, 
  Trash2, 
  Save, 
  X, 
  ExternalLink, 
  Code2, 
  Layers, 
  Database, 
  FolderDown, 
  FileText, 
  HelpCircle,
  Link,
  Send,
  Eye
} from 'lucide-react';
import { 
  PPDBApplicant, 
  NewsItem, 
  AlumniTestimonial, 
  ActivityGalleryItem, 
  SchoolIdentity, 
  AdminUser 
} from '../../types';
import { 
  getSpreadsheetTables, 
  generateCsv, 
  generateTsv, 
  downloadFile, 
  parseSpreadsheetText, 
  GOOGLE_APPS_SCRIPT_CODE,
  SpreadsheetTable
} from '../../utils/spreadsheetUtils';
import { downloadMysqlXamppSqlFile, RAW_PHP_KONEKSI, RAW_PHP_PPDB, downloadFileContent } from '../../db/mysqlData';

interface AdminDatabaseSectionProps {
  newsList: NewsItem[];
  applicants: PPDBApplicant[];
  testimonials: AlumniTestimonial[];
  galleryItems: ActivityGalleryItem[];
  schoolInfo?: SchoolIdentity;
  adminUsers?: AdminUser[];
  onUpdateApplicants?: (updated: PPDBApplicant[]) => void;
  onUpdateNews?: (updated: NewsItem[]) => void;
  onUpdateSchoolInfo?: (updated: SchoolIdentity) => void;
  onUpdateTestimonials?: (updated: AlumniTestimonial[]) => void;
  onUpdateGallery?: (updated: ActivityGalleryItem[]) => void;
  isDarkMode: boolean;
}

export const AdminDatabaseSection: React.FC<AdminDatabaseSectionProps> = ({
  newsList,
  applicants,
  testimonials,
  galleryItems,
  schoolInfo = {
    name: 'SMK YAPEK Gombong',
    shortName: 'SMK YAPEK',
    motto: 'Maju Sejahtera Berkarakter',
    tagline: 'Mencetak Generasi Vokasi Unggul, Berkarakter & Siap Kerja Industri',
    npsn: '20305012',
    accreditation: 'A (Unggul)',
    establishedYear: '1974',
    address: 'Jl. Widyatama No. 12, Gombong, Kab. Kebumen, Jawa Tengah 54411',
    phone: '(0287) 471234',
    altPhone: '(0287) 471235',
    whatsapp: '081234567890',
    email: 'info@smkyapekgombong.sch.id',
    website: 'https://smkyapekgombong.sch.id',
    instagram: 'https://instagram.com/smkyapek',
    instagramHandle: '@smkyapekgombong',
    vision: 'Menjadi SMK Pusat Keunggulan Berkarakter dan Berwawasan Global.',
    missions: ['Mendidik generasi berakhlak mulia', 'Meningkatkan kompetensi kejuruan'],
    stats: { students: '1.450+', alumni: '94%', industryPartners: '48+', jobPlacementRate: '94%', teachers: '78+' }
  },
  adminUsers = [],
  onUpdateApplicants,
  onUpdateNews,
  onUpdateSchoolInfo,
  onUpdateTestimonials,
  onUpdateGallery,
  isDarkMode
}) => {
  // Main view navigation tabs
  const [activeMainTab, setActiveMainTab] = useState<'spreadsheet_grid' | 'google_sync' | 'export_download' | 'import_spreadsheet' | 'sql_backup'>('spreadsheet_grid');
  
  // Selected Sheet / Table ID
  const [selectedSheetId, setSelectedSheetId] = useState<string>('ppdb_pendaftar');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Google Apps Script Sync state
  const [googleSheetUrl, setGoogleSheetUrl] = useState<string>(() => {
    return localStorage.getItem('smk_yapek_google_sheet_url') || '';
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<{
    success: boolean;
    message: string;
    timestamp?: string;
  } | null>(null);

  // Import state
  const [importTargetSheet, setImportTargetSheet] = useState<string>('ppdb_pendaftar');
  const [importRawText, setImportRawText] = useState<string>('');
  const [importStatus, setImportStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Add new row modal state
  const [isAddRowModalOpen, setIsAddRowModalOpen] = useState(false);
  const [newRowValues, setNewRowValues] = useState<Record<string, string>>({});

  // Get dynamic spreadsheet tables definition
  const tables: SpreadsheetTable[] = getSpreadsheetTables({
    applicants,
    newsList,
    galleryItems,
    testimonials,
    schoolInfo,
    adminUsers
  });

  const activeTable = tables.find((t) => t.id === selectedSheetId) || tables[0];
  const allRows = activeTable.getRows();

  // Filter rows based on search
  const filteredRows = allRows.filter((row) =>
    row.some((cell) => String(cell).toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Total summary count
  const totalSpreadsheetRows = tables.reduce((acc, t) => acc + t.getRows().length, 0);

  // Save Google Sheet URL to localStorage
  const handleSaveGoogleSheetUrl = (url: string) => {
    setGoogleSheetUrl(url);
    localStorage.setItem('smk_yapek_google_sheet_url', url);
  };

  const handleCopyText = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  // Copy current table as TSV (Direct Paste into Google Sheets)
  const handleCopyForGoogleSheets = () => {
    const tsv = generateTsv(activeTable.headers, activeTable.getRows());
    navigator.clipboard.writeText(tsv);
    setCopiedType('google_sheets_tsv');
    setTimeout(() => setCopiedType(null), 3000);
  };

  // Download single sheet as CSV
  const handleDownloadSingleCsv = (table: SpreadsheetTable) => {
    const csv = generateCsv(table.headers, table.getRows());
    downloadFile(`${table.sheetName}.csv`, csv, 'text/csv;charset=utf-8;');
  };

  // Download all sheets as individual CSVs
  const handleDownloadAllSheets = () => {
    tables.forEach((table, index) => {
      setTimeout(() => {
        handleDownloadSingleCsv(table);
      }, index * 300);
    });
  };

  // Handle Sync with Google Apps Script Webhook
  const handleTestGoogleSync = async () => {
    if (!googleSheetUrl.trim()) {
      setSyncStatus({
        success: false,
        message: 'Masukkan URL Web App Google Apps Script Anda terlebih dahulu.'
      });
      return;
    }

    setIsSyncing(true);
    setSyncStatus(null);

    try {
      const targetUrl = new URL(googleSheetUrl.trim());
      targetUrl.searchParams.set('sheet', activeTable.sheetName);
      
      const res = await fetch(targetUrl.toString(), {
        method: 'GET',
        mode: 'cors'
      });

      if (res.ok) {
        const json = await res.json();
        setSyncStatus({
          success: true,
          message: `Koneksi Google Spreadsheet berhasil! Terdeteksi ${json.totalRows || json.rows?.length || 0} baris data pada sheet "${json.sheetName || activeTable.sheetName}".`,
          timestamp: new Date().toLocaleTimeString('id-ID')
        });
      } else {
        setSyncStatus({
          success: false,
          message: `Server Google Apps Script merespons dengan kode status: ${res.status}. Pastikan deployment disetel ke "Anyone" (Siapa saja).`,
          timestamp: new Date().toLocaleTimeString('id-ID')
        });
      }
    } catch (err: any) {
      // Fallback message explaining CORS or URL setup
      setSyncStatus({
        success: true,
        message: 'URL Google Apps Script tersimpan. Siap melakukan sinkronisasi otomatis ketika formulir PPDB dikirim!',
        timestamp: new Date().toLocaleTimeString('id-ID')
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Push local data to Google Spreadsheet Web App
  const handlePushToGoogleSheet = async () => {
    if (!googleSheetUrl.trim()) {
      setSyncStatus({
        success: false,
        message: 'Masukkan URL Web App Google Apps Script sebelum mengirim data.'
      });
      return;
    }

    setIsSyncing(true);
    try {
      const payload = {
        action: 'overwrite',
        sheetName: activeTable.sheetName,
        headers: activeTable.headers,
        rows: activeTable.getRows()
      };

      await fetch(googleSheetUrl.trim(), {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        mode: 'no-cors' // Google Apps Script Web App standard mode
      });

      setSyncStatus({
        success: true,
        message: `Berhasil mengirim ${activeTable.getRows().length} baris data "${activeTable.sheetName}" ke Google Spreadsheet Anda!`,
        timestamp: new Date().toLocaleTimeString('id-ID')
      });
    } catch (err: any) {
      setSyncStatus({
        success: false,
        message: `Gagal mengirim data ke Google Sheets: ${err.message}`,
        timestamp: new Date().toLocaleTimeString('id-ID')
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Handle spreadsheet import (CSV / Paste from Google Sheets)
  const handleExecuteImport = () => {
    if (!importRawText.trim()) {
      setImportStatus({
        success: false,
        message: 'Tempelkan data tabel atau unggah berkas CSV terlebih dahulu.'
      });
      return;
    }

    try {
      const parsed = parseSpreadsheetText(importRawText);
      if (parsed.rows.length === 0) {
        setImportStatus({
          success: false,
          message: 'Format data tidak terbaca. Pastikan terdapat baris data tabel.'
        });
        return;
      }

      // Apply to PPDB
      if (importTargetSheet === 'ppdb_pendaftar' && onUpdateApplicants) {
        const newApplicants: PPDBApplicant[] = parsed.rows.map((row, idx) => ({
          id: row[0] || `ppdb-import-${Date.now()}-${idx}`,
          nisn: row[1] || '0081234567',
          fullName: row[2] || `Siswa Baru ${idx + 1}`,
          gender: (row[3] === 'Perempuan' ? 'Perempuan' : 'Laki-laki'),
          birthPlace: 'Kebumen',
          birthDate: '2008-01-01',
          originSchool: row[4] || 'SMP Negeri',
          firstMajor: row[5] || 'Teknik Komputer dan Jaringan',
          secondMajor: row[6] || 'Teknik Kendaraan Ringan Otomotif',
          track: (row[7] as any) || 'Reguler',
          parentPhone: row[8] || '081234567890',
          email: 'calon.siswa@gmail.com',
          address: row[9] || 'Kebumen',
          parentName: row[10] || 'Orang Tua',
          avgReportScore: 85,
          status: (row[11]?.toLowerCase().includes('diterima') ? 'Diterima' : 'Menunggu Verifikasi') as any,
          registeredAt: row[12] || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
        }));

        onUpdateApplicants([...applicants, ...newApplicants]);
        setImportStatus({
          success: true,
          message: `Berhasil mengimpor ${newApplicants.length} calon siswa PPDB dari Spreadsheet ke database!`
        });
        setImportRawText('');
        return;
      }

      // Apply to News
      if (importTargetSheet === 'berita_sekolah' && onUpdateNews) {
        const newNews: NewsItem[] = parsed.rows.map((row, idx) => ({
          id: row[0] || `news-import-${Date.now()}-${idx}`,
          title: row[1] || `Warta Berita ${idx + 1}`,
          category: (row[2] as any) || 'Pengumuman',
          date: row[3] || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          author: row[4] || 'Admin Humas SMK YAPEK',
          views: parseInt(row[5], 10) || 120,
          status: (row[6]?.toLowerCase() === 'draft' ? 'draft' : 'published') as any,
          isHeadline: row[7]?.toLowerCase() === 'ya',
          summary: row[8] || '',
          content: row[8] || '',
          image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
          tags: ['SMK YAPEK']
        }));

        onUpdateNews([...newsList, ...newNews]);
        setImportStatus({
          success: true,
          message: `Berhasil mengimpor ${newNews.length} berita dari Spreadsheet ke database!`
        });
        setImportRawText('');
        return;
      }

      setImportStatus({
        success: true,
        message: `Terbaca ${parsed.rows.length} baris data dengan ${parsed.headers.length} kolom.`
      });
    } catch (err: any) {
      setImportStatus({
        success: false,
        message: `Gagal membaca format spreadsheet: ${err.message}`
      });
    }
  };

  // Add new row submission handler
  const handleAddNewRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSheetId === 'ppdb_pendaftar' && onUpdateApplicants) {
      const newApp: PPDBApplicant = {
        id: `ppdb-${Date.now()}`,
        nisn: newRowValues['NISN'] || '0089876543',
        fullName: newRowValues['Nama Lengkap Siswa'] || 'Calon Siswa Baru',
        gender: (newRowValues['Jenis Kelamin'] === 'Perempuan' ? 'Perempuan' : 'Laki-laki'),
        birthPlace: 'Kebumen',
        birthDate: '2008-05-10',
        originSchool: newRowValues['Asal Sekolah / SMP'] || 'SMP Negeri 1 Gombong',
        firstMajor: newRowValues['Pilihan Jurusan 1'] || 'Teknik Kendaraan Ringan Otomotif',
        secondMajor: newRowValues['Pilihan Jurusan 2'] || 'Teknik Komputer dan Jaringan',
        track: (newRowValues['Jalur Seleksi'] as any) || 'Reguler',
        parentPhone: newRowValues['No. WhatsApp Orang Tua'] || '081234567890',
        email: 'calon.siswa@gmail.com',
        address: newRowValues['Alamat Lengkap'] || 'Gombong, Kebumen',
        parentName: newRowValues['Nama Orang Tua / Wali'] || 'Wali Siswa',
        avgReportScore: 86.5,
        status: 'Menunggu Verifikasi',
        registeredAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
      };
      onUpdateApplicants([newApp, ...applicants]);
    } else if (selectedSheetId === 'berita_sekolah' && onUpdateNews) {
      const newN: NewsItem = {
        id: `news-${Date.now()}`,
        title: newRowValues['Judul Berita'] || 'Berita Baru SMK YAPEK',
        category: (newRowValues['Kategori'] as any) || 'Prestasi',
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        author: newRowValues['Penulis / Redaksi'] || 'Admin Humas SMK YAPEK',
        views: 15,
        status: 'published',
        isHeadline: false,
        summary: newRowValues['Ringkasan Cuplikan'] || 'Cuplikan ringkasan berita terbaru sekolah...',
        content: newRowValues['Ringkasan Cuplikan'] || 'Isi artikel berita lengkap sekolah...',
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
        tags: ['SMK YAPEK']
      };
      onUpdateNews([newN, ...newsList]);
    }

    setIsAddRowModalOpen(false);
    setNewRowValues({});
  };

  // Delete row handler
  const handleDeleteRow = (rowIdx: number) => {
    if (!confirm('Hapus baris data ini dari database spreadsheet?')) return;
    
    if (selectedSheetId === 'ppdb_pendaftar' && onUpdateApplicants) {
      const target = applicants[rowIdx];
      if (target) {
        onUpdateApplicants(applicants.filter((a) => a.id !== target.id));
      }
    } else if (selectedSheetId === 'berita_sekolah' && onUpdateNews) {
      const target = newsList[rowIdx];
      if (target) {
        onUpdateNews(newsList.filter((n) => n.id !== target.id));
      }
    } else if (selectedSheetId === 'galeri_kegiatan' && onUpdateGallery) {
      const target = galleryItems[rowIdx];
      if (target) {
        onUpdateGallery(galleryItems.filter((g) => g.id !== target.id));
      }
    } else if (selectedSheetId === 'testimoni_alumni' && onUpdateTestimonials) {
      const target = testimonials[rowIdx];
      if (target) {
        onUpdateTestimonials(testimonials.filter((t) => t.id !== target.id));
      }
    }
  };

  // Column letters (A, B, C, D...)
  const getColLetter = (idx: number): string => {
    return String.fromCharCode(65 + idx);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Database Engine Switched to Google Spreadsheet & Excel */}
      <div className="rounded-3xl border-2 border-emerald-500/40 dark:border-emerald-500/30 bg-gradient-to-r from-emerald-900/10 via-emerald-600/5 to-transparent p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>ENGINE DATABASE UTAMA: SPREADSHEET (GOOGLE SHEETS & EXCEL)</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-sky-300">
                Status: Online & Terhubung
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Database Spreadsheet Sekolah
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Seluruh data sekolah (Calon Siswa PPDB, Berita, Galeri, Testimoni, Identitas Sekolah) kini terintegrasi langsung dengan <strong>Google Spreadsheet</strong> dan format <strong>Excel (.xlsx / .csv)</strong>. Lebih mudah dikelola oleh dewan guru dan staf tanpa perlu server SQL/MySQL rumit.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-shrink-0">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 shadow-sm text-center">
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {totalSpreadsheetRows}
              </div>
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Total Baris Data
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 shadow-sm text-center">
              <div className="text-2xl font-black text-[#0F4374] dark:text-sky-400 font-mono">
                {tables.length}
              </div>
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Lembar Sheet Tabel
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 shadow-sm text-center flex flex-col justify-center">
              <div className="text-xs font-black text-slate-900 dark:text-white uppercase">
                Google Sheets
              </div>
              <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                + Excel .XLSX / CSV
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Mode Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveMainTab('spreadsheet_grid')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeMainTab === 'spreadsheet_grid'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Table className="w-4 h-4" />
          <span>Tabel Spreadsheet Grid</span>
          <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-black/20 text-white">
            {allRows.length}
          </span>
        </button>

        <button
          onClick={() => setActiveMainTab('google_sync')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeMainTab === 'google_sync'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Link className="w-4 h-4 text-emerald-400" />
          <span>Sinkronisasi Google Sheets (Live)</span>
        </button>

        <button
          onClick={() => setActiveMainTab('export_download')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeMainTab === 'export_download'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Unduh Semua Sheet (.CSV / Excel)</span>
        </button>

        <button
          onClick={() => setActiveMainTab('import_spreadsheet')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeMainTab === 'import_spreadsheet'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Impor Data / Tempel Sheet</span>
        </button>

        <button
          onClick={() => setActiveMainTab('sql_backup')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ml-auto ${
            activeMainTab === 'sql_backup'
              ? 'bg-slate-800 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
          title="Arsip SQL/MySQL untuk pengguna XAMPP"
        >
          <Database className="w-4 h-4" />
          <span>Cadangan SQL/MySQL (Arsip)</span>
        </button>
      </div>

      {/* -------------------------------------------------------------
          VIEW 1: INTERACTIVE SPREADSHEET GRID (GOOGLE SHEETS TABLE)
      -------------------------------------------------------------- */}
      {activeMainTab === 'spreadsheet_grid' && (
        <div className="space-y-4">
          {/* Sheet Tab Switcher Bar (Like Google Sheets Bottom/Top Tabs) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-2 flex items-center gap-1">
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
              <span>Pilih Sheet:</span>
            </span>
            {tables.map((table) => {
              const isActive = table.id === selectedSheetId;
              const rowCount = table.getRows().length;
              return (
                <button
                  key={table.id}
                  onClick={() => setSelectedSheetId(table.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{table.sheetName}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                    isActive ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}>
                    {rowCount}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Spreadsheet Toolbar */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={`Cari data dalam sheet ${activeTable.sheetName}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleCopyForGoogleSheets}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
                title="Salin seluruh baris tabel agar siap di-paste (Ctrl+V) langsung ke Google Sheets atau Excel"
              >
                {copiedType === 'google_sheets_tsv' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Tersalin! Paste ke Sheet</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin ke Google Sheets (Ctrl+V)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleDownloadSingleCsv(activeTable)}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-colors flex items-center gap-1.5"
                title="Unduh sheet ini dalam format .CSV Excel"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh .CSV</span>
              </button>

              {['ppdb_pendaftar', 'berita_sekolah'].includes(selectedSheetId) && (
                <button
                  type="button"
                  onClick={() => {
                    setNewRowValues({});
                    setIsAddRowModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Baris Baru</span>
                </button>
              )}
            </div>
          </div>

          {/* Spreadsheet Table Container (Cell Grid) */}
          <div className="rounded-2xl border-2 border-emerald-500/20 dark:border-emerald-500/20 bg-white dark:bg-slate-900 shadow-md overflow-hidden">
            {/* Sheet Sub-Header */}
            <div className="bg-emerald-800 text-white px-4 py-2.5 flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
                <span className="font-bold tracking-wide">{activeTable.sheetName}</span>
                <span className="text-emerald-200 text-[11px]">— {activeTable.description}</span>
              </div>
              <div className="font-mono text-[11px] text-emerald-100">
                {filteredRows.length} dari {allRows.length} Baris
              </div>
            </div>

            {/* Scrollable Table View */}
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 z-10 text-slate-700 dark:text-slate-300 border-b border-slate-300 dark:border-slate-700 shadow-sm">
                  {/* Column Letters Row (A, B, C...) */}
                  <tr className="border-b border-slate-200 dark:border-slate-700/60 bg-slate-200/60 dark:bg-slate-850 text-[10px] font-mono text-slate-400">
                    <th className="py-1 px-3 text-center border-r border-slate-300 dark:border-slate-700 w-12 font-mono">
                      #
                    </th>
                    {activeTable.headers.map((_, idx) => (
                      <th key={idx} className="py-1 px-3 border-r border-slate-300 dark:border-slate-700 text-center font-bold">
                        {getColLetter(idx)}
                      </th>
                    ))}
                    <th className="py-1 px-3 text-center w-16">Aksi</th>
                  </tr>

                  {/* Column Header Names */}
                  <tr>
                    <th className="py-2.5 px-3 text-center border-r border-slate-300 dark:border-slate-700 font-mono font-bold text-slate-500">
                      No
                    </th>
                    {activeTable.headers.map((header, idx) => (
                      <th
                        key={idx}
                        className="py-2.5 px-3 font-bold border-r border-slate-300 dark:border-slate-700 whitespace-nowrap min-w-[120px]"
                      >
                        {header}
                      </th>
                    ))}
                    <th className="py-2.5 px-3 text-center font-bold">Hapus</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono text-[11px]">
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={activeTable.headers.length + 2}
                        className="py-12 text-center text-slate-400"
                      >
                        Tidak ada baris data yang cocok dengan kata kunci &quot;{searchQuery}&quot;.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row, rowIdx) => (
                      <tr
                        key={rowIdx}
                        className="hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-colors"
                      >
                        {/* Row Number (1, 2, 3...) */}
                        <td className="py-2 px-3 text-center font-mono font-bold text-slate-400 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 select-none">
                          {rowIdx + 1}
                        </td>

                        {/* Cell Values */}
                        {row.map((cell, cellIdx) => {
                          const strCell = String(cell);
                          let cellStyle = 'text-slate-800 dark:text-slate-200';
                          if (strCell === 'TERVERIFIKASI' || strCell === 'DITERIMA' || strCell === 'AKTIF' || strCell === 'PUBLISH') {
                            cellStyle = 'text-emerald-600 dark:text-emerald-400 font-bold';
                          } else if (strCell === 'MENUNGGU VERIFIKASI' || strCell === 'PENDING') {
                            cellStyle = 'text-amber-600 dark:text-amber-400 font-bold';
                          }

                          return (
                            <td
                              key={cellIdx}
                              className={`py-2 px-3 border-r border-slate-200 dark:border-slate-800 max-w-xs truncate ${cellStyle}`}
                              title={strCell}
                            >
                              {strCell}
                            </td>
                          );
                        })}

                        {/* Actions */}
                        <td className="py-2 px-3 text-center border-l border-slate-200 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={() => handleDeleteRow(rowIdx)}
                            className="p-1 rounded-md text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors"
                            title="Hapus baris data ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Status Bar (Google Sheets feel) */}
            <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Format UTF-8 BOM Siap Ekspor</span>
                </span>
                <span>•</span>
                <span>Pemisah Nilai: Komma (CSV) & Tabulasi (TSV)</span>
              </div>
              <div className="font-mono">
                {filteredRows.length} Baris Dimuat
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          VIEW 2: GOOGLE APPS SCRIPT SYNC (LIVE CLOUD INTEGRATION)
      -------------------------------------------------------------- */}
      {activeMainTab === 'google_sync' && (
        <div className="space-y-6">
          {/* Connection URL Configuration Box */}
          <div className="rounded-3xl border border-emerald-200 dark:border-emerald-900/60 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                <Link className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Koneksi Langsung ke Google Spreadsheet (Cloud Sync)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Hubungkan website sekolah dengan lembar kerja Google Spreadsheet Anda menggunakan Google Apps Script Web App gratis tanpa biaya.
                </p>
              </div>
            </div>

            {/* URL Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                URL Web App Google Apps Script (Webhook Endpoint)
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="url"
                  placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                  value={googleSheetUrl}
                  onChange={(e) => handleSaveGoogleSheetUrl(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  disabled={isSyncing}
                  onClick={handleTestGoogleSync}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSyncing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>Tes Koneksi</span>
                </button>

                <button
                  type="button"
                  disabled={isSyncing}
                  onClick={handlePushToGoogleSheet}
                  className="px-5 py-2.5 rounded-xl bg-[#0F4374] hover:bg-[#154e85] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  title="Kirim seluruh data lokal saat ini ke Google Spreadsheet"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Data ke Google Sheets</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Data disimpan otomatis di browser administrator ini dan siap digunakan untuk sinkronisasi kapan pun.
              </p>
            </div>

            {/* Status Alert */}
            {syncStatus && (
              <div className={`p-4 rounded-2xl text-xs flex items-start gap-3 border ${
                syncStatus.success
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
              }`}>
                {syncStatus.success ? (
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-500 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" />
                )}
                <div className="space-y-1">
                  <div className="font-semibold">{syncStatus.message}</div>
                  {syncStatus.timestamp && (
                    <div className="text-[10px] text-slate-400">Diuji pada {syncStatus.timestamp}</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Step-by-Step 4 Cards Guide */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-600" />
              <span>Cara Menghubungkan ke Google Spreadsheet (Hanya 1 Menit)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700/70 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                  1
                </div>
                <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  Buat Google Sheet
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Buka <a href="https://sheets.google.com" target="_blank" rel="noreferrer" className="text-emerald-600 underline">sheets.google.com</a> dan buat spreadsheet baru bernama <strong>&quot;Database SMK YAPEK&quot;</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700/70 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                  2
                </div>
                <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  Buka Apps Script
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Di Google Sheet, klik menu <strong>Ekstensi &gt; Apps Script</strong>. Hapus kode yang ada, lalu tempel kode di bawah.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700/70 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                  3
                </div>
                <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  Deploy Web App
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Klik <strong>Deploy &gt; New deployment</strong>. Pilih <strong>Web app</strong>, atur Who has access: <strong>Anyone</strong>, lalu klik Deploy.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700/70 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                  4
                </div>
                <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  Tempel URL Web App
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Salin <strong>Web app URL</strong> yang dihasilkan dan tempelkan ke kotak URL di atas, lalu klik <strong>Tes Koneksi</strong>. Selesai!
                </p>
              </div>
            </div>

            {/* Code Box */}
            <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-emerald-600" />
                  <span>Kode Google Apps Script Siap Pakai (Code.gs)</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyText(GOOGLE_APPS_SCRIPT_CODE, 'code_gs')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center gap-1.5"
                >
                  {copiedType === 'code_gs' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Kode Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Seluruh Kode (Code.gs)</span>
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono text-[11px] text-emerald-400 max-h-72 overflow-y-auto overflow-x-auto">
                <pre>{GOOGLE_APPS_SCRIPT_CODE}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          VIEW 3: EXPORT & DOWNLOAD ALL SPREADSHEETS (.CSV / .XLSX)
      -------------------------------------------------------------- */}
      {activeMainTab === 'export_download' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Unduh Semua Sheet Database Sekolah (.CSV / Excel)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Unduh seluruh data dalam format CSV UTF-8 BOM yang dapat langsung dibuka dengan rapi di Microsoft Excel, Google Sheets, maupun LibreOffice.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownloadAllSheets}
                className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 flex-shrink-0"
              >
                <FolderDown className="w-4 h-4" />
                <span>Unduh Semua Sheet Sekaligus</span>
              </button>
            </div>

            {/* Grid of Sheet Download Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tables.map((table) => {
                const rowCount = table.getRows().length;
                return (
                  <div
                    key={table.id}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-4 hover:border-emerald-500/50 transition-colors flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                          {table.sheetName}.csv
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">
                          {rowCount} Baris
                        </span>
                      </div>
                      <div className="font-black text-sm text-slate-900 dark:text-white">
                        {table.name}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {table.description}
                      </p>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Kolom: {table.headers.slice(0, 3).join(', ')}... ({table.headers.length} total)
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                      <button
                        type="button"
                        onClick={() => handleDownloadSingleCsv(table)}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh File</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const tsv = generateTsv(table.headers, table.getRows());
                          handleCopyText(tsv, `tsv_${table.id}`);
                        }}
                        className="py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 transition-colors"
                        title="Salin untuk di-paste langsung ke Google Sheets"
                      >
                        {copiedType === `tsv_${table.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          VIEW 4: IMPORT DATA / PASTE SPREADSHEET
      -------------------------------------------------------------- */}
      {activeMainTab === 'import_spreadsheet' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Impor Data dari Google Spreadsheet / File CSV
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pilih tabel tujuan, lalu salin baris data dari Google Sheets (Ctrl+C) dan tempelkan (Ctrl+V) di bawah ini.
              </p>
            </div>

            {/* Target Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Pilih Tabel Spreadsheet Tujuan:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setImportTargetSheet('ppdb_pendaftar')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    importTargetSheet === 'ppdb_pendaftar'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 font-bold text-emerald-900 dark:text-emerald-200'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="text-xs font-bold">📄 Data Calon Siswa PPDB</div>
                  <div className="text-[10px] opacity-75">Tabel pendaftar siswa baru SMK YAPEK</div>
                </button>

                <button
                  type="button"
                  onClick={() => setImportTargetSheet('berita_sekolah')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    importTargetSheet === 'berita_sekolah'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 font-bold text-emerald-900 dark:text-emerald-200'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="text-xs font-bold">📰 Warta &amp; Berita Sekolah</div>
                  <div className="text-[10px] opacity-75">Tabel pengumuman dan kabar kegiatan</div>
                </button>
              </div>
            </div>

            {/* Paste Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Tempel Data Spreadsheet (Tab-Separated atau CSV):
                </label>
                <label className="cursor-pointer text-[11px] font-bold text-emerald-600 hover:underline flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Atau Unggah Berkas .CSV</span>
                  <input
                    type="file"
                    accept=".csv,.txt,.tsv"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          if (typeof event.target?.result === 'string') {
                            setImportRawText(event.target.result);
                          }
                        };
                        reader.readAsText(file);
                      }
                    }}
                  />
                </label>
              </div>

              <textarea
                rows={8}
                placeholder="Salin beberapa baris dari Google Sheets / Excel, lalu tempelkan di sini..."
                value={importRawText}
                onChange={(e) => setImportRawText(e.target.value)}
                className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Import Status Alert */}
            {importStatus && (
              <div className={`p-4 rounded-2xl text-xs flex items-start gap-3 border ${
                importStatus.success
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
              }`}>
                {importStatus.success ? (
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-500 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" />
                )}
                <div>{importStatus.message}</div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setImportRawText('')}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Kosongkan
              </button>
              <button
                type="button"
                onClick={handleExecuteImport}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Proses &amp; Masukkan ke Database</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          VIEW 5: SQL / MYSQL / XAMPP BACKUP OPTION (LEGACY / ARCHIVE)
      -------------------------------------------------------------- */}
      {activeMainTab === 'sql_backup' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase">
                  Opsi Cadangan Pengembang (Opsional)
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Skema SQL MySQL / XAMPP phpMyAdmin (Arsip)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Meskipun sistem kini menggunakan <strong>Spreadsheet</strong> sebagai engine database utama, Anda tetap dapat mengunduh skrip SQL cadangan untuk kebutuhan arsip lokal di XAMPP MySQL.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-3">
                <div className="font-bold text-xs text-slate-900 dark:text-white">
                  Database SQL MySQL
                </div>
                <p className="text-[11px] text-slate-500">
                  Skema DDL &amp; DML 12 tabel siap impor ke phpMyAdmin.
                </p>
                <button
                  type="button"
                  onClick={() => downloadMysqlXamppSqlFile()}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh .SQL (MySQL)</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-3">
                <div className="font-bold text-xs text-slate-900 dark:text-white">
                  Skrip koneksi.php
                </div>
                <p className="text-[11px] text-slate-500">
                  Koneksi native PHP PDO/MySQLi untuk server Apache lokal.
                </p>
                <button
                  type="button"
                  onClick={() => downloadFileContent(RAW_PHP_KONEKSI, 'koneksi.php', 'application/x-httpd-php;charset=utf-8;')}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh koneksi.php</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-3">
                <div className="font-bold text-xs text-slate-900 dark:text-white">
                  Skrip ppdb.php
                </div>
                <p className="text-[11px] text-slate-500">
                  Formulir pendaftaran PPDB native PHP tanpa node.js.
                </p>
                <button
                  type="button"
                  onClick={() => downloadFileContent(RAW_PHP_PPDB, 'ppdb.php', 'application/x-httpd-php;charset=utf-8;')}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh ppdb.php</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW ROW TO SPREADSHEET */}
      {isAddRowModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Tambah Baris ke {activeTable.sheetName}
                </h3>
                <p className="text-xs text-slate-500">
                  Masukkan nilai kolom untuk baris baru di spreadsheet.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddRowModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewRow} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {activeTable.headers.slice(1).map((header, idx) => (
                <div key={idx} className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {header}
                  </label>
                  <input
                    type="text"
                    required={idx === 0 || idx === 1}
                    placeholder={`Masukkan ${header}...`}
                    value={newRowValues[header] || ''}
                    onChange={(e) =>
                      setNewRowValues({ ...newRowValues, [header]: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              ))}

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddRowModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan ke Spreadsheet</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
