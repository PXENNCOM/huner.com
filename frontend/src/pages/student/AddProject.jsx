// pages/student/AddProject.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addStudentProject, uploadProjectMedia } from '../../services/api';
import StudentLayout from './components/StudentLayout';
import ProjectForm from './components/ProjectForm';

const StudentAddProject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData, mediaFiles) => {
    try {
      setLoading(true);
      
      // Önce proje verisini kaydet
      const response = await addStudentProject(formData);
      const newProjectId = response.data.project.id;
      
      // Eğer medya dosyaları varsa, onları da yükle
      if (mediaFiles && mediaFiles.length > 0) {
        const mediaFormData = new FormData();
        mediaFiles.forEach(file => {
          mediaFormData.append('media', file);
        });
        
        await uploadProjectMedia(newProjectId, mediaFormData);
      }
      
      // Başarılı olduğunda portfolyo sayfasına yönlendir
      navigate('/student/portfolio');
    } catch (err) {
      console.error('Error adding project:', err);
      setError('Proje eklenirken bir hata oluştu. Lütfen tekrar deneyin.');
      setLoading(false);
    }
  };

  return (
    <StudentLayout>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">Yeni Proje Ekle</h1>
          <p className="text-gray-600">Portfolyonuza yeni bir proje ekleyin.</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-500 border-b border-red-100">
            {error}
          </div>
        )}

        <div className="p-6">
          <ProjectForm 
            onSubmit={handleSubmit}
            isSubmitting={loading}
            onCancel={() => navigate('/student/portfolio')}
          />
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentAddProject;