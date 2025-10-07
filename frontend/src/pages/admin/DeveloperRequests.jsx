// pages/admin/DeveloperRequests.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import adminApi from '../../services/adminApi';

const DeveloperRequests = () => {
  const [sekmeDurum, setSekmeDurum] = useState('all');
  const [talepler, setTalepler] = useState([]);
  const [istatistikler, setIstatistikler] = useState({});
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState(null);
  const [actionYukleniyor, setActionYukleniyor] = useState(false);
  const [filtreSecenekleri, setFiltreSecenekleri] = useState({
    priority: '',
    projectType: '',
    experienceLevel: ''
  });

  useEffect(() => {
    talepleriGetir();
    istatistikleriGetir();
  }, [sekmeDurum, filtreSecenekleri]);

  const talepleriGetir = async () => {
    try {
      setYukleniyor(true);
      const params = {
        ...(sekmeDurum !== 'all' && { status: sekmeDurum }),
        ...filtreSecenekleri
      };
      
      const response = await adminApi.yazilimciTalepleri.tumTalepleriGetir(params);
      setTalepler(response.data.requests || []);
      setYukleniyor(false);
    } catch (err) {
      console.error('Talepler getirme hatası:', err);
      setHata('Talepler yüklenirken hata oluştu');
      setYukleniyor(false);
    }
  };

  const istatistikleriGetir = async () => {
    try {
      const response = await adminApi.yazilimciTalepleri.istatistikleriGetir();
      setIstatistikler(response.data);
    } catch (err) {
      console.error('İstatistikler getirme hatası:', err);
    }
  };

  const durumGuncelle = async (talepId, yeniDurum, adminNotu = '') => {
    try {
      setActionYukleniyor(true);
      await adminApi.yazilimciTalepleri.durumGuncelle(talepId, { 
        status: yeniDurum, 
        adminNotes: adminNotu 
      });
      talepleriGetir();
      istatistikleriGetir();
    } catch (err) {
      console.error('Durum güncelleme hatası:', err);
      alert('Durum güncellenirken hata oluştu');
    } finally {
      setActionYukleniyor(false);
    }
  };

  const durumRengi = (durum) => {
    switch(durum) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'viewed':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const durumMetni = (durum) => {
    switch(durum) {
      case 'pending':
        return 'Yeni Talep';
      case 'reviewing':
        return 'İncelemede';
      case 'viewed':
        return 'Görüntülendi';
      case 'archived':
        return 'Arşivlendi';
      default:
        return durum;
    }
  };

  const priorityRengi = (priority) => {
    switch(priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'normal':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const priorityMetni = (priority) => {
    switch(priority) {
      case 'urgent':
        return 'Acil';
      case 'high':
        return 'Yüksek';
      case 'normal':
        return 'Normal';
      default:
        return priority;
    }
  };

  const projetipiMetni = (tip) => {
    const tipMap = {
      website: 'Web Sitesi',
      mobile_app: 'Mobil Uygulama',
      api: 'API',
      ecommerce: 'E-ticaret',
      crm: 'CRM',
      desktop_app: 'Masaüstü App',
      other: 'Diğer'
    };
    return tipMap[tip] || tip;
  };

  const deneyimMetni = (seviye) => {
    switch(seviye) {
      case 'intern':
        return 'Stajyer';
      case 'junior':
        return 'Junior';
      case 'mid':
        return 'Mid-level';
      case 'senior':
        return 'Senior';
      default:
        return seviye;
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Yazılımcı Talepleri</h1>
          
          {/* İstatistik Özeti */}
          <div className="flex space-x-4">
            <div className="bg-white px-4 py-2 rounded-lg shadow border">
              <span className="text-sm text-gray-600">Toplam: </span>
              <span className="font-semibold">{istatistikler.total || 0}</span>
            </div>
            <div className="bg-red-50 px-4 py-2 rounded-lg shadow border">
              <span className="text-sm text-red-600">Acil: </span>
              <span className="font-semibold text-red-800">{istatistikler.byPriority?.urgent || 0}</span>
            </div>
          </div>
        </div>

        {/* Filtreler */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Öncelik</label>
              <select
                value={filtreSecenekleri.priority}
                onChange={(e) => setFiltreSecenekleri(prev => ({...prev, priority: e.target.value}))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Tümü</option>
                <option value="urgent">Acil</option>
                <option value="high">Yüksek</option>
                <option value="normal">Normal</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Proje Tipi</label>
              <select
                value={filtreSecenekleri.projectType}
                onChange={(e) => setFiltreSecenekleri(prev => ({...prev, projectType: e.target.value}))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Tümü</option>
                <option value="website">Web Sitesi</option>
                <option value="mobile_app">Mobil Uygulama</option>
                <option value="ecommerce">E-ticaret</option>
                <option value="api">API</option>
                <option value="crm">CRM</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deneyim</label>
              <select
                value={filtreSecenekleri.experienceLevel}
                onChange={(e) => setFiltreSecenekleri(prev => ({...prev, experienceLevel: e.target.value}))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Tümü</option>
                <option value="intern">Stajyer</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid-level</option>
                <option value="senior">Senior</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => setFiltreSecenekleri({ priority: '', projectType: '', experienceLevel: '' })}
                className="w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 text-sm"
              >
                Filtreleri Temizle
              </button>
            </div>
          </div>
        </div>
        
        {/* Sekme Butonları */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setSekmeDurum('all')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                sekmeDurum === 'all' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tüm Talepler ({istatistikler.total || 0})
            </button>
            <button
              onClick={() => setSekmeDurum('pending')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                sekmeDurum === 'pending' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Yeni Talepler ({istatistikler.byStatus?.pending || 0})
            </button>
            <button
              onClick={() => setSekmeDurum('reviewing')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                sekmeDurum === 'reviewing' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              İncelemede ({istatistikler.byStatus?.reviewing || 0})
            </button>
            <button
              onClick={() => setSekmeDurum('viewed')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                sekmeDurum === 'viewed' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Görüntülendi ({istatistikler.byStatus?.viewed || 0})
            </button>
          </nav>
        </div>

        {yukleniyor ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : hata ? (
          <div className="bg-red-50 p-4 rounded-md text-red-500">
            {hata}
          </div>
        ) : talepler.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Talep bulunamadı</h3>
            <p className="text-gray-500">Seçili filtrelere uygun yazılımcı talebi bulunmuyor.</p>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proje Detayları
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşveren
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teknik Bilgiler
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Öncelik
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {talepler.map((talep) => (
                  <tr key={talep.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {talep.projectTitle}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {projetipiMetni(talep.projectType)}
                        </div>
                        <div className="text-xs text-gray-400 mt-1 truncate">
                          {talep.projectDescription?.substring(0, 60)}...
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {talep.EmployerProfile?.companyName || 'Şirket bilgisi yok'}
                        </div>
                        <div className="text-gray-500">
                          {talep.EmployerProfile?.fullName || 'İsim bilgisi yok'}
                        </div>
                        <div className="text-xs text-gray-400">
                          {talep.EmployerProfile?.User?.email || 'Email bilgisi yok'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {deneyimMetni(talep.experienceLevel)}
                        </div>
                        <div className="text-gray-500 capitalize">
                          {talep.workType?.replace('_', ' ')}
                        </div>
                        <div className="text-xs text-gray-400">
                          {talep.duration?.replace('_', ' ')} - {talep.workStyle}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        durumRengi(talep.status)
                      }`}>
                        {durumMetni(talep.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        priorityRengi(talep.priority)
                      }`}>
                        {priorityMetni(talep.priority)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(talep.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/admin/developer-requests/${talep.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Detay
                        </Link>
                        
                        {talep.status === 'pending' && (
                          <button
                            onClick={() => durumGuncelle(talep.id, 'reviewing')}
                            disabled={actionYukleniyor}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            İncele
                          </button>
                        )}
                        
                        {talep.status === 'reviewing' && (
                          <button
                            onClick={() => durumGuncelle(talep.id, 'viewed')}
                            disabled={actionYukleniyor}
                            className="text-green-600 hover:text-green-900"
                          >
                            Görüntülendi
                          </button>
                        )}
                        
                        {['pending', 'reviewing'].includes(talep.status) && (
                          <button
                            onClick={() => {
                              const not = prompt('Admin notu (opsiyonel):');
                              durumGuncelle(talep.id, 'archived', not || '');
                            }}
                            disabled={actionYukleniyor}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Arşivle
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default DeveloperRequests;