// pages/student/components/JobCard.jsx
import React from 'react';

const JobCard = ({ job, onViewDetails }) => {
  // Duruma göre renkler
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    approved: 'bg-blue-100 text-blue-800 border-blue-200',
    in_progress: 'bg-green-100 text-green-800 border-green-200',
    completed: 'bg-teal-100 text-teal-800 border-teal-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200'
  };
  
  // Durum etiketleri
  const statusLabels = {
    pending: 'Beklemede',
    approved: 'Onaylandı',
    in_progress: 'Devam Ediyor',
    completed: 'Tamamlandı',
    cancelled: 'İptal Edildi'
  };

  // Tarihleri formatla
  const formatDate = (dateString) => {
    if (!dateString) return 'Belirtilmemiş';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow overflow-hidden border-l-4 ${
        statusColors[job.status]?.split(' ')[2] || 'border-gray-200'
      } cursor-pointer hover:shadow-md transition-shadow`}
      onClick={onViewDetails}
    >
      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {job.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {job.EmployerProfile?.companyName || 'İşveren Şirket'}
            </p>
          </div>
          
          <div className={`mt-2 sm:mt-0 px-3 py-1 rounded-full self-start ${
            statusColors[job.status] || 'bg-gray-100 text-gray-800'
          }`}>
            {statusLabels[job.status] || job.status}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Başlangıç:</span>{' '}
            <span className="font-medium">{formatDate(job.startDate)}</span>
          </div>
          
          <div>
            <span className="text-gray-500">Teslim Tarihi:</span>{' '}
            <span className="font-medium">{formatDate(job.dueDate)}</span>
          </div>
        </div>
        
        {job.timeInfo && (
          <div className="mt-3 text-sm font-medium text-blue-500">
            {job.timeInfo}
          </div>
        )}
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center"
          >
            Detayları Görüntüle
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;