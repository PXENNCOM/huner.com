// src/pages/employer/DeveloperRequestDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import EmployerLayout from './components/EmployerLayout';
import { getDeveloperRequestById } from '../../services/employerApi';

const DeveloperRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    try {
      setLoading(true);
      const response = await getDeveloperRequestById(id);
      const requestData = response.data;
      
      // JSON string'leri parse et
      if (requestData.technologies && typeof requestData.technologies === 'string') {
        try {
          requestData.technologies = JSON.parse(requestData.technologies);
        } catch (e) {
          console.warn('Technologies parse hatası:', e);
          requestData.technologies = [];
        }
      }
      
      if (requestData.communicationLanguages && typeof requestData.communicationLanguages === 'string') {
        try {
          requestData.communicationLanguages = JSON.parse(requestData.communicationLanguages);
        } catch (e) {
          console.warn('CommunicationLanguages parse hatası:', e);
          requestData.communicationLanguages = [];
        }
      }
      
      console.log('Parsed request data:', requestData);
      console.log('Technologies after parse:', requestData.technologies, Array.isArray(requestData.technologies));
      
      setRequest(requestData);
      setLoading(false);
    } catch (err) {
      console.error('Talep detayları yüklenirken hata oluştu:', err);
      setError('Talep detayları yüklenirken bir hata oluştu.');
      setLoading(false);
    }
  };

  // Status badge
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Yeni Talep' },
      reviewing: { color: 'bg-blue-100 text-blue-800', label: 'İncelemede' },
      viewed: { color: 'bg-green-100 text-green-800', label: 'Görüntülendi' },
      archived: { color: 'bg-gray-100 text-gray-800', label: 'Arşivlendi' }
    };

    const statusInfo = statusMap[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  // Proje tipi etiketleri
  const getProjectTypeLabel = (type) => {
    const typeMap = {
      website: 'Web Sitesi',
      mobile_app: 'Mobil Uygulama',
      api: 'API',
      ecommerce: 'E-ticaret',
      crm: 'CRM',
      desktop_app: 'Masaüstü Uygulaması',
      other: 'Diğer'
    };
    return typeMap[type] || type;
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

  if (error || !request) {
    return (
      <EmployerLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{error || 'Talep bulunamadı'}</p>
          </div>
          <Link
            to="/employer/developer-requests"
            className="text-blue-500 hover:text-blue-700"
          >
            ← Talep Listesine Dön
          </Link>
        </div>
      </EmployerLayout>
    );
  }

  return (
    <EmployerLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <Link
              to="/employer/developer-requests"
              className="text-blue-500 hover:text-blue-700 mb-2 inline-block"
            >
              ← Talep Listesine Dön
            </Link>
            <h1 className="text-2xl font-semibold text-gray-800">{request.projectTitle}</h1>
            <div className="flex items-center space-x-4 mt-2">
              {getStatusBadge(request.status)}
              <span className="text-sm text-gray-500">
                {new Date(request.createdAt).toLocaleDateString('tr-TR')}
              </span>
            </div>
          </div>
          
          {request.status === 'pending' && (
            <Link
              to={`/employer/developer-requests/${id}/edit`}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Düzenle
            </Link>
          )}
        </div>

        {/* Detay İçeriği */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Proje Bilgileri */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Proje Bilgileri</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Proje Tipi</label>
                <p className="text-gray-900">{getProjectTypeLabel(request.projectType)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Öncelik</label>
                <p className="text-gray-900 capitalize">{request.priority === 'normal' ? 'Normal' : request.priority === 'high' ? 'Yüksek' : 'Acil'}</p>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">Proje Açıklaması</label>
              <p className="text-gray-900 whitespace-pre-wrap">{request.projectDescription}</p>
            </div>
          </div>

          {/* Teknik Gereksinimler */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Teknik Gereksinimler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Deneyim Seviyesi</label>
                <p className="text-gray-900 capitalize">
                  {request.experienceLevel === 'intern' ? 'Stajyer' :
                   request.experienceLevel === 'junior' ? 'Junior (0-2 yıl)' :
                   request.experienceLevel === 'mid' ? 'Mid-level (2-5 yıl)' : 'Senior (5+ yıl)'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Çalışma Türü</label>
                <p className="text-gray-900">
                  {request.workType === 'freelance' ? 'Freelance/Proje bazlı' :
                   request.workType === 'part_time' ? 'Part-time çalışan' :
                   request.workType === 'full_time' ? 'Full-time çalışan' : 'Stajyer'}
                </p>
              </div>
            </div>
            {request.technologies && request.technologies.length > 0 && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-500 mb-2">Teknolojiler</label>
                <div className="flex flex-wrap gap-2">
                  {request.technologies.map((tech, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Çalışma Koşulları */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Çalışma Koşulları</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Süre</label>
                <p className="text-gray-900">
                  {request.duration.replace('_', ' ').replace('months', 'ay').replace('month', 'ay')}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Başlangıç</label>
                <p className="text-gray-900">
                  {request.startDate === 'immediately' ? 'Hemen' :
                   request.startDate === 'within_1_week' ? '1 hafta içinde' : '1 ay içinde'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Çalışma Şekli</label>
                <p className="text-gray-900 capitalize">
                  {request.workStyle === 'remote' ? 'Remote' :
                   request.workStyle === 'hybrid' ? 'Hibrit' : 'Ofiste'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Çalışma Saatleri</label>
                <p className="text-gray-900">
                  {request.workHours === 'business_hours' ? 'Mesai saatleri' :
                   request.workHours === 'flexible' ? 'Esnek' : 'Gece vardiyası'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Takım Büyüklüğü</label>
                <p className="text-gray-900">
                  {request.teamSize === 'solo' ? '1 kişi' :
                   request.teamSize === '2_3_people' ? '2-3 kişi' : 'Takım (4+ kişi)'}
                </p>
              </div>
              {request.location && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Konum</label>
                  <p className="text-gray-900 capitalize">{request.location}</p>
                </div>
              )}
            </div>
          </div>

          {/* Tercihler */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Tercihler ve Diğer Bilgiler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {request.communicationLanguages && request.communicationLanguages.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">İletişim Dilleri</label>
                  <p className="text-gray-900">{request.communicationLanguages.join(', ')}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Sektör Deneyimi</label>
                <p className="text-gray-900">
                  {request.industryExperience ? (
                    request.industryExperience === 'no_preference' ? 'Fark etmez' :
                    request.industryExperience === 'fintech' ? 'Fintech' :
                    request.industryExperience === 'ecommerce' ? 'E-ticaret' :
                    request.industryExperience === 'healthcare' ? 'Sağlık' :
                    request.industryExperience === 'education' ? 'Eğitim' :
                    request.industryExperience === 'gaming' ? 'Oyun' :
                    request.industryExperience === 'social_media' ? 'Sosyal Medya' :
                    request.industryExperience
                  ) : 'Belirtilmemiş'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Bütçe Aralığı</label>
                <p className="text-gray-900">
                  {request.budgetRange || 'Belirtilmemiş'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Notları (varsa) */}
        {request.adminNotes && (
          <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Admin Notları</h3>
            <p className="text-blue-700">{request.adminNotes}</p>
          </div>
        )}
      </div>
    </EmployerLayout>
  );
};

export default DeveloperRequestDetail;