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

  const categories = [
    { value: 'all', label: 'Tümü', icon: '📚' },
    { value: 'Web Development', label: 'Web', icon: '🌐' },
    { value: 'Mobile Development', label: 'Mobile', icon: '📱' },
    { value: 'Artificial Intelligence', label: 'AI', icon: '🤖' },
    { value: 'Game Development', label: 'Game', icon: '🎮' },
    { value: 'Data Science', label: 'Data', icon: '📊' },
    { value: 'Cybersecurity', label: 'Security', icon: '🔐' },
    { value: 'Cloud & DevOps', label: 'Cloud', icon: '☁️' },
    { value: 'System Design', label: 'System', icon: '🏗️' }
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
        <div className="absolute right-0 top-0 h-full w-full max-w-md bg-blue-900/95 backdrop-blur-xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-blue-800/50 bg-blue-800/30 backdrop-blur-xl">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-600/30 border border-yellow-600/50 rounded-lg">
                <MdLightbulb className="w-5 h-5 text-yellow-300" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Proje Fikirleri</h2>
                <p className="text-sm text-blue-300">İlham alın, proje geliştirin</p>
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
                  placeholder="Proje ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-blue-800/30 border border-blue-700/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="p-4 border-b border-blue-700/30">
              <div className="flex items-center space-x-2 mb-3">
                <MdFilterList className="w-4 h-4 text-blue-300" />
                <span className="text-sm text-blue-300">Filtrele</span>
              </div>

              {/* Category Filter */}
              <div className="mb-3">
                <p className="text-xs text-blue-300 mb-2">Kategori</p>
                <div className="flex flex-wrap gap-1">
                  {categories.slice(0, 6).map(category => (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        selectedCategory === category.value
                          ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/30'
                          : 'bg-blue-700/30 border border-blue-600/30 text-blue-200 hover:bg-blue-600/50 hover:text-white'
                      }`}
                    >
                      <span className="mr-1">{category.icon}</span>
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div>
                <p className="text-xs text-blue-300 mb-2">Zorluk</p>
                <div className="flex flex-wrap gap-1">
                  {difficulties.map(difficulty => (
                    <button
                      key={difficulty.value}
                      onClick={() => setSelectedDifficulty(difficulty.value)}
                      className={`px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        selectedDifficulty === difficulty.value
                          ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/30'
                          : 'bg-blue-700/30 border border-blue-600/30 text-blue-200 hover:bg-blue-600/50 hover:text-white'
                      }`}
                    >
                      <span className="mr-1">{difficulty.icon}</span>
                      {difficulty.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredProjects.length === 0 && (
              <div className="p-8 text-center">
                <div className="p-4 bg-blue-800/30 border border-blue-700/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <MdLightbulb className="w-8 h-8 text-blue-300" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Proje bulunamadı</h3>
                <p className="text-blue-300 text-sm">Farklı filtreler deneyebilirsiniz</p>
              </div>
            )}

            {/* Projects List */}
            {!loading && filteredProjects.length > 0 && (
              <div className="p-4">
                <div className="mb-3 text-sm text-blue-300">
                  <span className="font-medium text-white">{filteredProjects.length}</span> proje bulundu
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
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-blue-800/30 border border-blue-700/30 rounded-lg p-3">
                    <div className="text-lg font-bold text-green-400">
                      {projectIdeas.filter(p => p.difficulty === 'Kolay').length}
                    </div>
                    <div className="text-xs text-blue-300">Kolay</div>
                  </div>
                  <div className="bg-blue-800/30 border border-blue-700/30 rounded-lg p-3">
                    <div className="text-lg font-bold text-red-400">
                      {projectIdeas.filter(p => p.difficulty === 'Zor').length}
                    </div>
                    <div className="text-xs text-blue-300">Zor</div>
                  </div>
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