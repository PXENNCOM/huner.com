// pages/student/Portfolio.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getStudentProjects, deleteProject } from '../../services/api';
import StudentLayout from './components/StudentLayout';
import ProjectCard from './components/ProjectCard';
import ConfirmDialog from './components/ConfirmDialog';

const StudentPortfolio = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // API base URL'i ekle
  const API_BASE_URL = 'http://localhost:3001';

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await getStudentProjects();
      
      // Projelerin ham media verisini logla
      console.log('Raw projects from API:', response.data);
      
      // Projelerdeki medya URL'lerini düzelt
      const projectsWithFixedUrls = response.data.map(project => {
        console.log('Processing project:', project.id, 'with media:', project.media);
        
        let parsedMedia = [];
        try {
          if (project.media) {
            // JSON string'i parse et
            parsedMedia = JSON.parse(project.media);
            console.log('Parsed media for project', project.id, ':', parsedMedia);
            
            // Her media URL'sine API base URL'ini ekle
            parsedMedia = parsedMedia.map((url, index) => {
              const fullUrl = API_BASE_URL + url;
              console.log(`Media ${index} conversion: ${url} -> ${fullUrl}`);
              return fullUrl;
            });
          }
        } catch (e) {
          console.error('Error parsing media for project', project.id, ':', e);
        }
        
        return {
          ...project,
          media: parsedMedia // Artık array olarak
        };
      });
      
      console.log('Projects with fixed URLs:', projectsWithFixedUrls);
      setProjects(projectsWithFixedUrls);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Projeler yüklenirken bir hata oluştu.');
      setLoading(false);
    }
  };

  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteProject(projectToDelete.id);
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
      // Projeleri yeniden yükle
      fetchProjects();
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Proje silinirken bir hata oluştu.');
      setDeleteDialogOpen(false);
    }
  };

  if (loading && projects.length === 0) {
    return (
      <StudentLayout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Portfolyo Projeleri</h1>
        <Link 
          to="/student/portfolio/add" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          + Yeni Proje
        </Link>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 text-red-500 rounded-md">
          {error}
        </div>
      )}

      {projects.length === 0 && !loading ? (
        <div className="bg-white p-8 text-center rounded-lg shadow">
          <h3 className="text-xl font-medium text-gray-700 mb-2">Henüz projeniz bulunmuyor</h3>
          <p className="text-gray-500 mb-6">Portfolyonuza yeni projeler ekleyerek başlayın.</p>
          <Link 
            to="/student/portfolio/add" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md transition-colors"
          >
            İlk Projenizi Ekleyin
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard 
              key={project.id}
              project={project}
              onEdit={() => navigate(`/student/portfolio/edit/${project.id}`)}
              onDelete={() => handleDeleteClick(project)}
            />
          ))}
          
          {/* Yeni Proje Ekleme Kartı */}
          <Link 
            to="/student/portfolio/add"
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors h-full min-h-[280px]"
          >
            <div className="w-16 h-16 rounded-full border-2 border-current flex items-center justify-center mb-4">
              <span className="text-3xl">+</span>
            </div>
            <h3 className="text-lg font-medium">Yeni Proje Ekle</h3>
          </Link>
        </div>
      )}

      {/* Silme Onay Dialogu */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Projeyi Sil"
        message={`"${projectToDelete?.title}" projesini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
        confirmText="Sil"
        cancelText="İptal"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </StudentLayout>
  );
};

export default StudentPortfolio;