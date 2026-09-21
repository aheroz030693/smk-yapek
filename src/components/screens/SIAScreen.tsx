import React, { useState } from 'react';
import { DEMO_SCHEDULE, DEMO_GRADES, SCHOOL_INFO } from '../../data/schoolData';
import { 
  User, 
  Calendar, 
  Clock, 
  BookOpen, 
  Award, 
  FileCheck, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  Building,
  CheckCircle2
} from 'lucide-react';

interface SIAScreenProps {
  isDarkMode: boolean;
}

export const SIAScreen: React.FC<SIAScreenProps> = ({ isDarkMode }) => {
  const [selectedDay, setSelectedDay] = useState<string>('Senin');
  const [activeTab, setActiveTab] = useState<'jadwal' | 'nilai' | 'presensi' | 'materi'>('jadwal');
  const [hasCheckedIn, setHasCheckedIn] = useState(true);

  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
  const filteredSchedule = DEMO_SCHEDULE.filter((s) => s.day === selectedDay);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Student Banner Header */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#0F4374] to-sky-500 text-white flex items-center justify-center font-bold text-2xl shadow-md flex-shrink-0">
              AF
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Ahmad Fauzi Alamsyah
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  Siswa Aktif
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Kelas: <strong className="text-slate-800 dark:text-slate-200">XI TKJ 1</strong> • NISN:{' '}
                <strong className="text-slate-800 dark:text-slate-200">0072819283</strong>
              </p>
              <p className="text-xs text-slate-400">
                Wali Kelas: Budi Santoso, S.Kom. • Kurikulum Merdeka Kejuruan
              </p>
            </div>
          </div>

          {/* Quick Stats or Actions */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Kehadiran Bulan Ini</div>
              <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">96.8%</div>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-bold">IPK Semester Ini</div>
              <div className="text-lg font-black text-amber-500">87.2 (A)</div>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('jadwal')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'jadwal'
                ? 'bg-[#0F4374] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Jadwal Pelajaran</span>
          </button>

          <button
            onClick={() => setActiveTab('nilai')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'nilai'
                ? 'bg-[#0F4374] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>E-Rapor & Nilai</span>
          </button>

          <button
            onClick={() => setActiveTab('presensi')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'presensi'
                ? 'bg-[#0F4374] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileCheck className="w-4 h-4 text-amber-400" />
            <span>Presensi Digital</span>
          </button>

          <button
            onClick={() => setActiveTab('materi')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'materi'
                ? 'bg-[#0F4374] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Materi & E-Learning</span>
          </button>
        </div>
      </div>

      {/* TAB 1: JADWAL PELAJARAN */}
      {activeTab === 'jadwal' && (
        <div className="space-y-6">
          {/* Day selection */}
          <div className="flex items-center gap-2">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedDay === day
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Schedule List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSchedule.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-start justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 dark:bg-blue-950/60 text-[#0F4374] dark:text-sky-300">
                      {item.room}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.time}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.subject}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Guru: {item.teacher}
                  </p>
                </div>

                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  {item.major}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: E-RAPOR & NILAI */}
      {activeTab === 'nilai' && (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Transkrip Nilai Akademik Siswa</h3>
              <p className="text-xs text-slate-500">Tahun Ajaran 2026/2027 • Semester 1 (Ganjil)</p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-[#0F4374] text-white text-xs font-bold flex items-center gap-2 hover:bg-blue-900"
            >
              <Download className="w-4 h-4" />
              <span>Unduh E-Rapor PDF</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Mata Pelajaran</th>
                  <th className="py-3 px-4">Pengajar</th>
                  <th className="py-3 px-4 text-center">KKM</th>
                  <th className="py-3 px-4 text-center">Pengetahuan</th>
                  <th className="py-3 px-4 text-center">Keterampilan</th>
                  <th className="py-3 px-4 text-center">Predikat</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {DEMO_GRADES.map((grade, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {grade.subject}
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                      {grade.teacher}
                    </td>
                    <td className="py-3 px-4 text-center">{grade.kkm}</td>
                    <td className="py-3 px-4 text-center font-semibold">{grade.knowledgeScore}</td>
                    <td className="py-3 px-4 text-center font-semibold">{grade.skillScore}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded font-black text-xs bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                        {grade.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-emerald-600 font-semibold flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {grade.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PRESENSI DIGITAL */}
      {activeTab === 'presensi' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Presensi Hari Ini</h4>
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="text-sm font-bold text-emerald-800 dark:text-emerald-200">
                {hasCheckedIn ? 'Hadir Tepat Waktu' : 'Belum Melakukan Presensi'}
              </div>
              <div className="text-xs text-emerald-700 dark:text-emerald-300">
                Waktu masuk: 06:55 WIB (Kampus SMK YAPEK Gombong)
              </div>
            </div>

            <button
              onClick={() => setHasCheckedIn(!hasCheckedIn)}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Simulasi Status Presensi
            </button>
          </div>

          <div className="md:col-span-2 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Rekap Absensi Semester Ganjil</h4>
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <div className="text-2xl font-black">72</div>
                <div className="text-[11px] font-semibold">Hadir</div>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                <div className="text-2xl font-black">2</div>
                <div className="text-[11px] font-semibold">Sakit</div>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                <div className="text-2xl font-black">1</div>
                <div className="text-[11px] font-semibold">Izin</div>
              </div>
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                <div className="text-2xl font-black">0</div>
                <div className="text-[11px] font-semibold">Alpa</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MATERI & E-LEARNING */}
      {activeTab === 'materi' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Modul Konfigurasi Routing Dinamis OSPF & BGP', author: 'Budi Santoso, S.Kom.', size: '4.2 MB', ext: 'PDF' },
            { title: 'Panduan Praktik Penyambungan Kabel Fiber Optik (Splicing)', author: 'Eko Prasetyo, S.T.', size: '6.8 MB', ext: 'PDF' },
            { title: 'Bahan Ajar Kewirausahaan Digital & Business Model Canvas', author: 'Dra. Sri Mulyani', size: '3.1 MB', ext: 'PDF' },
            { title: 'Vocational English: Job Interview & Resume Preparation', author: 'Nur Endah, S.Pd.', size: '2.5 MB', ext: 'PDF' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400">
                  {item.ext}
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
                <p className="text-xs text-slate-500">Oleh: {item.author} • {item.size}</p>
              </div>

              <button
                onClick={() => alert(`Mengunduh materi: ${item.title}`)}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#0F4374] hover:text-white transition-all text-slate-700 dark:text-slate-300"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
