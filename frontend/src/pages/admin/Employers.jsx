// pages/admin/Employers.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import adminApi from '../../services/adminApi';

const Employers = () => {
  const [isverenler, setIsverenler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState(null);
  const [aramaMetni, setAramaMetni] = useState('');

  useEffect(() => {
    isverenleriGetir();
  }, []);

  const isverenleriGetir = async () => {
    try {
      setYukleniyor(true);
      const response = await adminApi.isverenYonetimi.tumIsverenleriGetir();
      setIsverenler(response.data);
      setYukleniyor(false);
    } catch (err) {
      console.error('İşveren getirme hatası:', err);
      setHata('İşverenler yüklenirken hata oluştu');
      setYukleniyor(false);
    }
  };

  const filtrelenmisIsverenler = isverenler.filter(isveren =>
    isveren.companyName?.toLowerCase().includes(aramaMetni.toLowerCase()) ||
    isveren.fullName?.toLowerCase().includes(aramaMetni.toLowerCase()) ||
    isveren.User?.email?.toLowerCase().includes(aramaMetni.toLowerCase())
  );

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">İşveren Yönetimi</h1>
        
        {/* Arama Çubuğu */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="İşveren ara..."
            value={aramaMetni}
            onChange={(e) => setAramaMetni(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
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
                    Şirket Adı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Şehir
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kayıt Tarihi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtrelenmisIsverenler.map((isveren) => (
                  <tr key={isveren.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {isveren.User?.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {isveren.fullName || 'Belirtilmemiş'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {isveren.companyName || 'Belirtilmemiş'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {isveren.city || 'Belirtilmemiş'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {isveren.phoneNumber || 'Belirtilmemiş'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(isveren.User?.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        isveren.User?.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {isveren.User?.isActive ? 'Aktif' : 'Pasif'}
                      </span>
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

export default Employers;