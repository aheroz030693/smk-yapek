import { 
  Major, 
  NewsItem, 
  JobPosting, 
  AcademicGrade, 
  ScheduleItem, 
  PPDBApplicant, 
  AlumniTestimonial,
  HeadmasterProfile,
  SchoolIdentity,
  AdminUser,
  DailyTraffic,
  TrafficSource,
  TopPageTraffic,
  VisitorLog,
  ActivityGalleryItem
} from '../types';

export const INITIAL_SCHOOL_IDENTITY: SchoolIdentity = {
  name: 'SMK YAPEK GOMBONG',
  shortName: 'SMK YAGO',
  motto: 'Lembaga Pendidikan Kejuruan Berkualitas',
  tagline: 'Beriman, Kompeten, Kreatif, Mandiri & Berdaya Saing Global',
  npsn: '20330310',
  accreditation: 'A (Unggul)',
  establishedYear: '1967',
  address: 'Jl. Merbabu No. 64, Wero, Gombong, Kab. Kebumen, Jawa Tengah 54416',
  phone: '(0287) 472316',
  altPhone: '(0287) 471326',
  whatsapp: '+6281226789020',
  email: 'smkyapekgombong@gmail.com',
  website: 'https://smkyapekgombong.sch.id',
  instagram: 'https://www.instagram.com/smkyapekgombong/',
  instagramHandle: '@smkyapekgombong',
  vision: 'Menjadi Lembaga Pendidikan dan Pelatihan Kejuruan yang Unggul, Berakhlak Mulia, Berstandar Nasional dan Berdaya Saing Global pada Tahun 2030.',
  missions: [
    'Menyelenggarakan proses pembelajaran berbasis industri (Teaching Factory) dan sertifikasi kompetensi BNSP.',
    'Membina karakter peserta didik yang beriman, bertakwa, disiplin, berjiwa wirausaha dan berakhlak mulia.',
    'Memperluas jejaring kemitraan strategis dengan dunia usaha dan industri (DU/DI) skala nasional maupun internasional.',
    'Mengoptimalkan peran Bursa Kerja Khusus (BKK) dalam penyaluran tenaga kerja lulusan yang siap kerja dan mandiri.'
  ],
  stats: {
    students: '1.450+',
    alumni: '18.200+',
    industryPartners: '65+',
    jobPlacementRate: '89.4%',
    teachers: '78',
  }
};

export const INITIAL_HEADMASTER_PROFILE: HeadmasterProfile = {
  name: 'Drs. H. Suwarno, M.M.',
  title: 'Kepala SMK YAPEK Gombong',
  nip: '19680512 199403 1 004',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
  period: '2020 - Sekarang',
  quote: 'Mempersiapkan Generasi Berkeahlian Nyata, Siap Kerja dan Berakhlakul Karimah',
  speechGreeting: 'Assalamu’alaikum Warahmatullahi Wabarakatuh.',
  speechContent1: 'Selamat datang di portal resmi SMK YAPEK Gombong. Pendidikan vokasi saat ini dituntut tidak hanya adaptif terhadap lompatan teknologi digital dan otomatisasi industri, melainkan juga harus kokoh menanamkan karakter integritas, kedisiplinan kerja, kejujuran, dan kemandirian berwirausaha bagi setiap peserta didik.',
  speechContent2: 'Melalui 6 program kompetensi keahlian unggulan kami, sarana prasarana laboratorium berstandar industri, tenaga pendidik yang tersertifikasi asesor BNSP, serta jejaring kemitraan Bursa Kerja Khusus (BKK) yang terpercaya, kami bertekad mengawal setiap siswa mewujudkan impian karir terbaiknya.',
  speechClosing: 'Mari bersama melangkah pasti dan menjemput masa depan gemilang di SMK YAPEK Gombong. SMK Bisa, SMK Hebat, Vokasi Kuat Menguatkan Indonesia! Wassalamu’alaikum Warahmatullahi Wabarakatuh.'
};

// Backwards compatibility export
export const SCHOOL_INFO = {
  ...INITIAL_SCHOOL_IDENTITY,
  headmaster: INITIAL_HEADMASTER_PROFILE.name
};

