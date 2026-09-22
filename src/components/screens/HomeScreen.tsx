import React from 'react';
import { SCHOOL_INFO, MAJORS, JOB_POSTINGS, INITIAL_HEADMASTER_PROFILE, INITIAL_ACTIVITY_GALLERY } from '../../data/schoolData';
import { ScreenTab, NewsItem, SchoolIdentity, HeadmasterProfile, AlumniTestimonial, ActivityGalleryItem } from '../../types';
import { AlumniTestimonialsSection } from '../AlumniTestimonialsSection';
import { InstagramFeedSection } from '../InstagramFeedSection';
import { ActivityGallerySection } from '../ActivityGallerySection';
import { HeaderHeadlineSlider } from '../HeaderHeadlineSlider';
import { SchoolLogo } from '../SchoolLogo';
import { 
  ArrowRight, 
  Award, 
  BookOpen, 
  Briefcase, 
  CheckCircle2, 
  ChevronRight, 
  GraduationCap, 
  Layers, 
  Sparkles, 
  Star, 
  Users, 
  ShieldCheck, 
  Building2, 
  Calendar, 
  ExternalLink,
  PlayCircle,
  Eye,
  TrendingUp,
  MapPin,
  Clock,
  Paperclip,
  Camera
} from 'lucide-react';

