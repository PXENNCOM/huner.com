import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Bu bileşen şifre sıfırlama işlemini yönetir
const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // E-posta boş mu kontrol et
    if (!email.trim()) {
      setIsError(true);
      setMessage('E-posta adresi boş olamaz!');
      return;
    }
    
    // E-posta formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setIsError(true);
      setMessage('Geçerli bir e-posta adresi girin!');
      return;
    }
    
    setLoading(true);
    setIsError(false);
    
    try {
      // API'yi entegre ettiğinizde bu kısma şifre sıfırlama isteği eklenecek
      // Şimdilik sadece demo mesajı gösteriyoruz
      setTimeout(() => {
        setMessage('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
        setLoading(false);
      }, 1500);
      
      // Gerçek API isteği şöyle olacak:
      // const response = await api.post('/auth/reset-password', { email });
      // setMessage(response.data.message);
    } catch (error) {
      setIsError(true);
      setMessage('Şifre sıfırlama işlemi başarısız oldu. Lütfen tekrar deneyin.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Şifremi Unuttum</h2>
        
        {message && (
          <div 
            className={`${isError ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700'} px-4 py-3 rounded relative mb-4`} 
            role="alert"
          >
            <span className="block sm:inline">{message}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-posta</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="ornek@email.com"
            />
            <p className="mt-1 text-xs text-gray-500">
              Kayıtlı e-posta adresinizi girin, şifre sıfırlama bağlantısı göndereceğiz.
            </p>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'İşleniyor...' : 'Şifre Sıfırlama Bağlantısı Gönder'}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            <Link to="/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
              Giriş sayfasına dön
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;