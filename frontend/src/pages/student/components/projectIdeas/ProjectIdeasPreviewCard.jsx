// pages/student/components/ProjectIdeas/ProjectIdeasPreviewCard.jsx
import React, { useState } from 'react';
import { MdLightbulb, MdArrowForward, MdAccessTime, MdCode } from 'react-icons/md';
import ProjectIdeaDetailModal from './ProjectIdeaDetailModal';

const ProjectIdeasPreviewCard = ({ projects, onOpenPanel }) => {
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [isProjectDetailOpen, setIsProjectDetailOpen] = useState(false);

  // En popüler veya yeni projeleri göster (ilk 3 tane)
  const featuredProjects = projects.slice(0, 3);

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Kolay': 'bg-green-500/20 text-green-400',
      'Orta': 'bg-yellow-500/20 text-yellow-400',
      'Zor': 'bg-red-500/20 text-red-400'
    };
    return colors[difficulty] || 'bg-blue-500/20 text-blue-400';
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
      <div className="bg-blue-800/30 backdrop-blur-xl rounded-xl p-6 border border-blue-700/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-600/30 border border-yellow-600/50 rounded-lg">
              <MdLightbulb className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Proje Fikirleri</h2>
              <p className="text-sm text-blue-300">İlham alın, geliştirin</p>
            </div>
          </div>
          
          <button
            onClick={onOpenPanel}
            className="text-yellow-300 hover:text-yellow-200 text-sm font-medium flex items-center group"
          >
            Tümünü Gör
            <MdArrowForward className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        {featuredProjects.length === 0 ? (
          <div className="text-center py-8">
            <div className="p-4 bg-blue-700/30 border border-blue-600/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MdLightbulb className="w-8 h-8 text-blue-300" />
            </div>
            <p className="text-blue-300 text-sm">
              Henüz proje fikri bulunmuyor.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {featuredProjects.map(project => (
              <div 
                key={project.id} 
                className="bg-blue-700/30 border border-blue-600/30 rounded-lg p-4 hover:border-blue-500/50 transition-colors cursor-pointer"
                onClick={() => handleProjectClick(project.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-white text-sm line-clamp-1">
                      {project.title}
                    </h3>
                    <div className="flex items-center text-blue-300 text-xs mt-1">
                      <span className="mr-1">{getCategoryIcon(project.category)}</span>
                      <span className="line-clamp-1">{project.category}</span>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(project.difficulty)}`}>
                    {project.difficulty}
                  </div>
                </div>
                
                <p className="text-blue-300 text-xs mb-2 line-clamp-2">
                  {project.shortDescription || project.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-xs text-blue-200">
                    <div className="flex items-center">
                      <MdAccessTime className="w-3 h-3 mr-1" />
                      <span>{project.estimatedDays} gün</span>
                    </div>
                    {project.technologiesArray && project.technologiesArray.length > 0 && (
                      <div className="flex items-center">
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
                    className="text-yellow-300 hover:text-yellow-200 font-medium text-xs"
                  >
                    Detay
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        {projects.length > 0 && (
          <div className="mt-4 pt-4 border-t border-blue-700/30">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-700/30 border border-blue-600/30 rounded-lg p-2">
                <div className="text-sm font-bold text-green-400">
                  {projects.filter(p => p.difficulty === 'Kolay').length}
                </div>
                <div className="text-xs text-blue-300">Kolay</div>
              </div>
              <div className="bg-blue-700/30 border border-blue-600/30 rounded-lg p-2">
                <div className="text-sm font-bold text-yellow-400">
                  {projects.filter(p => p.difficulty === 'Orta').length}
                </div>
                <div className="text-xs text-blue-300">Orta</div>
              </div>
              <div className="bg-blue-700/30 border border-blue-600/30 rounded-lg p-2">
                <div className="text-sm font-bold text-red-400">
                  {projects.filter(p => p.difficulty === 'Zor').length}
                </div>
                <div className="text-xs text-blue-300">Zor</div>
              </div>
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