import React, { useState, useMemo, useEffect } from 'react';
import { ActivityGalleryItem, ActivityType } from '../types';
import { 
  Camera, 
  Search, 
  MapPin, 
  Calendar, 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  User, 
  Filter,
  Layers,
  ArrowRight,
  Download
} from 'lucide-react';

interface ActivityGallerySectionProps {
  galleryItems: ActivityGalleryItem[];
  isDarkMode: boolean;
  onGoToAdmin?: () => void;
}

const CATEGORIES: { id: string; label: string; type?: ActivityType }[] = [
  { id: 'all', label: 'Semua Kegiatan' },
  { id: 'praktik', label: 'Praktik Kejuruan', type: 'Praktik Kejuruan' },
  { id: 'ekskul', label: 'Ekstrakurikuler', type: 'Ekstrakurikuler' },
  { id: 'upacara', label: 'Upacara & Apel', type: 'Upacara & Apel' },
  { id: 'industri', label: 'Kunjungan Industri', type: 'Kunjungan Industri' },
  { id: 'prestasi', label: 'Lomba & Prestasi', type: 'Lomba & Prestasi' },
  { id: 'sosial', label: 'Sosial & Rohani', type: 'Sosial & Rohani' }
];

export const getActivityTypeBadgeClass = (type: ActivityType): string => {
  switch (type) {
    case 'Praktik Kejuruan':
      return 'bg-blue-100 text-[#0F4374] dark:bg-blue-950/80 dark:text-sky-300 border border-blue-200 dark:border-blue-800';
    case 'Ekstrakurikuler':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800';
    case 'Upacara & Apel':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200 dark:border-purple-800';
    case 'Kunjungan Industri':
      return 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800';
    case 'Lomba & Prestasi':
      return 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-800';
    case 'Sosial & Rohani':
      return 'bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border border-teal-200 dark:border-teal-800';
    default:
      return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
  }
};