export const MAJORS: Major[] = [
  {
    id: 'tkj',
    code: 'TKJ',
    name: 'Teknik Komputer & Jaringan',
    shortDesc: 'Spesialisasi rekayasa jaringan, konfigurasi server cloud, keamanan siber, dan infrastruktur IT enterprise.',
    fullDesc: 'Program Keahlian TKJ SMK YAPEK Gombong membekali peserta didik dengan keahlian praktis merakit komputer, instalasi sistem operasi, routing Mikrotik/Cisco, administrasi server Linux/Windows, fiber optic, dan internet security berstandar industri.',
    iconName: 'Network',
    color: '#0284c7',
    accreditation: 'A',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=900&q=80',
    skills: [
      'Mikrotik Certified Network Associate (MTCNA)',
      'Instalasi & Konfigurasi Jaringan Fiber Optic',
      'Administrasi Linux Server & Cloud Computing',
      'Cyber Security & Firewall Management',
      'Maintenance & Hardware Troubleshooting'
    ],
    careerProspects: [
      'Network Administrator & Engineer',
      'Technical Support Specialist',
      'Cloud & Server Administrator',
      'Cyber Security Junior Analyst',
      'Wirausaha ISP / Teknisi Jaringan'
    ],
    facilities: [
      'Lab Komputer TKJ Ber-AC & Jaringan Gigabit',
      'Mikrotik & Cisco Hardware Lab',
      'Splicer & OTDR Fiber Optic Toolset',
      'Server Rack & Data Center Mini'
    ],
    partners: ['PT Telkom Indonesia', 'MikroTik Academy', 'Biznet Networks', 'Lintasarta']
  },
  {
    id: 'akl',
    code: 'AKL',
    name: 'Akuntansi & Keuangan Lembaga',
    shortDesc: 'Pakar pembukuan digital, perpajakan, audit keuangan, dan aplikasi sistem akuntansi akurat.',
    fullDesc: 'Jurusan AKL SMK YAPEK Gombong berfokus pada penguasaan siklus akuntansi perusahaan jasa, dagang, dan manufaktur, akuntansi perbankan, perpajakan modern, serta software akuntansi komputer mutakhir seperti Accurate dan MYOB.',
    iconName: 'Calculator',
    color: '#059669',
    accreditation: 'A',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=900&q=80',
    skills: [
      'Komputer Akuntansi (Accurate & MYOB)',
      'Pengelolaan Kas & Pembukuan Keuangan',
      'Perpajakan PPh, PPN & e-Faktur',
      'Akuntansi Perbankan & Syariah',
      'Audit Sederhana & Penyusunan Laporan Keuangan'
    ],
    careerProspects: [
      'Staff Accounting & Finance Perusahaan',
      'Teller & Customer Service Perbankan',
      'Staff Administrasi Perpajakan',
      'Kasir & Payroll Officer',
      'Konsultan Pembukuan Mandiri'
    ],
    facilities: [
      'Bank Mini YAGO (Mini Bank Praktik Siswa)',
      'Lab Komputer Akuntansi Terlisensi Accurate',
      'Ruang Simulasi Transaksi Keuangan'
    ],
    partners: ['Bank Jateng', 'Bank Mandiri', 'BPR Kebumen', 'Kantor Akuntan Publik (KAP)']
  },
  {
    id: 'otkp',
    code: 'MP / OTKP',
    name: 'Manajemen Perkantoran & Layanan Bisnis',
    shortDesc: 'Mencetak tenaga administrasi profesional, sekretaris eksekutif, dan pengelola operasional kantor cerdas.',
    fullDesc: 'Membekali siswa dengan kompetensi tata kelola surat menyurat digital, kearsipan elektronik (e-filing), public relations, event management, protokoler, serta korespondensi bisnis dwibahasa (Indonesia & Inggris).',
    iconName: 'Briefcase',
    color: '#d97706',
    accreditation: 'A',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=900&q=80',
    skills: [
      'Otomatisasi Tata Kelola Perkantoran Digital',
      'Manajemen Kearsipan Modern & E-Filing',
      'Korespondensi Bisnis & Komunikasi Publik',
      'Pengelolaan Rapat & Protokoler Resmi',
      'Aplikasi Perkantoran Terpadu (MS 365 & Google Workspace)'
    ],
    careerProspects: [
      'Sekretaris Eksekutif & Asisten Manajer',
      'Staff Administrasi Kantor & Pemerintahan',
      'Public Relations / Front Office Staff',
      'Data Entry Operator & Arsiparis Digital',
      'Event & Meeting Organizer'
    ],
    facilities: [
      'Ruang Simulasi Perkantoran Modern',
      'Lab Mesin & Teknologi Kantor',
      'Smart Meeting & Conference Room'
    ],
    partners: ['Dinas Tenaga Kerja Kebumen', 'PT POS Indonesia', 'BUMN & Korporasi Swasta']
  },
  {
    id: 'bdp',
    code: 'BDP / PM',
    name: 'Pemasaran & Bisnis Digital',
    shortDesc: 'Menguasai strategi e-commerce, content marketing, ritel modern, dan kewirausahaan digital.',
    fullDesc: 'Mempersiapkan siswa menjadi praktisi pemasaran tangguh di era digital. Mempelajari social media marketing, SEO/SEM, fotografi produk, live streaming commerce, display toko modern, dan manajemen ritel berstandar industri.',
    iconName: 'ShoppingBag',
    color: '#ea580c',
    accreditation: 'A',
    image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=900&q=80',
    skills: [
      'Digital & Social Media Marketing (TikTok Shop, Shopee, IG)',
      'Copywriting & Content Creation',
      'Manajemen Ritel Modern & Point of Sale (POS)',
      'Customer Relationship Management (CRM)',
      'Wirausaha & E-Commerce Operasional'
    ],
    careerProspects: [
      'Digital Marketing Specialist',
      'Supervisor / Manager Toko Ritel Modern',
      'Content Creator & Live Streamer Seller',
      'Sales Executive & Account Officer',
      'Entrepreneur / Pemilik Bisnis Online'
    ],
    facilities: [
      'YAGO Business Center & Minimarket Praktik',
      'Studio Live Streaming & Fotografi Produk',
      'Lab Digital Marketing & E-Commerce'
    ],
    partners: ['PT Sumber Alfaria Trijaya (Alfamart)', 'PT Indomarco Prismatama (Indomaret)', 'Shopee Indonesia']
  },
  {
    id: 'tkkr',
    code: 'TKKR',
    name: 'Tata Kecantikan Kulit & Rambut',
    shortDesc: 'Jurusan unggulan pelopor kecantikan profesional, tata rias artistik, perawatan kulit, dan hair styling modern.',
    fullDesc: 'Jurusan TKKR SMK YAPEK Gombong merupakan salah satu program unggulan kebanggaan Kebumen. Dilengkapi salon dan spa kecantikan standar industri untuk pelatihan bridal makeup, facial treatment, body spa, nail art, hingga hair colouring dan hair styling komersial.',
    iconName: 'Sparkles',
    color: '#e11d48',
    accreditation: 'A',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80',
    skills: [
      'Tata Rias Pengantin Tradisional & Modern (Bridal MUA)',
      'Perawatan Kulit Wajah & Facial Elektrik',
      'Pemangkasan, Penataan & Pewarnaan Rambut',
      'Body Spa, Manicure, Pedicure & Nail Art',
      'Manajemen Bisnis Salon & Beauty Clinic'
    ],
    careerProspects: [
      'Professional Make-Up Artist (MUA)',
      'Beauty Therapist & Skin Consultant',
      'Hair Stylist & Salon Director',
      'Beauty Advisor Brand Kosmetik Ternama',
      'Owner Beauty Salon, Barbershop & Spa'
    ],
    facilities: [
      'Beauty Center Salon & Spa Terstandar',
      'Studio Rias Pengantin & Foto Portofolio',
      'Peralatan Facial High Frequency & Bed Treatment Modern'
    ],
    partners: ['PT Paragon Technology (Wardah / Make Over)', 'Martha Tilaar', 'Rudy Hadisuwarno', 'Asosiasi MUA Indonesia']
  },
  {
    id: 'tkr',
    code: 'TKR',
    name: 'Teknik Kendaraan Ringan Otomotif',
    shortDesc: 'Spesialis mesin otomotif modern, Electronic Fuel Injection (EFI), chasis, dan kelistrikan mobil.',
    fullDesc: 'Mendidik calon mekanik dan teknisi otomotif andal dengan penguasaan diagnosis komputer (engine scanner), overhaul mesin bensin & diesel, sistem AC mobil, rem ABS, spooring & balancing, serta keselamatan kerja bengkel standar pabrikan.',
    iconName: 'Wrench',
    color: '#4f46e5',
    accreditation: 'A',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=900&q=80',
    skills: [
      'Tune-Up & Overhaul Mesin Otomotif (EFI & Diesel)',
      'Diagnosis Komputer Engine Scanner',
      'Troubleshooting Kelistrikan Bodi & ECU',
      'Service Transmisi Otomatis & Manual',
      'Perawatan Sistem Rem ABS, Kemudi, & Suspensi'
    ],
    careerProspects: [
      'Teknisi Mekanik Bengkel Resmi Agen Pemegang Merek (APM)',
      'Service Advisor Otomotif',
      'Quality Control Industri Perakitan Mobil',
      'Teknisi Audio & Kelistrikan Mobil',
      'Pemilik Bengkel Otomotif Mandiri'
    ],
    facilities: [
      'Bengkel Otomotif Standar Bengkel Resmi',
      'Unit Mobil Praktik EFI & Diesel Common Rail',
      'Car Lift Hidrolik, Scanner Diagnostic, & Tire Changer'
    ],
    partners: ['PT Astra Honda Motor', 'Auto2000', 'Suzuki Indomobil', 'Bengkel Mitra Terpercaya']
  }
];

