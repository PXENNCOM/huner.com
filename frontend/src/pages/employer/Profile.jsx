import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmployerProfile, updateEmployerProfile, uploadEmployerProfileImage } from '../../services/employerApi';
import EmployerLayout from './components/EmployerLayout';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    phoneNumber: '',
    city: '',
    address: '',
    age: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getEmployerProfile();
      setProfile(response.data);
      
      // Form verilerini doldur
      const { fullName, companyName, phoneNumber, city, address, age, profileImage } = response.data;
      setFormData({
        fullName: fullName || '',
        companyName: companyName || '',
        phoneNumber: phoneNumber || '',
        city: city || '',
        address: address || '',
        age: age || ''
      });
      
      // Profil resmi varsa önizleme ayarla
      if (profileImage) {
        setPreviewImage(`/uploads/profile-images/${profileImage}`);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Profil bilgileri yüklenirken hata oluştu:', err);
      setError('Profil bilgileri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      setLoading(false);
      
      // API hatası olduğunda boş bir profil objesi oluşturuyoruz
      // Bu, render hatalarını önleyecektir
      setProfile({
        fullName: '',
        companyName: '',
        phoneNumber: '',
        city: '',
        address: '',
        age: '',
        profileImage: null,
        User: { email: '' }
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Önce profil resmini yükle (varsa)
      let updatedProfileImage = profile?.profileImage;
      
      if (profileImage) {
        const formData = new FormData();
        formData.append('profileImage', profileImage);
        
        const imageResponse = await uploadEmployerProfileImage(formData);
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
      setSaving(false);
      
      // Profil bilgilerini yeniden yükle
      fetchProfile();
    } catch (err) {
      console.error('Profil güncellenirken hata oluştu:', err);
      setError('Profil güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <EmployerLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </EmployerLayout>
    );
  }

  // Profile null olduğunda boş bir sayfa göster
  if (!profile) {
    return (
      <EmployerLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>Profil bilgileri yüklenemedi. Lütfen daha sonra tekrar deneyin.</p>
          </div>
        </div>
      </EmployerLayout>
    );
  }

  return (
    <EmployerLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">İşveren Profili</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Profili Düzenle
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
            <p>{success}</p>
          </div>
        )}

        {isEditing ? (
          // Düzenleme Formu
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
            {/* Profil Resmi Yükleme */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Profil Önizleme" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/150?text=' + (formData.fullName?.charAt(0)?.toUpperCase() || 'İ');
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500 text-3xl font-bold">
                      {formData.fullName?.charAt(0)?.toUpperCase() || 'İ'}
                    </div>
                  )}
                </div>
                
                <label 
                  htmlFor="profileImage" 
                  className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 cursor-pointer hover:bg-blue-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </label>
                
                <input 
                  type="file" 
                  id="profileImage" 
                  name="profileImage" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="hidden" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
                  Ad Soyad
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Ad Soyad"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="companyName">
                  Şirket Adı
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="companyName"
                  name="companyName"
                  type="text"
                  placeholder="Şirket Adı"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">
                  Telefon Numarası
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="Telefon Numarası"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                  Şehir
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="city"
                  name="city"
                  type="text"
                  placeholder="Şehir"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="age">
                  Yaş
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="age"
                  name="age"
                  type="number"
                  min="18"
                  max="100"
                  placeholder="Yaş"
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                Adres
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="address"
                name="address"
                rows="3"
                placeholder="Adres"
                value={formData.address}
                onChange={handleChange}
              ></textarea>
            </div>
            
            <div className="flex items-center justify-end mt-6 space-x-4">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  fetchProfile(); // Değişiklikleri geri al
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                disabled={saving}
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Kaydediliyor...
                  </>
                ) : (
                  'Kaydet'
                )}
              </button>
            </div>
          </form>
        ) : (
          // Profil Görüntüleme
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4 md:mb-0 md:mr-6">
                  {profile.profileImage ? (
                    <img 
                      src={`/uploads/profile-images/${profile.profileImage}`} 
                      alt={profile.fullName} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/150?text=' + (profile.fullName?.charAt(0)?.toUpperCase() || 'İ');
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500 text-3xl font-bold">
                      {profile.fullName?.charAt(0)?.toUpperCase() || 'İ'}
                    </div>
                  )}
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold">{profile.fullName || 'İsim belirtilmemiş'}</h2>
                  <p className="text-gray-600">
                    {profile.companyName ? (
                      <span>{profile.companyName}</span>
                    ) : (
                      <span className="text-gray-400 italic">Şirket adı belirtilmemiş</span>
                    )}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">{profile.User?.email || ''}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">İletişim Bilgileri</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Telefon Numarası</p>
                      <p className="font-medium">
                        {profile.phoneNumber || (
                          <span className="text-gray-400 italic">Belirtilmemiş</span>
                        )}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">E-posta</p>
                      <p className="font-medium">{profile.User?.email || ''}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Şehir</p>
                      <p className="font-medium">
                        {profile.city || (
                          <span className="text-gray-400 italic">Belirtilmemiş</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Diğer Bilgiler</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Yaş</p>
                      <p className="font-medium">
                        {profile.age || (
                          <span className="text-gray-400 italic">Belirtilmemiş</span>
                        )}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Adres</p>
                      <p className="font-medium">
                        {profile.address || (
                          <span className="text-gray-400 italic">Belirtilmemiş</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </EmployerLayout>
  );
};

export default Profile;