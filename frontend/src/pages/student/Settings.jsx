// pages/student/Settings.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import StudentLayout from './components/StudentLayout';

const StudentSettings = () => {
  const { user, changePassword, logout } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    jobUpdates: true,
    adminMessages: true
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggle = (e) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Validasyon
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Yeni şifreler eşleşmiyor' });
      return;
    }
    
    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Yeni şifre en az 6 karakter olmalıdır' });
      return;
    }
    
    setLoading(true);
    
    try {
      await changePassword(formData.currentPassword, formData.newPassword);
      setMessage({ type: 'success', text: 'Şifreniz başarıyla değiştirildi' });
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Şifre değiştirme hatası: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    // Bildirimleri kaydetme işlemi (API istekleri burada olacak)
    setMessage({ type: 'success', text: 'Bildirim tercihleri kaydedildi' });
  };

  // Mesajı belirli bir süre sonra kaldır
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <StudentLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Hesap Ayarları</h1>
        
        {message.text && (
          <div className={`p-4 rounded-md mb-6 ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.text}
          </div>
        )}
        
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Hesap Bilgileri</h2>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">E-posta</label>
              <p className="mt-1 text-gray-900">{user.email}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Kullanıcı Türü</label>
              <p className="mt-1 text-gray-900 capitalize">{user.userType}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Hesap Oluşturma</label>
              <p className="mt-1 text-gray-900">
                {new Date(user.createdAt).toLocaleDateString('tr-TR')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Şifre Değiştir</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                  Mevcut Şifre
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  Yeni Şifre
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Yeni Şifre (Tekrar)
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {loading ? 'İşleniyor...' : 'Şifreyi Değiştir'}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Bildirim Ayarları</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSaveNotifications} className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  name="emailNotifications"
                  checked={notifications.emailNotifications}
                  onChange={handleToggle}
                  className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                  E-posta bildirimleri
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="jobUpdates"
                  name="jobUpdates"
                  checked={notifications.jobUpdates}
                  onChange={handleToggle}
                  className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <label htmlFor="jobUpdates" className="ml-2 block text-sm text-gray-700">
                  İş güncellemeleri
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="adminMessages"
                  name="adminMessages"
                  checked={notifications.adminMessages}
                  onChange={handleToggle}
                  className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <label htmlFor="adminMessages" className="ml-2 block text-sm text-gray-700">
                  Admin mesajları
                </label>
              </div>
              
              <div>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Tercihleri Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Hesap Yönetimi</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Hesabınızdan çıkış yapmak veya diğer hesap işlemlerini gerçekleştirmek için aşağıdaki seçenekleri kullanabilirsiniz.
            </p>
            <div className="space-y-4">
              <button
                onClick={logout}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Çıkış Yap
              </button>
              
              <button
                className="inline-flex justify-center py-2 px-4 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Hesabımı Devre Dışı Bırak
              </button>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentSettings;