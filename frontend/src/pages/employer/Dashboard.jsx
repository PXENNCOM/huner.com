import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEmployerProfile, getEmployerJobs } from '../../services/employerApi';
import EmployerLayout from './components/EmployerLayout';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Profil ve iş ilanlarını getir
        const profileResponse = await getEmployerProfile();
        const jobsResponse = await getEmployerJobs();

        setProfile(profileResponse.data);
        setJobs(jobsResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Veri yüklenirken hata oluştu:', err);
        setError('Bilgiler yüklenirken bir hata oluştu.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // İş ilanı durumlarına göre renk ve etiket belirle
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Onay Bekliyor' },
      approved: { color: 'bg-green-100 text-green-800', label: 'Onaylandı' },
      assigned: { color: 'bg-blue-100 text-blue-800', label: 'Atandı' },
      in_progress: { color: 'bg-indigo-100 text-indigo-800', label: 'Devam Ediyor' },
      completed: { color: 'bg-teal-100 text-teal-800', label: 'Tamamlandı' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'İptal Edildi' }
    };

    const statusInfo = statusMap[status] || { color: 'bg-gray-100 text-gray-800', label: status };

    return (
      <span className={`px-2 py-1 rounded-full text-xs ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
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

  return (
    <EmployerLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Profil özeti kartı */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 mr-4">
              {profile?.profileImage ? (
                <img
                  src={`/uploads/profile-images/${profile.profileImage}`}
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/64?text=' + (profile.fullName?.charAt(0)?.toUpperCase() || 'İ');
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500 text-xl font-bold">
                  {profile?.fullName?.charAt(0)?.toUpperCase() || 'İ'}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{profile?.fullName || 'İsim belirtilmemiş'}</h3>
              <p className="text-gray-600 text-sm">{profile?.companyName || 'Şirket adı belirtilmemiş'}</p>
            </div>
          </div>
          <Link to="/employer/profile" className="text-blue-500 hover:text-blue-700 text-sm flex items-center">
            <span>Profili Düzenle</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        {/* İş ilanları özeti kartı */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">İş İlanları</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">{jobs.length}</div>
              <div className="text-sm text-gray-600">Toplam İlan</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">
                {jobs.filter(job => job.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Tamamlanan</div>
            </div>
          </div>
          <Link to="/employer/jobs" className="text-blue-500 hover:text-blue-700 text-sm flex items-center mt-4">
            <span>Tüm İlanları Gör</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        {/* Hızlı işlemler kartı */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Hızlı İşlemler</h3>
          <div className="space-y-3">
            <Link
              to="/employer/jobs/create"
              className="block bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors text-center"
            >
              + Yeni İş İlanı Oluştur
            </Link>
            <Link
              to="/employer/developer-request"
              className="block bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors text-center"
            >
              + Yazılımcı Talep Et
            </Link>
            <Link
              to="/employer/messages"
              className="block bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md transition-colors text-center"
            >
              Mesajları Görüntüle
            </Link>
          </div>
        </div>
      </div>

      {/* Son İş İlanları */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Son İş İlanları</h2>
          <Link to="/employer/jobs" className="text-blue-500 hover:text-blue-700 text-sm">
            Tümünü Gör
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-4">Henüz bir iş ilanı oluşturmadınız.</p>
            <Link
              to="/employer/jobs/create"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
            >
              İlk İlanınızı Oluşturun
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İlan Adı</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.slice(0, 5).map((job) => (
                  <tr key={job.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{job.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(job.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(job.createdAt).toLocaleDateString('tr-TR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Link to={`/employer/jobs/${job.id}`} className="text-blue-500 hover:text-blue-700">
                        Detay
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </EmployerLayout>
  );
};

export default Dashboard;