import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getEmployerJobs, getStudentDetails } from '../../services/employerApi';
import EmployerLayout from './components/EmployerLayout';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [assignedStudent, setAssignedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mediaExpanded, setMediaExpanded] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      
      // Tüm iş ilanlarını getir ve ID'ye göre filtreleme yap
      const response = await getEmployerJobs();
      const jobData = response.data.find(j => j.id.toString() === id);
      
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
          console.error('Öğrenci bilgileri alınırken hata oluştu:', err);
        }
      }
      
      setLoading(false);
    } catch (err) {
      console.error('İş ilanı detayları yüklenirken hata oluştu:', err);
      setError('İş ilanı detayları yüklenirken bir hata oluştu.');
      setLoading(false);
    }
  };

  // İş ilanı durumlarına göre renk ve etiket belirle
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Onay Bekliyor' },
      approved: { color: 'bg-green-100 text-green-800', label: 'Onaylandı' },
      assigned: { color: 'bg-blue-100 text-blue-800', label: 'Atandı' },
      in_progress: { color: 'bg-indigo-100 text-indigo-800', label: 'Devam Ediyor' },
      completed: { color: 'bg-teal-100 text-teal-800', label: 'Tamamlandı' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'İptal Edildi' }
    };

    const statusInfo = statusMap[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
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
      
      // Sadece ilk 3 medyayı göster (eğer medya genişletilmediyse)
      const displayMediaArray = mediaExpanded ? mediaArray : mediaArray.slice(0, 3);
      
      return (
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">İlan Görselleri</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {displayMediaArray.map((media, index) => (
              <div key={index} className="relative">
                <img 
                  src={media.startsWith('/') ? `/uploads/job-media/${media.slice(1)}` : `/uploads/job-media/${media}`} 
                  alt={`İlan görseli ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg shadow-sm"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x200?text=Görüntülenemiyor';
                  }}
                />
              </div>
            ))}
          </div>
          
          {mediaArray.length > 3 && (
            <button
              onClick={() => setMediaExpanded(!mediaExpanded)}
              className="text-blue-500 hover:text-blue-700 text-sm"
            >
              {mediaExpanded ? 'Daha az göster' : `${mediaArray.length - 3} görsel daha göster`}
            </button>
          )}
        </div>
      );
    } catch (err) {
      console.error('Media parse hatası:', err);
      return null;
    }
  };

  if (loading) {
    return (
      <EmployerLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </EmployerLayout>
    );
  }

  if (error) {
    return (
      <EmployerLayout>
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
        <button
          onClick={() => navigate('/employer/jobs')}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          İş İlanları Listesine Dön
        </button>
      </EmployerLayout>
    );
  }

  if (!job) {
    return (
      <EmployerLayout>
        <div className="text-center py-10">
          <p className="text-gray-500">İş ilanı bulunamadı.</p>
        </div>
        <button
          onClick={() => navigate('/employer/jobs')}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          İş İlanları Listesine Dön
        </button>
      </EmployerLayout>
    );
  }

  return (
    <EmployerLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/employer/jobs')}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">İş İlanı Detayı</h1>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* İlan Başlığı ve Durum */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{job.title}</h2>
                <p className="text-gray-500 text-sm">
                  Oluşturulma Tarihi: {new Date(job.createdAt).toLocaleDateString('tr-TR')}
                </p>
              </div>
              
              <div className="mt-4 md:mt-0">
                {getStatusBadge(job.status)}
              </div>
            </div>
          </div>
          
          {/* İlan İçeriği */}
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">İlan Açıklaması</h3>
            <div className="text-gray-700 whitespace-pre-line mb-6">
              {job.description}
            </div>
            
            {/* İlan Görselleri */}
            {renderMedia()}
            
            {/* Atanan Öğrenci Bilgileri */}
            {job.assignedTo && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Atanan Öğrenci</h3>
                
                {assignedStudent ? (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 mr-4">
                        {assignedStudent.profileImage ? (
                          <img 
                            src={`/uploads/profile-images/${assignedStudent.profileImage}`} 
                            alt={assignedStudent.fullName} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/100?text=' + (assignedStudent.fullName?.charAt(0)?.toUpperCase() || 'Ö');
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500 text-xl font-bold">
                            {assignedStudent.fullName?.charAt(0)?.toUpperCase() || 'Ö'}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-800">{assignedStudent.fullName || 'İsimsiz Öğrenci'}</h4>
                        <p className="text-gray-600 text-sm">
                          {assignedStudent.school ? (
                            <>
                              {assignedStudent.school}
                              {assignedStudent.department && `, ${assignedStudent.department}`}
                            </>
                          ) : (
                            <span className="text-gray-400 italic">Okul bilgisi belirtilmemiş</span>
                          )}
                        </p>
                      </div>
                    </div>
                    
                    {job.startDate && (
                      <div className="mt-4 text-sm text-gray-600">
                        <p>Başlangıç Tarihi: {new Date(job.startDate).toLocaleDateString('tr-TR')}</p>
                        {job.dueDate && <p>Bitiş Tarihi: {new Date(job.dueDate).toLocaleDateString('tr-TR')}</p>}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">Öğrenci bilgileri yüklenemedi.</p>
                )}
              </div>
            )}
            
            {/* İlerleme Notları */}
            {job.progressNotes && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-800 mb-3">İlerleme Notları</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="whitespace-pre-line text-gray-700">
                    {job.progressNotes}
                  </div>
                </div>
                </div>
            )}

            {/* Geri Dön Butonu */}
            <div className="mt-8">
              <button
                onClick={() => navigate('/employer/jobs')}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                İş İlanları Listesine Dön
              </button>
            </div>
          </div>
        </div>
      </div>
    </EmployerLayout>
  );
};

export default JobDetail;
              