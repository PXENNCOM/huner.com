// pages/student/components/ProjectIdeas/ProjectIdeaDetailModal.jsx
import React, { useState, useEffect } from 'react';
import { getProjectIdeaDetails } from '../../../../services/api';
import { MdClose, MdLightbulb, MdAccessTime, MdCode, MdCheckCircle, MdLink, MdStar, MdRocketLaunch } from 'react-icons/md';

const ProjectIdeaDetailModal = ({ isOpen, onClose, projectId }) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && projectId) {
      fetchProjectDetails();
    }
  }, [isOpen, projectId]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProjectIdeaDetails(projectId);
      setProject(response.data);
    } catch (error) {
      console.error('Proje detayını çekerken hata:', error);
      setError('Proje detayı yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Kolay': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Orta': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Zor': 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[difficulty] || 'bg-blue-500/20 text-blue-400 border-blue-500/30';
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="absolute inset-4 md:inset-8 lg:inset-16 bg-blue-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-blue-800/50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-blue-800/50 bg-blue-800/30">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-600/30 rounded-lg border border-yellow-600/50">
              <MdLightbulb className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Proje Detayı</h2>
              <p className="text-sm text-blue-200">Proje fikrini keşfet</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-blue-200 hover:text-white hover:bg-blue-700/50 rounded-lg transition-all duration-200"
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="h-full overflow-y-auto pb-20">
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
            </div>
          )}

          {error && (
            <div className="p-6 m-6 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
              {error}
            </div>
          )}

          {project && (
            <div className="p-6 space-y-6">
              {/* Project Header */}
              <div className="bg-blue-800/30 rounded-xl p-6 border border-blue-700/30">
                {/* Project Image */}
                {project.image && (
                  <div className="relative mb-6">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Project Info */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white mb-3">{project.title}</h1>
                    
                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <div className="flex items-center text-blue-200">
                        <span className="mr-2 text-lg">{getCategoryIcon(project.category)}</span>
                        <span className="font-medium">{project.category}</span>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(project.difficulty)}`}>
                        {project.difficulty}
                      </div>
                      
                      <div className="flex items-center text-blue-200">
                        <MdAccessTime className="w-4 h-4 mr-2 text-blue-400" />
                        <span>{project.estimatedDays} gün</span>
                        {project.timeCategory && (
                          <span className="ml-2 text-sm text-blue-300">({project.timeCategory})</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Description */}
              <div className="bg-blue-800/30 rounded-xl p-6 border border-blue-700/30">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <span className="mr-2">📋</span>
                  Proje Açıklaması
                </h3>
                <div className="text-blue-200 whitespace-pre-line leading-relaxed">
                  {project.description}
                </div>
              </div>

              {/* Technologies */}
              {project.technologiesArray && project.technologiesArray.length > 0 && (
                <div className="bg-blue-800/30 rounded-xl p-6 border border-blue-700/30">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <MdCode className="w-5 h-5 mr-2 text-blue-400" />
                    Kullanılacak Teknolojiler
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologiesArray.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-blue-600/20 text-blue-300 rounded-lg font-medium border border-blue-600/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {project.requirementsArray && project.requirementsArray.length > 0 && (
                <div className="bg-blue-800/30 rounded-xl p-6 border border-blue-700/30">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <MdCheckCircle className="w-5 h-5 mr-2 text-green-400" />
                    Ön Gereksinimler
                  </h3>
                  <ul className="space-y-3">
                    {project.requirementsArray.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-blue-200">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Resources */}
              {project.resourcesArray && project.resourcesArray.length > 0 && (
                <div className="bg-blue-800/30 rounded-xl p-6 border border-blue-700/30">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <MdLink className="w-5 h-5 mr-2 text-purple-400" />
                    Faydalı Kaynaklar
                  </h3>
                  <ul className="space-y-3">
                    {project.resourcesArray.map((resource, index) => (
                      <li key={index} className="flex items-start">
                        <MdLink className="w-4 h-4 mt-1 mr-3 text-purple-400 flex-shrink-0" />
                        {resource.startsWith('http') ? (
                          <a
                            href={resource}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-300 underline break-all"
                          >
                            {resource}
                          </a>
                        ) : (
                          <span className="text-blue-200">{resource}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Project Summary */}
              <div className="bg-blue-800/30 rounded-xl p-6 border border-blue-700/30">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <span className="mr-2">📊</span>
                  Proje Özeti
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-blue-700/30 rounded-lg border border-blue-600/30">
                    <span className="text-blue-300">Kategori:</span>
                    <span className="font-medium text-white flex items-center">
                      <span className="mr-2">{getCategoryIcon(project.category)}</span>
                      {project.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-700/30 rounded-lg border border-blue-600/30">
                    <span className="text-blue-300">Zorluk:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(project.difficulty)}`}>
                      {project.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-700/30 rounded-lg border border-blue-600/30">
                    <span className="text-blue-300">Tahmini Süre:</span>
                    <span className="font-medium text-white">{project.estimatedDays} gün</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-700/30 rounded-lg border border-blue-600/30">
                    <span className="text-blue-300">Teknoloji:</span>
                    <span className="font-medium text-white">
                      {project.technologiesArray ? project.technologiesArray.length : 0} adet
                    </span>
                  </div>
                </div>

                {/* Additional Info */}
                {project.difficultyInfo && (
                  <div className="mt-4 p-3 bg-blue-700/20 rounded-lg border border-blue-600/30">
                    <p className="text-sm text-blue-200">
                      <span className="font-medium text-white">Zorluk Açıklaması:</span> {project.difficultyInfo.description}
                    </p>
                  </div>
                )}

                {project.timeDescription && (
                  <div className="mt-4 p-3 bg-blue-700/20 rounded-lg border border-blue-600/30">
                    <p className="text-sm text-blue-200">
                      <span className="font-medium text-white">Süre Açıklaması:</span> {project.timeDescription}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectIdeaDetailModal;