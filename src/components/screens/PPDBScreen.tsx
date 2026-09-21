import React, { useState } from 'react';
import { INITIAL_APPLICANTS, MAJORS, SCHOOL_INFO } from '../../data/schoolData';
import { PPDBApplicant } from '../../types';
import { SchoolLogo } from '../SchoolLogo';
import { 
  CheckCircle2, 
  FileText, 
  Search, 
  UserCheck, 
  Download, 
  Printer, 
  Calendar, 
  AlertCircle, 
  Sparkles, 
  Check, 
  QrCode,
  ArrowRight,
  Clock,
  ShieldCheck,
  Send
} from 'lucide-react';

interface PPDBScreenProps {
  isDarkMode: boolean;
}

export const PPDBScreen: React.FC<PPDBScreenProps> = ({ isDarkMode }) => {
  const [activeSubTab, setActiveSubTab] = useState<'form' | 'check' | 'guide'>('form');
  const [applicants, setApplicants] = useState<PPDBApplicant[]>(INITIAL_APPLICANTS);
  
  // Registration form state
  const [formData, setFormData] = useState({
    nisn: '',
    fullName: '',
    gender: 'Laki-laki' as 'Laki-laki' | 'Perempuan',
    birthPlace: '',
    birthDate: '',
    originSchool: '',
    parentName: '',
    parentPhone: '',
    email: '',
    address: '',
    firstMajor: 'TKJ',
    secondMajor: 'AKL',
    track: 'Reguler' as 'Reguler' | 'Prestasi' | 'Afirmasi / KIP',
    avgReportScore: 85,
  });

  const [submittedApplicant, setSubmittedApplicant] = useState<PPDBApplicant | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<PPDBApplicant | null | 'NOT_FOUND'>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.nisn || !formData.originSchool) {
      alert('Mohon lengkapi data wajib (NISN, Nama Lengkap, dan Asal Sekolah).');
      return;
    }

    const newId = `YAGO-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newApplicant: PPDBApplicant = {
      id: newId,
      nisn: formData.nisn,
      fullName: formData.fullName,
      gender: formData.gender,
      birthPlace: formData.birthPlace || 'Kebumen',
      birthDate: formData.birthDate || '2010-01-01',
      originSchool: formData.originSchool,
      parentName: formData.parentName || 'Orang Tua / Wali',
      parentPhone: formData.parentPhone || '-',
      email: formData.email || '-',
      address: formData.address || 'Kebumen',
      firstMajor: formData.firstMajor,
      secondMajor: formData.secondMajor,
      track: formData.track,
      avgReportScore: Number(formData.avgReportScore),
      status: 'Menunggu Verifikasi',
      registeredAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setApplicants([newApplicant, ...applicants]);
    setSubmittedApplicant(newApplicant);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    const found = applicants.find(
      (a) => a.nisn.toLowerCase() === query || a.id.toLowerCase() === query || a.fullName.toLowerCase().includes(query)
    );

    setSearchResult(found || 'NOT_FOUND');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Header banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5" />
          <span>Tahun Ajaran 2026/2027</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          Penerimaan Peserta Didik Baru (PPDB Online)
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Pendaftaran siswa baru SMK YAPEK Gombong dibuka secara transparan dan mudah. Pilih jalur pendaftaran Anda dan bergabunglah bersama kami!
        </p>

        {/* Sub Navigation */}
        <div className="pt-4 flex items-center justify-center gap-2">
          <button
            id="subtab-ppdb-form"
            onClick={() => { setActiveSubTab('form'); setSubmittedApplicant(null); }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeSubTab === 'form'
                ? 'bg-[#0F4374] text-white shadow-md'
                : 'bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Formulir Pendaftaran</span>
          </button>

          <button
            id="subtab-ppdb-check"
            onClick={() => setActiveSubTab('check')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeSubTab === 'check'
                ? 'bg-[#0F4374] text-white shadow-md'
                : 'bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
            }`}
          >
            <Search className="w-4 h-4 text-amber-400" />
            <span>Cek Status Seleksi</span>
          </button>

          <button
            id="subtab-ppdb-guide"
            onClick={() => setActiveSubTab('guide')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeSubTab === 'guide'
                ? 'bg-[#0F4374] text-white shadow-md'
                : 'bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Alur & Beasiswa</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: REGISTRATION FORM */}
      {activeSubTab === 'form' && !submittedApplicant && (
        <div className="max-w-4xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-xl space-y-8">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-5 bg-amber-500 rounded-sm"></span>
              Isi Biodata Calon Peserta Didik Baru
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Harap mengisikan data yang valid sesuai dengan Kartu Keluarga (KK) dan Akta Kelahiran.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section A: Identitas Siswa */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-[#0F4374] dark:text-sky-400 uppercase tracking-wider">
                A. Identitas Calon Siswa
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    NISN (Nomor Induk Siswa Nasional) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 0089281721"
                    value={formData.nisn}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Lengkap (Sesuai Ijazah / Akta) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Muhammad Rizky Ramadhan"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Jenis Kelamin *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Asal Sekolah (SMP / MTs) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: SMPN 1 Gombong"
                    value={formData.originSchool}
                    onChange={(e) => setFormData({ ...formData, originSchool: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
                  />
                </div>
              </div>
            </div>

            {/* Section B: Pilihan Jurusan & Jalur */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-[#0F4374] dark:text-sky-400 uppercase tracking-wider">
                B. Pilihan Jurusan & Jalur Masuk
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pilihan Jurusan 1 (Utama) *
                  </label>
                  <select
                    value={formData.firstMajor}
                    onChange={(e) => setFormData({ ...formData, firstMajor: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
                  >
                    {MAJORS.map((m) => (
                      <option key={m.id} value={m.code}>
                        {m.code} - {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pilihan Jurusan 2 (Cadangan)
                  </label>
                  <select
                    value={formData.secondMajor}
                    onChange={(e) => setFormData({ ...formData, secondMajor: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
                  >
                    {MAJORS.map((m) => (
                      <option key={m.id} value={m.code}>
                        {m.code} - {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Jalur Pendaftaran
                  </label>
                  <select
                    value={formData.track}
                    onChange={(e) => setFormData({ ...formData, track: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
                  >
                    <option value="Reguler">Jalur Reguler (Umum)</option>
                    <option value="Prestasi">Jalur Prestasi (Rapor/Lomba)</option>
                    <option value="Afirmasi / KIP">Jalur Afirmasi (KIP / PKH / Yatim)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section C: Kontak & Orang Tua */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-[#0F4374] dark:text-sky-400 uppercase tracking-wider">
                C. Data Orang Tua & Kontak
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Orang Tua / Wali
                  </label>
                  <input
                    type="text"
                    placeholder="Nama Ayah / Ibu"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    No. WhatsApp Aktif *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="08xxxxxxxxxx (untuk pengumuman seleksi)"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Alamat Lengkap Rumah
                  </label>
                  <input
                    type="text"
                    placeholder="Desa/Kelurahan, RT/RW, Kecamatan, Kabupaten"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="submit"
                id="btn-submit-ppdb"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Formulir Pendaftaran</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW 1.2: SUCCESS SUBMISSION TICKET */}
      {submittedApplicant && (
        <div className="max-w-2xl mx-auto rounded-3xl border-2 border-amber-500 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Pendaftaran Berhasil!</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Berikut adalah Kartu Bukti Tanda Pendaftaran PPDB Online SMK YAPEK Gombong Anda:
            </p>
          </div>

          {/* Printable Registration Card */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <SchoolLogo variant={isDarkMode ? 'dark' : 'light'} size="sm" />
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400">Nomor Registrasi:</span>
                <div className="font-mono font-bold text-[#0F4374] dark:text-sky-400 text-sm">
                  {submittedApplicant.id}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400">Nama Lengkap:</span>
                <div className="font-bold text-slate-800 dark:text-white">{submittedApplicant.fullName}</div>
              </div>
              <div>
                <span className="text-slate-400">NISN:</span>
                <div className="font-bold text-slate-800 dark:text-white">{submittedApplicant.nisn}</div>
              </div>
              <div>
                <span className="text-slate-400">Asal Sekolah:</span>
                <div className="font-bold text-slate-800 dark:text-white">{submittedApplicant.originSchool}</div>
              </div>
              <div>
                <span className="text-slate-400">Jalur:</span>
                <div className="font-bold text-amber-600 dark:text-amber-400">{submittedApplicant.track}</div>
              </div>
              <div>
                <span className="text-slate-400">Pilihan 1:</span>
                <div className="font-bold text-[#0F4374] dark:text-sky-400">{submittedApplicant.firstMajor}</div>
              </div>
              <div>
                <span className="text-slate-400">Pilihan 2:</span>
                <div className="font-bold text-slate-700 dark:text-slate-300">{submittedApplicant.secondMajor}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400">Status Awal:</span>
                <div className="text-xs font-bold text-amber-500">{submittedApplicant.status}</div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                <QrCode className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <span>VERIFIED-QR</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-2 hover:bg-slate-800"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Kartu Peserta</span>
            </button>
            <button
              onClick={() => setSubmittedApplicant(null)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span>Daftar Siswa Lain</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW 2: CHECK STATUS */}
      {activeSubTab === 'check' && (
        <div className="max-w-2xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Cek Status Pendaftaran & Verifikasi Berkas
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Masukkan Nomor Registrasi (contoh: <code>YAGO-2026-001</code>) atau NISN 10 digit Anda.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Masukkan NISN atau No. Pendaftaran..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#0F4374] text-white font-bold text-sm hover:bg-blue-900 transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Cari</span>
            </button>
          </form>

          {/* Search Result Display */}
          {searchResult && searchResult !== 'NOT_FOUND' && (
            <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300">
                  {searchResult.id}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white">
                  {searchResult.status}
                </span>
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {searchResult.fullName}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 grid grid-cols-2 gap-2">
                <div>NISN: <strong>{searchResult.nisn}</strong></div>
                <div>Asal: <strong>{searchResult.originSchool}</strong></div>
                <div>Pilihan 1: <strong className="text-[#0F4374] dark:text-sky-400">{searchResult.firstMajor}</strong></div>
                <div>Jalur: <strong>{searchResult.track}</strong></div>
              </div>
              <div className="pt-2 text-xs text-emerald-800 dark:text-emerald-300 border-t border-emerald-200 dark:border-emerald-800">
                Langkah selanjutnya: Silakan datang ke Posko PPDB SMK YAPEK Gombong untuk pengukuran seragam dan verifikasi fisik berkas asli.
              </div>
            </div>
          )}

          {searchResult === 'NOT_FOUND' && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-center text-xs text-amber-800 dark:text-amber-300">
              Data pendaftaran tidak ditemukan. Pastikan NISN atau No. Registrasi yang Anda masukkan sudah sesuai.
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: ALUR & BEASISWA */}
      {activeSubTab === 'guide' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Col 1: Alur Pendaftaran */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-5 bg-[#0F4374] rounded-sm"></span>
              Alur Pendaftaran Siswa Baru
            </h3>
            <div className="space-y-4">
              {[
                { step: '1', title: 'Pendaftaran Online / Langsung', desc: 'Mengisi formulir melalui portal ini atau langsung di Sekretariat PPDB SMK YAPEK Gombong.' },
                { step: '2', title: 'Verifikasi Berkas & Wawancara', desc: 'Menyerahkan fotokopi KK, Akta Lahir, Surat Keterangan Lulus (SKL), dan wawancara peminatan jurusan.' },
                { step: '3', title: 'Pengumuman & Daftar Ulang', desc: 'Pengumuman kelulusan administrasi dan proses daftar ulang serta pengukuran seragam sekolah.' },
                { step: '4', title: 'Masa Pengenalan Lingkungan Sekolah (MPLS)', desc: 'Mengikuti pembekalan karakter, pengenalan bengkel/lab, dan budaya disiplin industri.' }
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#0F4374] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Col 2: Program Beasiswa */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-5 bg-amber-500 rounded-sm"></span>
              Program Beasiswa & Keringanan Biaya
            </h3>
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60">
                <div className="font-bold text-amber-800 dark:text-amber-300 text-sm mb-1">
                  1. Beasiswa Prestasi Akademik
                </div>
                <p>
                  Bebas Biaya Gedung / Sumbangan Pengembangan Institusi (SPI) bagi peraih peringkat 1, 2, dan 3 di SMP/MTs asal (dibuktikan dengan surat keterangan kepala sekolah).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60">
                <div className="font-bold text-[#0F4374] dark:text-sky-300 text-sm mb-1">
                  2. Beasiswa Prestasi Non-Akademik (Olahraga / Seni)
                </div>
                <p>
                  Bebas SPP selama 6 bulan untuk juara 1-3 lomba tingkat kabupaten/provinsi (O2SN, FLS2N, Popda, MTQ, dll).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
                <div className="font-bold text-emerald-800 dark:text-emerald-300 text-sm mb-1">
                  3. Program Afirmasi KIP & Yatim Piatu
                </div>
                <p>
                  Keringanan biaya seragam dan bantuan operasional melalui jalur Program Indonesia Pintar (PIP) untuk siswa dari keluarga prasejahtera.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
