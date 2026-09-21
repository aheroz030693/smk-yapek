import React, { useState } from 'react';
import { SchoolLogo } from '../SchoolLogo';
import { AdminUser } from '../../types';
import { ADMIN_USERS } from '../../data/schoolData';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  UserCheck, 
  Sparkles,
  KeyRound
} from 'lucide-react';

interface AdminLoginScreenProps {
  onLoginSuccess: (user: AdminUser) => void;
  onBackToHome: () => void;
  isDarkMode: boolean;
}

export const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({
  onLoginSuccess,
  onBackToHome,
  isDarkMode
}) => {
  const [email, setEmail] = useState('admin@smkyapekgombong.sch.id');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      // Find matching user
      const foundUser = ADMIN_USERS.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (foundUser && (password === 'admin123' || password === 'kepsek123' || password === 'redaksi123' || password.length >= 6)) {
        setIsLoading(false);
        onLoginSuccess(foundUser);
      } else if (email.trim() && password.length >= 6) {
        // Allow dynamic login with fallback admin
        setIsLoading(false);
        onLoginSuccess({
          id: `admin-${Date.now()}`,
          name: email.split('@')[0],
          email: email.trim(),
          role: 'Super Admin CMS',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          lastLogin: 'Baru saja'
        });
      } else {
        setIsLoading(false);
        setErrorMsg('Email atau kata sandi tidak valid. Silakan periksa kembali atau gunakan akun demo di bawah.');
      }
    }, 600);
  };

  const handleQuickLogin = (userIndex: number) => {
    const targetUser = ADMIN_USERS[userIndex];
    if (!targetUser) return;
    setEmail(targetUser.email);
    if (targetUser.role === 'Kepala Sekolah') {
      setPassword('kepsek123');
    } else if (targetUser.role === 'Admin Humas & Redaksi') {
      setPassword('redaksi123');
    } else {
      setPassword('admin123');
    }
    setErrorMsg(null);
  };

  return (
    <div className={`min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <div className="w-full max-w-md space-y-8">
        {/* Top Back Link */}
        <div>
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#0F4374] dark:hover:text-sky-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda Website</span>
          </button>
        </div>

        {/* Card Container */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-10 shadow-xl relative overflow-hidden">
          {/* Subtle Top Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0F4374] via-blue-500 to-[#EA8B00]" />

          {/* School Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="flex justify-center">
              <SchoolLogo variant={isDarkMode ? 'dark' : 'light'} size="md" />
            </div>
            <div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-50 dark:bg-blue-950/60 text-[#0F4374] dark:text-sky-400 border border-blue-200 dark:border-blue-900">
                Sistem Informasi Manajemen
              </span>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Admin CMS Portal
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kelola konten beranda, profil sekolah, sambutan kepala sekolah, dan testimoni alumni
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" />
              <div>{errorMsg}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Email / ID Petugas CMS
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@smkyapekgombong.sch.id"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4374] dark:focus:ring-sky-500 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Kata Sandi (Password)
                </label>
                <span className="text-[11px] text-[#0F4374] dark:text-sky-400 hover:underline cursor-pointer">
                  Lupa sandi?
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4374] dark:focus:ring-sky-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-[#0F4374] focus:ring-[#0F4374] dark:border-slate-700 dark:bg-slate-800"
                />
                <span className="text-slate-600 dark:text-slate-400">Ingat Saya di perangkat ini</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#0F4374] to-[#154e85] hover:from-[#0c365d] hover:to-[#0F4374] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span>Masuk ke Dashboard CMS</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Pilih Akun Demo Cepat:
              </span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                <KeyRound className="w-3 h-3" />
                1-Klik Masuk
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin(0)}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Super Admin Humas & IT
                  </div>
                  <div className="text-[10px] text-slate-500">
                    admin@smkyapekgombong.sch.id
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                  Full Access
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin(1)}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Drs. H. Suwarno, M.M. (Kepala Sekolah)
                  </div>
                  <div className="text-[10px] text-slate-500">
                    kepsek@smkyapekgombong.sch.id
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                  Eksekutif
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin(2)}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Tim Redaksi & Humas BKK
                  </div>
                  <div className="text-[10px] text-slate-500">
                    redaksi@smkyapekgombong.sch.id
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                  Konten & Berita
                </span>
              </button>
            </div>
          </div>

          {/* Security footnote */}
          <div className="mt-6 text-center">
            <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Koneksi Aman Terenkripsi SSL 256-Bit</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
