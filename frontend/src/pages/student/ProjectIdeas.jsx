import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Clock, Star, Code } from 'lucide-react';
import { getActiveProjectIdeas } from '../../services/api';

const ProjectIdeasList = () => {
  const [projectIdeas, setProjectIdeas] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const categories = [
    { value: 'all', label: 'Tüm Kategoriler' },
    { value: 'Web Development', label: 'Web Development', icon: '🌐' },
    { value: 'Mobile Development', label: 'Mobile Development', icon: '📱' },
    { value: 'Artificial Intelligence', label: 'Artificial Intelligence', icon: '🤖' },
    { value: 'Game Development', label: 'Game Development', icon: '🎮' },
    { value: 'Data Science', label: 'Data Science', icon: '📊' },
    { value: 'Cybersecurity', label: 'Cybersecurity', icon: '🔐' },
    { value: 'Cloud & DevOps', label: 'Cloud & DevOps', icon: '☁️' },
    { value: 'System Design', label: 'System Design', icon: '🏗️' }
  ];

  const difficulties = [
    { value: 'all', label: 'Tüm Seviyeler' },
    { value: 'Kolay', label: 'Kolay', color: 'text-green-600 bg-green-100' },
    { value: 'Orta', label: 'Orta', color: 'text-yellow-600 bg-yellow-100' },
    { value: 'Zor', label: 'Zor', color: 'text-red-600 bg-red-100' }
  ];

  // API'den proje fikirlerini çek
  useEffect(() => {
    fetchProjectIdeas();
  }, []);

  // Filtreleme ve arama
  useEffect(() => {
    filterProjects();
  }, [projectIdeas, searchTerm, selectedCategory, selectedDifficulty]);

  const fetchProjectIdeas = async () => {
    try {
      const params = {
        category: selectedCategory,
        difficulty: selectedDifficulty,
        search: searchTerm
      };
      const response = await getActiveProjectIdeas(params);
      setProjectIdeas(response.data);
    } catch (error) {
      console.error('Proje fikirlerini çekerken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = [...projectIdeas];

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.technologies && project.technologies.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Kategori filtresi
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    // Zorluk filtresi
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(project => project.difficulty === selectedDifficulty);
    }

    setFilteredProjects(filtered);
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Kolay': 'text-green-600 bg-green-100',
      'Orta': 'text-yellow-600 bg-yellow-100',
      'Zor': 'text-red-600 bg-red-100'
    };
    return colors[difficulty] || 'text-gray-600 bg-gray-100';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Web Development': '🌐',
      'Mobile Development': '📱',
      'Artificial Intelligence': '🤖',
      'Game Development': '🎮',
      'Data Science': '📊',
      'Cybersecurity': '🔐',
      'Cloud & DevOps': '☁️',
      'System Design': '🏗️'
    };
    return icons[category] || '💻';
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleDifficultyChange = (e) => {
    setSelectedDifficulty(e.target.value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Proje fikirleri yükleniyor...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            💡 Proje Fikirleri Kütüphanesi
          </h1>
          <p className="text-gray-600">
            İlham alın, yeni projeler keşfedin ve yeteneklerinizi geliştirin
          </p>
        </div>

        {/* Filtreleme ve Arama */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Arama */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Proje ara..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Kategori Filtresi */}
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon && `${cat.icon} `}{cat.label}
                </option>
              ))}
            </select>

            {/* Zorluk Filtresi */}
            <select
              value={selectedDifficulty}
              onChange={handleDifficultyChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {difficulties.map(diff => (
                <option key={diff.value} value={diff.value}>
                  {diff.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sonuç sayısı */}
        <div className="mb-6">
          <p className="text-gray-600">
            <span className="font-semibold">{filteredProjects.length}</span> proje fikri bulundu
          </p>
        </div>

        {/* Proje Kartları */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Hiç proje fikri bulunamadı
            </h3>
            <p className="text-gray-600">
              Farklı filtreler veya arama terimleri deneyebilirsiniz
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <div key={project.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                {/* Proje Görseli */}
                {project.image && (
                  <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6">
                  {/* Kategori ve Zorluk */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600 flex items-center">
                      <span className="mr-1">{getCategoryIcon(project.category)}</span>
                      {project.category}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(project.difficulty)}`}>
                      {project.difficulty}
                    </span>
                  </div>

                  {/* Başlık */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {project.title}
                  </h3>

                  {/* Açıklama */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {project.shortDescription || project.description}
                  </p>

                  {/* Süre */}
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{project.estimatedDays} gün</span>
                  </div>

                  {/* Teknolojiler */}
                  {project.technologiesArray && project.technologiesArray.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {project.technologiesArray.slice(0, 3).map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologiesArray.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{project.technologiesArray.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Detay Butonu */}
                  <Link
                    to={`/student/project-ideas/${project.id}`}
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Detayları Görüntüle
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectIdeasList;