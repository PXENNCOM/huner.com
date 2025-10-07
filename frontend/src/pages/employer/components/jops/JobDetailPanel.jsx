// pages/student/components/Jobs/JobDetailPanel.jsx
import React, { useState, useEffect } from 'react';
import { getJobDetail } from '../../../../services/api';
import JobStatusBadge from './JobStatusBadge';
import TimelineItem from './TimelineItem';
import { MdClose, MdBusiness, MdCalendarToday, MdLocationOn, MdEmail, MdPhone, MdPerson, MdArrowBack } from 'react-icons/md';

const JobDetailPanel = ({ isOpen, onClose, jobId }) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && jobId) {
      fetchJobDetail();
    }
  }, [isOpen, jobId]);

  const fetchJobDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching job detail for jobId:', jobId);
      const response = await getJobDetail(jobId);
      console.log('Job detail response:', response);
      setJob(response.data || response); // API'ye göre response yapısını kontrol et
    } catch (err) {
      console.error('Error fetching job details:', err);
      setError('İş detayları yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Belirtilmemiş';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-2xl border-l border-gray-700/50">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50 bg-gray-800/50 backdrop-blur-xl">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200 mr-2"
            >
              <MdArrowBack className="w-5 h-5" />
            </button>
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <MdBusiness className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">İş Detayı</h2>
              <p className="text-sm text-gray-400">Detaylı bilgiler ve zaman çizelgesi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="h-full overflow-y-auto pb-20">
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {error && (
            <div className="p-6 m-6 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
              {error}
            </div>
          )}

          {job && (
            <div className="p-6 space-y-6">
              {/* Job Header */}
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white mb-2">{job.title}</h1>
                    <div className="flex items-center text-gray-400">
                      <MdBusiness className="w-4 h-4 mr-2" />
                      <span>{job.EmployerProfile?.companyName || "İşveren"}</span>
                    </div>
                  </div>
                  <JobStatusBadge status={job.status} />
                </div>

                {/* Job Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-300">
                    <MdCalendarToday className="w-4 h-4 mr-3 text-blue-400" />
                    <div>
                      <div className="font-medium">Başlangıç Tarihi</div>
                      <div className="text-sm text-gray-400">{formatDate(job.startDate)}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <MdCalendarToday className="w-4 h-4 mr-3 text-green-400" />
                    <div>
                      <div className="font-medium">Teslim Tarihi</div>
                      <div className="text-sm text-gray-400">{formatDate(job.dueDate)}</div>
                    </div>
                  </div>
                </div>

                {/* Time Info */}
                {job.timeInfo && (
                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="text-blue-300 text-sm font-medium">{job.timeInfo}</div>
                  </div>
                )}
              </div>

              {/* Job Description */}
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-3">İş Açıklaması</h3>
                <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {job.description || "Açıklama bulunmuyor."}
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Zaman Çizelgesi</h3>
                <div className="space-y-4">
                  <TimelineItem 
                    title="İş Oluşturuldu" 
                    date={formatDate(job.createdAt)} 
                    status="completed" 
                  />
                  
                  <TimelineItem 
                    title="İş Onaylandı" 
                    date={formatDate(job.updatedAt)} 
                    description="Admin tarafından onaylandı" 
                    status="completed" 
                  />
                  
                  <TimelineItem 
                    title="Size Atandı" 
                    date={formatDate(job.startDate)} 
                    status="completed" 
                  />
                  
                  <TimelineItem 
                    title="Devam Ediyor" 
                    description={job.timeInfo}
                    status={job.status === 'in_progress' ? 'active' : 'completed'} 
                  />
                  
                  <TimelineItem 
                    title="Teslim Tarihi" 
                    date={formatDate(job.dueDate)} 
                    status={job.status === 'completed' ? 'completed' : 'pending'} 
                  />
                  
                  {job.status === 'completed' && (
                    <TimelineItem 
                      title="Tamamlandı" 
                      date={formatDate(job.completedDate)} 
                      status="completed" 
                    />
                  )}
                  
                  {job.status === 'cancelled' && (
                    <TimelineItem 
                      title="İptal Edildi" 
                      date={formatDate(job.updatedAt)} 
                      description={job.notes} 
                      status="cancelled" 
                    />
                  )}
                </div>
              </div>

              {/* Progress Notes */}
              {job.progressNotes && (
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-semibold text-white mb-3">İlerleme Notları</h3>
                  <div className="text-gray-300 whitespace-pre-line">
                    {job.progressNotes}
                  </div>
                </div>
              )}

              {/* Employer Info */}
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">İşveren Bilgileri</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-300">
                    <MdBusiness className="w-4 h-4 mr-3 text-blue-400" />
                    <div>
                      <div className="font-medium">Şirket</div>
                      <div className="text-sm text-gray-400">{job.EmployerProfile?.companyName || "Belirtilmemiş"}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-300">
                    <MdPerson className="w-4 h-4 mr-3 text-green-400" />
                    <div>
                      <div className="font-medium">İletişim</div>
                      <div className="text-sm text-gray-400">{job.EmployerProfile?.fullName || "Belirtilmemiş"}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-300">
                    <MdEmail className="w-4 h-4 mr-3 text-purple-400" />
                    <div>
                      <div className="font-medium">E-posta</div>
                      <div className="text-sm text-gray-400">{job.EmployerProfile?.User?.email || job.EmployerProfile?.email || "Belirtilmemiş"}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-300">
                    <MdPhone className="w-4 h-4 mr-3 text-orange-400" />
                    <div>
                      <div className="font-medium">Telefon</div>
                      <div className="text-sm text-gray-400">{job.EmployerProfile?.phoneNumber || "Belirtilmemiş"}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-300 md:col-span-2">
                    <MdLocationOn className="w-4 h-4 mr-3 text-red-400" />
                    <div>
                      <div className="font-medium">Adres</div>
                      <div className="text-sm text-gray-400">{job.EmployerProfile?.address || job.EmployerProfile?.city || "Belirtilmemiş"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetailPanel;