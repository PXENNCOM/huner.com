// pages/employer/components/Jobs/JobsPreviewCard.jsx
import React, { useState } from 'react';
import { MdWork, MdArrowForward, MdAdd, MdAccessTime } from 'react-icons/md';
import JobDetailModal from './JobDetailModal';
import CreateJobModal from './CreateJobModal';

const JobsPreviewCard = ({ jobs, onOpenPanel, onJobsUpdate }) => {
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isJobDetailOpen, setIsJobDetailOpen] = useState(false);
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);

  // Son 3 iş ilanını göster (son oluşturulanlar önce)
  const recentJobs = jobs
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'text-yellow-400',
      'approved': 'text-green-400',
      'assigned': 'text-blue-400',
      'in_progress': 'text-indigo-400',
      'completed': 'text-teal-400',
      'cancelled': 'text-red-400'
    };
    return colors[status] || 'text-gray-400';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'Onay Bekliyor',
      'approved': 'Onaylandı',
      'assigned': 'Atandı',
      'in_progress': 'Devam Ediyor',
      'completed': 'Tamamlandı',
      'cancelled': 'İptal Edildi'
    };
    return labels[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short'
    });
  };

  const handleJobClick = (jobId) => {
    setSelectedJobId(jobId);
    setIsJobDetailOpen(true);
  };

  const handleCloseJobDetail = () => {
    setIsJobDetailOpen(false);
    setSelectedJobId(null);
  };

  const handleCreateJobSuccess = () => {
    setIsCreateJobOpen(false);
    if (onJobsUpdate) {
      onJobsUpdate(); // Parent component'in jobs listesini yenilemesi için
    }
  };

  return (
    <>
      <div className="bg-blue-700/30 backdrop-blur-xl rounded-xl p-6 border border-blue-600/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <MdWork className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">İş İlanları</h2>
              <p className="text-sm text-blue-200">Son ilanlarınız</p>
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

        {/* Create Job Button */}
        <div className="mb-4">
          <button
            onClick={() => setIsCreateJobOpen(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            <MdAdd className="w-4 h-4 mr-2" />
            Yeni İlan Oluştur
          </button>
        </div>
        
        {recentJobs.length === 0 ? (
          <div className="text-center py-8">
            <div className="p-4 bg-blue-600/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MdWork className="w-8 h-8 text-blue-300" />
            </div>
            <p className="text-blue-200 text-sm mb-4">
              Henüz iş ilanınız bulunmuyor.
            </p>
            <button
              onClick={() => setIsCreateJobOpen(true)}
              className="text-blue-300 hover:text-blue-200 text-sm font-medium"
            >
              İlk ilanınızı oluşturun
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {recentJobs.map(job => (
              <div 
                key={job.id} 
                className="bg-blue-600/30 rounded-lg p-4 border border-blue-500/30 hover:border-blue-400/50 transition-colors cursor-pointer"
                onClick={() => handleJobClick(job.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-white text-sm line-clamp-1">
                      {job.title}
                    </h3>
                    <p className="text-blue-200 text-xs line-clamp-2 mt-1">
                      {job.description?.substring(0, 60)}
                      {job.description?.length > 60 ? '...' : ''}
                    </p>
                  </div>
                  <div className={`text-xs font-medium ${getStatusColor(job.status)}`}>
                    {getStatusLabel(job.status)}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-blue-300">
                  <div className="flex items-center">
                    <MdAccessTime className="w-3 h-3 mr-1" />
                    <span>{formatDate(job.createdAt)}</span>
                  </div>
                  
                  {job.assignedStudentName && (
                    <div className="text-blue-200">
                      Atandı: {job.assignedStudentName}
                    </div>
                  )}
                  
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
            ))}
          </div>
        )}

        {/* Quick Stats */}
        {jobs.length > 0 && (
          <div className="mt-4 pt-4 border-t border-blue-600/30">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-600/30 rounded-lg p-2">
                <div className="text-sm font-bold text-yellow-400">
                  {jobs.filter(j => j.status === 'pending').length}
                </div>
                <div className="text-xs text-blue-200">Onay Bekliyor</div>
              </div>
              <div className="bg-blue-600/30 rounded-lg p-2">
                <div className="text-sm font-bold text-blue-400">
                  {jobs.filter(j => j.status === 'in_progress').length}
                </div>
                <div className="text-xs text-blue-200">Devam Ediyor</div>
              </div>
              <div className="bg-blue-600/30 rounded-lg p-2">
                <div className="text-sm font-bold text-teal-400">
                  {jobs.filter(j => j.status === 'completed').length}
                </div>
                <div className="text-xs text-blue-200">Tamamlandı</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Job Detail Modal */}
      <JobDetailModal 
        isOpen={isJobDetailOpen}
        onClose={handleCloseJobDetail}
        jobId={selectedJobId}
      />

      {/* Create Job Modal */}
      <CreateJobModal 
        isOpen={isCreateJobOpen}
        onClose={() => setIsCreateJobOpen(false)}
        onSuccess={handleCreateJobSuccess}
      />
    </>
  );
};

export default JobsPreviewCard;