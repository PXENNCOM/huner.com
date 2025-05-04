// pages/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import adminApi from '../../services/adminApi';

const Dashboard = () => {
  const [istatistikler, setIstatistikler] = useState({
    toplamOgrenci: 0,
    toplamIsveren: 0,
    aktifIs: 0,
    bekleyenIsIlani: 0,
    bekleyenOgrenci: 0
  });
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState(null);

  useEffect(() => {
    const verileriGetir = async () => {
      try {
        const [ogrenciler, isverenler, isler, bekleyenIsler, bekleyenOgrenciler] = await Promise.all([
          adminApi.ogrenciYonetimi.tumOgrencileriGetir(),
          adminApi.isverenYonetimi.tumIsverenleriGetir(),
          adminApi.isYonetimi.tumIsleriGetir(),
          adminApi.isYonetimi.bekleyenIsleriGetir(),
          adminApi.ogrenciYonetimi.bekleyenOgrencileriGetir()
        ]);

        const aktifIsler = isler.data.filter(is => is.status === 'in_progress').length;

        setIstatistikler({
          toplamOgrenci: ogrenciler.data.length,
          toplamIsveren: isverenler.data.length,
          aktifIs: aktifIsler,
          bekleyenIsIlani: bekleyenIsler.data.length,
          bekleyenOgrenci: bekleyenOgrenciler.data.length
        });
        setYukleniyor(false);
      } catch (err) {
        console.error('İstatistik getirme hatası:', err);
        setHata('Veriler yüklenirken hata oluştu');
        setYukleniyor(false);
      }
    };

    verileriGetir();
  }, []);

  const IstatistikKarti = ({ baslik, deger, renk, ikon }) => (
    <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 border-${renk}-500`}>
      <div className="flex items-center">
        <div className="flex-1">
          <h3 className="text-gray-500 text-sm">{baslik}</h3>
          <p className="text-2xl font-semibold">{deger}</p>
        </div>
        <div className="text-3xl">{ikon}</div>
      </div>
    </div>
  );

  if (yukleniyor) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (hata) {
    return (
      <AdminLayout>
        <div className="bg-red-50 p-4 rounded-md text-red-500">
          {hata}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Yönetim Paneli</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <IstatistikKarti
            baslik="Toplam Öğrenci"
            deger={istatistikler.toplamOgrenci}
            renk="blue"
            ikon="👨‍🎓"
          />
          <IstatistikKarti
            baslik="Toplam İşveren"
            deger={istatistikler.toplamIsveren}
            renk="green"
            ikon="🏢"
          />
          <IstatistikKarti
            baslik="Aktif İşler"
            deger={istatistikler.aktifIs}
            renk="purple"
            ikon="⚡"
          />
          <IstatistikKarti
            baslik="Bekleyen İşlemler"
            deger={istatistikler.bekleyenIsIlani + istatistikler.bekleyenOgrenci}
            renk="yellow"
            ikon="⏳"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Bekleyen Onaylar</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span>Bekleyen İş İlanları</span>
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                  {istatistikler.bekleyenIsIlani}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span>Bekleyen Öğrenci Kayıtları</span>
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                  {istatistikler.bekleyenOgrenci}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Hızlı İşlemler</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Yeni Mesaj Gönder
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                İş Atama
              </button>
              <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
                Rapor Görüntüle
              </button>
              <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                Ayarlar
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;