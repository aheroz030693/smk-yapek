import React, { useState } from 'react';
import { SCHOOL_INFO } from '../../data/schoolData';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Send, 
  MessageSquare, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface ContactScreenProps {
  isDarkMode: boolean;
}

export const ContactScreen: React.FC<ContactScreenProps> = ({ isDarkMode }) => {
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Informasi PPDB 2026/2027',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Informasi PPDB 2026/2027',
        message: ''
      });
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-[#0F4374] dark:text-sky-400 font-bold text-xs uppercase tracking-wider">
          Pusat Informasi & Layanan Publik
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white">
          Hubungi SMK YAPEK Gombong
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Kami siap melayani pertanyaan seputar PPDB, konsultasi jurusan, kerja sama industri, dan layanan administrasi alumni.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Col: Contact Info & Address */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-5 bg-[#0F4374] rounded-sm"></span>
              Sekretariat & Kampus
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0F4374] dark:text-sky-400 flex-shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Alamat Kampus</h4>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">{SCHOOL_INFO.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Telepon & Fax</h4>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">{SCHOOL_INFO.phone} / {SCHOOL_INFO.altPhone}</p>
                  <p className="text-slate-400 text-xs mt-0.5">WhatsApp PPDB: +62 812-2678-9020</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Email Resmi</h4>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">{SCHOOL_INFO.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Jam Pelayanan Kantor</h4>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">Senin - Kamis: 07:00 - 15:30 WIB</p>
                  <p className="text-slate-600 dark:text-slate-400">Jumat: 07:00 - 14:30 WIB</p>
                  <p className="text-amber-600 dark:text-amber-400 font-semibold">Sabtu: 07:30 - 12:30 WIB (Khusus PPDB)</p>
                </div>
              </div>
            </div>

            {/* Google Maps link CTA */}
            <div className="pt-2">
              <a
                href="https://maps.google.com/?q=SMK+YAPEK+Gombong+Kebumen"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>Buka Petunjuk Arah di Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Col: Contact & Message Form */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2.5 h-5 bg-amber-500 rounded-sm"></span>
                Kirim Pesan / Pengajuan Informasi
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Isi formulir di bawah ini dan tim humas kami akan merespons melalui email / WhatsApp dalam 1x24 jam.
              </p>
            </div>

            {formSent ? (
              <div className="p-8 text-center space-y-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-300">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-bold text-emerald-800 dark:text-emerald-200">Pesan Berhasil Terkirim!</h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  Terima kasih telah menghubungi SMK YAPEK Gombong. Tim kami akan segera menindaklanjuti pesan Anda.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nama Anda"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      No. WhatsApp / Telepon *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="08xxxxxxxxxx"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Alamat Email
                    </label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Kategori Pertanyaan
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
                    >
                      <option value="Informasi PPDB 2026/2027">Informasi PPDB 2026/2027</option>
                      <option value="Konsultasi Pemilihan Jurusan">Konsultasi Pemilihan Jurusan</option>
                      <option value="Kerja Sama Industri / BKK">Kerja Sama Industri / BKK</option>
                      <option value="Legalisir Ijazah Alumni">Legalisir Ijazah Alumni</option>
                      <option value="Lainnya">Pertanyaan Umum Lainnya</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Isi Pesan / Pertanyaan *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tuliskan pertanyaan atau informasi yang ingin Anda ketahui..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-[#0F4374] hover:bg-blue-900 text-white font-bold text-xs flex items-center gap-2 shadow transition-all active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Pesan ke Tim Humas</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
