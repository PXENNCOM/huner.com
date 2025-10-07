// pages/employer/components/Jobs/CreateJobModal.jsx
import React, { useState, useEffect } from 'react';
import { createJob, uploadJobMedia } from '../../../../services/employerApi';
import { checkEmployerProfileComplete } from '../../../../utils/profileUtils';
import { MdClose, MdAdd, MdImage, MdSave, MdCancel, MdCamera } from 'react-icons/md';

const CreateJobModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [media, setMedia] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [profileCheckLoading, setProfileCheckLoading] = useState(false);
  const [profileIncomplete, setProfileIncomplete] = useState(false);

  useEffect(() => {
    if (isOpen) {
      checkProfile();
      // Reset form when modal opens
      setFormData({ title: '', description: '' });
      setMedia([]);
      setPreviewImages([]);
      setError(null);
    }
  }, [isOpen]);

  const checkProfile = async () => {
    try {
      setProfileCheckLoading(true);
      const result = await checkEmployerProfileComplete();
      
      if (!result.isComplete) {
        setProfileIncomplete(true);
        setError(result.message || 'Profil bilgileriniz eksik. Lütfen profilinizi tamamlayın.');
      } else {
        setProfileIncomplete(false);
        setError(null);
      }
    } catch (err) {
      console.error('Profil kontrol hatası:', err);
      setError('Profil bilgileriniz kontrol edilirken bir hata oluştu.');
      setProfileIncomplete(true);
    } finally {
      setProfileCheckLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setMedia(prev => [...prev, ...files]);
      
      // Dosyaların önizlemesini oluştur
      const newPreviewImages = files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      
      setPreviewImages(prev => [...prev, ...newPreviewImages]);
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
    
    if (profileIncomplete) {
      setError('Profil bilgileriniz eksik. Lütfen önce profilinizi tamamlayın.');
      return;
    }

    setSaving(true);
    setError(null);
    
    try {
      // Medya dosyalarını yükle
      let mediaUrls = [];
      
      if (media.length > 0) {
        const mediaFormData = new FormData();
        media.forEach(file => {
          mediaFormData.append('media', file);
        });
        
        const mediaResponse = await uploadJobMedia(mediaFormData);
        mediaUrls = mediaResponse.data.filenames || [];
      }
      
      // İş ilanını oluştur
      const jobData = {
        ...formData,
        media: JSON.stringify(mediaUrls)
      };
      
      await createJob(jobData);
      
      // Başarılı işlem
      if (onSuccess) {
        onSuccess();
      }
      
      // Form temizle
      setFormData({ title: '', description: '' });
      setMedia([]);
      setPreviewImages([]);
      
    } catch (err) {
      console.error('İş ilanı oluşturulurken hata:', err);
      
      // Backend'den gelen profil hatası kontrolü
      if (err.response && err.response.data && err.response.data.redirectTo) {
        setError(err.response.data.message || 'Profil bilgileriniz eksik.');
        setProfileIncomplete(true);
      } else {
        setError('İş ilanı oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Cleanup previews
    previewImages.forEach(preview => {
      URL.revokeObjectURL(preview.preview);
    });
    
    setFormData({ title: '', description: '' });
    setMedia([]);
    setPreviewImages([]);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleCancel}
      />
      
      {/* Modal */}
      <div className="absolute inset-4 md:inset-8 lg:inset-16 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 rounded-2xl shadow-2xl border border-blue-700/50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-blue-700/50 bg-blue-800/50 backdrop-blur-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <MdAdd className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Yeni İş İlanı</h2>
              <p className="text-sm text-blue-200">İş ilanınızı oluşturun</p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 text-blue-200 hover:text-white hover:bg-blue-700/50 rounded-lg transition-all duration-200"
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="h-full overflow-y-auto pb-20">
          {/* Profile Check Loading */}
          {profileCheckLoading && (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-blue-200">Profil kontrol ediliyor...</span>
            </div>
          )}

          {/* Profile Incomplete Warning */}
          {profileIncomplete && !profileCheckLoading && (
            <div className="p-6 m-6 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 mr-2 text-yellow-400">⚠️</div>
                <h3 className="text-lg font-semibold text-white">Profil Bilgileri Eksik</h3>
              </div>
              <p className="text-yellow-200 mb-4">{error}</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    handleCancel();
                    // Profil panelini açmak için parent component'e sinyal gönderilmeli
                    // Bu implementation'da basit olarak modal kapatılıyor
                  }}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Profili Tamamla
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  İptal
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && !profileIncomplete && (
            <div className="p-4 m-6 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          {!profileCheckLoading && !profileIncomplete && (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div className="bg-blue-700/30 rounded-xl p-6 border border-blue-600/30">
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  İlan Başlığı *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-blue-600/30 border border-blue-500/50 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  placeholder="İlan başlığını girin"
                />
              </div>

              {/* Description */}
              <div className="bg-blue-700/30 rounded-xl p-6 border border-blue-600/30">
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  İlan Açıklaması *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-3 py-2 bg-blue-600/30 border border-blue-500/50 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  placeholder="İş ilanı detaylarını, aranan nitelikleri ve diğer bilgileri buraya yazın..."
                />
                <p className="text-xs text-blue-300 mt-2">
                  İlan detaylarını, aranan nitelikleri ve diğer bilgileri ekleyin.
                </p>
              </div>

              {/* Media Upload */}
              <div className="bg-blue-700/30 rounded-xl p-6 border border-blue-600/30">
                <label className="block text-sm font-medium text-blue-200 mb-4">
                  Medya Ekle (Opsiyonel)
                </label>
                
                <label className="flex flex-col items-center px-6 py-8 bg-blue-600/30 rounded-lg border-2 border-dashed border-blue-500/50 cursor-pointer hover:bg-blue-600/40 transition-colors">
                  <MdCamera className="w-10 h-10 text-blue-300 mb-2" />
                  <span className="text-blue-200 font-medium">Resim Seç</span>
                  <span className="text-xs text-blue-300 mt-1">PNG, JPG, JPEG - Maks 5MB</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    multiple
                    onChange={handleMediaChange}
                  />
                </label>
                
                {/* Preview Images */}
                {previewImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
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
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <MdClose className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      İlan Oluşturuluyor...
                    </>
                  ) : (
                    <>
                      <MdSave className="w-5 h-5 mr-2" />
                      İlan Oluştur
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <MdCancel className="w-5 h-5 mr-2" />
                  İptal
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateJobModal;