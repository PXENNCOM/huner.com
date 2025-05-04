// pages/student/EditProject.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudentProject, updateStudentProject, uploadProjectMedia } from '../../services/api';
import StudentLayout from './components/StudentLayout';
import ProjectForm from './components/ProjectForm';

const StudentEditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await getStudentProject(id);
        setProject(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Proje bilgileri yüklenirken bir hata oluştu.');
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleSubmit = async (formData, mediaFiles) => {
    try {
      setSubmitting(true);
      
      // Projeyi güncelle
      await updateStudentProject(id, formData);
      
      // Eğer medya dosyaları varsa, onları da yükle
      if (mediaFiles && mediaFiles.length > 0) {
        const mediaFormData = new FormData();
        mediaFiles.forEach(file => {
          mediaFormData.append('media', file);
        });
        
        await uploadProjectMedia(id, mediaFormData);
      }
      
      // Başarılı olduğunda portfolyo sayfasına yönlendir
      navigate('/student/portfolio');
    } catch (err) {
      console.error('Error updating project:', err);
      setError('Proje güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
      setSubmitting(false);
    }
  };

  if (loading) {
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
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">Proje Düzenle</h1>
          <p className="text-gray-600">"{project?.title}" projesini düzenliyorsunuz.</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-500 border-b border-red-100">
            {error}
          </div>
        )}

        <div className="p-6">
          <ProjectForm 
            initialData={project}
            onSubmit={handleSubmit}
            isSubmitting={submitting}
            onCancel={() => navigate('/student/portfolio')}
            isEditMode={true}
          />
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentEditProject;