// pages/admin/Jobs.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import adminApi from '../../services/adminApi';

const Jobs = () => {
  const navigate = useNavigate();
  const [sekmeDurum, setSekmeDurum] = useState('all');
  const [isler, setIsler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState(null);
  const [actionYukleniyor, setActionYukleniyor] = useState(false);
  const [durumGuncelleniyorId, setDurumGuncelleniyorId] = useState(null);

  useEffect(() => {
    isleriGetir();
  }, [sekmeDurum]);

  const isleriGetir = async () => {
    try {
      setYukleniyor(true);
      let response;
      
      if (sekmeDurum === 'pending') {
        response = await adminApi.isYonetimi.bekleyenIsleriGetir();
      } else {
        response = await adminApi.isYonetimi.tumIsleriGetir();
      }
      
      setIsler(response.data);
      setYukleniyor(false);
    } catch (err) {
      console.error('İş getirme hatası:', err);
      setHata('İşler yüklenirken hata oluştu');
      setYukleniyor(false);
    }
  };

  const isOnayla = async (isId) => {
    try {
      setActionYukleniyor(true);
      await adminApi.isYonetimi.isOnayla(isId);
      isleriGetir();
    } catch (err) {
      console.error('İş onaylama hatası:', err);
      alert('İş onaylanırken hata oluştu');
    } finally {
      setActionYukleniyor(false);
    }
  };

  const isDurumGuncelle = async (isId, yeniDurum, notlar = '') => {
    try {
      setDurumGuncelleniyorId(isId);
      await adminApi.isYonetimi.isDurumunuGuncelle(isId, {
        status: yeniDurum,
        notes: notlar
      });
      isleriGetir();
      alert('İş durumu başarıyla güncellendi');
    } catch (err) {
      console.error('İş durumu güncelleme hatası:', err);
      alert('İş durumu güncellenirken hata oluştu: ' + (err.response?.data?.message || err.message));
    } finally {
      setDurumGuncelleniyorId(null);
    }
  };

  const durumRengi = (durum) => {
    switch(durum) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'assigned':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const durumMetni = (durum) => {
    switch(durum) {
      case 'pending':
        return 'Beklemede';
      case 'approved':
        return 'Onaylandı';
      case 'assigned':
        return 'Atandı';
      case 'in_progress':
        return 'Devam Ediyor';
      case 'completed':
        return 'Tamamlandı';
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return durum;
    }
  };

  const getDurumSecenekleri = (mevcutDurum) => {
    const tumDurumlar = [
      { value: 'in_progress', label: 'Devam Ediyor' },
      { value: 'completed', label: 'Tamamlandı' },
      { value: 'cancelled', label: 'İptal Edildi' }
    ];

    // Mevcut durum dışındaki seçenekleri döndür
    return tumDurumlar.filter(durum => durum.value !== mevcutDurum);
  };

  const DurumSelectBox = ({ is }) => {
    const [acik, setAcik] = useState(false);
    const secenekler = getDurumSecenekleri(is.status);

    return (
      <div className="relative inline-block text-left">
        <button
          onClick={() => setAcik(!acik)}
          disabled={durumGuncelleniyorId === is.id}
          className={`inline-flex items-center px-3 py-1 border text-xs font-medium rounded-full ${durumRengi(is.status)} hover:bg-opacity-80 transition-colors`}
        >
          {durumMetni(is.status)}
          <svg className="ml-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {acik && (
          <div className="absolute z-10 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
            <div className="py-1">
              {secenekler.map((secenek) => (
                <button
                  key={secenek.value}
                  onClick={() => {
                    isDurumGuncelle(is.id, secenek.value);
                    setAcik(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {secenek.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const HizliIslemler = ({ is }) => {
    const hizliSeçenekler = [];

    if (is.status === 'in_progress') {
      hizliSeçenekler.push(
        { durum: 'completed', label: 'Tamamla', renk: 'text-green-600 hover:text-green-900' },
        { durum: 'cancelled', label: 'İptal Et', renk: 'text-red-600 hover:text-red-900' }
      );
    }

    if (is.status === 'approved') {
      hizliSeçenekler.push(
        { durum: 'assigned', label: 'Atandı İşaretle', renk: 'text-purple-600 hover:text-purple-900' }
      );
    }

    if (is.status === 'assigned') {
      hizliSeçenekler.push(
        { durum: 'in_progress', label: 'Başlat', renk: 'text-blue-600 hover:text-blue-900' }
      );
    }

    return (
      <div className="flex space-x-2">
        {hizliSeçenekler.map((secenek, index) => (
          <button
            key={index}
            onClick={() => isDurumGuncelle(is.id, secenek.durum)}
            disabled={durumGuncelleniyorId === is.id}
            className={`text-sm ${secenek.renk} ${durumGuncelleniyorId === is.id ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {secenek.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">İş İlanları Yönetimi</h1>
          <div className="flex space-x-2">
            <button 
              onClick={() => navigate('/admin/jobs/assign')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              İş Ata
            </button>
            <button 
              onClick={isleriGetir}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Yenile
            </button>
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
              Tüm İşler ({isler.length})
            </button>
            <button
              onClick={() => setSekmeDurum('pending')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                sekmeDurum === 'pending' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Onay Bekleyenler
            </button>
          </nav>
        </div>

        {/* Durum İstatistikleri */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          {[
            { durum: 'pending', label: 'Beklemede' },
            { durum: 'approved', label: 'Onaylandı' },
            { durum: 'assigned', label: 'Atandı' },
            { durum: 'in_progress', label: 'Devam Ediyor' },
            { durum: 'completed', label: 'Tamamlandı' },
            { durum: 'cancelled', label: 'İptal Edildi' }
          ].map((item) => {
            const sayi = isler.filter(is => is.status === item.durum).length;
            return (
              <div key={item.durum} className={`p-3 rounded-lg border ${durumRengi(item.durum)}`}>
                <div className="text-center">
                  <div className="text-lg font-bold">{sayi}</div>
                  <div className="text-xs">{item.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {yukleniyor ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : hata ? (
          <div className="bg-red-50 p-4 rounded-md text-red-500">
            {hata}
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Başlık
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşveren
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Şirket
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Atanan Öğrenci
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarihler
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isler.map((is) => (
                    <tr key={is.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        #{is.id}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        <div className="max-w-xs truncate">
                          {is.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {is.EmployerProfile?.fullName || 'Belirtilmemiş'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {is.EmployerProfile?.companyName || 'Belirtilmemiş'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {durumGuncelleniyorId === is.id ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                            <span className="text-sm text-gray-500">Güncelleniyor...</span>
                          </div>
                        ) : (
                          <DurumSelectBox is={is} />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {is.AssignedStudent?.fullName || 'Atanmadı'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <div>Oluşturma: {new Date(is.createdAt).toLocaleDateString('tr-TR')}</div>
                          {is.startDate && (
                            <div>Başlangıç: {new Date(is.startDate).toLocaleDateString('tr-TR')}</div>
                          )}
                          {is.dueDate && (
                            <div>Bitiş: {new Date(is.dueDate).toLocaleDateString('tr-TR')}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col space-y-2">
                          {/* Hızlı İşlemler */}
                          <HizliIslemler is={is} />
                          
                          {/* Diğer İşlemler */}
                          <div className="flex space-x-2">
                            {is.status === 'pending' && (
                              <button
                                onClick={() => isOnayla(is.id)}
                                disabled={actionYukleniyor}
                                className="text-green-600 hover:text-green-900 text-sm"
                              >
                                Onayla
                              </button>
                            )}
                            {is.status === 'approved' && (
                              <button
                                onClick={() => navigate('/admin/jobs/assign', { state: { jobId: is.id } })}
                                className="text-blue-600 hover:text-blue-900 text-sm"
                              >
                                Ata
                              </button>
                            )}
                            {is.status === 'in_progress' && (
                              <button
                                onClick={() => {
                                  const note = prompt('İlerleme notu ekleyin:');
                                  if (note) {
                                    adminApi.isYonetimi.ilerlemNotuEkle(is.id, { progressNote: note })
                                      .then(() => {
                                        alert('İlerleme notu eklendi');
                                        isleriGetir();
                                      })
                                      .catch(() => alert('Not eklenirken hata oluştu'));
                                  }
                                }}
                                className="text-purple-600 hover:text-purple-900 text-sm"
                              >
                                Not Ekle
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {isler.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {sekmeDurum === 'pending' ? 'Bekleyen iş ilanı bulunamadı' : 'Hiç iş ilanı bulunamadı'}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Jobs;