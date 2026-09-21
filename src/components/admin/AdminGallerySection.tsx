import React, { useState, useMemo, useRef } from 'react';
import { ActivityGalleryItem, ActivityType } from '../../types';
import { INITIAL_ACTIVITY_GALLERY } from '../../data/schoolData';
import { 
  Camera, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  MapPin, 
  Calendar, 
  User, 
  CheckCircle2, 
  X, 
  Filter, 
  Eye, 
  RotateCcw,
  LayoutGrid,
  List,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { getActivityTypeBadgeClass } from '../ActivityGallerySection';

interface AdminGallerySectionProps {
  galleryItems: ActivityGalleryItem[];
  onUpdateGallery: (updated: ActivityGalleryItem[]) => void;
  isDarkMode: boolean;
}

const ACTIVITY_TYPES: ActivityType[] = [
  'Praktik Kejuruan',
  'Ekstrakurikuler',
  'Upacara & Apel',
  'Kunjungan Industri',
  'Lomba & Prestasi',
  'Sosial & Rohani'
];

const PRESET_PHOTOS = [
  {
    name: 'Bengkel Otomotif Modern',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    type: 'Praktik Kejuruan' as ActivityType
  },
  {
    name: 'Lab Jaringan Server TKJ',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    type: 'Praktik Kejuruan' as ActivityType
  },
  {
    name: 'Upacara Bendera Plaza',
    url: 'https://images.unsplash.com/photo-1526976668912-1a811878dd37?auto=format&fit=crop&w=800&q=80',
    type: 'Upacara & Apel' as ActivityType
  },
  {
    name: 'Kunjungan Perakitan Industri',
    url: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=800&q=80',
    type: 'Kunjungan Industri' as ActivityType
  },
  {
    name: 'Latihan Paskibra & Kedisiplinan',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    type: 'Ekstrakurikuler' as ActivityType
  },
  {
    name: 'Penyerahan Medali Juara LKS',
    url: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=800&q=80',
    type: 'Lomba & Prestasi' as ActivityType
  },
  {
    name: 'Simulasi Bank & Kasir AKL',
    url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    type: 'Praktik Kejuruan' as ActivityType
  },
  {
    name: 'Bakti Sosial & Donor PMI',
    url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    type: 'Sosial & Rohani' as ActivityType
  }
];

export const AdminGallerySection: React.FC<AdminGallerySectionProps> = ({
  galleryItems,
  onUpdateGallery,
  isDarkMode
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('SEMUA');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ActivityGalleryItem | null>(null);
  const [previewModalItem, setPreviewModalItem] = useState<ActivityGalleryItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<Partial<ActivityGalleryItem>>({
    title: '',
    activityType: 'Praktik Kejuruan',
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    location: '',
    image: '',
    caption: '',
    photographer: 'Tim Dokumentasi Humas',
    featured: false
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Open modal for Adding new photo
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      activityType: 'Praktik Kejuruan',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      location: 'Kampus SMK YAPEK Gombong',
      image: PRESET_PHOTOS[0].url,
      caption: '',
      photographer: 'Tim Dokumentasi Humas',
      featured: false
    });
    setIsModalOpen(true);
  };

  // Open modal for Editing existing photo
  const handleOpenEdit = (item: ActivityGalleryItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  // Handle local image file upload (FileReader Base64)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 8MB for browser performance)
    if (file.size > 8 * 1024 * 1024) {
      alert('Ukuran berkas foto melebihi 8MB. Mohon gunakan foto dengan resolusi optimal.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setFormData((prev) => ({
          ...prev,
          image: reader.result as string
        }));
        showToast('Foto berhasil dimuat dari perangkat lokal');
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Form (Create or Update)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title?.trim() || !formData.image?.trim()) {
      alert('Harap masukkan judul kegiatan dan foto terlebih dahulu.');
      return;
    }

    if (editingItem) {
      // Update
      const updated = galleryItems.map((item) =>
        item.id === editingItem.id
          ? ({
              ...item,
              ...formData,
              title: formData.title!.trim(),
              activityType: (formData.activityType || 'Praktik Kejuruan') as ActivityType,
              date: formData.date || item.date,
              location: formData.location || '',
              image: formData.image!,
              caption: formData.caption || '',
              photographer: formData.photographer || 'Humas SMK YAPEK',
              featured: Boolean(formData.featured)
            } as ActivityGalleryItem)
          : item
      );
      onUpdateGallery(updated);
      showToast(`Foto "${formData.title}" berhasil diperbarui!`);
    } else {
      // Create new
      const newItem: ActivityGalleryItem = {
        id: `gal-${Date.now()}`,
        title: formData.title!.trim(),
        activityType: (formData.activityType || 'Praktik Kejuruan') as ActivityType,
        date: formData.date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        location: formData.location || 'Kampus SMK YAPEK Gombong',
        image: formData.image!,
        caption: formData.caption || 'Dokumentasi resmi kegiatan SMK YAPEK Gombong.',
        photographer: formData.photographer || 'Tim Dokumentasi Humas',
        featured: Boolean(formData.featured)
      };
      onUpdateGallery([newItem, ...galleryItems]);
      showToast(`Foto kegiatan "${newItem.title}" berhasil ditambahkan ke galeri!`);
    }

    setIsModalOpen(false);
  };

  // Delete an item
  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Hapus foto dokumentasi "${title}" dari galeri sekolah?`)) {
      const updated = galleryItems.filter((item) => item.id !== id);
      onUpdateGallery(updated);
      showToast('Foto berhasil dihapus dari galeri.');
    }
  };

  // Toggle Featured status
  const handleToggleFeatured = (item: ActivityGalleryItem) => {
    const updated = galleryItems.map((g) =>
      g.id === item.id ? { ...g, featured: !g.featured } : g
    );
    onUpdateGallery(updated);
    showToast(
      !item.featured
        ? `Foto "${item.title}" ditandai sebagai sorotan utama di beranda!`
        : `Sorotan untuk "${item.title}" dinonaktifkan.`
    );
  };

  // Reset to default
  const handleReset = () => {
    if (window.confirm('Kembalikan galeri foto kegiatan ke setelan awal pabrik (8 foto bawaan)?')) {
      onUpdateGallery(INITIAL_ACTIVITY_GALLERY);
      showToast('Galeri foto kegiatan berhasil di-reset ke setelan awal.');
    }
  };

  // Filtered list
  const filteredGallery = useMemo(() => {
    return galleryItems.filter((item) => {
      const matchType =
        selectedTypeFilter === 'SEMUA' || item.activityType === selectedTypeFilter;
      const matchSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.activityType.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchSearch;
    });
  }, [galleryItems, selectedTypeFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#0F4374] via-[#13497d] to-[#EA8B00] text-white shadow-lg">
        <div className="space-y-1.5 text-left">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
              Manajemen Dokumentasi
            </span>
            <span className="text-xs text-blue-100">• Live CRUD & Upload</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Galeri Kegiatan & Potret Sekolah
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
            Kelola arsip foto kegiatan siswa, pembelajaran vokasi, upacara, ekstrakurikuler, dan kunjungan industri. 
            Mendukung upload langsung dari komputer atau via tautan foto.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all border border-white/20"
            title="Reset foto ke setelan pabrik"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Bawaan</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Foto Kegiatan</span>
          </button>
        </div>
      </div>

      {/* Category Summary Quick Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {ACTIVITY_TYPES.map((type) => {
          const count = galleryItems.filter((i) => i.activityType === type).length;
          const isCurrent = selectedTypeFilter === type;
          return (
            <button
              key={type}
              onClick={() => setSelectedTypeFilter(isCurrent ? 'SEMUA' : type)}
              className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-1 ${
                isCurrent
                  ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-400 dark:border-blue-600 shadow-sm ring-2 ring-blue-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 truncate">
                {type}
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  {count}
                </span>
                <span className="text-[10px] font-semibold text-slate-400">foto</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter, Search & View Controls */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari judul kegiatan, lokasi, fotografer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdown & View Mode Switcher */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-bold focus:outline-none"
            >
              <option value="SEMUA">Semua Jenis Kegiatan ({galleryItems.length})</option>
              {ACTIVITY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t} ({galleryItems.filter((i) => i.activityType === t).length})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-[#0F4374] dark:text-sky-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Tampilan Grid"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-[#0F4374] dark:text-sky-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Tampilan Tabel"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Grid or Table */}
      {filteredGallery.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <Camera className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">
            Tidak ada foto yang cocok
          </h4>
          <p className="text-xs text-slate-400">
            Coba ubah kata kunci pencarian atau bersihkan filter jenis kegiatan.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredGallery.map((item) => {
            const badgeClass = getActivityTypeBadgeClass(item.activityType);
            return (
              <div
                key={item.id}
                className="rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group"
              >
                <div>
                  {/* Photo Thumbnail */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80';
                      }}
                    />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm backdrop-blur-md ${badgeClass}`}>
                        {item.activityType}
                      </span>

                      <button
                        onClick={() => handleToggleFeatured(item)}
                        className={`p-1.5 rounded-full shadow-md transition-all ${
                          item.featured
                            ? 'bg-amber-400 text-slate-950 ring-2 ring-white'
                            : 'bg-black/50 text-white/80 hover:bg-amber-400 hover:text-slate-950'
                        }`}
                        title={item.featured ? 'Foto Sorotan Aktif' : 'Jadikan Sorotan di Beranda'}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Quick Preview Hover button */}
                    <button
                      onClick={() => setPreviewModalItem(item)}
                      className="absolute bottom-2.5 right-2.5 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white text-[11px] font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>Lihat</span>
                    </button>
                  </div>

                  {/* Body Info */}
                  <div className="p-4 space-y-2 text-left">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-500" />
                        {item.date}
                      </span>
                      {item.location && (
                        <>
                          <span>•</span>
                          <span className="truncate flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#0F4374] dark:text-sky-400" />
                            {item.location}
                          </span>
                        </>
                      )}
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {item.caption}
                    </p>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                    Dok: {item.photographer || 'Humas'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      title="Edit Foto & Keterangan"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                      title="Hapus Foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Foto</th>
                  <th className="py-3 px-4">Judul & Keterangan</th>
                  <th className="py-3 px-4">Jenis Kegiatan</th>
                  <th className="py-3 px-4">Tanggal & Lokasi</th>
                  <th className="py-3 px-4">Fotografer</th>
                  <th className="py-3 px-4 text-center">Sorotan</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredGallery.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div
                        onClick={() => setPreviewModalItem(item)}
                        className="w-14 h-11 rounded-xl overflow-hidden cursor-pointer relative group flex-shrink-0 bg-slate-100"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Eye className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {item.caption}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getActivityTypeBadgeClass(item.activityType)}`}>
                        {item.activityType}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                      <div>{item.date}</div>
                      <div className="text-[10px] text-slate-400">{item.location || '-'}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                      {item.photographer || 'Humas'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(item)}
                        className={`p-1.5 rounded-full transition-colors ${
                          item.featured
                            ? 'text-amber-500 bg-amber-100 dark:bg-amber-950/60'
                            : 'text-slate-300 hover:text-amber-500'
                        }`}
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150 text-left">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {editingItem ? 'Edit Foto & Keterangan Kegiatan' : 'Tambah Foto Kegiatan Baru'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Isi jenis kegiatan dan unggah foto dokumentasi resmi SMK YAPEK Gombong
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Judul Kegiatan */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Judul Kegiatan / Peristiwa <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Praktik Pengukuran Oscilloscope Bengkel TKR"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0F4374] outline-none"
                />
              </div>

              {/* Jenis Kegiatan & Tanggal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Jenis Kegiatan <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.activityType || 'Praktik Kejuruan'}
                    onChange={(e) =>
                      setFormData({ ...formData, activityType: e.target.value as ActivityType })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-[#0F4374] outline-none"
                  >
                    {ACTIVITY_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Tanggal Pelaksanaan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 18 September 2026"
                    value={formData.date || ''}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0F4374] outline-none"
                  />
                </div>
              </div>

              {/* Lokasi & Fotografer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Tempat / Lokasi
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Laboratorium TKJ Mikrotik"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0F4374] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Unit Dokumentasi / Fotografer
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Tim Humas & Publikasi"
                    value={formData.photographer || ''}
                    onChange={(e) => setFormData({ ...formData, photographer: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0F4374] outline-none"
                  />
                </div>
              </div>

              {/* UPLOAD FOTO & PREVIEW SECTION */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-[#0F4374] dark:text-sky-400" />
                    <span>Upload Foto Kegiatan</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400">JPG, PNG, WebP (Maks 8MB)</span>
                </div>

                {/* File Input and Drop Area */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  {/* Image Preview Box */}
                  <div className="sm:col-span-4 relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    {formData.image ? (
                      <>
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image: '' })}
                          className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-950/70 hover:bg-rose-600 text-white transition-colors"
                          title="Hapus Foto"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      <div className="text-center p-2 space-y-1">
                        <ImageIcon className="w-6 h-6 text-slate-400 mx-auto" />
                        <span className="text-[10px] text-slate-400 block">Belum ada foto</span>
                      </div>
                    )}
                  </div>

                  {/* Actions: Local Upload button + URL input */}
                  <div className="sm:col-span-8 space-y-2.5">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-600 text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                      <Upload className="w-4 h-4 text-[#0F4374] dark:text-sky-400" />
                      <span>Pilih Foto dari Komputer / HP</span>
                    </button>

                    {/* Or URL Input */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 block">Atau masukkan URL gambar langsung:</span>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={formData.image || ''}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[11px] text-slate-800 dark:text-slate-200 font-mono focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1.5">
                    Pilihan Preset Foto Standar Vokasi SMK:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_PHOTOS.slice(0, 5).map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            image: preset.url,
                            activityType: preset.type
                          });
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-amber-100 dark:hover:bg-amber-950/60 border border-slate-200 dark:border-slate-600 text-[10px] text-slate-700 dark:text-slate-300 font-medium transition-colors"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Caption / Keterangan Foto */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Deskripsi / Keterangan Foto
                </label>
                <textarea
                  rows={3}
                  placeholder="Ceritakan gambaran kegiatan, peserta yang terlibat, atau tujuan pelaksanaan praktikum..."
                  value={formData.caption || ''}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0F4374] outline-none"
                />
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <input
                  type="checkbox"
                  id="featured-checkbox"
                  checked={Boolean(formData.featured)}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                />
                <label
                  htmlFor="featured-checkbox"
                  className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Jadikan Sorotan Utama (Featured) di Galeri Beranda</span>
                </label>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0F4374] hover:bg-[#154e85] text-white text-xs font-black shadow-md flex items-center gap-2 transition-all active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>{editingItem ? 'Simpan Perubahan' : 'Terbitkan ke Galeri'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK PREVIEW MODAL */}
      {previewModalItem && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewModalItem(null)}
        >
          <div 
            className="relative max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-white animate-in zoom-in-95 duration-150 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewModalItem(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 hover:bg-slate-800 text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="aspect-[16/10] w-full bg-black">
              <img
                src={previewModalItem.image}
                alt={previewModalItem.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-5 space-y-2.5 bg-slate-900">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getActivityTypeBadgeClass(previewModalItem.activityType)}`}>
                  {previewModalItem.activityType}
                </span>
                {previewModalItem.featured && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
                    Sorotan
                  </span>
                )}
                <span className="text-xs text-slate-400">• {previewModalItem.date}</span>
              </div>

              <h4 className="text-lg font-bold text-white leading-tight">
                {previewModalItem.title}
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed">
                {previewModalItem.caption}
              </p>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Lokasi: {previewModalItem.location || 'SMK YAPEK'}</span>
                <span>Dokumentasi: {previewModalItem.photographer || 'Humas'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
