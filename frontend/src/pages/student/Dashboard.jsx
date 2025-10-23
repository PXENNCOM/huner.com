// pages/student/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useDashboardData } from '../../hooks/useDashboardData';
import StudentLayout from './components/StudentLayout';
import { FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';

import {
  MdSchool,
  MdWork,
  MdEvent,
  MdLightbulb,
  MdCode,
  MdTrendingUp,
  MdCheckCircle,
  MdPending,
  MdGroup,
  MdAdd,
  MdSearch,
  MdBookmark
} from 'react-icons/md';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Panel state'leri
  const [isJobsPanelOpen, setIsJobsPanelOpen] = useState(false);
  const [isProfilePanelOpen, setIsProfilePanelOpen] = useState(false);
  const [isPortfolioPanelOpen, setIsPortfolioPanelOpen] = useState(false);
  const [isEventsPanelOpen, setIsEventsPanelOpen] = useState(false);
  const [isProjectIdeasPanelOpen, setIsProjectIdeasPanelOpen] = useState(false);

  // Custom hook'tan tüm dashboard verilerini al
  const {
    profileData,
    jobs,
    events,
    projectIdeas,
    projects,
    stats,
    loading,
    error,
    refetch
  } = useDashboardData();

  // ProfilePanel'deki gibi nested yapı kontrolü
  const profile = profileData?.profile || profileData;

  // Profil resmi URL'sini oluştur (ProfileViewDark mantığı)
  const getProfileImageUrl = () => {
    if (!profile?.profileImage) return null;

    if (profile.profileImage.startsWith('http')) {
      return profile.profileImage;
    }

    const imagePath = profile.profileImage.startsWith('/')
      ? profile.profileImage.substring(1)
      : profile.profileImage;

    return `${window.location.origin}/uploads/profile-images/${imagePath}`;
  };

  // Panel handlers
  const handleOpenJobsPanel = () => {
    setIsJobsPanelOpen(true);
  };

  const handleOpenProfilePanel = () => {
    setIsProfilePanelOpen(true);
  };

  const handleOpenPortfolioPanel = () => {
    setIsPortfolioPanelOpen(true);
  };

  const handleOpenEventsPanel = () => {
    setIsEventsPanelOpen(true);
  };

  const handleOpenProjectIdeasPanel = () => {
    setIsProjectIdeasPanelOpen(true);
  };

  // Loading durumu
  if (loading) {
    return (
      <StudentLayout>
        <div className="flex justify-center items-center h-64">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border border-blue-400/30 opacity-20"></div>
          </div>
        </div>
      </StudentLayout>
    );
  }

  // Error durumu
  if (error) {
    return (
      <StudentLayout>
        <div className="max-w-md mx-auto mt-8">
          <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-300">Bir hata oluştu</h3>
                <div className="mt-2 text-sm text-red-200">{error}</div>
                <div className="mt-3">
                  <button
                    onClick={refetch}
                    className="bg-red-800/50 hover:bg-red-700/50 text-red-200 px-3 py-1 rounded text-sm font-medium transition-colors duration-200 border border-red-600/30"
                  >
                    Tekrar Dene
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout
      isJobsPanelOpen={isJobsPanelOpen}
      setIsJobsPanelOpen={setIsJobsPanelOpen}
      isProfilePanelOpen={isProfilePanelOpen}
      setIsProfilePanelOpen={setIsProfilePanelOpen}
      isPortfolioPanelOpen={isPortfolioPanelOpen}
      setIsPortfolioPanelOpen={setIsPortfolioPanelOpen}
      isEventsPanelOpen={isEventsPanelOpen}
      setIsEventsPanelOpen={setIsEventsPanelOpen}
      isProjectIdeasPanelOpen={isProjectIdeasPanelOpen}
      setIsProjectIdeasPanelOpen={setIsProjectIdeasPanelOpen}
    >
      <div className="w-full px-4 py-6 space-y-6">

        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
            {/* Sol taraf - Profil fotoğrafı ve bilgiler */}
            <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
              {/* Profil fotoğrafı */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-blue-500/20 flex-shrink-0">
                {profile?.profileImage ? (
                  <img
                    src={getProfileImageUrl()}
                    alt={profile.fullName || 'Profil'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Profil resmi yüklenemedi:', profile.profileImage);
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/80?text=' + (profile.fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'Ö');
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-blue-300 text-xl sm:text-2xl font-bold">
                    {profile?.fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'Ö'}
                  </div>
                )}
              </div>

              {/* İsim ve bilgiler */}
              <div className="flex flex-col min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl font-bold text-white truncate">
                  {profile?.fullName || 'Öğrenci'}
                </h1>
                <p className="text-blue-200 mt-1 text-sm sm:text-base line-clamp-1">
                  {profile?.university ? (
                    <>{profile.university} - {profile.department || 'Öğrenci'}</>
                  ) : profile?.school ? (
                    <>{profile.school} - {profile.department || 'Öğrenci'}</>
                  ) : (
                    <>{user?.email}</>
                  )}
                </p>
              </div>
            </div>

            {/* Sağ taraf - Sosyal medya ikonları */}
            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-center sm:justify-start space-x-4 sm:space-x-0 sm:space-y-2">
              <div className="flex space-x-3">
                {/* LinkedIn */}
                <a
                  href="#"
                  className="text-blue-300 hover:text-white transition-colors p-2 hover:bg-blue-700/30 rounded-lg"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>

                {/* Twitter */}
                <a
                  href="#"
                  className="text-blue-300 hover:text-white transition-colors p-2 hover:bg-blue-700/30 rounded-lg"
                  aria-label="Twitter"
                >
                  <FaTwitter className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>

                {/* Instagram */}
                <a
                  href="#"
                  className="text-blue-300 hover:text-white transition-colors p-2 hover:bg-blue-700/30 rounded-lg"
                  aria-label="Instagram"
                >
                  <FaInstagram className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Aktif İşler */}
          <button
            onClick={handleOpenJobsPanel}
            className="bg-blue-800/30 backdrop-blur-xl rounded-xl p-6 border border-blue-700/30 hover:bg-blue-700/40 transition-all duration-200 text-left group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Aktif İşler</p>
                <p className="text-3xl font-bold text-white">{stats?.activeJobs || 0}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg group-hover:scale-110 transition-transform">
                <MdWork className="w-8 h-8 text-blue-300" />
              </div>
            </div>
          </button>

          {/* Tamamlanan Projeler */}
          <button
            onClick={handleOpenPortfolioPanel}
            className="bg-blue-800/30 backdrop-blur-xl rounded-xl p-6 border border-blue-700/30 hover:bg-blue-700/40 transition-all duration-200 text-left group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Tamamlanan Projeler</p>
                <p className="text-3xl font-bold text-white">{stats?.completedProjects || 0}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg group-hover:scale-110 transition-transform">
                <MdCheckCircle className="w-8 h-8 text-blue-300" />
              </div>
            </div>
          </button>

          {/* Yaklaşan Etkinlikler */}
          <button
            onClick={handleOpenEventsPanel}
            className="bg-blue-800/30 backdrop-blur-xl rounded-xl p-6 border border-blue-700/30 hover:bg-blue-700/40 transition-all duration-200 text-left group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Yaklaşan Etkinlik</p>
                <p className="text-3xl font-bold text-white">{stats?.upcomingEvents || 0}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg group-hover:scale-110 transition-transform">
                <MdEvent className="w-8 h-8 text-blue-300" />
              </div>
            </div>
          </button>

          {/* Proje Fikirleri */}
          <button
            onClick={handleOpenProjectIdeasPanel}
            className="bg-blue-800/30 backdrop-blur-xl rounded-xl p-6 border border-blue-700/30 hover:bg-blue-700/40 transition-all duration-200 text-left group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Proje Fikirleri</p>
                <p className="text-3xl font-bold text-white">{stats?.projectIdeas || 0}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg group-hover:scale-110 transition-transform">
                <MdLightbulb className="w-8 h-8 text-blue-300" />
              </div>
            </div>
          </button>
        </div>

        {/* Hızlı İşlemler */}
        <div className="bg-blue-800/30 backdrop-blur-xl rounded-xl p-6 border border-blue-700/30">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <MdSchool className="w-5 h-5 mr-2 text-blue-300" />
            Hızlı İşlemler
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleOpenJobsPanel}
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center group"
            >
              <MdSearch className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              İş Fırsatları
            </button>
            <button
              onClick={handleOpenPortfolioPanel}
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center group"
            >
              <MdAdd className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Proje Ekle
            </button>
            <button
              onClick={handleOpenEventsPanel}
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center group"
            >
              <MdEvent className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Etkinlikleri Gör
            </button>
          </div>
        </div>

        {/* Main Content - 3'lü Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Aktif İşler Preview */}
          <div className="bg-blue-800/30 backdrop-blur-xl rounded-xl p-6 border border-blue-700/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <MdWork className="w-5 h-5 mr-2 text-blue-300" />
                Aktif İşler
              </h3>
              <button
                onClick={handleOpenJobsPanel}
                className="text-blue-300 hover:text-blue-200 text-sm font-medium transition-colors"
              >
                Tümü →
              </button>
            </div>

            <div className="space-y-3">
              {jobs?.slice(0, 3).map((job, index) => (
                <div key={job?.id || index} className="bg-blue-700/30 rounded-lg p-3 border border-blue-600/30">
                  <h4 className="font-medium text-white text-sm">{job?.title || 'Proje Başlığı'}</h4>
                  <p className="text-blue-200 text-xs mt-1">
                    💰 {job?.budget || 'Belirtilmemiş'} • ⏱️ {job?.deadline || 'Açık'}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${job?.status === 'active' ? 'bg-blue-500/20 text-blue-300' :
                        job?.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-gray-500/20 text-gray-300'
                      }`}>
                      {job?.status === 'active' ? '🔄 Aktif' :
                        job?.status === 'pending' ? '⏳ Beklemede' : '📋 Yeni'}
                    </span>
                  </div>
                </div>
              )) || (
                  <div className="text-blue-300 text-sm text-center py-4">
                    📝 Henüz aktif iş bulunmuyor
                  </div>
                )}
            </div>
          </div>

          {/* Son Projeler Preview */}
          <div className="bg-blue-800/30 backdrop-blur-xl rounded-xl p-6 border border-blue-700/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <MdCode className="w-5 h-5 mr-2 text-blue-300" />
                Son Projeler
              </h3>
              <button
                onClick={handleOpenPortfolioPanel}
                className="text-blue-300 hover:text-blue-200 text-sm font-medium transition-colors"
              >
                Tümü →
              </button>
            </div>

            <div className="space-y-3">
              {projects?.slice(0, 3).map((project, index) => (
                <div key={project?.id || index} className="bg-blue-700/30 rounded-lg p-3 border border-blue-600/30">
                  <h4 className="font-medium text-white text-sm">{project?.title || 'Proje Adı'}</h4>
                  <p className="text-blue-200 text-xs mt-1">
                    🛠️ {Array.isArray(project?.technologies) ? project.technologies.join(', ') :
                      typeof project?.technologies === 'string' ? project.technologies :
                        'React, Node.js'}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                      ✅ Tamamlandı
                    </span>
                  </div>
                </div>
              )) || (
                  <div className="text-blue-300 text-sm text-center py-4">
                    🚀 İlk projenizi ekleyin
                  </div>
                )}
            </div>
          </div>

          {/* Yaklaşan Etkinlikler Preview */}
          <div className="bg-blue-800/30 backdrop-blur-xl rounded-xl p-6 border border-blue-700/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <MdEvent className="w-5 h-5 mr-2 text-blue-300" />
                Yaklaşan Etkinlikler
              </h3>
              <button
                onClick={handleOpenEventsPanel}
                className="text-blue-300 hover:text-blue-200 text-sm font-medium transition-colors"
              >
                Tümü →
              </button>
            </div>

            <div className="space-y-3">
              {events?.slice(0, 3).map((event, index) => (
                <div key={event?.id || index} className="bg-blue-700/30 rounded-lg p-3 border border-blue-600/30">
                  <h4 className="font-medium text-white text-sm">{event?.title || 'Etkinlik Adı'}</h4>
                  <p className="text-blue-200 text-xs mt-1">
                    📅 {event?.date ? new Date(event.date).toLocaleDateString('tr-TR') : 'Tarih Belirtilmemiş'}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                      🎯 {event?.type || 'Workshop'}
                    </span>
                  </div>
                </div>
              )) || (
                  <div className="text-blue-300 text-sm text-center py-4">
                    📅 Yaklaşan etkinlik bulunmuyor
                  </div>
                )}
            </div>
          </div>

        </div>

        {/* Proje Fikirleri */}
        {projectIdeas && projectIdeas.length > 0 && (
          <div className="bg-yellow-800/30 backdrop-blur-xl rounded-xl p-6 border border-yellow-700/30">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <MdLightbulb className="w-5 h-5 mr-2 text-yellow-300" />
                İlham Verici Proje Fikirleri
              </h2>
              <button
                onClick={handleOpenProjectIdeasPanel}
                className="text-yellow-300 hover:text-yellow-200 text-sm font-medium transition-colors"
              >
                Tümünü Gör →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projectIdeas.slice(0, 3).map((idea, index) => (
                <div key={idea?.id || index} className="bg-yellow-700/30 rounded-lg p-4 border border-yellow-600/30">
                  <h3 className="font-medium text-white">{idea?.title || 'Proje Fikri'}</h3>
                 <p className="text-yellow-200 text-sm mt-2 line-clamp-3 break-all">
  {(() => {
    const text = idea?.description || 'Bu proje ile yeni teknolojiler öğrenebilir ve portföyünüzü geliştirebilirsiniz.';
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
  })()}
</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-yellow-300">
                      🛠️ {idea?.difficulty || 'Orta'}
                    </span>
                    <button className="text-yellow-300 hover:text-yellow-200 text-xs font-medium">
                      <MdBookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;