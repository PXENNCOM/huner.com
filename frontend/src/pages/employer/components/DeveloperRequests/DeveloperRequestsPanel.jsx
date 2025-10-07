// pages/employer/components/DeveloperRequests/DeveloperRequestsPanel.jsx
import React, { useState, useEffect } from 'react';
import { getDeveloperRequests } from '../../../../services/employerApi';
import { 
  MdClose, 
  MdCode, 
  MdAdd,
  MdArrowForward,
  MdFilterList,
  MdAccessTime,
  MdPriorityHigh
} from 'react-icons/md';
import DeveloperRequestCard from './DeveloperRequestCard';
import DeveloperRequestDetailModal from './DeveloperRequestDetailModal';
import CreateDeveloperRequestModal from './CreateDeveloperRequestModal/CreateDeveloperRequestModal';

const DeveloperRequestsPanel = ({ isOpen, onClose }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchRequests();
    }
  }, [isOpen, filter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await getDeveloperRequests(params);
      
      console.log('DeveloperRequestsPanel - API response:', response);
      console.log('DeveloperRequestsPanel - requests data:', response.data.requests);
      
      setRequests(response.data.requests || []);
    } catch (err) {
      console.error('Talepler yüklenirken hata oluştu:', err);
      setError('Talepler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  const handleRequestUpdate = () => {
    fetchRequests(); // Listeyi yenile
  };

  const filterOptions = [
    { value: 'all', label: 'Tümü', count: requests.length },
    { value: 'pending', label: 'Yeni Talepler', count: requests.filter(r => r.status === 'pending').length },
    { value: 'reviewing', label: 'İncelemede', count: requests.filter(r => r.status === 'reviewing').length },
    { value: 'viewed', label: 'Görüntülendi', count: requests.filter(r => r.status === 'viewed').length },
  ];

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop - Desktop only */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm hidden lg:block"
          onClick={onClose}
        />
        
        {/* Panel - Full screen on mobile, sidebar on desktop */}
        <div className="absolute w-full h-full bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 shadow-2xl lg:right-0 lg:top-0 lg:w-full lg:max-w-4xl">
          {/* Header */}
          <div className="flex flex-col justify-between p-4 border-b border-blue-700/50 bg-blue-800/50 backdrop-blur-xl gap-3 md:flex-row md:items-center md:gap-0">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-500/30 flex-shrink-0">
                <MdCode className="w-5 h-5 text-blue-300" />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <h2 className="text-lg font-bold text-white truncate">Yazılımcı Taleplerim</h2>
                <p className="text-sm text-blue-200 truncate md:block">Taleplerinizi görüntüleyin ve yönetin</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between space-x-3 md:justify-end">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex-1 p-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-105 md:flex-none"
              >
                <MdAdd className="w-5 h-5" />
                <span className="text-sm font-medium whitespace-nowrap">Yeni Talep</span>
              </button>
              <button
                onClick={onClose}
                className="p-3 text-blue-200 hover:text-white hover:bg-blue-700/50 rounded-xl transition-all duration-200 flex-shrink-0"
              >
                <MdClose className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="h-full overflow-y-auto pb-20">
            {/* Filters */}
            <div className="p-4 border-b border-blue-700/30">
              <div className="flex items-center space-x-2 mb-4">
                <MdFilterList className="w-4 h-4 text-blue-300" />
                <span className="text-sm font-semibold text-blue-200">Filtreler</span>
              </div>
              <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:gap-3">
                {filterOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setFilter(option.value)}
                    className={`px-3 py-3 rounded-xl text-xs font-medium transition-all duration-200 text-center hover:scale-105 md:py-2 md:text-sm ${
                      filter === option.value
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                        : 'bg-blue-800/30 text-blue-200 hover:bg-blue-700/50 border border-blue-600/30'
                    }`}
                  >
                    <span className="block truncate md:inline">{option.label}</span>
                    <span className="block text-xs opacity-80 md:inline md:ml-1 md:text-sm">({option.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="p-4 m-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
                <div className="flex items-center">
                  <span className="mr-2">❌</span>
                  <span className="break-words">{error}</span>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center p-8">
                <div className="flex flex-col items-center space-y-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  <span className="text-blue-300 text-sm">Yükleniyor...</span>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading && requests.length === 0 && (
              <div className="flex flex-col items-center justify-center p-6 text-center md:p-8">
                <div className="p-4 bg-blue-700/30 rounded-2xl w-16 h-16 mb-6 flex items-center justify-center border border-blue-600/30">
                  <MdCode className="w-8 h-8 text-blue-300" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  {filter === 'all' ? 'Henüz talep yok' : `${filterOptions.find(f => f.value === filter)?.label} yok`}
                </h3>
                <p className="text-blue-200 text-sm mb-6 max-w-sm leading-relaxed">
                  {filter === 'all' 
                    ? 'Henüz hiç yazılımcı talebi oluşturmadınız.' 
                    : `Bu kategoride henüz talep bulunmuyor.`}
                </p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-blue-600/90 hover:bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 hover:scale-105 shadow-lg shadow-blue-500/20"
                >
                  <MdAdd className="w-4 h-4" />
                  <span>İlk Talebinizi Oluşturun</span>
                </button>
              </div>
            )}

            {/* Requests List */}
            {!loading && requests.length > 0 && (
              <div className="p-3 space-y-3 md:p-4 md:space-y-4">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-blue-200 mb-2">
                    {filter === 'all' ? 'Tüm Talepler' : filterOptions.find(f => f.value === filter)?.label}
                    <span className="ml-2 text-blue-400">({requests.length})</span>
                  </h3>
                </div>
                
                <div className="space-y-3 md:space-y-4">
                  {requests.map((request) => (
                    <DeveloperRequestCard
                      key={request.id}
                      request={request}
                      onClick={() => handleRequestClick(request)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <DeveloperRequestDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedRequest(null);
        }}
        request={selectedRequest}
        onUpdate={handleRequestUpdate}
      />

      {/* Create Modal */}
      <CreateDeveloperRequestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleRequestUpdate}
      />
    </>
  );
};

export default DeveloperRequestsPanel;