export const NEWS_LIST: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Penerimaan Peserta Didik Baru (PPDB) SMK YAPEK Gombong Tahun Ajaran 2026/2027 Dibuka',
    category: 'PPDB',
    date: '20 September 2026',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    summary: 'SMK YAPEK Gombong membuka pendaftaran calon peserta didik baru melalui jalur Reguler, Prestasi, dan Afirmasi dengan beasiswa bebas biaya gedung untuk siswa berprestasi.',
    content: `Gombong, Kebumen — SMK YAPEK Gombong secara resmi membuka Penerimaan Peserta Didik Baru (PPDB) untuk Tahun Ajaran 2026/2027. Pembukaan pendaftaran ini disambut antusias oleh ratusan calon siswa lulusan SMP/MTs di wilayah Kabupaten Kebumen, Banyumas, dan sekitarnya.

Kepala SMK YAPEK Gombong, Drs. H. Suwarno, M.M., menyampaikan bahwa pada tahun ajaran ini pihak sekolah menyediakan kuota untuk 6 program keahlian unggulan berakreditasi A, yaitu TKJ, AKL, Manajemen Perkantoran (OTKP), Bisnis Daring & Pemasaran, Tata Kecantikan Kulit dan Rambut (TKKR), serta Teknik Kendaraan Ringan (TKR).

"Kami berkomitmen memberikan akses pendidikan vokasi berkualitas dengan fasilitas laboratorium berstandar industri. Bagi siswa berprestasi peringkat 1 sampai 3 di sekolah asal, kami memberikan beasiswa khusus pembebasan biaya Sumbangan Pengembangan Institusi (SPI)," jelas beliau.

Pendaftaran dapat dilakukan secara daring (online) melalui portal resmi sekolah atau hadir langsung di Sekretariat Panitia PPDB Kampus SMK YAPEK Gombong Jl. Merbabu No. 64 Wero, Gombong setiap hari kerja pukul 07.30 - 14.30 WIB.`,
    author: 'Panitia PPDB 2026',
    views: 1420,
    tags: ['PPDB 2026', 'Pendaftaran', 'Beasiswa', 'Gombong'],
    status: 'published',
    relatedArticleIds: ['news-2', 'news-3'],
    attachments: [
      {
        id: 'att-1',
        name: 'Juknis_PPDB_SMK_YAPEK_2026_2027.pdf',
        fileType: 'pdf',
        fileSize: '2.4 MB',
        url: '#',
        uploadDate: '20 Sep 2026'
      },
      {
        id: 'att-2',
        name: 'Formulir_Pendaftaran_Siswa_Baru_2026.docx',
        fileType: 'docx',
        fileSize: '485 KB',
        url: '#',
        uploadDate: '20 Sep 2026'
      }
    ],
    contentImages: [
      {
        id: 'cimg-1',
        url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
        caption: 'Pelayanan verifikasi berkas PPDB di ruang sekretariat'
      }
    ]
  },
  {
    id: 'news-2',
    title: 'Siswa TKJ SMK YAPEK Raih Juara 1 LKS Tingkat Karesidenan Kedu Bidang Network System',
    category: 'Prestasi',
    date: '14 September 2026',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    summary: 'Prestasi membanggakan kembali diukir oleh ananda Dwi Cahyo siswa kelas XII TKJ yang menyabet medali emas Lomba Kompetensi Siswa (LKS) bidang IT Network System Administration.',
    content: `Magelang — Kabar membanggakan datang dari ajang Lomba Kompetensi Siswa (LKS) SMK Tingkat Karesidenan Kedu tahun 2026. Dwi Cahyo, siswa kelas XII Teknik Komputer dan Jaringan (TKJ) SMK YAPEK Gombong berhasil menorehkan medali emas setelah menundukkan 18 kontestan perwakilan SMK se-Karesidenan Kedu.

Dalam perlombaan yang berlangsung selama dua hari penuh ini, para peserta diuji kemampuannya dalam melakukan konfigurasi Cisco Router & Switch, routing dinamis BGP/OSPF, virtualisasi Proxmox, keamanan firewall, dan fiber optic troubleshooting.

Pembimbing lomba, Budi Santoso, S.Kom., mengungkapkan rasa syukur dan bangganya atas dedikasi dan kerja keras yang ditunjukkan ananda Dwi Cahyo selama masa karantina di laboratorium jaringan sekolah.

"Kemenangan ini membuktikan bahwa kompetensi peserta didik SMK YAPEK Gombong mampu bersaing di level tertinggi. Selanjutnya ananda Dwi Cahyo akan mewakili Karesidenan Kedu di LKS Tingkat Provinsi Jawa Tengah," tutur beliau.`,
    author: 'Humas SMK YAGO',
    views: 980,
    tags: ['Prestasi', 'TKJ', 'LKS Kedu', 'Medali Emas'],
    status: 'published',
    relatedArticleIds: ['news-1', 'news-3'],
    attachments: [
      {
        id: 'att-3',
        name: 'Berita_Acara_Hasil_Penilaian_LKS_Karesidenan_Kedu.pdf',
        fileType: 'pdf',
        fileSize: '1.8 MB',
        url: '#',
        uploadDate: '14 Sep 2026'
      }
    ],
    contentImages: [
      {
        id: 'cimg-2',
        url: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=800&q=80',
        caption: 'Penyerahan medali emas dan trofi juara LKS Karesidenan Kedu'
      }
    ]
  },
  {
    id: 'news-3',
    title: 'Bursa Kerja Khusus (BKK) YAPEK Gelar Rekrutmen Langsung Bersama PT Astra & Alfamart Group',
    category: 'BKK',
    date: '08 September 2026',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80',
    summary: 'Sebanyak 180 calon lulusan dan alumni mengikuti walk-in interview dan tes psikotes penempatan kerja industri di aula utama SMK YAPEK Gombong.',
    content: `Gombong — Komitmen SMK YAPEK Gombong dalam menjamin masa depan lulusannya kembali terwujud melalui kegiatan rekrutmen kerja massal (Campus Hiring) yang digelar oleh Bursa Kerja Khusus (BKK) YAPEK bekerja sama dengan PT Astra Honda Motor dan PT Sumber Alfaria Trijaya Tbk (Alfamart Group).

Acara yang dipusatkan di Aula Utama SMK YAPEK Gombong ini diikuti oleh lebih dari 180 pelamar yang terdiri atas alumni lintas angkatan serta calon lulusan kelas XII. Tahapan seleksi meliputi verifikasi berkas administrasi, tes potensi akademik, psikotes digital, dan walk-in interview bersama Human Resource Department (HRD) perusahaan mitra.

Koordinator BKK SMK YAPEK Gombong menyatakan bahwa kegiatan penyaluran kerja seperti ini diadakan secara berkala tiap kuartal guna memastikan tingkat keterserapan lulusan tetap berada di atas 89%.

Bagi para alumni yang dinyatakan lolos seleksi final, mereka akan langsung menandatangani kontrak kerja dan diberangkatkan menuju fasilitas pabrik perakitan dan jaringan ritel nasional.`,
    author: 'Koordinator BKK',
    views: 1850,
    tags: ['BKK', 'Lowongan Kerja', 'Astra', 'Alfamart'],
    status: 'published',
    relatedArticleIds: ['news-1', 'news-4'],
    attachments: [
      {
        id: 'att-4',
        name: 'Daftar_Peserta_Lolos_Seleksi_Campus_Hiring.xlsx',
        fileType: 'xlsx',
        fileSize: '320 KB',
        url: '#',
        uploadDate: '08 Sep 2026'
      }
    ]
  },
  {
    id: 'news-4',
    title: 'Workshop Beauty Demo & Masterclass Bridal Makeup bersama Brand Kosmetik Nasional',
    category: 'Kegiatan',
    date: '02 September 2026',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
    summary: 'Jurusan Tata Kecantikan Kulit dan Rambut (TKKR) menggelar workshop inspiratif tren rias pengantin adat nusantara dan modern glamor bersama praktisi MUA profesional.',
    content: `Gombong — Ruang Praktik Siswa (RPS) Tata Kecantikan SMK YAPEK Gombong semarak dengan digelarnya Workshop Beauty Demo & Masterclass bertajuk "Eksplorasi Rias Pengantin Nusantara Modern dan Tata Rias Komersial".

Acara ini menghadirkan praktisi Make-Up Artist (MUA) tersohor dan perwakilan tim edukasi brand kecantikan nasional. Sebanyak 75 siswi jurusan Tata Kecantikan Kulit dan Rambut (TKKR) mengikuti setiap sesi praktik secara langsung, mulai dari teknik skin preparation yang tepat, teknik blending complexion tahan lama, hingga pemasangan hijab do dan sanggul modern.

Ketua Program Keahlian TKKR menuturkan bahwa kegiatan workshop praktisi mengajar ini merupakan bagian integral dari program link and match kurikulum vokasi, sehingga para siswi telah memiliki standar industri dan portofolio profesional sebelum lulus.`,
    author: 'Ketua Program TKKR',
    views: 760,
    tags: ['Tata Kecantikan', 'TKKR', 'Workshop', 'MUA'],
    status: 'published',
    relatedArticleIds: ['news-1', 'news-2']
  }
];

