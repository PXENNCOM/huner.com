// pages/student/components/Portfolio/ProjectForm.jsx
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
      {/* Proje Başlığı */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-blue-200 mb-2">
          Proje Başlığı *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full px-3 py-2 rounded-lg bg-blue-900/40 border text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            errors.title ? 'border-red-500' : 'border-blue-600/50'
          }`}
          placeholder="Projenizin başlığını girin"
        />
        {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
      </div>

      {/* Proje Açıklaması */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-blue-200 mb-2">
          Proje Açıklaması *
        </label>
        <textarea
          id="description"
          name="description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          className={`w-full px-3 py-2 rounded-lg bg-blue-900/40 border text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none ${
            errors.description ? 'border-red-500' : 'border-blue-600/50'
          }`}
          placeholder="Projenizin detaylarını açıklayın"
        ></textarea>
        {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
      </div>

      {/* Teknolojiler */}
      <div>
        <label htmlFor="technologies" className="block text-sm font-medium text-blue-200 mb-2">
          Kullanılan Teknolojiler *
        </label>
        <input
          type="text"
          id="technologies"
          name="technologies"
          value={formData.technologies}
          onChange={handleChange}
          placeholder="Örn: React, Node.js, MongoDB"
          className={`w-full px-3 py-2 rounded-lg bg-blue-900/40 border text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            errors.technologies ? 'border-red-500' : 'border-blue-600/50'
          }`}
        />
        <p className="mt-1 text-xs text-blue-300">Virgülle ayırarak teknolojileri girin</p>
        {errors.technologies && <p className="mt-1 text-sm text-red-400">{errors.technologies}</p>}
      </div>

      {/* URL'ler */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="githubUrl" className="block text-sm font-medium text-blue-200 mb-2">
            GitHub URL
          </label>
          <input
            type="text"
            id="githubUrl"
            name="githubUrl"
            value={formData.githubUrl}
            onChange={handleChange}
            placeholder="https://github.com/username/repo"
            className={`w-full px-3 py-2 rounded-lg bg-blue-900/40 border text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              errors.githubUrl ? 'border-red-500' : 'border-blue-600/50'
            }`}
          />
          {errors.githubUrl && <p className="mt-1 text-sm text-red-400">{errors.githubUrl}</p>}
        </div>

        <div>
          <label htmlFor="liveUrl" className="block text-sm font-medium text-blue-200 mb-2">
            Canlı Site URL
          </label>
          <input
            type="text"
            id="liveUrl"
            name="liveUrl"
            value={formData.liveUrl}
            onChange={handleChange}
            placeholder="https://your-site.com"
            className={`w-full px-3 py-2 rounded-lg bg-blue-900/40 border text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              errors.liveUrl ? 'border-red-500' : 'border-blue-600/50'
            }`}
          />
          {errors.liveUrl && <p className="mt-1 text-sm text-red-400">{errors.liveUrl}</p>}
        </div>
      </div>

      {/* Proje Türü ve Görünürlük */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="projectType" className="block text-sm font-medium text-blue-200 mb-2">
            Proje Türü
          </label>
          <select
            id="projectType"
            name="projectType"
            value={formData.projectType}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-blue-900/40 border border-blue-600/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="personal">Kişisel Proje</option>
            <option value="school">Okul Projesi</option>
            <option value="huner">Hüner İşi</option>
            <option value="other">Diğer</option>
          </select>
        </div>

        <div className="flex items-end">
          <div className="flex items-center h-10">
            <input
              type="checkbox"
              id="isVisible"
              name="isVisible"
              checked={formData.isVisible}
              onChange={handleChange}
              className="h-4 w-4 rounded border-blue-600/50 bg-blue-900/40 text-blue-500 focus:ring-blue-400 focus:ring-offset-blue-800"
            />
            <label htmlFor="isVisible" className="ml-2 text-sm text-blue-200">
              Portfolyomda göster
            </label>
          </div>
        </div>
      </div>

      {/* Medya Yükleme */}
      <div>
        <label className="block text-sm font-medium text-blue-200 mb-2">
          Proje Görselleri/Videoları (Maks. 5)
        </label>
        
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragActive 
              ? 'border-blue-400 bg-blue-500/10' 
              : 'border-blue-600/50 hover:border-blue-500/70 bg-blue-900/20'
          }`}
        >
          <input {...getInputProps()} />
          <div className="space-y-2">
            <svg className="w-8 h-8 mx-auto text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            {isDragActive ? (
              <p className="text-blue-300">Dosyaları buraya bırakın...</p>
            ) : (
              <div>
                <p className="text-blue-200">Dosyaları sürükleyip bırakın veya tıklayarak seçin</p>
                <p className="text-xs text-blue-300 mt-1">JPEG, PNG, GIF, MP4, WEBM</p>
              </div>
            )}
          </div>
        </div>

        {/* Seçilen Dosyalar */}
        {mediaFiles.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-blue-200 mb-2">Seçilen Dosyalar ({mediaFiles.length}/5):</p>
            <div className="space-y-2">
              {mediaFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-blue-700/30 p-3 rounded-lg border border-blue-600/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600/30 rounded flex items-center justify-center border border-blue-600/30">
                      {file.type.startsWith('image/') ? (
                        <svg className="w-4 h-4 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white truncate max-w-[200px]">{file.name}</p>
                      <p className="text-xs text-blue-300">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {errors.media && <p className="mt-1 text-sm text-red-400">{errors.media}</p>}
      </div>

      {/* Butonlar */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-blue-700/50">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-700/30 hover:bg-blue-600/40 border border-blue-600/50 text-blue-200 hover:text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          İptal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-75 flex items-center min-w-[120px] justify-center"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isEditMode ? 'Güncelleniyor...' : 'Kaydediliyor...'}
            </>
          ) : (
            isEditMode ? 'Güncelle' : 'Kaydet'
          )}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;