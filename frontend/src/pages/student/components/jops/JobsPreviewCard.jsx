// pages/student/components/Jobs/JobsPreviewCard.jsx
import React, { useState } from 'react';
import { MdWork, MdArrowForward, MdAccessTime } from 'react-icons/md';
import JobDetailModal from './JobDetailModal';

const JobsPreviewCard = ({ jobs, onOpenPanel }) => {
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isJobDetailOpen, setIsJobDetailOpen] = useState(false);

  // Sadece devam eden işleri filtrele ve en fazla 3 tanesini göster
  const activeJobs = jobs
    .filter(job => job.status === 'in_progress')
    .slice(0, 3);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short'
    });
  };

  const calculateDaysLeft = (dueDate) => {
    if (!dueDate) return null;
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleJobClick = (jobId) => {
    setSelectedJobId(jobId);
    setIsJobDetailOpen(true);
  };

  const handleCloseJobDetail = () => {
    setIsJobDetailOpen(false);
    setSelectedJobId(null);
  };

  return (
    <>
      <div className="bg-blue-800/30 backdrop-blur-xl rounded-xl p-6 border border-blue-700/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600/30 rounded-lg border border-blue-600/50">
              <MdWork className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Devam Eden İşler</h2>
              <p className="text-sm text-blue-200">Aktif projeleriniz</p>
            </div>
          </div>
          
          <button
            onClick={onOpenPanel}
            className="text-blue-300 hover:text-blue-200 text-sm font-medium flex items-center group"
          >
            Tümünü Gör
            <MdArrowForward className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        {activeJobs.length === 0 ? (
          <div className="text-center py-8">
            <div className="p-4 bg-blue-700/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center border border-blue-600/30">
              <MdWork className="w-8 h-8 text-blue-300" />
            </div>
            <p className="text-blue-300 text-sm">
              Şu anda devam eden işiniz bulunmuyor.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeJobs.map(job => {
              const daysLeft = calculateDaysLeft(job.dueDate);
              
              return (
                <div 
                  key={job.id} 
                  className="bg-blue-700/30 rounded-lg p-4 border border-blue-600/30 hover:border-blue-500/50 transition-colors cursor-pointer"
                  onClick={() => handleJobClick(job.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-white text-sm line-clamp-1">
                      {job.title}
                    </h3>
                    {daysLeft !== null && (
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        daysLeft > 3 
                          ? 'bg-green-500/20 text-green-400' 
                          : daysLeft > 0 
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                      }`}>
                        {daysLeft > 0 ? `${daysLeft} gün` : 'Süre doldu'}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-blue-200 mb-2">
                    {job.EmployerProfile?.companyName || "İşveren"}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-blue-300">
                    <div className="flex items-center">
                      <MdAccessTime className="w-3 h-3 mr-1" />
                      <span>Teslim: {formatDate(job.dueDate)}</span>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJobClick(job.id);
                      }}
                      className="text-blue-300 hover:text-blue-200 font-medium"
                    >
                      Detay
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Job Detail Modal */}
      <JobDetailModal 
        isOpen={isJobDetailOpen}
        onClose={handleCloseJobDetail}
        jobId={selectedJobId}
      />
    </>
  );
};

export default JobsPreviewCard;