export const INITIAL_APPLICANTS: PPDBApplicant[] = [
  {
    id: 'YAGO-2026-001',
    nisn: '0089281721',
    fullName: 'Rizky Pratama Yudha',
    gender: 'Laki-laki',
    birthPlace: 'Kebumen',
    birthDate: '2010-04-15',
    originSchool: 'SMP Negeri 1 Gombong',
    parentName: 'Bambang Sugiono',
    parentPhone: '081234567890',
    email: 'rizky.pratama@gmail.com',
    address: 'Jl. Yos Sudarso No. 12, Wero, Gombong',
    firstMajor: 'TKJ',
    secondMajor: 'TKR',
    track: 'Prestasi',
    avgReportScore: 88.5,
    status: 'Lolos Seleksi Administrasi',
    registeredAt: '2026-09-18 10:30'
  },
  {
    id: 'YAGO-2026-002',
    nisn: '0091827364',
    fullName: 'Anisa Nur Rahmawati',
    gender: 'Perempuan',
    birthPlace: 'Gombong',
    birthDate: '2010-08-22',
    originSchool: 'MTs Negeri 1 Kebumen',
    parentName: 'Siti Aminah',
    parentPhone: '082198765432',
    email: 'anisa.nur@gmail.com',
    address: 'Desa Semondo, RT 02/03, Gombong',
    firstMajor: 'AKL',
    secondMajor: 'MP / OTKP',
    track: 'Reguler',
    avgReportScore: 86.0,
    status: 'Berkas Lengkap',
    registeredAt: '2026-09-19 14:15'
  },
  {
    id: 'YAGO-2026-003',
    nisn: '0087654321',
    fullName: 'Nabila Putri Anggraeni',
    gender: 'Perempuan',
    birthPlace: 'Kebumen',
    birthDate: '2010-11-05',
    originSchool: 'SMP Negeri 2 Karanganyar',
    parentName: 'Haryanto',
    parentPhone: '085712345678',
    email: 'nabila.putri@gmail.com',
    address: 'Jl. Raya Karanganyar Km. 3, Kebumen',
    firstMajor: 'TKKR',
    secondMajor: 'BDP / PM',
    track: 'Afirmasi / KIP',
    avgReportScore: 84.8,
    status: 'Menunggu Verifikasi',
    registeredAt: '2026-09-20 09:00'
  }
];

export const JOB_POSTINGS: JobPosting[] = [
  {
    id: 'job-1',
    title: 'Staff Junior Network Engineer & IT Support',
    company: 'PT Telkom Akses / Mitra Gombong',
    logo: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=150&q=80',
    location: 'Kebumen & Purwokerto',
    type: 'Full-time',
    majorsRequired: ['TKJ'],
    salaryRange: 'Rp 2.800.000 - Rp 3.800.000',
    deadline: '10 Oktober 2026',
    description: 'Bertanggung jawab melakukan pemeliharaan jaringan kabel fiber optik, setup router ONT, dan konfigurasi akses point pelanggan.',
    requirements: [
      'Lulusan SMK Jurusan TKJ (fresh graduate dipersilakan)',
      'Memahami dasar TCP/IP, Mikrotik, dan fiber optik',
      'Memiliki SIM C aktif dan kendaraan sendiri',
      'Disiplin, jujur, dan berorientasi pada pelayanan'
    ]
  },
  {
    id: 'job-2',
    title: 'Junior Accounting & Kasir Toko Ritel',
    company: 'PT Sumber Alfaria Trijaya Tbk (Alfamart)',
    logo: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=150&q=80',
    location: 'Gombong, Kebumen & Banyumas',
    type: 'Full-time',
    majorsRequired: ['AKL', 'BDP / PM'],
    salaryRange: 'Rp 2.600.000 - Rp 3.400.000',
    deadline: '15 Oktober 2026',
    description: 'Mengelola transaksi kasir POS, pencatatan stock opname harian, rekonsiliasi kas masuk-keluar, serta laporan harian toko.',
    requirements: [
      'Lulusan SMK Jurusan AKL atau BDP',
      'Teliti berhitung dan menguasai Excel dasar',
      'Komunikatif, berpenampilan rapi dan ramah',
      'Bersedia bekerja dalam sistem shift kerja ritel'
    ]
  },
  {
    id: 'job-3',
    title: 'Beauty Therapist & Hair Stylist Trainee',
    company: 'Glow Beauty Clinic & Salon Premium',
    logo: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=150&q=80',
    location: 'Kebumen Kota & Gombong',
    type: 'Full-time',
    majorsRequired: ['TKKR'],
    salaryRange: 'Rp 2.700.000 + Insentif Treatment',
    deadline: '25 Oktober 2026',
    description: 'Melakukan pelayanan facial treatment modern, creambath spa, manicure pedicure, dan penataan rambut konsumen klinik.',
    requirements: [
      'Lulusan SMK Jurusan Tata Kecantikan Kulit & Rambut',
      'Menyukai dunia estetika dan hospitality',
      'Memiliki sertifikasi kompetensi keahlian menjadi nilai plus',
      'Siap mengikuti training SOP klinik kecantikan'
    ]
  },
  {
    id: 'job-4',
    title: 'Staff Administrasi & Customer Service',
    company: 'PT Mandiri Finance Cabang Kebumen',
    logo: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=150&q=80',
    location: 'Gombong - Kebumen',
    type: 'Kontrak',
    majorsRequired: ['MP / OTKP', 'AKL'],
    salaryRange: 'Rp 2.900.000 - Rp 3.500.000',
    deadline: '30 Oktober 2026',
    description: 'Pengarsipan dokumen nasabah, input data aplikasi pembiayaan, verifikasi kelengkapan berkas, dan menyambut tamu kantor.',
    requirements: [
      'Lulusan SMK Jurusan Manajemen Perkantoran / OTKP',
      'Cekatan mengetik dan mengoperasikan MS Office',
      'Kemampuan komunikasi verbal yang santun dan jelas'
    ]
  }
];

export const DEMO_SCHEDULE: ScheduleItem[] = [
  { day: 'Senin', time: '07:00 - 08:30', subject: 'Upacara Bendera & Pembinaan Karakter', teacher: 'Tim Kesiswaan', room: 'Lapangan Utama', major: 'Umum' },
  { day: 'Senin', time: '08:30 - 10:00', subject: 'Administrasi Infrastruktur Jaringan (AIJ)', teacher: 'Budi Santoso, S.Kom.', room: 'Lab TKJ 1', major: 'TKJ' },
  { day: 'Senin', time: '10:15 - 12:15', subject: 'Praktik Konfigurasi Router & Mikrotik', teacher: 'Budi Santoso, S.Kom.', room: 'Lab TKJ 1', major: 'TKJ' },
  { day: 'Senin', time: '13:00 - 14:30', subject: 'Pendidikan Agama & Budi Pekerti', teacher: 'Drs. H. Ahmad Munir', room: 'Ruang Teori XI-1', major: 'Umum' },
  { day: 'Selasa', time: '07:15 - 09:30', subject: 'Teknologi Layanan Jaringan (TLJ)', teacher: 'Wahyu Hidayat, M.Kom.', room: 'Lab TKJ 2', major: 'TKJ' },
  { day: 'Selasa', time: '09:45 - 12:00', subject: 'Bahasa Inggris Kejuruan (Vocational English)', teacher: 'Nur Endah, S.Pd.', room: 'Lab Bahasa', major: 'Umum' },
  { day: 'Rabu', time: '07:15 - 10:15', subject: 'Praktikum Fiber Optik & Splicing', teacher: 'Eko Prasetyo, S.T.', room: 'Lab Hardware TKJ', major: 'TKJ' },
  { day: 'Rabu', time: '10:30 - 12:30', subject: 'Matematika Terapan', teacher: 'Siti Aminah, M.Pd.', room: 'Ruang Teori XI-1', major: 'Umum' },
  { day: 'Kamis', time: '07:15 - 09:45', subject: 'Produk Kreatif & Kewirausahaan (PKK)', teacher: 'Dra. Sri Mulyani', room: 'Business Lab', major: 'Umum' },
  { day: 'Kamis', time: '10:00 - 12:15', subject: 'Administrasi Sistem Jaringan (ASJ Server)', teacher: 'Budi Santoso, S.Kom.', room: 'Lab TKJ 1', major: 'TKJ' },
  { day: 'Jumat', time: '07:00 - 08:30', subject: 'Senam Pagi & Kebersihan Lingkungan (Jumat Bersih)', teacher: 'Guru Olahraga & Osis', room: 'Area Kampus', major: 'Umum' },
  { day: 'Jumat', time: '08:45 - 11:00', subject: 'Projek Penguatan Profil Pelajar Pancasila (P5)', teacher: 'Fasilitator P5', room: 'Aula Utama', major: 'Umum' }
];

export const DEMO_GRADES: AcademicGrade[] = [
  { subject: 'Administrasi Infrastruktur Jaringan', code: 'C3-TKJ-01', teacher: 'Budi Santoso, S.Kom.', kkm: 75, knowledgeScore: 89, skillScore: 92, grade: 'A', status: 'Tuntas' },
  { subject: 'Teknologi Layanan Jaringan', code: 'C3-TKJ-02', teacher: 'Wahyu Hidayat, M.Kom.', kkm: 75, knowledgeScore: 86, skillScore: 88, grade: 'A', status: 'Tuntas' },
  { subject: 'Administrasi Sistem Jaringan', code: 'C3-TKJ-03', teacher: 'Budi Santoso, S.Kom.', kkm: 75, knowledgeScore: 84, skillScore: 90, grade: 'A', status: 'Tuntas' },
  { subject: 'Produk Kreatif & Kewirausahaan', code: 'C3-PKK-01', teacher: 'Dra. Sri Mulyani', kkm: 75, knowledgeScore: 88, skillScore: 85, grade: 'A', status: 'Tuntas' },
  { subject: 'Bahasa Indonesia', code: 'A-BIN-01', teacher: 'Dra. Tri Astuti', kkm: 75, knowledgeScore: 82, skillScore: 85, grade: 'B', status: 'Tuntas' },
  { subject: 'Bahasa Inggris Kejuruan', code: 'A-BIG-01', teacher: 'Nur Endah, S.Pd.', kkm: 75, knowledgeScore: 85, skillScore: 88, grade: 'A', status: 'Tuntas' },
  { subject: 'Matematika', code: 'A-MAT-01', teacher: 'Siti Aminah, M.Pd.', kkm: 75, knowledgeScore: 80, skillScore: 82, grade: 'B', status: 'Tuntas' },
  { subject: 'Pendidikan Agama Islam', code: 'A-PAI-01', teacher: 'Drs. H. Ahmad Munir', kkm: 75, knowledgeScore: 90, skillScore: 92, grade: 'A', status: 'Tuntas' }
];

export const ALUMNI_TESTIMONIALS: AlumniTestimonial[] = [
  {
    id: 'testi-1',
    name: 'Bagas Prasetyo, S.Kom.',
    graduationYear: 2025,
    major: 'Teknik Komputer & Jaringan (TKJ)',
    role: 'Junior Cloud & Network Engineer',
    company: 'PT Telkom Akses Regional Jawa Tengah',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    content: 'Berkat sertifikasi Mikrotik dan kurikulum fiber optic di SMK YAPEK Gombong, saat tes teknis di PT Telkom Akses saya sudah sangat terbiasa dengan konfigurasi routing dan teknik splicing kabel. BKK sekolah sangat proaktif menghubungkan lulusan langsung dengan dunia industri.',
    rating: 5,
    highlight: 'Diterima kerja sebelum wisuda melalui Campus Hiring BKK YAPEK',
    status: 'approved',
    sharedAt: '15 Januari 2026'
  },
  {
    id: 'testi-2',
    name: 'Rina Novita Sari',
    graduationYear: 2025,
    major: 'Akuntansi & Keuangan Lembaga (AKL)',
    role: 'Junior Auditor & Finance Staff',
    company: 'Kantor Akuntan Publik (KAP) Semarang',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    content: 'Praktik akuntansi komputer dan software Accurate di lab komputer SMK YAPEK benar-benar mencerminkan kondisi riil di kantor audit. Guru-guru AKL sangat telaten membimbing hingga kami mengantongi sertifikasi kompetensi BNSP resmi.',
    rating: 5,
    highlight: 'Sertifikasi BNSP Teknisi Akuntansi Yunior',
    status: 'approved',
    sharedAt: '20 Januari 2026'
  },
  {
    id: 'testi-3',
    name: 'Dimas Arya Saputra',
    graduationYear: 2024,
    major: 'Teknik Kendaraan Ringan (TKR)',
    role: 'Diagnostic Master Technician',
    company: 'Auto2000 Kebumen & Yogyakarta',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    content: 'Fasilitas bengkel dan unit mesin injeksi EFI di SMK YAPEK sangat memadai dan selalu mengikuti perkembangan teknologi mobil modern. Disiplin ala industri dan budaya kerja 5R yang ditanamkan membuat saya cepat beradaptasi dengan ritme kerja bengkel resmi Toyota.',
    rating: 5,
    highlight: 'Juara 1 LKS Otomotif Karesidenan Kedu 2024',
    status: 'approved',
    sharedAt: '05 Februari 2026'
  },
  {
    id: 'testi-4',
    name: 'Siti Nurhaliza',
    graduationYear: 2024,
    major: 'Tata Kecantikan Kulit & Rambut (TKKR)',
    role: 'Founder & Lead Beauty Stylist',
    company: 'Eliza Bridal & Beauty Studio Gombong',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
    content: 'Di jurusan Tata Kecantikan SMK YAPEK, kami tidak hanya diajari teknik rias pengantin modern dan perawatan kulit berstandar salon ternama, tetapi juga manajemen bisnis dan hospitality. Kini saya mandiri membuka studio salon sendiri dan mempekerjakan 4 asisten.',
    rating: 5,
    highlight: 'Wirausahawan Muda Sukses Beromzet Puluhan Juta',
    status: 'approved',
    sharedAt: '12 Februari 2026'
  },
  {
    id: 'testi-5',
    name: 'Muhammad Farhan',
    graduationYear: 2023,
    major: 'Teknik Komputer & Jaringan (TKJ)',
    role: 'Cybersecurity Analyst & Sysadmin',
    company: 'Binar Solusi Digital Jakarta',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    content: 'Dasar administrasi server Linux, keamanan jaringan, dan problem solving saya dapatkan dari guru-guru hebat di SMK YAPEK. Sekolah ini tidak hanya melatih skill teknis, tapi juga membentuk integritas dan etos pantang menyerah.',
    rating: 5,
    highlight: 'Bekerja Remote Nasional sambil Melanjutkan Kuliah S1',
    status: 'approved',
    sharedAt: '18 Februari 2026'
  },
  {
    id: 'testi-6',
    name: 'Annisa Dwi Lestari',
    graduationYear: 2023,
    major: 'Bisnis Daring & Pemasaran (BDP)',
    role: 'Digital Marketing & Marketplace Specialist',
    company: 'PT E-Commerce Kawan Kreatif',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
    content: 'Pembelajaran live streaming selling, optimasi SEO marketplace, dan periklanan digital di Business Center SMK YAPEK memberi bekal nyata yang sangat dicari perusahaan e-commerce saat ini. YAPEK membuat saya percaya diri bersaing di industri kreatif.',
    rating: 5,
    highlight: 'Mengelola Akun Bisnis dengan Omzet Ratusan Juta per Bulan',
    status: 'approved',
    sharedAt: '25 Februari 2026'
  },
  {
    id: 'testi-7',
    name: 'Hendra Kurniawan',
    graduationYear: 2022,
    major: 'Manajemen Perkantoran (MP / OTKP)',
    role: 'Executive Corporate Secretary Staff',
    company: 'PT Pupuk Indonesia (Persero)',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=250&q=80',
    content: 'Kemampuan korespondensi bahasa Inggris, kearsipan digital berbasis cloud, serta etiket protokoler perkantoran yang diajarkan di SMK YAPEK sangat diapresiasi pimpinan kerja saya di BUMN. Terima kasih bapak/ibu guru SMK YAPEK tercinta.',
    rating: 5,
    highlight: 'Staff Teladan Divisi Kesekretariatan Korporat',
    status: 'approved',
    sharedAt: '01 Maret 2026'
  },
  {
    id: 'testi-8',
    name: 'Maya Safitri, S.E.',
    graduationYear: 2022,
    major: 'Akuntansi & Keuangan Lembaga (AKL)',
    role: 'Customer Relationship Officer & Teller',
    company: 'Bank Mandiri Cabang Cilacap',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=250&q=80',
    content: 'YAPEK membentuk mental tangguh, teliti, dan mengutamakan pelayanan prima (Service Excellence). Yang luar biasa, pengurus BKK sekolah terus memantau dan membimbing perkembangan karir alumni lewat sistem tracer study berkala.',
    rating: 5,
    highlight: 'Penerima Best Service Frontliner Award 2024',
    status: 'approved',
    sharedAt: '08 Maret 2026'
  },
  {
    id: 'testi-9',
    name: 'Aditya Wibowo',
    graduationYear: 2021,
    major: 'Teknik Kendaraan Ringan (TKR)',
    role: 'Quality Control Supervisor',
    company: 'PT Astra Honda Motor (AHM) Sunter Jakarta',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=250&q=80',
    content: 'Mulai dari operator lini perakitan, kini saya dipercaya memimpin tim Quality Control. Budaya kerja presisi, keselamatan kerja K3, dan mental disiplin yang ditanamkan sejak kelas X di SMK YAPEK Gombong menjadi fondasi utama keberhasilan saya.',
    rating: 5,
    highlight: 'Promosi Cepat Menjadi Supervisor QC di Manufaktur Otomotif Terbesar',
    status: 'approved',
    sharedAt: '12 Maret 2026'
  },
  {
    id: 'testi-10',
    name: 'Dwi Septiana',
    graduationYear: 2021,
    major: 'Bisnis Daring & Pemasaran (BDP)',
    role: 'Owner & Founder',
    company: 'CV Gombong Logistik & Kuliner Nusantara',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=250&q=80',
    content: 'Slogan SMK: Bekerja, Melanjutkan, atau Wirausaha (BMW) benar-benar terwujud nyata di SMK YAPEK. Saya dididik menjadi pribadi bermental mandiri. Usaha yang saya rintis kini mampu membuka lapangan kerja bagi 15 rekan sesama alumni YAPEK.',
    rating: 5,
    highlight: 'Membuka Lapangan Kerja Baru untuk 15+ Alumni SMK YAPEK',
    status: 'approved',
    sharedAt: '15 Maret 2026'
  },
  // Testimoni Baru Menunggu Sharing / Moderasi (Pending)
  {
    id: 'testi-pending-1',
    name: 'Wahyu Ramadhan Pratama',
    graduationYear: 2025,
    major: 'Teknik Komputer & Jaringan (TKJ)',
    role: 'Fiber Optic Field Engineer',
    company: 'PT Lintasarta Regional Kedu',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=250&q=80',
    content: 'Alhamdulillah seminggu setelah pelepasan wisuda langsung ditempatkan di Lintasarta melalui BKK SMK YAPEK. Pembekalan OTDR dan splicing fiber optik di sekolah sangat presisi sesuai standar lapangan.',
    rating: 5,
    highlight: 'Lolos Rekrutmen Khusus Mitra Industri YAPEK 2025',
    status: 'pending',
    submittedAt: 'Hari ini, 09:15 WIB'
  },
  {
    id: 'testi-pending-2',
    name: 'Tiara Anggraini, A.Md.',
    graduationYear: 2024,
    major: 'Tata Kecantikan Kulit & Rambut (TKKR)',
    role: 'Owner & Bridal Makeup Artist',
    company: 'Tiara Wedding Gallery Kebumen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    content: 'Terima kasih banyak bapak dan ibu guru jurusan Kecantikan YAPEK. Berkat bimbingan intensif dan fasilitas salon yang sangat lengkap, sekarang saya sudah percaya diri memegang klien pengantin di wilayah Kebumen dan Purworejo.',
    rating: 5,
    highlight: 'Pemberdayaan Alumni Vokasi Mandiri Berwirausaha',
    status: 'pending',
    submittedAt: 'Kemarin, 14:30 WIB'
  }
];

