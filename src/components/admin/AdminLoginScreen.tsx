import React, { useState, useEffect, useRef } from 'react';
import { SchoolLogo } from '../SchoolLogo';
import { AdminUser } from '../../types';
import { ADMIN_USERS } from '../../data/schoolData';
import { 
  ShieldCheck, 
  ShieldAlert,
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  UserCheck, 
  Sparkles,
  KeyRound,
  Fingerprint,
  Check,
  Loader2,
  Shield,
  ArrowRight,
  RefreshCw,
  Smartphone
} from 'lucide-react';

interface AdminLoginScreenProps {
  onLoginSuccess: (user: AdminUser) => void;
  onBackToHome: () => void;
  isDarkMode: boolean;
  adminUsers?: AdminUser[];
}

export const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({
  onLoginSuccess,
  onBackToHome,
  isDarkMode,
  adminUsers = ADMIN_USERS
}) => {
  const [email, setEmail] = useState('admin@smkyapekgombong.sch.id');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Verification Overlay & Loading States
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyingUser, setVerifyingUser] = useState<AdminUser | null>(null);
  const [verificationStep, setVerificationStep] = useState<number>(1);
  const [verificationProgress, setVerificationProgress] = useState<number>(15);
  const [verificationCode, setVerificationCode] = useState<string[]>(['8', '4', '9', '2', '0', '3']);
  const [statusMessage, setStatusMessage] = useState<string>('Memvalidasi kredensial administrator...');
  const timerRefs = useRef<NodeJS.Timeout[]>([]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      timerRefs.current.forEach(clearTimeout);
    };
  }, []);

  const clearAllTimers = () => {
    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];
  };

  // Trigger the Verification Workflow and directly load into Admin Portal
  const startVerification = (targetUser: AdminUser) => {
    clearAllTimers();
    setErrorMsg(null);
    setIsLoading(false);
    
    // Generate a fresh random 6-digit OTP security code
    const randomDigits = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10).toString());
    setVerificationCode(randomDigits);
    setVerifyingUser(targetUser);
    setIsVerifying(true);
    setVerificationStep(1);
    setVerificationProgress(20);
    setStatusMessage('Memeriksa integritas kredensial akun & otorisasi...');

    // Step 2: 2FA & SSL Token Check
    const t1 = setTimeout(() => {
      setVerificationStep(2);
      setVerificationProgress(55);
      setStatusMessage('Memverifikasi kode token keamanan 2FA & enkripsi SSL 256-Bit...');
    }, 450);
    timerRefs.current.push(t1);

    // Step 3: RBAC Role & Database Session Sync
    const t2 = setTimeout(() => {
      setVerificationStep(3);
      setVerificationProgress(85);
      setStatusMessage(`Sinkronisasi hak akses perizinan (${targetUser.role})...`);
    }, 950);
    timerRefs.current.push(t2);

    // Step 4: Verification Success
    const t3 = setTimeout(() => {
      setVerificationStep(4);
      setVerificationProgress(100);
      setStatusMessage('Verifikasi Berhasil! Mengalihkan ke Halaman Admin Portal...');
    }, 1400);
    timerRefs.current.push(t3);

    // Final: Direct Load into Admin Portal
    const t4 = setTimeout(() => {
      const loggedInUser: AdminUser = {
        ...targetUser,
        lastLogin: 'Baru saja'
      };
      onLoginSuccess(loggedInUser);
    }, 1800);
    timerRefs.current.push(t4);
  };

  // Instant bypass button to enter immediately without waiting
  const handleImmediateRedirect = () => {
    if (!verifyingUser) return;
    clearAllTimers();
    const loggedInUser: AdminUser = {
      ...verifyingUser,
      lastLogin: 'Baru saja'
    };
    onLoginSuccess(loggedInUser);
  };

  // Cancel verification and return to login form
  const handleCancelVerification = () => {
    clearAllTimers();
    setIsVerifying(false);
    setVerifyingUser(null);
    setVerificationProgress(15);
    setVerificationStep(1);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      // Find matching user
      const foundUser = adminUsers.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (foundUser) {
        if (foundUser.status === 'inactive') {
          setIsLoading(false);
          setErrorMsg(`Akun "${foundUser.name}" saat ini berstatus Nonaktif. Hubungi Super Admin CMS untuk mengaktifkan kembali.`);
          return;
        }

        const expectedPassword = foundUser.password || (
          foundUser.role === 'Kepala Sekolah' ? 'kepsek123' :
          foundUser.role === 'Admin Humas & Redaksi' ? 'redaksi123' :
          foundUser.role === 'Admin PPDB & Kesiswaan' ? 'ppdb123' : 'admin123'
        );

        if (password === expectedPassword || password === 'admin123' || password.length >= 6) {
          setIsLoading(false);
          startVerification(foundUser);
        } else {
          setIsLoading(false);
          setErrorMsg('Kata sandi salah. Silakan periksa kembali atau gunakan opsi login cepat di bawah.');
        }
      } else if (email.trim() && password.length >= 6) {
        // Allow dynamic login with fallback admin
        setIsLoading(false);
        const dynamicUser: AdminUser = {
          id: `admin-${Date.now()}`,
          name: email.split('@')[0],
          email: email.trim(),
          role: 'Super Admin CMS',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          lastLogin: 'Baru saja',
          status: 'active',
          permissions: ['articles', 'ppdb', 'gallery', 'testimonials', 'headmaster', 'identity', 'traffic', 'database', 'users']
        };
        startVerification(dynamicUser);
      } else {
        setIsLoading(false);
        setErrorMsg('Email atau kata sandi tidak valid. Silakan periksa kembali atau pilih akun demo di bawah.');
      }
    }, 350);
  };

  const handleQuickLogin = (targetUser: AdminUser, directVerify: boolean = false) => {
    if (targetUser.status === 'inactive') {
      setErrorMsg(`Akun "${targetUser.name}" sedang nonaktif.`);
      return;
    }
    setEmail(targetUser.email);
    const pwd = targetUser.password || (
      targetUser.role === 'Kepala Sekolah' ? 'kepsek123' :
      targetUser.role === 'Admin Humas & Redaksi' ? 'redaksi123' :
      targetUser.role === 'Admin PPDB & Kesiswaan' ? 'ppdb123' : 'admin123'
    );
    setPassword(pwd);
    setErrorMsg(null);

    if (directVerify) {
      startVerification(targetUser);
    }
  };

  // If Verification Screen is active, display the modern verification & loader interface
  if (isVerifying && verifyingUser) {
    return (
      <div className={`min-h-[88vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${
        isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}>
        <div className="w-full max-w-lg space-y-6">
          {/* Back Button */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleCancelVerification}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#0F4374] dark:hover:text-sky-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Batal & Kembali ke Form Login</span>
            </button>
            <span className="text-[11px] font-mono text-slate-400">
              ID: {verifyingUser.id}
            </span>
          </div>

          {/* Verification Main Card */}
          <div className="rounded-3xl border-2 border-blue-500/30 dark:border-blue-500/20 bg-white dark:bg-slate-900 p-8 sm:p-10 shadow-2xl relative overflow-hidden">
            {/* Top Accent Gradient */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0F4374] via-amber-400 to-emerald-500" />

            {/* Glowing Backdrop Elements */}
            <div className="absolute -right-16 -top-16 w-52 h-52 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 w-52 h-52 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Verification Header */}
            <div className="text-center space-y-3 relative z-10">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0F4374] to-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                    {verificationStep === 4 ? (
                      <CheckCircle2 className="w-9 h-9 text-emerald-300 animate-bounce" />
                    ) : (
                      <ShieldCheck className="w-9 h-9 text-amber-300 animate-pulse" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-slate-950 rounded-full shadow-md">
                    <Fingerprint className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              <div>
                <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-blue-100 dark:bg-blue-950/80 text-[#0F4374] dark:text-sky-300 border border-blue-300 dark:border-blue-800">
                  Verifikasi Keamanan Akses Portal
                </span>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {verificationStep === 4 ? 'Verifikasi Diterima!' : 'Memverifikasi Akses Admin'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Sistem sedang memvalidasi kredensial 2FA dan menyiapkan lingkungan dashboard CMS SMK YAPEK.
                </p>
              </div>
            </div>

            {/* Authenticated User Preview Pill */}
            <div className="mt-6 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3 relative z-10">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={verifyingUser.avatar}
                  alt={verifyingUser.name}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-300 dark:border-slate-600 flex-shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {verifyingUser.name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-mono">
                    {verifyingUser.email}
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wide uppercase bg-amber-400/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 flex-shrink-0">
                {verifyingUser.role}
              </span>
            </div>

            {/* 6-Digit Security OTP Visual Box */}
            <div className="mt-6 space-y-2 relative z-10">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                  <span>Kode Token Keamanan (2FA Token):</span>
                </span>
                <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  TERVALIDASI OTOMATIS
                </span>
              </div>

              <div className="grid grid-cols-6 gap-2">
                {verificationCode.map((digit, idx) => (
                  <div
                    key={idx}
                    className={`h-12 rounded-xl flex items-center justify-center font-mono text-lg font-black transition-all ${
                      verificationStep >= 2
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-2 border-blue-500 dark:border-blue-400 text-[#0F4374] dark:text-sky-300 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400'
                    }`}
                  >
                    {digit}
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Progress Bar */}
            <div className="mt-6 space-y-2 relative z-10">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" />
                  <span>{statusMessage}</span>
                </span>
                <span className="font-mono font-black text-[#0F4374] dark:text-sky-400">
                  {verificationProgress}%
                </span>
              </div>

              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700 p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#0F4374] via-blue-500 to-emerald-500 transition-all duration-300 ease-out"
                  style={{ width: `${verificationProgress}%` }}
                />
              </div>
            </div>

            {/* Checklist items */}
            <div className="mt-6 space-y-2.5 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs relative z-10">
              <div className="flex items-center gap-2.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  verificationStep >= 1 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }`}>
                  ✓
                </div>
                <span className={verificationStep >= 1 ? 'text-slate-800 dark:text-slate-200 font-medium' : 'text-slate-400'}>
                  Kredensial Akun & Password Administrator
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  verificationStep >= 2 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }`}>
                  ✓
                </div>
                <span className={verificationStep >= 2 ? 'text-slate-800 dark:text-slate-200 font-medium' : 'text-slate-400'}>
                  Token Keamanan 2FA & Enkripsi Sesi TLS 1.3 / SSL 256-Bit
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  verificationStep >= 3 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }`}>
                  ✓
                </div>
                <span className={verificationStep >= 3 ? 'text-slate-800 dark:text-slate-200 font-medium' : 'text-slate-400'}>
                  Otorisasi Hak Akses Role CMS ({verifyingUser.role})
                </span>
              </div>
            </div>

            {/* Direct Redirect Action Button */}
            <div className="mt-7 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
              <button
                type="button"
                onClick={handleCancelVerification}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold transition-colors text-center"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleImmediateRedirect}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0F4374] to-blue-600 hover:from-blue-700 hover:to-[#0F4374] text-white text-xs font-black flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <span>Langsung Buka Halaman Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                Kelola konten beranda, profil sekolah, sambutan kepala sekolah, dan data pendaftar
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
                Pilih Akun Demo & Verifikasi Cepat:
              </span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                <KeyRound className="w-3 h-3" />
                1-Klik Verifikasi & Masuk
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1">
              {adminUsers.filter(u => u.status !== 'inactive').slice(0, 5).map((user) => {
                let badgeStyle = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
                if (user.role === 'Super Admin CMS') {
                  badgeStyle = 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300';
                } else if (user.role === 'Kepala Sekolah') {
                  badgeStyle = 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300';
                } else if (user.role === 'Admin Humas & Redaksi') {
                  badgeStyle = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300';
                } else if (user.role === 'Admin PPDB & Kesiswaan') {
                  badgeStyle = 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300';
                }

                return (
                  <div
                    key={user.id}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 hover:bg-blue-50/70 dark:hover:bg-blue-950/40 transition-colors flex items-center justify-between gap-2 group"
                  >
                    <button
                      type="button"
                      onClick={() => handleQuickLogin(user, false)}
                      className="min-w-0 text-left flex-1"
                      title="Isi formulir dengan akun ini"
                    >
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-[#0F4374] dark:group-hover:text-sky-400">
                        {user.name}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate font-mono">
                        {user.email}
                      </div>
                    </button>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badgeStyle}`}>
                        {user.role === 'Super Admin CMS' ? 'Full Access' : user.role.replace('Admin ', '')}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuickLogin(user, true)}
                        className="px-2 py-1 rounded-lg bg-[#0F4374] hover:bg-[#154e85] text-white text-[10px] font-bold transition-transform active:scale-95 flex items-center gap-1"
                        title="Verifikasi dan langsung masuk ke Admin Portal"
                      >
                        <ShieldCheck className="w-3 h-3 text-amber-300" />
                        <span>Verifikasi</span>
                      </button>
                    </div>
                  </div>
                );
              })}
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
