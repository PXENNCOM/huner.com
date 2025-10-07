// pages/employer/components/Jobs/JobCard.jsx
import React from 'react';
import { MdWork, MdArrowForward, MdAccessTime, MdPerson } from 'react-icons/md';

const JobCard = ({ job, onViewDetails, compact = false }) => {
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'Onay Bekliyor' },
      approved: { color: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'Onaylandı' },
      assigned: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'Atandı' },
      in_progress: { color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30', label: 'Devam Ediyor' },
      completed: { color: 'bg-teal-500/20 text-teal-400 border-teal-500/30', label: 'Tamamlandı' },
      cancelled: { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'İptal Edildi' }
    };

    const statusInfo = statusMap[status] || { 
      color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', 
      label: status 
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Tarih yok';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (compact) {
    return (
      <div 
        className="bg-blue-700/30 backdrop-blur-xl rounded-xl p-4 border border-blue-600/50 hover:border-blue-500/50 cursor-pointer transition-all duration-200 hover:bg-blue-700/40"
        onClick={onViewDetails}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-white font-medium text-sm mb-1 line-clamp-2">
              {job.title}
            </h3>
            <p className="text-blue-200 text-xs line-clamp-2">
              {job.description?.substring(0, 80)}
              {job.description?.length > 80 ? '...' : ''}
            </p>
          </div>
          {getStatusBadge(job.status)}
        </div>

        {/* Info */}
        <div className="flex items-center justify-between text-xs text-blue-200 mb-3">
          <div className="flex items-center">
            <MdAccessTime className="w-3 h-3 mr-1" />
            <span>{formatDate(job.createdAt)}</span>
          </div>
          {job.assignedTo && (
            <div className="flex items-center">
              <MdPerson className="w-3 h-3 mr-1" />
              <span>Atandı</span>
            </div>
          )}
        </div>

        {/* Assigned Student */}
        {job.assignedStudentName && (
          <div className="bg-blue-600/30 rounded-lg p-2 mb-3">
            <div className="text-xs text-blue-200">Atanan Öğrenci:</div>
            <div className="text-sm font-medium text-white">{job.assignedStudentName}</div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            className="text-blue-300 hover:text-blue-200 text-xs font-medium flex items-center group"
          >
            Detayları Gör
            <MdArrowForward className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  // Normal (non-compact) view
  return (
    <div 
      className="bg-white rounded-lg shadow-lg overflow-hidden border-l-4 border-blue-500 cursor-pointer hover:shadow-xl transition-shadow duration-300"
      onClick={onViewDetails}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {job.title}
            </h3>
            <p className="text-gray-600 line-clamp-3">
              {job.description}
            </p>
          </div>
          <div className="ml-4">
            {getStatusBadge(job.status)}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <MdAccessTime className="w-4 h-4 mr-2" />
            <span>Oluşturulma: {formatDate(job.createdAt)}</span>
          </div>
          {job.assignedTo && (
            <div className="flex items-center text-blue-600">
              <MdPerson className="w-4 h-4 mr-2" />
              <span>{job.assignedStudentName || 'Öğrenci Atandı'}</span>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
          >
            Detayları Görüntüle
            <MdArrowForward className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;