// pages/employer/components/Jobs/JobDetailModal.jsx
import React, { useState, useEffect } from 'react';
import { getEmployerJobs, getStudentDetails } from '../../../../services/employerApi';
import { MdClose, MdWork, MdAccessTime, MdPerson, MdImage, MdSchool, MdEmail, MdPhone, MdLocationOn, MdCalendarToday, MdEdit, MdDelete } from 'react-icons/md';

const JobDetailModal = ({ isOpen, onClose, jobId }) => {
  const [job, setJob] = useState(null);
  const [assignedStudent, setAssignedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mediaExpanded, setMediaExpanded] = useState(false);

  useEffect(() => {
    if (isOpen && jobId) {
      fetchJobDetails();
    }
  }, [isOpen, jobId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // İş ilanını getir
      const response = await getEmployerJobs();
      const jobData = response.data.find(j => j.id.toString() === jobId.toString());
      
      if (!jobData) {
        setError('İş ilanı bulunamadı.');
        setLoading(false);
        return;
      }
      
      setJob(jobData);
      
      // Eğer bir öğrenci atanmışsa, öğrenci detaylarını getir
      if (jobData.assignedTo) {
        try {
          const studentResponse = await getStudentDetails(jobData.assignedTo);
          setAssignedStudent(studentResponse.data);
        } catch (err) {
          console.error('Öğrenci bilgileri alınırken hata:', err);
          setAssignedStudent(null);
        }
      }
      
    } catch (error) {
      console.error('İş ilanı detayları yüklenirken hata:', error);
      setError('İş ilanı detayları yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'Onay Bekliyor', icon: '⏳' },
      approved: { color: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'Onaylandı', icon: '✅' },
      assigned: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'Atandı', icon: '👤' },
      in_progress: { color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30', label: 'Devam Ediyor', icon: '🔄' },
      completed: { color: 'bg-teal-500/20 text-teal-400 border-teal-500/30', label: 'Tamamlandı', icon: '🎉' },
      cancelled: { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'İptal Edildi', icon: '❌' }
    };

    const statusInfo = statusMap[status] || { 
      color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', 
      label: status,
      icon: '❓'
    };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color}`}>
        <span className="mr-2">{statusInfo.icon}</span>
        {statusInfo.label}
      </span>
    );
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

  const formatShortDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short'
    });
  };

  const renderMedia = () => {
    if (!job?.media) return null;
    
    try {
      let mediaArray = [];
      if (typeof job.media === 'string') {
        mediaArray = JSON.parse(job.media);
      } else if (Array.isArray(job.media)) {
        mediaArray = job.media;
      }
      
      if (!mediaArray || mediaArray.length === 0) return null;
      
      const displayMediaArray = mediaExpanded ? mediaArray : mediaArray.slice(0, 6);
      
      return (
        <div className="bg-blue-700/30 rounded-xl p-6 border border-blue-600/30">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <MdImage className="w-5 h-5 mr-2 text-blue-300" />
            İlan Görselleri
            <span className="ml-2 text-sm text-blue-300">({mediaArray.length})</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {displayMediaArray.map((media, index) => (
              <div key={index} className="relative group">
                <img 
                  src={media.startsWith('/') ? `/uploads/job-media/${media.slice(1)}` : `/uploads/job-media/${media}`} 
                  alt={`İlan görseli ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x200?text=Görüntülenemiyor';
                  }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">Görüntüle</span>
                </div>
              </div>
            ))}
          </div>
          
          {mediaArray.length > 6 && (
            <button
              onClick={() => setMediaExpanded(!mediaExpanded)}
              className="text-blue-300 hover:text-blue-200 text-sm font-medium transition-colors"
            >
              {mediaExpanded ? 'Daha az göster' : `${mediaArray.length - 6} görsel daha göster`}
            </button>
          )}
        </div>
      );
    } catch (err) {
      console.error('Media parse hatası:', err);
      return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="absolute inset-4 md:inset-8 lg:inset-16 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 rounded-2xl shadow-2xl border border-blue-700/50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-blue-700/50 bg-blue-800/50 backdrop-blur-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <MdWork className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">İş İlanı Detayı</h2>
              <p className="text-sm text-blue-200">Detaylı bilgiler ve durum takibi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-blue-200 hover:text-white hover:bg-blue-700/50 rounded-lg transition-all duration-200"
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="h-full overflow-y-auto pb-20">
          {loading && (
            <div className="flex flex-col justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-blue-200">İş ilanı detayları yükleniyor...</p>
            </div>
          )}

          {error && (
            <div className="p-6 m-6 bg-red-500/20 border border-red-500/30 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">❌</span>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Hata Oluştu</h3>
                  <p className="text-red-300">{error}</p>
                </div>
              </div>
            </div>
          )}

          {job && (
            <div className="p-6 space-y-6">
              {/* Job Header */}
              <div className="bg-blue-700/30 rounded-xl p-6 border border-blue-600/30">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white mb-3">{job.title}</h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-blue-200">
                        <MdAccessTime className="w-4 h-4 mr-2 text-blue-300" />
                        <div>
                          <div className="text-sm">Oluşturulma Tarihi</div>
                          <div className="font-medium">{formatDate(job.createdAt)}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-blue-200">
                        <MdCalendarToday className="w-4 h-4 mr-2 text-blue-300" />
                        <div>
                          <div className="text-sm">Son Güncelleme</div>
                          <div className="font-medium">{formatDate(job.updatedAt)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:ml-8 mt-4 lg:mt-0">
                    <div className="bg-blue-600/30 rounded-lg p-4 text-center">
                      <div className="mb-3">
                        {getStatusBadge(job.status)}
                      </div>
                      <div className="text-sm text-blue-200">İlan ID: #{job.id}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="bg-blue-700/30 rounded-xl p-6 border border-blue-600/30">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <span className="mr-2">📋</span>
                  İlan Açıklaması
                </h3>
                <div className="bg-blue-600/20 rounded-lg p-4">
                  <div className="text-blue-100 whitespace-pre-line leading-relaxed">
                    {job.description}
                  </div>
                </div>
              </div>

              {/* Media Gallery */}
              {renderMedia()}

              {/* Assigned Student */}
              {job.assignedTo && (
                <div className="bg-blue-700/30 rounded-xl p-6 border border-blue-600/30">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <MdPerson className="w-5 h-5 mr-2 text-blue-300" />
                    Atanan Öğrenci
                  </h3>
                  
                  {assignedStudent ? (
                    <div className="bg-blue-600/30 rounded-lg p-6">
                      {/* Student Profile */}
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-blue-500/20 flex-shrink-0">
                          {assignedStudent.profileImage ? (
                            <img 
                              src={`/uploads/profile-images/${assignedStudent.profileImage}`} 
                              alt={assignedStudent.fullName} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/150?text=' + (assignedStudent.fullName?.charAt(0)?.toUpperCase() || 'Ö');
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-blue-300 text-2xl font-bold">
                              {assignedStudent.fullName?.charAt(0)?.toUpperCase() || 'Ö'}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-semibold text-white text-xl mb-2">
                            {assignedStudent.fullName || 'İsimsiz Öğrenci'}
                          </h4>
                          
                          {assignedStudent.school && (
                            <div className="flex items-center text-blue-200 mb-2">
                              <MdSchool className="w-4 h-4 mr-2" />
                              <span>
                                {assignedStudent.school}
                                {assignedStudent.department && `, ${assignedStudent.department}`}
                              </span>
                            </div>
                          )}
                          
                          {assignedStudent.city && (
                            <div className="flex items-center text-blue-200">
                              <MdLocationOn className="w-4 h-4 mr-2" />
                              <span>{assignedStudent.city}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Student Contact */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {assignedStudent.User?.email && (
                          <div className="bg-blue-500/20 rounded-lg p-3">
                            <div className="flex items-center text-blue-200 mb-1">
                              <MdEmail className="w-4 h-4 mr-2" />
                              <span className="text-sm font-medium">E-posta</span>
                            </div>
                            <div className="text-white font-medium">{assignedStudent.User.email}</div>
                          </div>
                        )}
                        
                        {assignedStudent.phoneNumber && (
                          <div className="bg-blue-500/20 rounded-lg p-3">
                            <div className="flex items-center text-blue-200 mb-1">
                              <MdPhone className="w-4 h-4 mr-2" />
                              <span className="text-sm font-medium">Telefon</span>
                            </div>
                            <div className="text-white font-medium">{assignedStudent.phoneNumber}</div>
                          </div>
                        )}
                      </div>
                      
                      {/* Project Timeline */}
                      {(job.startDate || job.dueDate) && (
                        <div className="border-t border-blue-500/30 pt-4">
                          <h5 className="text-white font-medium mb-3">Proje Takvimi</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {job.startDate && (
                              <div className="bg-blue-500/20 rounded-lg p-3">
                                <div className="text-blue-200 text-sm mb-1">Başlangıç Tarihi</div>
                                <div className="text-white font-medium">{formatDate(job.startDate)}</div>
                              </div>
                            )}
                            {job.dueDate && (
                              <div className="bg-blue-500/20 rounded-lg p-3">
                                <div className="text-blue-200 text-sm mb-1">Teslim Tarihi</div>
                                <div className="text-white font-medium">{formatDate(job.dueDate)}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-blue-600/30 rounded-lg p-6 text-center">
                      <div className="text-blue-200 mb-2">
                        <MdPerson className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      </div>
                      <div className="text-blue-200">Öğrenci bilgileri yüklenemedi</div>
                      <div className="text-blue-300 text-sm mt-1">Öğrenci ID: {job.assignedTo}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Progress Notes */}
              {job.progressNotes && (
                <div className="bg-blue-700/30 rounded-xl p-6 border border-blue-600/30">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <span className="mr-2">📝</span>
                    İlerleme Notları
                  </h3>
                  <div className="bg-blue-600/30 rounded-lg p-4">
                    <div className="text-blue-100 whitespace-pre-line leading-relaxed">
                      {job.progressNotes}
                    </div>
                  </div>
                </div>
              )}

              {/* Job Actions */}
              <div className="bg-blue-700/30 rounded-xl p-6 border border-blue-600/30">
                <h3 className="text-lg font-semibold text-white mb-4">İşlemler</h3>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={onClose}
                    className="flex-1 min-w-[120px] bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <MdClose className="w-4 h-4 mr-2" />
                    Kapat
                  </button>
                  
                  {job.status === 'pending' && (
                    <button className="flex-1 min-w-[120px] bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center">
                      <MdEdit className="w-4 h-4 mr-2" />
                      Düzenle
                    </button>
                  )}
                  
                  {['pending', 'approved'].includes(job.status) && (
                    <button className="flex-1 min-w-[120px] bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center">
                      <MdDelete className="w-4 h-4 mr-2" />
                      İptal Et
                    </button>
                  )}
                </div>
                
                <div className="mt-4 p-3 bg-blue-600/20 rounded-lg">
                  <p className="text-blue-200 text-sm">
                    <strong>Durum Açıklaması:</strong> 
                    {job.status === 'pending' && ' İlanınız admin onayı bekliyor.'}
                    {job.status === 'approved' && ' İlanınız onaylandı ve öğrenci ataması bekleniyor.'}
                    {job.status === 'assigned' && ' İlanınıza bir öğrenci atandı.'}
                    {job.status === 'in_progress' && ' Proje devam ediyor.'}
                    {job.status === 'completed' && ' Proje başarıyla tamamlandı.'}
                    {job.status === 'cancelled' && ' İlan iptal edildi.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;