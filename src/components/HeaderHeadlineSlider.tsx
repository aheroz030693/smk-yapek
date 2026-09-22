import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NewsItem } from '../types';
import { 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Calendar, 
  User, 
  Eye, 
  ArrowRight, 
  Paperclip, 
  Camera, 
  Star,
  ExternalLink
} from 'lucide-react';

interface HeaderHeadlineSliderProps {
  newsList: NewsItem[];
  onOpenArticle: (articleId: string) => void;
  isDarkMode: boolean;
  autoPlayInterval?: number; // ms, default 5500ms
}

export const HeaderHeadlineSlider: React.FC<HeaderHeadlineSliderProps> = ({
  newsList,
  onOpenArticle,
  isDarkMode,
  autoPlayInterval = 5500
}) => {
  // Filter news items where isHeadline === true and status !== 'draft'
  const headlineItems = newsList.filter(
    (item) => item.isHeadline && item.status !== 'draft'
  );

  // Fallback: If no news is marked as headline, use top 3 published news items
  const activeItems = headlineItems.length > 0 ? headlineItems : newsList.slice(0, 3);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  const totalSlides = activeItems.length;
  const currentItem = activeItems[currentIndex] || activeItems[0];

  // Advance to next slide
  const handleNext = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    setProgress(0);
  }, [totalSlides]);

  // Go to previous slide
  const handlePrev = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setProgress(0);
  }, [totalSlides]);

  // Direct jump to slide
  const handleSelectSlide = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  // Autoplay and progress timer logic
  useEffect(() => {
    if (!isPlaying || isHovered || totalSlides <= 1) {
      return;
    }

    const stepMs = 50;
    const progressIncrement = (stepMs / autoPlayInterval) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + progressIncrement;
      });
    }, stepMs);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, autoPlayInterval, handleNext, totalSlides]);

  // Reset current index if list changes and index exceeds bounds
  useEffect(() => {
    if (currentIndex >= totalSlides) {
      setCurrentIndex(0);
      setProgress(0);
    }
  }, [totalSlides, currentIndex]);

  if (!currentItem) {
    return null;
  }

  return (
    <div 
      className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Headline Ticker Ribbon */}
      <div className="bg-gradient-to-r from-[#0F4374] via-[#165591] to-[#0A2F52] text-white px-4 py-2 sm:px-6 flex flex-wrap items-center justify-between gap-2 border-b border-blue-900/50">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 uppercase tracking-wider shadow-xs">
            <Star className="w-3 h-3 fill-slate-950" />
            <span>Headline Berita Utama</span>
          </span>
          <span className="text-xs text-blue-200 font-medium hidden sm:inline">
            Update Resmi SMK YAPEK Gombong
          </span>
        </div>

        {/* Quick Ticker Controls: Slide Counter & Autoplay Toggle */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1 font-mono text-[11px] font-bold text-blue-200">
            <span className="text-amber-300">0{currentIndex + 1}</span>
            <span>/</span>
            <span>0{totalSlides}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Jeda Slider Otomatis' : 'Putar Slider Otomatis'}
            className="p-1 rounded-lg hover:bg-white/15 text-white/90 hover:text-white transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
          </button>
        </div>
      </div>

      {/* Main Slide Card Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[360px] sm:min-h-[400px]">
        {/* Left / Featured Image Column */}
        <div className="lg:col-span-7 relative overflow-hidden bg-slate-950 min-h-[240px] sm:min-h-[320px] lg:min-h-full">
          <img
            key={currentItem.id}
            src={currentItem.image}
            alt={currentItem.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transform transition-transform duration-1000 ease-out hover:scale-105"
          />
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-slate-950/60" />

          {/* Floating Badges over Photo */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#0F4374]/90 backdrop-blur-md text-white border border-blue-400/40 shadow-md">
              {currentItem.category}
            </span>

            {currentItem.attachments && currentItem.attachments.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/90 text-slate-950 shadow-md">
                <Paperclip className="w-3 h-3" />
                <span>{currentItem.attachments.length} Berkas</span>
              </span>
            )}

            {currentItem.contentImages && currentItem.contentImages.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-500/90 text-white shadow-md">
                <Camera className="w-3 h-3" />
                <span>{currentItem.contentImages.length} Foto</span>
              </span>
            )}
          </div>

          {/* Mobile Overlay Title if small */}
          <div className="lg:hidden absolute bottom-3 left-3 right-3 text-white">
            <span className="text-[11px] font-semibold text-amber-400 block mb-1">
              {currentItem.date}
            </span>
            <h3 className="text-base font-black leading-snug line-clamp-2 drop-shadow-md">
              {currentItem.title}
            </h3>
          </div>
        </div>

        {/* Right / Article Story & Excerpt Column */}
        <div className="lg:col-span-5 p-5 sm:p-7 flex flex-col justify-between space-y-4 bg-white dark:bg-slate-900">
          <div className="space-y-3">
            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                <span>{currentItem.date}</span>
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                <User className="w-3.5 h-3.5 text-sky-500" />
                <span className="truncate max-w-[120px]">{currentItem.author}</span>
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentItem.views}x dibaca</span>
              </span>
            </div>

            {/* Main Headline Title (Clickable) */}
            <h2 
              onClick={() => onOpenArticle(currentItem.id)}
              className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug hover:text-[#0F4374] dark:hover:text-amber-400 cursor-pointer transition-colors line-clamp-3"
            >
              {currentItem.title}
            </h2>

            {/* Summary Excerpt */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 sm:line-clamp-4">
              {currentItem.summary}
            </p>

            {/* Tags Pills */}
            {currentItem.tags && currentItem.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentItem.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Row & Carousel Navigation */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between gap-3">
              {/* Primary CTA button to open full article */}
              <button
                type="button"
                onClick={() => onOpenArticle(currentItem.id)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0F4374] to-[#144f84] hover:from-[#0d3b66] hover:to-[#0F4374] text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-blue-900/20 active:scale-95 transition-all"
              >
                <span>Baca Selengkapnya</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>

              {/* Prev / Next Navigation Arrows */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrev}
                  title="Headline Sebelumnya"
                  aria-label="Headline Sebelumnya"
                  className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors shadow-2xs"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  title="Headline Berikutnya"
                  aria-label="Headline Berikutnya"
                  className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors shadow-2xs"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Slide Dots / Selectors */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1.5">
                {activeItems.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectSlide(idx)}
                    title={`Lompat ke headline ${idx + 1}: ${item.title}`}
                    aria-label={`Slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? 'w-7 bg-amber-500 shadow-xs'
                        : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                    }`}
                  />
                ))}
              </div>

              {isHovered && (
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold animate-pulse">
                  Dihentikan sementara (hover)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Autoplay Progress Line Indicator */}
      {isPlaying && (
        <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#0F4374] via-blue-500 to-amber-400 transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Bottom Thumbnail Strip (for quick visual selection of all headlines) */}
      {totalSlides > 1 && (
        <div className="bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200/80 dark:border-slate-800/80 px-4 py-2 sm:px-6 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 min-w-max">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
              Daftar Headline:
            </span>
            {activeItems.map((item, idx) => {
              const isSelected = idx === currentIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectSlide(idx)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-left transition-all max-w-xs ${
                    isSelected
                      ? 'bg-white dark:bg-slate-800 border-2 border-amber-500 shadow-sm'
                      : 'bg-slate-200/60 dark:bg-slate-900 border border-transparent hover:border-slate-300 dark:hover:border-slate-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                      {item.title}
                    </div>
                    <div className="text-[9px] text-slate-500 dark:text-slate-400">
                      {item.category} • {item.date}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
