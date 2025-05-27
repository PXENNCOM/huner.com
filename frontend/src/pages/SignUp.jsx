import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    linkedinProfile: '',
    githubProfile: '',
    userType: 'student' // Varsayılan olarak öğrenci seçildi
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    // Şifre eşleşme kontrolü
    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor!');
      return false;
    }
    
    // Şifre uzunluk kontrolü
    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır!');
      return false;
    }
    
    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Geçerli bir e-posta adresi girin!');
      return false;
    }
    
    // İsim kontrolü
    if (!formData.fullName || formData.fullName.trim() === '') {
      setError('İsim alanı boş bırakılamaz!');
      return false;
    }
    
    // Öğrenci seçildiyse LinkedIn ve GitHub zorunlu
    if (formData.userType === 'student') {
      if (!formData.linkedinProfile || formData.linkedinProfile.trim() === '') {
        setError('Öğrenci hesabı için LinkedIn profili zorunludur!');
        return false;
      }
      
      if (!formData.githubProfile || formData.githubProfile.trim() === '') {
        setError('Öğrenci hesabı için GitHub profili zorunludur!');
        return false;
      }
    }
    
    // LinkedIn URL kontrolü (doldurulduysa kontrol et)
    if (formData.linkedinProfile && !formData.linkedinProfile.includes('linkedin.com')) {
      setError('Geçerli bir LinkedIn profil URL\'si girin!');
      return false;
    }
    
    // GitHub URL kontrolü (doldurulduysa kontrol et)
    if (formData.githubProfile && !formData.githubProfile.includes('github.com')) {
      setError('Geçerli bir GitHub profil URL\'si girin!');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Form doğrulama
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        linkedinProfile: formData.userType === 'student' ? formData.linkedinProfile : null,
        githubProfile: formData.userType === 'student' ? formData.githubProfile : null,
        userType: formData.userType
      };
      
      const result = await register(userData);
      
      if (result.success) {
        setSuccess(
          formData.userType === 'student' 
            ? 'Kayıt başarılı! Admin onayı bekleniyor.' 
            : 'Kayıt başarılı! Giriş yapabilirsiniz.'
        );
        
        // Öğrenci hesabı oluşturulduysa 3 saniye sonra giriş sayfasına yönlendir
        if (formData.userType === 'student') {
          setTimeout(() => {
            navigate('/signin');
          }, 3000);
        } else {
          // Diğer hesap türleri için hemen giriş sayfasına yönlendir
          setTimeout(() => {
            navigate('/signin');
          }, 1500);
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Hesap Oluştur</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{success}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Ad Soyad</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ad Soyad"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-posta</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="ornek@email.com"
            />
          </div>
          
          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-gray-700">Hesap Türü</label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="student">Öğrenci</option>
              <option value="employer">İşveren</option>
            </select>
            {formData.userType === 'student' && (
              <p className="mt-1 text-xs text-gray-500">Öğrenci hesapları admin onayından sonra aktif olacaktır.</p>
            )}
          </div>
          
          {/* LinkedIn ve GitHub alanları sadece öğrenci seçildiğinde gösteriliyor */}
          {formData.userType === 'student' && (
            <>
              <div>
                <label htmlFor="linkedinProfile" className="block text-sm font-medium text-gray-700">
                  LinkedIn Profili <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  id="linkedinProfile"
                  name="linkedinProfile"
                  value={formData.linkedinProfile}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://www.linkedin.com/in/kullaniciadi"
                />
                <p className="mt-1 text-xs text-gray-500">Zorunlu alan</p>
              </div>
              
              <div>
                <label htmlFor="githubProfile" className="block text-sm font-medium text-gray-700">
                  GitHub Profili <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  id="githubProfile"
                  name="githubProfile"
                  value={formData.githubProfile}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://github.com/kullaniciadi"
                />
                <p className="mt-1 text-xs text-gray-500">Zorunlu alan</p>
              </div>
            </>
          )}
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Şifre</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
            <p className="mt-1 text-xs text-gray-500">En az 6 karakter olmalıdır</p>
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Şifre (Tekrar)</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'İşleniyor...' : 'Kayıt Ol'}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Zaten hesabınız var mı?{' '}
            <Link to="/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;