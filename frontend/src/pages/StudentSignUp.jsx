import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Eye, EyeOff, Mail, Lock, User, Linkedin, Github, Info, ArrowRight, ArrowLeft, GraduationCap, Phone } from 'lucide-react';

const StudentSignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '', // Yeni eklenen alan
    linkedinProfile: '',
    githubProfile: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const validateStep = (step) => {
    setError('');
    
    if (step === 1) {
      if (!formData.fullName || formData.fullName.trim() === '') {
        setError('Full Name is required');
        return false;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return false;
      }

      // Telefon numarası validasyonu
      if (!formData.phoneNumber || formData.phoneNumber.trim() === '') {
        setError('Phone number is required');
        return false;
      }
      
      const phoneRegex = /^[0-9+\-\s()]{10,}$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
        setError('Please enter a valid phone number');
        return false;
      }
      
    } else if (step === 2) {
      if (!formData.linkedinProfile || formData.linkedinProfile.trim() === '') {
        setError('LinkedIn profile is required');
        return false;
      }
      if (formData.linkedinProfile && !formData.linkedinProfile.includes('linkedin.com')) {
        setError('Please enter a valid LinkedIn profile URL!');
        return false;
      }
      
      if (!formData.githubProfile || formData.githubProfile.trim() === '') {
        setError('GitHub profile is required');
        return false;
      }
      if (formData.githubProfile && !formData.githubProfile.includes('github.com')) {
        setError('Please enter a valid GitHub profile URL!');
        return false;
      }
      
    } else if (step === 3) {
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }
    
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');
  
  if (!validateStep(3)) {
    return;
  }
  
  setLoading(true);
  
  try {
    const userData = {
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber,
      linkedinProfile: formData.linkedinProfile,
      githubProfile: formData.githubProfile,
      userType: 'student'
    };
    
    // ✅ DOĞRUDAN API ÇAĞRISI (register hook yerine)
    const response = await api.post('/auth/register', userData);
    
    console.log('✅ Registration Response:', response.data);
    
    if (response.data.success && response.data.needsEmailVerification) {
      console.log('✅ Redirecting to email verification...');
      // Email doğrulama sayfasına yönlendir
      navigate('/verify-email', { 
        state: { 
          userId: response.data.userId,
          email: formData.email 
        } 
      });
    } else if (response.data.success) {
      setSuccess('Registration successful!');
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    } else {
      setError(response.data.message || 'Registration failed');
    }
  } catch (err) {
    console.error('❌ Registration error:', err.response?.data);
    setError(err.response?.data?.message || 'An error occurred during registration. Please try again.');
  } finally {
    setLoading(false);
  }
};
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-4">
              <div className="group">
                <label htmlFor="fullName" className="block text-sm font-medium text-blue-200 mb-2">
                  Full Name <span className="text-red-300">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-blue-300 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: 'white'
                    }}
                    className="block w-full pl-10 pr-4 py-3 !bg-white/5 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-[#0158C1] focus:border-transparent focus:!bg-white/5 transition-all duration-200 backdrop-blur-sm"
                    placeholder="Your Name and Surname"
                  />
                </div>
              </div>
              
              <div className="group">
                <label htmlFor="email" className="block text-sm font-medium text-blue-200 mb-2">
                  Email Address <span className="text-red-300">*</span>
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
                    onChange={handleChange}
                    autoComplete="email"
                    required
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: 'white'
                    }}
                    className="block w-full pl-10 pr-4 py-3 !bg-white/5 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-[#0158C1] focus:border-transparent focus:!bg-white/5 transition-all duration-200 backdrop-blur-sm"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              {/* YENİ EKLENEN TELEFON NUMARASI ALANI */}
              <div className="group">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-blue-200 mb-2">
                  Phone Number <span className="text-red-300">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-blue-300 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    autoComplete="tel"
                    required
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: 'white'
                    }}
                    className="block w-full pl-10 pr-4 py-3 !bg-white/5 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-[#0158C1] focus:border-transparent focus:!bg-white/5 transition-all duration-200 backdrop-blur-sm"
                    placeholder="+90 555 123 45 67"
                  />
                </div>
                <p className="mt-1 text-xs text-blue-300">Include country code (required for password reset)</p>
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-4">
              <div className="group">
                <label htmlFor="linkedinProfile" className="block text-sm font-medium text-blue-200 mb-2">
                  LinkedIn Profile <span className="text-red-300">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Linkedin className="h-5 w-5 text-blue-300 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    type="url"
                    id="linkedinProfile"
                    name="linkedinProfile"
                    value={formData.linkedinProfile}
                    onChange={handleChange}
                    autoComplete="url"
                    required
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: 'white'
                    }}
                    className="block w-full pl-10 pr-4 py-3 !bg-white/5 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-[#0158C1] focus:border-transparent focus:!bg-white/5 transition-all duration-200 backdrop-blur-sm"
                    placeholder="https://www.linkedin.com/in/username"
                  />
                </div>
                <p className="mt-1 text-xs text-blue-300">Required field</p>
              </div>
              
              <div className="group">
                <label htmlFor="githubProfile" className="block text-sm font-medium text-blue-200 mb-2">
                  GitHub Profile <span className="text-red-300">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Github className="h-5 w-5 text-blue-300 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    type="url"
                    id="githubProfile"
                    name="githubProfile"
                    value={formData.githubProfile}
                    onChange={handleChange}
                    autoComplete="url"
                    required
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: 'white'
                    }}
                    className="block w-full pl-10 pr-4 py-3 !bg-white/5 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-[#0158C1] focus:border-transparent focus:!bg-white/5 transition-all duration-200 backdrop-blur-sm"
                    placeholder="https://github.com/username"
                  />
                </div>
                <p className="mt-1 text-xs text-blue-300">Required field</p>
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-4">
              <div className="group">
                <label htmlFor="password" className="block text-sm font-medium text-blue-200 mb-2">
                  Password <span className="text-red-300">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-blue-300 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: 'white'
                    }}
                    className="block w-full pl-10 pr-12 py-3 !bg-white/5 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-[#0158C1] focus:border-transparent focus:!bg-white/5 transition-all duration-200 backdrop-blur-sm"
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
                <p className="mt-2 text-xs text-blue-300">Must be at least 6 characters</p>
              </div>
              
              <div className="group">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-blue-200 mb-2">
                  Confirm Password <span className="text-red-300">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-blue-300 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: 'white'
                    }}
                    className="block w-full pl-10 pr-12 py-3 !bg-white/5 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-[#0158C1] focus:border-transparent focus:!bg-white/5 transition-all duration-200 backdrop-blur-sm"
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
              
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 mt-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-blue-300" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-200">
                      <strong>Important:</strong> Student accounts will be activated after admin approval.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
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
        {/* Dark overlay for better readability */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Blue gradient overlay to maintain color scheme */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#004493]/70 to-[#0158C1]/70"></div>
      </div>
      
      {/* CSS Düzeltmeleri */}
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

        /* Input autofill ve arka plan düzeltmeleri */
        input[type="text"]:-webkit-autofill,
        input[type="text"]:-webkit-autofill:hover,
        input[type="text"]:-webkit-autofill:focus,
        input[type="text"]:-webkit-autofill:active,
        input[type="email"]:-webkit-autofill,
        input[type="email"]:-webkit-autofill:hover,
        input[type="email"]:-webkit-autofill:focus,
        input[type="email"]:-webkit-autofill:active,
        input[type="url"]:-webkit-autofill,
        input[type="url"]:-webkit-autofill:hover,
        input[type="url"]:-webkit-autofill:focus,
        input[type="url"]:-webkit-autofill:active,
        input[type="tel"]:-webkit-autofill,
        input[type="tel"]:-webkit-autofill:hover,
        input[type="tel"]:-webkit-autofill:focus,
        input[type="tel"]:-webkit-autofill:active,
        input[type="password"]:-webkit-autofill,
        input[type="password"]:-webkit-autofill:hover,
        input[type="password"]:-webkit-autofill:focus,
        input[type="password"]:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px rgba(255, 255, 255, 0.05) inset !important;
          -webkit-text-fill-color: white !important;
          background-color: rgba(255, 255, 255, 0.05) !important;
          transition: background-color 5000s ease-in-out 0s;
        }

        input[type="text"],
        input[type="email"],
        input[type="url"],
        input[type="tel"],
        input[type="password"] {
          background-color: rgba(255, 255, 255, 0.05) !important;
          color: white !important;
        }

        input[type="text"]:focus,
        input[type="email"]:focus,
        input[type="url"]:focus,
        input[type="tel"]:focus,
        input[type="password"]:focus {
          background-color: rgba(255, 255, 255, 0.05) !important;
        }

        input[type="text"]::placeholder,
        input[type="email"]::placeholder,
        input[type="url"]::placeholder,
        input[type="tel"]::placeholder,
        input[type="password"]::placeholder {
          color: rgba(59, 130, 246, 0.6) !important;
        }
      `}</style>
      
      {/* Dekoratif elementler */}
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
            <p className="text-sm text-blue-200">Step {currentStep} / 3</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 transform transition-all duration-500">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#0158C1] to-[#004493] rounded-2xl mb-4 shadow-lg transition-all duration-500 ${
              currentStep === 1 ? '' : currentStep === 2 ? 'transform rotate-45' : 'transform rotate-90'
            }`}>
              {currentStep === 1 && <User className="w-8 h-8 text-white transition-all duration-300" />}
              {currentStep === 2 && <GraduationCap className="w-8 h-8 text-white transition-all duration-300" />}
              {currentStep === 3 && <Lock className="w-8 h-8 text-white transition-all duration-300" />}
            </div>
            <h2 className="text-2xl font-bold text-white text-center">Student Registration</h2>
            <p className="text-blue-200 text-center mt-2">Create a new student account</p>
          </div>

          {/* Form Content */}
          <div className="py-6">
            {error && (
              <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-100 px-4 py-3 rounded-xl mb-6 flex items-center transition-all duration-300">
                <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-red-100">{error}</span>
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

            <form onSubmit={currentStep === 3 ? handleSubmit : (e) => e.preventDefault()}>
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-white/20">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    currentStep === 1
                      ? 'bg-white/5 text-white/40 cursor-not-allowed'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20 hover:border-white/30'
                  }`}
                >
                  <span className="flex items-center justify-center">
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back
                  </span>
                </button>

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 bg-gradient-to-r from-[#004493] to-[#0158C1] text-white rounded-xl text-sm font-semibold hover:from-[#003377] hover:to-[#004493] transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <span className="flex items-center justify-center">
                      Next
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-[#004493] to-[#0158C1] text-white rounded-xl text-sm font-semibold hover:from-[#003377] hover:to-[#004493] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </div>
                    ) : (
                      'Register'
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center space-y-3">
          <p className="text-sm text-blue-200">
            Are you an employer?{' '}
            <Link to="/employer/signup" className="font-medium text-blue-300 hover:text-blue-200 transition-colors duration-200">
              Employer Registration
            </Link>
          </p>
          <p className="text-sm text-blue-200">
            Already have an account?{' '}
            <Link to="/signin" className="font-medium text-blue-300 hover:text-blue-200 transition-colors duration-200">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentSignUp;