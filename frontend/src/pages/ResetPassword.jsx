// components/ResetPassword.js - Ana şifre sıfırlama component'i
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Shield, CheckCircle, Eye, EyeOff } from 'lucide-react';import api from '../services/api';

const ResetPassword = () => {
  const [currentStep, setCurrentStep] = useState(1); // 1: Email, 2: SMS Code, 3: New Password
  const [formData, setFormData] = useState({
    email: '',
    resetToken: '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  // Step 1: Email gönderme
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email.trim()) {
      setError('E-posta adresi gereklidir');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Geçerli bir e-posta adresi girin');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await api.post('/auth/request-password-reset', {
        email: formData.email
      });
      
      if (response.data.success) {
        setFormData(prev => ({ ...prev, resetToken: response.data.resetToken }));
        setSuccess('Şifre sıfırlama kodu telefon numaranıza gönderildi');
        setTimeout(() => {
          setCurrentStep(2);
          setSuccess('');
        }, 2000);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: SMS kod doğrulama
  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.code.trim()) {
      setError('Doğrulama kodu gereklidir');
      return;
    }
    
    if (formData.code.length !== 6) {
      setError('Doğrulama kodu 6 haneli olmalıdır');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await api.post('/auth/verify-reset-code', {
        resetToken: formData.resetToken,
        code: formData.code
      });
      
      if (response.data.success) {
        setSuccess('Kod doğrulandı! Yeni şifrenizi belirleyin');
        setTimeout(() => {
          setCurrentStep(3);
          setSuccess('');
        }, 1500);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Geçersiz doğrulama kodu');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Yeni şifre belirleme
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.newPassword || !formData.confirmPassword) {
      setError('Tüm alanlar gereklidir');
      return;
    }
    
    if (formData.newPassword.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await api.post('/auth/reset-password', {
        resetToken: formData.resetToken,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });
      
      if (response.data.success) {
        setSuccess('Şifre başarıyla güncellendi!');
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Şifre güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <EmailStep 
            formData={formData}
            onChange={handleInputChange}
            onSubmit={handleEmailSubmit}
            loading={loading}
          />
        );
      case 2:
        return (
          <CodeVerificationStep
            formData={formData}
            onChange={handleInputChange}
            onSubmit={handleCodeSubmit}
            loading={loading}
            onBack={() => setCurrentStep(1)}
          />
        );
      case 3:
        return (
          <NewPasswordStep
            formData={formData}
            onChange={handleInputChange}
            onSubmit={handlePasswordSubmit}
            loading={loading}
            onBack={() => setCurrentStep(2)}
          />
        );
      default:
        return null;
    }
  };

  const getStepIcon = () => {
    switch (currentStep) {
      case 1: return <Mail className="w-8 h-8 text-white" />;
      case 2: return <Shield className="w-8 h-8 text-white" />;
      case 3: return <CheckCircle className="w-8 h-8 text-white" />;
      default: return <Mail className="w-8 h-8 text-white" />;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Şifre Sıfırlama';
      case 2: return 'Kod Doğrulama';
      case 3: return 'Yeni Şifre';
      default: return 'Şifre Sıfırlama';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return 'E-posta adresinizi girin';
      case 2: return 'Telefonunuza gelen kodu girin';
      case 3: return 'Yeni şifrenizi belirleyin';
      default: return 'E-posta adresinizi girin';
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 font-sans">
      
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/bg.jpg)'
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#004493]/70 to-[#0158C1]/70"></div>
      </div>
      
     <style>{`
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-in-out;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  input[type="text"]:-webkit-autofill,
  input[type="email"]:-webkit-autofill,
  input[type="password"]:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px rgba(255, 255, 255, 0.05) inset !important;
    -webkit-text-fill-color: white !important;
    background-color: rgba(255, 255, 255, 0.05) !important;
    transition: background-color 5000s ease-in-out 0s;
  }

  input {
    background-color: rgba(255, 255, 255, 0.05) !important;
    color: white !important;
  }

  input::placeholder {
    color: rgba(59, 130, 246, 0.6) !important;
  }
`}</style>
      
      {/* Decorative elements */}
      <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-[#0158C1] to-[#004493] rounded-full opacity-60 z-10"></div>
      <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-[#004493] to-[#0158C1] rounded-full opacity-60 z-10"></div>

      <div className="relative w-full max-w-md z-10">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  currentStep >= step 
                    ? 'bg-white text-[#004493] shadow-lg'
                    : 'bg-white/50 text-white/70'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 rounded transition-all duration-300 ${
                    currentStep > step ? 'bg-white' : 'bg-white/20'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm text-blue-200">Adım {currentStep} / 3</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 transform transition-all duration-500">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#0158C1] to-[#004493] rounded-2xl mb-4 shadow-lg">
              {getStepIcon()}
            </div>
            <h2 className="text-2xl font-bold text-white text-center">{getStepTitle()}</h2>
            <p className="text-blue-200 text-center mt-2">{getStepDescription()}</p>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-100 px-4 py-3 rounded-xl mb-6 flex items-center transition-all duration-300">
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 backdrop-blur-sm border border-green-400/30 text-green-200 px-4 py-3 rounded-xl mb-6 flex items-center transition-all duration-300">
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{success}</span>
            </div>
          )}

          {/* Step Content */}
          <div className="animate-fadeIn">
            {renderStepContent()}
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <p className="text-sm text-blue-200">
            <Link to="/signin" className="font-medium text-blue-300 hover:text-blue-200 transition-colors duration-200">
              Giriş sayfasına dön
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// Email Step Component
const EmailStep = ({ formData, onChange, onSubmit, loading }) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div className="group">
      <label htmlFor="email" className="block text-sm font-medium text-blue-200 mb-2">
        E-posta Adresi <span className="text-red-300">*</span>
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Mail className="h-5 w-5 text-blue-300 group-focus-within:text-blue-400 transition-colors" />
        </div>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          required
          className="block w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-[#0158C1] focus:border-transparent transition-all duration-200 backdrop-blur-sm"
          placeholder="ornek@email.com"
        />
      </div>
      <p className="mt-2 text-xs text-blue-300">
        Kayıtlı e-posta adresinizi girin, şifre sıfırlama kodu telefon numaranıza gönderilecek
      </p>
    </div>

    <button
      type="submit"
      disabled={loading}
      className="w-full py-3 px-4 bg-gradient-to-r from-[#004493] to-[#0158C1] text-white rounded-xl font-semibold hover:from-[#003377] hover:to-[#004493] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Gönderiliyor...
        </div>
      ) : (
        'Doğrulama Kodu Gönder'
      )}
    </button>
  </form>
);

// Code Verification Step Component
const CodeVerificationStep = ({ formData, onChange, onSubmit, loading, onBack }) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div className="group">
      <label htmlFor="code" className="block text-sm font-medium text-blue-200 mb-2">
        Doğrulama Kodu <span className="text-red-300">*</span>
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Shield className="h-5 w-5 text-blue-300 group-focus-within:text-blue-400 transition-colors" />
        </div>
        <input
          type="text"
          id="code"
          name="code"
          value={formData.code}
          onChange={onChange}
          maxLength="6"
          required
          className="block w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-[#0158C1] focus:border-transparent transition-all duration-200 backdrop-blur-sm text-center text-lg tracking-wider"
          placeholder="123456"
        />
      </div>
      <p className="mt-2 text-xs text-blue-300">
        Telefon numaranıza gönderilen 6 haneli kodu girin
      </p>
    </div>

    <div className="flex space-x-4">
      <button
        type="button"
        onClick={onBack}
        className="flex-1 py-3 px-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 border border-white/20 hover:border-white/30 transition-all duration-200"
      >
        <span className="flex items-center justify-center">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Geri
        </span>
      </button>

      <button
        type="submit"
        disabled={loading}
        className="flex-1 py-3 px-4 bg-gradient-to-r from-[#004493] to-[#0158C1] text-white rounded-xl font-semibold hover:from-[#003377] hover:to-[#004493] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Doğrulanıyor...
          </div>
        ) : (
          'Doğrula'
        )}
      </button>
    </div>
  </form>
);

// New Password Step Component  
const NewPasswordStep = ({ formData, onChange, onSubmit, loading, onBack }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="group">
          <label htmlFor="newPassword" className="block text-sm font-medium text-blue-200 mb-2">
            Yeni Şifre <span className="text-red-300">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CheckCircle className="h-5 w-5 text-blue-300 group-focus-within:text-blue-400 transition-colors" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={onChange}
              required
              className="block w-full pl-10 pr-12 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-[#0158C1] focus:border-transparent transition-all duration-200 backdrop-blur-sm"
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-300 hover:text-blue-400 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <p className="mt-1 text-xs text-blue-300">En az 6 karakter olmalıdır</p>
        </div>

        <div className="group">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-blue-200 mb-2">
            Şifre Tekrarı <span className="text-red-300">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CheckCircle className="h-5 w-5 text-blue-300 group-focus-within:text-blue-400 transition-colors" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={onChange}
              required
              className="block w-full pl-10 pr-12 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-[#0158C1] focus:border-transparent transition-all duration-200 backdrop-blur-sm"
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-300 hover:text-blue-400 transition-colors"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 px-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 border border-white/20 hover:border-white/30 transition-all duration-200"
        >
          <span className="flex items-center justify-center">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Geri
          </span>
        </button>

        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3 px-4 bg-gradient-to-r from-[#004493] to-[#0158C1] text-white rounded-xl font-semibold hover:from-[#003377] hover:to-[#004493] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Güncelleniyor...
            </div>
          ) : (
            'Şifreyi Güncelle'
          )}
        </button>
      </div>
    </form>
  );
};

export default ResetPassword;