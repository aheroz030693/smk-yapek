import React, { useState } from 'react';
import { SchoolLogo } from './SchoolLogo';
import { ScreenTab, SchoolIdentity } from '../types';
import { SCHOOL_INFO } from '../data/schoolData';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Sparkles, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  GraduationCap, 
  FileText, 
  LayoutDashboard, 
  Briefcase, 
  Home, 
  HelpCircle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  currentTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAssistant: () => void;
  schoolInfo?: SchoolIdentity;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  isDarkMode,
  onToggleDarkMode,
  onOpenAssistant,
  schoolInfo
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const info = schoolInfo || SCHOOL_INFO;

  const navItems: { id: ScreenTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'majors', label: 'Program Keahlian', icon: GraduationCap },
    { id: 'ppdb', label: 'PPDB 2026/2027', icon: FileText, badge: 'Baru' },
    { id: 'sia', label: 'SIA Siswa', icon: LayoutDashboard },
    { id: 'bkk', label: 'BKK & Karier', icon: Briefcase },
    { id: 'contact', label: 'Kontak & Lokasi', icon: MapPin },
    { id: 'admin', label: 'Admin Portal', icon: ShieldCheck, badge: 'CMS' },
  ];

  const handleNavClick = (tab: ScreenTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-colors duration-200">
      {/* Top Notification & Official School Info Bar */}
      <div className="bg-[#0F4374] text-white text-xs py-2 px-4 border-b border-blue-900/40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Accreditation & Contact */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              Akreditasi {info.accreditation}
            </span>
            <span className="hidden sm:inline text-blue-200">NPSN: {info.npsn}</span>
            <span className="hidden md:inline text-blue-300">•</span>
            <div className="hidden md:flex items-center gap-1 text-blue-100">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Gombong, Kab. Kebumen</span>
            </div>
            <div className="hidden lg:flex items-center gap-1 text-blue-100">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{info.phone}</span>
            </div>
          </div>

          {/* Right: Quick actions */}
          <div className="flex items-center gap-2.5 ml-auto">
            <button
              onClick={() => handleNavClick('admin')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-900/70 hover:bg-blue-800 text-blue-200 hover:text-white font-semibold transition-all text-[11px] border border-blue-700/60"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Admin CMS</span>
            </button>

            <button
              id="topbar-assistant-btn"
              onClick={onOpenAssistant}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold transition-all shadow-sm text-[11px]"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>Tanya YAGO AI</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              id="darkmode-toggle-btn"
              onClick={onToggleDarkMode}
              title={isDarkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
              className="p-1 rounded-md text-blue-200 hover:text-white hover:bg-blue-800/60 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className={`w-full backdrop-blur-md border-b transition-colors shadow-sm ${
        isDarkMode 
          ? 'bg-slate-950/95 border-slate-800 text-white' 
          : 'bg-white/95 border-slate-200/80 text-slate-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Official Brand Logo */}
          <div className="flex items-center gap-3">
            <SchoolLogo
              variant={isDarkMode ? 'dark' : 'light'}
              size="md"
              customLogoUrl={info.logo}
              onClick={() => handleNavClick('home')}
            />
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? isDarkMode
                        ? 'bg-sky-950/70 text-sky-400 shadow-inner'
                        : 'bg-blue-50 text-[#0F4374] shadow-sm'
                      : isDarkMode
                      ? 'text-slate-300 hover:text-white hover:bg-slate-900'
                      : 'text-slate-600 hover:text-[#0F4374] hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? (isDarkMode ? 'text-sky-400' : 'text-[#0F4374]') : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 text-[10px] uppercase font-bold tracking-wider rounded-full bg-amber-500 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#EA8B00] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick PPDB CTA & Mobile Menu Toggle */}
          <div className="flex items-center gap-2.5">
            <button
              id="cta-ppdb-register"
              onClick={() => handleNavClick('ppdb')}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm bg-gradient-to-r from-[#0F4374] to-[#175c9e] hover:from-[#0d3b66] hover:to-[#0F4374] text-white shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Daftar Siswa Baru</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              id="mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg border transition-colors ${
                isDarkMode 
                  ? 'border-slate-800 text-slate-200 hover:bg-slate-900' 
                  : 'border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Menu Drawer */}
        {mobileMenuOpen && (
          <div className={`lg:hidden border-t px-4 pt-3 pb-5 space-y-1.5 animate-fadeIn ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? isDarkMode
                        ? 'bg-sky-950/70 text-sky-400 border border-sky-800/40'
                        : 'bg-blue-50 text-[#0F4374] border border-blue-200/80'
                      : isDarkMode
                      ? 'text-slate-300 hover:bg-slate-900'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-amber-500" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAssistant();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Konsultasi Jurusan (Tanya YAGO AI)</span>
              </button>
              <button
                onClick={() => handleNavClick('ppdb')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#0F4374] text-white font-bold text-sm"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Formulir PPDB Online 2026/2027</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
