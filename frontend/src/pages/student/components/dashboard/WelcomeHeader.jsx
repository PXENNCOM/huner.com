// pages/student/components/dashboard/WelcomeHeader.jsx
import React from 'react';

const WelcomeHeader = ({ profileData, user }) => {
  const welcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Günaydın";
    if (hour < 18) return "İyi günler";
    return "İyi akşamlar";
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-2xl p-6 text-white shadow-lg shadow-blue-900/30 border border-blue-600/20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {welcomeMessage()}, {profileData?.profile?.fullName || user?.email?.split('@')[0]}! 👋
          </h1>
          <p className="text-blue-100 text-lg">
            Bugün ne yapmak istiyorsun? Platform'da yeni fırsatlar seni bekliyor.
          </p>
        </div>
        <div className="hidden md:block">
          <div className="text-right">
            <p className="text-blue-200 text-sm">Bugün</p>
            <p className="text-xl font-semibold text-white">
              {new Date().toLocaleDateString('tr-TR', {
                 weekday: 'long',
                 day: 'numeric',
                 month: 'long'
               })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;