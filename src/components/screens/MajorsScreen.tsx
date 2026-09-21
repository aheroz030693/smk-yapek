import React, { useState } from 'react';
import { MAJORS } from '../../data/schoolData';
import { Major, ScreenTab } from '../../types';
import { 
  CheckCircle2, 
  Briefcase, 
  Building2, 
  Award, 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  BookOpen, 
  Sparkles,
  Users
} from 'lucide-react';

interface MajorsScreenProps {
  onSelectTab: (tab: ScreenTab) => void;
  isDarkMode: boolean;
}

export const MajorsScreen: React.FC<MajorsScreenProps> = ({ onSelectTab, isDarkMode }) => {
  const [selectedMajorId, setSelectedMajorId] = useState<string>('tkj');

  const activeMajor = MAJORS.find((m) => m.id === selectedMajorId) || MAJORS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-[#0F4374] dark:text-sky-400 font-bold text-xs uppercase tracking-wider">
          Kurikulum Berbasis Industri
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white">
          Program Keahlian SMK YAPEK Gombong
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Setiap program keahlian dirancang untuk membekali siswa dengan kompetensi teknis (hard skills), pembentukan etos kerja (soft skills), serta sertifikasi resmi Badan Nasional Sertifikasi Profesi (BNSP).
        </p>
      </div>

      {/* Interactive Tabs for the 6 Majors */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 scrollbar-thin">
        {MAJORS.map((m) => {
          const isActive = m.id === selectedMajorId;
          return (
            <button
              key={m.id}
              onClick={() => setSelectedMajorId(m.id)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-[#0F4374] text-white shadow-md scale-105'
                  : isDarkMode
                  ? 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: m.color }}
              />
              <span>{m.code}</span>
            </button>
          );
        })}
      </div>

      {/* In-depth Major Details View */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xl">
        {/* Banner Section */}
        <div className="relative h-64 sm:h-80 overflow-hidden">
          <img
            src={activeMajor.image}
            alt={activeMajor.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>
          
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span
                className="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider text-white shadow"
                style={{ backgroundColor: activeMajor.color }}
              >
                {activeMajor.code}
              </span>
              <span className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 shadow">
                Terakreditasi {activeMajor.accreditation}
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold">{activeMajor.name}</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {activeMajor.fullDesc}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1: Kompetensi Keahlian */}
          <div className="space-y-4 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2.5 text-[#0F4374] dark:text-sky-400 font-bold text-base">
              <Award className="w-5 h-5 text-amber-500" />
              <h3>Kompetensi & Sertifikasi</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Keahlian praktis yang dikuasai siswa selama masa studi 3 tahun:
            </p>
            <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              {activeMajor.skills.map((skill, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 2: Prospek Karier & Peluang Kerja */}
          <div className="space-y-4 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2.5 text-[#0F4374] dark:text-sky-400 font-bold text-base">
              <Briefcase className="w-5 h-5 text-amber-500" />
              <h3>Prospek Karier Lulusan</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Jalur profesi dan penempatan kerja setelah lulus dari jurusan ini:
            </p>
            <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              {activeMajor.careerProspects.map((career, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
                  <span>{career}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 3: Fasilitas Laboratorium & Mitra DU/DI */}
          <div className="space-y-4 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2.5 text-[#0F4374] dark:text-sky-400 font-bold text-base">
              <Building2 className="w-5 h-5 text-amber-500" />
              <h3>Fasilitas Praktik & Lab</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {activeMajor.facilities.map((fac, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <span>{fac}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                Mitra Industri Terikat:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeMajor.partners.map((p, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action footer */}
        <div className="p-6 bg-slate-100 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-600 dark:text-slate-300 text-center sm:text-left">
            Tertarik mengambil jurusan <strong>{activeMajor.name}</strong> untuk tahun ajaran 2026/2027?
          </div>
          <button
            onClick={() => onSelectTab('ppdb')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow transition-all active:scale-95"
          >
            <span>Daftar Jurusan {activeMajor.code} di PPDB 2026</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
