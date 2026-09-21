import React, { useState, useMemo, useEffect } from 'react';
import { ALUMNI_TESTIMONIALS } from '../data/schoolData';
import { AlumniTestimonial } from '../types';
import { 
  GraduationCap, 
  Briefcase, 
  Building2, 
  Star, 
  Quote, 
  CheckCircle2, 
  Filter, 
  PlusCircle, 
  X, 
  Send, 
  Search,
  Sparkles,
  HeartHandshake,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play
} from 'lucide-react';

interface AlumniTestimonialsSectionProps {
  isDarkMode: boolean;
  testimonials?: AlumniTestimonial[];
  onSubmitTestimonial?: (newTestimonial: AlumniTestimonial) => void;
}

const ITEMS_PER_VIEW = 3;

export const AlumniTestimonialsSection: React.FC<AlumniTestimonialsSectionProps> = ({
  isDarkMode,
  testimonials: externalTestimonials,
  onSubmitTestimonial
}) => {
  const [internalTestimonials, setInternalTestimonials] = useState<AlumniTestimonial[]>(ALUMNI_TESTIMONIALS);
  const activeTestimonials = externalTestimonials || internalTestimonials;

  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [selectedMajor, setSelectedMajor] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [submitSuccessMessage, setSubmitSuccessMessage] = useState<string | null>(null);

  // Slider state
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(false);

  // New testimonial form state
  const [formData, setFormData] = useState({
    name: '',
    graduationYear: 2025,
    major: 'Teknik Komputer & Jaringan (TKJ)',
    role: '',
    company: '',
    content: '',
    highlight: '',
    rating: 5
  });

  // Extract distinct years sorted descending (from approved/live testimonials)
  const availableYears = useMemo(() => {
    const approvedOnly = activeTestimonials.filter(t => t.status === 'approved' || !t.status);
    const years = Array.from(new Set(approvedOnly.map(t => t.graduationYear)));
    return years.sort((a, b) => b - a);
  }, [activeTestimonials]);

  // Extract distinct major categories
  const majorCategories = [
    { id: 'all', label: 'Semua Jurusan' },
    { id: 'TKJ', label: 'TKJ' },
    { id: 'AKL', label: 'AKL' },
    { id: 'TKR', label: 'TKR' },
    { id: 'TKKR', label: 'TKKR (Kecantikan)' },
    { id: 'BDP', label: 'BDP (Pemasaran)' },
    { id: 'MP', label: 'MP / OTKP' },
  ];

  // Filtered testimonials: MUST be approved/shared to appear on the public front-end
  const filteredTestimonials = useMemo(() => {
    return activeTestimonials
      .filter(item => item.status === 'approved' || !item.status)
      .filter(item => {
        const matchYear = selectedYear === 'all' || item.graduationYear === selectedYear;
        const matchMajor = selectedMajor === 'all' || item.major.toUpperCase().includes(selectedMajor.toUpperCase());
        const matchQuery = !searchQuery.trim() || 
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.content.toLowerCase().includes(searchQuery.toLowerCase());
        return matchYear && matchMajor && matchQuery;
      });
  }, [activeTestimonials, selectedYear, selectedMajor, searchQuery]);

  // Calculate total pages for 3 items per view
  const totalPages = Math.max(1, Math.ceil(filteredTestimonials.length / ITEMS_PER_VIEW));
  const safeCurrentPage = Math.min(currentPage, totalPages - 1);

  // Reset to first slide on filter change
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedYear, selectedMajor, searchQuery]);

  // Autoplay effect
  useEffect(() => {
    if (!isAutoPlay || totalPages <= 1) return;
    const interval = setInterval(() => {
      setCurrentPage(prev => (prev + 1 < totalPages ? prev + 1 : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlay, totalPages]);

  // Next / Prev slide handlers
  const handleNext = () => {
    setCurrentPage(prev => (prev + 1 < totalPages ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setCurrentPage(prev => (prev - 1 >= 0 ? prev - 1 : totalPages - 1));
  };

  // Slice 3 items for current view
  const visibleTestimonials = useMemo(() => {
    const startIndex = safeCurrentPage * ITEMS_PER_VIEW;
    return filteredTestimonials.slice(startIndex, startIndex + ITEMS_PER_VIEW);
  }, [filteredTestimonials, safeCurrentPage]);

  const startIndex = safeCurrentPage * ITEMS_PER_VIEW;
  const endIndex = Math.min(startIndex + ITEMS_PER_VIEW, filteredTestimonials.length);

  const handleSubmitTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role.trim() || !formData.content.trim()) return;

    const newTestimonial: AlumniTestimonial = {
      id: `testi-${Date.now()}`,
      name: formData.name.trim(),
      graduationYear: Number(formData.graduationYear),
      major: formData.major,
      role: formData.role.trim(),
      company: formData.company.trim() || 'Wirausaha / Profesional',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      content: formData.content.trim(),
      rating: Number(formData.rating),
      highlight: formData.highlight.trim() || 'Verifikasi Tracer Study Alumni',
      status: 'pending',
      submittedAt: 'Baru saja'
    };

    if (onSubmitTestimonial) {
      onSubmitTestimonial(newTestimonial);
    } else {
      setInternalTestimonials(prev => [newTestimonial, ...prev]);
    }

    setCurrentPage(0);
    setIsSubmitModalOpen(false);
    setSubmitSuccessMessage(
      `Alhamdulillah, terima kasih kak ${formData.name}! Testimoni Anda telah kami terima. Sesuai kebijakan sekolah, testimoni akan diverifikasi & disharing terlebih dahulu oleh Tim Admin Humas SMK YAPEK Gombong di portal CMS sebelum tampil di beranda utama.`
    );
    setFormData({
      name: '',
      graduationYear: 2025,
      major: 'Teknik Komputer & Jaringan (TKJ)',
      role: '',
      company: '',
      content: '',
      highlight: '',
      rating: 5
    });

    setTimeout(() => {
      setSubmitSuccessMessage(null);
    }, 9000);
  };

  return (
    <section id="testimoni-alumni" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold text-xs uppercase tracking-wider border border-amber-300/40">
            <GraduationCap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Tracer Study & Jejak Karir Alumni</span>
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white">
            Testimoni & Kisah Sukses Alumni
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Inspirasi nyata dari para lulusan SMK YAPEK Gombong lintas angkatan yang kini telah sukses berkarir di industri multinasional, BUMN, perbankan, instansi pemerintah, serta wirausaha mandiri.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 flex-shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>Kirim Testimoni</span>
          </button>
        </div>
      </div>

      {/* Success notification banner */}
      {submitSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm font-semibold flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>{submitSuccessMessage}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm space-y-4">
        {/* Row 1: Graduation Year Tabs */}
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-amber-500" />
            <span>Pilih Tahun Kelulusan (Angkatan):</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedYear('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedYear === 'all'
                  ? 'bg-[#0F4374] text-white shadow-sm ring-2 ring-[#0F4374]/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Semua Angkatan ({activeTestimonials.filter(t => t.status === 'approved' || !t.status).length})
            </button>
            {availableYears.map(year => {
              const count = activeTestimonials.filter(t => (t.status === 'approved' || !t.status) && t.graduationYear === year).length;
              return (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedYear === year
                      ? 'bg-amber-500 text-slate-950 shadow-sm ring-2 ring-amber-400/40'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>Lulusan {year}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedYear === year 
                      ? 'bg-slate-950 text-white' 
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Major Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400 mr-1">Jurusan:</span>
            {majorCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedMajor(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedMajor === cat.id
                    ? 'bg-blue-100 dark:bg-blue-950 text-[#0F4374] dark:text-sky-300 border border-blue-300 dark:border-blue-800'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama, perusahaan, peran..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Slider Controls Bar (Top indicator & Next/Prev buttons) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            Slide {safeCurrentPage + 1} dari {totalPages}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            (Menampilkan 3 testimoni per tampilan • {startIndex + 1} - {endIndex} dari {filteredTestimonials.length} testimoni)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Autoplay Toggle */}
          <button
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            title={isAutoPlay ? 'Jeda Slider Otomatis' : 'Putar Slider Otomatis (5 detik)'}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isAutoPlay 
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm' 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            {isAutoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="text-[11px]">{isAutoPlay ? 'Auto ON' : 'Auto Play'}</span>
          </button>

          {/* Previous Button */}
          <button
            onClick={handlePrev}
            disabled={totalPages <= 1}
            title="Slide Testimoni Sebelumnya"
            className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <ChevronLeft className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">Sebelumnya</span>
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={totalPages <= 1}
            title="Slide Testimoni Berikutnya"
            className="px-4 py-1.5 rounded-xl bg-[#0F4374] hover:bg-blue-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <span>Berikutnya</span>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Testimonials 3-Cards Slider View */}
      {filteredTestimonials.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
          <GraduationCap className="w-10 h-10 text-slate-400 mx-auto" />
          <h4 className="text-base font-bold text-slate-700 dark:text-slate-200">
            Belum ada testimoni untuk filter yang dipilih
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Coba ubah pilihan tahun kelulusan atau reset kata kunci pencarian Anda.
          </p>
          <button
            onClick={() => { setSelectedYear('all'); setSelectedMajor('all'); setSearchQuery(''); }}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition-colors"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="relative">
          {/* 3 Testimonials Grid with smooth transition */}
          <div 
            key={safeCurrentPage}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn"
          >
            {visibleTestimonials.map((item) => (
              <div
                key={item.id}
                className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:border-amber-500/50 dark:hover:border-amber-500/50 transition-all flex flex-col justify-between p-6 relative overflow-hidden"
              >
                {/* Subtle decorative background quote */}
                <Quote className="absolute -bottom-3 -right-3 w-20 h-20 text-slate-100 dark:text-slate-800/40 pointer-events-none -z-0" />

                <div className="space-y-4 relative z-10">
                  {/* Profile header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-amber-400/80 shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#0F4374] dark:group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                          <span>{item.name}</span>
                          <span title="Alumni Terverifikasi" className="inline-flex">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                          </span>
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                          {item.major}
                        </p>
                      </div>
                    </div>

                    {/* Year Badge */}
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300/50 flex-shrink-0">
                      Lulusan {item.graduationYear}
                    </span>
                  </div>

                  {/* Job Role & Company */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                    <div className="text-xs font-bold text-[#0F4374] dark:text-sky-300 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                      <span className="line-clamp-1">{item.role}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                      <Building2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      <span className="line-clamp-1">{item.company}</span>
                    </div>
                  </div>

                  {/* Achievement Highlight if any */}
                  {item.highlight && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[10px] font-semibold border border-emerald-200 dark:border-emerald-800/60">
                      <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      <span className="line-clamp-1">{item.highlight}</span>
                    </div>
                  )}

                  {/* Testimonial Quote */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic line-clamp-4">
                    "{item.content}"
                  </p>
                </div>

                {/* Star Rating & Footer verification */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-[10px] font-bold text-slate-400 ml-1">5.0</span>
                  </div>

                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <HeartHandshake className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Tracer Study Resmi</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Floating Left/Right Arrows for Large Desktop */}
          {totalPages > 1 && (
            <>
              <button
                onClick={handlePrev}
                title="Lihat 3 Testimoni Sebelumnya"
                className="hidden xl:flex absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 transition-all z-20"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                title="Lihat 3 Testimoni Berikutnya"
                className="hidden xl:flex absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 transition-all z-20"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      )}

      {/* Bottom Slider Navigation & Pagination Dots */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {/* Previous button bottom */}
          <button
            onClick={handlePrev}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <ChevronLeft className="w-4 h-4 text-amber-500" />
            <span>3 Testimoni Sebelumnya</span>
          </button>

          {/* Dots Pagination */}
          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx)}
                title={`Buka Slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  safeCurrentPage === idx
                    ? 'w-8 h-2.5 bg-gradient-to-r from-amber-500 to-amber-600 shadow-sm'
                    : 'w-2.5 h-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          {/* Next button bottom */}
          <button
            onClick={handleNext}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#0F4374] hover:bg-blue-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <span>3 Testimoni Berikutnya (Next)</span>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      )}

      {/* Alumni Community Bottom Banner */}
      <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-[#0F4374] via-[#175c9e] to-[#0F4374] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-1.5 text-center sm:text-left">
          <h3 className="text-lg sm:text-xl font-bold flex items-center justify-center sm:justify-start gap-2">
            <GraduationCap className="w-5 h-5 text-amber-300" />
            <span>Keluarga Besar Ikatan Alumni (IKA) SMK YAPEK Gombong</span>
          </h3>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
            Lebih dari 18.200 alumni telah berkarya di seluruh pelosok Indonesia dan mancanegara. Bagikan capaian karir dan pengalaman belajar Anda untuk memotivasi adik-adik tingkat.
          </p>
        </div>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all active:scale-95 flex-shrink-0"
        >
          <span>Isi Form Testimoni Alumni</span>
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Submission Modal for Alumni */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Form Tracer Study & Testimoni
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Kirim Testimoni Alumni SMK YAPEK
                </h3>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitTestimonial} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap Alumni *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bagas Prasetyo, S.Kom."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tahun Kelulusan *
                  </label>
                  <select
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({ ...formData, graduationYear: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {[2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018].map(y => (
                      <option key={y} value={y}>Lulusan {y}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Jurusan / Program *
                  </label>
                  <select
                    value={formData.major}
                    onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Teknik Komputer & Jaringan (TKJ)">TKJ</option>
                    <option value="Akuntansi & Keuangan Lembaga (AKL)">AKL</option>
                    <option value="Teknik Kendaraan Ringan (TKR)">TKR</option>
                    <option value="Tata Kecantikan Kulit & Rambut (TKKR)">TKKR (Kecantikan)</option>
                    <option value="Bisnis Daring & Pemasaran (BDP)">BDP (Pemasaran)</option>
                    <option value="Manajemen Perkantoran (MP / OTKP)">MP / OTKP</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Posisi / Jabatan Pekerjaan *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Network Engineer / Owner"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Perusahaan / Usaha *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: PT Telkom / Studio Mandiri"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Prestasi / Catatan Khusus (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Diterima lewat campus hiring BKK / Juara LKS"
                  value={formData.highlight}
                  onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Testimoni & Kesan Selama Bersekolah di SMK YAPEK *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan pengalaman Anda mengenai guru, fasilitas lab, BKK, kedisiplinan, atau manfaat materi kejuruan untuk karir Anda saat ini..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0F4374] hover:bg-blue-900 text-white shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Testimoni</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
