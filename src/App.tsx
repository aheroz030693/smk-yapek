/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ScreenTab, 
  NewsItem, 
  PPDBApplicant, 
  SchoolIdentity, 
  HeadmasterProfile, 
  AlumniTestimonial,
  DailyTraffic,
  TrafficSource,
  TopPageTraffic,
  VisitorLog,
  AdminUser,
  ActivityGalleryItem
} from './types';
import { 
  NEWS_LIST, 
  INITIAL_APPLICANTS, 
  SCHOOL_INFO, 
  INITIAL_HEADMASTER_PROFILE, 
  ALUMNI_TESTIMONIALS,
  INITIAL_DAILY_TRAFFIC,
  INITIAL_TRAFFIC_SOURCES,
  INITIAL_TOP_PAGES,
  INITIAL_VISITOR_LOGS,
  INITIAL_ADMIN_USERS,
  INITIAL_ACTIVITY_GALLERY
} from './data/schoolData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeScreen } from './components/screens/HomeScreen';
import { MajorsScreen } from './components/screens/MajorsScreen';
import { PPDBScreen } from './components/screens/PPDBScreen';
import { SIAScreen } from './components/screens/SIAScreen';
import { BKKScreen } from './components/screens/BKKScreen';
import { ContactScreen } from './components/screens/ContactScreen';
import { AdminScreen } from './components/screens/AdminScreen';
import { ArticleDetailModal } from './components/ArticleDetailModal';
import { YagoAssistantModal } from './components/YagoAssistantModal';
import { Sparkles, ArrowUp } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ScreenTab>('home');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  // Dynamic news state with view tracking
  const [newsList, setNewsList] = useState<NewsItem[]>(NEWS_LIST);
  const [applicants, setApplicants] = useState<PPDBApplicant[]>(INITIAL_APPLICANTS);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  // CMS Dynamic State
  const [schoolInfo, setSchoolInfo] = useState<SchoolIdentity>(SCHOOL_INFO);
  const [headmaster, setHeadmaster] = useState<HeadmasterProfile>(INITIAL_HEADMASTER_PROFILE);
  const [testimonials, setTestimonials] = useState<AlumniTestimonial[]>(ALUMNI_TESTIMONIALS);
  const [activityGallery, setActivityGallery] = useState<ActivityGalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem('smk_yapek_activity_gallery');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return INITIAL_ACTIVITY_GALLERY;
  });

  const handleUpdateActivityGallery = (updated: ActivityGalleryItem[]) => {
    setActivityGallery(updated);
    try {
      localStorage.setItem('smk_yapek_activity_gallery', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };
  
  // Analytics & Traffic State
  const [trafficData, setTrafficData] = useState<DailyTraffic[]>(INITIAL_DAILY_TRAFFIC);
  const [trafficSources, setTrafficSources] = useState<TrafficSource[]>(INITIAL_TRAFFIC_SOURCES);
  const [topPages, setTopPages] = useState<TopPageTraffic[]>(INITIAL_TOP_PAGES);
  const [visitorLogs, setVisitorLogs] = useState<VisitorLog[]>(INITIAL_VISITOR_LOGS);

  // Admin Authentication State
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('smk_yapek_admin_session');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore parsing error
    }
    return null;
  });

  // Admin Users & RBAC State
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    try {
      const saved = localStorage.getItem('smk_yapek_admin_users');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_ADMIN_USERS;
  });

  const handleUpdateAdminUsers = (updated: AdminUser[]) => {
    setAdminUsers(updated);
    try {
      localStorage.setItem('smk_yapek_admin_users', JSON.stringify(updated));
    } catch {
      // ignore
    }

    // Sync logged-in session if current admin was edited
    if (adminUser) {
      const matched = updated.find((u) => u.id === adminUser.id);
      if (matched) {
        setAdminUser(matched);
        try {
          localStorage.setItem('smk_yapek_admin_session', JSON.stringify(matched));
        } catch {
          // ignore
        }
      }
    }
  };

  // Sync dark mode with root HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle scroll to top listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: ScreenTab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Track tab visits in Top Pages analytics
    const targetPath = `/${tab === 'home' ? '' : tab}`;
    setTopPages((prev) =>
      prev.map((page) =>
        page.path === targetPath ? { ...page, views: page.views + 1 } : page
      )
    );
  };

  // Open article, increment view count, and show reader modal
  const handleOpenArticle = (articleId: string) => {
    setSelectedArticleId(articleId);
    setNewsList((prev) =>
      prev.map((item) => {
        if (item.id === articleId) {
          return { ...item, views: item.views + 1 };
        }
        return item;
      })
    );
  };

  // Admin Auth Handlers
  const handleLoginSuccess = (user: AdminUser) => {
    setAdminUser(user);
    try {
      localStorage.setItem('smk_yapek_admin_session', JSON.stringify(user));
    } catch {
      // localStorage may fail in sandboxed iframes
    }
  };

  const handleLogoutAdmin = () => {
    setAdminUser(null);
    try {
      localStorage.removeItem('smk_yapek_admin_session');
    } catch {
      // ignore
    }
  };

  // Handle new testimonial submitted from frontend
  const handleSubmitTestimonial = (newTestimonial: AlumniTestimonial) => {
    setTestimonials((prev) => [newTestimonial, ...prev]);
  };

  // Refresh or simulate new visitor activity in traffic
  const handleRefreshTraffic = () => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newLog: VisitorLog = {
      id: `log-${Date.now()}`,
      ipMasked: `114.124.${Math.floor(Math.random() * 200) + 10}.***`,
      city: 'Gombong, Kab. Kebumen',
      device: 'Mobile',
      page: 'Beranda & Profil',
      time: `${timeStr} WIB`,
      source: 'Instagram Humas'
    };
    setVisitorLogs((prev) => [newLog, ...prev.slice(0, 19)]);
  };

  const currentArticle = newsList.find((n) => n.id === selectedArticleId) || null;

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleTabChange}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        schoolInfo={schoolInfo}
      />

      {/* Main Screen Content */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomeScreen
            onSelectTab={handleTabChange}
            isDarkMode={isDarkMode}
            onOpenAssistant={() => setIsAssistantOpen(true)}
            newsList={newsList}
            schoolInfo={schoolInfo}
            headmaster={headmaster}
            testimonials={testimonials}
            galleryItems={activityGallery}
            onSubmitTestimonial={handleSubmitTestimonial}
            onOpenArticle={handleOpenArticle}
            onGoToAdmin={() => handleTabChange('admin')}
          />
        )}
        {currentTab === 'majors' && (
          <MajorsScreen
            onSelectTab={handleTabChange}
            isDarkMode={isDarkMode}
          />
        )}
        {currentTab === 'ppdb' && (
          <PPDBScreen
            isDarkMode={isDarkMode}
          />
        )}
        {currentTab === 'sia' && (
          <SIAScreen
            isDarkMode={isDarkMode}
          />
        )}
        {currentTab === 'bkk' && (
          <BKKScreen
            isDarkMode={isDarkMode}
          />
        )}
        {currentTab === 'contact' && (
          <ContactScreen
            isDarkMode={isDarkMode}
          />
        )}
        {currentTab === 'admin' && (
          <AdminScreen
            newsList={newsList}
            applicants={applicants}
            schoolInfo={schoolInfo}
            headmaster={headmaster}
            testimonials={testimonials}
            galleryItems={activityGallery}
            trafficData={trafficData}
            trafficSources={trafficSources}
            topPages={topPages}
            visitorLogs={visitorLogs}
            adminUser={adminUser}
            adminUsers={adminUsers}
            onUpdateAdminUsers={handleUpdateAdminUsers}
            onLoginSuccess={handleLoginSuccess}
            onLogoutAdmin={handleLogoutAdmin}
            onUpdateNews={setNewsList}
            onUpdateApplicants={setApplicants}
            onUpdateSchoolInfo={setSchoolInfo}
            onUpdateHeadmaster={setHeadmaster}
            onUpdateTestimonials={setTestimonials}
            onUpdateGallery={handleUpdateActivityGallery}
            onRefreshTraffic={handleRefreshTraffic}
            onSelectArticle={handleOpenArticle}
            onExitAdmin={() => handleTabChange('home')}
            onNavigateToTab={handleTabChange}
            isDarkMode={isDarkMode}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectTab={handleTabChange}
        isDarkMode={isDarkMode}
        schoolInfo={schoolInfo}
      />

      {/* Article Detail Reader Modal with Related Articles & Live Views */}
      <ArticleDetailModal
        article={currentArticle}
        allNews={newsList}
        isOpen={Boolean(selectedArticleId)}
        onClose={() => setSelectedArticleId(null)}
        onSelectArticle={handleOpenArticle}
        onGoToAdmin={() => {
          setSelectedArticleId(null);
          handleTabChange('admin');
        }}
        isDarkMode={isDarkMode}
      />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            title="Kembali ke atas"
            className="p-3 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-all hover:scale-110 active:scale-95"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}

        <button
          id="floating-ai-assistant-btn"
          onClick={() => setIsAssistantOpen(true)}
          title="Tanya YAGO AI Assistant"
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#0F4374] via-[#17528a] to-[#EA8B00] text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-5 h-5 text-amber-300 animate-spin [animation-duration:8s]" />
          <span className="text-xs font-black tracking-wide hidden sm:inline">Tanya YAGO AI</span>
        </button>
      </div>

      {/* AI Assistant Modal */}
      <YagoAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onSelectTab={handleTabChange}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
