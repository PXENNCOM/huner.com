import React from 'react';
import {
  MdAssignment,
  MdArrowForward,
  MdWork,
  MdPending,
  MdTimeline,
  MdCheckCircle,
  MdBusiness,
  MdSchedule,
  MdTrendingUp,
  MdStar
} from 'react-icons/md';

const ActiveJobs = ({ jobs, onOpenJobsPanel }) => {
  const getJobStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <MdPending className="w-5 h-5" />;
      case 'in_progress': return <MdTimeline className="w-5 h-5" />;
      case 'completed': return <MdCheckCircle className="w-5 h-5" />;
      default: return <MdAssignment className="w-5 h-5" />;
    }
  };

  const getStatusInfo = (status) => {
    switch(status) {
      case 'pending': 
        return { 
          color: 'text-amber-400', 
          bg: 'bg-amber-900/30', 
          border: 'border-amber-700/50',
          text: 'Beklemede',
          dot: 'bg-amber-400'
        };
      case 'in_progress': 
        return { 
          color: 'text-blue-400', 
          bg: 'bg-blue-900/30', 
          border: 'border-blue-700/50',
          text: 'Devam Ediyor',
          dot: 'bg-blue-400'
        };
      case 'completed': 
        return { 
          color: 'text-emerald-400', 
          bg: 'bg-emerald-900/30', 
          border: 'border-emerald-700/50',
          text: 'Tamamlandı',
          dot: 'bg-emerald-400'
        };
      default: 
        return { 
          color: 'text-gray-400', 
          bg: 'bg-gray-800/30', 
          border: 'border-gray-700/50',
          text: 'Bilinmiyor',
          dot: 'bg-gray-400'
        };
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 lg:p-8 shadow-lg shadow-black/20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/30">
            <MdWork className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Aktif İşlerim</h2>
            <p className="text-sm text-blue-400 font-medium">{jobs.length} aktif iş</p>
          </div>
        </div>
        <button 
          onClick={onOpenJobsPanel}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transform hover:-translate-y-0.5"
        >
          <span>Tümünü Gör</span>
          <MdArrowForward className="w-4 h-4" />
        </button>
      </div>

      {jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map((job, index) => {
            const statusInfo = getStatusInfo(job.status);
            return (
              <div 
                key={job.id} 
                className="group bg-gray-800/30 hover:bg-gray-700/50 border border-gray-700/50 hover:border-gray-600/50 rounded-2xl p-5 lg:p-6 transition-all duration-300 hover:shadow-lg hover:shadow-black/30 transform hover:-translate-y-1 backdrop-blur-sm"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Sol Taraf - İş Bilgileri */}
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`p-3 rounded-xl ${statusInfo.bg} ${statusInfo.border} border`}>
                      <div className={statusInfo.color}>
                        {getJobStatusIcon(job.status)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-bold text-white text-lg group-hover:text-blue-300 transition-colors">
                          {job.title}
                        </h3>
                        <div className={`w-2 h-2 rounded-full ${statusInfo.dot} animate-pulse`}></div>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-300 mb-3">
                        <MdBusiness className="w-4 h-4 text-blue-400" />
                        <span className="font-medium">
                          {job.EmployerProfile?.companyName || job.EmployerProfile?.fullName}
                        </span>
                      </div>

                      {/* Ek Bilgiler */}
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        {job.timeInfo && (
                          <div className="flex items-center space-x-1 text-gray-400">
                            <MdSchedule className="w-4 h-4" />
                            <span>{job.timeInfo}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sağ Taraf - Durum ve Aksiyon */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3">
                    <div className="flex flex-col items-start lg:items-end space-y-2">
                      <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border} border shadow-sm`}>
                        {job.statusDescription || statusInfo.text}
                      </span>
                      
                      {job.status === 'in_progress' && (
                        <div className="w-24 lg:w-32">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>İlerleme</span>
                            <span>75%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
                          </div>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={onOpenJobsPanel}
                      className="bg-blue-900/50 hover:bg-blue-800/50 text-blue-300 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 group/btn border border-blue-700/30"
                    >
                      <span>Detay</span>
                      <MdArrowForward className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-black/20">
              <MdWork className="w-12 h-12 text-blue-400" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
              <MdTrendingUp className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-3">
            Henüz atanmış işiniz bulunmuyor
          </h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Yeteneklerinizi sergileyebileceğiniz harika iş fırsatları sizi bekliyor. 
            Hemen keşfetmeye başlayın!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onOpenJobsPanel}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transform hover:-translate-y-1"
            >
              <MdWork className="w-5 h-5" />
              <span>İş Fırsatlarını Keşfet</span>
            </button>
            
            <button 
              onClick={() => {/* Profil paneli açma fonksiyonu buraya */}}
              className="bg-gray-700/50 hover:bg-gray-600/50 text-blue-300 border-2 border-blue-700/50 hover:border-blue-600/50 px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all duration-300 backdrop-blur-sm"
            >
              <MdStar className="w-5 h-5" />
              <span>Profilimi Geliştir</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveJobs;