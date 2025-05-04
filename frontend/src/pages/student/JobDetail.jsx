// pages/student/JobDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobDetail } from '../../services/api';
import StudentLayout from './components/StudentLayout';
import JobStatusBadge from './components/JobStatusBadge';
import TimelineItem from './components/TimelineItem';

const StudentJobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const response = await getJobDetail(id);
        setJob(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError('İş detayları yüklenirken bir hata oluştu.');
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [id]);

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </StudentLayout>
    );
  }

  if (error) {
    return (
      <StudentLayout>
        <div className="bg-red-50 p-4 rounded-md text-red-500">
          {error}
        </div>
      </StudentLayout>
    );
  }

  // Tarih bilgilerini insan dostu formatla
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
    <StudentLayout>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <button 
            onClick={() => navigate('/student/jobs')}
            className="text-gray-500 hover:text-blue-500 mb-4 flex items-center text-sm"
          >
            &larr; İşlere Dön
          </button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">{job.title}</h1>
              <p className="text-gray-600">
                {job.EmployerProfile?.companyName || "İşveren"}
              </p>
            </div>
            <JobStatusBadge status={job.status} />
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-2">İş Açıklaması</h2>
              <div className="bg-gray-50 p-4 rounded-md text-gray-700">
                {job.description || "Açıklama bulunmuyor."}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-2">Zaman Çizelgesi</h2>
              <div className="border-l-2 border-gray-200 pl-4 ml-2">
                {/* Zaman çizelgesi öğeleri */}
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

            {job.progressNotes && (
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-800 mb-2">İlerleme Notları</h2>
                <div className="bg-gray-50 p-4 rounded-md text-gray-700 whitespace-pre-line">
                  {job.progressNotes}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-lg font-medium text-gray-800 mb-4">İşveren Bilgileri</h2>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Şirket</p>
                  <p className="font-medium">{job.EmployerProfile?.companyName || "Belirtilmemiş"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">İletişim</p>
                  <p className="font-medium">{job.EmployerProfile?.fullName || "Belirtilmemiş"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">E-posta</p>
                  <p className="font-medium">{job.EmployerProfile?.User?.email || "Belirtilmemiş"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Telefon</p>
                  <p className="font-medium">{job.EmployerProfile?.phoneNumber || "Belirtilmemiş"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Adres</p>
                  <p className="font-medium">{job.EmployerProfile?.address || "Belirtilmemiş"}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-gray-50 p-4 rounded-md">
              <h2 className="text-lg font-medium text-gray-800 mb-4">İş Bilgileri</h2>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Başlangıç Tarihi</p>
                  <p className="font-medium">{formatDate(job.startDate)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Teslim Tarihi</p>
                  <p className="font-medium">{formatDate(job.dueDate)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Durum</p>
                  <JobStatusBadge status={job.status} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentJobDetail;