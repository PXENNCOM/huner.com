// pages/student/components/ProjectIdeas/ProjectIdeasPreviewCard.jsx
import React, { useState } from 'react';
import { MdLightbulb, MdArrowForward, MdAccessTime, MdCode } from 'react-icons/md';
import ProjectIdeaDetailModal from './ProjectIdeaDetailModal';

const ProjectIdeasPreviewCard = ({ projects, onOpenPanel }) => {
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [isProjectDetailOpen, setIsProjectDetailOpen] = useState(false);

  // En popüler veya yeni AI projelerini göster (ilk 3 tane)
  const featuredProjects = projects.slice(0, 3);

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Kolay': 'bg-green-500/20 text-green-400 border border-green-500/30',
      'Orta': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
      'Zor': 'bg-red-500/20 text-red-400 border border-red-500/30'
    };
    return colors[difficulty] || 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
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

  // Kategori Kısa İsimleri
  const getCategoryShortName = (category) => {
    const shortNames = {
      'Machine Learning': 'Machine Learning',
      'Deep Learning': 'Deep Learning',
      'Natural Language Processing (NLP)': 'NLP',
      'Computer Vision': 'Computer Vision',
      'Generative AI': 'Generative AI',
      'Autonomous Agents & Multi-Agent Systems': 'Multi-Agent Systems',
      'Data Science & Analytics': 'Data Science',
      'Data Engineering': 'Data Engineering',
      'Reinforcement Learning': 'Reinforcement Learning',
      'AI Ethics & Governance': 'AI Ethics'
    };
    return shortNames[category] || category;
  };

  const handleProjectClick = (projectId) => {
    setSelectedProjectId(projectId);
    setIsProjectDetailOpen(true);
  };

  const handleCloseProjectDetail = () => {
    setIsProjectDetailOpen(false);
    setSelectedProjectId(null);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-blue-800/30 to-purple-800/30 backdrop-blur-xl rounded-xl p-6 border border-blue-700/30 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-yellow-600/30 to-orange-600/30 border border-yellow-600/50 rounded-lg">
              <MdLightbulb className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white flex items-center">
                🤖 AI Proje Fikirleri
              </h2>
              <p className="text-sm text-blue-300">İlham alın, AI projeleri geliştirin</p>
            </div>
          </div>
          
          <button
            onClick={onOpenPanel}
            className="px-3 py-1.5 bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 hover:text-yellow-200 hover:bg-yellow-500/30 text-sm font-medium rounded-lg flex items-center group transition-all"
          >
            Tümünü Gör
            <MdArrowForward className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        {featuredProjects.length === 0 ? (
          <div className="text-center py-8">
            <div className="p-4 bg-gradient-to-br from-blue-700/30 to-purple-700/30 border border-blue-600/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MdLightbulb className="w-8 h-8 text-blue-300" />
            </div>
            <p className="text-blue-300 text-sm mb-2">
              Henüz AI proje fikri bulunmuyor.
            </p>
            <p className="text-blue-400 text-xs">
              Yakında yapay zeka projeleri eklenecek!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {featuredProjects.map(project => (
              <div 
                key={project.id} 
                className="bg-gradient-to-br from-blue-700/30 to-purple-700/30 border border-blue-600/30 rounded-lg p-4 hover:border-blue-500/50 hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => handleProjectClick(project.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-white text-sm line-clamp-1 group-hover:text-yellow-300 transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex items-center text-blue-300 text-xs mt-1">
                      <span className="mr-1.5">{getCategoryIcon(project.category)}</span>
                      <span className="line-clamp-1">{getCategoryShortName(project.category)}</span>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap ml-2 ${getDifficultyColor(project.difficulty)}`}>
                    {project.difficulty}
                  </div>
                </div>
                
                <p className="text-blue-300 text-xs mb-3 line-clamp-2">
                  {project.shortDescription || project.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-xs text-blue-200">
                    <div className="flex items-center bg-blue-600/30 px-2 py-1 rounded">
                      <MdAccessTime className="w-3 h-3 mr-1" />
                      <span>{project.estimatedDays} gün</span>
                    </div>
                    {project.technologiesArray && project.technologiesArray.length > 0 && (
                      <div className="flex items-center bg-purple-600/30 px-2 py-1 rounded">
                        <MdCode className="w-3 h-3 mr-1" />
                        <span>{project.technologiesArray.length} teknoloji</span>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProjectClick(project.id);
                    }}
                    className="px-2.5 py-1 bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 hover:text-yellow-200 hover:bg-yellow-500/30 font-medium text-xs rounded transition-all"
                  >
                    Detay →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        {projects.length > 0 && (
          <div className="mt-4 pt-4 border-t border-blue-700/30">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-blue-300">📊 Hızlı İstatistikler</p>
              <p className="text-xs text-blue-400">{projects.length} toplam proje</p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-gradient-to-br from-green-800/30 to-emerald-800/30 border border-green-700/30 rounded-lg p-2.5">
                <div className="text-base font-bold text-green-400">
                  {projects.filter(p => p.difficulty === 'Kolay').length}
                </div>
                <div className="text-xs text-green-300">🟢 Kolay</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-800/30 to-amber-800/30 border border-yellow-700/30 rounded-lg p-2.5">
                <div className="text-base font-bold text-yellow-400">
                  {projects.filter(p => p.difficulty === 'Orta').length}
                </div>
                <div className="text-xs text-yellow-300">🟡 Orta</div>
              </div>
              <div className="bg-gradient-to-br from-red-800/30 to-rose-800/30 border border-red-700/30 rounded-lg p-2.5">
                <div className="text-base font-bold text-red-400">
                  {projects.filter(p => p.difficulty === 'Zor').length}
                </div>
                <div className="text-xs text-red-300">🔴 Zor</div>
              </div>
            </div>
          </div>
        )}

        {/* AI Categories Quick View */}
        {projects.length > 0 && (
          <div className="mt-4 pt-4 border-t border-blue-700/30">
            <p className="text-xs text-blue-300 mb-2">🤖 Popüler Kategoriler</p>
            <div className="flex flex-wrap gap-1.5">
              {Array.from(new Set(projects.map(p => p.category)))
                .slice(0, 4)
                .map(category => (
                  <div 
                    key={category}
                    className="px-2 py-1 bg-blue-700/30 border border-blue-600/30 rounded-lg text-xs text-blue-200"
                  >
                    {getCategoryIcon(category)} {getCategoryShortName(category)}
                  </div>
                ))
              }
              {Array.from(new Set(projects.map(p => p.category))).length > 4 && (
                <button
                  onClick={onOpenPanel}
                  className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 rounded-lg text-xs hover:bg-yellow-500/30 transition-all"
                >
                  +{Array.from(new Set(projects.map(p => p.category))).length - 4} daha
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      <ProjectIdeaDetailModal 
        isOpen={isProjectDetailOpen}
        onClose={handleCloseProjectDetail}
        projectId={selectedProjectId}
      />
    </>
  );
};

export default ProjectIdeasPreviewCard;