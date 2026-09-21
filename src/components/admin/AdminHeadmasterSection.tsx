import React, { useState, useRef } from 'react';
import { HeadmasterProfile } from '../../types';
import { 
  UserCheck, 
  Save, 
  RotateCcw, 
  Image as ImageIcon, 
  Quote, 
  FileText, 
  CheckCircle2, 
  Eye, 
  Sparkles, 
  ChevronRight,
  Award,
  ExternalLink,
  Upload,
  Camera,
  Trash2,
  RefreshCw,
  Link,
  ChevronDown
} from 'lucide-react';
import { INITIAL_HEADMASTER_PROFILE } from '../../data/schoolData';

interface AdminHeadmasterSectionProps {
  headmaster: HeadmasterProfile;
  onUpdateHeadmaster: (updated: HeadmasterProfile) => void;
  isDarkMode: boolean;
}

const HEADMASTER_PRESETS = [
  {
    label: 'Jas Formal Berdasi Pria',
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    desc: 'Pose resmi wibawa jas hitam berdasi'
  },
  {
    label: 'Jas Navy & Dasi Emas',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    desc: 'Foto potret kepala sekolah standar website'
  },
  {
    label: 'Batik Resmi Pendidik',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    desc: 'Seragam batik dinas edukatif'
  },
  {
    label: 'Ibu Kepala Sekolah Berhijab',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    desc: 'Pimpinan wanita formal berhijab'
  }
];