export const ADMIN_USERS: AdminUser[] = [
  {
    id: 'admin-1',
    name: 'Admin Utama Humas & IT',
    email: 'admin@smkyapekgombong.sch.id',
    role: 'Super Admin CMS',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    lastLogin: 'Hari ini, 08:30 WIB'
  },
  {
    id: 'admin-2',
    name: 'Drs. H. Suwarno, M.M.',
    email: 'kepsek@smkyapekgombong.sch.id',
    role: 'Kepala Sekolah',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    lastLogin: 'Kemarin, 16:45 WIB'
  },
  {
    id: 'admin-3',
    name: 'Tim Redaksi & Humas BKK',
    email: 'redaksi@smkyapekgombong.sch.id',
    role: 'Admin Humas & Redaksi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    lastLogin: '2 hari yang lalu'
  }
];

export const INITIAL_TRAFFIC_DATA: DailyTraffic[] = [
  { date: '15 Sep', day: 'Sen', visitors: 1420, pageviews: 4580 },
  { date: '16 Sep', day: 'Sel', visitors: 1680, pageviews: 5210 },
  { date: '17 Sep', day: 'Rab', visitors: 1950, pageviews: 6140 },
  { date: '18 Sep', day: 'Kam', visitors: 1820, pageviews: 5890 },
  { date: '19 Sep', day: 'Jum', visitors: 2150, pageviews: 6820 },
  { date: '20 Sep', day: 'Sab', visitors: 2480, pageviews: 7950 },
  { date: '21 Sep', day: 'Min', visitors: 2790, pageviews: 8940 }
];

export const TRAFFIC_SOURCES: TrafficSource[] = [
  { source: 'Pencarian Google (Organik)', visitors: 8420, percentage: 46, trend: '+12.4%', color: '#0F4374' },
  { source: 'Instagram @smkyapekgombong', visitors: 4890, percentage: 27, trend: '+24.8%', color: '#E1306C' },
  { source: 'WhatsApp Broadcast / Referral', visitors: 2750, percentage: 15, trend: '+8.1%', color: '#25D366' },
  { source: 'Akses Langsung (Direct URL)', visitors: 1540, percentage: 8, trend: '+3.2%', color: '#F59E0B' },
  { source: 'Media Sosial Lainnya (FB / TikTok)', visitors: 720, percentage: 4, trend: '+5.0%', color: '#6366F1' }
];

export const TOP_PAGES: TopPageTraffic[] = [
  { path: '/', name: 'Beranda Utama & Profil Sekolah', views: 24150, percentage: 38 },
  { path: '/ppdb', name: 'Portal Pendaftaran Siswa Baru (PPDB Online)', views: 18420, percentage: 29 },
  { path: '/majors', name: '6 Kompetensi Keahlian / Jurusan Unggulan', views: 9850, percentage: 16 },
  { path: '/bkk', name: 'Bursa Kerja Khusus & Lowongan Kerja Industri', views: 6340, percentage: 10 },
  { path: '#alumni-testimonials', name: 'Kisah Sukses & Testimoni Alumni', views: 4210, percentage: 7 }
];

