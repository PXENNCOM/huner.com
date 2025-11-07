// pages/student/components/Portfolio/ProjectForm.jsx
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Select from 'react-select'; // react-select'i import et

// Teknoloji verisini import et (Bu yolun projenize uygun olduğundan emin olun)
import { technologyOptions } from '../../../../data/technologies'; 

// Formunuzun Tailwind temasına uygun özel react-select stilleri
const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: 'rgba(30, 41, 59, 0.4)', // bg-blue-900/40
    borderColor: state.isFocused ? '#60a5fa' : 'rgba(59, 130, 246, 0.5)', // border-blue-600/50
    borderRadius: '0.5rem',
    minHeight: '42px',
    boxShadow: state.isFocused ? '0 0 0 2px #60a5fa' : 'none',
    '&:hover': {
      borderColor: 'rgba(96, 165, 250, 0.7)'
    }
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: '0.25rem 0.5rem'
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#3b82f6', // Mavi tagler için
    borderRadius: '0.25rem'
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: 'white',
    fontWeight: '500'
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: 'white',
    '&:hover': {
      backgroundColor: '#2563eb',
      color: 'white'
    }
  }),
  input: (provided) => ({ ...provided, color: 'white' }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#111827', // Menü arkaplanı
    border: '1px solid rgba(59, 130, 246, 0.5)'
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#1d4ed8' : 'transparent',
    color: state.isSelected ? '#a5f3fc' : '#d1d5db',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#1e40af'
    }
  }),
  placeholder: (provided) => ({ ...provided, color: '#93c5fd' }), // placeholder-blue-300
  groupHeading: (provided) => ({
    ...provided,
    color: '#60a5fa',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: '0.8rem',
    padding: '6px 12px'
  })
};


const ProjectForm = ({ initialData, onSubmit, isSubmitting, onCancel, isEditMode = false }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    technologies: initialData?.technologies || [], // Artık bir dizi (array)
    githubUrl: initialData?.githubUrl || '',
    liveUrl: initialData?.liveUrl || '',
    projectType: initialData?.projectType || 'personal',
    isVisible: initialData?.isVisible !== false
  });
  
  const [mediaFiles, setMediaFiles] = useState([]);
  const [errors, setErrors] = useState({});

  // Standart form alanlarını güncelle
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // react-select için özel handler
  const handleTechChange = (selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      technologies: selectedOptions
    }));
    if (errors.technologies) {
      setErrors(prev => ({ ...prev, technologies: null }));
    }
  };

  // Dosya yükleme işlevi
  const onDrop = useCallback(acceptedFiles => {
    if (mediaFiles.length + acceptedFiles.length > 5) {
      setErrors(prev => ({ ...prev, media: 'En fazla 5 dosya yükleyebilirsiniz.' }));
      return;
    }
    setMediaFiles(prev => [...prev, ...acceptedFiles]);
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

  const removeFile = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Form gönderme
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Proje başlığı gereklidir';
    if (!formData.description.trim()) newErrors.description = 'Proje açıklaması gereklidir';
    if (formData.technologies.length === 0) newErrors.technologies = 'En az bir teknoloji seçmelisiniz';
    if (formData.githubUrl && !formData.githubUrl.includes('github.com')) newErrors.githubUrl = 'Geçerli bir GitHub URL\'si girin';
    if (formData.liveUrl && !formData.liveUrl.startsWith('http')) newErrors.liveUrl = 'Geçerli bir URL girin';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Backend'e göndermeden önce teknoloji verisini sadeleştir (sadece value'ları gönder)
    const technologiesToSend = formData.technologies.map(tech => tech.value);
    const dataToSend = { ...formData, technologies: technologiesToSend };

    onSubmit(dataToSend, mediaFiles);
  };

 return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Proje Başlığı */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-blue-200 mb-2">
          Project Title *
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
          placeholder="Enter the title of your project"
        />
        {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
      </div>

      {/* Proje Açıklaması */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-blue-200 mb-2">
          Project Description *
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
          placeholder="Describe the details of your project"
        ></textarea>
        {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
      </div>

      {/* Teknolojiler (Güncellenmiş Alan) */}
      <div>
        <label htmlFor="technologies" className="block text-sm font-medium text-blue-200 mb-2">
          Technologies Used *
        </label>
        <Select
          id="technologies"
          name="technologies"
          isMulti
          options={technologyOptions}
          value={formData.technologies}
          onChange={handleTechChange}
          placeholder="Select or search technology..."
          styles={customSelectStyles}
          classNamePrefix="select"
          noOptionsMessage={() => "The technology you were looking for was not found"}
        />
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
            Live Site URL
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
            Project Type
          </label>
          <select
            id="projectType"
            name="projectType"
            value={formData.projectType}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-blue-900/40 border border-blue-600/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
            style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="white" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', paddingRight: '2.5rem' }}
          >
            <option value="personal">Personal Project</option>
            <option value="school">School Project</option>
            <option value="huner">Hunerly</option>
            <option value="other">Other</option>
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
              Show in my portfolio
            </label>
          </div>
        </div>
      </div>

      {/* Medya Yükleme */}
      <div>
        <label className="block text-sm font-medium text-blue-200 mb-2">
          Project Images/Videos (Max. 5)
        </label>
        
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
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
              <p className="text-blue-300">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-blue-200">Drag and drop files or click to select them</p>
                <p className="text-xs text-blue-300 mt-1">JPEG, PNG, GIF, MP4, WEBM</p>
              </div>
            )}
          </div>
        </div>

        {mediaFiles.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-blue-200 mb-2">Selected Files ({mediaFiles.length}/5):</p>
            <div className="space-y-2">
              {mediaFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-blue-700/30 p-3 rounded-lg border border-blue-600/30">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-8 h-8 bg-blue-600/30 rounded flex items-center justify-center border border-blue-600/30 flex-shrink-0">
                      {file.type.startsWith('image/') ? (
                        <svg className="w-4 h-4 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      ) : (
                        <svg className="w-4 h-4 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{file.name}</p>
                      <p className="text-xs text-blue-300">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => removeFile(index)} className="text-red-400 hover:text-red-300 p-1 flex-shrink-0"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
              ))}
            </div>
          </div>
        )}
        {errors.media && <p className="mt-1 text-sm text-red-400">{errors.media}</p>}
      </div>

      {/* Butonlar */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-blue-700/50">
        <button type="button" onClick={onCancel} disabled={isSubmitting} className="px-4 py-2 bg-blue-700/30 hover:bg-blue-600/40 border border-blue-600/50 text-blue-200 hover:text-white rounded-lg font-medium transition-colors disabled:opacity-50">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-75 flex items-center min-w-[120px] justify-center">
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {isEditMode ? 'Updating...' : 'Recording...'}
            </>
          ) : (
            isEditMode ? 'Update' : 'Save'
          )}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;