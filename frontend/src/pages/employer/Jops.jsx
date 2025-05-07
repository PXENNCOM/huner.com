import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getEmployerJobs } from '../../services/employerApi';
import EmployerLayout from './components/EmployerLayout';

const Jobs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  // URL'den veya location state'inden mesaj al
  const message = location.state?.message || null;

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await getEmployerJobs();
      setJobs(response.data);
      setLoading(false);
    } catch (err) {
      console.error('İş ilanları yüklenirken hata oluştu:', err);
      setError('İş ilanları yüklenirken bir hata oluştu.');
      setLoading(false);
    }
  };

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

  // Filtrelenmiş iş ilanları
  const filteredJobs = jobs.filter(job => {
    if (statusFilter === 'all') return true;
    return job.status === statusFilter;
  });

  // Durum filtrelerini oluştur
  const statusOptions = [
    { value: 'all', label: 'Tümü' },
    { value: 'pending', label: 'Onay Bekleyen' },
    { value: 'approved', label: 'Onaylanan' },
    { value: 'assigned', label: 'Atanan' },
    { value: 'in_progress', label: 'Devam Eden' },
    { value: 'completed', label: 'Tamamlanan' },
    { value: 'cancelled', label: 'İptal Edilen' }
  ];

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">İş İlanları</h1>
        <Link 
          to="/employer/jobs/create" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          + Yeni İlan
        </Link>
      </div>

      {/* Bildirim Mesajı */}
      {message && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
          <p>{message}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      {/* Filtreler */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap items-center">
          <label className="font-medium text-gray-700 mr-3">Durum:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* İş İlanları Listesi */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h3 className="text-xl font-medium text-gray-700 mb-2">Henüz iş ilanınız bulunmuyor</h3>
          <p className="text-gray-500 mb-6">İlk ilanınızı oluşturarak başlayın.</p>
          <Link 
            to="/employer/jobs/create" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md transition-colors"
          >
            İlk İlanınızı Oluşturun
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İlan Adı</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Oluşturma Tarihi</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Atanan Öğrenci</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{job.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {job.description?.substring(0, 60)}
                        {job.description?.length > 60 ? '...' : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(job.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(job.createdAt).toLocaleDateString('tr-TR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {job.assignedTo ? (
                          <span className="text-blue-600">{job.assignedStudentName || 'Atandı'}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/employer/jobs/${job.id}`} className="text-blue-600 hover:text-blue-900">
                        Detay
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </EmployerLayout>
  );
};

export default Jobs;