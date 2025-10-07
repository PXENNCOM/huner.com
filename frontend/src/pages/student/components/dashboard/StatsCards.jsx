// pages/student/components/dashboard/StatsCards.jsx
import React from 'react';
import {
  MdAnalytics,
  MdCollections,
  MdWork,
  MdMessage,
  MdArrowForward
} from 'react-icons/md';

const StatsCards = ({ stats, navigate }) => {
  const cards = [
    {
      title: 'Profil Tamamlanma',
      value: `${stats.profileCompletion}%`,
      icon: MdAnalytics,
      color: 'blue',
      action: null,
      showProgressBar: true
    },
    {
      title: 'Toplam Proje',
      value: stats.totalProjects,
      icon: MdCollections,
      color: 'green',
      action: () => navigate('/student/portfolio'),
      actionText: 'Portfolyo\'yu Görüntüle'
    },
    {
      title: 'Aktif İş',
      value: stats.activeJobs,
      icon: MdWork,
      color: 'purple',
      action: () => navigate('/student/jobs'),
      actionText: 'İşleri Görüntüle'
    },
    {
      title: 'Okunmamış Mesaj',
      value: stats.unreadMessages,
      icon: MdMessage,
      color: 'red',
      action: () => navigate('/student/messages'),
      actionText: 'Mesajları Görüntüle'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-900/30',
        text: 'text-blue-400',
        accent: 'text-blue-400',
        accentHover: 'hover:text-blue-300',
        progress: 'bg-blue-500',
        border: 'border-blue-700/50'
      },
      green: {
        bg: 'bg-green-900/30',
        text: 'text-green-400',
        accent: 'text-green-400',
        accentHover: 'hover:text-green-300',
        border: 'border-green-700/50'
      },
      purple: {
        bg: 'bg-purple-900/30',
        text: 'text-purple-400',
        accent: 'text-purple-400',
        accentHover: 'hover:text-purple-300',
        border: 'border-purple-700/50'
      },
      red: {
        bg: 'bg-red-900/30',
        text: 'text-red-400',
        accent: 'text-red-400',
        accentHover: 'hover:text-red-300',
        border: 'border-red-700/50'
      }
    };
    return colors[color];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const colors = getColorClasses(card.color);
        const IconComponent = card.icon;
        
        return (
          <div 
            key={index} 
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg shadow-black/20 border border-gray-700/50 hover:shadow-xl hover:shadow-black/30 transition-all duration-300 hover:bg-gray-700/50"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">{card.title}</p>
                <p className="text-2xl font-bold text-white">{card.value}</p>
              </div>
              <div className={`p-3 ${colors.bg} ${colors.border} border rounded-full`}>
                <IconComponent className={`w-6 h-6 ${colors.text}`} />
              </div>
            </div>
            
            <div className="mt-4">
              {card.showProgressBar && (
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`${colors.progress} h-2 rounded-full transition-all duration-300 shadow-sm`}
                    style={{ width: `${stats.profileCompletion}%` }}
                  ></div>
                </div>
              )}
              
              {card.action && (
                <button 
                  onClick={card.action}
                  className={`${colors.accent} ${colors.accentHover} text-sm font-medium flex items-center transition-colors duration-200 mt-2`}
                >
                  {card.actionText} <MdArrowForward className="ml-1 w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;