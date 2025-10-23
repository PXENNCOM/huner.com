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

  // AI Kategori İkonları
  const getCategoryIcon = (category) => {
    const icons = {
      'Machine Learning': '🤖',
      'Deep Learning': '🧠',
      'Natural Language Processing (NLP)': '💬',
      'Computer Vision': '👁️',
      'Generative AI': '✨',
      'Autonomous Agents & Multi-Agent Systems': '🤝',
      'Data Science & Analytics': '📊',
      'Data Engineering': '⚙️',
      'Reinforcement Learning': '🎯',
      'AI Ethics & Governance': '⚖️'
    };
    return icons[category] || '🤖';
  };

  // Kategori Renkleri
  const getCategoryColor = (category) => {
    const colors = {
      'Machine Learning': 'from-blue-600/20 to-cyan-600/20 border-blue-500/30',
      'Deep Learning': 'from-purple-600/20 to-pink-600/20 border-purple-500/30',
      'Natural Language Processing (NLP)': 'from-green-600/20 to-emerald-600/20 border-green-500/30',
      'Computer Vision': 'from-indigo-600/20 to-blue-600/20 border-indigo-500/30',
      'Generative AI': 'from-yellow-600/20 to-orange-600/20 border-yellow-500/30',
      'Autonomous Agents & Multi-Agent Systems': 'from-teal-600/20 to-cyan-600/20 border-teal-500/30',
      'Data Science & Analytics': 'from-pink-600/20 to-rose-600/20 border-pink-500/30',
      'Data Engineering': 'from-slate-600/20 to-gray-600/20 border-slate-500/30',
      'Reinforcement Learning': 'from-orange-600/20 to-red-600/20 border-orange-500/30',
      'AI Ethics & Governance': 'from-violet-600/20 to-purple-600/20 border-violet-500/30'
    };
    return colors[category] || 'from-blue-600/20 to-purple-600/20 border-blue-500/30';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="absolute inset-4 md:inset-8 lg:inset-16 bg-gradient-to-br from-blue-900/95 to-purple-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-blue-800/50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-blue-800/50 bg-gradient-to-r from-blue-800/30 to-purple-800/30">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-yellow-600/30 to-orange-600/30 rounded-lg border border-yellow-600/50">
              <MdLightbulb className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white flex items-center">
                Proje Detayı
              </h2>
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
            <div className="flex flex-col justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mb-4"></div>
              <p className="text-blue-300">AI projesi yükleniyor...</p>
            </div>
          )}

          {error && (
            <div className="p-6 m-6 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
              <span className="mr-2">⚠️</span>
              {error}
            </div>
          )}

          {project && (
            <div className="p-6 space-y-6">
              {/* Project Header */}
              <div className={`bg-gradient-to-br ${getCategoryColor(project.category)} rounded-xl p-6 border`}>
                {/* Project Image */}
                {project.image && (
                  <div className="relative mb-6">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover rounded-lg border border-blue-700/30"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-lg border border-white/20">
                      <span className="text-white text-sm font-medium">
                        {getCategoryIcon(project.category)} AI Project
                      </span>
                    </div>
                  </div>
                )}

                {/* Project Info */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white mb-3">{project.title}</h1>
                    
                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <div className="flex items-center px-3 py-1.5 bg-blue-700/30 border border-blue-600/30 rounded-lg text-blue-200">
                        <span className="mr-2 text-lg">{getCategoryIcon(project.category)}</span>
                        <span className="font-medium text-sm">{project.category}</span>
                      </div>
                      
                      <div className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${getDifficultyColor(project.difficulty)}`}>
                        {project.difficulty === 'Kolay' && '🟢'}
                        {project.difficulty === 'Orta' && '🟡'}
                        {project.difficulty === 'Zor' && '🔴'}
                        {' '}{project.difficulty}
                      </div>
                      
                      <div className="flex items-center px-3 py-1.5 bg-purple-700/30 border border-purple-600/30 rounded-lg text-purple-200">
                        <MdAccessTime className="w-4 h-4 mr-2 text-purple-400" />
                        <span className="text-sm font-medium">{project.estimatedDays} gün</span>
                        {project.timeCategory && (
                          <span className="ml-2 text-xs text-purple-300">({project.timeCategory})</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Description */}
              <div className="bg-gradient-to-br from-blue-800/30 to-purple-800/30 rounded-xl p-6 border border-blue-700/30">
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
                <div className="bg-gradient-to-br from-blue-800/30 to-purple-800/30 rounded-xl p-6 border border-blue-700/30">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <MdCode className="w-5 h-5 mr-2 text-blue-400" />
                    Kullanılacak AI Teknolojileri ve Araçları
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologiesArray.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-gradient-to-r from-blue-600/30 to-cyan-600/30 text-blue-300 rounded-lg font-medium border border-blue-500/30 hover:border-blue-400/50 transition-all"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {project.requirementsArray && project.requirementsArray.length > 0 && (
                <div className="bg-gradient-to-br from-blue-800/30 to-purple-800/30 rounded-xl p-6 border border-blue-700/30">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <MdCheckCircle className="w-5 h-5 mr-2 text-green-400" />
                    Ön Gereksinimler & Bilmeniz Gerekenler
                  </h3>
                  <ul className="space-y-3">
                    {project.requirementsArray.map((req, index) => (
                      <li key={index} className="flex items-start p-3 bg-blue-700/20 rounded-lg border border-blue-600/20 hover:border-blue-500/30 transition-all">
                        <div className="w-6 h-6 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                          <MdCheckCircle className="w-4 h-4 text-green-400" />
                        </div>
                        <span className="text-blue-200">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Resources */}
              {project.resourcesArray && project.resourcesArray.length > 0 && (
                <div className="bg-gradient-to-br from-blue-800/30 to-purple-800/30 rounded-xl p-6 border border-blue-700/30">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <MdLink className="w-5 h-5 mr-2 text-purple-400" />
                    Faydalı AI Kaynakları ve Dökümanlar
                  </h3>
                  <ul className="space-y-3">
                    {project.resourcesArray.map((resource, index) => (
                      <li key={index} className="flex items-start p-3 bg-purple-700/20 rounded-lg border border-purple-600/20 hover:border-purple-500/30 transition-all">
                        <div className="w-6 h-6 bg-purple-500/20 border border-purple-500/30 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                          <MdLink className="w-4 h-4 text-purple-400" />
                        </div>
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

              

              {/* Call to Action */}
              <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-xl p-6 border border-yellow-500/30">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                    <MdRocketLaunch className="w-6 h-6 text-yellow-300" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-2">Projeyi Başlatmaya Hazır mısınız?</h4>
                    <p className="text-yellow-200 text-sm mb-4">
                      Bu AI projesini gerçekleştirerek yapay zeka alanında deneyim kazanabilir ve portföyünüzü güçlendirebilirsiniz.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 rounded-lg text-xs">
                        ✨ Pratik Yapın
                      </span>
                      <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 rounded-lg text-xs">
                        🎯 Hedef Belirleyin
                      </span>
                      <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 rounded-lg text-xs">
                        🚀 Hemen Başlayın
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectIdeaDetailModal;