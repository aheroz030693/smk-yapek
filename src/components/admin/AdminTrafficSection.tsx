import React, { useState } from 'react';
import { DailyTraffic, TrafficSource, TopPageTraffic, VisitorLog } from '../../types';
import { 
  Users, 
  Eye, 
  TrendingUp, 
  Clock, 
  Globe, 
  Smartphone, 
  Monitor, 
  Tablet, 
  RefreshCw, 
  Share2, 
  Search, 
  Activity, 
  MapPin, 
  Compass, 
  ChevronRight,
  BarChart3,
  Calendar,
  Sparkles
} from 'lucide-react';

interface AdminTrafficSectionProps {
  trafficData: DailyTraffic[];
  trafficSources: TrafficSource[];
  topPages: TopPageTraffic[];
  visitorLogs: VisitorLog[];
  onRefreshTraffic?: () => void;
  isDarkMode: boolean;
}

export const AdminTrafficSection: React.FC<AdminTrafficSectionProps> = ({
  trafficData,
  trafficSources,
  topPages,
  visitorLogs,
  onRefreshTraffic,
  isDarkMode
}) => {
  const [activeRange, setActiveRange] = useState<'7d' | '30d'>('7d');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedLogFilter, setSelectedLogFilter] = useState<string>('all');

  // Compute metrics
  const totalVisitorsPeriod = trafficData.reduce((acc, d) => acc + d.visitors, 0);
  const totalPageviewsPeriod = trafficData.reduce((acc, d) => acc + d.pageviews, 0);
  const todayTraffic = trafficData[trafficData.length - 1] || { visitors: 2790, pageviews: 8940 };
  const maxVisitorsInChart = Math.max(...trafficData.map(d => d.visitors), 1);

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (onRefreshTraffic) onRefreshTraffic();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const filteredLogs = selectedLogFilter === 'all'
    ? visitorLogs
    : visitorLogs.filter(l => l.device.toLowerCase() === selectedLogFilter.toLowerCase());

  return (
    <div className="space-y-8">
      {/* Top Banner / Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#0F4374] to-[#154a7c] text-white shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Pemantauan Lalu Lintas Real-Time
            </span>
          </div>
          <h2 className="text-2xl font-black">Statistik & Trafik Pengunjung Portal</h2>
          <p className="text-xs text-blue-100">
            Analisis jangkauan calon pendaftar PPDB, kunjungan informasi BKK, dan antusiasme masyarakat
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/20 text-xs">
            <button
              onClick={() => setActiveRange('7d')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                activeRange === '7d' ? 'bg-white text-[#0F4374] shadow-sm' : 'text-white/80 hover:text-white'
              }`}
            >
              7 Hari Terakhir
            </button>
            <button
              onClick={() => setActiveRange('30d')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                activeRange === '30d' ? 'bg-white text-[#0F4374] shadow-sm' : 'text-white/80 hover:text-white'
              }`}
            >
              30 Hari
            </button>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Segarkan</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Pengunjung Hari Ini</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0F4374] dark:text-sky-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {todayTraffic.visitors.toLocaleString('id-ID')}
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              +14.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Kemarin: {(todayTraffic.visitors - 310).toLocaleString('id-ID')} pengunjung
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Pageviews (7 Hari)</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {totalPageviewsPeriod.toLocaleString('id-ID')}
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              +18.5%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Rata-rata 3.2 halaman per sesi pengunjung
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Rata-rata Durasi Baca</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">3m 42d</span>
            <span className="text-xs font-semibold text-slate-400">/ sesi</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Tingkat engagement tinggi pada laman PPDB & Jurusan
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Pengunjung Aktif Saat Ini</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">47</span>
            <span className="text-xs font-bold text-slate-500">Live Online</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Terbanyak di: Portal PPDB & Testimoni
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#0F4374] dark:text-sky-400" />
              <span>Grafik Trafik Harian & Tampilan Halaman</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tren kunjungan unik vs jumlah penayangan halaman setiap hari
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#0F4374]" />
              <span className="text-slate-600 dark:text-slate-300">Pengunjung Unik</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-amber-400" />
              <span className="text-slate-600 dark:text-slate-300">Pageviews</span>
            </div>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="pt-4">
          <div className="h-64 flex items-end justify-between gap-2 sm:gap-6 border-b border-slate-200 dark:border-slate-800 pb-2">
            {trafficData.map((item, idx) => {
              const visitorHeightPercent = Math.round((item.visitors / maxVisitorsInChart) * 100);
              const pageviewHeightPercent = Math.min(100, Math.round((item.pageviews / (maxVisitorsInChart * 3.5)) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 bg-slate-900 text-white text-[10px] p-2 rounded-lg shadow-xl whitespace-nowrap">
                    <div className="font-bold">{item.date} ({item.day})</div>
                    <div>Pengunjung: {item.visitors.toLocaleString('id-ID')}</div>
                    <div>Pageviews: {item.pageviews.toLocaleString('id-ID')}</div>
                  </div>

                  {/* Dual Bars */}
                  <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-52">
                    {/* Visitor Bar */}
                    <div
                      style={{ height: `${visitorHeightPercent}%` }}
                      className="w-1/2 max-w-[28px] rounded-t-md bg-[#0F4374] group-hover:bg-blue-700 transition-all"
                    />
                    {/* Pageviews Bar */}
                    <div
                      style={{ height: `${pageviewHeightPercent}%` }}
                      className="w-1/2 max-w-[28px] rounded-t-md bg-amber-400 group-hover:bg-amber-500 transition-all"
                    />
                  </div>

                  {/* Day Label */}
                  <div className="text-center pt-1">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.day}</div>
                    <div className="text-[10px] text-slate-400">{item.date.split(' ')[0]}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Two Column Grid: Sources & Top Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Col 1: Traffic Sources */}
        <div className="lg:col-span-6 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-500" />
                <span>Saluran & Sumber Trafik</span>
              </h3>
              <p className="text-xs text-slate-500">Dari mana calon siswa dan pengunjung menemukan portal</p>
            </div>
            <span className="text-xs font-bold text-[#0F4374] dark:text-sky-400">
              Total {trafficSources.reduce((a, b) => a + b.visitors, 0).toLocaleString('id-ID')}
            </span>
          </div>

          <div className="space-y-4">
            {trafficSources.map((source, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: source.color }}
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{source.source}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {source.visitors.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">({source.percentage}%)</span>
                    <span className="text-[10px] font-bold text-emerald-600">{source.trend}</span>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${source.percentage}%`,
                      backgroundColor: source.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Device Distribution mini-strip */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Distribusi Perangkat Pengguna:
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-center gap-2">
                <Smartphone className="w-4 h-4 text-blue-500" />
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">72%</div>
                  <div className="text-[10px] text-slate-400">Mobile</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-center gap-2">
                <Monitor className="w-4 h-4 text-emerald-500" />
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">23%</div>
                  <div className="text-[10px] text-slate-400">Desktop</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-center gap-2">
                <Tablet className="w-4 h-4 text-purple-500" />
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">5%</div>
                  <div className="text-[10px] text-slate-400">Tablet</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Col 2: Top Pages Visited */}
        <div className="lg:col-span-6 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-500" />
                <span>Halaman Paling Sering Dikunjungi</span>
              </h3>
              <p className="text-xs text-slate-500">Popularitas menu dan seksi informasi di website</p>
            </div>
          </div>

          <div className="space-y-3">
            {topPages.map((page, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-[#0F4374] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {page.name}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono pl-7">
                    {page.path}
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-xs font-black text-slate-900 dark:text-white">
                    {page.views.toLocaleString('id-ID')}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {page.percentage}% tampilan
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Visitor Log Activity Table */}
      <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-500" />
              <span>Log Kunjungan Pengunjung Real-Time</span>
            </h3>
            <p className="text-xs text-slate-500">
              Aktivitas pengunjung yang sedang mengakses portal SMK YAPEK Gombong
            </p>
          </div>

          {/* Device Filter */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 text-[11px]">Filter Perangkat:</span>
            <select
              value={selectedLogFilter}
              onChange={(e) => setSelectedLogFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">Semua Perangkat</option>
              <option value="mobile">Smartphone</option>
              <option value="desktop">Komputer / Desktop</option>
              <option value="tablet">Tablet</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4">Halaman yang Diakses</th>
                <th className="py-3 px-4">Lokasi Pengunjung</th>
                <th className="py-3 px-4">Sumber Referrer</th>
                <th className="py-3 px-4">Perangkat</th>
                <th className="py-3 px-4">IP (Anonim)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                    {log.time}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {log.page}
                  </td>
                  <td className="py-3 px-4 flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                    <span>{log.city}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                    {log.source}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.device === 'Mobile' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' 
                        : log.device === 'Desktop'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                    }`}>
                      {log.device}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                    {log.ipMasked}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
