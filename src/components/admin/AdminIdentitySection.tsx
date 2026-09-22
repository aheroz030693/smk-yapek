import React, { useState, useRef } from 'react';
import { SchoolIdentity } from '../../types';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Instagram, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Users, 
  Briefcase, 
  Award, 
  GraduationCap, 
  Plus, 
  Trash2,
  Sparkles,
  Eye,
  Upload,
  Image as ImageIcon,
  Check,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { INITIAL_SCHOOL_IDENTITY } from '../../data/schoolData';
import { SchoolLogo } from '../SchoolLogo';

interface AdminIdentitySectionProps {
  schoolInfo: SchoolIdentity;
  onUpdateSchoolInfo: (updated: SchoolIdentity) => void;
  onNavigateToTab?: (tab: any) => void;
  isDarkMode: boolean;
}

export const AdminIdentitySection: React.FC<AdminIdentitySectionProps> = ({
  schoolInfo,
  onUpdateSchoolInfo,
  onNavigateToTab,
  isDarkMode
}) => {
  const [formData, setFormData] = useState<SchoolIdentity>({ ...schoolInfo });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [logoSuccessToast, setLogoSuccessToast] = useState(false);
  const [newMissionText, setNewMissionText] = useState('');
  
  // Logo upload & drag-drop state
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [logoUrlInput, setLogoUrlInput] = useState(formData.logo || '');
  const [showUrlField, setShowUrlField] = useState(false);

  const handleChange = (field: keyof SchoolIdentity, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStatChange = (statField: keyof SchoolIdentity['stats'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        [statField]: value
      }
    }));
  };

  const handleAddMission = () => {
    if (!newMissionText.trim()) return;
    setFormData((prev) => ({
      ...prev,
      missions: [...prev.missions, newMissionText.trim()]
    }));
    setNewMissionText('');
  };

  const handleRemoveMission = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      missions: prev.missions.filter((_, i) => i !== index)
    }));
  };

  // Logo file upload handler
  const processLogoFile = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar yang valid (PNG, JPG, SVG, atau WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal adalah 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setFormData((prev) => {
          const updated = { ...prev, logo: dataUrl };
          onUpdateSchoolInfo(updated);
          return updated;
        });
        setLogoUrlInput(dataUrl);
        setLogoSuccessToast(true);
        setTimeout(() => setLogoSuccessToast(false), 3500);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processLogoFile(e.target.files[0]);
    }
  };

  const handleLogoDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingLogo(true);
  };

  const handleLogoDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingLogo(false);
  };

  const handleLogoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingLogo(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processLogoFile(e.dataTransfer.files[0]);
    }
  };

  const handleApplyLogoUrl = () => {
    if (!logoUrlInput.trim()) return;
    setFormData((prev) => {
      const updated = { ...prev, logo: logoUrlInput.trim() };
      onUpdateSchoolInfo(updated);
      return updated;
    });
    setLogoSuccessToast(true);
    setTimeout(() => setLogoSuccessToast(false), 3500);
  };

  const handleResetLogoToDefault = () => {
    const defaultLogo = '/logo-emblem.svg';
    setFormData((prev) => {
      const updated = { ...prev, logo: defaultLogo };
      onUpdateSchoolInfo(updated);
      return updated;
    });
    setLogoUrlInput(defaultLogo);
    setLogoSuccessToast(true);
    setTimeout(() => setLogoSuccessToast(false), 3500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSchoolInfo(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const handleReset = () => {
    if (window.confirm('Reset identitas sekolah kembali ke data bawaan?')) {
      setFormData({ ...INITIAL_SCHOOL_IDENTITY });
      onUpdateSchoolInfo({ ...INITIAL_SCHOOL_IDENTITY });
      setLogoUrlInput(INITIAL_SCHOOL_IDENTITY.logo || '/logo-emblem.svg');
    }
  };

  // Sample preset logos
  const PRESET_LOGOS = [
    {
      id: 'default-svg',
      title: 'Lambang Asli Vektor (Default)',
      desc: 'Lambang resmi SMK YAPEK Gombong',
      url: '/logo-emblem.svg'
    },
    {
      id: 'emblem-gold',
      title: 'Emblem Prestasi Vokasi Emas',
      desc: 'Badge kejuruan dengan ornamen emas',
      url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 'emblem-blue',
      title: 'Insignia Digital Biru Klasik',
      desc: 'Logo lingkaran akademis biru',
      url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=300&q=80'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#0F4374] to-[#17528a] text-white shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
              Identitas & Branding Sekolah
            </span>
            <span className="text-xs text-blue-200">Terhubung ke Seluruh Menu Front-End</span>
          </div>
          <h2 className="text-2xl font-black">Kelola Identitas, Logo & Statistik Sekolah</h2>
          <p className="text-xs text-blue-100">
            Unggah logo resmi sekolah untuk ditampilkan di beranda, header navigasi, serta kelola nama sekolah, kontak, WhatsApp, dan statistik.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-4 h-4 text-amber-300" />
          <span>Reset Default</span>
        </button>
      </div>

      {/* Success alert for whole form */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <div className="font-semibold">
            Identitas Sekolah, Logo, dan Statistik berhasil disimpan dan diperbarui di seluruh halaman website!
          </div>
        </div>
      )}

      {/* Success alert specifically for Logo Update */}
      {logoSuccessToast && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-sm flex items-center justify-between gap-3 shadow-sm animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <div>
              <div className="font-bold">Logo Sekolah Berhasil Diperbarui & Ditayangkan!</div>
              <div className="text-xs text-amber-700 dark:text-amber-300">
                Logo baru kini aktif pada bagian Header Navigasi, Banner Utama Beranda, dan Footer website.
              </div>
            </div>
          </div>
          {onNavigateToTab && (
            <button
              type="button"
              onClick={() => onNavigateToTab('home')}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <span>Lihat di Beranda</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* SECTION 0: UPLOAD & KELOLA LOGO SEKOLAH (BERANDA & NAVBAR) */}
      <div className="p-6 sm:p-8 rounded-3xl border-2 border-amber-300/80 dark:border-amber-500/30 bg-white dark:bg-slate-900 shadow-md space-y-6 relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-sm">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Upload Logo Sekolah untuk Beranda & Header</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/40">
                  Tampil di Beranda
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Logo yang diunggah otomatis tayang di badge utama Beranda, bilah Navigasi atas, dan Footer.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {formData.logo && formData.logo !== '/logo-emblem.svg' && (
              <button
                type="button"
                onClick={handleResetLogoToDefault}
                className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Kembalikan ke lambang default SVG"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Logo Asli</span>
              </button>
            )}
            {onNavigateToTab && (
              <button
                type="button"
                onClick={() => onNavigateToTab('home')}
                className="px-3.5 py-1.5 rounded-xl bg-[#0F4374] hover:bg-[#0d3b66] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>Cek di Beranda</span>
              </button>
            )}
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.svg,.webp,image/png,image/jpeg,image/svg+xml,image/webp"
          onChange={handleLogoFileChange}
          className="hidden"
        />

        {/* Logo Configuration Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left / Center: Upload Dropzone & Controls */}
          <div className="lg:col-span-7 space-y-4">
            {/* Interactive Drag & Drop Area */}
            <div
              onDragOver={handleLogoDragOver}
              onDragLeave={handleLogoDragLeave}
              onDrop={handleLogoDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 relative ${
                isDraggingLogo
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 scale-[1.01] shadow-inner'
                  : 'border-slate-300 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-400 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-amber-50/30'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner">
                <Upload className="w-7 h-7" />
              </div>

              <div className="space-y-1 text-center">
                <div className="text-sm font-black text-slate-900 dark:text-white">
                  Klik untuk Memilih File Logo atau Seret ke Sini
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                  Mendukung format <strong>PNG transparan, JPG, SVG,</strong> dan <strong>WebP</strong> (Maks. 5 MB).
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  Rasio Rekomendasi: 1:1 (Kotak / Lingkaran)
                </span>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  Min. 200 x 200 piksel
                </span>
              </div>
            </div>

            {/* URL Input Toggle & Field */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowUrlField(!showUrlField)}
                className="text-xs font-bold text-[#0F4374] dark:text-sky-400 hover:underline flex items-center gap-1.5"
              >
                <span>{showUrlField ? '▾ Sembunyikan Input URL Gambar' : '▸ Atau Masukkan Tautan / URL Gambar Logo Langsung'}</span>
              </button>

              {showUrlField && (
                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    URL Logo Eksternal (HTTPS)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://domain-anda.com/logo.png"
                      value={logoUrlInput}
                      onChange={(e) => setLogoUrlInput(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={handleApplyLogoUrl}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm transition-all"
                    >
                      Terapkan URL
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Preset Logos Section */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Pilihan Contoh / Preset Cepat Logo:</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {PRESET_LOGOS.map((preset) => {
                  const isSelected = formData.logo === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => {
                          const updated = { ...prev, logo: preset.url };
                          onUpdateSchoolInfo(updated);
                          return updated;
                        });
                        setLogoUrlInput(preset.url);
                        setLogoSuccessToast(true);
                        setTimeout(() => setLogoSuccessToast(false), 3500);
                      }}
                      className={`p-2.5 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10 dark:bg-amber-500/15 shadow-sm ring-2 ring-amber-400/40'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {preset.url === '/logo-emblem.svg' ? (
                          <SchoolLogo variant="light" size="xs" showText={false} />
                        ) : (
                          <img src={preset.url} alt={preset.title} className="w-full h-full object-contain" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                          {preset.title}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {preset.desc}
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-amber-500 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Live Multi-Context Preview Simulator */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 sm:p-5 rounded-3xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                  <Eye className="w-3.5 h-3.5 text-amber-500" />
                  <span>Simulasi Tampilan Logo</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  Live Preview
                </span>
              </div>

              {/* Preview 1: Header Navbar Simulation */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  1. Tampilan di Bilah Navigasi (Header Navbar):
                </span>
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <SchoolLogo
                      variant={isDarkMode ? 'dark' : 'light'}
                      size="sm"
                      customLogoUrl={formData.logo}
                    />
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-[10px] font-semibold text-slate-400">
                    <span>Beranda</span>
                    <span>Jurusan</span>
                    <span>PPDB</span>
                  </div>
                </div>
              </div>

              {/* Preview 2: Hero Section Badge Simulation (Beranda) */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  2. Tampilan di Badge Utama Beranda (Hero Section):
                </span>
                <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-50/80 to-amber-50/60 dark:from-slate-900 dark:to-slate-850 border border-slate-200/80 dark:border-slate-700 shadow-sm">
                  <div className="inline-flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-1 flex items-center justify-center flex-shrink-0 shadow-inner overflow-hidden">
                      {formData.logo && formData.logo !== '/logo-emblem.svg' ? (
                        <img
                          src={formData.logo}
                          alt="Preview Logo"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <SchoolLogo variant={isDarkMode ? 'dark' : 'light'} size="xs" showText={false} />
                      )}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-black text-[#0F4374] dark:text-sky-400 uppercase tracking-wide leading-tight">
                        {formData.name || 'SMK YAPEK GOMBONG'}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium line-clamp-1">
                        {formData.motto || formData.tagline}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview 3: Contrast Check (Light vs Dark background) */}
              <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-semibold">
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-slate-800 flex flex-col items-center gap-1.5">
                  <span className="text-[9px] text-slate-400">Latar Terang</span>
                  <div className="w-10 h-10 flex items-center justify-center">
                    {formData.logo && formData.logo !== '/logo-emblem.svg' ? (
                      <img src={formData.logo} alt="Light" className="w-full h-full object-contain" />
                    ) : (
                      <SchoolLogo variant="light" size="xs" showText={false} />
                    )}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 flex flex-col items-center gap-1.5">
                  <span className="text-[9px] text-slate-400">Latar Gelap</span>
                  <div className="w-10 h-10 flex items-center justify-center">
                    {formData.logo && formData.logo !== '/logo-emblem.svg' ? (
                      <img src={formData.logo} alt="Dark" className="w-full h-full object-contain" />
                    ) : (
                      <SchoolLogo variant="dark" size="xs" showText={false} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Profil & Legalitas */}
        <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Building2 className="w-5 h-5 text-[#0F4374] dark:text-sky-400" />
            <span>Profil Utama & Legalitas Lembaga</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Nama Resmi Sekolah
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Nama Singkat / Panggilan
              </label>
              <input
                type="text"
                value={formData.shortName}
                onChange={(e) => handleChange('shortName', e.target.value)}
                placeholder="SMK YAGO"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                NPSN Resmi Kemdikbud
              </label>
              <input
                type="text"
                value={formData.npsn}
                onChange={(e) => handleChange('npsn', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Status Akreditasi (BAN-SM)
              </label>
              <input
                type="text"
                value={formData.accreditation}
                onChange={(e) => handleChange('accreditation', e.target.value)}
                placeholder="A (Unggul)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Tahun Berdiri
              </label>
              <input
                type="text"
                value={formData.establishedYear}
                onChange={(e) => handleChange('establishedYear', e.target.value)}
                placeholder="1967"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Slogan / Motto Lembaga
              </label>
              <input
                type="text"
                value={formData.motto}
                onChange={(e) => handleChange('motto', e.target.value)}
                placeholder="Lembaga Pendidikan Kejuruan Berkualitas"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Tagline Karakter Siswa
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                placeholder="Beriman, Kompeten, Kreatif, Mandiri & Berdaya Saing Global"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Kontak, Alamat & Medsos */}
        <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <MapPin className="w-5 h-5 text-rose-500" />
            <span>Alamat Kampus, Layanan Kontak & Media Sosial Resmi</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Alamat Kampus Lengkap
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Telepon Kantor Utama
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="(0287) 472316"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                No. WhatsApp Resmi (PPDB & Humas)
              </label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                placeholder="+6281226789020"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Sekolah
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="smkyapekgombong@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Alamat Website Resmi
              </label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="https://smkyapekgombong.sch.id"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Akun Instagram Handle
              </label>
              <input
                type="text"
                value={formData.instagramHandle}
                onChange={(e) => handleChange('instagramHandle', e.target.value)}
                placeholder="@smkyapekgombong"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Tautan Profil Instagram
              </label>
              <input
                type="url"
                value={formData.instagram}
                onChange={(e) => handleChange('instagram', e.target.value)}
                placeholder="https://www.instagram.com/smkyapekgombong/"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Statistik Utama Beranda */}
        <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Statistik Utama (Banner Angka di Beranda)</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Jumlah Siswa
              </label>
              <input
                type="text"
                value={formData.stats.students}
                onChange={(e) => handleStatChange('students', e.target.value)}
                placeholder="1.450+"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Alumni Terserap
              </label>
              <input
                type="text"
                value={formData.stats.alumni}
                onChange={(e) => handleStatChange('alumni', e.target.value)}
                placeholder="18.200+"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mitra DU/DI
              </label>
              <input
                type="text"
                value={formData.stats.industryPartners}
                onChange={(e) => handleStatChange('industryPartners', e.target.value)}
                placeholder="65+"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Penyaluran Kerja
              </label>
              <input
                type="text"
                value={formData.stats.jobPlacementRate}
                onChange={(e) => handleStatChange('jobPlacementRate', e.target.value)}
                placeholder="89.4%"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Guru & Tendik
              </label>
              <input
                type="text"
                value={formData.stats.teachers}
                onChange={(e) => handleStatChange('teachers', e.target.value)}
                placeholder="78"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Visi & Misi */}
        <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span>Visi & Misi SMK YAPEK Gombong</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Visi Lembaga
            </label>
            <textarea
              rows={2}
              value={formData.vision}
              onChange={(e) => handleChange('vision', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Butir-Butir Misi Sekolah:
            </label>

            <div className="space-y-2">
              {formData.missions.map((m, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs"
                >
                  <span className="w-5 h-5 rounded-full bg-[#0F4374] text-white font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="flex-1 text-slate-800 dark:text-slate-200">{m}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMission(idx)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Mission Row */}
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={newMissionText}
                onChange={(e) => setNewMissionText(e.target.value)}
                placeholder="Ketik butir misi baru..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddMission}
                className="px-4 py-2 rounded-xl bg-[#0F4374] hover:bg-[#0c365d] text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Misi</span>
              </button>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-xl bg-[#0F4374] hover:bg-[#0c365d] text-white font-bold text-sm shadow-md hover:shadow-lg flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>Simpan Seluruh Data Identitas & Statistik</span>
          </button>
        </div>
      </form>
    </div>
  );
};
