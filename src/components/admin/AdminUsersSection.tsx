import React, { useState } from 'react';
import { AdminUser, AdminRole, AdminPermission } from '../../types';
import { DEFAULT_ROLE_PERMISSIONS } from '../../data/schoolData';
import { 
  ShieldCheck, 
  ShieldAlert, 
  UserPlus, 
  UserCheck, 
  Users, 
  KeyRound, 
  Lock, 
  Mail, 
  Phone, 
  Building2, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Check, 
  X, 
  Search, 
  Filter, 
  Save, 
  Eye, 
  EyeOff, 
  Sparkles, 
  HelpCircle,
  Clock,
  Briefcase,
  FileText,
  Camera,
  Quote,
  BarChart3,
  Database,
  RefreshCw,
  Sliders,
  CheckSquare,
  Square
} from 'lucide-react';

interface AdminUsersSectionProps {
  adminUsers: AdminUser[];
  currentAdmin: AdminUser;
  onUpdateAdminUsers: (updated: AdminUser[]) => void;
  isDarkMode: boolean;
}

export const AVAILABLE_MODULES: { 
  id: AdminPermission; 
  label: string; 
  shortLabel: string;
  desc: string; 
  icon: React.ElementType; 
  badgeColor: string;
}[] = [
  { 
    id: 'articles', 
    label: 'Berita & Berita Acara', 
    shortLabel: 'Warta Berita',
    desc: 'Publikasi artikel, berita acara, upload lampiran PDF/DOCX, dan kelola headline slider', 
    icon: FileText, 
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-sky-300 dark:border-blue-900' 
  },
  { 
    id: 'ppdb', 
    label: 'Pendaftar PPDB Online', 
    shortLabel: 'PPDB Online',
    desc: 'Verifikasi berkas calon peserta didik baru, unduh rekap data pendaftar', 
    icon: Users, 
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-900' 
  },
  { 
    id: 'gallery', 
    label: 'Galeri Foto Kegiatan', 
    shortLabel: 'Galeri Foto',
    desc: 'Unggah dokumentasi foto kegiatan, praktik kejuruan, dan ekstrakurikuler', 
    icon: Camera, 
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-900' 
  },
  { 
    id: 'testimonials', 
    label: 'Testimoni Alumni', 
    shortLabel: 'Testimoni',
    desc: 'Moderasi, peninjauan, persetujuan dan publikasi kisah sukses alumni vokasi', 
    icon: Quote, 
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900' 
  },
  { 
    id: 'headmaster', 
    label: 'Foto & Sambutan Kepsek', 
    shortLabel: 'Profil Kepsek',
    desc: 'Sunting sambutan resmi kepala sekolah, kutipan inspirasi, dan foto portret', 
    icon: UserCheck, 
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900' 
  },
  { 
    id: 'identity', 
    label: 'Identitas Sekolah', 
    shortLabel: 'Identitas & Visi',
    desc: 'Sunting visi misi, NPSN, akreditasi, data kontak, dan statistik resmi sekolah', 
    icon: Building2, 
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-900' 
  },
  { 
    id: 'traffic', 
    label: 'Trafik & Analisis Pengunjung', 
    shortLabel: 'Trafik Web',
    desc: 'Pemantauan grafik pengunjung harian, referral medsos, dan log aktivitas', 
    icon: BarChart3, 
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900' 
  },
  { 
    id: 'database', 
    label: 'Database & Skrip SQL', 
    shortLabel: 'Database SQL',
    desc: 'Akses skema DDL 12 tabel, backup struktur data, dan ekspor SQL', 
    icon: Database, 
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-900' 
  },
  { 
    id: 'users', 
    label: 'Hak Akses & Akun Admin', 
    shortLabel: 'Hak Akses',
    desc: 'Pengaturan akun staf pengelola, pembagian wewenang peran, dan hak akses modul', 
    icon: ShieldAlert, 
    badgeColor: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-rose-300 dark:border-red-900' 
  }
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80'
];

