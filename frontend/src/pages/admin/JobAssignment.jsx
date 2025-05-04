// pages/admin/JobAssignment.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import adminApi from '../../services/adminApi';

const JobAssignment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const jobId = location.state?.jobId;

  const [isler, setIsler] = useState([]);
  const [ogrenciler, setOgrenciler] = useState([]);
  const [secilenIs, setSecilenIs] = useState(jobId || '');
  const [secilenOgrenci, setSecilenOgrenci] = useState('');
  const [baslangicTarihi, setBaslangicTarihi] = useState(new Date().toISOString().split('T')[0]);
  const [bitisTarihi, setBitisTarihi] = useState('');
  const [yukleniyor, setYukleniyor] = useState(true);
  const [atamaYukleniyor, setAtamaYukleniyor] = useState(false);
  const [hata, setHata] = useState(null);

  useEffect(() => {
    verileriGetir();
  }, []);

  const verileriGetir = async () => {
    try {
      const [isleriGetir, ogrencileriGetir] = await Promise.all([
        adminApi.isYonetimi.tumIsleriGetir(),
        adminApi.ogrenciYonetimi.tumOgrencileriGetir()
      ]);

      console.log('All jobs:', isleriGetir.data);
      const onaylanmisIsler = isleriGetir.data.filter(is => is.status === 'approved');
      console.log('Approved jobs:', onaylanmisIsler);

      console.log('All students:', ogrencileriGetir.data);
      console.log('First student:', ogrencileriGetir.data[0]);
      
      // Öğrencileri filtrele
      const onaylanmisOgrenciler = ogrencileriGetir.data.filter(ogrenci => {
        console.log('Student:', ogrenci.id, 'User:', ogrenci.User);
        console.log('ApprovalStatus:', ogrenci.User?.approvalStatus);
        return ogrenci.User?.approvalStatus === 'approved';
      });
      
      console.log('Approved students:', onaylanmisOgrenciler);

      setIsler(onaylanmisIsler);
      setOgrenciler(onaylanmisOgrenciler);
      setYukleniyor(false);
    } catch (err) {
      console.error('Veri getirme hatası:', err);
      setHata('Veriler yüklenirken hata oluştu');
      setYukleniyor(false);
    }
  };

  const isAta = async (e) => {
    e.preventDefault();
    
    if (!secilenIs || !secilenOgrenci) {
      setHata('Lütfen iş ve öğrenci seçin');
      return;
    }

    try {
      setAtamaYukleniyor(true);
      await adminApi.isYonetimi.isAta({
        jobId: secilenIs,
        studentId: secilenOgrenci,
        startDate: baslangicTarihi,
        dueDate: bitisTarihi || null
      });

      alert('İş başarıyla atandı!');
      navigate('/admin/jobs');
    } catch (err) {
      console.error('İş atama hatası:', err);
      setHata('İş atanırken hata oluştu: ' + (err.response?.data?.message || err.message));
    } finally {
      setAtamaYukleniyor(false);
    }
  };

  if (yukleniyor) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">İş Atama</h1>
        
        <div className="mb-6 p-4 bg-gray-100 rounded">
          <h3 className="font-bold">Debug Bilgisi:</h3>
          <p>Toplam öğrenci: {ogrenciler.length}</p>
          <p>Seçili iş: {secilenIs}</p>
          <p>Seçili öğrenci: {secilenOgrenci}</p>
        </div>
        
        {hata && (
          <div className="bg-red-50 p-4 rounded-md text-red-500 mb-6">
            {hata}
          </div>
        )}

        <form onSubmit={isAta} className="bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İş İlanı Seç
              </label>
              <select
                value={secilenIs}
                onChange={(e) => setSecilenIs(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">İş seçin...</option>
                {isler.map((is) => (
                  <option key={is.id} value={is.id}>
                    {is.title} - {is.EmployerProfile?.companyName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Öğrenci Seç
              </label>
              <select
                value={secilenOgrenci}
                onChange={(e) => setSecilenOgrenci(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Öğrenci seçin...</option>
                {ogrenciler.map((ogrenci) => (
                  <option key={ogrenci.id} value={ogrenci.id}>
                    {ogrenci.fullName || ogrenci.User?.email} - {ogrenci.school || 'Okul belirtilmemiş'}
                  </option>
                ))}
              </select>
              {ogrenciler.length === 0 && (
                <p className="mt-2 text-sm text-red-500">
                  Hiç onaylı öğrenci bulunamadı
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlangıç Tarihi
                </label>
                <input
                  type="date"
                  value={baslangicTarihi}
                  onChange={(e) => setBaslangicTarihi(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bitiş Tarihi (Opsiyonel)
                </label>
                <input
                  type="date"
                  value={bitisTarihi}
                  onChange={(e) => setBitisTarihi(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min={baslangicTarihi}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/admin/jobs')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={atamaYukleniyor}
                className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${
                  atamaYukleniyor ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {atamaYukleniyor ? 'Atanıyor...' : 'İş Ata'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default JobAssignment;