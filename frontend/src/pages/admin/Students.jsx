// pages/admin/Students.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import adminApi from '../../services/adminApi';

const Students = () => {
  const [sekmeDurum, setSekmeDurum] = useState('all');
  const [ogrenciler, setOgrenciler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState(null);
  const [actionYukleniyor, setActionYukleniyor] = useState(false);

  useEffect(() => {
    ogrencileriGetir();
  }, [sekmeDurum]);

  const ogrencileriGetir = async () => {
    try {
      setYukleniyor(true);
      let response;
      
      switch(sekmeDurum) {
        case 'pending':
          response = await adminApi.ogrenciYonetimi.bekleyenOgrencileriGetir();
          break;
        case 'rejected':
          response = await adminApi.ogrenciYonetimi.reddedilenOgrencileriGetir();
          break;
        default:
          response = await adminApi.ogrenciYonetimi.tumOgrencileriGetir();
      }
      
      setOgrenciler(response.data);
      setYukleniyor(false);
    } catch (err) {
      console.error('Öğrenci getirme hatası:', err);
      setHata('Öğrenciler yüklenirken hata oluştu');
      setYukleniyor(false);
    }
  };

  const ogrenciOnayla = async (ogrenciId) => {
    try {
      setActionYukleniyor(true);
      await adminApi.ogrenciYonetimi.ogrenciOnayla(ogrenciId);
      ogrencileriGetir();
    } catch (err) {
      console.error('Öğrenci onaylama hatası:', err);
      alert('Öğrenci onaylanırken hata oluştu');
    } finally {
      setActionYukleniyor(false);
    }
  };

  const ogrenciReddet = async (ogrenciId) => {
    const sebep = prompt('Ret sebebini giriniz:');
    if (!sebep) return;

    try {
      setActionYukleniyor(true);
      await adminApi.ogrenciYonetimi.ogrenciReddet(ogrenciId, sebep);
      ogrencileriGetir();
    } catch (err) {
      console.error('Öğrenci reddetme hatası:', err);
      alert('Öğrenci reddedilirken hata oluştu');
    } finally {
      setActionYukleniyor(false);
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

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Öğrenci Yönetimi</h1>
        
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
              Tüm Öğrenciler
            </button>
            <button
              onClick={() => setSekmeDurum('pending')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                sekmeDurum === 'pending' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Bekleyen Onaylar
            </button>
            <button
              onClick={() => setSekmeDurum('rejected')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                sekmeDurum === 'rejected' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reddedilenler
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
                    E-posta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adı Soyadı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Okul
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kayıt Tarihi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ogrenciler.map((ogrenci) => (
                  <tr key={ogrenci.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ogrenci.User?.email || ogrenci.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ogrenci.fullName || 'Belirtilmemiş'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ogrenci.school || 'Belirtilmemiş'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        durumRengi(ogrenci.approvalStatus || ogrenci.User?.approvalStatus)
                      }`}>
                        {durumMetni(ogrenci.approvalStatus || ogrenci.User?.approvalStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(ogrenci.createdAt || ogrenci.User?.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {(ogrenci.approvalStatus || ogrenci.User?.approvalStatus) === 'pending' && (
                        <div className="space-x-2">
                          <button
                            onClick={() => ogrenciOnayla(ogrenci.id)}
                            disabled={actionYukleniyor}
                            className="text-green-600 hover:text-green-900"
                          >
                            Onayla
                          </button>
                          <button
                            onClick={() => ogrenciReddet(ogrenci.id)}
                            disabled={actionYukleniyor}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reddet
                          </button>
                        </div>
                      )}
                      {(ogrenci.approvalStatus || ogrenci.User?.approvalStatus) === 'rejected' && 
                        ogrenci.rejectionReason && (
                        <span className="text-sm text-gray-500 italic">
                          Sebep: {ogrenci.rejectionReason}
                        </span>
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

export default Students;