import React, { useState, useRef } from 'react';
import { 
  NewsItem, 
  NewsAttachment,
  NewsContentImage,
  PPDBApplicant, 
  SchoolIdentity, 
  HeadmasterProfile, 
  AlumniTestimonial, 
  DailyTraffic, 
  TrafficSource, 
  TopPageTraffic, 
  VisitorLog, 
  AdminUser,
  ScreenTab,
  ActivityGalleryItem
} from '../../types';
import { SchoolLogo } from '../SchoolLogo';
import { AdminLoginScreen } from '../admin/AdminLoginScreen';
import { AdminTrafficSection } from '../admin/AdminTrafficSection';
import { AdminGallerySection } from '../admin/AdminGallerySection';
import { AdminHeadmasterSection } from '../admin/AdminHeadmasterSection';
import { AdminTestimonialsSection } from '../admin/AdminTestimonialsSection';
import { AdminIdentitySection } from '../admin/AdminIdentitySection';
import { AdminDatabaseSection } from '../admin/AdminDatabaseSection';
import { AdminUsersSection } from '../admin/AdminUsersSection';
import { DEFAULT_ROLE_PERMISSIONS, ADMIN_USERS } from '../../data/schoolData';
import { 
  ShieldCheck, 
  ShieldAlert,
  Lock,
  UserPlus,
  FileText, 
  Eye, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ExternalLink,
  Save,
  X,
  Sparkles,
  Star,
  ArrowLeft,
  ChevronRight,
  Filter,
  BarChart3,
  UserCheck,
  Building2,
  Quote,
  GraduationCap,
  LogOut,
  Layers,
  HelpCircle,
  Camera,
  Upload,
  Image as ImageIcon,
  Link,
  ChevronDown,
  Paperclip,
  Download,
  File,
  FileSpreadsheet,
  Presentation,
  Database
} from 'lucide-react';

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const getFileType = (fileName: string, mimeType?: string): 'pdf' | 'docx' | 'doc' | 'xlsx' | 'xls' | 'pptx' | 'image' | 'other' => {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  if (ext === 'pdf' || mimeType?.includes('pdf')) return 'pdf';
  if (ext === 'docx') return 'docx';
  if (ext === 'doc') return 'doc';
  if (ext === 'xlsx') return 'xlsx';
  if (ext === 'xls') return 'xls';
  if (ext === 'pptx' || ext === 'ppt') return 'pptx';
  if (['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'].includes(ext) || mimeType?.startsWith('image/')) return 'image';
  return 'other';
};

const NEWS_IMAGE_PRESETS = [
  {
    label: 'Juara LKS & Medali Emas',
    category: 'Prestasi',
    url: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=800&q=80',
    desc: 'Penyerahan piala dan sertifikat kompetisi vokasi'
  },
  {
    label: 'Bengkel Otomotif Modern TKR',
    category: 'Kegiatan',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    desc: 'Praktik tune-up mesin dan kelistrikan kendaraan'
  },
  {
    label: 'Laboratorium Jaringan & Server TKJ',
    category: 'Akademik',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    desc: 'Konfigurasi mikrotik, router dan cloud server'
  },
  {
    label: 'Upacara Bendera & Apel Disiplin',
    category: 'Kegiatan',
    url: 'https://images.unsplash.com/photo-1526976668912-1a811878dd37?auto=format&fit=crop&w=800&q=80',
    desc: 'Pembiasaan karakter dan kedisiplinan taruna'
  },
  {
    label: 'Kunjungan DU/DI & Astra Group',
    category: 'BKK',
    url: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=800&q=80',
    desc: 'Studi lapangan dan rekrutmen kerja industri'
  },
  {
    label: 'Pendaftaran PPDB & Kampus Edukasi',
    category: 'PPDB',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    desc: 'Pelayanan verifikasi berkas calon siswa baru'
  }
];

interface AdminScreenProps {
  newsList: NewsItem[];
  applicants: PPDBApplicant[];
  schoolInfo: SchoolIdentity;
  headmaster: HeadmasterProfile;
  testimonials: AlumniTestimonial[];
  trafficData: DailyTraffic[];
  trafficSources: TrafficSource[];
  topPages: TopPageTraffic[];
  visitorLogs: VisitorLog[];
  adminUser: AdminUser | null;
  adminUsers?: AdminUser[];
  onUpdateAdminUsers?: (updated: AdminUser[]) => void;
  galleryItems?: ActivityGalleryItem[];
  onLoginSuccess: (user: AdminUser) => void;
  onLogoutAdmin: () => void;
  onUpdateNews: (updated: NewsItem[]) => void;
  onUpdateApplicants?: (updated: PPDBApplicant[]) => void;
  onUpdateSchoolInfo: (updated: SchoolIdentity) => void;
  onUpdateHeadmaster: (updated: HeadmasterProfile) => void;
  onUpdateTestimonials: (updated: AlumniTestimonial[]) => void;
  onUpdateGallery?: (updated: ActivityGalleryItem[]) => void;
  onRefreshTraffic?: () => void;
  onSelectArticle: (articleId: string) => void;
  onExitAdmin: () => void;
  onNavigateToTab?: (tab: ScreenTab) => void;
  isDarkMode: boolean;
}

export type AdminTab = 'traffic' | 'gallery' | 'testimonials' | 'headmaster' | 'identity' | 'articles' | 'ppdb' | 'database' | 'users';

export const AdminScreen: React.FC<AdminScreenProps> = ({
  newsList,
  applicants,
  schoolInfo,
  headmaster,
  testimonials,
  trafficData,
  trafficSources,
  topPages,
  visitorLogs,
  adminUser,
  adminUsers = ADMIN_USERS,
  onUpdateAdminUsers,
  galleryItems = [],
  onLoginSuccess,
  onLogoutAdmin,
  onUpdateNews,
  onUpdateApplicants,
  onUpdateSchoolInfo,
  onUpdateHeadmaster,
  onUpdateTestimonials,
  onUpdateGallery,
  onRefreshTraffic,
  onSelectArticle,
  onExitAdmin,
  onNavigateToTab,
  isDarkMode
}) => {
  // Active Tab in Admin
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('traffic');

  // RBAC permission checker for current admin
  const userHasAccess = (tab: AdminTab): boolean => {
    if (!adminUser) return false;
    if (adminUser.role === 'Super Admin CMS') return true;
    const perms = adminUser.permissions || DEFAULT_ROLE_PERMISSIONS[adminUser.role] || [];
    return perms.includes(tab as any);
  };

  // If user is not authenticated, show modern login screen
  if (!adminUser) {
    return (
      <AdminLoginScreen
        onLoginSuccess={onLoginSuccess}
        onBackToHome={onExitAdmin}
        isDarkMode={isDarkMode}
        adminUsers={adminUsers}
      />
    );
  }

  // Articles Section States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('SEMUA');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsItem | null>(null);
  
  // Article Image Upload States
  const articleFileInputRef = useRef<HTMLInputElement>(null);
  const [isArticleDragging, setIsArticleDragging] = useState(false);
  const [showArticlePresets, setShowArticlePresets] = useState(false);
  const [showArticleUrlInput, setShowArticleUrlInput] = useState(false);

  // Document & Attachment Upload States
  const attachmentFileInputRef = useRef<HTMLInputElement>(null);
  const [isAttachmentDragging, setIsAttachmentDragging] = useState(false);

  // Content Image / Inline Photo States
  const contentImageFileInputRef = useRef<HTMLInputElement>(null);
  const [isContentImageDragging, setIsContentImageDragging] = useState(false);

  const [formData, setFormData] = useState<Partial<NewsItem>>({
    title: '',
    category: 'Kegiatan',
    date: 'Hari ini',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    summary: '',
    content: '',
    author: adminUser.name || 'Admin Humas SMK YAPEK',
    views: 0,
    status: 'published',
    isHeadline: true,
    tags: ['SMK YAPEK', 'Kebumen'],
    attachments: [],
    contentImages: []
  });

  // Handle document attachment upload (PDF, DOCX, XLSX, etc.)
  const handleAttachmentFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    fileArray.forEach((file) => {
      if (file.size > 15 * 1024 * 1024) {
        alert(`Berkas "${file.name}" melebihi batas 15MB. Mohon gunakan berkas yang lebih ringan.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const fileType = getFileType(file.name, file.type);
          const newAtt: NewsAttachment = {
            id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            name: file.name,
            fileType,
            fileSize: formatFileSize(file.size),
            url: reader.result,
            uploadDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
          };

          setFormData((prev) => ({
            ...prev,
            attachments: [...(prev.attachments || []), newAtt]
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAttachmentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleAttachmentFiles(e.target.files);
    }
  };

  const handleRemoveAttachment = (attId: string) => {
    setFormData((prev) => ({
      ...prev,
      attachments: (prev.attachments || []).filter((a) => a.id !== attId)
    }));
  };

  const handleAddSampleAttachment = (type: 'pdf' | 'docx' | 'xlsx') => {
    let sample: NewsAttachment;
    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    if (type === 'pdf') {
      sample = {
        id: `att-${Date.now()}`,
        name: 'Berita_Acara_Pelaksanaan_dan_Penilaian.pdf',
        fileType: 'pdf',
        fileSize: '1.6 MB',
        url: '#',
        uploadDate: today
      };
    } else if (type === 'docx') {
      sample = {
        id: `att-${Date.now()}`,
        name: 'Format_Surat_Keterangan_dan_Juknis.docx',
        fileType: 'docx',
        fileSize: '540 KB',
        url: '#',
        uploadDate: today
      };
    } else {
      sample = {
        id: `att-${Date.now()}`,
        name: 'Rekapitulasi_Data_Peserta_dan_Hasil.xlsx',
        fileType: 'xlsx',
        fileSize: '380 KB',
        url: '#',
        uploadDate: today
      };
    }

    setFormData((prev) => ({
      ...prev,
      attachments: [...(prev.attachments || []), sample]
    }));
  };

  // Handle content images (photo gallery / inline documentation)
  const handleContentImageFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileArray.length === 0) {
      alert('Mohon pilih berkas gambar yang valid (JPG, PNG, atau WebP).');
      return;
    }

    fileArray.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`Berkas "${file.name}" melebihi batas 10MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const newImg: NewsContentImage = {
            id: `cimg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            url: reader.result,
            caption: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
          };

          setFormData((prev) => ({
            ...prev,
            contentImages: [...(prev.contentImages || []), newImg]
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleContentImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleContentImageFiles(e.target.files);
    }
  };

  const handleRemoveContentImage = (imgId: string) => {
    setFormData((prev) => ({
      ...prev,
      contentImages: (prev.contentImages || []).filter((img) => img.id !== imgId)
    }));
  };

  const handleUpdateContentImageCaption = (imgId: string, caption: string) => {
    setFormData((prev) => ({
      ...prev,
      contentImages: (prev.contentImages || []).map((img) => 
        img.id === imgId ? { ...img, caption } : img
      )
    }));
  };

  const handleInsertSnippet = (snippet: string) => {
    setFormData((prev) => ({
      ...prev,
      content: (prev.content ? prev.content.trim() + '\n\n' : '') + snippet
    }));
  };

  // Test download attachment
  const handleDownloadAttachment = (att: NewsAttachment) => {
    if (!att.url || att.url === '#') {
      alert(`[SIMULASI DOWNLOAD]\nBerkas: "${att.name}" (${att.fileSize})\nTipe: ${att.fileType.toUpperCase()}\nStatus: Siap diunduh oleh pembaca.`);
      return;
    }
    const link = document.createElement('a');
    link.href = att.url;
    link.download = att.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle article image upload from device
  const handleArticleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih berkas gambar yang valid (JPG, PNG, atau WebP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert('Ukuran berkas melebihi 8MB. Mohon gunakan foto yang lebih ringan.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setFormData((prev) => ({
          ...prev,
          image: reader.result as string
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleArticleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsArticleDragging(true);
  };

  const handleArticleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsArticleDragging(false);
  };

  const handleArticleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsArticleDragging(false);
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
        setFormData((prev) => ({
          ...prev,
          image: reader.result as string
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Calculate statistics for articles
  const totalViews = newsList.reduce((acc, curr) => acc + curr.views, 0);
  const avgViews = newsList.length > 0 ? Math.round(totalViews / newsList.length) : 0;
  const headlineCount = newsList.filter((n) => n.isHeadline).length;

  // Filtered news
  const filteredNews = newsList.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = 
      selectedCategory === 'SEMUA' || 
      (selectedCategory === 'HEADLINE' ? item.isHeadline : item.category === selectedCategory);
    return matchSearch && matchCat;
  });

  // Toggle article headline status on the fly
  const handleToggleHeadline = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = newsList.map((item) => {
      if (item.id === id) {
        return { ...item, isHeadline: !item.isHeadline };
      }
      return item;
    });
    onUpdateNews(updated);
  };

  // Pending testimonials count for notification badge
  const pendingTestimonialsCount = testimonials.filter((t) => t.status === 'pending').length;

  const handleOpenAddModal = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      category: 'Kegiatan',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
      summary: '',
      content: '',
      author: adminUser.name || 'Tim Redaksi SMK YAPEK',
      views: 0,
      status: 'published',
      isHeadline: true,
      tags: ['SMK YAPEK', 'Vokasi'],
      attachments: [],
      contentImages: []
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: NewsItem) => {
    setEditingArticle(item);
    setFormData({ 
      ...item,
      isHeadline: item.isHeadline ?? false,
      attachments: item.attachments || [],
      contentImages: item.contentImages || []
    });
    setIsModalOpen(true);
  };

  const handleDeleteArticle = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus artikel berita ini dari portal?')) {
      const updated = newsList.filter((n) => n.id !== id);
      onUpdateNews(updated);
    }
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.content?.trim()) return;

    if (editingArticle) {
      const updated = newsList.map((item) =>
        item.id === editingArticle.id
          ? ({ 
              ...item, 
              ...formData, 
              isHeadline: formData.isHeadline ?? false,
              attachments: formData.attachments || [],
              contentImages: formData.contentImages || [],
              id: editingArticle.id 
            } as NewsItem)
          : item
      );
      onUpdateNews(updated);
    } else {
      const newItem: NewsItem = {
        id: `news-${Date.now()}`,
        title: formData.title.trim(),
        category: formData.category || 'Kegiatan',
        date: formData.date || 'Hari ini',
        image: formData.image || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
        summary: formData.summary?.trim() || formData.title.trim(),
        content: formData.content.trim(),
        author: formData.author?.trim() || adminUser.name,
        views: formData.views || 0,
        status: 'published',
        isHeadline: formData.isHeadline ?? true,
        tags: formData.tags || ['SMK YAPEK'],
        attachments: formData.attachments || [],
        contentImages: formData.contentImages || []
      };
      onUpdateNews([newItem, ...newsList]);
    }

    setIsModalOpen(false);
  };

  const navTabs: { id: AdminTab; label: string; icon: React.ElementType; badge?: string | number; badgeColor?: string }[] = [
    { id: 'traffic', label: 'Trafik & Pengunjung', icon: BarChart3 },
    { 
      id: 'gallery', 
      label: 'Galeri Kegiatan', 
      icon: Camera, 
      badge: galleryItems.length,
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-sky-300'
    },
    { 
      id: 'testimonials', 
      label: 'Testimoni Alumni', 
      icon: Quote, 
      badge: pendingTestimonialsCount > 0 ? pendingTestimonialsCount : undefined,
      badgeColor: 'bg-amber-500 text-slate-950'
    },
    { id: 'headmaster', label: 'Foto & Profil Kepala Sekolah', icon: UserCheck },
    { id: 'identity', label: 'Identitas Sekolah', icon: Building2 },
    { id: 'articles', label: 'Berita & Berita Acara', icon: FileText },
    { id: 'ppdb', label: 'Pendaftar PPDB', icon: Users, badge: applicants.length },
    { 
      id: 'database', 
      label: 'Database Spreadsheet (Google Sheets & Excel)', 
      icon: FileSpreadsheet, 
      badge: 'Google Sheets', 
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
    },
    { 
      id: 'users', 
      label: 'Hak Akses & Akun', 
      icon: ShieldAlert, 
      badge: adminUsers.length, 
      badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' 
    }
  ];

  return (
    <div className={`min-h-screen py-6 px-4 sm:px-6 lg:px-8 transition-colors ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50/70 text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Sticky Header */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0F4374] to-blue-600 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-slate-900 dark:text-white">
                  CMS SMK YAPEK GOMBONG
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  v2.6 Terpadu
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pusat Kendali Profil, Sambutan Kepala Sekolah, Testimoni & Trafik Web
              </p>
            </div>
          </div>

          {/* User Info & Quick Action Buttons */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* User Pill */}
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
              <img
                src={adminUser.avatar}
                alt={adminUser.name}
                className="w-7 h-7 rounded-xl object-cover border border-amber-400"
              />
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {adminUser.name}
                </div>
                <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold leading-tight">
                  {adminUser.role}
                </div>
              </div>
            </div>

            {/* Front-End Preview Button */}
            <button
              onClick={onExitAdmin}
              className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#0F4374] dark:text-sky-400" />
              <span>Lihat Website</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={onLogoutAdmin}
              className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-colors border border-rose-200 dark:border-rose-900"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="overflow-x-auto pb-1 scrollbar-thin">
          <div className="flex items-center gap-2 min-w-max p-1.5 rounded-2xl bg-slate-200/70 dark:bg-slate-900/90 border border-slate-300/60 dark:border-slate-800">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeAdminTab === tab.id;
              const hasAccess = userHasAccess(tab.id);

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveAdminTab(tab.id)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bg-[#0F4374] text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60'
                  } ${!hasAccess ? 'opacity-75' : ''}`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {!hasAccess && (
                    <Lock className="w-3 h-3 text-slate-400 dark:text-slate-500 ml-0.5" />
                  )}
                  {tab.badge !== undefined && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      tab.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-slate-300 dark:bg-slate-800 text-slate-700 dark:text-slate-300')
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ACCESS RESTRICTION NOTICE */}
        {!userHasAccess(activeAdminTab) && (
          <div className="p-8 sm:p-12 rounded-3xl border border-amber-200 dark:border-amber-900/60 bg-white dark:bg-slate-900 shadow-sm text-center max-w-2xl mx-auto space-y-4 my-6">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Hak Akses Modul Dibatasi
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
                Akun Anda saat ini (<strong>{adminUser.name}</strong> - <em>{adminUser.role}</em>) tidak memiliki izin akses untuk modul <strong>{navTabs.find(t => t.id === activeAdminTab)?.label}</strong>.
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Silakan hubungi <strong>Super Admin CMS</strong> jika Anda memerlukan penyesuaian hak akses akun.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  const firstAllowed = navTabs.find(t => userHasAccess(t.id));
                  if (firstAllowed) setActiveAdminTab(firstAllowed.id);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#0F4374] hover:bg-blue-900 text-white font-bold text-xs transition-colors shadow-sm"
              >
                Buka Modul Yang Diizinkan
              </button>
            </div>
          </div>
        )}

        {/* TAB 1: TRAFIK & PENGUNJUNG */}
        {userHasAccess('traffic') && activeAdminTab === 'traffic' && (
          <AdminTrafficSection
            trafficData={trafficData}
            trafficSources={trafficSources}
            topPages={topPages}
            visitorLogs={visitorLogs}
            onRefreshTraffic={onRefreshTraffic}
            isDarkMode={isDarkMode}
          />
        )}

        {/* TAB 2: GALERI KEGIATAN & CRUD UPLOAD FOTO */}
        {activeAdminTab === 'gallery' && (
          <AdminGallerySection
            galleryItems={galleryItems}
            onUpdateGallery={onUpdateGallery || (() => {})}
            isDarkMode={isDarkMode}
          />
        )}

        {/* TAB 3: TESTIMONI ALUMNI & MODERASI SHARING */}
        {activeAdminTab === 'testimonials' && (
          <AdminTestimonialsSection
            testimonials={testimonials}
            onUpdateTestimonials={onUpdateTestimonials}
            isDarkMode={isDarkMode}
          />
        )}

        {/* TAB 3: KEPALA SEKOLAH & SAMBUTAN */}
        {activeAdminTab === 'headmaster' && (
          <AdminHeadmasterSection
            headmaster={headmaster}
            onUpdateHeadmaster={onUpdateHeadmaster}
            isDarkMode={isDarkMode}
          />
        )}

        {/* TAB 4: IDENTITAS & BRANDING SEKOLAH */}
        {activeAdminTab === 'identity' && (
          <AdminIdentitySection
            schoolInfo={schoolInfo}
            onUpdateSchoolInfo={onUpdateSchoolInfo}
            onNavigateToTab={onNavigateToTab}
            isDarkMode={isDarkMode}
          />
        )}

        {/* TAB 5: BERITA & WARTA SEKOLAH */}
        {activeAdminTab === 'articles' && (
          <div className="space-y-6">
            {/* Articles Top Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#0F4374] to-[#17528a] text-white shadow-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
                    Portal Humas & Warta
                  </span>
                  <span className="text-xs text-blue-200">Total {newsList.length} Berita & Acara Tayang</span>
                </div>
                <h2 className="text-2xl font-black">Kelola Berita, Berita Acara & Pengumuman</h2>
                <p className="text-xs text-blue-100">
                  Tulis artikel berita, dokumentasi berita acara, prestasi siswa, sosialisasi PPDB, dan kabar BKK
                </p>
              </div>

              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Tulis Berita / Berita Acara Baru</span>
              </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <span className="text-xs font-bold text-slate-400">Total Berita</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {newsList.length} Artikel
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Semua aktif di portal</p>
              </div>

              <div className="p-4 rounded-2xl border border-amber-300/80 dark:border-amber-800/80 bg-gradient-to-br from-amber-50/60 to-white dark:from-amber-950/30 dark:to-slate-900 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-300">Slider Headline Header</span>
                  <span className="p-1 rounded-lg bg-amber-400 text-slate-950">
                    <Star className="w-3.5 h-3.5 fill-slate-950" />
                  </span>
                </div>
                <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                  {headlineCount} Headline
                </div>
                <p className="text-[10px] text-amber-700/80 dark:text-amber-400/80 mt-0.5">Berputar otomatis di slider</p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <span className="text-xs font-bold text-slate-400">Total Pembaca Artikel</span>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                  {totalViews.toLocaleString('id-ID')} Views
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Penayangan kumulatif</p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <span className="text-xs font-bold text-slate-400">Rata-rata Penayangan</span>
                <div className="text-2xl font-black text-[#0F4374] dark:text-sky-400 mt-1">
                  {avgViews.toLocaleString('id-ID')} / Artikel
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Minat pembaca tinggi</p>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
                {[
                  { id: 'SEMUA', label: 'SEMUA' },
                  { id: 'HEADLINE', label: `⭐ HEADLINE (${headlineCount})` },
                  { id: 'PPDB', label: 'PPDB' },
                  { id: 'Prestasi', label: 'Prestasi' },
                  { id: 'Kegiatan', label: 'Kegiatan' },
                  { id: 'BKK', label: 'BKK' },
                  { id: 'Akademik', label: 'Akademik' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                      selectedCategory === cat.id
                        ? 'bg-[#0F4374] text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari judul berita, penulis..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0F4374]"
                />
              </div>
            </div>

            {/* News Items Table */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">Artikel Berita</th>
                      <th className="py-3.5 px-4">Kategori</th>
                      <th className="py-3.5 px-4 text-center">Slider Headline</th>
                      <th className="py-3.5 px-4">Tanggal & Penulis</th>
                      <th className="py-3.5 px-4 text-center">Pembaca</th>
                      <th className="py-3.5 px-4 text-right">Aksi Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {filteredNews.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                                {item.title}
                              </div>
                              <div className="text-[11px] text-slate-400 line-clamp-1">
                                {item.summary}
                              </div>
                              {/* Attached media indicators */}
                              {((item.attachments && item.attachments.length > 0) || (item.contentImages && item.contentImages.length > 0)) && (
                                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                  {item.attachments && item.attachments.length > 0 && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.5 rounded-md border border-amber-200/80 dark:border-amber-800">
                                      <Paperclip className="w-2.5 h-2.5" />
                                      <span>{item.attachments.length} Berkas</span>
                                    </span>
                                  )}
                                  {item.contentImages && item.contentImages.length > 0 && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50 px-1.5 py-0.5 rounded-md border border-sky-200/80 dark:border-sky-800">
                                      <Camera className="w-2.5 h-2.5" />
                                      <span>{item.contentImages.length} Foto</span>
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#0F4374] dark:bg-blue-950 dark:text-sky-300 border border-blue-200 dark:border-blue-900">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={(e) => handleToggleHeadline(item.id, e)}
                            title={item.isHeadline ? 'Status: Headline Aktif (Klik untuk non-aktifkan)' : 'Status: Bukan Headline (Klik untuk jadikan headline)'}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                              item.isHeadline
                                ? 'bg-amber-400 hover:bg-amber-500 text-slate-950 font-black shadow-xs ring-2 ring-amber-400/30'
                                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            <Star className={`w-3 h-3 ${item.isHeadline ? 'fill-slate-950 text-slate-950' : 'text-slate-400'}`} />
                            <span>{item.isHeadline ? 'Yes (Headline)' : 'No'}</span>
                          </button>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-800 dark:text-slate-200">{item.date}</div>
                          <div className="text-[10px] text-slate-400">{item.author}</div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                            {item.views.toLocaleString('id-ID')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onSelectArticle(item.id)}
                              title="Buka Halaman Artikel"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-[#0F4374] hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenEditModal(item)}
                              title="Edit Artikel"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteArticle(item.id)}
                              title="Hapus Artikel"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: PENDAFTAR PPDB */}
        {activeAdminTab === 'ppdb' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#0F4374] to-[#17528a] text-white shadow-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
                    Sistem Penerimaan Peserta Didik Baru
                  </span>
                  <span className="text-xs text-blue-200">{applicants.length} Berkas Terdaftar</span>
                </div>
                <h2 className="text-2xl font-black">Data Calon Peserta Didik Baru (PPDB 2026/2027)</h2>
                <p className="text-xs text-blue-100">
                  Verifikasi berkas, pantau pilihan jurusan, nilai rapor dan cetak bukti registrasi
                </p>
              </div>

              <button
                onClick={() => {
                  alert('Data calon siswa berhasil diekspor dalam format Excel / CSV.');
                }}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all self-start sm:self-auto"
              >
                <span>Unduh Laporan Excel</span>
              </button>
            </div>

            {/* Applicants Table */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">No. Registrasi & Nama</th>
                      <th className="py-3.5 px-4">NISN</th>
                      <th className="py-3.5 px-4">Asal Sekolah</th>
                      <th className="py-3.5 px-4">Pilihan Jurusan</th>
                      <th className="py-3.5 px-4">Jalur & Nilai</th>
                      <th className="py-3.5 px-4 text-center">Status Verifikasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {applicants.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">{app.fullName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{app.id}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono">{app.nisn}</td>
                        <td className="py-3.5 px-4">{app.originSchool}</td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-[#0F4374] dark:text-sky-300">{app.firstMajor}</span>
                          <span className="text-[10px] text-slate-400 block">Pilihan 2: {app.secondMajor}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                            {app.track}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Rata Rapor: {app.avgReportScore}</span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: DATABASE SPREADSHEET (GOOGLE SHEETS & EXCEL) */}
        {userHasAccess('database') && activeAdminTab === 'database' && (
          <AdminDatabaseSection
            newsList={newsList}
            applicants={applicants}
            schoolInfo={schoolInfo}
            adminUsers={adminUsers}
            testimonials={testimonials}
            galleryItems={galleryItems}
            onUpdateApplicants={onUpdateApplicants}
            onUpdateNews={onUpdateNews}
            onUpdateSchoolInfo={onUpdateSchoolInfo}
            onUpdateTestimonials={onUpdateTestimonials}
            onUpdateGallery={onUpdateGallery}
            isDarkMode={isDarkMode}
          />
        )}

        {/* TAB 8: HAK AKSES & AKUN ADMIN CMS */}
        {userHasAccess('users') && activeAdminTab === 'users' && (
          <AdminUsersSection
            adminUsers={adminUsers}
            currentAdmin={adminUser}
            onUpdateAdminUsers={onUpdateAdminUsers || (() => {})}
            isDarkMode={isDarkMode}
          />
        )}

      </div>

      {/* MODAL: TAMBAH / EDIT BERITA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="max-w-2xl w-full my-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingArticle ? 'Edit Berita & Perbarui Konten' : 'Tambah Berita Baru ke Portal'}
                </h3>
                <p className="text-xs text-slate-400">
                  Publikasikan warta prestasi, pengumuman PPDB, kegiatan, atau info BKK
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Berita *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan judul berita yang informatif dan menarik..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="PPDB">PPDB</option>
                    <option value="Prestasi">Prestasi</option>
                    <option value="Kegiatan">Kegiatan</option>
                    <option value="BKK">BKK</option>
                    <option value="Akademik">Akademik</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Penulis / Unit *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Jumlah Views Awal
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.views}
                    onChange={(e) => setFormData({ ...formData, views: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              {/* Opsi Tampilkan Sebagai Headline Slider (Yes / No) */}
              <div className="p-4 rounded-2xl border border-amber-300/80 dark:border-amber-800/80 bg-gradient-to-r from-amber-50/90 via-amber-50/50 to-white dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500 text-slate-950 flex-shrink-0 shadow-sm">
                    <Star className="w-5 h-5 fill-slate-950" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Jadikan Headline Berita Utama?</span>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider ${
                        formData.isHeadline 
                          ? 'bg-amber-400 text-slate-950 shadow-xs' 
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {formData.isHeadline ? 'Yes (Aktif di Slider)' : 'No (Bukan Headline)'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                      Jika dipilih <strong>Yes</strong>, artikel ini akan otomatis tampil dan berputar pada <em>Slider Otomatis</em> di bagian Header Beranda portal.
                    </p>
                  </div>
                </div>

                {/* Yes / No Toggle Button Group */}
                <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-amber-300 dark:border-slate-800 shadow-xs self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isHeadline: true })}
                    className={`px-4 py-2 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all ${
                      formData.isHeadline
                        ? 'bg-amber-500 text-slate-950 shadow-sm ring-1 ring-amber-500'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Yes (Ya)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isHeadline: false })}
                    className={`px-4 py-2 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all ${
                      !formData.isHeadline
                        ? 'bg-slate-700 text-white shadow-sm ring-1 ring-slate-600'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <X className="w-4 h-4" />
                    <span>No (Tidak)</span>
                  </button>
                </div>
              </div>

              {/* Upload Foto Dokumentasi & Gambar Berita Acara */}
              <div className="space-y-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#0F4374] dark:text-sky-400" />
                    <span>Foto Dokumentasi / Gambar Berita Acara *</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300">
                      Upload Gambar
                    </span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    JPG, PNG, WebP (Maks. 8MB)
                  </span>
                </div>

                {/* Hidden file input for article */}
                <input
                  type="file"
                  ref={articleFileInputRef}
                  accept="image/*"
                  onChange={handleArticleImageUpload}
                  className="hidden"
                />

                {/* Live Preview Container */}
                <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 aspect-video max-h-48 sm:max-h-56 group">
                  {formData.image ? (
                    <>
                      <img
                        src={formData.image}
                        alt="Preview Berita"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-3.5 pointer-events-none">
                        <div className="flex justify-between items-start">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 shadow-xs">
                            {formData.category || 'Berita'}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                            {formData.image.startsWith('data:') ? 'Berkas Lokal' : 'Tautan Web'}
                          </span>
                        </div>
                        <div className="text-white text-xs font-bold line-clamp-1">
                          {formData.title || 'Pratinjau Judul Berita...'}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: '' })}
                        title="Hapus foto berita"
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-600/90 hover:bg-rose-700 text-white shadow-md transition-colors pointer-events-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <div
                      onClick={() => articleFileInputRef.current?.click()}
                      className="w-full h-full flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-800/80 transition-colors"
                    >
                      <Camera className="w-8 h-8 mb-1.5 opacity-60 text-sky-400" />
                      <span className="text-xs font-bold text-slate-300">Belum Ada Foto Berita</span>
                      <span className="text-[10px] text-slate-400">Klik untuk upload foto dokumentasi</span>
                    </div>
                  )}
                </div>

                {/* Dropzone & Quick Buttons */}
                <div className="space-y-2.5">
                  <div
                    onDragOver={handleArticleDragOver}
                    onDragLeave={handleArticleDragLeave}
                    onDrop={handleArticleDrop}
                    onClick={() => articleFileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all ${
                      isArticleDragging
                        ? 'border-[#0F4374] bg-blue-50 dark:bg-blue-950/40 scale-[1.01]'
                        : 'border-slate-300 dark:border-slate-700 hover:border-[#0F4374] dark:hover:border-sky-400 bg-white dark:bg-slate-900/80'
                    }`}
                  >
                    <Upload className="w-4 h-4 mx-auto text-[#0F4374] dark:text-sky-400 mb-1" />
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Pilih & Upload Foto Berita dari Komputer / HP
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      atau seret berkas gambar langsung ke area ini
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => articleFileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-[#0F4374] hover:bg-[#154e85] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{formData.image ? 'Ganti Foto Berita' : 'Upload Berkas'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowArticlePresets(!showArticlePresets)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                        showArticlePresets
                          ? 'border-amber-400 bg-amber-50 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200'
                          : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Preset Foto Berita & Vokasi</span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${showArticlePresets ? 'rotate-180' : ''}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowArticleUrlInput(!showArticleUrlInput)}
                      className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-xs flex items-center gap-1 transition-colors"
                    >
                      <Link className="w-3.5 h-3.5" />
                      <span>{showArticleUrlInput ? 'Tutup URL' : 'Opsi Tautan Web'}</span>
                    </button>
                  </div>
                </div>

                {/* Preset Picker Grid */}
                {showArticlePresets && (
                  <div className="p-3 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 space-y-2 mt-2">
                    <div className="text-[11px] font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Pilih Foto Berita & Dokumentasi Siap Pakai:</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {NEWS_IMAGE_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, image: preset.url });
                            setShowArticlePresets(false);
                          }}
                          className={`group p-2 rounded-lg border text-left transition-all ${
                            formData.image === preset.url
                              ? 'border-amber-500 bg-amber-100 dark:bg-amber-900/50 shadow-xs'
                              : 'border-slate-200 dark:border-slate-700 hover:border-amber-400 bg-white dark:bg-slate-800'
                          }`}
                        >
                          <div className="relative aspect-video rounded-md overflow-hidden mb-1.5 bg-slate-200">
                            <img
                              src={preset.url}
                              alt={preset.label}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-slate-900/80 text-white">
                              {preset.category}
                            </span>
                          </div>
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

                {/* Collapsible URL Input */}
                {showArticleUrlInput && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60">
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Tempel URL Gambar Eksternal:
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#0F4374]"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ringkasan Berita (Lead Summary) *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ringkasan 1-2 kalimat yang tampil di kartu depan..."
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-4 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                {/* Header & Quick Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-200/80 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>Konten Lengkap Berita & Berita Acara *</span>
                      </label>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0F4374] text-white">
                        Wajib Diisi
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Tulis naskah lengkap, unggah foto dokumentasi, dan lampirkan dokumen resmi (PDF, DOCX, XLSX, dll.)
                    </p>
                  </div>

                  {/* Quick Action Upload Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => contentImageFileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl bg-sky-100 hover:bg-sky-200 dark:bg-sky-950/70 dark:hover:bg-sky-900 text-sky-800 dark:text-sky-300 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>+ Upload Foto Konten</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => attachmentFileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/70 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>+ Upload File (PDF/DOCX)</span>
                    </button>
                  </div>
                </div>

                {/* Hidden File Inputs */}
                <input
                  ref={contentImageFileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleContentImageInputChange}
                  className="hidden"
                />
                <input
                  ref={attachmentFileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  multiple
                  onChange={handleAttachmentInputChange}
                  className="hidden"
                />

                {/* Quick Snippet formatting bar */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-[11px] font-semibold text-slate-400">Sisipkan Format Cepat:</span>
                  <button
                    type="button"
                    onClick={() => handleInsertSnippet('### Sub-Judul Bagian Berita\nIsi rincian kegiatan atau poin penjelasan di paragraf ini...')}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                  >
                    ### Sub-Judul
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertSnippet('• Poin 1: Pelaksanaan kegiatan\n• Poin 2: Hasil evaluasi & prestasi\n• Poin 3: Rekomendasi tindak lanjut')}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                  >
                    • Poin Penjelasan
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertSnippet('> PERHATIAN / CATATAN KHUSUS:\nInformasi dan petunjuk teknis ini berlaku untuk seluruh peserta dan wajib ditaati.')}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                  >
                    ℹ️ Catatan Resmi
                  </button>
                </div>

                {/* Main Content Textarea */}
                <div className="space-y-1">
                  <textarea
                    rows={8}
                    required
                    placeholder="Tuliskan naskah isi berita lengkap di sini. Pisahkan antar-paragraf dengan baris kosong (tekan Enter dua kali)..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0F4374] dark:focus:ring-sky-500 shadow-2xs font-sans"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                    <span>
                      {formData.content ? formData.content.split(/\s+/).filter(Boolean).length : 0} kata | {(formData.content || '').length} karakter
                    </span>
                    <span className="hidden sm:inline">Tips: Pisahkan paragraf dengan Enter 2 kali</span>
                  </div>
                </div>

                {/* SUB-SECTION 1: UPLOAD & KELOLA BERKAS LAMPIRAN DOKUMEN (PDF, DOCX, XLSX, DLL) */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                        <Paperclip className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>Berkas Lampiran Dokumen (PDF, DOCX, XLSX, dll.)</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300">
                            {formData.attachments?.length || 0} Berkas Terlampir
                          </span>
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          Berkas resmi yang dapat diunduh langsung oleh pembaca di halaman berita
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => attachmentFileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl bg-[#0F4374] hover:bg-blue-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all self-start sm:self-auto"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Pilih Berkas Lampiran</span>
                    </button>
                  </div>

                  {/* Document Dropzone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsAttachmentDragging(true); }}
                    onDragLeave={(e) => { e.preventDefault(); setIsAttachmentDragging(false); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsAttachmentDragging(false);
                      if (e.dataTransfer.files) handleAttachmentFiles(e.dataTransfer.files);
                    }}
                    onClick={() => attachmentFileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-3.5 text-center cursor-pointer transition-all ${
                      isAttachmentDragging
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 scale-[1.01]'
                        : 'border-slate-300 dark:border-slate-700 hover:border-amber-500 bg-white/70 dark:bg-slate-900/40'
                    }`}
                  >
                    <Paperclip className="w-5 h-5 mx-auto text-amber-600 dark:text-amber-400 mb-1" />
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Tarik & Lepas File PDF, DOCX, XLSX ke Sini atau Klik untuk Memilih
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Mendukung format: PDF, Word (DOC/DOCX), Excel (XLS/XLSX), PPTX, ZIP (Maks. 15MB per file)
                    </div>
                  </div>

                  {/* Preset Template Lampiran Sekolah */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[10px] text-slate-400 font-semibold">Lampirkan Cepat Template:</span>
                    <button
                      type="button"
                      onClick={() => handleAddSampleAttachment('pdf')}
                      className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span className="font-mono font-bold text-[9px] bg-rose-600 text-white px-1 rounded">PDF</span>
                      <span>+ Berita Acara Resmi</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddSampleAttachment('docx')}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span className="font-mono font-bold text-[9px] bg-blue-600 text-white px-1 rounded">DOCX</span>
                      <span>+ Format Juknis & Laporan</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddSampleAttachment('xlsx')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span className="font-mono font-bold text-[9px] bg-emerald-600 text-white px-1 rounded">XLSX</span>
                      <span>+ Rekapitulasi Data</span>
                    </button>
                  </div>

                  {/* Attached Files List */}
                  {formData.attachments && formData.attachments.length > 0 && (
                    <div className="space-y-2 mt-2">
                      {formData.attachments.map((att) => {
                        let badgeBg = 'bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700';
                        let tagColor = 'bg-slate-700 text-white';
                        if (att.fileType === 'pdf') {
                          badgeBg = 'bg-rose-50/90 border-rose-200 dark:bg-rose-950/30 dark:border-rose-900';
                          tagColor = 'bg-rose-600 text-white';
                        } else if (att.fileType === 'docx' || att.fileType === 'doc') {
                          badgeBg = 'bg-blue-50/90 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900';
                          tagColor = 'bg-blue-600 text-white';
                        } else if (att.fileType === 'xlsx' || att.fileType === 'xls') {
                          badgeBg = 'bg-emerald-50/90 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900';
                          tagColor = 'bg-emerald-600 text-white';
                        } else if (att.fileType === 'pptx') {
                          badgeBg = 'bg-amber-50/90 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900';
                          tagColor = 'bg-amber-600 text-white';
                        } else if (att.fileType === 'image') {
                          badgeBg = 'bg-purple-50/90 border-purple-200 dark:bg-purple-950/30 dark:border-purple-900';
                          tagColor = 'bg-purple-600 text-white';
                        }

                        return (
                          <div
                            key={att.id}
                            className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 ${badgeBg}`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase font-mono tracking-wider ${tagColor}`}>
                                {att.fileType}
                              </span>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                  {att.name}
                                </div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                  <span>{att.fileSize}</span>
                                  {att.uploadDate && <span>• Diunggah: {att.uploadDate}</span>}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleDownloadAttachment(att)}
                                title="Unduh / Tes Buka Berkas"
                                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-[#0F4374] dark:hover:text-sky-400 border border-slate-200 dark:border-slate-700 text-xs transition-colors"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveAttachment(att.id)}
                                title="Hapus Lampiran"
                                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 border border-slate-200 dark:border-slate-700 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* SUB-SECTION 2: UPLOAD GAMBAR DOKUMENTASI KONTEN / GALERI BERITA */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400">
                        <Camera className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>Dokumentasi Foto Tambahan / Galeri Konten</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-200 dark:bg-sky-900/60 text-sky-900 dark:text-sky-300">
                            {formData.contentImages?.length || 0} Foto
                          </span>
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          Foto liputan kegiatan tambahan yang tampil di bagian akhir berita atau disisipkan ke naskah
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => contentImageFileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all self-start sm:self-auto"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Pilih Foto Tambahan</span>
                    </button>
                  </div>

                  {/* Content Images Grid */}
                  {formData.contentImages && formData.contentImages.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {formData.contentImages.map((img) => (
                        <div
                          key={img.id}
                          className="rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs space-y-2 p-2"
                        >
                          <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                            <img
                              src={img.url}
                              alt={img.caption || 'Foto Dokumentasi'}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveContentImage(img.id)}
                              title="Hapus Foto"
                              className="absolute top-1.5 right-1.5 p-1 rounded-md bg-rose-600 text-white hover:bg-rose-700 shadow transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="space-y-1.5">
                            <input
                              type="text"
                              placeholder="Keterangan foto (caption)..."
                              value={img.caption || ''}
                              onChange={(e) => handleUpdateContentImageCaption(img.id, e.target.value)}
                              className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
                            />
                            <button
                              type="button"
                              onClick={() => handleInsertSnippet(`[Foto Dokumentasi: ${img.caption || 'Kegiatan Sekolah'}]`)}
                              className="w-full py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[10px] font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                            >
                              + Sisipkan Rujukan ke Teks
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      onClick={() => contentImageFileInputRef.current?.click()}
                      className="border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-3 text-center cursor-pointer hover:bg-sky-50/40 dark:hover:bg-sky-950/20 transition-colors"
                    >
                      <Camera className="w-5 h-5 mx-auto text-sky-500 mb-1 opacity-70" />
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        Belum ada foto dokumentasi tambahan. Klik untuk unggah gambar kegiatan (JPG/PNG).
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black flex items-center gap-1.5 shadow"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan & Publikasikan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
