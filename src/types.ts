export interface Major {
  id: string;
  code: string;
  name: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  color: string;
  image: string;
  accreditation: string;
  skills: string[];
  careerProspects: string[];
  facilities: string[];
  partners: string[];
}

export interface NewsAttachment {
  id: string;
  name: string;
  fileType: 'pdf' | 'docx' | 'doc' | 'xlsx' | 'xls' | 'pptx' | 'image' | 'other';
  fileSize: string;
  url: string;
  uploadDate?: string;
}

export interface NewsContentImage {
  id: string;
  url: string;
  caption?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  category: 'Akademik' | 'Prestasi' | 'Kegiatan' | 'PPDB' | 'BKK';
  date: string;
  image: string;
  summary: string;
  content: string;
  author: string;
  views: number;
  tags?: string[];
  status?: 'published' | 'draft';
  relatedArticleIds?: string[];
  attachments?: NewsAttachment[];
  contentImages?: NewsContentImage[];
}

export interface PPDBApplicant {
  id: string;
  nisn: string;
  fullName: string;
  gender: 'Laki-laki' | 'Perempuan';
  birthPlace: string;
  birthDate: string;
  originSchool: string;
  parentName: string;
  parentPhone: string;
  email: string;
  address: string;
  firstMajor: string;
  secondMajor: string;
  track: 'Reguler' | 'Prestasi' | 'Afirmasi / KIP';
  avgReportScore: number;
  status: 'Menunggu Verifikasi' | 'Berkas Lengkap' | 'Lolos Seleksi Administrasi' | 'Diterima';
  registeredAt: string;
}

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  type: 'Full-time' | 'Magang / PKL' | 'Kontrak';
  majorsRequired: string[];
  salaryRange: string;
  deadline: string;
  description: string;
  requirements: string[];
}

export interface AcademicGrade {
  subject: string;
  code: string;
  teacher: string;
  kkm: number;
  knowledgeScore: number;
  skillScore: number;
  grade: 'A' | 'B' | 'C';
  status: 'Tuntas' | 'Perlu Remedial';
}

export interface ScheduleItem {
  day: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  major: string;
}

export type ScreenTab = 'home' | 'majors' | 'ppdb' | 'sia' | 'bkk' | 'contact' | 'admin';

export interface AlumniTestimonial {
  id: string;
  name: string;
  graduationYear: number;
  major: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  highlight?: string;
  status: 'approved' | 'pending' | 'rejected';
  submittedAt?: string;
  sharedAt?: string;
}

export interface HeadmasterProfile {
  name: string;
  title: string;
  nip: string;
  avatar: string;
  period: string;
  quote: string;
  speechGreeting: string;
  speechContent1: string;
  speechContent2: string;
  speechClosing: string;
}

export interface SchoolIdentity {
  name: string;
  shortName: string;
  motto: string;
  tagline: string;
  npsn: string;
  accreditation: string;
  establishedYear: string;
  address: string;
  phone: string;
  altPhone: string;
  whatsapp: string;
  email: string;
  website: string;
  instagram: string;
  instagramHandle: string;
  vision: string;
  missions: string[];
  stats: {
    students: string;
    alumni: string;
    industryPartners: string;
    jobPlacementRate: string;
    teachers: string;
  };
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin CMS' | 'Admin Humas & Redaksi' | 'Kepala Sekolah';
  avatar: string;
  lastLogin?: string;
}

export interface DailyTraffic {
  date: string;
  day: string;
  visitors: number;
  pageviews: number;
}

export interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
  trend: string;
  color: string;
}

export interface TopPageTraffic {
  path: string;
  name: string;
  views: number;
  percentage: number;
}

export interface VisitorLog {
  id: string;
  ipMasked: string;
  page: string;
  source: string;
  device: 'Mobile' | 'Desktop' | 'Tablet';
  city: string;
  time: string;
}

export interface InstagramPost {
  id: string;
  imageUrl: string;
  caption: string;
  likes: number;
  commentsCount: number;
  timestamp: string;
  type: 'photo' | 'video' | 'carousel';
  tags: string[];
  category: 'semua' | 'kegiatan' | 'prestasi' | 'bkk' | 'ppdb' | 'reels';
  permalink: string;
}

export type ActivityType = 
  | 'Praktik Kejuruan'
  | 'Ekstrakurikuler'
  | 'Upacara & Apel'
  | 'Kunjungan Industri'
  | 'Lomba & Prestasi'
  | 'Sosial & Rohani';

export interface ActivityGalleryItem {
  id: string;
  title: string;
  activityType: ActivityType;
  date: string;
  location?: string;
  image: string;
  caption: string;
  photographer?: string;
  featured?: boolean;
}

