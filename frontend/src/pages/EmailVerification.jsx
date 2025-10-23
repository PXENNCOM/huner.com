// pages/EmailVerification.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, ArrowRight, RefreshCw } from 'lucide-react';
import api from '../services/api';

const EmailVerification = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Kayıt sayfasından gelen userId
  const userId = location.state?.userId;
  const userEmail = location.state?.email;

  // Eğer userId yoksa signin'e yönlendir
  useEffect(() => {
    if (!userId) {
      navigate('/signin');
    }
  }, [userId, navigate]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (verificationCode.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await api.post('/auth/verify-email', {
        userId,
        verificationCode
      });
      
      if (response.data.success) {
        setSuccess('Email verified successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/signin', { 
            state: { 
              message: 'Email verified! You can now sign in.',
              email: userEmail
            } 
          });
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setSuccess('');
    setResendLoading(true);
    
    try {
      const response = await api.post('/auth/resend-verification-code', { userId });
      
      if (response.data.success) {
        setSuccess('Verification code resent! Please check your email.');
        setCountdown(60); // 60 saniye bekle
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend code');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 font-sans">
      
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/bg.jpg)' }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#004493]/70 to-[#0158C1]/70"></div>
      </div>

      <div className="relative w-full max-w-md z-10">
        
        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#0158C1] to-[#004493] rounded-2xl mb-4 shadow-lg">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Verify Your Email</h2>
            <p className="text-blue-200 mt-2">
              We sent a 6-digit code to
            </p>
            <p className="text-white font-medium mt-1">
              {userEmail || 'your email'}
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-100 px-4 py-3 rounded-xl mb-6">
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 backdrop-blur-sm border border-green-400/30 text-green-200 px-4 py-3 rounded-xl mb-6">
              <span className="text-sm">{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="code" className="block text-sm font-medium text-blue-200 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                id="code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength="6"
                placeholder="000000"
                className="block w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white text-center text-2xl font-mono tracking-widest placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-[#0158C1] focus:border-transparent transition-all duration-200"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  letterSpacing: '0.5em'
                }}
              />
              <p className="mt-2 text-xs text-blue-300 text-center">
                Code expires in 10 minutes
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || verificationCode.length !== 6}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#004493] to-[#0158C1] text-white rounded-xl text-sm font-semibold hover:from-[#003377] hover:to-[#004493] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Verifying...
                </div>
              ) : (
                <span className="flex items-center justify-center">
                  Verify Email
                  <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              )}
            </button>

            {/* Resend Button */}
            <div className="mt-6 text-center">
              <p className="text-sm text-blue-200 mb-2">
                Didn't receive the code?
              </p>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading || countdown > 0}
                className="text-blue-300 hover:text-blue-200 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${resendLoading ? 'animate-spin' : ''}`} />
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
              </button>
            </div>
          </form>

        </div>

        {/* Footer Link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/signin')}
            className="text-sm text-blue-200 hover:text-blue-100 transition-colors"
          >
            Back to Sign In
          </button>
        </div>

      </div>
    </div>
  );
};

export default EmailVerification;