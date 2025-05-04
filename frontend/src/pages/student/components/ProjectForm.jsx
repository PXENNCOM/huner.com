// pages/student/components/ProjectForm.jsx
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const ProjectForm = ({ initialData, onSubmit, isSubmitting, onCancel, isEditMode = false }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    technologies: initialData?.technologies || '',
    githubUrl: initialData?.githubUrl || '',
    liveUrl: initialData?.liveUrl || '',
    projectType: initialData?.projectType || 'personal',
    isVisible: initialData?.isVisible !== false // varsayılan olarak görünür
  });
  
  const [mediaFiles, setMediaFiles] = useState([]);
  const [errors, setErrors] = useState({});

  // Form alanlarını güncelle
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Hata varsa temizle
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Dosya yükleme işlevi
  const onDrop = useCallback(acceptedFiles => {
    // Maksimum 5 dosya kontrolü
    if (mediaFiles.length + acceptedFiles.length > 5) {
      setErrors(prev => ({ 
        ...prev, 
        media: 'En fazla 5 dosya yükleyebilirsiniz.' 
      }));
      return;
    }
    
    setMediaFiles(prev => [...prev, ...acceptedFiles]);
    
    // Hata varsa temizle
    if (errors.media) {
      setErrors(prev => ({ ...prev, media: null }));
    }
  }, [mediaFiles, errors]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'video/*': ['.mp4', '.webm']
    }
  });

  // Dosya kaldırma
  const removeFile = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Form gönderme
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validasyon
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Proje başlığı gereklidir';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Proje açıklaması gereklidir';
    }
    
    if (!formData.technologies.trim()) {
      newErrors.technologies = 'Kullanılan teknolojiler gereklidir';
    }
    
    if (formData.githubUrl && !formData.githubUrl.includes('github.com')) {
      newErrors.githubUrl = 'Geçerli bir GitHub URL\'si girin';
    }
    
    if (formData.liveUrl && !formData.liveUrl.startsWith('http')) {
      newErrors.liveUrl = 'Geçerli bir URL girin';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Form verilerini gönder
    onSubmit(formData, mediaFiles);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Proje Başlığı*
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            errors.title ? 'border-red-300' : ''
          }`}
        />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Proje Açıklaması*
        </label>
        <textarea
          id="description"
          name="description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            errors.description ? 'border-red-300' : ''
          }`}
        ></textarea>
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
      </div>

      <div>
        <label htmlFor="technologies" className="block text-sm font-medium text-gray-700">
          Kullanılan Teknolojiler*
        </label>
        <input
          type="text"
          id="technologies"
          name="technologies"
          value={formData.technologies}
          onChange={handleChange}
          placeholder="Örn: React, Node.js, MongoDB"
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            errors.technologies ? 'border-red-300' : ''
          }`}
        />
        {errors.technologies && <p className="mt-1 text-sm text-red-500">{errors.technologies}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700">
            GitHub URL
          </label>
          <input
            type="text"
            id="githubUrl"
            name="githubUrl"
            value={formData.githubUrl}
            onChange={handleChange}
            placeholder="https://github.com/username/repo"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.githubUrl ? 'border-red-300' : ''
            }`}
          />
          {errors.githubUrl && <p className="mt-1 text-sm text-red-500">{errors.githubUrl}</p>}
        </div>

        <div>
          <label htmlFor="liveUrl" className="block text-sm font-medium text-gray-700">
            Canlı Site URL
          </label>
          <input
            type="text"
            id="liveUrl"
            name="liveUrl"
            value={formData.liveUrl}
            onChange={handleChange}
            placeholder="https://your-site.com"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.liveUrl ? 'border-red-300' : ''
            }`}
          />
          {errors.liveUrl && <p className="mt-1 text-sm text-red-500">{errors.liveUrl}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="projectType" className="block text-sm font-medium text-gray-700">
          Proje Türü
        </label>
        <select
          id="projectType"
          name="projectType"
          value={formData.projectType}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="personal">Kişisel Proje</option>
          <option value="school">Okul Projesi</option>
          <option value="huner">Hüner İşi</option>
          <option value="other">Diğer</option>
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isVisible"
          name="isVisible"
          checked={formData.isVisible}
          onChange={handleChange}
          className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
        />
        <label htmlFor="isVisible" className="ml-2 block text-sm text-gray-700">
          Portfolyomda göster
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Proje Görselleri/Videoları (Maks. 5)
        </label>
        
        <div 
          {...getRootProps()} 
          className={`mt-1 border-2 border-dashed ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          } rounded-md p-6 text-center`}
        >
          <input {...getInputProps()} />
          {
            isDragActive ?
              <p className="text-blue-500">Dosyaları buraya bırakın...</p> :
              <div>
                <p className="text-gray-500">Dosyaları sürükleyip bırakın, veya tıklayarak seçin</p>
                <p className="text-xs text-gray-400 mt-1">Desteklenen formatlar: JPEG, PNG, GIF, MP4, WEBM</p>
              </div>
          }
        </div>
        {mediaFiles.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-700 mb-2">Seçilen Dosyalar:</p>
            <ul className="space-y-2">
              {mediaFiles.map((file, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Kaldır
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {errors.media && <p className="mt-1 text-sm text-red-500">{errors.media}</p>}
      </div>

      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors flex justify-center items-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              {isEditMode ? 'Güncelleniyor...' : 'Kaydediliyor...'}
            </>
          ) : (
            isEditMode ? 'Güncelle' : 'Kaydet'
          )}
        </button>
        
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-md transition-colors"
        >
          İptal
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;