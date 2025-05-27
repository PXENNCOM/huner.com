import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Code, ExternalLink, CheckCircle, Users } from 'lucide-react';
import { getProjectIdeaDetails, getSimilarProjectIdeas } from '../../services/api';

const ProjectIdeaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [similarProjects, setSimilarProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjectDetails();
    fetchSimilarProjects();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const response = await getProjectIdeaDetails(id);
      setProject(response.data);
    } catch (error) {
      console.error('Proje detayını çekerken hata:', error);
      setError('Proje detayı yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarProjects = async () => {
    try {
      const response = await getSimilarProjectIdeas(id);
      setSimilarProjects(response.data);
    } catch (error) {
      console.error('Benzer projeleri çekerken hata:', error);
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Kolay': 'text-green-600 bg-green-100 border-green-200',
      'Orta': 'text-yellow-600 bg-yellow-100 border-yellow-200',
      'Zor': 'text-red-600 bg-red-100 border-red-200'
    };
    return colors[difficulty] || 'text-gray-600 bg-gray-100 border-gray-200';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Proje detayı yükleniyor...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😕</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {error || 'Proje bulunamadı'}
            </h3>
            <button
              onClick={() => navigate('/student/project-ideas')}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Proje Listesine Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Geri Dön Butonu */}
        <div className="mb-6">
          <Link
            to="/student/project-ideas"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Proje Listesine Dön
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ana İçerik */}
          <div className="lg:col-span-2">
            {/* Proje Görseli */}
            {project.image && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover"
                />
              </div>
            )}

            {/* Proje Başlığı ve Temel Bilgiler */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900 flex-1">
                  {project.title}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                {/* Kategori */}
                <div className="flex items-center text-gray-600">
                  <span className="mr-2 text-lg">{getCategoryIcon(project.category)}</span>
                  <span className="font-medium">{project.category}</span>
                </div>

                {/* Zorluk */}
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(project.difficulty)}`}>
                  {project.difficulty}
                </span>

                {/* Süre */}
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{project.estimatedDays} gün</span>
                  <span className="ml-2 text-sm">({project.timeCategory})</span>
                </div>
              </div>

              {/* Proje Açıklaması */}
              <div className="prose prose-gray max-w-none">
                <h3 className="text-lg font-semibold mb-3">📋 Proje Açıklaması</h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {project.description}
                </div>
              </div>
            </div>

            {/* Teknolojiler */}
            {project.technologiesArray && project.technologiesArray.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Code className="w-5 h-5 mr-2" />
                  Kullanılacak Teknolojiler
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologiesArray.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Gereksinimler */}
            {project.requirementsArray && project.requirementsArray.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Ön Gereksinimler
                </h3>
                <ul className="space-y-2">
                  {project.requirementsArray.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Kaynaklar */}
            {project.resourcesArray && project.resourcesArray.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Faydalı Kaynaklar
                </h3>
                <ul className="space-y-3">
                  {project.resourcesArray.map((resource, index) => (
                    <li key={index} className="flex items-start">
                      <ExternalLink className="w-4 h-4 mt-1 mr-3 text-blue-600 flex-shrink-0" />
                      {resource.startsWith('http') ? (
                        <a
                          href={resource}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline break-all"
                        >
                          {resource}
                        </a>
                      ) : (
                        <span className="text-gray-700">{resource}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Yan Panel */}
          <div className="lg:col-span-1">
            {/* Proje Bilgileri Özeti */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-4">📊 Proje Özeti</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Kategori:</span>
                  <span className="font-medium flex items-center">
                    <span className="mr-1">{getCategoryIcon(project.category)}</span>
                    {project.category}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Zorluk:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(project.difficulty)}`}>
                    {project.difficulty}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tahmini Süre:</span>
                  <span className="font-medium">{project.estimatedDays} gün</span>
                </div>

                {project.difficultyInfo && (
                  <div className="pt-3 border-t">
                    <p className="text-sm text-gray-600">
                      <strong>Zorluk Açıklaması:</strong> {project.difficultyInfo.description}
                    </p>
                  </div>
                )}

                {project.timeDescription && (
                  <div className="pt-3 border-t">
                    <p className="text-sm text-gray-600">
                      <strong>Süre Açıklaması:</strong> {project.timeDescription}
                    </p>
                  </div>
                )}
              </div>

              {/* Aksiyon Butonları */}
              <div className="mt-6 space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                  🚀 Projeye Başla
                </button>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors">
                  ⭐ Favorilere Ekle
                </button>
              </div>
            </div>

            {/* Benzer Projeler */}
            {similarProjects.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Benzer Projeler
                </h3>
                <div className="space-y-4">
                  {similarProjects.map(similar => (
                    <Link
                      key={similar.id}
                      to={`/student/project-ideas/${similar.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
                    >
                      <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
                        {similar.title}
                      </h4>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(similar.difficulty)}`}>
                          {similar.difficulty}
                        </span>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>{similar.estimatedDays} gün</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectIdeaDetail;