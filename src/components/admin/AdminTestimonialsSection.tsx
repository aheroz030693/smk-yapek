import React, { useState } from 'react';
import { AlumniTestimonial } from '../../types';
import { 
  Star, 
  CheckCircle2, 
  XCircle, 
  Share2, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Clock, 
  ExternalLink, 
  Sparkles, 
  Quote, 
  Building2, 
  GraduationCap, 
  Briefcase, 
  Check, 
  Copy, 
  AlertCircle,
  X,
  Save,
  MessageSquare
} from 'lucide-react';

interface AdminTestimonialsSectionProps {
  testimonials: AlumniTestimonial[];
  onUpdateTestimonials: (updated: AlumniTestimonial[]) => void;
  isDarkMode: boolean;
}

export const AdminTestimonialsSection: React.FC<AdminTestimonialsSectionProps> = ({
  testimonials,
  onUpdateTestimonials,
  isDarkMode
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMajor, setSelectedMajor] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AlumniTestimonial | null>(null);
  const [formData, setFormData] = useState<Partial<AlumniTestimonial>>({
    name: '',
    graduationYear: 2025,
    major: 'Teknik Komputer & Jaringan (TKJ)',
    role: '',
    company: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    content: '',
    highlight: '',
    rating: 5,
    status: 'approved'
  });

  // Calculate stats
  const totalCount = testimonials.length;
  const pendingCount = testimonials.filter((t) => t.status === 'pending').length;
  const approvedCount = testimonials.filter((t) => t.status === 'approved' || !t.status).length;
  const rejectedCount = testimonials.filter((t) => t.status === 'rejected').length;

  // Filter list
  const filteredList = testimonials.filter((item) => {
    // Status filter
    let statusMatch = true;
    if (activeTab === 'pending') statusMatch = item.status === 'pending';
    else if (activeTab === 'approved') statusMatch = item.status === 'approved' || !item.status;
    else if (activeTab === 'rejected') statusMatch = item.status === 'rejected';

    // Search filter
    const searchMatch = !searchQuery.trim() ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());

    // Major filter
    const majorMatch = selectedMajor === 'all' || item.major.toUpperCase().includes(selectedMajor.toUpperCase());

    return statusMatch && searchMatch && majorMatch;
  });

  // Actions
  const handleApproveAndShare = (id: string) => {
    const updated = testimonials.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          status: 'approved' as const,
          sharedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        };
      }
      return t;
    });
    onUpdateTestimonials(updated);
  };

  const handleUnshare = (id: string) => {
    const updated = testimonials.map((t) => {
      if (t.id === id) {
        return { ...t, status: 'pending' as const };
      }
      return t;
    });
    onUpdateTestimonials(updated);
  };

  const handleReject = (id: string) => {
    const updated = testimonials.map((t) => {
      if (t.id === id) {
        return { ...t, status: 'rejected' as const };
      }
      return t;
    });
    onUpdateTestimonials(updated);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Hapus permanen testimoni alumni ini?')) {
      const updated = testimonials.filter((t) => t.id !== id);
      onUpdateTestimonials(updated);
    }
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      graduationYear: 2025,
      major: 'Teknik Komputer & Jaringan (TKJ)',
      role: '',
      company: '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      content: '',
      highlight: 'Lulusan Sukses Bekerja di Industri',
      rating: 5,
      status: 'approved'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: AlumniTestimonial) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.content?.trim()) return;

    if (editingItem) {
      // Update
      const updated = testimonials.map((t) => {
        if (t.id === editingItem.id) {
          return {
            ...t,
            ...formData,
            id: editingItem.id
          } as AlumniTestimonial;
        }
        return t;
      });
      onUpdateTestimonials(updated);
    } else {
      // Add
      const newItem: AlumniTestimonial = {
        id: `testi-${Date.now()}`,
        name: formData.name.trim(),
        graduationYear: Number(formData.graduationYear) || 2025,
        major: formData.major || 'Teknik Komputer & Jaringan (TKJ)',
        role: formData.role?.trim() || 'Alumni Profesional',
        company: formData.company?.trim() || 'Dunia Usaha / Industri',
        avatar: formData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        content: formData.content.trim(),
        rating: Number(formData.rating) || 5,
        highlight: formData.highlight?.trim() || 'Verifikasi Tracer Study BKK',
        status: (formData.status as 'approved' | 'pending' | 'rejected') || 'approved',
        sharedAt: formData.status === 'approved' ? 'Hari ini' : undefined,
        submittedAt: 'Ditambahkan Admin'
      };
      onUpdateTestimonials([newItem, ...testimonials]);
    }

    setIsModalOpen(false);
  };

  const handleCopyShareText = (item: AlumniTestimonial) => {
    const text = `🌟 KISAH SUKSES ALUMNI SMK YAPEK GOMBONG 🌟\n\n"${item.content}"\n\n— ${item.name} (Lulusan ${item.graduationYear} - ${item.major})\nJabatan: ${item.role} di ${item.company}\n\nSMK YAPEK Gombong: Beriman, Kompeten, Siap Kerja!\nInfo PPDB & BKK: https://smkyapekgombong.sch.id`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#0F4374] to-[#17528a] text-white shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
              Moderasi & Kurasi Testimoni
            </span>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-bounce">
                {pendingCount} Perlu Ditinjau
              </span>
            )}
          </div>
          <h2 className="text-2xl font-black">Manajemen Testimoni & Kisah Sukses Alumni</h2>
          <p className="text-xs text-blue-100">
            Setujui dan sharing testimoni alumni terlebih dahulu agar tampil secara resmi di beranda website.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Testimoni Baru</span>
        </button>
      </div>

      {/* Counter KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveTab('pending')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeTab === 'pending'
              ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 ring-2 ring-amber-500/20'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Perlu Disharing</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">
            {pendingCount}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Menunggu verifikasi admin</p>
        </button>

        <button
          onClick={() => setActiveTab('approved')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeTab === 'approved'
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Disharing ke Web</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            {approvedCount}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Aktif tayang di beranda</p>
        </button>

        <button
          onClick={() => setActiveTab('rejected')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeTab === 'rejected'
              ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 ring-2 ring-rose-500/20'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Ditolak / Arsip</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-2">
            {rejectedCount}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Tidak dipublikasikan</p>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeTab === 'all'
              ? 'border-[#0F4374] bg-blue-50 dark:bg-blue-950/40 ring-2 ring-[#0F4374]/20'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Semua</span>
            <Quote className="w-4 h-4 text-[#0F4374] dark:text-sky-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {totalCount}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Seluruh arsip alumni</p>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'pending'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>Perlu Disharing</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-slate-950 text-amber-300 text-[10px]">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('approved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'approved'
                ? 'bg-[#0F4374] text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Sudah Disharing ({approvedCount})
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-[#0F4374] text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Semua ({totalCount})
          </button>

          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'rejected'
                ? 'bg-rose-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Ditolak ({rejectedCount})
          </button>
        </div>

        {/* Search & Major Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, perusahaan..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0F4374]"
            />
          </div>

          <select
            value={selectedMajor}
            onChange={(e) => setSelectedMajor(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-white focus:outline-none"
          >
            <option value="all">Semua Jurusan</option>
            <option value="TKJ">TKJ</option>
            <option value="AKL">AKL</option>
            <option value="TKR">TKR</option>
            <option value="TKKR">TKKR</option>
            <option value="BDP">BDP</option>
            <option value="MP">MP / OTKP</option>
          </select>
        </div>
      </div>

      {/* Copy notification toast */}
      {copiedId && (
        <div className="p-3 rounded-xl bg-slate-900 text-white text-xs flex items-center gap-2 shadow-lg animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Format teks testimoni berhasil disalin ke clipboard untuk dishare ke WhatsApp / Medsos!</span>
        </div>
      )}

      {/* Testimonials List / Cards */}
      {filteredList.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <Quote className="w-10 h-10 mx-auto text-slate-300" />
          <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">
            Tidak Ada Testimoni yang Sesuai
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {activeTab === 'pending'
              ? 'Semua testimoni telah ditinjau dan disharing ke website!'
              : 'Coba ubah kata kunci pencarian atau filter jurusan.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredList.map((item) => {
            const isApproved = item.status === 'approved' || !item.status;
            const isPending = item.status === 'pending';
            const isRejected = item.status === 'rejected';

            return (
              <div
                key={item.id}
                className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                  isPending
                    ? 'border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20'
                    : isRejected
                    ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/10 opacity-75'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                {/* Header item: Avatar, Name, Status Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80';
                      }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {item.name}
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {item.graduationYear}
                        </span>
                      </div>
                      <p className="text-xs text-[#0F4374] dark:text-sky-400 font-semibold">
                        {item.major}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                        <Briefcase className="w-3 h-3 text-slate-400" />
                        <span>{item.role} @ <strong>{item.company}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Status Pill */}
                  <div>
                    {isPending && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-900/80 dark:text-amber-200 flex items-center gap-1 border border-amber-300">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>Perlu Disharing</span>
                      </span>
                    )}
                    {isApproved && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 dark:bg-emerald-900/80 dark:text-emerald-200 flex items-center gap-1 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Tayang di Web</span>
                      </span>
                    )}
                    {isRejected && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-900 dark:bg-rose-900/80 dark:text-rose-200 flex items-center gap-1 border border-rose-300">
                        <XCircle className="w-3 h-3 text-rose-600" />
                        <span>Ditolak</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Rating & Highlight */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {[...Array(item.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    {item.highlight && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300">
                        {item.highlight}
                      </span>
                    )}
                  </div>

                  {/* Content Quote */}
                  <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed line-clamp-3">
                    "{item.content}"
                  </p>

                  {/* Timestamp info */}
                  <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between">
                    {item.sharedAt ? (
                      <span>Disharing pada: {item.sharedAt}</span>
                    ) : item.submittedAt ? (
                      <span>Masuk: {item.submittedAt}</span>
                    ) : (
                      <span>Terverifikasi Tracer Study</span>
                    )}
                  </div>
                </div>

                {/* Bottom Action Strip */}
                <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  {/* Left: Quick Approve / Share Button */}
                  <div className="flex items-center gap-2">
                    {isPending ? (
                      <button
                        onClick={() => handleApproveAndShare(item.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Setujui & Sharing ke Web</span>
                      </button>
                    ) : isApproved ? (
                      <button
                        onClick={() => handleUnshare(item.id)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>Tarik ke Antrean</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApproveAndShare(item.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Pulihkan & Sharing</span>
                      </button>
                    )}

                    {isPending && (
                      <button
                        onClick={() => handleReject(item.id)}
                        className="px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold"
                      >
                        Tolak
                      </button>
                    )}
                  </div>

                  {/* Right: Share to WA, Edit, Delete */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopyShareText(item)}
                      title="Salin format teks untuk WhatsApp / Sosmed"
                      className="p-2 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(item)}
                      title="Edit Testimoni"
                      className="p-2 rounded-lg text-slate-500 hover:text-[#0F4374] hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      title="Hapus Testimoni"
                      className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Form: Add / Edit Testimonial */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Quote className="w-4 h-4 text-amber-500" />
                <span>{editingItem ? 'Edit Data Testimoni Alumni' : 'Tambah Testimoni Alumni Baru'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Lengkap Alumni
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Bagas Prasetyo, S.Kom."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tahun Kelulusan
                  </label>
                  <input
                    type="number"
                    min={1970}
                    max={2030}
                    value={formData.graduationYear || 2025}
                    onChange={(e) => setFormData({ ...formData, graduationYear: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Program Keahlian / Jurusan
                </label>
                <select
                  value={formData.major || 'Teknik Komputer & Jaringan (TKJ)'}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
                >
                  <option value="Teknik Komputer & Jaringan (TKJ)">Teknik Komputer & Jaringan (TKJ)</option>
                  <option value="Akuntansi & Keuangan Lembaga (AKL)">Akuntansi & Keuangan Lembaga (AKL)</option>
                  <option value="Teknik Kendaraan Ringan (TKR)">Teknik Kendaraan Ringan (TKR)</option>
                  <option value="Tata Kecantikan Kulit & Rambut (TKKR)">Tata Kecantikan Kulit & Rambut (TKKR)</option>
                  <option value="Bisnis Daring & Pemasaran (BDP)">Bisnis Daring & Pemasaran (BDP)</option>
                  <option value="Manajemen Perkantoran (MP / OTKP)">Manajemen Perkantoran (MP / OTKP)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Profesi / Jabatan Pekerjaan
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role || ''}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Junior Network Engineer"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Perusahaan / Instansi / Usaha
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company || ''}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="PT Telkom Akses"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Highlight Prestasi / Keunggulan
                </label>
                <input
                  type="text"
                  value={formData.highlight || ''}
                  onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
                  placeholder="Diterima kerja sebelum wisuda melalui BKK"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  URL Foto Profil Alumni
                </label>
                <input
                  type="url"
                  value={formData.avatar || ''}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Isi Testimoni / Pengalaman di SMK YAPEK
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.content || ''}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Ceritakan pengalaman belajar, bimbingan guru, sertifikasi BNSP, dan proses penempatan kerja melalui BKK..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
                />
              </div>

              {/* Status publish selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Status Publikasi (Moderasi)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer text-xs font-bold">
                    <input
                      type="radio"
                      name="status"
                      value="approved"
                      checked={formData.status === 'approved'}
                      onChange={() => setFormData({ ...formData, status: 'approved' })}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-emerald-700 dark:text-emerald-300">Langsung Sharing ke Web</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer text-xs font-bold">
                    <input
                      type="radio"
                      name="status"
                      value="pending"
                      checked={formData.status === 'pending'}
                      onChange={() => setFormData({ ...formData, status: 'pending' })}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-amber-700 dark:text-amber-300">Simpan di Antrean Review</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0F4374] hover:bg-[#0c365d] text-white font-bold text-xs shadow flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5 text-amber-400" />
                  <span>Simpan Testimoni</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
