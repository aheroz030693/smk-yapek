import React, { useState, useEffect } from 'react';
import { NewsItem, NewsAttachment, NewsContentImage } from '../types';
import { 
  X, 
  Calendar, 
  User, 
  Eye, 
  Share2, 
  ArrowRight, 
  Clock, 
  Check, 
  ShieldCheck, 
  ChevronRight,
  Sparkles,
  Bookmark,
  Paperclip,
  Download,
  FileText,
  FileSpreadsheet,
  Presentation,
  FileDown,
  Image as ImageIcon,
  ExternalLink,
  ZoomIn
} from 'lucide-react';

interface ArticleDetailModalProps {
  article: NewsItem | null;
  allNews: NewsItem[];
  isOpen: boolean;
  onClose: () => void;
  onSelectArticle: (articleId: string) => void;
  onGoToAdmin: () => void;
  isDarkMode: boolean;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  allNews,
  isOpen,
  onClose,
  onSelectArticle,
  onGoToAdmin,
  isDarkMode
}) => {
  const [copied, setCopied] = useState(false);
  const [previewZoomImage, setPreviewZoomImage] = useState<NewsContentImage | null>(null);

  useEffect(() => {
    // Reset copy state when article changes
    setCopied(false);
    setPreviewZoomImage(null);
  }, [article?.id]);

  if (!isOpen || !article) return null;

  // Find related articles based on relatedArticleIds or matching category
  const relatedArticles = allNews.filter((n) => {
    if (n.id === article.id) return false;
    if (article.relatedArticleIds && article.relatedArticleIds.includes(n.id)) return true;
    return n.category === article.category;
  }).slice(0, 3);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Baca Berita Resmi SMK YAPEK Gombong: "${article.title}"\n${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleDownloadAttachment = (att: NewsAttachment) => {
    if (!att.url || att.url === '#') {
      const dummyBlob = new Blob([
        `SEKOLAH MENENGAH KEJURUAN YAPEK GOMBONG\n` +
        `PORTAL BERITA & DOKUMEN RESMI\n` +
        `========================================\n` +
        `Nama Dokumen : ${att.name}\n` +
        `Format       : ${att.fileType.toUpperCase()}\n` +
        `Ukuran       : ${att.fileSize}\n` +
        `Tanggal      : ${att.uploadDate || '2026'}\n` +
        `Rujukan Berita : ${article.title}\n` +
        `========================================\n\n` +
        `Dokumen ini diterbitkan oleh Humas & Tata Usaha SMK YAPEK Gombong untuk keperluan resmi akademik/kegiatan.`
      ], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(dummyBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = att.name.endsWith('.txt') ? att.name : `${att.name}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return;
    }
    const link = document.createElement('a');
    link.href = att.url;
    link.download = att.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getAttachmentIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
      case 'ppt':
      case 'pptx':
        return <Presentation className="w-5 h-5 text-amber-500" />;
      case 'image':
        return <ImageIcon className="w-5 h-5 text-purple-500" />;
      default:
        return <FileDown className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="max-w-4xl w-full my-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header Bar */}
        <div className="p-4 sm:px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/80 sticky top-0 z-10 backdrop-blur">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-950/70 text-[#0F4374] dark:text-sky-300">
              {article.category}
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 text-amber-700 dark:text-amber-300 text-xs font-bold">
              <Eye className="w-3.5 h-3.5" />
              <span>{article.views.toLocaleString('id-ID')} views</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onGoToAdmin}
              title="Kelola di Backend Administrator"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#0F4374] hover:text-white dark:hover:bg-sky-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Backend Admin</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
          {/* Article Title */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {article.title}
            </h1>

            {/* Author, Date, Views Row */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                <User className="w-3.5 h-3.5 text-[#0F4374] dark:text-sky-400" />
                <span>Oleh: {article.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
                <Eye className="w-3.5 h-3.5" />
                <span>Dibaca {article.views.toLocaleString('id-ID')} kali</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative aspect-video sm:max-h-[380px] w-full shadow-md bg-slate-100 dark:bg-slate-800">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-slate-950/70 text-[10px] text-white backdrop-blur">
              Dokumentasi Resmi SMK YAPEK Gombong
            </div>
          </div>

          {/* Lead Summary */}
          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border-l-4 border-[#0F4374] text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">
            "{article.summary}"
          </div>

          {/* Main Article Paragraphs */}
          <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
            {article.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* DOKUMENTASI FOTO TAMBAHAN KONTEN (JIKA ADA) */}
          {article.contentImages && article.contentImages.length > 0 && (
            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Galeri & Dokumentasi Kegiatan</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-300">
                      {article.contentImages.length} Foto
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Klik gambar untuk memperbesar tampilan foto liputan
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {article.contentImages.map((img) => (
                  <div
                    key={img.id}
                    onClick={() => setPreviewZoomImage(img)}
                    className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:border-[#0F4374] dark:hover:border-sky-400 transition-all hover:shadow-md"
                  >
                    <div className="relative aspect-4/3 overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={img.url}
                        alt={img.caption || 'Dokumentasi'}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <span className="p-2 rounded-full bg-slate-900/70 backdrop-blur-xs flex items-center gap-1 text-xs font-semibold">
                          <ZoomIn className="w-3.5 h-3.5" />
                          <span>Perbesar</span>
                        </span>
                      </div>
                    </div>
                    {img.caption && (
                      <div className="p-2.5 text-xs text-slate-700 dark:text-slate-300 line-clamp-2 font-medium bg-slate-50/60 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800">
                        {img.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BERKAS LAMPIRAN DOKUMEN RESMI (PDF, DOCX, XLSX, DLL) */}
          {article.attachments && article.attachments.length > 0 && (
            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                  <Paperclip className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Berkas Lampiran & Dokumen Resmi</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300">
                      {article.attachments.length} Berkas
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Unduh berita acara, petunjuk teknis (Juknis), SK, atau berkas pendukung warta ini
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {article.attachments.map((att) => {
                  let badgeColor = 'bg-slate-700 text-white';
                  let containerBg = 'bg-slate-50/80 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80';
                  if (att.fileType === 'pdf') {
                    badgeColor = 'bg-rose-600 text-white';
                    containerBg = 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200/80 dark:border-rose-900/50';
                  } else if (att.fileType === 'docx' || att.fileType === 'doc') {
                    badgeColor = 'bg-blue-600 text-white';
                    containerBg = 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/80 dark:border-blue-900/50';
                  } else if (att.fileType === 'xlsx' || att.fileType === 'xls') {
                    badgeColor = 'bg-emerald-600 text-white';
                    containerBg = 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/50';
                  }

                  return (
                    <div
                      key={att.id}
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all hover:shadow-xs ${containerBg}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shrink-0">
                          {getAttachmentIcon(att.fileType)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {att.name}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                            <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase font-mono ${badgeColor}`}>
                              {att.fileType}
                            </span>
                            <span>{att.fileSize}</span>
                            {att.uploadDate && <span className="hidden xs:inline">• {att.uploadDate}</span>}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDownloadAttachment(att)}
                        className="px-3 py-1.5 rounded-xl bg-[#0F4374] hover:bg-blue-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 shrink-0"
                        title="Unduh Berkas"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Unduh</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-400">Kata Kunci:</span>
              {article.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Social Share Bar */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#0F4374] dark:text-sky-400" />
              <span>Bagikan Berita Ini ke Rekan & Calon Siswa:</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShareWhatsApp}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>WhatsApp</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Salin Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ARTIKEL TERKAIT (Related Articles) */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2.5 h-5 bg-amber-500 rounded-sm"></span>
                Artikel Terkait Lainnya
              </h3>
              <span className="text-xs text-slate-400 font-medium">Rekomendasi bacaan untuk Anda</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {relatedArticles.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectArticle(rel.id)}
                  className="group cursor-pointer rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-3 hover:border-amber-500 dark:hover:border-amber-500 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="rounded-xl overflow-hidden aspect-video relative bg-slate-100 dark:bg-slate-800">
                      <img
                        src={rel.image}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#0F4374] text-white">
                        {rel.category}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-[#0F4374] dark:group-hover:text-amber-400 transition-colors">
                      {rel.title}
                    </h4>
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{rel.date}</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {rel.views.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox / Zoom Preview Modal */}
      {previewZoomImage && (
        <div 
          onClick={() => setPreviewZoomImage(null)}
          className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="absolute top-3 right-3 z-10">
              <button
                type="button"
                onClick={() => setPreviewZoomImage(null)}
                className="p-2 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-auto flex items-center justify-center p-2">
              <img
                src={previewZoomImage.url}
                alt={previewZoomImage.caption || 'Foto'}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[75vh] object-contain rounded-lg"
              />
            </div>
            {previewZoomImage.caption && (
              <div className="p-4 bg-slate-950 text-white text-xs sm:text-sm text-center font-medium border-t border-slate-800">
                {previewZoomImage.caption}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
