import React, { useState, useEffect, useMemo } from 'react';
import { INSTAGRAM_PROFILE, INSTAGRAM_POSTS } from '../data/instagramData';
import { InstagramPost } from '../types';
import { 
  Instagram, 
  Heart, 
  MessageCircle, 
  Share2, 
  ExternalLink, 
  Bookmark, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  Play, 
  Layers, 
  X, 
  Clock, 
  Copy, 
  Check, 
  Radio
} from 'lucide-react';

interface InstagramFeedSectionProps {
  isDarkMode: boolean;
}

export const InstagramFeedSection: React.FC<InstagramFeedSectionProps> = ({ isDarkMode }) => {
  const [posts, setPosts] = useState<InstagramPost[]>(INSTAGRAM_POSTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);
  const [activeStory, setActiveStory] = useState<typeof INSTAGRAM_PROFILE.highlights[0] | null>(null);
  const [storyProgress, setStoryProgress] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Baru saja');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Auto-refresh simulation to show automatic live feed update
  const handleRefreshFeed = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastSyncTime('Baru saja');
      // Subtle pulse or simulated update
    }, 1000);
  };

  // Story progress timer
  useEffect(() => {
    if (!activeStory) {
      setStoryProgress(0);
      return;
    }

    const duration = 4000;
    const interval = 50;
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setStoryProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setActiveStory(null);
          return 0;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [activeStory]);

  const toggleLike = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLikedPostIds(prev => {
      const next = new Set(prev);
      const isLiked = next.has(postId);
      if (isLiked) {
        next.delete(postId);
        setPosts(current =>
          current.map(p => p.id === postId ? { ...p, likes: p.likes - 1 } : p)
        );
      } else {
        next.add(postId);
        setPosts(current =>
          current.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p)
        );
      }
      return next;
    });
  };

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'semua') return posts;
    return posts.filter(post => post.category === selectedCategory);
  }, [posts, selectedCategory]);

  const handleCopyPostLink = (post: InstagramPost) => {
    navigator.clipboard.writeText(post.permalink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <section id="instagram-feed" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Section Top Header & Instagram Profile Banner */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        {/* Instagram Visual Header Banner */}
        <div className="h-28 sm:h-36 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 relative overflow-hidden flex items-center justify-end px-6">
          <div className="absolute inset-0 bg-black/15"></div>
          {/* Subtle watermark */}
          <Instagram className="w-48 h-48 text-white/10 absolute -right-6 -bottom-10 pointer-events-none" />

          {/* Live Sync Status indicator */}
          <div className="relative z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="hidden sm:inline">Sinkronisasi Otomatis Feed:</span>
            <span>{lastSyncTime}</span>
            <button
              onClick={handleRefreshFeed}
              title="Perbarui Feed Instagram"
              className="p-1 rounded-full hover:bg-white/20 transition-colors ml-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Profile Card Body */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-12 sm:-mt-14 mb-6">
            {/* Avatar & Identitas */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div className="relative group">
                {/* Instagram Gradient Ring */}
                <div className="p-1 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-xl">
                  <img
                    src={INSTAGRAM_PROFILE.avatarUrl}
                    alt={INSTAGRAM_PROFILE.username}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white dark:border-slate-900"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="absolute bottom-1 right-1 p-1 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-md border-2 border-white dark:border-slate-900">
                  <Instagram className="w-3.5 h-3.5" />
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>@{INSTAGRAM_PROFILE.username}</span>
                    <CheckCircle2 className="w-5 h-5 text-sky-500 fill-sky-500 text-white" />
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300/40 flex items-center gap-1">
                    <Radio className="w-3 h-3 text-rose-500 animate-pulse" />
                    <span>Live Feed</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
                  {INSTAGRAM_PROFILE.fullName}
                </p>
              </div>
            </div>

            {/* Action buttons & Stats */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              {/* Stats */}
              <div className="flex items-center gap-4 sm:gap-6 text-center">
                <div>
                  <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {INSTAGRAM_PROFILE.postsCount.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Postingan</div>
                </div>
                <div className="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
                <div>
                  <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {INSTAGRAM_PROFILE.followersCount}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Pengikut</div>
                </div>
                <div className="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
                <div>
                  <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {INSTAGRAM_PROFILE.followingCount}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Mengikuti</div>
                </div>
              </div>

              {/* Follow Button */}
              <a
                href={INSTAGRAM_PROFILE.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 flex-shrink-0"
              >
                <Instagram className="w-4 h-4" />
                <span>Follow Instagram</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Bio text */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 mb-6 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {INSTAGRAM_PROFILE.bio}
          </div>

          {/* Story Highlights Circles */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Sorotan Cerita Resmi (Story Highlights)</span>
            </div>
            <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-3 pt-1 scrollbar-thin">
              {INSTAGRAM_PROFILE.highlights.map(h => (
                <button
                  key={h.id}
                  onClick={() => { setActiveStory(h); setStoryProgress(0); }}
                  className="flex flex-col items-center gap-1.5 flex-shrink-0 group cursor-pointer focus:outline-none"
                >
                  <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 group-hover:scale-105 transition-transform shadow-sm">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-white dark:border-slate-900 relative">
                      <img
                        src={h.cover}
                        alt={h.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute inset-0 bg-black/25 flex items-center justify-center text-base">
                        {h.icon}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 group-hover:text-rose-500 transition-colors">
                    {h.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {[
            { id: 'semua', label: 'Semua Feed' },
            { id: 'kegiatan', label: 'Kegiatan Sekolah' },
            { id: 'prestasi', label: 'Prestasi Juara' },
            { id: 'bkk', label: 'BKK & Karir' },
            { id: 'ppdb', label: 'PPDB 2026' },
            { id: 'reels', label: 'Reels / Video' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === tab.id
                  ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-sm ring-2 ring-rose-500/30'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Menampilkan {filteredPosts.length} postingan terbaru
        </div>
      </div>

      {/* Instagram Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => {
          const isLiked = likedPostIds.has(post.id);

          return (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:border-rose-400/50 dark:hover:border-rose-400/50 transition-all flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              {/* Post Header */}
              <div className="p-3.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
                    <img
                      src={INSTAGRAM_PROFILE.avatarUrl}
                      alt="SMK YAPEK"
                      className="w-7 h-7 rounded-full object-cover border border-white dark:border-slate-900"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      <span>smkyapekgombong</span>
                      <CheckCircle2 className="w-3 h-3 text-sky-500 fill-sky-500 text-white" />
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{post.timestamp}</span>
                    </div>
                  </div>
                </div>

                <a
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title="Lihat langsung di Instagram"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Media Container with Overlay */}
              <div className="relative aspect-square w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Media Type Icon Badge */}
                <div className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/50 backdrop-blur-md text-white text-xs shadow-sm">
                  {post.type === 'video' && <Play className="w-3.5 h-3.5 fill-white" />}
                  {post.type === 'carousel' && <Layers className="w-3.5 h-3.5" />}
                  {post.type === 'photo' && <Instagram className="w-3.5 h-3.5" />}
                </div>

                {/* Hover Interaction Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold text-sm">
                  <div className="flex items-center gap-1.5">
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500 text-rose-500' : 'fill-white'}`} />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageCircle className="w-5 h-5 fill-white" />
                    <span>{post.commentsCount}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Actions & Caption Preview */}
              <div className="p-4 space-y-2.5">
                {/* Action Icons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => toggleLike(post.id, e)}
                      title="Sukai Postingan"
                      className="text-slate-700 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 transition-colors focus:outline-none"
                    >
                      <Heart className={`w-5 h-5 transition-transform active:scale-125 ${
                        isLiked ? 'fill-rose-500 text-rose-500' : ''
                      }`} />
                    </button>
                    <button
                      onClick={() => setSelectedPost(post)}
                      title="Komentar"
                      className="text-slate-700 dark:text-slate-300 hover:text-blue-500 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleCopyPostLink(post); }}
                      title="Salin Link Postingan"
                      className="text-slate-700 dark:text-slate-300 hover:text-emerald-500 transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>

                  <a
                    href={post.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Bookmark className="w-4 h-4" />
                  </a>
                </div>

                {/* Likes count */}
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {post.likes.toLocaleString()} menyukai ini
                </div>

                {/* Caption preview */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                  <span className="font-bold text-slate-900 dark:text-white mr-1.5">smkyapekgombong</span>
                  {post.caption}
                </p>

                {/* Hashtags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {post.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="text-[11px] font-semibold text-blue-600 dark:text-sky-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Follow Bottom Call-to-Action Bar */}
      <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-purple-900 via-rose-900 to-amber-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <Instagram className="w-64 h-64 text-white/5 absolute -right-12 -top-12 pointer-events-none" />

        <div className="space-y-1.5 text-center sm:text-left relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-rose-200 text-xs font-bold mb-1">
            <Instagram className="w-3.5 h-3.5" />
            <span>Official Instagram Channel</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black">
            Ikuti Instagram Resmi @smkyapekgombong
          </h3>
          <p className="text-xs sm:text-sm text-rose-100/90 max-w-xl">
            Dapatkan informasi live event, dokumentasi LKS, lowongan kerja BKK terbaru, tips kejuruan, dan pengumuman PPDB 2026 secara real-time setiap hari.
          </p>
        </div>

        <a
          href={INSTAGRAM_PROFILE.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 px-6 py-3 rounded-xl bg-white text-slate-950 hover:bg-rose-50 font-bold text-xs sm:text-sm flex items-center gap-2.5 shadow-2xl transition-all active:scale-95 flex-shrink-0 group"
        >
          <Instagram className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
          <span>Buka Akun @smkyapekgombong</span>
          <ExternalLink className="w-4 h-4 text-slate-500" />
        </a>
      </div>

      {/* Post Detail Lightbox Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-4xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row">
            {/* Left Column: Image */}
            <div className="md:w-3/5 bg-black flex items-center justify-center relative min-h-[300px] md:min-h-full">
              <img
                src={selectedPost.imageUrl}
                alt={selectedPost.caption}
                className="max-h-[70vh] w-full object-contain"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 p-2 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs flex items-center gap-2">
                <Instagram className="w-4 h-4 text-rose-400" />
                <span>@smkyapekgombong</span>
              </div>
            </div>

            {/* Right Column: Details & Comments */}
            <div className="md:w-2/5 flex flex-col justify-between p-6 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 overflow-y-auto">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <img
                      src={INSTAGRAM_PROFILE.avatarUrl}
                      alt="SMK YAPEK"
                      className="w-10 h-10 rounded-full object-cover border-2 border-rose-500"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">
                        <span>smkyapekgombong</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 fill-sky-500 text-white" />
                      </h4>
                      <p className="text-[11px] text-slate-500">Gombong, Jawa Tengah</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedPost(null)}
                    className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Caption */}
                <div className="space-y-2">
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <span className="font-bold text-slate-900 dark:text-white mr-1.5">smkyapekgombong</span>
                    {selectedPost.caption}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedPost.tags.map((t, idx) => (
                      <span key={idx} className="text-xs font-semibold text-blue-600 dark:text-sky-400">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="text-[10px] text-slate-400 pt-1">
                    Dipublikasikan {selectedPost.timestamp}
                  </div>
                </div>

                {/* Interactive Simulated Comments */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Komentar Warga YAGO:
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <span className="font-bold text-slate-900 dark:text-white mr-1.5">osis_yapekgombong:</span>
                      <span className="text-slate-600 dark:text-slate-300">YAPEK Hebat, Siswa Berprestasi, Siap Kerja! 🔥🙌</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <span className="font-bold text-slate-900 dark:text-white mr-1.5">alumni_yago25:</span>
                      <span className="text-slate-600 dark:text-slate-300">Bangga pernah menuntut ilmu di SMK YAPEK Gombong tercinta ❤️</span>
                    </div>
                  </div>
                </div>
              </div>

                {/* Bottom Actions inside Modal */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleLike(selectedPost.id)}
                      className="text-slate-700 dark:text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <Heart className={`w-6 h-6 ${likedPostIds.has(selectedPost.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleCopyPostLink(selectedPost)}
                      className="text-slate-700 dark:text-slate-300 hover:text-emerald-500 transition-colors flex items-center gap-1 text-xs"
                    >
                      {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedLink ? 'Link Tersalin' : 'Salin'}</span>
                    </button>
                  </div>

                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {selectedPost.likes.toLocaleString()} Suka
                  </span>
                </div>

                <a
                  href={selectedPost.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Buka & Komentar di Instagram</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Story Viewer Lightbox Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 text-white overflow-hidden shadow-2xl relative border border-slate-800">
            {/* Progress bar */}
            <div className="absolute top-3 inset-x-3 z-30 h-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-75"
                style={{ width: `${storyProgress}%` }}
              ></div>
            </div>

            {/* Header info */}
            <div className="absolute top-6 inset-x-4 z-30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={INSTAGRAM_PROFILE.avatarUrl}
                  alt="SMK YAPEK"
                  className="w-8 h-8 rounded-full border border-white"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="text-xs font-bold flex items-center gap-1">
                    <span>smkyapekgombong</span>
                    <CheckCircle2 className="w-3 h-3 text-sky-400 fill-sky-400 text-slate-900" />
                  </div>
                  <div className="text-[10px] text-white/70">{activeStory.title}</div>
                </div>
              </div>

              <button
                onClick={() => setActiveStory(null)}
                className="p-1 rounded-full bg-black/40 hover:bg-black/60 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Story Image */}
            <div className="aspect-[9/16] w-full bg-slate-950 relative flex items-center justify-center">
              <img
                src={activeStory.cover}
                alt={activeStory.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none"></div>

              {/* Bottom Caption inside story */}
              <div className="absolute bottom-6 inset-x-4 text-center space-y-2 z-20">
                <span className="text-2xl">{activeStory.icon}</span>
                <h4 className="text-base font-black text-white">{activeStory.title}</h4>
                <p className="text-xs text-white/80">Sorotan Cerita Resmi SMK YAPEK Gombong</p>
                <a
                  href={INSTAGRAM_PROFILE.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md hover:bg-white/30 text-white text-xs font-bold border border-white/30"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Lihat Selengkapnya</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
