import React, { useState } from 'react';
import { JOB_POSTINGS, SCHOOL_INFO } from '../../data/schoolData';
import { JobPosting } from '../../types';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  Building2, 
  CheckCircle2, 
  Send, 
  Search, 
  ArrowRight,
  TrendingUp,
  Users,
  Award
} from 'lucide-react';

interface BKKScreenProps {
  isDarkMode: boolean;
}

export const BKKScreen: React.FC<BKKScreenProps> = ({ isDarkMode }) => {
  const [selectedMajorFilter, setSelectedMajorFilter] = useState<string>('SEMUA');
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [applySuccess, setApplySuccess] = useState(false);

  const filterOptions = ['SEMUA', 'TKJ', 'AKL', 'MP / OTKP', 'BDP / PM', 'TKKR'];

  const filteredJobs = selectedMajorFilter === 'SEMUA'
    ? JOB_POSTINGS
    : JOB_POSTINGS.filter((job) => job.majorsRequired.includes(selectedMajorFilter));

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setApplySuccess(true);
    setTimeout(() => {
      setApplySuccess(false);
      setSelectedJob(null);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider">
          Penyaluran Kerja & Magang Industri
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white">
          Bursa Kerja Khusus (BKK YAPEK)
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Unit resmi penghubung antara peserta didik dan alumni SMK YAPEK Gombong dengan dunia usaha dan dunia industri (DU/DI) terkemuka skala regional dan nasional.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold flex-shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">89.4%</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Tingkat Serapan Kerja Lulusan</div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold flex-shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{SCHOOL_INFO.stats.industryPartners}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Perusahaan Mitra DU/DI Resmi</div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">18.200+</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Jejaring Alumni Aktif</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-bold text-slate-400 mr-2 uppercase">Filter Jurusan:</span>
        {filterOptions.map((opt) => (
          <button
            key={opt}
            onClick={() => setSelectedMajorFilter(opt)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedMajorFilter === opt
                ? 'bg-[#0F4374] text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Job Postings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                    {job.type}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5">
                    {job.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {job.company}
                  </p>
                </div>
                <div className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex-shrink-0">
                  {job.location}
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {job.description}
              </p>

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400 font-semibold mr-1">Khusus Jurusan:</span>
                {job.majorsRequired.map((m, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-950/50 text-[#0F4374] dark:text-sky-300 border border-blue-200 dark:border-blue-900"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="text-xs">
                <span className="text-slate-400 block text-[10px]">Estimasi Gaji / Saku:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{job.salaryRange}</span>
              </div>
              <button
                onClick={() => setSelectedJob(job)}
                className="px-4 py-2 rounded-xl bg-[#0F4374] hover:bg-blue-900 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Lamar via BKK</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-500">Pendaftaran BKK</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedJob.title}</h3>
                <p className="text-xs text-slate-500">{selectedJob.company} • {selectedJob.location}</p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {applySuccess ? (
              <div className="p-6 text-center space-y-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-300">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-emerald-800 dark:text-emerald-200">Lamaran Terkirim!</h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  Data Anda telah diteruskan ke koordinator BKK SMK YAPEK Gombong untuk proses seleksi berkas.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Lengkap Pelamar / Alumni *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Lengkap"
                    defaultValue="Ahmad Fauzi Alamsyah"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Jurusan Asal *
                    </label>
                    <select className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                      <option>TKJ</option>
                      <option>AKL</option>
                      <option>MP / OTKP</option>
                      <option>BDP / PM</option>
                      <option>TKKR</option>
                      <option>TKR</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Tahun Kelulusan *
                    </label>
                    <input
                      type="text"
                      required
                      defaultValue="2026 (Calon Lulusan)"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    No. Telepon / WhatsApp Aktif *
                  </label>
                  <input
                    type="tel"
                    required
                    defaultValue="081234567890"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedJob(null)}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-bold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Lamaran ke BKK</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
