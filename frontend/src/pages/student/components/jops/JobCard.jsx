// pages/student/components/Jobs/JobCard.jsx
import React from 'react';
import JobStatusBadge from './JobStatusBadge';
import { MdBusiness, MdCalendarToday, MdArrowForward } from 'react-icons/md';

const JobCard = ({ job, onViewDetails, compact = false }) => {
  // Tarihleri formatla
  const formatDate = (dateString) => {
    if (!dateString) return 'Belirtilmemiş';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Kalan zamanı hesapla
  const calculateDaysLeft = (dueDate) => {
    if (!dueDate) return null;
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = calculateDaysLeft(job.dueDate);

  if (compact) {
    return (
      <div 
        className="bg-blue-800/30 backdrop-blur-xl rounded-xl p-4 border border-blue-700/30 hover:border-blue-600/50 cursor-pointer transition-all duration-200 hover:bg-blue-700/40"
        onClick={onViewDetails}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-white font-medium text-sm mb-1 line-clamp-1">
              {job.title}
            </h3>
            <div className="flex items-center text-blue-300 text-xs mb-2">
              <MdBusiness className="w-3 h-3 mr-1" />
              <span className="line-clamp-1">
                {job.EmployerProfile?.companyName || 'İşveren Şirket'}
              </span>
            </div>
          </div>
          <JobStatusBadge status={job.status} compact={true} />
        </div>

        <div className="flex items-center justify-between text-xs text-blue-300">
          <div className="flex items-center">
            <MdCalendarToday className="w-3 h-3 mr-1" />
            <span>Delivery: {formatDate(job.dueDate)}</span>
          </div>
          
          {daysLeft !== null && job.status === 'in_progress' && (
            <div className={`px-2 py-1 rounded-full text-xs ${
              daysLeft > 3 
                ? 'bg-green-500/20 text-green-400' 
                : daysLeft > 0 
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-red-500/20 text-red-400'
            }`}>
              {daysLeft > 0 ? `${daysLeft} gün kaldı` : 'Süre doldu'}
            </div>
          )}
        </div>

        <div className="mt-3 flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            className="text-blue-300 hover:text-blue-200 text-xs font-medium flex items-center group"
          >
            See Details
            <MdArrowForward className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  // Normal (non-compact) view
  return (
    <div 
      className="bg-blue-800/30 backdrop-blur-xl rounded-lg shadow-lg overflow-hidden border-l-4 border-blue-500 cursor-pointer hover:shadow-xl transition-shadow duration-300 border border-blue-700/30"
      onClick={onViewDetails}
    >
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-2">
              {job.title}
            </h3>
            <div className="flex items-center text-blue-200 mb-2">
              <MdBusiness className="w-4 h-4 mr-2" />
              <span>{job.EmployerProfile?.companyName || 'İşveren Şirket'}</span>
            </div>
          </div>
          
          <div className="mt-2 sm:mt-0">
            <JobStatusBadge status={job.status} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
          <div className="flex items-center text-blue-200">
            <MdCalendarToday className="w-4 h-4 mr-2" />
            <span>Beginning: {formatDate(job.startDate)}</span>
          </div>
          
          <div className="flex items-center text-blue-200">
            <MdCalendarToday className="w-4 h-4 mr-2" />
            <span>Delivery: {formatDate(job.dueDate)}</span>
          </div>
        </div>

        {daysLeft !== null && job.status === 'in_progress' && (
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${
            daysLeft > 3 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : daysLeft > 0 
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {daysLeft > 0 ? `${daysLeft} gün kaldı` : 'Süre doldu'}
          </div>
        )}
        
        {job.timeInfo && (
          <div className="mb-4 text-sm text-blue-300 font-medium">
            {job.timeInfo}
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
          >
            View Details
            <MdArrowForward className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;