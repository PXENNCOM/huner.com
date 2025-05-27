// src/pages/employer/DeveloperRequests.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EmployerLayout from './components/EmployerLayout';
import { getDeveloperRequests } from '../../services/employerApi';

const DeveloperRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await getDeveloperRequests(params);
      setRequests(response.data.requests || []);
      setLoading(false);
    } catch (err) {
      console.error('Talepler yüklenirken hata oluştu:', err);
      setError('Talepler yüklenirken bir hata oluştu.');
      setLoading(false);
    }
  };

  // Status badge'leri
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Yeni Talep' },
      reviewing: { color: 'bg-blue-100 text-blue-800', label: 'İncelemede' },
      viewed: { color: 'bg-green-100 text-green-800', label: 'Görüntülendi' },
      archived: { color: 'bg-gray-100 text-gray-800', label: 'Arşivlendi' }
    };

    const statusInfo = statusMap[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  // Öncelik badge'leri
  const getPriorityBadge = (priority) => {
    const priorityMap = {
      normal: { color: 'bg-gray-100 text-gray-800', label: 'Normal' },
      high: { color: 'bg-orange-100 text-orange-800', label: 'Yüksek' },
      urgent: { color: 'bg-red-100 text-red-800', label: 'Acil' }
    };

    const priorityInfo = priorityMap[priority] || { color: 'bg-gray-100 text-gray-800', label: priority };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityInfo.color}`}>
        {priorityInfo.label}
      </span>
    );
  };

  // Proje tipi etiketleri
  const getProjectTypeLabel = (type) => {
    const typeMap = {
      website: 'Web Sitesi',
      mobile_app: 'Mobil Uygulama',
      api: 'API',
      ecommerce: 'E-ticaret',
      crm: 'CRM',
      desktop_app: 'Masaüstü Uygulaması',
      other: 'Diğer'
    };
    return typeMap[type] || type;
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
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Yazılımcı Taleplerim</h1>
            <p className="text-gray-600 mt-1">Gönderdiğiniz yazılımcı taleplerini görüntüleyin ve takip edin.</p>
          </div>
          <Link
            to="/employer/developer-request"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors font-medium"
          >
            + Yeni Talep Oluştur
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}

        {/* Filtreler */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tümü ({requests.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'pending' 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Yeni Talepler
            </button>
            <button
              onClick={() => setFilter('reviewing')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'reviewing' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              İncelemede
            </button>
            <button
              onClick={() => setFilter('viewed')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'viewed' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Görüntülendi
            </button>
          </div>
        </div>

        {/* Talepler Listesi */}
        {requests.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz talep yok</h3>
            <p className="text-gray-500 mb-4">
              {filter === 'all' 
                ? 'Henüz hiç yazılımcı talebi oluşturmadınız.' 
                : `${filter} durumunda hiç talep yok.`}
            </p>
            <Link
              to="/employer/developer-request"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              İlk Talebinizi Oluşturun
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Proje
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tip
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deneyim
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
                  {requests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                            {request.projectTitle}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {request.projectDescription?.substring(0, 80)}...
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {getProjectTypeLabel(request.projectType)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 capitalize">
                          {request.experienceLevel === 'intern' ? 'Stajyer' :
                           request.experienceLevel === 'junior' ? 'Junior' :
                           request.experienceLevel === 'mid' ? 'Mid-level' : 'Senior'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(request.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPriorityBadge(request.priority)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/employer/developer-requests/${request.id}`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Detay
                        </Link>
                        {request.status === 'pending' && (
                          <Link
                            to={`/employer/developer-requests/${request.id}/edit`}
                            className="text-green-600 hover:text-green-900"
                          >
                            Düzenle
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </EmployerLayout>
  );
};

export default DeveloperRequests;