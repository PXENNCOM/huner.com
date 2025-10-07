// pages/student/components/ProfileViewDark.jsx
import React from 'react';

const ProfileViewDark = ({ profile }) => {
  if (!profile) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-800/30 backdrop-blur-xl rounded-xl flex items-center justify-center border border-blue-700/30">
          <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-blue-200 mb-2">Profil bilgileri bulunamadı</h3>
        <p className="text-blue-300 text-sm">Lütfen profil bilgilerinizi düzenleyiniz.</p>
      </div>
    );
  }

  // Dil bilgilerini parse et
  let languages = [];
  try {
    if (profile.languages) {
      languages = JSON.parse(profile.languages);
    }
  } catch (e) {
    console.error('Language parsing error:', e);
  }

  // Profil resmi URL'sini oluştur
  const getProfileImageUrl = () => {
    if (!profile.profileImage) return null;
    
    if (profile.profileImage.startsWith('http')) {
      return profile.profileImage;
    }
    
    const imagePath = profile.profileImage.startsWith('/') 
      ? profile.profileImage.substring(1) 
      : profile.profileImage;
    
    return `${window.location.origin}/uploads/profile-images/${imagePath}`;
  };

  return (
    <div className="space-y-6">
      {/* Main Profile Card */}
      <div className="bg-blue-800/30 backdrop-blur-xl rounded-xl p-6 border border-blue-700/30">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          {/* Profile Image */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-blue-700/30 flex items-center justify-center border border-blue-600/30">
              {profile.profileImage ? (
                <img 
                  src={getProfileImageUrl()} 
                  alt={profile.fullName} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Profil resmi yüklenemedi:', profile.profileImage);
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/150?text=' + (profile.fullName?.charAt(0)?.toUpperCase() || '?');
                  }}
                />
              ) : (
                <span className="text-xl font-semibold text-blue-300">
                  {profile.fullName?.charAt(0)?.toUpperCase() || '?'}
                </span>
              )}
            </div>
          </div>
          
          {/* Profile Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-xl font-semibold text-white mb-1">
              {profile.fullName || 'İsimsiz Öğrenci'}
            </h1>
            
            {/* Education Info */}
            <div className="mb-3">
              {profile.department && profile.school ? (
                <p className="text-blue-200 text-sm">{profile.department} • {profile.school}</p>
              ) : (
                <p className="text-blue-300 text-sm">Eğitim bilgisi eklenmemiş</p>
              )}
              
              {profile.educationLevel && (
                <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-600/20 text-blue-300 border border-blue-600/30">
                    {profile.educationLevel.charAt(0).toUpperCase() + profile.educationLevel.slice(1).replace('_', ' ')}
                  </span>
                  {profile.currentGrade && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-700/30 text-blue-200 border border-blue-600/30">
                      {profile.currentGrade}
                    </span>
                  )}
                </div>
              )}
            </div>
            
            {/* Contact & Social */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-blue-300 justify-center sm:justify-start">
              {profile.city && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                  </svg>
                  {profile.city}
                </div>
              )}
              
              {profile.age && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a4 4 0 118 0v4m-4 8a4 4 0 11-8 0V7a4 4 0 118 0v4z" />
                  </svg>
                  {profile.age} yaşında
                </div>
              )}
              
              {/* Social Links */}
              <div className="flex space-x-2">
                {profile.githubProfile && (
                  <a 
                    href={profile.githubProfile} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1.5 bg-blue-700/30 hover:bg-blue-600/40 rounded-lg transition-colors text-blue-300 hover:text-white border border-blue-600/30"
                    title="GitHub"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                )}
                
                {profile.linkedinProfile && (
                  <a 
                    href={profile.linkedinProfile} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1.5 bg-blue-700/30 hover:bg-blue-600/40 rounded-lg transition-colors text-blue-300 hover:text-white border border-blue-600/30"
                    title="LinkedIn"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Bio */}
        {profile.shortBio && (
          <div className="mt-6 pt-6 border-t border-blue-700/50">
            <p className="text-blue-200 leading-relaxed">{profile.shortBio}</p>
          </div>
        )}
      </div>
      
      {/* Contact Info */}
      {profile.User?.email && (
        <div className="bg-blue-800/30 backdrop-blur-xl rounded-xl p-6 border border-blue-700/30">
          <h3 className="text-lg font-medium text-white mb-4">İletişim</h3>
          <div className="flex items-center text-blue-200">
            <svg className="w-5 h-5 mr-3 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {profile.User.email}
          </div>
        </div>
      )}
      
      {/* Skills */}
      <div className="bg-blue-800/30 backdrop-blur-xl rounded-xl p-6 border border-blue-700/30">
        <h3 className="text-lg font-medium text-white mb-4">Yetenekler</h3>
        {profile.skills ? (
          <div className="flex flex-wrap gap-2">
            {profile.skills.split(',').map((skill, index) => (
              <span 
                key={index} 
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-700/30 text-blue-200 hover:bg-blue-600/40 transition-colors border border-blue-600/30"
              >
                {skill.trim()}
              </span>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="w-12 h-12 mx-auto mb-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p className="text-blue-300">Henüz yetenek eklenmemiş</p>
            <p className="text-blue-400 text-sm mt-1">Profil düzenleme bölümünden yeteneklerinizi ekleyebilirsiniz</p>
          </div>
        )}
      </div>
      
      {/* Languages */}
      {languages && languages.length > 0 && (
        <div className="bg-blue-800/30 backdrop-blur-xl rounded-xl p-6 border border-blue-700/30">
          <h3 className="text-lg font-medium text-white mb-4">Dil Bilgisi</h3>
          <div className="space-y-3">
            {languages.map((lang, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-blue-700/30 rounded-lg border border-blue-600/30">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <span className="font-medium text-white">{lang.lang}</span>
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-600/30 text-blue-200 border border-blue-600/30">
                  {lang.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileViewDark;