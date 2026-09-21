import React, { useState } from 'react';
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
  Eye
} from 'lucide-react';
import { INITIAL_SCHOOL_IDENTITY } from '../../data/schoolData';

interface AdminIdentitySectionProps {
  schoolInfo: SchoolIdentity;
  onUpdateSchoolInfo: (updated: SchoolIdentity) => void;
  isDarkMode: boolean;
}

export const AdminIdentitySection: React.FC<AdminIdentitySectionProps> = ({
  schoolInfo,
  onUpdateSchoolInfo,
  isDarkMode
}) => {
  const [formData, setFormData] = useState<SchoolIdentity>({ ...schoolInfo });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [newMissionText, setNewMissionText] = useState('');

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
    }
  };

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
          <h2 className="text-2xl font-black">Kelola Identitas, Kontak & Statistik Sekolah</h2>
          <p className="text-xs text-blue-100">
            Perubahan nama sekolah, kontak, WhatsApp, Instagram, statistik alumni, dan visi misi otomatis diperbarui di navbar, beranda, dan footer.
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

      {/* Success alert */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <div className="font-semibold">
            Identitas Sekolah dan Statistik berhasil disimpan dan diperbarui di seluruh halaman website!
          </div>
        </div>
      )}

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