export const VISITOR_LOGS: VisitorLog[] = [
  { id: 'log-1', ipMasked: '182.253.***.24', page: 'Portal PPDB Online', source: 'Instagram Stories', device: 'Mobile', city: 'Gombong, Kebumen', time: 'Baru saja' },
  { id: 'log-2', ipMasked: '114.122.***.89', page: 'Program Keahlian TKJ', source: 'Google Search', device: 'Mobile', city: 'Purwokerto', time: '1 menit lalu' },
  { id: 'log-3', ipMasked: '36.85.***.112', page: 'Lowongan Kerja PT Telkom Akses', source: 'WhatsApp Direct', device: 'Desktop', city: 'Kebumen Kota', time: '3 menit lalu' },
  { id: 'log-4', ipMasked: '125.163.***.45', page: 'Beranda & Sambutan Kepala Sekolah', source: 'Direct URL', device: 'Desktop', city: 'Cilacap', time: '5 menit lalu' },
  { id: 'log-5', ipMasked: '180.246.***.73', page: 'Testimoni Alumni Sukses', source: 'Instagram Bio', device: 'Mobile', city: 'Kutoarjo, Purworejo', time: '8 menit lalu' },
  { id: 'log-6', ipMasked: '223.255.***.19', page: 'Portal PPDB Online', source: 'Google Search', device: 'Mobile', city: 'Gombong', time: '12 menit lalu' },
  { id: 'log-7', ipMasked: '110.138.***.91', page: 'Program Keahlian TKR', source: 'Facebook Group', device: 'Mobile', city: 'Banyumas', time: '15 menit lalu' }
];

export const INITIAL_DAILY_TRAFFIC = INITIAL_TRAFFIC_DATA;
export const INITIAL_TRAFFIC_SOURCES = TRAFFIC_SOURCES;
export const INITIAL_TOP_PAGES = TOP_PAGES;
export const INITIAL_VISITOR_LOGS = VISITOR_LOGS;
export const INITIAL_ADMIN_USERS = ADMIN_USERS;

export const INITIAL_ACTIVITY_GALLERY: ActivityGalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Praktik Uji Diagnostik Sistem Injeksi Otomotif TKR',
    activityType: 'Praktik Kejuruan',
    date: '18 September 2026',
    location: 'Bengkel Otomotif Modern SMK YAPEK',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    caption: 'Siswa kelas XII Teknik Kendaraan Ringan (TKR) mempraktikkan diagnosis kelistrikan mesin menggunakan scanner scanner OBD-II berstandar bengkel resmi APM.',
    photographer: 'Tim Dokumentasi Humas',
    featured: true
  },
  {
    id: 'gal-2',
    title: 'Konfigurasi Server & Fiber Optic di Laboratorium TKJ',
    activityType: 'Praktik Kejuruan',
    date: '14 September 2026',
    location: 'Laboratorium Cisco & Fiber Optic TKJ',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    caption: 'Pelaksanaan praktikum splicing kabel fiber optic dan routing Mikrotik bersama instruktur industri mitra telekomunikasi.',
    photographer: 'Humas SMK YAPEK',
    featured: true
  },
  {
    id: 'gal-3',
    title: 'Latihan Kedisiplinan & Formasi Pasukan Paskibraka',
    activityType: 'Ekstrakurikuler',
    date: '10 September 2026',
    location: 'Lapangan Upacara Utama SMK YAPEK',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    caption: 'Anggota Paskibra SMK YAPEK Gombong rutin mengasah kekompakan formasi baris berbaris dan kepemimpinan berkarakter unggul.',
    photographer: 'Eskul Paskibraka',
    featured: false
  },
  {
    id: 'gal-4',
    title: 'Upacara Peringatan Hari Kemerdekaan RI Ke-81',
    activityType: 'Upacara & Apel',
    date: '17 Agustus 2026',
    location: 'Plaza Upacara SMK YAPEK Gombong',
    image: 'https://images.unsplash.com/photo-1526976668912-1a811878dd37?auto=format&fit=crop&w=800&q=80',
    caption: 'Keluarga besar SMK YAPEK Gombong melangsungkan upacara bendera dengan khidmat, diikuti oleh seluruh dewan guru, karyawan, dan 1.400 siswa.',
    photographer: 'Tim Media Sekolah',
    featured: true
  },
  {
    id: 'gal-5',
    title: 'Kunjungan Industri & Kuliah Lapangan di PT Astra Daihatsu Motor',
    activityType: 'Kunjungan Industri',
    date: '28 Agustus 2026',
    location: 'Plant Perakitan Otomotif - Karawang',
    image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=800&q=80',
    caption: 'Edukasi lapangan siswa jurusan otomotif dan kelistrikan untuk menyaksikan langsung teknologi robotika perakitan mobil modern berskala global.',
    photographer: 'Koordinator BKK & Industri',
    featured: true
  },
  {
    id: 'gal-6',
    title: 'Juara 1 Lomba Kompetensi Siswa (LKS) Bidang IT Network Cabang Dinas IX',
    activityType: 'Lomba & Prestasi',
    date: '02 September 2026',
    location: 'Gedung Kesenian Daerah Kebumen',
    image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=800&q=80',
    caption: 'Kebanggaan SMK YAPEK Gombong berhasil menyabet medali emas LKS IT Network System Administration dan berhak melaju ke tingkat provinsi Jawa Tengah.',
    photographer: 'Waka Kesiswaan',
    featured: true
  },
  {
    id: 'gal-7',
    title: 'Praktikum Simulasi Transaksi Perbankan & Kasir Jurusan Akuntansi & MP',
    activityType: 'Praktik Kejuruan',
    date: '08 September 2026',
    location: 'Mini Bank & Business Center SMK YAPEK',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    caption: 'Simulasi operasional teller, customer service, dan pencatatan kas harian menggunakan aplikasi MYOB & spreadsheet akuntansi terkomputerisasi.',
    photographer: 'Guru Produktif AKL',
    featured: false
  },
  {
    id: 'gal-8',
    title: 'Bakti Sosial & Donor Darah Sukarela KSR PMI Bersama Warga Gombong',
    activityType: 'Sosial & Rohani',
    date: '05 September 2026',
    location: 'Aula Serbaguna SMK YAPEK Gombong',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    caption: 'Aksi kepedulian kemanusiaan mengumpulkan 120 kantong darah hasil donor siswa dan warga sekitar dalam rangka HUT Yayasan Pendidikan Kebumen.',
    photographer: 'PMR Wira YAPEK',
    featured: false
  }
];

