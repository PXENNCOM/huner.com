import React from 'react';
import {
  MdLightbulb,
  MdArrowForward,
  MdTimer,
  MdTrendingUp,
  MdCode,
  MdStar,
  MdBusiness,
  MdSchool,
  MdCategory
} from 'react-icons/md';

const ProjectIdeas = ({ projectIdeas, onOpenProjectIdeasPanel }) => {
  // API base URL'i
const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';

  const getDifficultyConfig = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'kolay': 
        return {
          color: 'bg-green-900/30 text-green-400 border-green-700/50',
          icon: MdTrendingUp,
          gradient: 'from-green-800 to-emerald-900'
        };
      case 'orta': 
        return {
          color: 'bg-yellow-900/30 text-yellow-400 border-yellow-700/50',
          icon: MdCode,
          gradient: 'from-yellow-800 to-orange-900'
        };
      case 'zor': 
        return {
          color: 'bg-red-900/30 text-red-400 border-red-700/50',
          icon: MdStar,
          gradient: 'from-red-800 to-pink-900'
        };
      default: 
        return {
          color: 'bg-blue-900/30 text-blue-400 border-blue-700/50',
          icon: MdLightbulb,
          gradient: 'from-blue-800 to-cyan-900'
        };
    }
  };

  const getProjectImage = (idea) => {
    // ProjectIdeasList'teki gibi direkt image field'ını kullan
    if (idea.image) {
      return idea.image; // Zaten tam URL olarak geliyor
    }
    return null;
  };

  const getCategoryIcon = (category) => {
    switch(category?.toLowerCase()) {
      case 'web': return MdCode;
      case 'mobile': return MdCode;
      case 'business': return MdBusiness;
      case 'education': return MdSchool;
      default: return MdLightbulb;
    }
  };

  const getEstimatedTimeText = (days) => {
    if (days <= 7) return `${days} gün`;
    if (days <= 30) return `${Math.ceil(days / 7)} hafta`;
    return `${Math.ceil(days / 30)} ay`;
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 shadow-lg shadow-black/20">
      {/* Header - Dark Theme */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
            <MdLightbulb className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Proje Fikirleri</h2>
            <p className="text-sm text-gray-400">{projectIdeas.length} fikir mevcut</p>
          </div>
        </div>
        <button 
          onClick={onOpenProjectIdeasPanel}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-all duration-200 shadow-lg shadow-yellow-500/30"
        >
          <span>Tümünü Gör</span>
          <MdArrowForward className="w-4 h-4" />
        </button>
      </div>
      
      {projectIdeas.length > 0 ? (
        <div className="space-y-3">
          {projectIdeas.slice(0, 3).map((idea, index) => {
            const difficultyConfig = getDifficultyConfig(idea.difficulty);
            const CategoryIcon = getCategoryIcon(idea.category);
            const isPopular = index === 0; // İlk fikri popüler olarak işaretle
            
            return (
              <div 
                key={idea.id} 
                className="flex items-center justify-between p-4 hover:bg-gray-700/50 transition-colors border border-gray-700/50 rounded-lg backdrop-blur-sm"
              >
                {/* Sol taraf - Proje görseli ve bilgileri */}
                <div className="flex items-center space-x-4 flex-1">
                  {/* Proje görseli veya ikonu */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    {getProjectImage(idea) ? (
                      <img 
                        src={getProjectImage(idea)} 
                        alt={idea.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-yellow-800 to-orange-900 flex items-center justify-center">
                        <CategoryIcon className="w-6 h-6 text-yellow-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Proje bilgileri */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-white truncate">
                        {idea.title}
                      </h3>
                      {isPopular && (
                        <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                      )}
                    </div>
                    
                    {/* Proje açıklaması */}
                    {idea.description && (
                      <p className="text-sm text-gray-400 mb-2 line-clamp-1">
                        {idea.description.length > 80 
                          ? idea.description.substring(0, 80) + '...'
                          : idea.description
                        }
                      </p>
                    )}
                    
                    {/* Alt bilgiler */}
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      {/* Kategori */}
                      <div className="flex items-center space-x-1">
                        <MdCategory className="w-4 h-4" />
                        <span>
                          {idea.category || 'Genel'}
                        </span>
                      </div>
                      
                      {/* Süre */}
                      <div className="flex items-center space-x-1">
                        <MdTimer className="w-4 h-4" />
                        <span>
                          {getEstimatedTimeText(idea.estimatedDays || idea.estimatedTime || 7)}
                        </span>
                      </div>
                      
                      {/* Zorluk seviyesi */}
                      <span className={`px-2 py-1 text-xs font-medium rounded border ${difficultyConfig.color}`}>
                        {idea.difficulty || 'Orta'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Sağ taraf - Popülerlik ve detay butonu */}
                <div className="flex items-center space-x-4">
                  {/* Popülerlik göstergesi */}
                  <div className="flex flex-col items-end min-w-[120px]">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm text-gray-400">Popülerlik</span>
                      <span className="text-sm font-medium text-white">
                        {index === 0 ? '95%' : index === 1 ? '78%' : '62%'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-300" 
                        style={{ 
                          width: index === 0 ? '95%' : index === 1 ? '78%' : '62%' 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Detay butonu */}
                  <button 
                    onClick={onOpenProjectIdeasPanel}
                    className="text-yellow-400 hover:text-yellow-300 font-medium text-sm flex items-center space-x-1 px-3 py-2 hover:bg-yellow-900/30 rounded-lg transition-colors"
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
            <MdLightbulb className="w-8 h-8 text-gray-400" />
          </div>
          
          <h3 className="text-lg font-medium text-white mb-2">Henüz proje fikri yok</h3>
          <p className="text-gray-400 text-sm mb-6">
            Yeni fikirler eklendiğinde burada görünecek.
          </p>
          
          <button 
            onClick={onOpenProjectIdeasPanel}
            className="inline-flex items-center px-6 py-3 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors shadow-lg shadow-yellow-500/30"
          >
            <MdLightbulb className="mr-2 w-5 h-5" />
            Fikirleri Keşfet
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectIdeas;