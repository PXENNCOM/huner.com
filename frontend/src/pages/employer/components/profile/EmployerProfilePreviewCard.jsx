// pages/employer/components/Profile/EmployerProfilePreviewCard.jsx - Hata Güvenli
import React, { useState, useEffect } from 'react';
import { getEmployerProfile } from '../../../../services/employerApi';
import { MdBusiness, MdArrowForward, MdEdit, MdPerson, MdLocationOn, MdError } from 'react-icons/md';

const EmployerProfilePreviewCard = ({ onOpenPanel }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await getEmployerProfile();
      setProfile(response.data);
    } catch (error) {
      console.error('Profil yüklenirken hata:', error);
      setError(true);
      
      // API yoksa mock data kullan
      setProfile({
        fullName: 'Profil Bilgisi Yok',
        companyName: 'Şirket Adı Belirtilmemiş',
        position: 'Pozisyon',
        industry: 'Teknoloji',
        city: 'İstanbul',
        profileImage: null
      });
    } finally {
      setLoading(false);
    }
  };

  const completionPercentage = () => {
    if (!profile) return 0;
    const fields = [
      profile.fullName,
      profile.companyName,
      profile.position,
      profile.industry,
      profile.phoneNumber,
      profile.city,
      profile.address
    ];
    const filledFields = fields.filter(field => field && field.trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  if (loading) {
    return (
      <div className="bg-blue-800/30 backdrop-blur-xl rounded-xl p-6 border border-blue-700/30">
        <div className="animate-pulse">
          <div className="h-4 bg-blue-700/50 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-blue-700/50 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const completion = completionPercentage();

  return (
    <div className="bg-blue-800/30 backdrop-blur-xl rounded-xl p-6 border border-blue-700/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <MdBusiness className="w-5 h-5 text-blue-300" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Profil</h2>
            <p className="text-sm text-blue-200">
              {error ? 'API Bağlantısı Yok' : 'Şirket bilgileriniz'}
            </p>
          </div>
        </div>
        
        <button
          onClick={onOpenPanel}
          className="text-blue-300 hover:text-blue-200 text-sm font-medium flex items-center group"
        >
          Düzenle
          <MdArrowForward className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <MdError className="w-4 h-4 text-yellow-300" />
            <span className="text-yellow-300 text-xs">API endpoint'leri henüz hazır değil</span>
          </div>
        </div>
      )}

      {profile ? (
        <div className="space-y-4">
          {/* Profile Summary */}
          <div className="bg-blue-700/30 rounded-lg p-4 border border-blue-600/30">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-500/20">
                {profile.profileImage ? (
                  <img 
                    src={`/uploads/profile-images/${profile.profileImage}`} 
                    alt="Profil" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/150?text=' + (profile.fullName?.charAt(0)?.toUpperCase() || 'İ');
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-blue-300 font-bold">
                    {profile.fullName?.charAt(0)?.toUpperCase() || 'İ'}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white text-sm">
                  {profile.fullName || 'İsim Belirtilmemiş'}
                </h3>
                <p className="text-blue-200 text-xs">{profile.position || 'Pozisyon'}</p>
                <p className="text-blue-300 text-xs">{profile.companyName || 'Şirket Adı'}</p>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-700/30 rounded-lg p-3 border border-blue-600/30">
              <div className="text-xs text-blue-200">Sektör</div>
              <div className="text-sm font-medium text-white">
                {profile.industry || 'Belirtilmemiş'}
              </div>
            </div>
            <div className="bg-blue-700/30 rounded-lg p-3 border border-blue-600/30">
              <div className="text-xs text-blue-200">Şehir</div>
              <div className="text-sm font-medium text-white">
                {profile.city || 'Belirtilmemiş'}
              </div>
            </div>
          </div>

          {/* Profile Completion */}
          <div className="bg-blue-700/30 rounded-lg p-4 border border-blue-600/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">Profil Tamamlanma</span>
              <span className="text-sm text-blue-200">{completion}%</span>
            </div>
            <div className="w-full bg-blue-600/30 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${completion}%` }}
              ></div>
            </div>
            {completion < 100 && (
              <p className="text-xs text-blue-200 mt-2">
                Profilinizi tamamlayarak daha fazla görünürlük kazanın
              </p>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={onOpenPanel}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            <MdEdit className="w-4 h-4 mr-2" />
            Profili Düzenle
          </button>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="p-4 bg-blue-700/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <MdPerson className="w-8 h-8 text-blue-300" />
          </div>
          <p className="text-blue-200 text-sm mb-4">
            Profil bilgileriniz yüklenemedi.
          </p>
          <button
            onClick={onOpenPanel}
            className="text-blue-300 hover:text-blue-200 text-sm font-medium"
          >
            Tekrar Dene
          </button>
        </div>
      )}
    </div>
  );
};

export default EmployerProfilePreviewCard;