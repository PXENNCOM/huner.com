// pages/student/components/ProfileCompletionCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ProfileCompletionCard = ({ profile, completionPercentage }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Profil Tamamlanma</h2>
      
      <div className="mb-4">
        <div className="flex justify-between mb-1 text-sm">
          <span>İlerleme</span>
          <span className="font-medium">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full" 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>
      
      {completionPercentage < 100 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">
            Profil bilgilerinizi tamamlayarak işverenler için daha çekici hale gelin.
          </p>
          <Link 
            to="/student/profile"
            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
          >
            Profili Tamamla &rarr;
          </Link>
        </div>
      )}
      
      {completionPercentage === 100 && (
        <div className="mt-4 flex items-center text-green-500">
          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
          </svg>
          <span className="font-medium">Profil tamamlandı!</span>
        </div>
      )}
    </div>
  );
};

export default ProfileCompletionCard;