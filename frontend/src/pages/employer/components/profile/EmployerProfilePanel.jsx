import React, { useState, useEffect } from 'react';
import { getEmployerProfile, updateEmployerProfile, uploadEmployerProfileImage } from '../../../../services/employerApi';
import { 
  MdClose, 
  MdPerson, 
  MdBusiness, 
  MdEmail, 
  MdPhone, 
  MdLocationOn, 
  MdEdit,
  MdSave,
  MdCancel,
  MdCamera,
  MdLanguage
} from 'react-icons/md';

const EmployerProfilePanel = ({ isOpen, onClose }) => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    position: '',
    industry: '',
    companyWebsite: '',
    phoneNumber: '',
    city: '',
    address: '',
    age: ''
  });
  
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchProfile();
    }
  }, [isOpen]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getEmployerProfile();
      setProfile(response.data);
      
      // Form verilerini doldur
      const { 
        fullName, 
        companyName, 
        position, 
        industry, 
        companyWebsite, 
        phoneNumber, 
        city, 
        address, 
        age, 
        profileImage 
      } = response.data;
      
      setFormData({
        fullName: fullName || '',
        companyName: companyName || '',
        position: position || '',
        industry: industry || '',
        companyWebsite: companyWebsite || '',
        phoneNumber: phoneNumber || '',
        city: city || '',
        address: address || '',
        age: age || ''
      });
      
      // Profil resmi varsa önizleme ayarla
      if (profileImage) {
        setPreviewImage(`/uploads/profile-images/${profileImage}`);
      }
      
    } catch (error) {
      console.error('Profil yüklenirken hata:', error);
      setError('Profil bilgileri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      // Önce profil resmini yükle (varsa)
      let updatedProfileImage = profile?.profileImage;
      
      if (profileImage) {
        const imageFormData = new FormData();
        imageFormData.append('profileImage', profileImage);
        
        const imageResponse = await uploadEmployerProfileImage(imageFormData);
        updatedProfileImage = imageResponse.data.filename;
      }
      
      // Profil bilgilerini güncelle
      const updatedProfile = {
        ...formData,
        profileImage: updatedProfileImage
      };
      
      await updateEmployerProfile(updatedProfile);
      
      setSuccess('Profil başarıyla güncellendi.');
      setIsEditing(false);
      
      // Profil bilgilerini yeniden yükle
      await fetchProfile();
      
    } catch (error) {
      console.error('Profil güncellenirken hata:', error);
      setError('Profil güncellenirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfileImage(null);
    
    // Orijinal verileri geri yükle
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        companyName: profile.companyName || '',
        position: profile.position || '',
        industry: profile.industry || '',
        companyWebsite: profile.companyWebsite || '',
        phoneNumber: profile.phoneNumber || '',
        city: profile.city || '',
        address: profile.address || '',
        age: profile.age || ''
      });
      
      if (profile.profileImage) {
        setPreviewImage(`/uploads/profile-images/${profile.profileImage}`);
      } else {
        setPreviewImage(null);
      }
    }
    
    setError(null);
    setSuccess(null);
  };

  const industries = [
    { value: 'Teknoloji', label: '🚀 Teknoloji' },
    { value: 'Finans', label: '💰 Finans' },
    { value: 'Sağlık', label: '🏥 Sağlık' },
    { value: 'E-ticaret', label: '🛍️ E-ticaret' },
    { value: 'Eğitim', label: '📚 Eğitim' },
    { value: 'İmalat', label: '🏭 İmalat' },
    { value: 'İnşaat', label: '🏗️ İnşaat' },
    { value: 'Otomotiv', label: '🚗 Otomotiv' },
    { value: 'Medya', label: '📺 Medya' },
    { value: 'Turizm', label: '✈️ Turizm' },
    { value: 'Diğer', label: '⚡ Diğer' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-blue-700/50 bg-blue-800/50 backdrop-blur-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <MdPerson className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Profil</h2>
              <p className="text-sm text-blue-200">Şirket bilgilerinizi yönetin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-blue-200 hover:text-white hover:bg-blue-700/50 rounded-lg transition-all duration-200"
          >
            <MdClose className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="h-full overflow-y-auto pb-20">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Error/Success Messages */}
          {error && (
            <div className="p-4 m-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="p-4 m-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm">
              {success}
            </div>
          )}

          {profile && (
            <div className="p-6 space-y-6">
              {/* Profile Header */}
              <div className="bg-blue-800/30 rounded-xl p-6 border border-blue-700/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    {/* Profile Image */}
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-500/20">
                        {previewImage ? (
                          <img 
                            src={previewImage} 
                            alt="Profil" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/150?text=' + (formData.fullName?.charAt(0)?.toUpperCase() || 'İ');
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-blue-300 text-xl font-bold">
                            {formData.fullName?.charAt(0)?.toUpperCase() || 'İ'}
                          </div>
                        )}
                      </div>
                      
                      {isEditing && (
                        <label className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 cursor-pointer hover:bg-blue-600 transition-colors">
                          <MdCamera className="w-3 h-3" />
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange}
                            className="hidden" 
                          />
                        </label>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {formData.fullName || 'İsim Belirtilmemiş'}
                      </h3>
                      <p className="text-blue-200 text-sm">{formData.position || 'Pozisyon'}</p>
                      <p className="text-blue-300 text-sm">{formData.companyName || 'Şirket Adı'}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-all duration-200"
                  >
                    <MdEdit className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-blue-800/30 rounded-xl p-6 border border-blue-700/30">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <MdPerson className="w-5 h-5 mr-2 text-blue-300" />
                  Kişisel Bilgiler
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      Ad Soyad
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-blue-700/30 border border-blue-600/50 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        placeholder="Ad Soyad"
                      />
                    ) : (
                      <p className="text-white">{formData.fullName || 'Belirtilmemiş'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      Pozisyon
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-blue-700/30 border border-blue-600/50 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        placeholder="Pozisyon"
                      />
                    ) : (
                      <p className="text-white">{formData.position || 'Belirtilmemiş'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      Yaş
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        min="18"
                        max="100"
                        className="w-full px-3 py-2 bg-blue-700/30 border border-blue-600/50 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        placeholder="Yaş"
                      />
                    ) : (
                      <p className="text-white">{formData.age || 'Belirtilmemiş'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      E-posta
                    </label>
                    <p className="text-white">{profile.User?.email || 'Belirtilmemiş'}</p>
                  </div>
                </div>
              </div>

              {/* Company Information */}
              <div className="bg-blue-800/30 rounded-xl p-6 border border-blue-700/30">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <MdBusiness className="w-5 h-5 mr-2 text-blue-300" />
                  Şirket Bilgileri
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      Şirket Adı
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-blue-700/30 border border-blue-600/50 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        placeholder="Şirket Adı"
                      />
                    ) : (
                      <p className="text-white">{formData.companyName || 'Belirtilmemiş'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      Sektör
                    </label>
                    {isEditing ? (
                      <select
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-blue-700/30 border border-blue-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      >
                        <option value="">Sektör Seçin</option>
                        {industries.map(industry => (
                          <option key={industry.value} value={industry.value}>
                            {industry.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-white">{formData.industry || 'Belirtilmemiş'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      Web Sitesi
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        name="companyWebsite"
                        value={formData.companyWebsite}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-blue-700/30 border border-blue-600/50 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        placeholder="https://sirket.com"
                      />
                    ) : (
                      <p className="text-white">
                        {formData.companyWebsite ? (
                          <a href={formData.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200">
                            {formData.companyWebsite}
                          </a>
                        ) : (
                          'Belirtilmemiş'
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-blue-800/30 rounded-xl p-6 border border-blue-700/30">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <MdPhone className="w-5 h-5 mr-2 text-blue-300" />
                  İletişim Bilgileri
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      Telefon
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-blue-700/30 border border-blue-600/50 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        placeholder="Telefon"
                      />
                    ) : (
                      <p className="text-white">{formData.phoneNumber || 'Belirtilmemiş'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      Şehir
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-blue-700/30 border border-blue-600/50 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        placeholder="Şehir"
                      />
                    ) : (
                      <p className="text-white">{formData.city || 'Belirtilmemiş'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      Adres
                    </label>
                    {isEditing ? (
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 bg-blue-700/30 border border-blue-600/50 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        placeholder="Adres"
                      />
                    ) : (
                      <p className="text-white">{formData.address || 'Belirtilmemiş'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    {saving ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <MdSave className="w-5 h-5 mr-2" />
                        Kaydet
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <MdCancel className="w-5 h-5 mr-2" />
                    İptal
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerProfilePanel;