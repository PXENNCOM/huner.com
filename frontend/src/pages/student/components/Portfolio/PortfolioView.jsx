// pages/student/components/Portfolio/PortfolioView.jsx
import React from 'react';

const PortfolioView = ({ projects, onEdit, onDelete }) => {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-800/30 backdrop-blur-xl rounded-xl flex items-center justify-center border border-blue-700/30">
          <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-blue-200 mb-2">Henüz projeniz bulunmuyor</h3>
        <p className="text-blue-300 text-sm">Portfolyonuza yeni projeler ekleyerek başlayın</p>
      </div>
    );
  }

  // Proje türü etiketleri
  const typeLabels = {
    personal: 'Kişisel',
    school: 'Okul',
    huner: 'Hüner İşi',
    other: 'Diğer'
  };

  return (
    <div className="space-y-6">
      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map(project => {
          const firstMedia = project.media && project.media.length > 0 ? project.media[0] : null;
          const isVideo = firstMedia && (firstMedia.includes('.mp4') || firstMedia.includes('.webm'));
          
          // HATA DÜZELTİLDİ: project.technologies zaten bir dizi olduğu için .split() kaldırıldı.
          const technologies = Array.isArray(project.technologies) ? project.technologies : [];

          return (
            <div key={project.id} className="bg-blue-800/30 backdrop-blur-xl rounded-xl overflow-hidden hover:bg-blue-700/40 transition-colors border border-blue-700/30">
              {/* Media Preview */}
              <div className="relative h-32 bg-blue-700/30">
                {firstMedia ? (
                  isVideo ? (
                    <video 
                      src={firstMedia} 
                      className="w-full h-full object-cover"
                      muted
                    />
                  ) : (
                    <img 
                      src={firstMedia} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x200?text=Proje+Görseli';
                      }}
                    />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                {/* Project Type Badge */}
                <div className="absolute top-2 left-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-600/30 text-blue-300 border border-blue-600/50">
                    {typeLabels[project.projectType] || 'Diğer'}
                  </span>
                </div>

                {/* Visibility Badge */}
                {!project.isVisible && (
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-900/50 text-blue-200 border border-blue-700/50">
                      Gizli
                    </span>
                  </div>
                )}
              </div>
              
              {/* Project Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white truncate flex-1">
                    {project.title}
                  </h3>
                  <div className="flex items-center space-x-2 ml-2">
                    <button
                      onClick={() => onEdit(project.id)}
                      className="p-1 text-blue-300 hover:text-blue-200 hover:bg-blue-500/20 rounded transition-colors"
                      title="Düzenle"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(project)}
                      className="p-1 text-blue-300 hover:text-red-400 hover:bg-red-500/20 rounded transition-colors"
                      title="Sil"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <p className="text-blue-200 text-sm mb-3 line-clamp-2">
                  {project.description}
                </p>
                
                {/* Technologies */}
                {technologies.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {technologies.slice(0, 3).map((tech, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-700/30 text-blue-200 border border-blue-600/30"
                        >
                          {tech}
                        </span>
                      ))}
                      {technologies.length > 3 && (
                        <span className="text-xs text-blue-300 px-2 py-1">
                          +{technologies.length - 3} daha
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Links */}
                <div className="flex items-center space-x-3">
                  {project.githubUrl && (
                    <a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1.5 bg-blue-700/30 hover:bg-blue-600/40 rounded-lg transition-colors text-blue-300 hover:text-white border border-blue-600/30"
                      title="GitHub"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                  )}
                  
                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1.5 bg-blue-700/30 hover:bg-blue-600/40 rounded-lg transition-colors text-blue-300 hover:text-white border border-blue-600/30"
                      title="Canlı Site"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                  
                  {/* Media count */}
                  {project.media && project.media.length > 1 && (
                    <div className="flex items-center text-blue-300 text-xs">
                      <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      +{project.media.length - 1} medya
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PortfolioView;