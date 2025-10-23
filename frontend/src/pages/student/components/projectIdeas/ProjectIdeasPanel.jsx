// pages/student/components/ProjectIdeas/ProjectIdeasPanel.jsx
import React, { useState, useEffect } from 'react';
import { getActiveProjectIdeas } from '../../../../services/api';
import ProjectIdeaCard from './ProjectIdeaCard';
import ProjectIdeaDetailModal from './ProjectIdeaDetailModal';
import { MdClose, MdLightbulb, MdSearch, MdFilterList } from 'react-icons/md';

const ProjectIdeasPanel = ({ isOpen, onClose }) => {
  const [projectIdeas, setProjectIdeas] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [isProjectDetailOpen, setIsProjectDetailOpen] = useState(false);

  // AI Kategorileri
  const categories = [
    { value: 'all', label: 'Tümü', icon: '📚' },
    { value: 'Machine Learning', label: 'ML', icon: '🤖' },
    { value: 'Deep Learning', label: 'DL', icon: '🧠' },
    { value: 'Natural Language Processing (NLP)', label: 'NLP', icon: '💬' },
    { value: 'Computer Vision', label: 'CV', icon: '👁️' },
    { value: 'Generative AI', label: 'Gen AI', icon: '✨' },
    { value: 'Autonomous Agents & Multi-Agent Systems', label: 'Agents', icon: '🤝' },
    { value: 'Data Science & Analytics', label: 'Data', icon: '📊' },
    { value: 'Data Engineering', label: 'DE', icon: '⚙️' },
    { value: 'Reinforcement Learning', label: 'RL', icon: '🎯' },
    { value: 'AI Ethics & Governance', label: 'Ethics', icon: '⚖️' }
  ];

  const difficulties = [
    { value: 'all', label: 'Tümü', icon: '⚡' },
    { value: 'Kolay', label: 'Kolay', icon: '🟢' },
    { value: 'Orta', label: 'Orta', icon: '🟡' },
    { value: 'Zor', label: 'Zor', icon: '🔴' }
  ];

  useEffect(() => {
    if (isOpen) {
      fetchProjectIdeas();
    }
  }, [isOpen]);

  useEffect(() => {
    filterProjects();
  }, [projectIdeas, searchTerm, selectedCategory, selectedDifficulty]);

  const fetchProjectIdeas = async () => {
    try {
      setLoading(true);
      const response = await getActiveProjectIdeas();
      setProjectIdeas(response.data);
      setFilteredProjects(response.data);
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
        (project.technologies && project.technologies.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (project.category && project.category.toLowerCase().includes(searchTerm.toLowerCase()))
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

  const handleProjectClick = (projectId) => {
    setSelectedProjectId(projectId);
    setIsProjectDetailOpen(true);
  };

  const handleCloseProjectDetail = () => {
    setIsProjectDetailOpen(false);
    setSelectedProjectId(null);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Panel */}
        <div className="absolute right-0 top-0 h-full w-full max-w-md bg-gradient-to-br from-blue-900/95 to-purple-900/95 backdrop-blur-xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-blue-800/50 bg-gradient-to-r from-blue-800/30 to-purple-800/30 backdrop-blur-xl">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-yellow-600/30 to-orange-600/30 border border-yellow-600/50 rounded-lg">
                <MdLightbulb className="w-5 h-5 text-yellow-300" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white flex items-center">
                  🤖 Proje Fikirleri
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-blue-300 hover:text-white hover:bg-blue-700/50 rounded-lg transition-all duration-200"
            >
              <MdClose className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="h-full overflow-y-auto pb-20">
            {/* Search Bar */}
            <div className="p-4 border-b border-blue-700/30">
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                <input
                  type="text"
                  placeholder="(örn: sentiment, image)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-blue-800/30 border border-blue-700/30 rounded-lg text-white placeholder-blue-300/70 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="p-4 border-b border-blue-700/30">
              <div className="flex items-center space-x-2 mb-3">
                <MdFilterList className="w-4 h-4 text-blue-300" />
                <span className="text-sm text-blue-300">Kategorileri ve Filtreler</span>
              </div>

              {/* Category Filter */}
              <div className="mb-3">
                <p className="text-xs text-blue-300 mb-2 flex items-center">
                  <span className="mr-1">🤖</span> Kategoriler
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map(category => (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                        selectedCategory === category.value
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black shadow-lg shadow-yellow-500/30'
                          : 'bg-blue-700/30 border border-blue-600/30 text-blue-200 hover:bg-blue-600/50 hover:text-white hover:border-blue-500/50'
                      }`}
                      title={category.value !== 'all' ? category.value : 'Tüm Kategoriler'}
                    >
                      <span className="mr-1">{category.icon}</span>
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div>
                <p className="text-xs text-blue-300 mb-2 flex items-center">
                  <span className="mr-1">📊</span> Zorluk Seviyesi
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {difficulties.map(difficulty => (
                    <button
                      key={difficulty.value}
                      onClick={() => setSelectedDifficulty(difficulty.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                        selectedDifficulty === difficulty.value
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black shadow-lg shadow-yellow-500/30'
                          : 'bg-blue-700/30 border border-blue-600/30 text-blue-200 hover:bg-blue-600/50 hover:text-white hover:border-blue-500/50'
                      }`}
                    >
                      <span className="mr-1">{difficulty.icon}</span>
                      {difficulty.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {(selectedCategory !== 'all' || selectedDifficulty !== 'all' || searchTerm) && (
              <div className="p-4 border-b border-blue-700/30">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-blue-300">Aktif Filtreler:</p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedDifficulty('all');
                      setSearchTerm('');
                    }}
                    className="text-xs text-yellow-400 hover:text-yellow-300 underline"
                  >
                    Temizle
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {searchTerm && (
                    <span className="px-2 py-1 bg-purple-700/30 border border-purple-600/30 rounded-lg text-xs text-purple-200">
                      🔍 "{searchTerm}"
                    </span>
                  )}
                  {selectedCategory !== 'all' && (
                    <span className="px-2 py-1 bg-blue-700/30 border border-blue-600/30 rounded-lg text-xs text-blue-200">
                      {categories.find(c => c.value === selectedCategory)?.icon} {categories.find(c => c.value === selectedCategory)?.label}
                    </span>
                  )}
                  {selectedDifficulty !== 'all' && (
                    <span className="px-2 py-1 bg-blue-700/30 border border-blue-600/30 rounded-lg text-xs text-blue-200">
                      {difficulties.find(d => d.value === selectedDifficulty)?.icon} {selectedDifficulty}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col justify-center items-center p-8">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-yellow-500 mb-3"></div>
                <p className="text-blue-300 text-sm">AI projeleri yükleniyor...</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredProjects.length === 0 && (
              <div className="p-8 text-center">
                <div className="p-4 bg-gradient-to-br from-blue-800/30 to-purple-800/30 border border-blue-700/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <MdLightbulb className="w-8 h-8 text-blue-300" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">AI projesi bulunamadı</h3>
                <p className="text-blue-300 text-sm mb-3">
                  {searchTerm 
                    ? `"${searchTerm}" için sonuç bulunamadı`
                    : 'Bu filtrelere uygun proje bulunmuyor'
                  }
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedDifficulty('all');
                    setSearchTerm('');
                  }}
                  className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 rounded-lg text-sm hover:bg-yellow-500/30 transition-all"
                >
                  Filtreleri Temizle
                </button>
              </div>
            )}

            {/* Projects List */}
            {!loading && filteredProjects.length > 0 && (
              <div className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-sm text-blue-300">
                    <span className="font-medium text-white">{filteredProjects.length}</span> AI projesi bulundu
                  </div>
                  {filteredProjects.length !== projectIdeas.length && (
                    <div className="text-xs text-blue-400">
                      / {projectIdeas.length} toplam
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  {filteredProjects.map(project => (
                    <ProjectIdeaCard 
                      key={project.id} 
                      project={project} 
                      onViewDetails={() => handleProjectClick(project.id)}
                      compact={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            {!loading && projectIdeas.length > 0 && (
              <div className="p-4 border-t border-blue-700/30">
                <p className="text-xs text-blue-300 mb-3 flex items-center">
                  <span className="mr-1">📊</span> Hızlı İstatistikler
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gradient-to-br from-green-800/30 to-emerald-800/30 border border-green-700/30 rounded-lg p-3">
                    <div className="text-lg font-bold text-green-400">
                      {projectIdeas.filter(p => p.difficulty === 'Kolay').length}
                    </div>
                    <div className="text-xs text-green-300">🟢 Kolay</div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-800/30 to-amber-800/30 border border-yellow-700/30 rounded-lg p-3">
                    <div className="text-lg font-bold text-yellow-400">
                      {projectIdeas.filter(p => p.difficulty === 'Orta').length}
                    </div>
                    <div className="text-xs text-yellow-300">🟡 Orta</div>
                  </div>
                  <div className="bg-gradient-to-br from-red-800/30 to-rose-800/30 border border-red-700/30 rounded-lg p-3">
                    <div className="text-lg font-bold text-red-400">
                      {projectIdeas.filter(p => p.difficulty === 'Zor').length}
                    </div>
                    <div className="text-xs text-red-300">🔴 Zor</div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Categories Overview */}
            {!loading && projectIdeas.length > 0 && (
              <div className="p-4 border-t border-blue-700/30">
                <p className="text-xs text-blue-300 mb-3 flex items-center">
                  <span className="mr-1">🤖</span> Popüler AI Kategorileri
                </p>
                <div className="space-y-2">
                  {categories
                    .filter(cat => cat.value !== 'all')
                    .map(cat => {
                      const count = projectIdeas.filter(p => p.category === cat.value).length;
                      return count > 0 ? (
                        <div 
                          key={cat.value}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="text-blue-200">
                            {cat.icon} {cat.label}
                          </span>
                          <span className="text-blue-400 font-medium">{count}</span>
                        </div>
                      ) : null;
                    })
                    .filter(Boolean)
                  }
                </div>
              </div>
            )}
          </div>
        </div>
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

export default ProjectIdeasPanel;