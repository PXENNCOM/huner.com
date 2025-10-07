// pages/employer/components/DeveloperRequests/DeveloperRequestsPreviewCard.jsx
import React, { useState, useEffect } from 'react';
import { getDeveloperRequests } from '../../../../services/employerApi';
import { MdCode, MdArrowForward, MdAdd, MdTrendingUp, MdSchedule } from 'react-icons/md';

const DeveloperRequestsPreviewCard = ({ onOpenPanel }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewing: 0,
    viewed: 0
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await getDeveloperRequests();
      const requestList = response.data.requests || [];
      setRequests(requestList);
      
      // İstatistikleri hesapla
      setStats({
        total: requestList.length,
        pending: requestList.filter(r => r.status === 'pending').length,
        reviewing: requestList.filter(r => r.status === 'reviewing').length,
        viewed: requestList.filter(r => r.status === 'viewed').length
      });
    } catch (error) {
      console.error('Talepler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  // Status badge - Daha kompakt, sadece ikon ve kısa etiket
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', label: 'Yeni', icon: '🆕' },
      reviewing: { color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', label: 'İnceleme', icon: '👀' },
      viewed: { color: 'bg-green-500/20 text-green-300 border-green-500/30', label: 'Görülmüş', icon: '✅' },
      archived: { color: 'bg-gray-500/20 text-gray-300 border-gray-500/30', label: 'Arşiv', icon: '📁' }
    };

    const statusInfo = statusMap[status] || { color: 'bg-gray-500/20 text-gray-300 border-gray-500/30', label: status, icon: '❓' };
    
    return (
      <div className={`px-1.5 py-0.5 rounded-md text-xs font-medium border flex items-center space-x-1 whitespace-nowrap ${statusInfo.color}`}>
        <span>{statusInfo.icon}</span>
        <span className="hidden sm:inline">{statusInfo.label}</span> {/* Küçük ekranda etiketi gizle */}
      </div>
    );
  };

  const getExperienceLabel = (level) => {
    const labels = {
      intern: 'Stajyer',
      junior: 'Jr', // Daha kısa
      mid: 'Mid',    // Daha kısa
      senior: 'Sr'    // Daha kısa
    };
    return labels[level] || level;
  };

  const getPriorityLabel = (priority) => {
    const priorities = {
      high: { label: 'Yüksek', icon: '⚠️', color: 'text-orange-300' },
      urgent: { label: 'Acil', icon: '🚨', color: 'text-red-300' },
      normal: { label: 'Normal', icon: '📋', color: 'text-blue-300' }
    };
    return priorities[priority] || priorities.normal;
  };

  if (loading) {
    // Mobil öncelikli yüklenme göstergesi (daha kompakt)
    return (
      <div className="bg-blue-800/30 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-blue-700/30 h-64 flex flex-col justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-5 bg-blue-700/50 rounded w-3/4"></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-12 bg-blue-700/30 rounded-lg"></div>
            <div className="h-12 bg-blue-700/30 rounded-lg"></div>
          </div>
          <div className="h-16 bg-blue-700/30 rounded-lg"></div>
          <div className="h-16 bg-blue-700/30 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-800/30 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-blue-700/30 w-full overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-5 space-x-2">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30 flex-shrink-0">
            <MdCode className="w-5 h-5 text-blue-300" />
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <h2 className="text-base font-bold text-white truncate">Talep Yönetimi</h2>
            <p className="text-xs text-blue-200 truncate hidden sm:block">Talep durumlarınızın özeti</p>
          </div>
        </div>
        
        <button
          onClick={onOpenPanel}
          className="text-blue-300 hover:text-blue-200 text-xs font-medium flex items-center group flex-shrink-0"
          aria-label="Tüm talepleri gör"
        >
          <span className="hidden sm:inline whitespace-nowrap">Tümünü Gör</span>
          <MdArrowForward className="w-4 h-4 ml-0 sm:ml-1 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {requests.length === 0 ? (
        // Boş Durum
        <div className="text-center py-4 border-t border-blue-700/40">
          <div className="p-3 bg-blue-700/30 rounded-xl w-12 h-12 mx-auto mb-3 flex items-center justify-center border border-blue-600/30">
            <MdAdd className="w-6 h-6 text-blue-300" />
          </div>
          <h3 className="text-sm font-semibold text-white mb-2">Henüz talep yok</h3>
          <p className="text-blue-200 text-xs mb-4 max-w-xs mx-auto">
            İlk yazılımcı talebinizi oluşturun.
          </p>
          <button
            onClick={onOpenPanel}
            className="bg-blue-600/90 hover:bg-blue-600 text-white py-2 px-4 text-sm rounded-lg font-medium transition-all duration-200 flex items-center mx-auto"
          >
            <MdAdd className="w-4 h-4 mr-1" />
            Yeni Talep
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {/* İstatistikler - Daha kompakt */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            
            {/* Toplam */}
            <div className="bg-blue-700/30 rounded-lg p-3 border border-blue-600/30 text-center">
              <div className="text-xl font-bold text-white">{stats.total}</div>
              <div className="text-xs text-blue-200">Toplam</div>
            </div>
            
            {/* Yeni Talep */}
            <div className="bg-blue-700/30 rounded-lg p-3 border border-blue-600/30 text-center">
              <div className="text-xl font-bold text-yellow-300">{stats.pending}</div>
              <div className="text-xs text-blue-200">Yeni</div>
            </div>
            
            {/* İncelemede/Görüntülendi (Tek bir kartta birleştirilebilir veya incelemede gösterilir) */}
            <div className="bg-blue-700/30 rounded-lg p-3 border border-blue-600/30 text-center">
              <div className="text-xl font-bold text-green-300">{stats.viewed + stats.reviewing}</div>
              <div className="text-xs text-blue-200">İşlemde</div>
            </div>
          </div>

          {/* Son Talepler - Daha kompakt satırlar */}
          <div>
            <h3 className="text-xs font-semibold text-blue-200 mb-2">Son Talepler ({requests.length})</h3>
            <div className="space-y-2">
              {requests.slice(0, 3).map((request) => (
                <div
                  key={request.id}
                  className="bg-blue-700/30 rounded-lg p-3 border border-blue-600/30 hover:bg-blue-600/40 transition-all duration-200 cursor-pointer"
                  onClick={onOpenPanel}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-white text-sm truncate max-w-[70%]">
                      {request.projectTitle}
                    </h4>
                    {getStatusBadge(request.status)}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-blue-300">
                    <div className="flex items-center gap-3">
                      <span className="whitespace-nowrap flex-shrink-0">
                        {new Date(request.createdAt).toLocaleDateString('tr-TR')}
                      </span>
                      {request.experienceLevel && (
                        <span className="whitespace-nowrap text-blue-200 flex-shrink-0">
                          {getExperienceLabel(request.experienceLevel)}
                        </span>
                      )}
                    </div>
                    
                    {request.priority && request.priority !== 'normal' && (
                      <span className={`flex items-center whitespace-nowrap ${getPriorityLabel(request.priority).color}`}>
                        {getPriorityLabel(request.priority).icon}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onOpenPanel}
            className="w-full bg-blue-600/90 hover:bg-blue-600 text-white py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center shadow-lg shadow-blue-500/20"
          >
            <MdArrowForward className="w-4 h-4 mr-2" />
            Tüm Talepleri Yönetin
          </button>
        </div>
      )}
    </div>
  );
};

export default DeveloperRequestsPreviewCard;