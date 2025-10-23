import React, { useState, useEffect } from 'react';
import { MdCollections, MdClose, MdAdd, MdEdit, MdList } from 'react-icons/md';
import { getStudentProjects, deleteProject, addStudentProject, updateStudentProject, uploadProjectMedia, getStudentProject } from '../../../../services/api';
import PortfolioView from './PortfolioView';
import ProjectForm from './ProjectForm';
import ConfirmDialog from './ConfirmDialog';

const PortfolioPanel = ({ isOpen, onClose }) => {
  const [portfolioTab, setPortfolioTab] = useState('view');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Edit mode states
  const [editingProject, setEditingProject] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  
  // Delete confirmation states
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';

  // Panel açıldığında projeleri yükle
  useEffect(() => {
    if (isOpen) {
      fetchProjects();
    }
  }, [isOpen]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await getStudentProjects();
      
      // Projelerdeki medya URL'lerini düzelt
      const projectsWithFixedUrls = response.data.map(project => {
        let parsedMedia = [];
        try {
          if (project.media) {
            parsedMedia = JSON.parse(project.media);
            parsedMedia = parsedMedia.map(mediaPath => {
              const path = mediaPath.startsWith('/') ? mediaPath : `/uploads/project-media/${mediaPath}`;
              return `${API_BASE_URL}${path}`;
            });
          }
        } catch (e) {
          console.error('Error parsing media for project', project.id, ':', e);
          parsedMedia = [];
        }
        
        return {
          ...project,
          media: parsedMedia
        };
      });
      
      setProjects(projectsWithFixedUrls);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Projeler yüklenirken bir hata oluştu.');
      setLoading(false);
    }
  };

  // Yeni proje ekleme
  const handleAddProject = async (formData, mediaFiles) => {
    setIsSubmitting(true);
    try {
      const response = await addStudentProject(formData);
      const newProjectId = response.data.project.id;
      
      if (mediaFiles && mediaFiles.length > 0) {
        const mediaFormData = new FormData();
        mediaFiles.forEach(file => {
          mediaFormData.append('media', file);
        });
        await uploadProjectMedia(newProjectId, mediaFormData);
      }
      
      await fetchProjects();
      setPortfolioTab('view');
      setIsSubmitting(false);
    } catch (err) {
      console.error('Error adding project:', err);
      setError('Proje eklenirken bir hata oluştu.');
      setIsSubmitting(false);
    }
  };

  // Proje düzenlemeye başla
  const handleEditClick = async (projectId) => {
    setEditLoading(true);
    try {
      const response = await getStudentProject(projectId);
      setEditingProject(response.data);
      setPortfolioTab('edit');
      setEditLoading(false);
    } catch (err) {
      console.error('Error fetching project for edit:', err);
      setError('Proje bilgileri yüklenirken hata oluştu.');
      setEditLoading(false);
    }
  };

  // Proje güncelleme
  const handleUpdateProject = async (formData, mediaFiles) => {
    setIsSubmitting(true);
    try {
      await updateStudentProject(editingProject.id, formData);
      
      if (mediaFiles && mediaFiles.length > 0) {
        const mediaFormData = new FormData();
        mediaFiles.forEach(file => {
          mediaFormData.append('media', file);
        });
        await uploadProjectMedia(editingProject.id, mediaFormData);
      }
      
      await fetchProjects();
      setPortfolioTab('view');
      setEditingProject(null);
      setIsSubmitting(false);
    } catch (err) {
      console.error('Error updating project:', err);
      setError('Proje güncellenirken bir hata oluştu.');
      setIsSubmitting(false);
    }
  };

  // Proje silme işlemleri
  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteProject(projectToDelete.id);
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
      await fetchProjects();
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Proje silinirken bir hata oluştu.');
      setDeleteDialogOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop - Desktop only */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm hidden md:block"
        onClick={onClose}
      ></div>
      
      {/* Panel - Full screen on mobile, sidebar on desktop */}
      <div className="relative w-full md:ml-auto md:w-[75%] lg:w-[60%] xl:w-[50%] h-full bg-blue-900/95 backdrop-blur-xl md:border-l border-blue-800/50 overflow-hidden flex flex-col">
        {/* Panel Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-blue-800/50 bg-blue-800/30">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <MdCollections className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Portfolyo</h2>
              <p className="text-sm text-blue-200 hidden sm:block">Projelerinizi yönetin</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-800/50 rounded-lg transition-colors text-blue-200 hover:text-white"
          >
            <MdClose className="w-5 h-5" />
          </button>
        </div>

        {/* Panel Tabs */}
        <div className="border-b border-blue-800/50 overflow-x-auto">
          <nav className="flex px-4 md:px-6 min-w-max">
            <button
              onClick={() => {
                setPortfolioTab('view');
                setEditingProject(null);
              }}
              className={`py-3 px-3 md:px-4 text-sm font-medium transition-colors flex items-center space-x-2 whitespace-nowrap ${
                portfolioTab === 'view'
                  ? 'text-blue-300 border-b-2 border-blue-400'
                  : 'text-blue-400 hover:text-blue-200'
              }`}
            >
              <MdList className="w-4 h-4" />
              <span className="hidden sm:inline">Projeler ({projects.length})</span>
              <span className="sm:hidden">Projeler</span>
            </button>
            <button
              onClick={() => {
                setPortfolioTab('add');
                setEditingProject(null);
              }}
              className={`py-3 px-3 md:px-4 text-sm font-medium transition-colors flex items-center space-x-2 whitespace-nowrap ${
                portfolioTab === 'add'
                  ? 'text-blue-300 border-b-2 border-blue-400'
                  : 'text-blue-400 hover:text-blue-200'
              }`}
            >
              <MdAdd className="w-4 h-4" />
              <span className="hidden sm:inline">Yeni Proje</span>
              <span className="sm:hidden">Yeni</span>
            </button>
            {portfolioTab === 'edit' && (
              <button
                className="py-3 px-3 md:px-4 text-sm font-medium text-blue-300 border-b-2 border-blue-400 flex items-center space-x-2 whitespace-nowrap"
              >
                <MdEdit className="w-4 h-4" />
                <span>Düzenle</span>
              </button>
            )}
          </nav>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-blue-900/50">
          {/* Error Display */}
          {error && (
            <div className="mb-4 bg-red-900/20 border border-red-500/50 text-red-300 p-3 md:p-4 rounded-lg text-sm">
              {error}
              <button 
                onClick={() => setError(null)}
                className="ml-2 text-red-400 hover:text-red-300"
              >
                ×
              </button>
            </div>
          )}

          {/* Loading State */}
          {(loading || editLoading) && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400"></div>
            </div>
          )}

          {/* Content based on active tab */}
          {!loading && !editLoading && (
            <div className="w-full max-w-4xl">
              {portfolioTab === 'view' && (
                <PortfolioView 
                  projects={projects}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              )}
              
              {portfolioTab === 'add' && (
                <div>
                  <div className="mb-4 md:mb-6">
                    <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Yeni Proje Ekle</h3>
                    <p className="text-blue-200 text-sm md:text-base">Portfolyonuza yeni bir proje ekleyin</p>
                  </div>
                  <ProjectForm 
                    onSubmit={handleAddProject}
                    isSubmitting={isSubmitting}
                    onCancel={() => setPortfolioTab('view')}
                  />
                </div>
              )}
              
              {portfolioTab === 'edit' && editingProject && (
                <div>
                  <div className="mb-4 md:mb-6">
                    <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Proje Düzenle</h3>
                    <p className="text-blue-200 text-sm md:text-base">"{editingProject.title}" projesini düzenliyorsunuz</p>
                  </div>
                  <ProjectForm 
                    initialData={editingProject}
                    onSubmit={handleUpdateProject}
                    isSubmitting={isSubmitting}
                    onCancel={() => setPortfolioTab('view')}
                    isEditMode={true}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Projeyi Sil"
        message={`"${projectToDelete?.title}" projesini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
        confirmText="Sil"
        cancelText="İptal"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
};

export default PortfolioPanel;