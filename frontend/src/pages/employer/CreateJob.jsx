import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob, uploadJobMedia } from '../../services/employerApi';
import EmployerLayout from './components/EmployerLayout';

const CreateJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [media, setMedia] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setMedia([...media, ...files]);
      
      // Dosyaların önizlemesini oluştur
      const newPreviewImages = files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      
      setPreviewImages([...previewImages, ...newPreviewImages]);
    }
  };

  const removeMedia = (index) => {
    const updatedMedia = [...media];
    updatedMedia.splice(index, 1);
    setMedia(updatedMedia);
    
    const updatedPreviews = [...previewImages];
    URL.revokeObjectURL(updatedPreviews[index].preview); // Memory leak önleme
    updatedPreviews.splice(index, 1);
    setPreviewImages(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Medya dosyalarını yükle
      let mediaUrls = [];
      
      if (media.length > 0) {
        const formData = new FormData();
        media.forEach(file => {
          formData.append('media', file);
        });
        
        const mediaResponse = await uploadJobMedia(formData);
        mediaUrls = mediaResponse.data.filenames || [];
      }
      
      // İş ilanını oluştur
      const jobData = {
        ...formData,
        media: JSON.stringify(mediaUrls)
      };
      
      await createJob(jobData);
      
      // Başarılı işlem sonrası iş ilanları sayfasına yönlendir
      navigate('/employer/jobs', { 
        state: { 
          message: 'İş ilanı başarıyla oluşturuldu ve onay için admin onayı bekleniyor.' 
        } 
      });
    } catch (err) {
      console.error('İş ilanı oluşturulurken hata oluştu:', err);
      setError('İş ilanı oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
      setLoading(false);
    }
  };

  return (
    <EmployerLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/employer/jobs')}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">Yeni İş İlanı Oluştur</h1>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              İlan Başlığı
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="title"
              name="title"
              type="text"
              placeholder="İlan Başlığı"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              İlan Açıklaması
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              name="description"
              rows="6"
              placeholder="İş ilanı detaylarını buraya yazın..."
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
            <p className="text-sm text-gray-500 mt-1">
              İlan detaylarını, aranan nitelikleri ve diğer bilgileri ekleyin.
            </p>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Medya Ekle (Opsiyonel)
            </label>
            <div className="flex items-center">
              <label className="flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg tracking-wide border border-blue cursor-pointer hover:bg-blue-50 transition-colors">
                <svg className="w-8 h-8 text-blue-500" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                </svg>
                <span className="mt-2 text-base leading-normal text-blue-500">Resim Seç</span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  multiple
                  onChange={handleMediaChange}
                />
              </label>
            </div>
            
            {previewImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {previewImages.map((preview, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={preview.preview} 
                      alt={`Preview ${index}`} 
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/employer/jobs')}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              disabled={loading}
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  İlan Oluşturuluyor...
                </>
              ) : (
                'İlan Oluştur'
              )}
            </button>
          </div>
        </form>
      </div>
    </EmployerLayout>
  );
};

export default CreateJob;