interface HomeScreenProps {
  onSelectTab: (tab: ScreenTab) => void;
  isDarkMode: boolean;
  onOpenAssistant: () => void;
  newsList: NewsItem[];
  schoolInfo?: SchoolIdentity;
  headmaster?: HeadmasterProfile;
  testimonials?: AlumniTestimonial[];
  galleryItems?: ActivityGalleryItem[];
  onSubmitTestimonial?: (newTestimonial: AlumniTestimonial) => void;
  onOpenArticle: (articleId: string) => void;
  onGoToAdmin: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ 
  onSelectTab, 
  isDarkMode, 
  onOpenAssistant,
  newsList,
  schoolInfo,
  headmaster,
  testimonials,
  galleryItems,
  onSubmitTestimonial,
  onOpenArticle,
  onGoToAdmin
}) => {
  const activeSchoolInfo = schoolInfo || SCHOOL_INFO;
  const activeHeadmaster = headmaster || INITIAL_HEADMASTER_PROFILE;
  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* 0. SLIDER OTOMATIS BERITA UTAMA / HEADLINE DI HEADER */}
      <section className="pt-4 sm:pt-6 max-w-7xl mx-auto px-4 sm:px-6">
        <HeaderHeadlineSlider
          newsList={newsList}
          onOpenArticle={onOpenArticle}
          isDarkMode={isDarkMode}
        />
      </section>

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-4 pb-12 lg:pt-8 lg:pb-18">
        {/* Decorative background gradients */}
        <div className="absolute inset-0 pointer-events-none -z-10 opacity-70">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-amber-400/15 blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Col: Main Copy */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Official School Identity Badge with Logo on Beranda */}
              <div className="inline-flex items-center gap-3.5 p-2 pr-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-sm backdrop-blur-sm">
                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-1 flex items-center justify-center flex-shrink-0 shadow-inner overflow-hidden">
                  {activeSchoolInfo.logo && activeSchoolInfo.logo !== '/logo-emblem.svg' ? (
                    <img
                      src={activeSchoolInfo.logo}
                      alt={activeSchoolInfo.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <SchoolLogo variant={isDarkMode ? 'dark' : 'light'} size="xs" showText={false} />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-black text-[#0F4374] dark:text-sky-400 uppercase tracking-wide leading-tight">
                    {activeSchoolInfo.name}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-1">
                    {activeSchoolInfo.motto || activeSchoolInfo.tagline}
                  </span>
                </div>
              </div>

              {/* Pill Badge */}
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold tracking-wide">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>PPDB TAHUN AJARAN 2026/2027 TELAH DIBUKA</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-slate-900 dark:text-white">
                Mencetak Insan Vokasi{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F4374] via-blue-600 to-[#EA8B00] dark:from-sky-400 dark:to-amber-400">
                  Unggul, Berkarakter
                </span>{' '}
                & Siap Kerja Global
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Selamat datang di portal resmi <strong>SMK YAPEK GOMBONG</strong>. Lembaga pendidikan kejuruan berkualitas di Kabupaten Kebumen yang mengintegrasikan kurikulum industri, penguatan budi pekerti, dan penyaluran kerja teruji sejak 1967.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  id="hero-daftar-ppdb"
                  onClick={() => onSelectTab('ppdb')}
                  className="px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base bg-gradient-to-r from-[#0F4374] to-[#15538e] hover:from-[#0d3b66] hover:to-[#0F4374] text-white shadow-lg shadow-blue-900/20 hover:shadow-xl transition-all flex items-center gap-2.5 active:scale-95"
                >
                  <GraduationCap className="w-5 h-5 text-amber-400" />
                  <span>Daftar PPDB Online</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="hero-explore-jurusan"
                  onClick={() => onSelectTab('majors')}
                  className="px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base border-2 border-slate-300 dark:border-slate-700 hover:border-[#0F4374] dark:hover:border-sky-400 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all flex items-center gap-2"
                >
                  <BookOpen className="w-5 h-5 text-[#0F4374] dark:text-sky-400" />
                  <span>Lihat 6 Jurusan</span>
                </button>

                <button
                  id="hero-ask-ai"
                  onClick={onOpenAssistant}
                  className="px-4 py-3.5 rounded-xl font-semibold text-xs sm:text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 hover:bg-amber-100 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Tanya Info Sekolah</span>
                </button>
              </div>

              {/* Trust markers */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Terakreditasi A</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Sertifikasi BNSP</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Bursa Kerja Khusus (BKK)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Beasiswa KIP / Prestasi</span>
                </div>
              </div>
            </div>

            {/* Right Col: Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Featured Card */}
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 relative">
                  <div className="relative h-72 sm:h-80 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80"
                      alt="Kegiatan Belajar Siswa SMK YAPEK Gombong"
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                    
                    {/* Badge on Image with School Logo */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white/95 dark:bg-slate-900/95 p-1 shadow-md border border-white/60 dark:border-slate-700/60 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                        {activeSchoolInfo.logo && activeSchoolInfo.logo !== '/logo-emblem.svg' ? (
                          <img
                            src={activeSchoolInfo.logo}
                            alt="Logo Sekolah"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <SchoolLogo variant="light" size="xs" showText={false} />
                        )}
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0F4374]/95 text-white shadow-md border border-blue-400/30 backdrop-blur-sm">
                        Pendidikan Vokasi Unggulan
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="text-xs uppercase tracking-wider font-semibold text-amber-400">Kampus Berkualitas</p>
                      <h3 className="text-lg font-bold">SMK YAPEK Gombong Kebumen</h3>
                      <p className="text-xs text-slate-300">Jl. Merbabu No. 64 Wero, Gombong</p>
                    </div>
                  </div>

                  {/* Quick stats panel below photo */}
                  <div className="p-5 grid grid-cols-3 gap-2 text-center bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="text-xl sm:text-2xl font-black text-[#0F4374] dark:text-sky-400">{activeSchoolInfo.stats.students}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Siswa Aktif</div>
                    </div>
                    <div className="border-x border-slate-200 dark:border-slate-800">
                      <div className="text-xl sm:text-2xl font-black text-[#EA8B00]">{activeSchoolInfo.stats.industryPartners}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Mitra Industri</div>
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">{activeSchoolInfo.stats.jobPlacementRate}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Serapan Lulusan</div>
                    </div>
                  </div>
                </div>

                {/* Floating pill: Teaching Factory */}
                <div className="hidden sm:flex absolute -bottom-5 -left-6 bg-white dark:bg-slate-800 p-3.5 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-white">Teaching Factory Ready</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Pendidikan Berbasis Industri</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS & REPUTATION STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-[#0F4374] to-[#113a61] text-white shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 tracking-tight">1967</div>
              <p className="text-xs sm:text-sm text-blue-100 font-medium">Didirikan Sejak</p>
              <p className="text-[11px] text-blue-300">58+ Tahun Pengabdian</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{SCHOOL_INFO.stats.alumni}</div>
              <p className="text-xs sm:text-sm text-blue-100 font-medium">Alumni Sukses</p>
              <p className="text-[11px] text-blue-300">Tersebar Nasional & Global</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 tracking-tight">{SCHOOL_INFO.stats.industryPartners}</div>
              <p className="text-xs sm:text-sm text-blue-100 font-medium">Kerja Sama DU/DI</p>
              <p className="text-[11px] text-blue-300">BUMN, Multinasional & Swasta</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight">Terakreditasi A</div>
              <p className="text-xs sm:text-sm text-blue-100 font-medium">Predikat Unggul</p>
              <p className="text-[11px] text-blue-300">Penilaian BAN-SM Nasional</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SAMBUTAN KEPALA SEKOLAH & PROFIL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 text-center lg:text-left flex flex-col items-center lg:items-start">
              <div className="relative mb-4">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-4 border-amber-500/80 shadow-md">
                  <img
                    src={activeHeadmaster.avatar}
                    alt={activeHeadmaster.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80';
                    }}
                  />
                </div>
                <span className="absolute -bottom-2 -right-2 px-3 py-0.5 rounded-full bg-[#0F4374] text-white text-[10px] font-bold shadow">
                  Kepala Sekolah
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">{activeHeadmaster.name}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">{activeHeadmaster.title}</p>
              {activeHeadmaster.nip && (
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">NIP: {activeHeadmaster.nip}</p>
              )}
            </div>

            <div className="lg:col-span-8 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
              <div className="inline-block px-3 py-1 rounded-md bg-blue-50 dark:bg-blue-950/50 text-[#0F4374] dark:text-sky-400 text-xs font-bold uppercase tracking-wider">
                Sambutan Kepala Sekolah
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                "{activeHeadmaster.quote}"
              </h3>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                <em>{activeHeadmaster.speechGreeting}</em>
              </p>
              <p className="text-sm">
                {activeHeadmaster.speechContent1}
              </p>
              <p className="text-sm">
                {activeHeadmaster.speechContent2}
              </p>
              {activeHeadmaster.speechClosing && (
                <p className="text-sm italic pt-1 text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
                  {activeHeadmaster.speechClosing}
                </p>
              )}
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => onSelectTab('majors')}
                  className="text-xs font-bold text-[#0F4374] dark:text-sky-400 hover:text-amber-500 inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Kenali Lebih Lanjut Program Unggulan Kami</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PROGRAM KEAHLIAN / JURUSAN GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
            Pilihan Kompetensi Keahlian
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            6 Program Keahlian Berkualitas
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Didesain khusus selaras dengan Standar Kompetensi Kerja Nasional Indonesia (SKKNI) dan kebutuhan mitra industri modern.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MAJORS.map((major) => (
            <div
              key={major.id}
              className="group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image Banner with Badge */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={major.image}
                    alt={major.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                  
                  {/* Code Pill */}
                  <div className="absolute top-3 left-3">
                    <span 
                      className="px-3 py-1 rounded-lg text-xs font-black text-white shadow-md tracking-wider"
                      style={{ backgroundColor: major.color }}
                    >
                      {major.code}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[11px] font-semibold text-amber-300">Akreditasi {major.accreditation}</span>
                    <h3 className="text-lg font-bold leading-snug">{major.name}</h3>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-3">
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {major.shortDesc}
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Fokus Keahlian Utama:
                    </div>
                    <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                      {major.skills.slice(0, 3).map((skill, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          <span className="truncate">{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => onSelectTab('majors')}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-[#0F4374] hover:text-white dark:hover:bg-[#0F4374] transition-all flex items-center justify-center gap-2 text-slate-800 dark:text-slate-200"
                >
                  <span>Detail Kurikulum & Karier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PPDB HIGHLIGHT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-slate-950 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="px-3 py-1 rounded-full bg-slate-950 text-white font-bold text-xs uppercase tracking-wider">
                Penerimaan Peserta Didik Baru
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Bergabunglah Bersama SMK YAPEK Gombong Tahun Ajaran 2026/2027
              </h2>
              <p className="text-sm sm:text-base text-slate-900/90 leading-relaxed font-medium">
                Pendaftaran dapat dilakukan secara 100% online dari rumah atau langsung datang ke posko pendaftaran di kampus sekolah. Dapatkan beasiswa bebas biaya masuk bagi peraih peringkat 1-3 di SMP/MTs dan pemegang Kartu Indonesia Pintar (KIP).
              </p>
              
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onSelectTab('ppdb')}
                  className="px-6 py-3 rounded-xl bg-slate-950 text-white font-bold text-sm hover:bg-slate-900 transition-all flex items-center gap-2 shadow-lg active:scale-95"
                >
                  <GraduationCap className="w-4 h-4 text-amber-400" />
                  <span>Isi Formulir Pendaftaran Sekarang</span>
                </button>
                <button
                  onClick={() => onSelectTab('ppdb')}
                  className="px-5 py-3 rounded-xl bg-white/90 text-slate-900 font-bold text-sm hover:bg-white transition-all"
                >
                  <span>Cek Persyaratan & Alur Seleksi</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white/90 dark:bg-slate-900/90 p-6 rounded-2xl shadow-lg space-y-3">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Jadwal Gelombang 1</div>
              <div className="text-xl font-black text-slate-900 dark:text-white">Januari - Mei 2026</div>
              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex justify-between">
                  <span>Jalur Prestasi:</span>
                  <span className="font-semibold text-emerald-600">Bebas Tes Tulis</span>
                </div>
                <div className="flex justify-between">
                  <span>Jalur Reguler:</span>
                  <span className="font-semibold">Tes Minat Bakat</span>
                </div>
                <div className="flex justify-between">
                  <span>Pakaian & Seragam:</span>
                  <span className="font-semibold text-amber-600">Diskon Khusus</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BERITA & PRESTASI TERKINI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Informasi Terkini & Publikasi Resmi
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Berita, Kegiatan & Prestasi
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onGoToAdmin}
              className="text-xs font-bold text-[#0F4374] dark:text-sky-400 hover:text-amber-500 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Kelola di Backend Admin</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {newsList.map((item) => (
            <article
              key={item.id}
              onClick={() => onOpenArticle(item.id)}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between hover:shadow-lg hover:border-amber-500/60 dark:hover:border-amber-500/60 transition-all"
            >
              <div>
                <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0F4374] text-white shadow-sm">
                    {item.category}
                  </span>
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-950/75 text-amber-300 backdrop-blur flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{item.views.toLocaleString('id-ID')}</span>
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{item.date}</span>
                    </div>
                    <span className="font-semibold text-slate-500 dark:text-slate-400">
                      {item.author}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-[#0F4374] dark:group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>

                  {/* Badges for Attachments & Photos */}
                  {((item.attachments && item.attachments.length > 0) || (item.contentImages && item.contentImages.length > 0)) && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {item.attachments && item.attachments.length > 0 && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-200/80 dark:border-amber-800/80">
                          <Paperclip className="w-2.5 h-2.5" />
                          <span>{item.attachments.length} Berkas (PDF/DOC)</span>
                        </span>
                      )}
                      {item.contentImages && item.contentImages.length > 0 && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/50 px-2 py-0.5 rounded-md border border-sky-200/80 dark:border-sky-800/80">
                          <Camera className="w-2.5 h-2.5" />
                          <span>{item.contentImages.length} Foto</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-2 flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Baca Selengkapnya</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Eye className="w-3 h-3 text-slate-400" />
                  <span>{item.views.toLocaleString('id-ID')} pembaca</span>
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 7. BURSA KERJA KHUSUS (BKK YAPEK GOMBONG) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-8 sm:p-10 shadow-sm space-y-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="space-y-2 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider">
                <Briefcase className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Bursa Kerja Khusus (BKK YAPEK)</span>
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white">
                Penyaluran Kerja & Magang Industri Terpercaya
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Unit resmi sekolah yang menjembatani lulusan dan peserta didik SMK YAPEK Gombong secara langsung dengan 65+ mitra Dunia Usaha & Dunia Industri (DU/DI) terkemuka skala regional dan nasional.
              </p>
            </div>

            <button
              onClick={() => onSelectTab('bkk')}
              className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-[#0F4374] hover:bg-blue-900 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 flex-shrink-0"
            >
              <span>Buka Portal BKK Lengkap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-sm">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">89.4%</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Serapan Kerja & Wirausaha Lulusan</div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold flex-shrink-0 shadow-sm">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">{SCHOOL_INFO.stats.industryPartners}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Perusahaan Mitra Industri Resmi</div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#0F4374] text-white flex items-center justify-center font-bold flex-shrink-0 shadow-sm">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">18.200+</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Jejaring Alumni Aktif Bekerja</div>
              </div>
            </div>
          </div>

          {/* Mitra Industri Logos Ribbon */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Mitra Kerja Sama Industri Unggulan DU/DI:
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {[
                'PT Astra Honda Motor',
                'PT Telkom Akses',
                'PT Sumber Alfaria Trijaya (Alfamart)',
                'PT Paragon Technology (Wardah)',
                'Auto2000',
                'Bank Mandiri Mitra',
                'PT Indomarco Prismatama',
                'Rudy Hadisuwarno Group'
              ].map((partner, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  {partner}
                </span>
              ))}
            </div>
          </div>

          {/* Featured Active Vacancies */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-4 bg-emerald-500 rounded-sm"></span>
                <span>Lowongan Kerja Terbaru (Campus Hiring Aktif)</span>
              </h3>
              <button
                onClick={() => onSelectTab('bkk')}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua ({JOB_POSTINGS.length} Lowongan)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {JOB_POSTINGS.slice(0, 3).map((job) => (
                <div
                  key={job.id}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                        {job.type}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {job.location}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                      {job.title}
                    </h4>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {job.company}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {job.majorsRequired.map((m, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-950/50 text-[#0F4374] dark:text-sky-300 border border-blue-200 dark:border-blue-900"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400">Estimasi Gaji:</div>
                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{job.salaryRange.split('-')[0]}</div>
                    </div>
                    <button
                      onClick={() => onSelectTab('bkk')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      <span>Lamar via BKK</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. GALERI KEGIATAN & POTRET DOKUMENTASI SEKOLAH */}
      <ActivityGallerySection
        galleryItems={galleryItems || INITIAL_ACTIVITY_GALLERY}
        isDarkMode={isDarkMode}
        onGoToAdmin={onGoToAdmin}
      />

      {/* 9. TESTIMONI ALUMNI BERDASARKAN TAHUN KELULUSAN */}
      <AlumniTestimonialsSection 
        isDarkMode={isDarkMode} 
        testimonials={testimonials} 
        onSubmitTestimonial={onSubmitTestimonial}
      />

      {/* 10. FEED INSTAGRAM RESMI @smkyapekgombong OTOMATIS */}
      <InstagramFeedSection isDarkMode={isDarkMode} />
    </div>
  );
};