export const AdminHeadmasterSection: React.FC<AdminHeadmasterSectionProps> = ({
  headmaster,
  onUpdateHeadmaster,
  isDarkMode
}) => {
  const [formData, setFormData] = useState<HeadmasterProfile>({ ...headmaster });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeViewMode, setActiveViewMode] = useState<'editor' | 'preview'>('editor');
  
  // Photo upload states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleChange = (field: keyof HeadmasterProfile, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Local photo upload handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih berkas gambar yang valid (JPG, PNG, atau WebP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert('Ukuran berkas melebihi 8MB. Mohon gunakan foto dengan ukuran lebih ringan untuk performa optimal.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        handleChange('avatar', reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih berkas gambar yang valid (JPG, PNG, atau WebP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert('Ukuran berkas melebihi 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        handleChange('avatar', reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateHeadmaster(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const handleResetToDefault = () => {
    if (window.confirm('Kembalikan profil dan teks sambutan Kepala Sekolah ke setelan awal pabrik?')) {
      setFormData({ ...INITIAL_HEADMASTER_PROFILE });
      onUpdateHeadmaster({ ...INITIAL_HEADMASTER_PROFILE });
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#0F4374] to-[#154e85] text-white shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
              Menu Eksekutif
            </span>
            <span className="text-xs text-blue-200">Terhubung ke Beranda Depan</span>
          </div>
          <h2 className="text-2xl font-black">Kelola Profil & Sambutan Kepala Sekolah</h2>
          <p className="text-xs text-blue-100">
            Perubahan teks sambutan, foto, gelar, dan visi kepemimpinan akan langsung tampil di halaman depan website.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveViewMode(activeViewMode === 'editor' ? 'preview' : 'editor')}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-2 transition-colors"
          >
            <Eye className="w-4 h-4 text-amber-300" />
            <span>{activeViewMode === 'editor' ? 'Lihat Pratinjau Tampilan' : 'Kembali ke Form'}</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <div className="font-semibold">
            Data Kepala Sekolah & Teks Sambutan berhasil disimpan dan diperbarui di beranda portal!
          </div>
        </div>
      )}

      {/* Main Grid: Editor & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Form Editor */}
        <div className={`${activeViewMode === 'preview' ? 'hidden lg:block' : ''} lg:col-span-7 space-y-6`}>
          <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <UserCheck className="w-5 h-5 text-[#0F4374] dark:text-sky-400" />
              <span>Identitas & Foto Kepala Sekolah</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Nama Lengkap & Gelar Akademik
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Drs. H. Suwarno, M.M."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  NIP / NIY Resmi
                </label>
                <input
                  type="text"
                  value={formData.nip}
                  onChange={(e) => handleChange('nip', e.target.value)}
                  placeholder="19680512 199403 1 004"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Jabatan Struktural
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Kepala SMK YAPEK Gombong"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Masa / Periode Jabatan
                </label>
                <input
                  type="text"
                  value={formData.period}
                  onChange={(e) => handleChange('period', e.target.value)}
                  placeholder="2020 - Sekarang"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
                />
              </div>
            </div>

            {/* Photo Profil Resmi Upload & Preview */}
            <div className="space-y-3 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#0F4374] dark:text-sky-400" />
                  <span>Foto Profil Resmi Kepala Sekolah</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300">
                    Upload Foto
                  </span>
                </label>
                <div className="text-[11px] text-slate-400">
                  Format JPG, PNG, WebP (Maks. 8MB)
                </div>
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />

              {/* Main Upload & Preview Area */}
              <div className="flex flex-col sm:flex-row items-center gap-5">
                {/* Avatar Preview Box */}
                <div className="relative group flex-shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-amber-400 dark:border-amber-500 shadow-md bg-slate-200 dark:bg-slate-700 relative">
                    {formData.avatar ? (
                      <img
                        src={formData.avatar}
                        alt="Foto Kepala Sekolah"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                        <Camera className="w-8 h-8 mb-1 opacity-50" />
                        <span className="text-[10px] font-bold">Belum Ada</span>
                      </div>
                    )}

                    {/* Overlay badge */}
                    <div className="absolute bottom-1 right-1 bg-slate-900/80 text-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs">
                      {formData.avatar.startsWith('data:') ? 'Lokal' : 'Aktif'}
                    </div>
                  </div>

                  {formData.avatar && (
                    <button
                      type="button"
                      onClick={() => handleChange('avatar', '')}
                      title="Hapus foto saat ini"
                      className="absolute -top-2 -right-2 p-1 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Dropzone & Action Buttons */}
                <div className="flex-1 w-full space-y-2.5">
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-3.5 sm:p-4 text-center cursor-pointer transition-all ${
                      isDragging
                        ? 'border-[#0F4374] bg-blue-50 dark:bg-blue-950/40 scale-[1.01]'
                        : 'border-slate-300 dark:border-slate-700 hover:border-[#0F4374] dark:hover:border-sky-400 bg-white dark:bg-slate-900/80'
                    }`}
                  >
                    <Upload className="w-5 h-5 mx-auto text-[#0F4374] dark:text-sky-400 mb-1" />
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Klik untuk Upload Foto dari Komputer / HP
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      atau seret & lepas berkas foto langsung ke kotak ini
                    </div>
                  </div>

                  {/* Secondary Quick Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-[#0F4374] hover:bg-[#154e85] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{formData.avatar ? 'Ganti Berkas Foto' : 'Pilih Foto'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowPresets(!showPresets)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                        showPresets
                          ? 'border-amber-400 bg-amber-50 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200'
                          : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Preset Foto Formal</span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${showPresets ? 'rotate-180' : ''}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-xs flex items-center gap-1 transition-colors"
                    >
                      <Link className="w-3.5 h-3.5" />
                      <span>{showUrlInput ? 'Tutup URL' : 'Opsi URL'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Preset Gallery Picker */}
              {showPresets && (
                <div className="p-3 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 space-y-2 mt-2">
                  <div className="text-[11px] font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Pilih Foto Model Formal Siap Pakai:</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {HEADMASTER_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          handleChange('avatar', preset.url);
                          setShowPresets(false);
                        }}
                        className={`group p-2 rounded-lg border text-left transition-all ${
                          formData.avatar === preset.url
                            ? 'border-amber-500 bg-amber-100 dark:bg-amber-900/50 shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 hover:border-amber-400 bg-white dark:bg-slate-800'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          referrerPolicy="no-referrer"
                          className="w-full h-14 object-cover object-top rounded-md mb-1.5"
                        />
                        <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                          {preset.label}
                        </div>
                        <div className="text-[9px] text-slate-500 dark:text-slate-400 line-clamp-1">
                          {preset.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* URL Input Collapsible */}
              {showUrlInput && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex gap-2">
                  <input
                    type="url"
                    value={formData.avatar}
                    onChange={(e) => handleChange('avatar', e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#0F4374]"
                  />
                  <button
                    type="button"
                    onClick={() => handleChange('avatar', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80')}
                    className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 whitespace-nowrap"
                  >
                    Foto Standar
                  </button>
                </div>
              )}
            </div>

            {/* Vision / Leadership Quote */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Visi Kepemimpinan / Tagline Utama
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.quote}
                  onChange={(e) => handleChange('quote', e.target.value)}
                  placeholder="Mempersiapkan Generasi Berkeahlian Nyata, Siap Kerja dan Berakhlakul Karimah"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
                />
              </div>
            </div>

            {/* Sambutan Content Sections */}
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 pt-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              <FileText className="w-5 h-5 text-amber-500" />
              <span>Naskah Sambutan Resmi</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Salam Pembuka
              </label>
              <input
                type="text"
                value={formData.speechGreeting}
                onChange={(e) => handleChange('speechGreeting', e.target.value)}
                placeholder="Assalamu’alaikum Warahmatullahi Wabarakatuh."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Paragraf Sambutan 1 (Tantangan & Arah Pendidikan Vokasi)
              </label>
              <textarea
                rows={3}
                value={formData.speechContent1}
                onChange={(e) => handleChange('speechContent1', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Paragraf Sambutan 2 (Fasilitas, Kurikulum & Komitmen BKK)
              </label>
              <textarea
                rows={3}
                value={formData.speechContent2}
                onChange={(e) => handleChange('speechContent2', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Kalimat Penutup & Doa Harapan
              </label>
              <textarea
                rows={2}
                value={formData.speechClosing}
                onChange={(e) => handleChange('speechClosing', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
              />
            </div>

            {/* Buttons */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleResetToDefault}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-slate-400" />
                <span>Reset Setelan Awal</span>
              </button>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#0F4374] hover:bg-[#0c365d] text-white font-bold text-sm shadow-md hover:shadow-lg flex items-center gap-2 transition-all"
              >
                <Save className="w-4 h-4 text-amber-400" />
                <span>Simpan Perubahan Sambutan</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Col: Live Front-End Preview Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#0F4374] dark:text-sky-400" />
              <span>Pratinjau Kartu Beranda (Live Preview)</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
              Realtime Sync
            </span>
          </div>

          {/* Actual Front-End Mock Card */}
          <div className="rounded-3xl border-2 border-dashed border-amber-500/40 p-6 sm:p-7 bg-white dark:bg-slate-900/90 shadow-md space-y-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-amber-500 shadow-md">
                  <img
                    src={formData.avatar}
                    alt={formData.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80';
                    }}
                  />
                </div>
                <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-[#0F4374] text-white text-[10px] font-bold shadow">
                  Kepala Sekolah
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {formData.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {formData.title}
                </p>
                {formData.nip && (
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    NIP: {formData.nip}
                  </p>
                )}
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold">
                  Periode: {formData.period}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-slate-700 dark:text-slate-300 text-xs leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
              <div className="inline-block px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/50 text-[#0F4374] dark:text-sky-400 text-[10px] font-bold uppercase tracking-wider">
                Sambutan Kepala Sekolah
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                "{formData.quote}"
              </h3>

              <p className="font-semibold text-slate-800 dark:text-slate-200">
                <em>{formData.speechGreeting}</em>
              </p>

              <p className="text-slate-600 dark:text-slate-300">
                {formData.speechContent1}
              </p>

              <p className="text-slate-600 dark:text-slate-300">
                {formData.speechContent2}
              </p>

              {formData.speechClosing && (
                <p className="text-slate-600 dark:text-slate-300 italic pt-1 border-t border-slate-100 dark:border-slate-800">
                  {formData.speechClosing}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
