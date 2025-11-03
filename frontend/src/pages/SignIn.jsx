import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// Assuming useAuth is correctly imported and available
import { useAuth } from '../contexts/AuthContext'; 
import { Eye, EyeOff, Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

const SignIn = () => {
  const [currentStep, setCurrentStep] = useState('email'); // 'email' or 'password'
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Using the actual useAuth hook from your context
  const { login } = useAuth();

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setCurrentStep('password');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!formData.password) {
      setError('Please enter your password');
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      // Use the actual login function from AuthContext
      const result = await login(formData.email, formData.password);

      if (!result.success) {
        setError(result.message);
      }
      // If successful, AuthContext should handle redirection
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const goBack = () => {
    setCurrentStep('email');
    setError('');
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
        <div className="absolute inset-0 bg-black/70"></div>
        
        {/* Blue gradient overlay to maintain color scheme */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#004493]/70 to-[#0158C1]/70"></div>
      </div>

      {/* Custom CSS for animations and autofill fix */}
      <style jsx>{`
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

        /* Autofill fix */
        input[type="email"]:-webkit-autofill,
        input[type="email"]:-webkit-autofill:hover,
        input[type="email"]:-webkit-autofill:focus,
        input[type="email"]:-webkit-autofill:active,
        input[type="password"]:-webkit-autofill,
        input[type="password"]:-webkit-autofill:hover,
        input[type="password"]:-webkit-autofill:focus,
        input[type="password"]:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px rgba(255, 255, 255, 0.05) inset !important;
          -webkit-text-fill-color: white !important;
          background-color: rgba(255, 255, 255, 0.05) !important;
          transition: background-color 5000s ease-in-out 0s;
        }

        /* Input background fix */
        input[type="email"],
        input[type="password"] {
          background-color: rgba(255, 255, 255, 0.05) !important;
          color: white !important;
        }

        input[type="email"]:focus,
        input[type="password"]:focus {
          background-color: rgba(255, 255, 255, 0.05) !important;
        }

        input[type="email"]::placeholder,
        input[type="password"]::placeholder {
          color: rgba(59, 130, 246, 0.6) !important;
        }
      `}</style>

      {/* Main container - now with relative positioning */}
      <div className="relative w-full max-w-md z-10">
        {/* Glassmorphism card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 transform transition-all duration-500">
          
          {/* Progress indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2">
              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentStep === 'email' ? 'bg-white' : 'bg-white/50'
              }`}></div>
              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentStep === 'password' ? 'bg-white' : 'bg-white/30'
              }`}></div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-200 px-4 py-3 rounded-xl mb-6 transition-all duration-300">
              <span className="block text-sm">{error}</span>
            </div>
          )}

          {/* Email Step */}
          {currentStep === 'email' && (
            <div className="animate-fadeIn">
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div className="group">
                  <label htmlFor="email" className="block text-sm font-medium text-blue-200 mb-2">
                    Email Address
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
                      autoFocus
                      autoComplete="email"
                      required
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        color: 'white'
                      }}
                      className="block w-full pl-10 pr-12 py-4 !bg-white/5 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-[#0158C1] focus:border-transparent focus:!bg-white/5 transition-all duration-200 backdrop-blur-sm text-lg"
                      placeholder="example@email.com"
                    />
                    {formData.email && (
                      <button
                        type="submit"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-300 hover:text-blue-400 transition-colors"
                      >
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 bg-gradient-to-r from-[#004493] to-[#0158C1] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#0158C1] focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200"
                >
                  <span className="flex items-center justify-center">
                    Continue
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                </button>
                <div className="mt-4 text-center">
  <Link 
    to="/reset-password" 
    className="text-sm font-medium text-blue-300 hover:text-blue-200 transition-colors duration-200 text-right hover:underline w-full block"
  >
I Forgot My Password
  </Link>
</div>
              </form>

              {/* Sign up links - now split into two */}
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white/5 backdrop-blur-sm text-blue-200 rounded-full">
                      Don't have an account?
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex flex-col space-y-4">
                  <Link
                    to="/student/signup"
                    className="w-full flex justify-center py-4 px-6 border-2 border-white/30 rounded-xl text-white font-semibold hover:bg-white/10 hover:border-white/50 focus:outline-none focus:ring-2 focus:ring-[#0158C1] focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 backdrop-blur-sm transform hover:scale-[1.02]"
                  >
                    Create a Talent Account
                  </Link>
                  <Link
                    to="/employer/signup"
                    className="w-full flex justify-center py-4 px-6 border-2 border-white/30 rounded-xl text-white font-semibold hover:bg-white/10 hover:border-white/50 focus:outline-none focus:ring-2 focus:ring-[#0158C1] focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 backdrop-blur-sm transform hover:scale-[1.02]"
                  >
                    Create a Company Account
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Password Step */}
          {currentStep === 'password' && (
            <div className="animate-fadeIn">
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="group">
                  <label htmlFor="password" className="block text-sm font-medium text-blue-200 mb-2">
                    Password
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
                      autoFocus
                      autoComplete="current-password"
                      required
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        color: 'white'
                      }}
                      className="block w-full pl-10 pr-12 py-4 !bg-white/5 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-[#0158C1] focus:border-transparent focus:!bg-white/5 transition-all duration-200 backdrop-blur-sm text-lg"
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
                </div>

                {/* Remember me and forgot password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember_me"
                      name="remember_me"
                      type="checkbox"
                      className="h-4 w-4 text-[#0158C1] focus:ring-[#0158C1] border-white/30 rounded bg-white/5 backdrop-blur-sm"
                    />
                    <label htmlFor="remember_me" className="ml-2 block text-sm text-blue-200">
                      Remember me
                    </label>
                  </div>

                  <Link 
                    to="/reset-password"
                    className="text-sm font-medium text-blue-300 hover:text-blue-200 transition-colors hover:underline"
                  >
                    Forgot password
                  </Link>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={goBack}
                    className="flex-1 py-4 px-6 border-2 border-white/30 rounded-xl text-white font-semibold hover:bg-white/10 hover:border-white/50 focus:outline-none focus:ring-2 focus:ring-[#0158C1] transition-all duration-200 backdrop-blur-sm"
                  >
                    <span className="flex items-center justify-center">
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      Back
                    </span>
                  </button>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 relative py-4 px-6 bg-gradient-to-r from-[#004493] to-[#0158C1] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#0158C1] focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <span className={`${loading ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
                      Sign In
                    </span>
                    {loading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="ml-2">Signing in...</span>
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Static decorative elements */}
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-[#0158C1] to-[#004493] rounded-full opacity-60"></div>
        <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-[#004493] to-[#0158C1] rounded-full opacity-60"></div>
      </div>
    </div>
  );
};

export default SignIn;