// pages/student/components/ProfileEdit.jsx
import React, { useState } from 'react';
import { uploadProfileImage } from '../../../services/api';

const ProfileEdit = ({ profile, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || '',
    age: profile?.age || '',
    city: profile?.city || '',
    school: profile?.school || '',
    department: profile?.department || '',
    educationLevel: profile?.educationLevel || 'lisans',
    currentGrade: profile?.currentGrade || '',
    skills: profile?.skills || '',
    shortBio: profile?.shortBio || '',
    githubProfile: profile?.githubProfile || '',
    linkedinProfile: profile?.linkedinProfile || '',
    languages: profile?.languages || '[]'
  });
  
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(profile?.profileImage ? `/uploads/profile-images/${profile.profileImage}` : null);
  const [languages, setLanguages] = useState(() => {
    try {
      return profile?.languages ? JSON.parse(profile.languages) : [];
    } catch (e) {
      console.error('Language parsing error:', e);
      return [];
    }
  });
  
  const [newLanguage, setNewLanguage] = useState({ lang: '', level: 'Başlangıç' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form alanlarını güncelle
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Hata varsa temizle
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Dil ekle
  const handleAddLanguage = (e) => {
    e.preventDefault();
    if (!newLanguage.lang.trim()) {
      setErrors(prev => ({ ...prev, language: 'Dil adı giriniz' }));
      return;
    }
    
    setLanguages(prev => [...prev, newLanguage]);
    setNewLanguage({ lang: '', level: 'Başlangıç' });
    setFormData(prev => ({
      ...prev,
      languages: JSON.stringify([...languages, newLanguage])
    }));
    
    if (errors.language) {
      setErrors(prev => ({ ...prev, language: null }));
    }
  };

  // Dil kaldır
  const handleRemoveLanguage = (index) => {
    const updatedLanguages = languages.filter((_, i) => i !== index);
    setLanguages(updatedLanguages);
    setFormData(prev => ({
      ...prev,
      languages: JSON.stringify(updatedLanguages)
    }));
  };

  // Profil resmi değiştir
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      
      // Önizleme için URL oluştur
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
    }
  };

  // Profil resmini yükle
  const handleImageUpload = async () => {
    if (!profileImage) return null;
    
    setUploadingImage(true);
    
    try {
      const formData = new FormData();
      formData.append('profileImage', profileImage);
      
      // Debug için
      console.log('FormData içeriği:');
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      
      const response = await uploadProfileImage(formData);
      console.log('Upload response:', response);
      
      // Response'dan filename'i doğru şekilde al
      if (response.data && response.data.filename) {
        setPreviewImage(`/uploads/profile-images/${response.data.filename}`);
        setUploadingImage(false);
        
        return response.data.filename;
      } else {
        console.error('Profile image upload response invalid:', response);
        setErrors(prev => ({ ...prev, image: 'Profil resmi yüklenirken hata oluştu - geçersiz yanıt' }));
        setUploadingImage(false);
        return null;
      }
    } catch (err) {
      console.error('Profile image upload error:', err);
      setErrors(prev => ({ ...prev, image: 'Profil resmi yüklenirken hata oluştu' }));
      setUploadingImage(false);
      return null;
    }
  };

  // Form gönderme
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasyon
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Ad Soyad gereklidir';
    }
    
    if (formData.githubProfile && !formData.githubProfile.includes('github.com')) {
      newErrors.githubProfile = 'Geçerli bir GitHub URL\'si girin';
    }
    
    if (formData.linkedinProfile && !formData.linkedinProfile.includes('linkedin.com')) {
      newErrors.linkedinProfile = 'Geçerli bir LinkedIn URL\'si girin';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Profil resmi yüklendiyse dosya adını al
      let profileImageFilename = null;
      if (profileImage) {
        console.log('Uploading profile image...');
        profileImageFilename = await handleImageUpload();
        console.log('Profile image uploaded, filename:', profileImageFilename);
      }
      
      // Form verilerini gönder
      const updatedFormData = {
        ...formData
      };
      
      if (profileImageFilename) {
        updatedFormData.profileImage = profileImageFilename;
        console.log('Adding profileImage to form data:', profileImageFilename);
      }
      
      console.log('Submitting form data:', updatedFormData);
      await onSubmit(updatedFormData);
      console.log('Form submitted successfully');
    } catch (error) {
      console.error('Error during form submission:', error);
      setErrors(prev => ({ ...prev, submit: 'Form gönderilirken bir hata oluştu' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
      <div className="mb-8 flex flex-col items-center">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mb-4 relative">
          {previewImage ? (
            <img 
              src={previewImage} 
              alt="Profil Önizleme" 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-5xl text-gray-400">
              {formData.fullName?.charAt(0)?.toUpperCase() || '?'}
            </span>
          )}
          
          <input
            type="file"
            id="profileImage"
            name="profileImage"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          
          <label 
            htmlFor="profileImage"
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <span className="text-white text-sm font-medium">Resim Değiştir</span>
          </label>
        </div>
        
        {errors.image && <p className="text-sm text-red-500 mt-1">{errors.image}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Ad Soyad*
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.fullName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
          {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
        </div>

        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">
            Yaş
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            Şehir
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="school" className="block text-sm font-medium text-gray-700">
            Okul
          </label>
          <input
            type="text"
            id="school"
            name="school"
            value={formData.school}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700">
            Bölüm
          </label>
          <input
            type="text"
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="educationLevel" className="block text-sm font-medium text-gray-700">
            Eğitim Seviyesi
          </label>
          <select
            id="educationLevel"
            name="educationLevel"
            value={formData.educationLevel}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="lisans">Lisans</option>
            <option value="yuksek_lisans">Yüksek Lisans</option>
            <option value="doktora">Doktora</option>
            <option value="mezun">Mezun</option>
          </select>
        </div>

        <div>
          <label htmlFor="currentGrade" className="block text-sm font-medium text-gray-700">
            Sınıf
          </label>
          <input
            type="text"
            id="currentGrade"
            name="currentGrade"
            value={formData.currentGrade}
            onChange={handleChange}
            placeholder="Örn: 3. Sınıf"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
          Yetenekler
        </label>
        <input
          type="text"
          id="skills"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="JavaScript, React, Node.js, ..."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">Virgülle ayırarak ekleyin.</p>
      </div>

      <div>
        <label htmlFor="shortBio" className="block text-sm font-medium text-gray-700">
          Kısa Biyografi
        </label>
        <textarea
          id="shortBio"
          name="shortBio"
          rows="3"
          value={formData.shortBio}
          onChange={handleChange}
          placeholder="Kendinizi kısaca tanıtın (maks. 280 karakter)"
          maxLength="280"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        ></textarea>
        <p className="mt-1 text-xs text-gray-500">
          {formData.shortBio.length}/280 karakter
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="githubProfile" className="block text-sm font-medium text-gray-700">
            GitHub Profili
          </label>
          <input
            type="text"
            id="githubProfile"
            name="githubProfile"
            value={formData.githubProfile}
            onChange={handleChange}
            placeholder="https://github.com/username"
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.githubProfile ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
          {errors.githubProfile && <p className="mt-1 text-sm text-red-500">{errors.githubProfile}</p>}
        </div>

        <div>
          <label htmlFor="linkedinProfile" className="block text-sm font-medium text-gray-700">
            LinkedIn Profili
          </label>
          <input
            type="text"
            id="linkedinProfile"
            name="linkedinProfile"
            value={formData.linkedinProfile}
            onChange={handleChange}
            placeholder="https://www.linkedin.com/in/username"
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.linkedinProfile ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
          {errors.linkedinProfile && <p className="mt-1 text-sm text-red-500">{errors.linkedinProfile}</p>}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Dil Bilgisi
          </label>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          {languages.length === 0 ? (
            <p className="text-gray-500 text-center py-2">Henüz dil eklenmemiş.</p>
          ) : (
            <ul className="space-y-2">
              {languages.map((lang, index) => (
                <li key={index} className="flex justify-between items-center p-2 bg-white rounded shadow-sm">
                  <span className="font-medium">{lang.lang}</span>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-3">{lang.level}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveLanguage(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="flex space-x-2">
          <input
            type="text"
            value={newLanguage.lang}
            onChange={(e) => setNewLanguage({ ...newLanguage, lang: e.target.value })}
            placeholder="Dil adı"
            className={`flex-1 rounded-md shadow-sm ${
              errors.language ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
          
          <select
            value={newLanguage.level}
            onChange={(e) => setNewLanguage({ ...newLanguage, level: e.target.value })}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="Başlangıç">Başlangıç</option>
            <option value="Orta">Orta</option>
            <option value="İleri">İleri</option>
            <option value="Ana Dil">Ana Dil</option>
          </select>
          
          <button
            type="button"
            onClick={handleAddLanguage}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2"
          >
            Ekle
          </button>
        </div>
        {errors.language && <p className="mt-1 text-sm text-red-500">{errors.language}</p>}
      </div>

      {errors.submit && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p>{errors.submit}</p>
        </div>
      )}

      <div className="pt-5 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          İptal
        </button>
        <button
          type="submit"
          disabled={isSubmitting || uploadingImage}
          className="rounded-md bg-blue-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75 flex items-center"
        >
          {(isSubmitting || uploadingImage) && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          Kaydet
        </button>
      </div>
    </form>
  );
};

export default ProfileEdit;