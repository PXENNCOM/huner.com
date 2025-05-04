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

  const durumRengi = (durum) => {
    switch(durum) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-teal-100 text-teal-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const durumMetni = (durum) => {
    switch(durum) {
      case 'pending':
        return 'Beklemede';
      case 'approved':
        return 'Onaylandı';
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

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">İş İlanları Yönetimi</h1>
          <button 
            onClick={() => navigate('/admin/jobs/assign')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            İş Ata
          </button>
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
              Tüm İşler
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
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isler.map((is) => (
                  <tr key={is.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {is.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {is.EmployerProfile?.fullName || 'Belirtilmemiş'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {is.EmployerProfile?.companyName || 'Belirtilmemiş'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${durumRengi(is.status)}`}>
                        {durumMetni(is.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {is.AssignedStudent?.fullName || 'Atanmadı'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(is.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {is.status === 'pending' && (
                        <button
                          onClick={() => isOnayla(is.id)}
                          disabled={actionYukleniyor}
                          className="text-green-600 hover:text-green-900"
                        >
                          Onayla
                        </button>
                      )}
                      {is.status === 'approved' && (
                        <button
                          onClick={() => navigate('/admin/jobs/assign', { state: { jobId: is.id } })}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Ata
                        </button>
                      )}
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

export default Jobs;