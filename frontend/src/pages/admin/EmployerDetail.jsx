// pages/admin/EmployerDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import adminApi from '../../services/adminApi';

const AdminEmployerDetail = () => {
  const { id } = useParams();
  const [isverenDetay, setIsverenDetay] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState(null);

  useEffect(() => {
    isverenBilgileriniGetir();
  }, [id]);

  const isverenBilgileriniGetir = async () => {
    try {
      setYukleniyor(true);
      const response = await adminApi.isverenDetay.isverenBilgisiGetir(id);
      setIsverenDetay(response.data);
      setYukleniyor(false);
    } catch (err) {
      console.error('İşveren detayları getirme hatası:', err);
      setHata('İşveren bilgileri yüklenirken hata oluştu');
      setYukleniyor(false);
    }
  };

  const durumRengi = (durum) => {
    switch(durum) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const durumMetni = (durum) => {
    switch(durum) {
      case 'approved':
        return 'Onaylı';
      case 'pending':
        return 'Beklemede';
      case 'rejected':
        return 'Reddedildi';
      default:
        return durum;
    }
  };

  const jobStatusRengi = (status) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-teal-100 text-teal-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const jobStatusMetni = (status) => {
    switch(status) {
      case 'pending':
        return 'Onay Bekliyor';
      case 'approved':
        return 'Onaylandı';
      case 'in_progress':
        return 'Devam Ediyor';
      case 'completed':
        return 'Tamamlandı';
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return status;
    }
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

  if (hata || !isverenDetay) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 p-4 rounded-md text-red-500 mb-6">
            {hata || 'İşveren bulunamadı'}
          </div>
          <Link to="/admin/employers" className="text-blue-600 hover:text-blue-800">
            ← İşveren Listesine Dön
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const { employer, stats, recentJobs } = isverenDetay;

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link to="/admin/employers" className="text-blue-600 hover:text-blue-800 mb-2 inline-block">
            ← İşveren Listesine Dön
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                {employer.companyName || 'Şirket Adı Belirtilmemiş'}
              </h1>
              <p className="text-gray-600 mt-1">
                {employer.fullName || 'İletişim kişisi belirtilmemiş'}
              </p>
            </div>
            
            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                durumRengi(employer.User?.approvalStatus)
              }`}>
                {durumMetni(employer.User?.approvalStatus)}
              </span>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(employer.User?.createdAt).toLocaleDateString('tr-TR')} tarihinde kayıt oldu
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Sol Taraf - İşveren Detayları */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* İletişim Bilgileri */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">İletişim Bilgileri</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">E-posta</label>
                  <p className="text-gray-900">{employer.User?.email || 'Belirtilmemiş'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Telefon</label>
                  <p className="text-gray-900">{employer.phoneNumber || 'Belirtilmemiş'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Şehir</label>
                  <p className="text-gray-900">{employer.city || 'Belirtilmemiş'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Yaş</label>
                  <p className="text-gray-900">{employer.age || 'Belirtilmemiş'}</p>
                </div>
              </div>
              
              {employer.address && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Adres</label>
                  <p className="text-gray-900">{employer.address}</p>
                </div>
              )}
            </div>

            {/* Son İş İlanları */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Son İş İlanları</h2>
                <Link to="/admin/jobs" className="text-blue-600 hover:text-blue-800 text-sm">
                  Tüm İlanları Gör
                </Link>
              </div>
              
              {recentJobs && recentJobs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          İlan Başlığı
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Durum
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Tarih
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentJobs.map((job) => (
                        <tr key={job.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-gray-900">{job.title}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              jobStatusRengi(job.status)
                            }`}>
                              {jobStatusMetni(job.status)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {new Date(job.createdAt).toLocaleDateString('tr-TR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Henüz iş ilanı oluşturulmamış.</p>
                </div>
              )}
            </div>

          </div>

          {/* Sağ Taraf - İstatistikler ve Özet */}
          <div className="space-y-6">
            
            {/* İstatistikler */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">İstatistikler</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                  <div>
                    <p className="text-sm text-blue-600">Yazılımcı Talepleri</p>
                    <p className="text-2xl font-bold text-blue-800">{stats?.totalRequests || 0}</p>
                  </div>
                  <div className="text-blue-500">
                    💻
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                  <div>
                    <p className="text-sm text-green-600">İş İlanları</p>
                    <p className="text-2xl font-bold text-green-800">{stats?.totalJobs || 0}</p>
                  </div>
                  <div className="text-green-500">
                    📋
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="text-sm text-gray-600">Hesap Durumu</p>
                    <p className="text-sm font-medium text-gray-800">
                      {employer.User?.isActive ? 'Aktif' : 'Pasif'}
                    </p>
                  </div>
                  <div className="text-gray-500">
                    {employer.User?.isActive ? '✅' : '❌'}
                  </div>
                </div>
              </div>
            </div>

            {/* Hızlı İşlemler */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Hızlı İşlemler</h2>
              
              <div className="space-y-3">
                <Link
                  to={`/admin/developer-requests?employer=${employer.id}`}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors text-center block"
                >
                  Yazılımcı Taleplerini Gör
                </Link>
                
                <Link
                  to={`/admin/jobs?employer=${employer.id}`}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors text-center block"
                >
                  İş İlanlarını Gör
                </Link>
                
                <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-md transition-colors">
                  Mesaj Gönder
                </button>
                
                {employer.User?.approvalStatus === 'pending' && (
                  <div className="pt-2 border-t border-gray-200">
                    <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors mb-2">
                      Hesabı Onayla
                    </button>
                    <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-colors">
                      Hesabı Reddet
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Profil Resmi */}
            {employer.profileImage && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Profil Resmi</h2>
                <div className="flex justify-center">
                  <img 
                    src={`/uploads/profile-images/${employer.profileImage}`} 
                    alt={employer.fullName || 'Profil resmi'} 
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}

            {/* Hesap Detayları */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Hesap Detayları</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Kullanıcı ID:</span>
                  <span className="font-medium">#{employer.User?.id}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Profil ID:</span>
                  <span className="font-medium">#{employer.id}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Kayıt Tarihi:</span>
                  <span className="font-medium">
                    {new Date(employer.User?.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Son Güncelleme:</span>
                  <span className="font-medium">
                    {new Date(employer.updatedAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Hesap Tipi:</span>
                  <span className="font-medium">İşveren</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEmployerDetail;