import { PPDBApplicant, NewsItem, AlumniTestimonial, ActivityGalleryItem, SchoolIdentity, AdminUser } from '../types';

/**
 * Generates properly escaped CSV string with UTF-8 BOM so Excel & Google Sheets display Indonesian text properly.
 */
export function generateCsv(headers: string[], rows: (string | number | boolean | null | undefined)[][]): string {
  const escapeCell = (val: any): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    // Wrap in quotes if it contains comma, newline, or quotes
    if (str.includes(',') || str.includes('\n') || str.includes('\r') || str.includes('"')) {
      return `"${str}"`;
    }
    return `"${str}"`;
  };

  const headerLine = headers.map(escapeCell).join(',');
  const rowLines = rows.map((r) => r.map(escapeCell).join(','));
  return '\uFEFF' + [headerLine, ...rowLines].join('\r\n');
}

/**
 * Converts headers and rows to Tab-Separated Values (TSV), which pastes seamlessly into Google Sheets cells with Ctrl+V.
 */
export function generateTsv(headers: string[], rows: (string | number | boolean | null | undefined)[][]): string {
  const cleanCell = (val: any): string => {
    if (val === null || val === undefined) return '';
    return String(val).replace(/\t/g, ' ').replace(/\r?\n/g, ' ');
  };

  const headerLine = headers.map(cleanCell).join('\t');
  const rowLines = rows.map((r) => r.map(cleanCell).join('\t'));
  return [headerLine, ...rowLines].join('\n');
}

/**
 * Browser download trigger for CSV / text files
 */
export function downloadFile(filename: string, content: string, mimeType: string = 'text/csv;charset=utf-8;') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Parses CSV or TSV string into headers and rows
 */
export function parseSpreadsheetText(text: string): { headers: string[]; rows: string[][] } {
  const clean = text.replace(/^\uFEFF/, '').trim();
  if (!clean) return { headers: [], rows: [] };

  const lines = clean.split(/\r?\n/);
  if (lines.length === 0) return { headers: [], rows: [] };

  // Determine delimiter: tab vs comma
  const firstLine = lines[0];
  const isTab = firstLine.includes('\t') && (firstLine.split('\t').length > firstLine.split(',').length);
  const delimiter = isTab ? '\t' : ',';

  const parseLine = (line: string): string[] => {
    if (delimiter === '\t') {
      return line.split('\t').map((c) => c.trim().replace(/^"(.*)"$/, '$1'));
    }
    // Simple CSV parser supporting quotes
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseLine(lines[0]);
  const rows: string[][] = [];
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      rows.push(parseLine(lines[i]));
    }
  }

  return { headers, rows };
}

// -------------------------------------------------------------
// SPREADSHEET TABLE DEFINITIONS & CONVERTERS
// -------------------------------------------------------------

export interface SpreadsheetTable {
  id: string;
  name: string;
  sheetName: string;
  description: string;
  headers: string[];
  getRows: () => (string | number)[][];
}

export function getSpreadsheetTables(data: {
  applicants: PPDBApplicant[];
  newsList: NewsItem[];
  galleryItems: ActivityGalleryItem[];
  testimonials: AlumniTestimonial[];
  schoolInfo: SchoolIdentity;
  adminUsers: AdminUser[];
}): SpreadsheetTable[] {
  return [
    {
      id: 'ppdb_pendaftar',
      name: 'Data Calon Siswa PPDB',
      sheetName: 'PPDB_Pendaftar_2026',
      description: 'Daftar formulir pendaftaran peserta didik baru SMK YAPEK Gombong.',
      headers: [
        'ID Pendaftaran',
        'NISN',
        'Nama Lengkap Siswa',
        'Jenis Kelamin',
        'Asal Sekolah / SMP',
        'Pilihan Jurusan 1',
        'Pilihan Jurusan 2',
        'Jalur Seleksi',
        'No. WhatsApp Orang Tua',
        'Alamat Lengkap',
        'Nama Orang Tua / Wali',
        'Status Seleksi',
        'Tanggal Daftar'
      ],
      getRows: () =>
        data.applicants.map((a) => [
          a.id,
          a.nisn,
          a.fullName,
          a.gender,
          a.originSchool,
          a.firstMajor,
          a.secondMajor || '-',
          a.track,
          a.parentPhone,
          a.address,
          a.parentName,
          a.status,
          a.registeredAt
        ])
    },
    {
      id: 'berita_sekolah',
      name: 'Warta & Berita Sekolah',
      sheetName: 'Warta_Berita',
      description: 'Artikel kabar kegiatan, kejuaraan, prestasi, dan pengumuman sekolah.',
      headers: [
        'ID Berita',
        'Judul Berita',
        'Kategori',
        'Tanggal Publikasi',
        'Penulis / Redaksi',
        'Jumlah Pembaca (Views)',
        'Status',
        'Berita Utama (Headline)',
        'Ringkasan Cuplikan'
      ],
      getRows: () =>
        data.newsList.map((n) => [
          n.id,
          n.title,
          n.category,
          n.date,
          n.author,
          n.views,
          n.status === 'published' ? 'PUBLISH' : 'DRAFT',
          n.isHeadline ? 'YA' : 'TIDAK',
          n.summary || n.content.substring(0, 100) + '...'
        ])
    },
    {
      id: 'galeri_kegiatan',
      name: 'Galeri Foto & Sarpras',
      sheetName: 'Galeri_Kegiatan',
      description: 'Dokumentasi foto kegiatan ekstrakurikuler, workshop lab, dan sarana prasarana.',
      headers: [
        'ID Foto',
        'Judul Kegiatan',
        'Kategori Aktivitas',
        'Tanggal Kegiatan',
        'Lokasi',
        'Keterangan / Kepsyen',
        'URL Foto Banner'
      ],
      getRows: () =>
        data.galleryItems.map((g) => [
          g.id,
          g.title,
          g.activityType,
          g.date,
          g.location || 'Kampus SMK YAPEK',
          g.caption,
          g.image
        ])
    },
    {
      id: 'testimoni_alumni',
      name: 'Testimoni & Jejak Alumni',
      sheetName: 'Testimoni_Alumni',
      description: 'Cerita sukses para lulusan SMK YAPEK Gombong di dunia industri & wirausaha.',
      headers: [
        'ID Testimoni',
        'Nama Lengkap Alumni',
        'Tahun Kelulusan',
        'Jurusan Vokasi',
        'Peran / Jabatan',
        'Perusahaan / Tempat Bekerja',
        'Status Moderasi',
        'Isi Ulasan / Testimoni'
      ],
      getRows: () =>
        data.testimonials.map((t) => [
          t.id,
          t.name,
          t.graduationYear,
          t.major,
          t.role,
          t.company,
          t.status === 'approved' ? 'DISETUJUI (TAMPIL)' : 'MENUNGGU MODERASI',
          t.content
        ])
    },
    {
      id: 'identitas_sekolah',
      name: 'Identitas Profil Sekolah',
      sheetName: 'Identitas_Sekolah',
      description: 'Data legalitas sekolah, akreditasi BAN-SM, kontak dinas, dan alamat resmi.',
      headers: [
        'Parameter Sekolah',
        'Nilai / Isi Konfigurasi',
        'Keterangan Resmi'
      ],
      getRows: () => [
        ['Nama Resmi Sekolah', data.schoolInfo.name, 'SMK YAPEK Gombong'],
        ['NPSN', data.schoolInfo.npsn, 'Nomor Pokok Sekolah Nasional'],
        ['Status Akreditasi', `Akreditasi ${data.schoolInfo.accreditation}`, 'Predikat BAN-SM'],
        ['Tahun Berdiri', String(data.schoolInfo.establishedYear), 'Tahun pendirian resmi'],
        ['Alamat Kampus', data.schoolInfo.address, 'Lokasi fisik kampus'],
        ['No. Telepon Resmi', data.schoolInfo.phone, 'Kontak kantor'],
        ['Email Resmi Dinas', data.schoolInfo.email, 'Surel korespondensi'],
        ['Website Resmi', data.schoolInfo.website, 'Portal informasi publik'],
        ['Slogan Vokasi', data.schoolInfo.tagline, 'Motto sekolah']
      ]
    },
    {
      id: 'admin_users',
      name: 'Petugas CMS & Hak Akses',
      sheetName: 'Petugas_CMS',
      description: 'Daftar akun administrator, kepala sekolah, redaksi, dan panitia PPDB.',
      headers: [
        'ID Petugas',
        'Nama Lengkap',
        'Email Login',
        'Peranan (Role)',
        'Status Akun',
        'Login Terakhir'
      ],
      getRows: () =>
        data.adminUsers.map((u) => [
          u.id,
          u.name,
          u.email,
          u.role,
          u.status === 'active' ? 'AKTIF' : 'NONAKTIF',
          u.lastLogin || '-'
        ])
    }
  ];
}

