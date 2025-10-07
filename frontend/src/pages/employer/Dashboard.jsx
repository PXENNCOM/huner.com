// pages/employer/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import EmployerLayout from './components/EmployerLayout';
import EmployerProfilePreviewCard from './components/profile/EmployerProfilePreviewCard';
import DeveloperRequestsPreviewCard from './components/DeveloperRequests/DeveloperRequestsPreviewCard';
import MessagesPreviewCard from './components/Messages/MessagesPreviewCard';
import { getEmployerProfile, getEmployerJobs, getDeveloperRequests } from '../../services/employerApi';
import { 
  MdWork, 
  MdCode, 
  MdTrendingUp, 
  MdCheckCircle,
  MdPending,
  MdGroup,
  MdMessage,
  MdAdd,
  MdBusiness
} from 'react-icons/md';

import { FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';

const EmployerDashboard = () => {
  const { user } = useAuth();
  
  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    completedJobs: 0,
    totalRequests: 0,
    pendingRequests: 0,
    viewedRequests: 0
  });

  // Panel states
  const [isProfilePanelOpen, setIsProfilePanelOpen] = useState(false);
  const [isDeveloperRequestsPanelOpen, setIsDeveloperRequestsPanelOpen] = useState(false);
  const [isJobsPanelOpen, setIsJobsPanelOpen] = useState(false);
  const [isMessagesPanelOpen, setIsMessagesPanelOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [profileResponse, jobsResponse, requestsResponse] = await Promise.all([
        getEmployerProfile().catch(() => ({ data: null })),
        getEmployerJobs().catch(() => ({ data: [] })),
        getDeveloperRequests().catch(() => ({ data: { requests: [] } }))
      ]);

      const profileData = profileResponse.data;
      const jobsData = jobsResponse.data || [];
      const requestsData = requestsResponse.data?.requests || [];

      setProfile(profileData);
      setJobs(jobsData);
      setRequests(requestsData);

      // İstatistikleri hesapla
      setStats({
        totalJobs: jobsData.length,
        activeJobs: jobsData.filter(job => ['approved', 'assigned', 'in_progress'].includes(job.status)).length,
        completedJobs: jobsData.filter(job => job.status === 'completed').length,
        totalRequests: requestsData.length,
        pendingRequests: requestsData.filter(req => req.status === 'pending').length,
        viewedRequests: requestsData.filter(req => req.status === 'viewed').length
      });

    } catch (err) {
      console.error('Dashboard verisi yüklenirken hata:', err);
      setError('Dashboard bilgileri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Panel handlers
  const handleOpenProfilePanel = () => {
    setIsProfilePanelOpen(true);
  };

  const handleOpenDeveloperRequestsPanel = () => {
    setIsDeveloperRequestsPanelOpen(true);
  };

  const handleOpenJobsPanel = () => {
    setIsJobsPanelOpen(true);
  };

  const handleOpenMessagesPanel = () => {
    setIsMessagesPanelOpen(true);
  };

  // Loading durumu
  if (loading) {
    return (
      <EmployerLayout>
        <div className="flex justify-center items-center h-64">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border border-blue-400/30 opacity-20"></div>
          </div>
        </div>
      </EmployerLayout>
    );
  }

  // Error durumu
  if (error) {
    return (
      <EmployerLayout>
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
                    onClick={fetchDashboardData}
                    className="bg-red-800/50 hover:bg-red-700/50 text-red-200 px-3 py-1 rounded text-sm font-medium transition-colors duration-200 border border-red-600/30"
                  >
                    Tekrar Dene
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </EmployerLayout>
    );
  }

  return (
    <EmployerLayout
      isProfilePanelOpen={isProfilePanelOpen}
      setIsProfilePanelOpen={setIsProfilePanelOpen}
      isDeveloperRequestsPanelOpen={isDeveloperRequestsPanelOpen}
      setIsDeveloperRequestsPanelOpen={setIsDeveloperRequestsPanelOpen}
      isJobsPanelOpen={isJobsPanelOpen}
      setIsJobsPanelOpen={setIsJobsPanelOpen}
      isMessagesPanelOpen={isMessagesPanelOpen}
      setIsMessagesPanelOpen={setIsMessagesPanelOpen}
    >
      <div className="w-full px-4 py-6 space-y-6">
        
        {/* Welcome Header */}
<div className="bg-blue-800/30 backdrop-blur-xl rounded-xl p-4 sm:p-6 border border-blue-700/30">
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    {/* Sol taraf - Profil fotoğrafı ve bilgiler */}
    <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-blue-500/20 flex-shrink-0">
        {profile?.profileImage ? (
          <img
            src={`/uploads/profile-images/${profile.profileImage}`}
            alt={profile.fullName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/64?text=' + (profile.fullName?.charAt(0)?.toUpperCase() || 'İ');
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-blue-300 text-lg sm:text-xl font-bold">
            {profile?.fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'İ'}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h1 className="text-lg sm:text-2xl font-bold text-white truncate">
          Hoş geldiniz, {profile?.fullName || 'İşveren'}! 👋
        </h1>
        <p className="text-blue-200 mt-1 text-sm sm:text-base line-clamp-1">
          {profile?.companyName ? (
            <>🏢 {profile.companyName} - {profile.position || 'İşveren'}</>
          ) : (
            <>📧 {user?.email}</>
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
          {/* Toplam İş İlanları */}
          <button
            onClick={handleOpenJobsPanel}
            className="bg-blue-800/30 backdrop-blur-xl rounded-xl p-6 border border-blue-700/30 hover:bg-blue-700/40 transition-all duration-200 text-left group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Toplam İş İlanı</p>
                <p className="text-3xl font-bold text-white">{stats.totalJobs}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg group-hover:scale-110 transition-transform">
                <MdWork className="w-8 h-8 text-blue-300" />
              </div>
            </div>
          </button>

          {/* Aktif İş İlanları */}
          <button
            onClick={handleOpenJobsPanel}
            className="bg-green-800/30 backdrop-blur-xl rounded-xl p-6 border border-green-700/30 hover:bg-green-700/40 transition-all duration-200 text-left group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm font-medium">Aktif İlanlar</p>
                <p className="text-3xl font-bold text-white">{stats.activeJobs}</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg group-hover:scale-110 transition-transform">
                <MdTrendingUp className="w-8 h-8 text-green-300" />
              </div>
            </div>
          </button>

          {/* Tamamlanan İşler */}
          <button
            onClick={handleOpenJobsPanel}
            className="bg-purple-800/30 backdrop-blur-xl rounded-xl p-6 border border-purple-700/30 hover:bg-purple-700/40 transition-all duration-200 text-left group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">Tamamlanan</p>
                <p className="text-3xl font-bold text-white">{stats.completedJobs}</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg group-hover:scale-110 transition-transform">
                <MdCheckCircle className="w-8 h-8 text-purple-300" />
              </div>
            </div>
          </button>

          {/* Yazılımcı Talepleri */}
          <button
            onClick={handleOpenDeveloperRequestsPanel}
            className="bg-orange-800/30 backdrop-blur-xl rounded-xl p-6 border border-orange-700/30 hover:bg-orange-700/40 transition-all duration-200 text-left group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-200 text-sm font-medium">Yazılımcı Talebi</p>
                <p className="text-3xl font-bold text-white">{stats.totalRequests}</p>
              </div>
              <div className="p-3 bg-orange-500/20 rounded-lg group-hover:scale-110 transition-transform">
                <MdCode className="w-8 h-8 text-orange-300" />
              </div>
            </div>
          </button>
        </div>

        {/* Hızlı İşlemler */}
        <div className="bg-blue-800/30 backdrop-blur-xl rounded-xl p-6 border border-blue-700/30">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <MdBusiness className="w-5 h-5 mr-2 text-blue-300" />
            Hızlı İşlemler
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleOpenDeveloperRequestsPanel}
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center group"
            >
              <MdAdd className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Yeni Yazılımcı Talebi
            </button>
            <button 
              onClick={handleOpenJobsPanel}
              className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center group"
            >
              <MdWork className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Yeni İş İlanı
            </button>
            <button
              onClick={handleOpenMessagesPanel}
              className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center group"
            >
              <MdMessage className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Mesajları Görüntüle
            </button>
          </div>
        </div>

        {/* Main Content - Dashboard Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Profil Preview */}
          <EmployerProfilePreviewCard 
            onOpenPanel={handleOpenProfilePanel}
          />
          
          {/* Developer Requests Preview */}
          <DeveloperRequestsPreviewCard 
            onOpenPanel={handleOpenDeveloperRequestsPanel}
          />
          
          {/* Messages Preview */}
          <MessagesPreviewCard 
            onOpenPanel={handleOpenMessagesPanel}
          />
          
        </div>

        {/* Son İş İlanları */}
        {jobs.length > 0 && (
          <div className="bg-blue-800/30 backdrop-blur-xl rounded-xl p-6 border border-blue-700/30">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <MdWork className="w-5 h-5 mr-2 text-blue-300" />
                Son İş İlanları
              </h2>
              <button 
                onClick={handleOpenJobsPanel}
                className="text-blue-300 hover:text-blue-200 text-sm font-medium transition-colors"
              >
                Tümünü Gör →
              </button>
            </div>
            
            <div className="space-y-3">
              {jobs.slice(0, 3).map((job) => (
                <div key={job.id} className="bg-blue-700/30 rounded-lg p-4 border border-blue-600/30">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{job.title}</h3>
                      <p className="text-blue-200 text-sm mt-1">
                        📅 {new Date(job.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        job.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                        job.status === 'in_progress' ? 'bg-blue-500/20 text-blue-300' :
                        job.status === 'approved' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-gray-500/20 text-gray-300'
                      }`}>
                        {job.status === 'completed' ? '✅ Tamamlandı' :
                         job.status === 'in_progress' ? '⏳ Devam Ediyor' :
                         job.status === 'approved' ? '👍 Onaylandı' :
                         job.status === 'pending' ? '⏳ Beklemede' : job.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

       
      </div>
    </EmployerLayout>
  );
};

export default EmployerDashboard;