// pages/admin/DeveloperRequestDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import adminApi from '../../services/adminApi';

const AdminDeveloperRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [talep, setTalep] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState(null);
  const [actionYukleniyor, setActionYukleniyor] = useState(false);

  useEffect(() => {
    talepDetayiniGetir();
  }, [id]);

  const talepDetayiniGetir = async () => {
    try {
      setYukleniyor(true);
      const response = await adminApi.yazilimciTalepleri.talepDetayiGetir(id);
      
      // JSON string'leri parse et
      const talepData = response.data;
      if (talepData.technologies && typeof talepData.technologies === 'string') {
        try {
          talepData.technologies = JSON.parse(talepData.technologies);
        } catch (e) {
          talepData.technologies = [];
        }
      }
      
      if (talepData.communicationLanguages && typeof talepData.communicationLanguages === 'string') {
        try {
          talepData.communicationLanguages = JSON.parse(talepData.communicationLanguages);
        } catch (e) {
          talepData.communicationLanguages = [];
        }
      }
      
      setTalep(talepData);
      setYukleniyor(false);
    } catch (err) {
      console.error('Talep detayı getirme hatası:', err);
      setHata('Talep detayları yüklenirken hata oluştu');
      setYukleniyor(false);
    }
  };

  const durumGuncelle = async (yeniDurum, adminNotu = '') => {
    try {
      setActionYukleniyor(true);
      await adminApi.yazilimciTalepleri.durumGuncelle(id, { 
        status: yeniDurum, 
        adminNotes: adminNotu 
      });
      talepDetayiniGetir(); // Güncellenmiş veriyi al
    } catch (err) {
      console.error('Durum güncelleme hatası:', err);
      alert('Durum güncellenirken hata oluştu');
    } finally {
      setActionYukleniyor(false);
    }
  };

  // Yardımcı fonksiyonlar
  const durumRengi = (durum) => {
    switch(durum) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewing': return 'bg-blue-100 text-blue-800';
      case 'viewed': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const durumMetni = (durum) => {
    switch(durum) {
      case 'pending': return 'Yeni Talep';
      case 'reviewing': return 'İncelemede';
      case 'viewed': return 'Görüntülendi';
      case 'archived': return 'Arşivlendi';
      default: return durum;
    }
  };

  const priorityRengi = (priority) => {
    switch(priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const projetipiMetni = (tip) => {
    const tipMap = {
      website: 'Web Sitesi',
      mobile_app: 'Mobil Uygulama',
      api: 'API',
      ecommerce: 'E-ticaret',
      crm: 'CRM',
      desktop_app: 'Masaüstü Uygulaması',
      other: 'Diğer'
    };
    return tipMap[tip] || tip;
  };

  if (yukleniyor) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (hata || !talep) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 p-4 rounded-md text-red-500 mb-6">
            {hata || 'Talep bulunamadı'}
          </div>
          <Link to="/admin/developer-requests" className="text-blue-600 hover:text-blue-800">
            ← Talep Listesine Dön
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <Link to="/admin/developer-requests" className="text-blue-600 hover:text-blue-800 mb-2 inline-block">
              ← Yazılımcı Taleplerine Dön
            </Link>
            <h1 className="text-2xl font-semibold text-gray-800">{talep.projectTitle}</h1>
            <div className="flex items-center space-x-4 mt-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${durumRengi(talep.status)}`}>
                {durumMetni(talep.status)}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityRengi(talep.priority)}`}>
                {talep.priority === 'urgent' ? 'Acil' : talep.priority === 'high' ? 'Yüksek' : 'Normal'}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(talep.createdAt).toLocaleDateString('tr-TR')} tarihinde oluşturuldu
              </span>
            </div>
          </div>
          
          {/* Durum Değiştirme Butonları */}
          <div className="flex space-x-2">
            {talep.status === 'pending' && (
              <button
                onClick={() => durumGuncelle('reviewing')}
                disabled={actionYukleniyor}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                İncelemeye Al
              </button>
            )}
            
            {talep.status === 'reviewing' && (
              <button
                onClick={() => durumGuncelle('viewed')}
                disabled={actionYukleniyor}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Görüntülendi İşaretle
              </button>
            )}
            
            {['pending', 'reviewing'].includes(talep.status) && (
              <button
                onClick={() => {
                  const not = prompt('Arşivleme notu (opsiyonel):');
                  durumGuncelle('archived', not || '');
                }}
                disabled={actionYukleniyor}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Arşivle
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sol Taraf - Talep Detayları */}
          <div className="lg:col-span-2 space-y-6">
            {/* Proje Bilgileri */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Proje Bilgileri</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Proje Tipi</label>
                  <p className="text-gray-900">{projetipiMetni(talep.projectType)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Bütçe Aralığı</label>
                  <p className="text-gray-900 font-medium text-green-600">
                    {talep.budgetRange || 'Belirtilmemiş'}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-500 mb-1">Proje Açıklaması</label>
                <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">{talep.projectDescription}</p>
              </div>
            </div>

            {/* Teknik Gereksinimler */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Teknik Gereksinimler</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Deneyim Seviyesi</label>
                  <p className="text-gray-900">
                    {talep.experienceLevel === 'intern' ? 'Stajyer' :
                     talep.experienceLevel === 'junior' ? 'Junior (0-2 yıl)' :
                     talep.experienceLevel === 'mid' ? 'Mid-level (2-5 yıl)' : 'Senior (5+ yıl)'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Çalışma Türü</label>
                  <p className="text-gray-900">
                    {talep.workType === 'freelance' ? 'Freelance/Proje bazlı' :
                     talep.workType === 'part_time' ? 'Part-time çalışan' :
                     talep.workType === 'full_time' ? 'Full-time çalışan' : 'Stajyer'}
                  </p>
                </div>
              </div>
              
              {/* Teknolojiler */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-500 mb-2">Gerekli Teknolojiler</label>
                <div className="flex flex-wrap gap-2">
                  {talep.technologies && Array.isArray(talep.technologies) && talep.technologies.length > 0 
                    ? talep.technologies.map((tech, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {tech}
                        </span>
                      ))
                    : <span className="text-gray-400 text-sm italic">Teknoloji belirtilmemiş</span>
                  }
                </div>
              </div>
            </div>

            {/* Çalışma Koşulları */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Çalışma Koşulları</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Süre</label>
                  <p className="text-gray-900">
                    {talep.duration?.replace('_', ' ').replace('months', 'ay').replace('month', 'ay')}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Başlangıç</label>
                  <p className="text-gray-900">
                    {talep.startDate === 'immediately' ? 'Hemen' :
                     talep.startDate === 'within_1_week' ? '1 hafta içinde' : '1 ay içinde'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Çalışma Şekli</label>
                  <p className="text-gray-900 capitalize">
                    {talep.workStyle === 'remote' ? 'Remote' :
                     talep.workStyle === 'hybrid' ? 'Hibrit' : 'Ofiste'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Çalışma Saatleri</label>
                  <p className="text-gray-900">
                    {talep.workHours === 'business_hours' ? 'Mesai saatleri' :
                     talep.workHours === 'flexible' ? 'Esnek' : 'Gece vardiyası'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Takım Büyüklüğü</label>
                  <p className="text-gray-900">
                    {talep.teamSize === 'solo' ? '1 kişi' :
                     talep.teamSize === '2_3_people' ? '2-3 kişi' : 'Takım (4+ kişi)'}
                  </p>
                </div>
                {talep.location && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Konum</label>
                    <p className="text-gray-900 capitalize">{talep.location}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tercihler */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Tercihler</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">İletişim Dilleri</label>
                  <div className="flex flex-wrap gap-2">
                    {talep.communicationLanguages && Array.isArray(talep.communicationLanguages) && talep.communicationLanguages.length > 0
                      ? talep.communicationLanguages.map((lang, index) => (
                          <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            {lang}
                          </span>
                        ))
                      : <span className="text-gray-400 text-sm">Dil belirtilmemiş</span>
                    }
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Sektör Deneyimi</label>
                  <p className="text-gray-900">
                    {talep.industryExperience ? (
                      talep.industryExperience === 'no_preference' ? 'Fark etmez' :
                      talep.industryExperience === 'fintech' ? 'Fintech' :
                      talep.industryExperience === 'ecommerce' ? 'E-ticaret' :
                      talep.industryExperience === 'healthcare' ? 'Sağlık' :
                      talep.industryExperience === 'education' ? 'Eğitim' :
                      talep.industryExperience === 'gaming' ? 'Oyun' :
                      talep.industryExperience === 'social_media' ? 'Sosyal Medya' :
                      talep.industryExperience
                    ) : 'Belirtilmemiş'}
                  </p>
                </div>
              </div>
            </div>

            {/* Admin Notları */}
            {talep.adminNotes && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="text-sm font-medium text-blue-800 mb-2">Admin Notları</h3>
                <p className="text-blue-700">{talep.adminNotes}</p>
              </div>
            )}
          </div>

          {/* Sağ Taraf - İşveren Bilgileri */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Talep Eden İşveren</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Şirket Adı</label>
                  <p className="text-gray-900 font-medium">
                    {talep.EmployerProfile?.companyName || 'Belirtilmemiş'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">İletişim Kişisi</label>
                  <p className="text-gray-900">
                    {talep.EmployerProfile?.fullName || 'Belirtilmemiş'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">E-posta</label>
                  <p className="text-gray-900">
                    {talep.EmployerProfile?.User?.email || 'Belirtilmemiş'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Telefon</label>
                  <p className="text-gray-900">
                    {talep.EmployerProfile?.phoneNumber || 'Belirtilmemiş'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Şehir</label>
                  <p className="text-gray-900">
                    {talep.EmployerProfile?.city || 'Belirtilmemiş'}
                  </p>
                </div>
                
                {talep.EmployerProfile?.address && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Adres</label>
                    <p className="text-gray-900 text-sm">
                      {talep.EmployerProfile.address}
                    </p>
                  </div>
                )}
              </div>
              
              {/* İşveren Detay Linki */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Link
                  to={`/admin/employers/${talep.EmployerProfile?.id}`}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md transition-colors text-center block"
                >
                  İşveren Detayını Görüntüle
                </Link>
              </div>
            </div>

            {/* Talep İstatistikleri */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Talep Bilgileri</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Talep ID:</span>
                  <span className="text-sm font-medium">#{talep.id}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Oluşturulma:</span>
                  <span className="text-sm font-medium">
                    {new Date(talep.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Güncellenme:</span>
                  <span className="text-sm font-medium">
                    {new Date(talep.updatedAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                
                {talep.viewedAt && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Görüntülenme:</span>
                    <span className="text-sm font-medium">
                      {new Date(talep.viewedAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                )}
                
                {talep.viewedBy && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Görüntüleyen:</span>
                    <span className="text-sm font-medium">{talep.viewedBy}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDeveloperRequestDetail;