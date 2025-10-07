import React from 'react';
import {
  MdCollections,
  MdArrowForward,
  MdAdd,
  MdCode,
  MdLaunch,
  MdStar,
  MdSchedule,
  MdTrendingUp,
  MdBusiness
} from 'react-icons/md';

const RecentProjects = ({ projects, onOpenPortfolioPanel }) => {
  // API base URL'i - api.js'teki ile tutarlı olacak şekilde
  const API_BASE_URL = 'http://localhost:3001';

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 shadow-lg shadow-black/20">
      {/* Header - Dark Theme */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <MdCollections className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Son Projelerim</h2>
            <p className="text-sm text-gray-400">{projects.length} aktif proje</p>
          </div>
        </div>
        <button 
          onClick={onOpenPortfolioPanel}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-all duration-200 shadow-lg shadow-blue-500/30"
        >
          <span>Tümünü Gör</span>
          <MdArrowForward className="w-4 h-4" />
        </button>
      </div>
      
      {projects.length > 0 ? (
        <div className="space-y-3">
          {projects.map((project, index) => {
            return (
              <div 
                key={project.id} 
                className="flex items-center justify-between p-4 hover:bg-gray-700/50 transition-colors border border-gray-700/50 rounded-lg backdrop-blur-sm"
              >
                {/* Sol taraf - Proje görseli ve bilgileri */}
                <div className="flex items-center space-x-4 flex-1">
                  {/* Proje görseli veya ikonu */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    {(() => {
                      if (project.media) {
                        // Hook'ta zaten işlenmiş ve array ise (medya URL'leri tam)
                        if (Array.isArray(project.media) && project.media.length > 0) {
                          return (
                            <img 
                              src={project.media[0]} 
                              alt={project.title} 
                              className="w-full h-full object-cover"
                            />
                          );
                        } 
                        // Eğer hala JSON string ise (fallback)
                        else if (typeof project.media === 'string') {
                          try {
                            const parsedMedia = JSON.parse(project.media);
                            if (Array.isArray(parsedMedia) && parsedMedia.length > 0) {
                              const mediaPath = parsedMedia[0];
                              const path = mediaPath.startsWith('/') ? mediaPath : `/uploads/project-media/${mediaPath}`;
                              const fullUrl = `${API_BASE_URL}${path}`;
                              return (
                                <img 
                                  src={fullUrl} 
                                  alt={project.title} 
                                  className="w-full h-full object-cover"
                                />
                              );
                            }
                          } catch (e) {
                            console.error('Error parsing media for project', project.id, ':', e);
                          }
                        }
                      }
                      // Varsayılan ikon
                      return (
                        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                          <MdTrendingUp className="w-6 h-6 text-blue-400" />
                        </div>
                      );
                    })()}
                  </div>
                  
                  {/* Proje bilgileri */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-white truncate">
                        {project.title}
                      </h3>
                      {index === 0 && (
                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                      )}
                    </div>
                    
                    {/* Proje açıklaması */}
                    {project.description && (
                      <p className="text-sm text-gray-400 mb-2 line-clamp-1">
                        {project.description.length > 80 
                          ? project.description.substring(0, 80) + '...'
                          : project.description
                        }
                      </p>
                    )}
                    
                    {/* Alt bilgiler */}
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      {/* Teknolojiler */}
                      <div className="flex items-center space-x-1">
                        <MdCode className="w-4 h-4" />
                        <span>
                          {(() => {
                            if (!project.technologies) return 'Teknoloji belirtilmemiş';
                            try {
                              const techArray = JSON.parse(project.technologies);
                              if (Array.isArray(techArray) && techArray.length > 0) {
                                return techArray.length > 1 
                                  ? `${techArray[0]} +${techArray.length - 1}` 
                                  : techArray[0];
                              }
                              return 'Teknoloji belirtilmemiş';
                            } catch (e) {
                              const techArray = project.technologies.split(',').map(t => t.trim()).filter(t => t);
                              if (techArray.length > 0) {
                                return techArray.length > 1 
                                  ? `${techArray[0]} +${techArray.length - 1}` 
                                  : techArray[0];
                              }
                              return 'Teknoloji belirtilmemiş';
                            }
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Sağ taraf - İlerleme ve detay butonu */}
                <div className="flex items-center space-x-4">
                  {/* İlerleme çubuğu */}
                  <div className="flex flex-col items-end min-w-[120px]">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm text-gray-400">İlerleme</span>
                      <span className="text-sm font-medium text-white">
                        {index === 0 ? '75%' : index === 1 ? '90%' : '100%'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                        style={{ 
                          width: index === 0 ? '75%' : index === 1 ? '90%' : '100%' 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Detay butonu */}
                  <button 
                    onClick={onOpenPortfolioPanel}
                    className="text-blue-400 hover:text-blue-300 font-medium text-sm flex items-center space-x-1 px-3 py-2 hover:bg-blue-900/30 rounded-lg transition-colors"
                  >
                    <span>Detay</span>
                    <MdArrowForward className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-700/50 rounded-2xl flex items-center justify-center">
            <MdCollections className="w-8 h-8 text-gray-400" />
          </div>
          
          <h3 className="text-lg font-medium text-white mb-2">Henüz proje yok!</h3>
          <p className="text-gray-400 text-sm mb-6">
            İlk projenizi ekleyerek portfolyonuzu oluşturmaya başlayın.
          </p>
          
          <button 
            onClick={onOpenPortfolioPanel}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
          >
            <MdAdd className="mr-2 w-5 h-5" />
            İlk Projeyi Ekle
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentProjects;