import { InstagramPost } from '../types';

export const INSTAGRAM_PROFILE = {
  username: 'smkyapekgombong',
  fullName: 'SMK YAPEK GOMBONG (OFFICIAL)',
  verified: true,
  bio: '🏫 Lembaga Pendidikan Kejuruan Berkualitas (Est. 1967)\n⭐ Akreditasi A Unggul • NPSN: 20330310\n💼 BKK YAPEK: Penyaluran Kerja Industri Nasional & Global\n📍 Jl. Merbabu No. 64, Gombong, Kebumen\n👇 Link Informasi PPDB 2026/2027 & Pendaftaran:',
  postsCount: 1548,
  followersCount: '14.8K',
  followingCount: 286,
  avatarUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=300&q=80',
  instagramUrl: 'https://www.instagram.com/smkyapekgombong/',
  highlights: [
    { id: 'h1', title: 'PPDB 2026', icon: '📝', cover: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=200&q=80' },
    { id: 'h2', title: 'Prestasi', icon: '🏆', cover: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=200&q=80' },
    { id: 'h3', title: 'BKK Kerja', icon: '💼', cover: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=200&q=80' },
    { id: 'h4', title: 'Praktik Lab', icon: '💻', cover: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=200&q=80' },
    { id: 'h5', title: 'Fasilitas', icon: '🏫', cover: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=200&q=80' },
    { id: 'h6', title: 'Eskul YAGO', icon: '⚽', cover: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=200&q=80' },
  ]
};

export const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 'ig-1',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    caption: '✨ KUNJUNGAN INDUSTRI & PENANDATANGANAN MOU KELAS KHUSUS DENGAN MITRA NASIONAL! SMK YAPEK Gombong senantiasa berkomitmen mendekatkan kurikulum kejuruan dengan standar kebutuhan riil dunia usaha dan industri.',
    likes: 842,
    commentsCount: 46,
    timestamp: '2 jam yang lalu',
    type: 'carousel',
    category: 'kegiatan',
    tags: ['#smkyapekgombong', '#kunjunganindustri', '#smkhebat', '#linkandmatch', '#kebumen'],
    permalink: 'https://www.instagram.com/smkyapekgombong/'
  },
  {
    id: 'ig-2',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    caption: '🔧 Pelaksanaan Uji Kompetensi Keahlian (UKK) Mandiri & Sertifikasi BNSP Jurusan Teknik Komputer & Jaringan (TKJ) dan Teknik Kendaraan Ringan (TKR). Seluruh asesi diuji langsung oleh tim asesor eksternal industri terakreditasi.',
    likes: 1215,
    commentsCount: 88,
    timestamp: '1 hari yang lalu',
    type: 'photo',
    category: 'kegiatan',
    tags: ['#ukk2026', '#sertifikasibnsp', '#tkj', '#tkr', '#smkyapekgombong'],
    permalink: 'https://www.instagram.com/smkyapekgombong/'
  },
  {
    id: 'ig-3',
    imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80',
    caption: '💼 REKRUTMEN KAMPUS HIRING BKK YAPEK GOMBONG! Sebanyak 120 peserta didik kelas XII dan alumni mengikuti seleksi wawancara kerja langsung PT Astra Honda Motor & PT Telkom Akses di Aula Graha YAPEK.',
    likes: 1540,
    commentsCount: 112,
    timestamp: '2 hari yang lalu',
    type: 'carousel',
    category: 'bkk',
    tags: ['#bkkyapek', '#campushiring', '#lowongankerjasmk', '#lokerjateng', '#siapkerja'],
    permalink: 'https://www.instagram.com/smkyapekgombong/'
  },
  {
    id: 'ig-4',
    imageUrl: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=800&q=80',
    caption: '🏆 ALHAMDULILLAH! Tim Siswa SMK YAPEK Gombong berhasil memborong Juara 1 LKS Otomotif & Juara 2 Web Technologies tingkat Karesidenan Kedu 2026. Selamat untuk sang juara dan guru pembimbing!',
    likes: 2130,
    commentsCount: 174,
    timestamp: '3 hari yang lalu',
    type: 'photo',
    category: 'prestasi',
    tags: ['#juaraLKS', '#prestasiselamanya', '#smkjuara', '#kebumenmaju', '#yapekgombong'],
    permalink: 'https://www.instagram.com/smkyapekgombong/'
  },
  {
    id: 'ig-5',
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    caption: '💄 Pesona Praktek Salon Estetika & Hair Styling Jurusan Tata Kecantikan Kulit & Rambut (TKKR). Menyiapkan beauty stylist andal berjiwa entrepreneur dengan fasilitas salon berstandar industri modern.',
    likes: 968,
    commentsCount: 52,
    timestamp: '4 hari yang lalu',
    type: 'video',
    category: 'reels',
    tags: ['#tatakecantikan', '#tkkr', '#beautystudio', '#smkvokasi', '#gombonghits'],
    permalink: 'https://www.instagram.com/smkyapekgombong/'
  },
  {
    id: 'ig-6',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    caption: '📢 PENDAFTARAN SISWA BARU (PPDB) TAHUN AJARAN 2026/2027 TELAH DIBUKA! Dapatkan subsidi biaya seragam & beasiswa prestasi akademik/non-akademik bagi pendaftar gelombang pertama.',
    likes: 1890,
    commentsCount: 95,
    timestamp: '5 hari yang lalu',
    type: 'photo',
    category: 'ppdb',
    tags: ['#ppdb2026', '#ppdbsmk', '#daftarsmk', '#sekolahkebumen', '#smkyapekgombong'],
    permalink: 'https://www.instagram.com/smkyapekgombong/'
  },
  {
    id: 'ig-7',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80',
    caption: '📱 Live Commerce Selling Challenge oleh siswa Jurusan Bisnis Daring & Pemasaran (BDP) di Creative Business Center YAPEK. Praktik langsung teknik public speaking, affiliate marketing, dan content creation e-commerce.',
    likes: 742,
    commentsCount: 39,
    timestamp: '6 hari yang lalu',
    type: 'video',
    category: 'reels',
    tags: ['#bisnisdigital', '#bdp', '#livecommerce', '#vokasikuat', '#smkbisa'],
    permalink: 'https://www.instagram.com/smkyapekgombong/'
  },
  {
    id: 'ig-8',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
    caption: '⚽ Semangat Sportivitas YAGO Cup 2026! Pertandingan persahabatan futsal dan bola voli antarkelas menyambut jeda tengah semester. Belajar menjunjung tinggi kekompakan dan kejujuran di lapangan.',
    likes: 1105,
    commentsCount: 68,
    timestamp: '1 minggu yang lalu',
    type: 'carousel',
    category: 'kegiatan',
    tags: ['#yagocup', '#futsalsmk', '#eskulsmk', '#kebumensport', '#solidaritassmk'],
    permalink: 'https://www.instagram.com/smkyapekgombong/'
  },
  {
    id: 'ig-9',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    caption: '📊 Uji Praktek Komputer Akuntansi MYOB & Accurate bersama siswa Akuntansi & Keuangan Lembaga (AKL). Ketelitian, integritas angka, dan pemahaman laporan keuangan bisnis.',
    likes: 880,
    commentsCount: 42,
    timestamp: '1 minggu yang lalu',
    type: 'photo',
    category: 'kegiatan',
    tags: ['#akuntansi', '#akl', '#accurate', '#myobaccounting', '#smkyapekgombong'],
    permalink: 'https://www.instagram.com/smkyapekgombong/'
  }
];
