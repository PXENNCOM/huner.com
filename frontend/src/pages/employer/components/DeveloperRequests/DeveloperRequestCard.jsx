// pages/employer/components/DeveloperRequests/DeveloperRequestCard.jsx
import React from 'react';
import {
  MdCode,
  MdAccessTime,
  MdPeople,
  MdLocationOn,
  MdArrowForward,
  MdEdit,
} from 'react-icons/md';

const DeveloperRequestCard = ({ request, onClick }) => {
  // Güvenli data kontrolü
  if (!request || typeof request !== 'object') {
    console.error('DeveloperRequestCard: Invalid request data:', request);
    return (
      <div className="bg-red-800/30 rounded-xl p-4 border border-red-700/30">
        <p className="text-red-300">⚠️ Geçersiz veri formatı</p>
      </div>
    );
  }

  // --- Utility Functions (Aynı kalabilir, mobil/desktop fark etmez) ---

  // Technologies - Güvenli parse
  const getTechnologies = (technologies) => {
    if (!technologies) return [];
    if (typeof technologies === 'string') {
      try {
        return JSON.parse(technologies);
      } catch (error) {
        console.warn('Technologies parse error:', error);
        return [];
      }
    }
    if (Array.isArray(technologies)) {
      return technologies;
    }
    return [];
  };

  const techArray = getTechnologies(request.technologies);

  // Status badge (Mobil öncelikli görünüm için status bilgisi küçültülebilir)
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', label: 'Yeni', icon: '🆕' },
      reviewing: { color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', label: 'İncelemede', icon: '👀' },
      viewed: { color: 'bg-green-500/20 text-green-300 border-green-500/30', label: 'Görüntülendi', icon: '✅' },
      archived: { color: 'bg-gray-500/20 text-gray-300 border-gray-500/30', label: 'Arşiv', icon: '📁' }
    };

    const statusInfo = statusMap[status] || { color: 'bg-gray-500/20 text-gray-300 border-gray-500/30', label: status, icon: '❓' };

    return (
      <div className={`px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.color} flex items-center space-x-1 whitespace-nowrap`}>
        <span>{statusInfo.icon}</span>
        {/* Mobil: Sadece ikon ve kısa label | Desktop: Tam label */}
        <span className="inline md:hidden">{statusInfo.label.split(' ')[0]}</span>
        <span className="hidden md:inline">{statusInfo.label}</span>
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
      <div className={`px-2 py-1 rounded-lg text-xs font-medium ${priorityInfo.color} flex items-center space-x-1 whitespace-nowrap`}>
        <span>{priorityInfo.icon}</span>
        <span className="hidden sm:inline">{priorityInfo.label}</span>
      </div>
    );
  };

  // Project type label
  const getProjectTypeLabel = (type) => {
    const typeMap = {
      website: { label: 'Web Sitesi', icon: '🌐' },
      mobile_app: { label: 'Mobil Uyg.', icon: '📱' },
      api: { label: 'API', icon: '🔗' },
      ecommerce: { label: 'E-ticaret', icon: '🛒' },
      crm: { label: 'CRM', icon: '👥' },
      desktop_app: { label: 'Masaüstü', icon: '💻' },
      other: { label: 'Diğer', icon: '⚡' }
    };

    const typeInfo = typeMap[type] || { label: type, icon: '⚡' };
    return `${typeInfo.icon} ${typeInfo.label}`;
  };

  // Experience level label
  const getExperienceLevelLabel = (level) => {
    const levelMap = {
      intern: 'Stajyer',
      junior: 'Junior', // Mobil için kısaltma
      mid: 'Mid-level',
      senior: 'Senior'
    };
    return levelMap[level] || level;
  };

  // Work type label
  const getWorkTypeLabel = (type) => {
    const typeMap = {
      freelance: 'Freelance',
      part_time: 'Part-time',
      full_time: 'Full-time',
      intern: 'Stajyer'
    };
    return typeMap[type] || type;
  };

  // Duration label
  const getDurationLabel = (duration) => {
    const durationMap = {
      '1_month': '1 ay',
      '2_months': '2 ay',
      '3_months': '3 ay',
      '4_months': '4 ay',
      '5_months': '5 ay',
      '6_months': '6 ay',
      '6_plus_months': '6+ ay',
      'indefinite': 'Belirsiz'
    };
    return durationMap[duration] || duration;
  };

  // --- Bileşen Render'ı (Mobil Öncelikli Düzen) ---

  return (
    <div
      className="bg-blue-800/30 backdrop-blur-xl rounded-xl p-4 border border-blue-700/30 hover:bg-blue-700/40 transition-all duration-300 cursor-pointer group w-full overflow-hidden sm:p-5"
      onClick={onClick}
    >
      {/* Üst Bölüm: Başlık, Durum ve Öncelik (Mobil: Yan yana, küçük ekranlar için sarma) */}
      <div className="flex justify-between items-start mb-3 space-x-2">
        <div className="min-w-0 flex-1 overflow-hidden">
          {/* Başlık ve Yönlendirme İkonu */}
          <div className="flex items-center space-x-1">
            <h3 className="text-base font-bold text-white group-hover:text-blue-200 transition-colors truncate flex-1">
              {request.projectTitle || 'Başlıksız Proje'}
            </h3>
            <MdArrowForward className="w-4 h-4 text-blue-300 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1 flex-shrink-0" />
          </div>
          {/* Kısa Açıklama */}
          <p className="text-blue-200 text-xs line-clamp-1 leading-normal mt-1">
            {request.projectDescription || 'Açıklama yok'}
          </p>
        </div>

        {/* Durum ve Öncelik Badge'leri */}
        <div className="flex flex-col items-end space-y-1 ml-2 flex-shrink-0">
          {getStatusBadge(request.status)}
          {getPriorityBadge(request.priority)}
        </div>
      </div>

      {/* --- Detaylar Bölümü (Mobil: İki Sütunlu Grid, Orta: Üç, Büyük: Dört) --- */}
      <div className="grid grid-cols-2 gap-2 border-t border-blue-700/40 pt-3 mt-3 sm:grid-cols-3 md:grid-cols-4">

        {/* Proje Tipi */}
        <div className="flex flex-col">
          <span className="text-xs text-blue-300 mb-1 flex items-center space-x-1">
            <MdCode className="w-3 h-3 flex-shrink-0" />
            <span className="hidden sm:inline">Proje Tipi</span>
            <span className="sm:hidden">Tip</span>
          </span>
          <div className="text-sm font-semibold text-white truncate">
            {getProjectTypeLabel(request.projectType)}
          </div>
        </div>

        {/* Deneyim Seviyesi */}
        <div className="flex flex-col">
          <span className="text-xs text-blue-300 mb-1 flex items-center space-x-1">
            <MdPeople className="w-3 h-3 flex-shrink-0" />
            <span className="hidden sm:inline">Deneyim</span>
            <span className="sm:hidden">Seviye</span>
          </span>
          <div className="text-sm font-semibold text-white truncate">
            {getExperienceLevelLabel(request.experienceLevel)}
          </div>
        </div>

        {/* Çalışma Şekli (Sadece mobil için 2. satıra kaydırılabilir) */}
        <div className="flex flex-col">
          <span className="text-xs text-blue-300 mb-1 flex items-center space-x-1">
            <MdPeople className="w-3 h-3 flex-shrink-0" />
            <span className="hidden sm:inline">Çalışma Türü</span>
            <span className="sm:hidden">Tür</span>
          </span>
          <div className="text-sm font-semibold text-white truncate">
            {getWorkTypeLabel(request.workType)}
          </div>
        </div>

        {/* Süre */}
        <div className="flex flex-col">
          <span className="text-xs text-blue-300 mb-1 flex items-center space-x-1">
            <MdAccessTime className="w-3 h-3 flex-shrink-0" />
            Süre
          </span>
          <div className="text-sm font-semibold text-white truncate">
            {getDurationLabel(request.duration)}
          </div>
        </div>

        {/* Konum (Varsa) */}
        {request.location && (
          <div className="flex flex-col col-span-2 sm:col-span-1"> {/* Mobil: 2 sütun kaplayabilir, sm'de 1 */}
            <span className="text-xs text-blue-300 mb-1 flex items-center space-x-1">
              <MdLocationOn className="w-3 h-3 flex-shrink-0" />
              Konum
            </span>
            <div className="text-sm font-semibold text-white capitalize truncate">
              {request.location}
            </div>
          </div>
        )}

      </div>

      {/* --- Teknolojiler --- */}
      {techArray && techArray.length > 0 && (
        <div className="mt-4 border-t border-blue-700/40 pt-3">
          <div className="text-xs font-semibold text-blue-200 mb-2">Teknolojiler</div>
          <div className="flex flex-wrap gap-1">
            {/* Mobil için 3, desktop için 5 teknoloji gösterip kalanını +X ile özetle */}
            {techArray.slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-xs font-medium truncate max-w-24 sm:max-w-28 md:max-w-none"
              >
                {tech}
              </span>
            ))}
            {techArray.length > 3 && (
              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-xs font-medium">
                +{techArray.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* --- Footer (Bütçe ve Tarih) --- */}
      <div className="flex justify-between items-center text-xs text-blue-200 mt-4 pt-3 border-t border-blue-700/40">
        <div className="flex flex-wrap items-center gap-2">
          {request.budgetRange && (
            <span className="flex items-center whitespace-nowrap text-sm text-yellow-300 font-semibold">
              💰 {request.budgetRange}
            </span>
          )}
          <span className="flex items-center whitespace-nowrap text-blue-200">
            📅 {new Date(request.createdAt).toLocaleDateString('tr-TR')}
          </span>
        </div>

        {request.status === 'pending' && (
          <div className="flex items-center space-x-1 text-blue-300 text-sm">
            <MdEdit className="w-3 h-3" />
            <span className="font-medium">Düzenlenebilir</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeveloperRequestCard;