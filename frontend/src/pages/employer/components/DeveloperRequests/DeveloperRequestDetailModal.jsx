// pages/employer/components/DeveloperRequests/DeveloperRequestDetailModal.jsx
import React, { useState } from 'react';
import { 
  MdClose, 
  MdEdit, 
  MdCode, 
  MdPerson,
  MdBusiness,
  MdAccessTime,
  MdLocationOn,
  MdLanguage,
  MdPriorityHigh
} from 'react-icons/md';
import EditDeveloperRequestModal from './EditDeveloperRequestModal';

const DeveloperRequestDetailModal = ({ isOpen, onClose, request, onUpdate }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!isOpen || !request) return null;

  // Safe parse functions
  const safeParseTechnologies = (technologies) => {
    if (!technologies) return [];
    if (typeof technologies === 'string') {
      try {
        return JSON.parse(technologies);
      } catch (error) {
        console.warn('Technologies parse error:', error);
        return [];
      }
    }
    if (Array.isArray(technologies)) return technologies;
    return [];
  };

  const safeParseLanguages = (languages) => {
    if (!languages) return [];
    if (typeof languages === 'string') {
      try {
        return JSON.parse(languages);
      } catch (error) {
        console.warn('Languages parse error:', error);
        return [];
      }
    }
    if (Array.isArray(languages)) return languages;
    return [];
  };

  const techArray = safeParseTechnologies(request.technologies);
  const langArray = safeParseLanguages(request.communicationLanguages);

  // Status badge
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', label: 'Yeni Talep', icon: '🆕' },
      reviewing: { color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', label: 'İncelemede', icon: '👀' },
      viewed: { color: 'bg-green-500/20 text-green-300 border-green-500/30', label: 'Görüntülendi', icon: '✅' },
      archived: { color: 'bg-gray-500/20 text-gray-300 border-gray-500/30', label: 'Arşivlendi', icon: '📁' }
    };

    const statusInfo = statusMap[status] || { color: 'bg-gray-500/20 text-gray-300 border-gray-500/30', label: status, icon: '❓' };
    
    return (
      <div className={`px-4 py-2 rounded-full text-sm font-medium border ${statusInfo.color} flex items-center space-x-2`}>
        <span>{statusInfo.icon}</span>
        <span>{statusInfo.label}</span>
      </div>
    );
  };

  // Priority badge
  const getPriorityBadge = (priority) => {
    const priorityMap = {
      normal: { color: 'bg-gray-500/20 text-gray-300', label: 'Normal', icon: '📋' },
      high: { color: 'bg-orange-500/20 text-orange-300', label: 'Yüksek', icon: '⚠️' },
      urgent: { color: 'bg-red-500/20 text-red-300', label: 'Acil', icon: '🚨' }
    };

    const priorityInfo = priorityMap[priority] || { color: 'bg-gray-500/20 text-gray-300', label: priority, icon: '📋' };
    
    return (
      <div className={`px-4 py-2 rounded-lg text-sm font-medium ${priorityInfo.color} flex items-center space-x-2`}>
        <span>{priorityInfo.icon}</span>
        <span>{priorityInfo.label}</span>
      </div>
    );
  };

  // Project type label
  const getProjectTypeLabel = (type) => {
    const typeMap = {
      website: 'Web Sitesi',
      mobile_app: 'Mobil Uygulama',
      api: 'API',
      ecommerce: 'E-ticaret',
      crm: 'CRM',
      desktop_app: 'Masaüstü Uygulaması',
      other: 'Diğer'
    };
    return typeMap[type] || type;
  };

  // Helper functions for labels
  const getExperienceLevelLabel = (level) => {
    const levelMap = {
      intern: 'Stajyer',
      junior: 'Junior (0-2 yıl)',
      mid: 'Mid-level (2-5 yıl)',
      senior: 'Senior (5+ yıl)'
    };
    return levelMap[level] || level;
  };

  const getWorkTypeLabel = (type) => {
    const typeMap = {
      freelance: 'Freelance/Proje bazlı',
      part_time: 'Part-time çalışan',
      full_time: 'Full-time çalışan',
      intern: 'Stajyer'
    };
    return typeMap[type] || type;
  };

  const getDurationLabel = (duration) => {
    return duration?.replace('_', ' ').replace('months', 'ay').replace('month', 'ay') || '';
  };

  const getStartDateLabel = (startDate) => {
    const dateMap = {
      immediately: 'Hemen',
      within_1_week: '1 hafta içinde',
      within_1_month: '1 ay içinde'
    };
    return dateMap[startDate] || startDate;
  };

  const getWorkStyleLabel = (style) => {
    const styleMap = {
      remote: 'Remote',
      hybrid: 'Hibrit',
      office: 'Ofiste'
    };
    return styleMap[style] || style;
  };

  const getWorkHoursLabel = (hours) => {
    const hoursMap = {
      business_hours: 'Mesai saatleri',
      flexible: 'Esnek',
      night_shift: 'Gece vardiyası'
    };
    return hoursMap[hours] || hours;
  };

  const getTeamSizeLabel = (size) => {
    const sizeMap = {
      solo: '1 kişi',
      '2_3_people': '2-3 kişi',
      team: 'Takım (4+ kişi)'
    };
    return sizeMap[size] || size;
  };

  const getIndustryExperienceLabel = (industry) => {
    const industryMap = {
      no_preference: 'Fark etmez',
      fintech: 'Fintech',
      ecommerce: 'E-ticaret',
      healthcare: 'Sağlık',
      education: 'Eğitim',
      gaming: 'Oyun',
      social_media: 'Sosyal Medya'
    };
    return industryMap[industry] || industry;
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    onUpdate();
  };

  return (
    <>
      <div className="fixed inset-0 z-[60] overflow-hidden">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="absolute inset-4 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-blue-700/50 bg-blue-800/50 backdrop-blur-xl">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <MdCode className="w-6 h-6 text-blue-300" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{request.projectTitle}</h2>
                <div className="flex items-center space-x-4 mt-1">
                  {getStatusBadge(request.status)}
                  <span className="text-sm text-blue-200">
                    📅 {new Date(request.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {request.status === 'pending' && (
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-all duration-200 flex items-center space-x-2"
                >
                  <MdEdit className="w-5 h-5" />
                  <span className="text-sm">Düzenle</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-blue-200 hover:text-white hover:bg-blue-700/50 rounded-lg transition-all duration-200"
              >
                <MdClose className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="h-full overflow-y-auto pb-20">
            <div className="p-6 space-y-6">
              {/* Proje Bilgileri */}
              <div className="bg-blue-800/30 rounded-xl p-6 border border-blue-700/30">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <MdCode className="w-5 h-5 mr-2 text-blue-300" />
                  Proje Bilgileri
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">Proje Tipi</label>
                    <p className="text-white">{getProjectTypeLabel(request.projectType)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">Öncelik</label>
                    <div>{getPriorityBadge(request.priority)}</div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">Proje Açıklaması</label>
                  <p className="text-white whitespace-pre-wrap bg-blue-700/30 rounded-lg p-4 border border-blue-600/30">
                    {request.projectDescription}
                  </p>
                </div>
              </div>

              {/* Teknik Gereksinimler */}
              <div className="bg-blue-800/30 rounded-xl p-6 border border-blue-700/30">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <MdPerson className="w-5 h-5 mr-2 text-blue-300" />
                  Teknik Gereksinimler
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">Deneyim Seviyesi</label>
                    <p className="text-white">{getExperienceLevelLabel(request.experienceLevel)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">Çalışma Türü</label>
                    <p className="text-white">{getWorkTypeLabel(request.workType)}</p>
                  </div>
                </div>
                
                {techArray && techArray.length > 0 && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-blue-200 mb-3">Teknolojiler</label>
                    <div className="flex flex-wrap gap-2">
                      {techArray.map((tech, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Çalışma Koşulları */}
              <div className="bg-blue-800/30 rounded-xl p-6 border border-blue-700/30">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <MdBusiness className="w-5 h-5 mr-2 text-blue-300" />
                  Çalışma Koşulları
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      <MdAccessTime className="w-4 h-4 inline mr-1" />
                      Süre
                    </label>
                    <p className="text-white">{getDurationLabel(request.duration)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">Başlangıç</label>
                    <p className="text-white">{getStartDateLabel(request.startDate)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">Çalışma Şekli</label>
                    <p className="text-white">{getWorkStyleLabel(request.workStyle)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">Çalışma Saatleri</label>
                    <p className="text-white">{getWorkHoursLabel(request.workHours)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">Takım Büyüklüğü</label>
                    <p className="text-white">{getTeamSizeLabel(request.teamSize)}</p>
                  </div>
                  {request.location && (
                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-2">
                        <MdLocationOn className="w-4 h-4 inline mr-1" />
                        Konum
                      </label>
                      <p className="text-white capitalize">{request.location}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tercihler ve Diğer Bilgiler */}
              <div className="bg-blue-800/30 rounded-xl p-6 border border-blue-700/30">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <MdLanguage className="w-5 h-5 mr-2 text-blue-300" />
                  Tercihler ve Diğer Bilgiler
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {langArray && langArray.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-2">İletişim Dilleri</label>
                      <p className="text-white">{langArray.join(', ')}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">Sektör Deneyimi</label>
                    <p className="text-white">
                      {request.industryExperience ? getIndustryExperienceLabel(request.industryExperience) : 'Belirtilmemiş'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">Bütçe Aralığı</label>
                    <p className="text-white">{request.budgetRange || 'Belirtilmemiş'}</p>
                  </div>
                </div>
              </div>

              {/* Admin Notları */}
              {request.adminNotes && (
                <div className="bg-blue-700/40 rounded-xl p-6 border border-blue-600/40">
                  <h3 className="text-lg font-semibold text-blue-200 mb-4">💬 Admin Notları</h3>
                  <p className="text-blue-100">{request.adminNotes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditDeveloperRequestModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        request={request}
        onSuccess={handleEditSuccess}
      />
    </>
  );
};

export default DeveloperRequestDetailModal;