export const AdminUsersSection: React.FC<AdminUsersSectionProps> = ({
  adminUsers,
  currentAdmin,
  onUpdateAdminUsers,
  isDarkMode
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'accounts' | 'matrix' | 'policy'>('accounts');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [targetResetUser, setTargetResetUser] = useState<AdminUser | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');

  // Form state for add/edit admin user
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    role: AdminRole;
    password: string;
    department: string;
    phone: string;
    avatar: string;
    status: 'active' | 'inactive';
    permissions: AdminPermission[];
  }>({
    name: '',
    email: '',
    role: 'Admin Humas & Redaksi',
    password: '',
    department: 'Unit Humas & Publikasi',
    phone: '',
    avatar: PRESET_AVATARS[0],
    status: 'active',
    permissions: DEFAULT_ROLE_PERMISSIONS['Admin Humas & Redaksi']
  });

  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  // Filtered admin users
  const filteredUsers = adminUsers.filter((user) => {
    const matchSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.department && user.department.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchRole = selectedRoleFilter === 'all' || user.role === selectedRoleFilter;
    return matchSearch && matchRole;
  });

  // Calculate quick metrics
  const totalUsers = adminUsers.length;
  const activeCount = adminUsers.filter((u) => u.status !== 'inactive').length;
  const superAdminCount = adminUsers.filter((u) => u.role === 'Super Admin CMS').length;

  // Open modal for new admin
  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'Admin Humas & Redaksi',
      password: '',
      department: 'Unit Humas & Publikasi',
      phone: '',
      avatar: PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)],
      status: 'active',
      permissions: [...DEFAULT_ROLE_PERMISSIONS['Admin Humas & Redaksi']]
    });
    setFormError(null);
    setShowPassword(false);
    setIsModalOpen(true);
  };

  // Open modal for editing admin
  const handleOpenEditModal = (user: AdminUser) => {
    setEditingUser(user);
    const userPermissions = user.permissions && user.permissions.length > 0
      ? [...user.permissions]
      : [...(DEFAULT_ROLE_PERMISSIONS[user.role] || [])];

    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '', // blank means keep current password
      department: user.department || '',
      phone: user.phone || '',
      avatar: user.avatar || PRESET_AVATARS[0],
      status: user.status || 'active',
      permissions: userPermissions
    });
    setFormError(null);
    setShowPassword(false);
    setIsModalOpen(true);
  };

  // Handle role change in form -> auto update default permissions
  const handleRoleChange = (newRole: AdminRole) => {
    const defaultPerms = DEFAULT_ROLE_PERMISSIONS[newRole] || [];
    let defaultDept = formData.department;
    if (!defaultDept || defaultDept === 'Unit Humas & Publikasi' || defaultDept === 'Panitia PPDB' || defaultDept === 'Pimpinan & Manajemen Sekolah') {
      if (newRole === 'Super Admin CMS') defaultDept = 'Unit IT & Sistem Informasi';
      else if (newRole === 'Kepala Sekolah') defaultDept = 'Pimpinan & Manajemen Sekolah';
      else if (newRole === 'Admin PPDB & Kesiswaan') defaultDept = 'Panitia PPDB & Kesiswaan';
      else if (newRole === 'Admin BKK & Alumni') defaultDept = 'BKK & Hubungan Industri';
      else if (newRole === 'Admin IT & Operator') defaultDept = 'Operator Sekolah & IT';
      else defaultDept = 'Unit Humas & Publikasi';
    }

    setFormData({
      ...formData,
      role: newRole,
      department: defaultDept,
      permissions: [...defaultPerms]
    });
  };

  // Toggle single permission checkbox
  const handleTogglePermission = (permId: AdminPermission) => {
    setFormData((prev) => {
      const exists = prev.permissions.includes(permId);
      const updated = exists
        ? prev.permissions.filter((p) => p !== permId)
        : [...prev.permissions, permId];
      return { ...prev, permissions: updated };
    });
  };

  // Quick permission helpers
  const handleSelectAllPermissions = () => {
    setFormData((prev) => ({
      ...prev,
      permissions: AVAILABLE_MODULES.map((m) => m.id)
    }));
  };

  const handleResetToRoleDefault = () => {
    setFormData((prev) => ({
      ...prev,
      permissions: [...(DEFAULT_ROLE_PERMISSIONS[prev.role] || [])]
    }));
  };

  const handleClearPermissions = () => {
    setFormData((prev) => ({
      ...prev,
      permissions: []
    }));
  };

  // Save form submission
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!formData.name.trim()) {
      setFormError('Nama lengkap pengelola admin wajib diisi.');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setFormError('Alamat email tidak valid. Pastikan format email sudah benar.');
      return;
    }

    // Check duplicate email (excluding current user when editing)
    const duplicate = adminUsers.find(
      (u) => u.email.toLowerCase() === formData.email.trim().toLowerCase() && u.id !== editingUser?.id
    );
    if (duplicate) {
      setFormError(`Email "${formData.email}" sudah digunakan oleh akun lain (${duplicate.name}).`);
      return;
    }

    if (!editingUser && (!formData.password || formData.password.length < 6)) {
      setFormError('Kata sandi untuk akun baru minimal harus 6 karakter.');
      return;
    }

    if (formData.permissions.length === 0) {
      setFormError('Pilih minimal 1 hak akses modul untuk akun ini.');
      return;
    }

    // Process update or create
    if (editingUser) {
      const updatedList = adminUsers.map((u) => {
        if (u.id === editingUser.id) {
          return {
            ...u,
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
            role: formData.role,
            department: formData.department.trim(),
            phone: formData.phone.trim(),
            avatar: formData.avatar,
            status: formData.status,
            permissions: formData.permissions,
            ...(formData.password ? { password: formData.password } : {})
          };
        }
        return u;
      });

      onUpdateAdminUsers(updatedList);
      showNotification(`Akun ${formData.name} berhasil diperbarui.`);
    } else {
      const newUser: AdminUser = {
        id: `admin-${Date.now()}`,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        role: formData.role,
        password: formData.password,
        department: formData.department.trim(),
        phone: formData.phone.trim(),
        avatar: formData.avatar || PRESET_AVATARS[0],
        status: formData.status,
        permissions: formData.permissions,
        createdAt: 'Hari ini',
        lastLogin: 'Belum pernah login'
      };

      onUpdateAdminUsers([newUser, ...adminUsers]);
      showNotification(`Akun admin baru "${newUser.name}" (${newUser.role}) berhasil ditambahkan!`);
    }

    setIsModalOpen(false);
  };

  // Toggle active/inactive status
  const handleToggleStatus = (user: AdminUser) => {
    if (user.id === currentAdmin.id) {
      alert('Anda tidak dapat menonaktifkan akun Anda sendiri yang sedang aktif digunakan.');
      return;
    }

    // Ensure at least one active Super Admin
    if (user.role === 'Super Admin CMS' && user.status !== 'inactive' && superAdminCount <= 1) {
      alert('Tidak dapat menonaktifkan akun Super Admin terakhir. Sistem membutuhkan minimal satu Super Admin aktif.');
      return;
    }

    const nextStatus: 'active' | 'inactive' = user.status === 'inactive' ? 'active' : 'inactive';
    const updated: AdminUser[] = adminUsers.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u));
    onUpdateAdminUsers(updated);
    showNotification(`Status akun ${user.name} diubah menjadi ${nextStatus === 'active' ? 'Aktif' : 'Nonaktif'}.`);
  };

  // Delete admin user
  const handleDeleteUser = (user: AdminUser) => {
    if (user.id === currentAdmin.id) {
      alert('Anda tidak dapat menghapus akun Anda sendiri yang sedang login.');
      return;
    }

    if (user.role === 'Super Admin CMS' && superAdminCount <= 1) {
      alert('Tidak dapat menghapus satu-satunya Super Admin CMS.');
      return;
    }

    if (window.confirm(`Apakah Anda yakin ingin menghapus akun admin "${user.name}" (${user.email}) secara permanen? Tindakan ini tidak dapat dibatalkan.`)) {
      const updated = adminUsers.filter((u) => u.id !== user.id);
      onUpdateAdminUsers(updated);
      showNotification(`Akun ${user.name} berhasil dihapus dari sistem.`);
    }
  };

  // Open reset password modal
  const handleOpenResetPassword = (user: AdminUser) => {
    setTargetResetUser(user);
    setNewPasswordInput('');
    setIsResetPasswordModalOpen(true);
  };

  const handleSaveResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetResetUser) return;
    if (newPasswordInput.length < 6) {
      alert('Kata sandi baru minimal 6 karakter.');
      return;
    }

    const updated = adminUsers.map((u) => 
      u.id === targetResetUser.id ? { ...u, password: newPasswordInput } : u
    );
    onUpdateAdminUsers(updated);
    setIsResetPasswordModalOpen(false);
    showNotification(`Kata sandi akun ${targetResetUser.name} berhasil direset.`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white shadow-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-200 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-bold">{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="p-1 rounded-lg hover:bg-emerald-700 text-emerald-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Banner with Stats */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-[#0F4374] via-[#154e85] to-[#0A2E52] text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-xs">
                Role-Based Access Control (RBAC)
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-blue-100 backdrop-blur-xs">
                CMS SMK YAPEK Gombong
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Manajemen Hak Akses & Penambahan Akun Admin
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              Atur wewenang pengelola website sekolah secara fleksibel. Tambahkan akun baru untuk staf Humas, Panitia PPDB, Tim BKK, atau Kepala Sekolah dengan hak akses per modul yang terisolasi aman.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all self-start md:self-auto flex-shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Tambah Akun Admin Baru</span>
          </button>
        </div>

        {/* Subtle decorative background circles */}
        <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-blue-400/10 pointer-events-none blur-xl" />
        <div className="absolute top-0 right-1/3 w-36 h-36 rounded-full bg-amber-400/10 pointer-events-none blur-xl" />
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Total Pengelola Admin</span>
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-sky-400">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {totalUsers} Akun
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Terdaftar di sistem CMS</p>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Akun Aktif</span>
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            {activeCount} Aktif
          </div>
          <p className="text-[10px] text-slate-400 mt-1">{totalUsers - activeCount} akun sedang dinonaktifkan</p>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Super Admin CMS</span>
            <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">
            {superAdminCount} Pengawas
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Hak akses penuh (Full Wewenang)</p>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Modul Dilindungi</span>
            <span className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <Sliders className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-2">
            9 Modul
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Granular permission switches</p>
        </div>
      </div>

      {/* Sub-Tabs Nav: Accounts List vs Permission Matrix vs Security SOP */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-200/80 dark:bg-slate-900/90 border border-slate-300/70 dark:border-slate-800 max-w-fit">
        <button
          type="button"
          onClick={() => setActiveSubTab('accounts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'accounts'
              ? 'bg-[#0F4374] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Daftar Akun Admin ({adminUsers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('matrix')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'matrix'
              ? 'bg-[#0F4374] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Matriks Hak Akses Peran</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('policy')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'policy'
              ? 'bg-[#0F4374] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Panduan Keamanan & SOP</span>
        </button>
      </div>

      {/* SUB-TAB 1: DAFTAR AKUN ADMIN */}
      {activeSubTab === 'accounts' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama, email, atau unit kerja..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
              />
            </div>

            {/* Role Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 pl-1">
                <Filter className="w-3 h-3" />
                <span>Peran:</span>
              </span>
              {[
                { id: 'all', label: 'Semua Peran' },
                { id: 'Super Admin CMS', label: 'Super Admin' },
                { id: 'Admin Humas & Redaksi', label: 'Humas' },
                { id: 'Admin PPDB & Kesiswaan', label: 'PPDB' },
                { id: 'Kepala Sekolah', label: 'Kepsek' }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedRoleFilter(filter.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedRoleFilter === filter.id
                      ? 'bg-[#0F4374] text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Accounts Table */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Petugas / Profil</th>
                    <th className="py-3.5 px-4">Peran & Wewenang</th>
                    <th className="py-3.5 px-4">Kontak & Departemen</th>
                    <th className="py-3.5 px-4">Hak Akses Modul</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Aksi Kelola</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        Tidak ada akun admin yang sesuai dengan kata kunci pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const isMe = user.id === currentAdmin.id;
                      const isActive = user.status !== 'inactive';
                      const userPerms = user.permissions || DEFAULT_ROLE_PERMISSIONS[user.role] || [];

                      let roleBadgeClass = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
                      if (user.role === 'Super Admin CMS') {
                        roleBadgeClass = 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800';
                      } else if (user.role === 'Admin Humas & Redaksi') {
                        roleBadgeClass = 'bg-blue-100 text-blue-900 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-300 dark:border-blue-800';
                      } else if (user.role === 'Kepala Sekolah') {
                        roleBadgeClass = 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800';
                      } else if (user.role === 'Admin PPDB & Kesiswaan') {
                        roleBadgeClass = 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800';
                      }

                      return (
                        <tr key={user.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                          {/* Avatar & Name */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative flex-shrink-0">
                                <img
                                  src={user.avatar || PRESET_AVATARS[0]}
                                  alt={user.name}
                                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
                                />
                                {isActive ? (
                                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" title="Akun Aktif" />
                                ) : (
                                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-slate-400 border-2 border-white dark:border-slate-900 rounded-full" title="Akun Nonaktif" />
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                  <span>{user.name}</span>
                                  {isMe && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-[#0F4374] text-white">
                                      Anda
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                                  <Mail className="w-3 h-3" />
                                  <span>{user.email}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Role */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-black tracking-wide ${roleBadgeClass}`}>
                              {user.role}
                            </span>
                            <div className="text-[10px] text-slate-400 mt-1">
                              Login: {user.lastLogin || 'Belum ada data'}
                            </div>
                          </td>

                          {/* Contact & Dept */}
                          <td className="py-3.5 px-4">
                            <div className="text-slate-800 dark:text-slate-200 font-medium">
                              {user.department || 'Staf Operasional'}
                            </div>
                            {user.phone ? (
                              <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 font-mono">
                                <Phone className="w-3 h-3 text-slate-400" />
                                <span>{user.phone}</span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">No HP belum disetel</span>
                            )}
                          </td>

                          {/* Permissions summary */}
                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {userPerms.map((perm) => {
                                const mod = AVAILABLE_MODULES.find((m) => m.id === perm);
                                if (!mod) return null;
                                return (
                                  <span
                                    key={perm}
                                    className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                                    title={mod.desc}
                                  >
                                    {mod.shortLabel}
                                  </span>
                                );
                              })}
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-1">
                              {userPerms.length} dari 9 modul diizinkan
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(user)}
                              title="Klik untuk ubah status aktif/nonaktif"
                              className={`px-3 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 transition-all ${
                                isActive
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300'
                                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-400'
                              }`}
                            >
                              {isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                              <span>{isActive ? 'Aktif' : 'Nonaktif'}</span>
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Reset Password */}
                              <button
                                type="button"
                                onClick={() => handleOpenResetPassword(user)}
                                title="Reset Kata Sandi"
                                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950/40 text-slate-600 dark:text-slate-400 transition-colors"
                              >
                                <KeyRound className="w-3.5 h-3.5" />
                              </button>

                              {/* Edit Profile & Permissions */}
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(user)}
                                title="Edit Akun & Hak Akses"
                                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/40 text-slate-600 dark:text-slate-400 transition-colors"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete Account */}
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(user)}
                                disabled={isMe}
                                title={isMe ? 'Tidak dapat menghapus akun sendiri' : 'Hapus Akun'}
                                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: MATRIKS HAK AKSES PERAN (ROLE PERMISSION MATRIX) */}
      {activeSubTab === 'matrix' && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white mb-1">
              Matriks Standar Hak Akses Berdasarkan Peran Pengelola
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Berikut adalah pemetaan bawaan wewenang tiap peran terhadap 9 modul utama CMS. Setiap akun pengelola juga dapat dikustomisasi hak aksesnya secara mandiri melalui tombol <strong>Edit Akun</strong>.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4 min-w-[200px]">Modul & Fitur CMS</th>
                    <th className="py-3.5 px-3 text-center">Super Admin</th>
                    <th className="py-3.5 px-3 text-center">Admin Humas</th>
                    <th className="py-3.5 px-3 text-center">Kepala Sekolah</th>
                    <th className="py-3.5 px-3 text-center">Admin PPDB</th>
                    <th className="py-3.5 px-3 text-center">Admin BKK</th>
                    <th className="py-3.5 px-3 text-center">Admin IT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {AVAILABLE_MODULES.map((mod) => {
                    const Icon = mod.icon;
                    return (
                      <tr key={mod.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <span className={`p-1.5 rounded-lg ${mod.badgeColor}`}>
                              <Icon className="w-3.5 h-3.5" />
                            </span>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">{mod.label}</div>
                              <div className="text-[10px] text-slate-400 leading-tight">{mod.desc}</div>
                            </div>
                          </div>
                        </td>

                        {(['Super Admin CMS', 'Admin Humas & Redaksi', 'Kepala Sekolah', 'Admin PPDB & Kesiswaan', 'Admin BKK & Alumni', 'Admin IT & Operator'] as AdminRole[]).map((role) => {
                          const hasAccess = DEFAULT_ROLE_PERMISSIONS[role]?.includes(mod.id);
                          return (
                            <td key={role} className="py-3 px-3 text-center">
                              {hasAccess ? (
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-black text-xs shadow-2xs">
                                  ✓
                                </span>
                              ) : (
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 font-bold text-xs">
                                  -
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PANDUAN KEAMANAN & SOP */}
      {activeSubTab === 'policy' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <ShieldCheck className="w-5 h-5" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Prinsip Hak Akses Terkecil (Least Privilege)
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Setiap petugas pengelola CMS hanya boleh diberikan akses ke modul yang relevan dengan tugas kedinasannya. Hindari memberikan peran <strong>Super Admin CMS</strong> kepada banyak staf untuk mencegah modifikasi skema data atau perubahan identitas sekolah yang tidak terkoordinasi.
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc pl-4">
              <li>Staf Redaksi & OSIS: Cukup diberikan modul <em>Warta Berita</em> dan <em>Galeri Foto</em>.</li>
              <li>Panitia PPDB: Dibatasi hanya pada modul <em>Pendaftar PPDB Online</em>.</li>
              <li>Kepala Sekolah: Memiliki akses review profil, sambutan resmi, serta statistik trafik eksekutif.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-[#0F4374] dark:text-sky-400">
              <KeyRound className="w-5 h-5" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Standar Keamanan Sandi & Rotasi Akun
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Kata sandi pengelola disarankan terdiri dari kombinasi huruf besar, huruf kecil, dan angka minimal 8 karakter. Ketika seorang staf atau panitia PPDB menyelesaikan masa tugasnya, lakukan langkah berikut:
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc pl-4">
              <li>Ubah status akun menjadi <strong>Nonaktif</strong> daripada langsung menghapus, agar riwayat penulis warta tetap tercatat.</li>
              <li>Lakukan <strong>Reset Kata Sandi</strong> berkala setiap pergantian semester akademik.</li>
              <li>Jangan membagikan satu akun bersama (*shared credentials*) untuk keperluan akuntabilitas audit.</li>
            </ul>
          </div>
        </div>
      )}

      {/* MODAL 1: TAMBAH / EDIT AKUN ADMIN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="max-w-2xl w-full my-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#0F4374] dark:text-sky-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white">
                    {editingUser ? `Edit Akun: ${editingUser.name}` : 'Tambah Akun Admin CMS Baru'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Konfigurasikan identitas profil, jabatan, dan wewenang modul pengelola
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error banner */}
            {formError && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
                <span>{formError}</span>
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSaveUser} className="space-y-4">
              {/* Row 1: Nama & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Lengkap & Gelar *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso, S.Kom."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Resmi Akun *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="nama@smkyapekgombong.sch.id"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
                  />
                </div>
              </div>

              {/* Row 2: Peran & Departemen */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Peran / Jabatan Akses *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleRoleChange(e.target.value as AdminRole)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
                  >
                    <option value="Super Admin CMS">Super Admin CMS (Hak Penuh)</option>
                    <option value="Admin Humas & Redaksi">Admin Humas & Redaksi Warta</option>
                    <option value="Admin PPDB & Kesiswaan">Admin PPDB & Kesiswaan</option>
                    <option value="Admin BKK & Alumni">Admin BKK & Testimoni Alumni</option>
                    <option value="Admin IT & Operator">Admin IT & Database</option>
                    <option value="Kepala Sekolah">Kepala Sekolah (Review & Sambutan)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Unit Kerja / Departemen
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Tim Publikasi & Humas Digital"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
                  />
                </div>
              </div>

              {/* Row 3: Kata Sandi & Telepon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {editingUser ? 'Kata Sandi Baru (Kosongkan jika tidak diubah)' : 'Kata Sandi Awal *'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={editingUser ? 'Tetap gunakan kata sandi lama' : 'Minimal 6 karakter'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor WhatsApp / Telepon
                  </label>
                  <input
                    type="text"
                    placeholder="0812-xxxx-xxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
                  />
                </div>
              </div>

              {/* Row 4: Status Akun */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Status Akun
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={formData.status === 'active'}
                      onChange={() => setFormData({ ...formData, status: 'active' })}
                      className="text-[#0F4374] focus:ring-[#0F4374]"
                    />
                    <span>Aktif (Dapat Login ke CMS)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      checked={formData.status === 'inactive'}
                      onChange={() => setFormData({ ...formData, status: 'inactive' })}
                      className="text-[#0F4374] focus:ring-[#0F4374]"
                    />
                    <span>Nonaktif (Akses Sementara Ditangguhkan)</span>
                  </label>
                </div>
              </div>

              {/* Row 5: Preset Avatar Pilihan Cepat */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Foto Profil Pengelola (Pilih Preset atau Masukkan URL)
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {PRESET_AVATARS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, avatar: av })}
                      className={`relative rounded-xl overflow-hidden flex-shrink-0 transition-all ${
                        formData.avatar === av
                          ? 'ring-3 ring-amber-400 scale-105 shadow-md'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={av} alt="Preset Avatar" className="w-10 h-10 object-cover" />
                      {formData.avatar === av && (
                        <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center text-amber-500">
                          <Check className="w-4 h-4 bg-amber-400 text-slate-950 rounded-full p-0.5" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  placeholder="Atau tempel URL gambar foto profil kustom (https://...)"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  className="w-full mt-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0F4374]"
                />
              </div>

              {/* Row 6: Konfigurasi Hak Akses Modul (Granular Checkbox Grid) */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-500" />
                      <span>Hak Akses Modul CMS ({formData.permissions.length} Modul Terpilih)</span>
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      Tentukan modul mana saja yang dapat diakses dan dikelola oleh akun ini
                    </p>
                  </div>

                  {/* Quick toggle actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleSelectAllPermissions}
                      className="px-2 py-1 rounded text-[10px] font-bold bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-950 dark:text-sky-300 transition-colors"
                    >
                      Pilih Semua
                    </button>
                    <button
                      type="button"
                      onClick={handleResetToRoleDefault}
                      className="px-2 py-1 rounded text-[10px] font-bold bg-amber-100 hover:bg-amber-200 text-amber-800 dark:bg-amber-950 dark:text-amber-300 transition-colors"
                    >
                      Reset Peran
                    </button>
                    <button
                      type="button"
                      onClick={handleClearPermissions}
                      className="px-2 py-1 rounded text-[10px] font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-800 dark:text-slate-400 transition-colors"
                    >
                      Kosongkan
                    </button>
                  </div>
                </div>

                {/* Grid 9 modules */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {AVAILABLE_MODULES.map((mod) => {
                    const isChecked = formData.permissions.includes(mod.id);
                    const Icon = mod.icon;
                    return (
                      <div
                        key={mod.id}
                        onClick={() => handleTogglePermission(mod.id)}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 select-none ${
                          isChecked
                            ? 'border-blue-500/80 bg-blue-50/70 dark:bg-blue-950/40 shadow-2xs ring-1 ring-blue-500/20'
                            : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 opacity-60 hover:opacity-90'
                        }`}
                      >
                        <div className="mt-0.5">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <Icon className="w-3.5 h-3.5 text-slate-500" />
                            <span>{mod.label}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                            {mod.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingUser ? 'Simpan Perubahan Akun' : 'Tambahkan Akun Admin'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: RESET PASSWORD */}
      {isResetPasswordModalOpen && targetResetUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Reset Kata Sandi Akun
                </h3>
                <p className="text-xs text-slate-500">
                  Untuk akun <strong>{targetResetUser.name}</strong> ({targetResetUser.email})
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kata Sandi Baru (Minimal 6 Karakter) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan kata sandi baru..."
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResetPasswordModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black shadow transition-colors"
                >
                  Simpan Sandi Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