/**
 * Ready-to-use Google Apps Script code to connect Google Spreadsheet with SMK YAPEK Web Portal.
 */
export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * GOOGLE APPS SCRIPT DATABASE CONNECTOR - SMK YAPEK GOMBONG
 * -------------------------------------------------------------
 * Panduan Pemasangan (Hanya 1 Menit):
 * 1. Buat Google Spreadsheet baru di https://sheets.google.com
 * 2. Buka menu: Ekstensi > Apps Script
 * 3. Hapus kode bawaan, tempelkan seluruh kode ini, lalu klik Simpan (Ctrl+S).
 * 4. Klik tombol "Deploy" (di kanan atas) > "New deployment"
 * 5. Pilih tipe "Web app":
 *    - Description: "Database Web Portal SMK YAPEK"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (Siapa saja)
 * 6. Klik Deploy, Berikan Izin Akses (Authorize Access), lalu Salin "Web app URL".
 * 7. Tempelkan URL tersebut ke kolom "URL Sinkronisasi Google Sheets" di Admin Portal SMK YAPEK!
 */

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = (e && e.parameter && e.parameter.sheet) || 'PPDB_Pendaftar_2026';
  const sheet = ss.getSheetByName(sheetName) || ss.getSheets()[0];
  
  const data = sheet.getDataRange().getValues();
  if (data.length === 0) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'ok', headers: [], rows: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  const headers = data[0];
  const rows = data.slice(1);
  
  const response = {
    status: 'success',
    sheetName: sheet.getName(),
    totalRows: rows.length,
    updatedAt: new Date().toISOString(),
    headers: headers,
    rows: rows
  };
  
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let contents = {};
    
    if (e.postData && e.postData.contents) {
      contents = JSON.parse(e.postData.contents);
    } else {
      contents = e.parameter;
    }
    
    const action = contents.action || 'append';
    const targetSheetName = contents.sheetName || 'PPDB_Pendaftar_2026';
    let sheet = ss.getSheetByName(targetSheetName);
    
    // Jika sheet belum ada, buat otomatis
    if (!sheet) {
      sheet = ss.insertSheet(targetSheetName);
      if (contents.headers && Array.isArray(contents.headers)) {
        sheet.appendRow(contents.headers);
        // Format baris header
        sheet.getRange(1, 1, 1, contents.headers.length)
          .setBackground('#0F4374')
          .setFontColor('#FFFFFF')
          .setFontWeight('bold');
      }
    }
    
    if (action === 'append' && contents.row) {
      sheet.appendRow(contents.row);
    } else if (action === 'overwrite' && contents.rows && contents.headers) {
      sheet.clearContents();
      sheet.appendRow(contents.headers);
      sheet.getRange(1, 1, 1, contents.headers.length)
        .setBackground('#0F4374')
        .setFontColor('#FFFFFF')
        .setFontWeight('bold');
        
      if (contents.rows.length > 0) {
        sheet.getRange(2, 1, contents.rows.length, contents.rows[0].length).setValues(contents.rows);
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Data berhasil disimpan ke Google Spreadsheet SMK YAPEK!',
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
`;
