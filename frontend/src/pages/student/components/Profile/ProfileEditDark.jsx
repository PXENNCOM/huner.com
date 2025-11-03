// pages/student/components/ProfileEditDark.jsx
import React, { useState } from 'react';

const ProfileEditDark = ({ profile, onSubmit, onCancel }) => {
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
      const { uploadProfileImage } = await import('../../../../services/api');
      const formDataImg = new FormData();
      formDataImg.append('profileImage', profileImage);
      
      const response = await uploadProfileImage(formDataImg);
      
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
      // Form verilerini hazırla
      const updatedFormData = {
        ...formData
      };
      
      // Eğer yeni bir profil resmi seçildiyse, onu yükle
      if (profileImage) {
        const profileImageFilename = await handleImageUpload();
        if (profileImageFilename) {
          updatedFormData.profileImage = profileImageFilename;
        }
      } else {
        // Yeni resim seçilmediyse, mevcut profil resmini koru
        if (profile?.profileImage) {
          updatedFormData.profileImage = profile.profileImage;
        }
      }
      
      await onSubmit(updatedFormData);
    } catch (error) {
      console.error('Error during form submission:', error);
      setErrors(prev => ({ ...prev, submit: 'Form gönderilirken bir hata oluştu' }));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Ayrıca profil resmini kaldırmak için ek bir fonksiyon
  const handleRemoveImage = () => {
    setProfileImage(null);
    setPreviewImage(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Image Section */}
      <div className="bg-blue-800/30 backdrop-blur-xl rounded-xl p-6 border border-blue-700/30">
        <h3 className="text-lg font-medium text-white mb-4">Profile Photo</h3>
        
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-xl overflow-hidden bg-blue-700/30 flex items-center justify-center border border-blue-600/30">
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt="Profil Önizleme" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-semibold text-blue-300">
                  {formData.fullName?.charAt(0)?.toUpperCase() || '?'}
                </span>
              )}
            </div>
            
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
              className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 hover:opacity-100 transition-opacity cursor-pointer rounded-xl"
            >
              <span className="text-white text-xs font-medium">Change</span>
            </label>
          </div>
          
          {errors.image && (
            <p className="text-sm text-red-400 text-center">{errors.image}</p>
          )}
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-blue-800/30 backdrop-blur-xl rounded-xl p-6 border border-blue-700/30">
        <h3 className="text-lg font-medium text-white mb-4">Basic Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-blue-200 mb-2">
              Name Surname *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg bg-blue-900/40 border text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.fullName ? 'border-red-500' : 'border-blue-600/50'
              }`}
              placeholder="Name Surname"
            />
            {errors.fullName && <p className="mt-1 text-sm text-red-400">{errors.fullName}</p>}
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-medium text-blue-200 mb-2">
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-blue-900/40 border border-blue-600/50 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Age"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-blue-200 mb-2">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-blue-900/40 border border-blue-600/50 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="The city you live in"
            />
          </div>

          <div>
            <label htmlFor="school" className="block text-sm font-medium text-blue-200 mb-2">
              School
            </label>
            <input
              type="text"
              id="school"
              name="school"
              value={formData.school}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-blue-900/40 border border-blue-600/50 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Name of your school"
            />
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-blue-200 mb-2">
              School Section
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-blue-900/40 border border-blue-600/50 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="School Section"
            />
          </div>

          <div>
            <label htmlFor="educationLevel" className="block text-sm font-medium text-blue-200 mb-2">
              Education Level
            </label>
            <select
              id="educationLevel"
              name="educationLevel"
              value={formData.educationLevel}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-blue-900/40 border border-blue-600/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="lisans">Licence</option>
              <option value="yuksek_lisans">degree</option>
              <option value="doktora">doctorate</option>
              <option value="mezun">Graduate</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="currentGrade" className="block text-sm font-medium text-blue-200 mb-2">
              Class
            </label>
            <input
              type="text"
              id="currentGrade"
              name="currentGrade"
              value={formData.currentGrade}
              onChange={handleChange}
              placeholder="Example: 3rd Grade"
              className="w-full px-3 py-2 rounded-lg bg-blue-900/40 border border-blue-600/50 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      </div>

      {/* Bio and Skills */}
      <div className="bg-blue-800/30 backdrop-blur-xl rounded-xl p-6 border border-blue-700/30">
        <h3 className="text-lg font-medium text-white mb-4">About Me & Skils</h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="shortBio" className="block text-sm font-medium text-blue-200 mb-2">
              Short Biography
            </label>
            <textarea
              id="shortBio"
              name="shortBio"
              rows="3"
              value={formData.shortBio}
              onChange={handleChange}
              placeholder="Briefly introduce yourself (280 characters max)"
              maxLength="280"
              className="w-full px-3 py-2 rounded-lg bg-blue-900/40 border border-blue-600/50 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            ></textarea>
            <p className="mt-1 text-xs text-blue-300 text-right">
              {formData.shortBio.length}/280 characters
            </p>
          </div>

          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-blue-200 mb-2">
              Skils
            </label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="JavaScript, React, Node.js, ..."
              className="w-full px-3 py-2 rounded-lg bg-blue-900/40 border border-blue-600/50 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <p className="mt-1 text-xs text-blue-300">Add separated by commas.</p>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-blue-800/30 backdrop-blur-xl rounded-xl p-6 border border-blue-700/30">
        <h3 className="text-lg font-medium text-white mb-4">Social Media</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="githubProfile" className="block text-sm font-medium text-blue-200 mb-2">
              GitHub Profile
            </label>
            <input
              type="text"
              id="githubProfile"
              name="githubProfile"
              value={formData.githubProfile}
              onChange={handleChange}
              placeholder="https://github.com/username"
              className={`w-full px-3 py-2 rounded-lg bg-blue-900/40 border text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.githubProfile ? 'border-red-500' : 'border-blue-600/50'
              }`}
            />
            {errors.githubProfile && <p className="mt-1 text-sm text-red-400">{errors.githubProfile}</p>}
          </div>

          <div>
            <label htmlFor="linkedinProfile" className="block text-sm font-medium text-blue-200 mb-2">
              LinkedIn Profile
            </label>
            <input
              type="text"
              id="linkedinProfile"
              name="linkedinProfile"
              value={formData.linkedinProfile}
              onChange={handleChange}
              placeholder="https://www.linkedin.com/in/username"
              className={`w-full px-3 py-2 rounded-lg bg-blue-900/40 border text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.linkedinProfile ? 'border-red-500' : 'border-blue-600/50'
              }`}
            />
            {errors.linkedinProfile && <p className="mt-1 text-sm text-red-400">{errors.linkedinProfile}</p>}
          </div>
        </div>
      </div>

      {/* Languages */}
      <div className="bg-blue-800/30 backdrop-blur-xl rounded-xl p-6 border border-blue-700/30">
        <h3 className="text-lg font-medium text-white mb-4">Grammar</h3>
        
        {/* Current Languages */}
        <div className="mb-4">
          {languages.length === 0 ? (
            <p className="text-blue-300 text-center py-4">No languages ​​have been added yet.</p>
          ) : (
            <div className="space-y-2">
              {languages.map((lang, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-blue-700/30 rounded-lg border border-blue-600/30">
                  <div>
                    <span className="font-medium text-white">{lang.lang}</span>
                    <span className="ml-2 text-sm text-blue-200">({lang.level})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveLanguage(index)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Add New Language */}
       <div className="border-t border-blue-700/50 pt-4">
  <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
    <input
      type="text"
      value={newLanguage.lang}
      onChange={(e) => setNewLanguage({ ...newLanguage, lang: e.target.value })}
      placeholder="Dil adı"
      className={`flex-1 px-3 py-2 rounded-lg bg-blue-900/40 border text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
        errors.language ? 'border-red-500' : 'border-blue-600/50'
      }`}
    />
    
    <select
      value={newLanguage.level}
      onChange={(e) => setNewLanguage({ ...newLanguage, level: e.target.value })}
      className="px-3 py-2 rounded-lg bg-blue-900/40 border border-blue-600/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-0 sm:w-auto"
    >
      <option value="Başlangıç">Beginning</option>
      <option value="Orta">Middle</option>
      <option value="İleri">Forward</option>
      <option value="Ana Dil">Main language</option>
    </select>
    
    <button
      type="button"
      onClick={handleAddLanguage}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors whitespace-nowrap flex-shrink-0"
    >
      Add
    </button>
  </div>
  {errors.language && <p className="mt-2 text-sm text-red-400">{errors.language}</p>}
</div>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="bg-red-900/20 border border-red-500/50 text-red-300 p-4 rounded-lg" role="alert">
          <p>{errors.submit}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-blue-700/30 hover:bg-blue-600/40 border border-blue-600/50 text-blue-200 hover:text-white rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || uploadingImage}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-75 flex items-center"
        >
          {(isSubmitting || uploadingImage) && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          Save
        </button>
      </div>
    </form>
  );
};

export default ProfileEditDark;