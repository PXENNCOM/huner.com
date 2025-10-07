import React, { useState, useEffect } from 'react';
import { MdWork, MdClose, MdAdd, MdEdit, MdList, MdDelete, MdBusiness } from 'react-icons/md';
import { getWorkExperiences, deleteWorkExperience, addWorkExperience, updateWorkExperience, getWorkExperience } from '../../../../services/api';
import WorkExperienceView from './WorkExperienceView';
import WorkExperienceForm from './WorkExperienceForm';
import ConfirmDialog from '../Portfolio/ConfirmDialog';

const WorkExperiencePanel = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('view');
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Edit mode states
  const [editingExperience, setEditingExperience] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  
  // Delete confirmation states
  const [experienceToDelete, setExperienceToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Panel açıldığında iş deneyimlerini yükle
  useEffect(() => {
    if (isOpen) {
      fetchExperiences();
    }
  }, [isOpen]);

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const response = await getWorkExperiences();
      setExperiences(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching work experiences:', err);
      setError('İş deneyimleri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Yeni iş deneyimi ekleme
  const handleAddExperience = async (experienceData) => {
    setIsSubmitting(true);
    try {
      await addWorkExperience(experienceData);
      await fetchExperiences();
      setActiveTab('view');
      setError(null);
    } catch (err) {
      console.error('Error adding work experience:', err);
      setError(err.response?.data?.message || 'İş deneyimi eklenirken bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // İş deneyimi düzenlemeye başla
  const handleEditClick = async (experienceId) => {
    setEditLoading(true);
    try {
      const response = await getWorkExperience(experienceId);
      setEditingExperience(response.data);
      setActiveTab('edit');
      setError(null);
    } catch (err) {
      console.error('Error fetching experience for edit:', err);
      setError('İş deneyimi bilgileri yüklenirken hata oluştu.');
    } finally {
      setEditLoading(false);
    }
  };

  // İş deneyimi güncelleme
  const handleUpdateExperience = async (experienceData) => {
    setIsSubmitting(true);
    try {
      await updateWorkExperience(editingExperience.id, experienceData);
      await fetchExperiences();
      setActiveTab('view');
      setEditingExperience(null);
      setError(null);
    } catch (err) {
      console.error('Error updating work experience:', err);
      setError(err.response?.data?.message || 'İş deneyimi güncellenirken bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // İş deneyimi silme işlemleri
  const handleDeleteClick = (experience) => {
    setExperienceToDelete(experience);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteWorkExperience(experienceToDelete.id);
      setDeleteDialogOpen(false);
      setExperienceToDelete(null);
      await fetchExperiences();
      setError(null);
    } catch (err) {
      console.error('Error deleting work experience:', err);
      setError('İş deneyimi silinirken bir hata oluştu.');
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
              <MdWork className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">İş Deneyimi</h2>
              <p className="text-sm text-blue-200 hidden sm:block">Çalışma geçmişinizi yönetin</p>
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
                setActiveTab('view');
                setEditingExperience(null);
              }}
              className={`py-3 px-3 md:px-4 text-sm font-medium transition-colors flex items-center space-x-2 whitespace-nowrap ${
                activeTab === 'view'
                  ? 'text-blue-300 border-b-2 border-blue-400'
                  : 'text-blue-400 hover:text-blue-200'
              }`}
            >
              <MdList className="w-4 h-4" />
              <span className="hidden sm:inline">Deneyimler ({experiences.length})</span>
              <span className="sm:hidden">Deneyimler</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('add');
                setEditingExperience(null);
              }}
              className={`py-3 px-3 md:px-4 text-sm font-medium transition-colors flex items-center space-x-2 whitespace-nowrap ${
                activeTab === 'add'
                  ? 'text-blue-300 border-b-2 border-blue-400'
                  : 'text-blue-400 hover:text-blue-200'
              }`}
            >
              <MdAdd className="w-4 h-4" />
              <span className="hidden sm:inline">Yeni Deneyim</span>
              <span className="sm:hidden">Yeni</span>
            </button>
            {activeTab === 'edit' && (
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
              {activeTab === 'view' && (
                <WorkExperienceView 
                  experiences={experiences}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              )}
              
              {activeTab === 'add' && (
                <div>
                  <div className="mb-4 md:mb-6">
                    <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Yeni İş Deneyimi Ekle</h3>
                    <p className="text-blue-200 text-sm md:text-base">Çalışma geçmişinize yeni bir deneyim ekleyin</p>
                  </div>
                  <WorkExperienceForm 
                    onSubmit={handleAddExperience}
                    isSubmitting={isSubmitting}
                    onCancel={() => setActiveTab('view')}
                  />
                </div>
              )}
              
              {activeTab === 'edit' && editingExperience && (
                <div>
                  <div className="mb-4 md:mb-6">
                    <h3 className="text-lg md:text-xl font-semibold text-white mb-2">İş Deneyimi Düzenle</h3>
                    <p className="text-blue-200 text-sm md:text-base">"{editingExperience.position}" pozisyonunu düzenliyorsunuz</p>
                  </div>
                  <WorkExperienceForm 
                    initialData={editingExperience}
                    onSubmit={handleUpdateExperience}
                    isSubmitting={isSubmitting}
                    onCancel={() => setActiveTab('view')}
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
        title="İş Deneyimini Sil"
        message={`"${experienceToDelete?.companyName} - ${experienceToDelete?.position}" deneyimini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
        confirmText="Sil"
        cancelText="İptal"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
};

export default WorkExperiencePanel;