export const ActivityGallerySection: React.FC<ActivityGallerySectionProps> = ({
  galleryItems,
  isDarkMode,
  onGoToAdmin
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  // Filtered items
  const filteredItems = useMemo(() => {
    return galleryItems.filter((item) => {
      const matchCategory =
        selectedCategory === 'all' ||
        CATEGORIES.find((c) => c.id === selectedCategory)?.type === item.activityType;

      const matchSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.activityType.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [galleryItems, selectedCategory, searchQuery]);

  // Lightbox keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;

      if (e.key === 'Escape') {
        setActiveLightboxIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setActiveLightboxIndex((prev) =>
          prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1
        );
      } else if (e.key === 'ArrowRight') {
        setActiveLightboxIndex((prev) =>
          prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, filteredItems.length]);

  const activePhoto = activeLightboxIndex !== null ? filteredItems[activeLightboxIndex] : null;

  return (
    <section id="galeri-kegiatan" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-3 max-w-2xl text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold tracking-wide">
            <Camera className="w-3.5 h-3.5 text-amber-500" />
            <span>DOKUMENTASI & POTRET SEKOLAH</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Galeri Kegiatan & Dinamika Siswa
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Merekam jejak dedikasi pembelajaran vokasi, kreativitas ekstrakurikuler, apel kedisiplinan, 
            kunjungan industri, dan deretan prestasi membanggakan SMK YAPEK Gombong.
          </p>
        </div>

        {/* Quick Meta Stats / Filter Count */}
        <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto">
          <div className="px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#0F4374] dark:text-sky-400" />
            <span>{filteredItems.length} Foto Ditampilkan</span>
          </div>
          {onGoToAdmin && (
            <button
              onClick={onGoToAdmin}
              className="px-3.5 py-2 rounded-2xl bg-[#0F4374] hover:bg-[#154e85] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              title="Kelola & Upload Foto via CMS"
            >
              <span>Kelola di CMS</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-thin">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const count =
              cat.id === 'all'
                ? galleryItems.length
                : galleryItems.filter((item) => item.activityType === cat.type).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#0F4374] text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-72 flex-shrink-0">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kegiatan, bengkel, lab..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Gallery Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <Camera className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">
            Tidak ada foto kegiatan yang sesuai kriteria pencarian
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Coba reset filter atau gunakan kata kunci lain untuk menemukan dokumentasi kegiatan sekolah.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
          >
            Tampilkan Semua Foto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map((item, index) => {
            const badgeClass = getActivityTypeBadgeClass(item.activityType);
            return (
              <div
                key={item.id}
                onClick={() => setActiveLightboxIndex(index)}
                className="group relative cursor-pointer rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {/* Image Container with Fixed Ratio */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80';
                    }}
                  />

                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400 text-slate-950 text-xs font-bold shadow-md">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Lihat Foto Penuh</span>
                    </span>
                  </div>

                  {/* Featured Star Badge */}
                  {item.featured && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center gap-1 shadow-md">
                      <Sparkles className="w-3 h-3 text-slate-950" />
                      <span>Sorotan</span>
                    </div>
                  )}

                  {/* Activity Type Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm backdrop-blur-md ${badgeClass}`}>
                      {item.activityType}
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2 text-left">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-500" />
                        {item.date}
                      </span>
                      {item.location && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 line-clamp-1">
                            <MapPin className="w-3 h-3 text-[#0F4374] dark:text-sky-400" />
                            {item.location}
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 group-hover:text-[#0F4374] dark:group-hover:text-sky-400 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {item.caption}
                    </p>
                  </div>

                  {item.photographer && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>Dok. {item.photographer}</span>
                      </span>
                      <span className="text-[#0F4374] dark:text-sky-400 font-semibold group-hover:underline">
                        Buka &rarr;
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIGHTBOX MODAL VIEWER */}
      {activePhoto && activeLightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setActiveLightboxIndex(null)}
        >
          <div 
            className="relative max-w-5xl w-full max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row text-white animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveLightboxIndex(null)}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-950/70 hover:bg-slate-800 text-white transition-all shadow-md"
              title="Tutup (Esc)"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left/Main: Full Image with Controls */}
            <div className="relative lg:w-2/3 bg-black flex items-center justify-center min-h-[300px] max-h-[55vh] lg:max-h-[85vh] overflow-hidden group">
              <img
                src={activePhoto.image}
                alt={activePhoto.title}
                className="max-w-full max-h-full object-contain"
              />

              {/* Prev Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveLightboxIndex(
                    activeLightboxIndex > 0 ? activeLightboxIndex - 1 : filteredItems.length - 1
                  );
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/70 hover:bg-amber-500 hover:text-slate-950 text-white transition-all shadow-lg"
                title="Foto Sebelumnya"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveLightboxIndex(
                    activeLightboxIndex < filteredItems.length - 1 ? activeLightboxIndex + 1 : 0
                  );
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/70 hover:bg-amber-500 hover:text-slate-950 text-white transition-all shadow-lg"
                title="Foto Berikutnya"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Counter Pill */}
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-xs text-white/90 font-mono">
                {activeLightboxIndex + 1} / {filteredItems.length}
              </div>
            </div>

            {/* Right Side: Photo Meta & Full Narrative */}
            <div className="lg:w-1/3 p-6 sm:p-8 flex flex-col justify-between bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 overflow-y-auto max-h-[40vh] lg:max-h-[85vh]">
              <div className="space-y-4 text-left">
                {/* Category & Featured */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getActivityTypeBadgeClass(activePhoto.activityType)}`}>
                    {activePhoto.activityType}
                  </span>
                  {activePhoto.featured && (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Sorotan
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {activePhoto.title}
                </h3>

                {/* Meta details */}
                <div className="space-y-2 text-xs text-slate-400 bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>{activePhoto.date}</span>
                  </div>
                  {activePhoto.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-sky-400 flex-shrink-0" />
                      <span>{activePhoto.location}</span>
                    </div>
                  )}
                  {activePhoto.photographer && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Dokumentasi: {activePhoto.photographer}</span>
                    </div>
                  )}
                </div>

                {/* Caption / Description */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Keterangan Kegiatan
                  </span>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {activePhoto.caption}
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-6 border-t border-slate-800 flex items-center justify-between gap-3">
                <a
                  href={activePhoto.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Buka Foto Asli</span>
                </a>

                <button
                  onClick={() => setActiveLightboxIndex(null)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors"
                >
                  Selesai
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
