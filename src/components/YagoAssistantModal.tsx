import React, { useState, useRef, useEffect } from 'react';
import { SCHOOL_INFO, MAJORS } from '../data/schoolData';
import { SchoolLogo } from './SchoolLogo';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  GraduationCap, 
  Award, 
  Briefcase, 
  CheckCircle2 
} from 'lucide-react';

interface YagoAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: any) => void;
  isDarkMode: boolean;
}

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  suggestions?: string[];
}

export const YagoAssistantModal: React.FC<YagoAssistantModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  isDarkMode
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: `Halo! Saya Asisten Virtual SMK YAPEK Gombong (YAGO AI). Ada yang bisa saya bantu terkait pendaftaran PPDB 2026/2027, pilihan 6 jurusan kejuruan, beasiswa, atau kegiatan sekolah?`,
      time: 'Baru saja',
      suggestions: [
        'Jurusan apa saja yang ada?',
        'Syarat & alur PPDB 2026',
        'Informasi beasiswa KIP & prestasi',
        'Prospek kerja & BKK'
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: 'Sekarang'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = '';
      const lower = query.toLowerCase();

      if (lower.includes('jurusan') || lower.includes('program keahlian')) {
        botResponse = `SMK YAPEK Gombong memiliki 6 Program Keahlian unggulan berakreditasi A:
1. TKJ (Teknik Komputer & Jaringan)
2. AKL (Akuntansi & Keuangan Lembaga)
3. MP / OTKP (Manajemen Perkantoran & Bisnis)
4. BDP / PM (Pemasaran & Bisnis Digital)
5. TKKR (Tata Kecantikan Kulit & Rambut - Jurusan Favorit)
6. TKR (Teknik Kendaraan Ringan Otomotif)

Semuanya dilengkapi laboratorium berstandar industri dan sertifikasi BNSP. Ingin saya bantu memilih jurusan yang cocok dengan minat Anda?`;
      } else if (lower.includes('ppdb') || lower.includes('daftar') || lower.includes('syarat')) {
        botResponse = `PPDB Tahun Ajaran 2026/2027 SMK YAPEK Gombong telah dibuka!
- Gelombang 1 berlangsung hingga Mei 2026.
- Syarat utama: Fotokopi Ijazah/SKL SMP/MTs, Kartu Keluarga (KK), Akta Kelahiran, dan NISN 10 digit.
- Anda dapat langsung mengisi Formulir PPDB Online melalui menu "PPDB 2026/2027" di aplikasi ini.`;
      } else if (lower.includes('beasiswa') || lower.includes('kip') || lower.includes('biaya')) {
        botResponse = `SMK YAPEK Gombong menyediakan program beasiswa:
1. Bebas Biaya SPI untuk peraih ranking 1-3 di SMP/MTs asal.
2. Bebas SPP 6 bulan untuk juara 1-3 lomba tingkat kabupaten/provinsi.
3. Bantuan biaya pendidikan untuk pemegang Kartu Indonesia Pintar (KIP / PIP) & Program Keluarga Harapan (PKH).`;
      } else if (lower.includes('bkk') || lower.includes('kerja') || lower.includes('lulus')) {
        botResponse = `Bursa Kerja Khusus (BKK) SMK YAPEK Gombong telah bekerja sama dengan lebih dari 65 mitra industri seperti PT Astra Honda Motor, PT Telkom Indonesia, PT Alfamart, perbankan, dan salon/spa profesional dengan tingkat keterserapan kerja mencapai 89.4%.`;
      } else if (lower.includes('ekskul') || lower.includes('kegiatan')) {
        botResponse = `Ekstrakurikuler di SMK YAPEK Gombong sangat beragam: Pramuka (wajib), Paskibra, PMR, Futsal, Bola Voli, Seni Musik & Rebana, Tari Tradisional, IT Network Club, English Club, dan Rohis.`;
      } else {
        botResponse = `Terima kasih pertanyaannya. SMK YAPEK Gombong berlokasi di Jl. Merbabu No. 64 Wero, Gombong, Kebumen. Anda juga dapat menghubungi call center PPDB di (0287) 472316 atau WhatsApp +62 812-2678-9020 untuk info langsung.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: botResponse,
          time: 'Baru saja',
          suggestions: ['Formulir PPDB', 'Program Beasiswa', 'Hubungi Panitia']
        }
      ]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="max-w-lg w-full h-[85vh] max-h-[640px] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-scaleUp">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0F4374] to-[#17528a] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-1.5">
                <span>YAGO AI Assistant</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </h3>
              <p className="text-[11px] text-blue-200">Asisten Resmi SMK YAPEK Gombong</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Message Flow */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs sm:text-sm">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-[#0F4374] text-white rounded-br-none'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/80 dark:border-slate-700/80'
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>
                <div className="text-[9px] mt-1 text-right opacity-60">{msg.time}</div>
              </div>

              {/* Quick suggestions if bot */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {msg.suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(s)}
                      className="px-2.5 py-1 rounded-full text-[11px] bg-blue-50 dark:bg-blue-950/50 text-[#0F4374] dark:text-sky-300 border border-blue-200 dark:border-blue-800/60 hover:bg-blue-100 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 text-slate-400 text-xs p-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]"></span>
              <span>YAGO AI sedang mengetik...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Tanyakan sesuatu tentang SMK YAPEK..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4374]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
