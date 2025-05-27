import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjectIdeas, deleteProjectIdea, updateProjectIdeaStatus } from '../../services/adminApi';
import AdminLayout from './AdminLayout';

const AdminProjectIdeas = () => {
  const [projectIdeas, setProjectIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({ show: false, projectId: null, projectTitle: '' });
  const [filter, setFilter] = useState('all'); // all, active, inactive
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Kategoriler
  const categories = [
    'Web Development',
    'Mobile Development', 
    'Artificial Intelligence',
    'Game Development',
    'Data Science',
    'Cybersecurity',
    'Cloud & DevOps',
    'System Design'
  ];

  const categoryIcons = {
    'Web Development': '🌐',
    'Mobile Development': '📱',
    'Artificial Intelligence': '🤖',
    'Game Development': '🎮',
    'Data Science': '📊',
    'Cybersecurity': '🔐',
    'Cloud & DevOps': '☁️',
    'System Design': '🏗️'
  };

  useEffect(() => {
    fetchProjectIdeas();
  }, []);

  const fetchProjectIdeas = async () => {
    try {
      setLoading(true);
      const response = await getProjectIdeas();
      setProjectIdeas(response.data);
    } catch (error) {
      console.error('Proje fikirlerini getirme hatası:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                           `Server hatası: ${error.response.status}`;
        setError(errorMessage);
      } else if (error.request) {
        setError('Sunucuya ulaşılamıyor. İnternet bağlantınızı kontrol edin.');
      } else {
        setError('Proje fikirleri yüklenirken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId) => {
    try {
      await deleteProjectIdea(projectId);
      setProjectIdeas(projectIdeas.filter(project => project.id !== projectId));
      setDeleteModal({ show: false, projectId: null, projectTitle: '' });
    } catch (error) {
      console.error('Proje fikri silme hatası:', error);
      
      const errorMessage = error.response?.data?.message || 
                          'Proje fikri silinirken bir hata oluştu';
      setError(errorMessage);
    }
  };

  const handleStatusChange = async (projectId, newStatus) => {
    try {
      await updateProjectIdeaStatus(projectId, newStatus);
      // Listeyi yenile
      fetchProjectIdeas();
    } catch (error) {
      console.error('Durum güncelleme hatası:', error);
      
      const errorMessage = error.response?.data?.message || 
                          'Durum güncellenirken bir hata oluştu';
      setError(errorMessage);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', text: 'Aktif' },
      inactive: { color: 'bg-gray-100 text-gray-800', text: 'Pasif' }
    };
    
    const config = statusConfig[status] || statusConfig.inactive;
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-lg ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getDifficultyBadge = (difficulty) => {
    const difficultyConfig = {
      'Kolay': { color: 'bg-green-100 text-green-800', icon: '🟢' },
      'Orta': { color: 'bg-yellow-100 text-yellow-800', icon: '🟡' },
      'Zor': { color: 'bg-red-100 text-red-800', icon: '🔴' }
    };
    
    const config = difficultyConfig[difficulty] || difficultyConfig['Orta'];
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-lg ${config.color} flex items-center`}>
        <span className="mr-1">{config.icon}</span>
        {difficulty}
      </span>
    );
  };

  // Filtreleme
  const getFilteredProjects = () => {
    return projectIdeas.filter(project => {
      const statusMatch = filter === 'all' || project.status === filter;
      const categoryMatch = categoryFilter === 'all' || project.category === categoryFilter;
      return statusMatch && categoryMatch;
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  const filteredProjects = getFilteredProjects();

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Proje Fikri Kütüphanesi</h1>
            <p className="text-gray-600">Öğrenciler için proje fikirlerini yönetin</p>
          </div>
          <Link
            to="/admin/project-ideas/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
          >
            <span>💡</span>
            <span>Yeni Proje Fikri</span>
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Durum Filtresi</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tüm Durumlar ({projectIdeas.length})</option>
                <option value="active">Aktif ({projectIdeas.filter(p => p.status === 'active').length})</option>
                <option value="inactive">Pasif ({projectIdeas.filter(p => p.status === 'inactive').length})</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori Filtresi</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tüm Kategoriler</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {categoryIcons[category]} {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <span className="text-xl">💡</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Proje</p>
                <p className="text-2xl font-bold text-gray-900">{projectIdeas.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <span className="text-xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aktif Proje</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projectIdeas.filter(p => p.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <span className="text-xl">🎯</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Kategori Sayısı</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <span className="text-xl">⭐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ortalama Süre</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(projectIdeas.reduce((acc, p) => acc + p.estimatedDays, 0) / Math.max(projectIdeas.length, 1))} gün
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Proje Fikirleri ({filteredProjects.length})
            </h2>
          </div>
          
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💡</div>
              <p className="text-xl font-medium text-gray-900 mb-2">
                {filter === 'all' && categoryFilter === 'all' 
                  ? 'Henüz proje fikri yok' 
                  : 'Filtreye uygun proje bulunamadı'
                }
              </p>
              <p className="text-gray-600 mb-6">
                {filter === 'all' && categoryFilter === 'all'
                  ? 'İlk proje fikrinizi oluşturmak için başlayın'
                  : 'Farklı filtreler deneyerek diğer projeleri görüntüleyebilirsiniz'
                }
              </p>
              {filter === 'all' && categoryFilter === 'all' && (
                <Link
                  to="/admin/project-ideas/create"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                >
                  Yeni Proje Fikri Oluştur
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Proje Fikri
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori & Zorluk
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Süre & Teknoloji
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {project.image ? (
                              <img
                                className="h-12 w-12 rounded-lg object-cover"
                                src={project.image}
                                alt={project.title}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div className={`h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 ${project.image ? 'hidden' : 'flex'} items-center justify-center`}>
                              <span className="text-white text-xl">💡</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {project.title}
                            </div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">
                              {project.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <span className="mr-2">{categoryIcons[project.category]}</span>
                            <span className="text-sm text-gray-900">{project.category}</span>
                          </div>
                          {getDifficultyBadge(project.difficulty)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-2">
                          <div className="text-sm text-gray-900">
                            ⏱️ {project.estimatedDays} gün
                          </div>
                          {project.technologies && (
                            <div className="flex flex-wrap gap-1">
                              {project.technologies.split(',').slice(0, 2).map((tech, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                                >
                                  {tech.trim()}
                                </span>
                              ))}
                              {project.technologies.split(',').length > 2 && (
                                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                  +{project.technologies.split(',').length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={project.status}
                          onChange={(e) => handleStatusChange(project.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="active">Aktif</option>
                          <option value="inactive">Pasif</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <Link
                          to={`/admin/project-ideas/edit/${project.id}`}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg"
                        >
                          ✏️ Düzenle
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ 
                            show: true, 
                            projectId: project.id, 
                            projectTitle: project.title 
                          })}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg"
                        >
                          🗑️ Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Modal */}
        {deleteModal.show && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <span className="text-red-600 text-xl">⚠️</span>
                </div>
                <div className="mt-5 text-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    Proje Fikrini Sil
                  </h3>
                  <div className="mt-2 px-7 py-3">
                    <p className="text-sm text-gray-500">
                      "<strong>{deleteModal.projectTitle}</strong>" proje fikrini silmek istediğinizden emin misiniz? 
                      Bu işlem geri alınamaz.
                    </p>
                  </div>
                  <div className="flex justify-center space-x-4 mt-5">
                    <button
                      onClick={() => setDeleteModal({ show: false, projectId: null, projectTitle: '' })}
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                    >
                      İptal
                    </button>
                    <button
                      onClick={() => handleDelete(deleteModal.projectId)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProjectIdeas;