import React from 'react';
import { SchoolLogo } from './SchoolLogo';
import { SCHOOL_INFO, MAJORS } from '../data/schoolData';
import { ScreenTab, SchoolIdentity } from '../types';
import { MapPin, Phone, Mail, Globe, Award, ShieldCheck, Clock, ArrowUpRight, Instagram } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: ScreenTab) => void;
  isDarkMode: boolean;
  schoolInfo?: SchoolIdentity;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, isDarkMode, schoolInfo }) => {
  const info = schoolInfo || SCHOOL_INFO;
  return (
    <footer className={`border-t transition-colors ${
      isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-900 border-slate-800 text-slate-300'
    }`}>
      {/* Top Banner inside Footer */}
      <div className="border-b border-slate-800/80 py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <SchoolLogo variant="dark" size="md" />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="px-4 py-2 rounded-lg bg-slate-800/80 border border-slate-700/80 flex items-center gap-2 text-xs text-slate-200">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Akreditasi {info.accreditation}</span>
            </div>
            <div className="px-4 py-2 rounded-lg bg-slate-800/80 border border-slate-700/80 flex items-center gap-2 text-xs text-slate-200">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>NPSN Resmi: {info.npsn}</span>
            </div>
            <div className="px-4 py-2 rounded-lg bg-slate-800/80 border border-slate-700/80 flex items-center gap-2 text-xs text-slate-200">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Berdiri {info.establishedYear}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Col 1: About & Location */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-base tracking-wide flex items-center gap-2">
            <span className="w-2 h-4 bg-amber-500 rounded-sm"></span>
            Tentang SMK YAPEK
          </h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            SMK YAPEK Gombong adalah Sekolah Menengah Kejuruan swasta terkemuka di Kabupaten Kebumen yang berkomitmen mencetak generasi berkarakter, berakhlak mulia, terampil, dan siap kerja di industri global.
          </p>
          <div className="space-y-2.5 text-xs text-slate-300 pt-2">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>{info.address}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>{info.phone} / {info.altPhone}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>{info.email}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>{info.website}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Instagram className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <a 
                href={info.instagram} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-amber-400 transition-colors flex items-center gap-1 text-rose-300 font-semibold"
              >
                <span>@smkyapekgombong</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Col 2: Program Keahlian (Majors) */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-base tracking-wide flex items-center gap-2">
            <span className="w-2 h-4 bg-[#0284c7] rounded-sm"></span>
            Program Keahlian
          </h4>
          <ul className="space-y-2 text-sm">
            {MAJORS.map((m) => (
              <li key={m.id}>
                <button
                  onClick={() => onSelectTab('majors')}
                  className="hover:text-amber-400 transition-colors flex items-center justify-between w-full text-left group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">
                    {m.code} - {m.name}
                  </span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Layanan & Portal */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-base tracking-wide flex items-center gap-2">
            <span className="w-2 h-4 bg-emerald-500 rounded-sm"></span>
            Layanan & Portal Siswa
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <button onClick={() => onSelectTab('ppdb')} className="hover:text-amber-400 transition-colors flex items-center gap-2">
                <span>Pendaftaran Siswa Baru (PPDB 2026)</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500 text-slate-950 font-bold">Online</span>
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('sia')} className="hover:text-amber-400 transition-colors">
                Sistem Informasi Akademik (SIA)
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('sia')} className="hover:text-amber-400 transition-colors">
                E-Presensi & Jadwal Pembelajaran
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('bkk')} className="hover:text-amber-400 transition-colors">
                Bursa Kerja Khusus (BKK YAPEK)
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('bkk')} className="hover:text-amber-400 transition-colors">
                Lowongan Kerja Mitra Industri
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('contact')} className="hover:text-amber-400 transition-colors">
                Layanan Pengaduan & Informasi
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('admin')} className="hover:text-amber-400 text-amber-300 font-semibold transition-colors flex items-center gap-1.5">
                <span>Backend Administrator (CMS)</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] bg-blue-600 text-white font-bold">Admin</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Jam Operasional & PPDB Call Center */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-base tracking-wide flex items-center gap-2">
            <span className="w-2 h-4 bg-purple-500 rounded-sm"></span>
            Jam Pelayanan Sekolah
          </h4>
          <div className="bg-slate-800/70 p-4 rounded-xl border border-slate-700/70 space-y-2 text-xs">
            <div className="flex justify-between pb-1.5 border-b border-slate-700/60">
              <span className="text-slate-300">Senin - Kamis</span>
              <span className="text-amber-400 font-semibold">07:00 - 15:30 WIB</span>
            </div>
            <div className="flex justify-between pb-1.5 border-b border-slate-700/60">
              <span className="text-slate-300">Jumat</span>
              <span className="text-amber-400 font-semibold">07:00 - 14:30 WIB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Sabtu</span>
              <span className="text-emerald-400 font-semibold">07:30 - 12:30 WIB (PPDB)</span>
            </div>
          </div>
          
          <div className="pt-2">
            <button
              onClick={() => onSelectTab('ppdb')}
              className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span>Cek Alur & Syarat PPDB 2026/2027</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="border-t border-slate-800 py-6 px-4 text-center text-xs text-slate-400">
        <p>© {new Date().getFullYear()} SMK YAPEK GOMBONG. Hak Cipta Dilindungi Undang-Undang.</p>
        <p className="mt-1 text-slate-400">
          Lembaga Pendidikan Kejuruan Berkualitas • Kabupaten Kebumen, Jawa Tengah
        </p>
      </div>
    </footer>
  );
};
