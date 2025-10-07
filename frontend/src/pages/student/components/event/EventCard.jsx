// pages/student/components/Events/EventCard.jsx
import React from 'react';
import { MdLocationOn, MdPerson, MdAccessTime, MdArrowForward } from 'react-icons/md';

const EventCard = ({ event, onViewDetails, compact = false }) => {
  const getTimeStatusColor = (timeStatus) => {
    const colors = {
      'today': 'bg-red-500/20 text-red-400 border-red-500/30',
      'tomorrow': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'this-week': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'this-month': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'future': 'bg-green-500/20 text-green-400 border-green-500/30',
      'ended': 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    };
    return colors[timeStatus] || colors.future;
  };

  const getStatusIcon = (timeStatus) => {
    const icons = {
      'today': '🔥',
      'tomorrow': '⏰',
      'this-week': '📅',
      'this-month': '🗓️',
      'future': '⭐',
      'ended': '✅'
    };
    return icons[timeStatus] || '📅';
  };

  if (compact) {
    return (
      <div 
        className="bg-blue-800/30 backdrop-blur-xl rounded-xl p-4 border border-blue-700/30 hover:border-blue-600/50 cursor-pointer transition-all duration-200 hover:bg-blue-700/40"
        onClick={onViewDetails}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-white font-medium text-sm mb-1 line-clamp-2">
              {event.title}
            </h3>
            <div className="flex items-center text-blue-300 text-xs mb-2">
              <MdLocationOn className="w-3 h-3 mr-1" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getTimeStatusColor(event.timeStatus)}`}>
            <span className="mr-1">{getStatusIcon(event.timeStatus)}</span>
            {event.timeStatus === 'today' ? 'Bugün' : 
             event.timeStatus === 'tomorrow' ? 'Yarın' :
             event.timeStatus === 'this-week' ? 'Bu hafta' :
             event.timeStatus === 'this-month' ? 'Bu ay' :
             event.timeStatus === 'ended' ? 'Bitti' : 'Gelecek'}
          </div>
        </div>

        {/* Event Image/Icon */}
        <div className="mb-3">
          {event.image ? (
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-24 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center border border-blue-600/30">
              <span className="text-3xl">🎯</span>
            </div>
          )}
        </div>

        {/* Event Details */}
        <div className="space-y-2 text-xs text-blue-300">
          <div className="flex items-center">
            <MdAccessTime className="w-3 h-3 mr-2" />
            <span>{event.formattedDate} • {event.formattedTime}</span>
          </div>
          <div className="flex items-center">
            <MdPerson className="w-3 h-3 mr-2" />
            <span className="line-clamp-1">{event.organizer}</span>
          </div>
        </div>

        {/* Days Left */}
        <div className="mt-3 flex items-center justify-between">
          <div className="text-xs text-blue-300">
            {event.daysUntilEvent === 0 
              ? 'Bugün başlıyor' 
              : event.daysUntilEvent > 0
                ? `${event.daysUntilEvent} gün kaldı`
                : 'Etkinlik bitti'
            }
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            className="text-purple-300 hover:text-purple-200 text-xs font-medium flex items-center group"
          >
            Detay
            <MdArrowForward className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  // Normal (non-compact) view
  return (
    <div 
      className="bg-blue-800/30 backdrop-blur-xl rounded-lg shadow-lg overflow-hidden border-l-4 border-purple-500 cursor-pointer hover:shadow-xl transition-shadow duration-300 border border-blue-700/30"
      onClick={onViewDetails}
    >
      {/* Event Image */}
      <div className="relative h-48 bg-gradient-to-br from-purple-500/30 to-blue-600/30">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl text-blue-200 opacity-80">🎯</span>
          </div>
        )}
        
        {/* Time Badge */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-medium border backdrop-blur-sm ${getTimeStatusColor(event.timeStatus)}`}>
          <span className="mr-1">{getStatusIcon(event.timeStatus)}</span>
          {event.timeInfo}
        </div>
      </div>

      {/* Event Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-white line-clamp-2 flex-1">
            {event.title}
          </h3>
        </div>

        <p className="text-blue-200 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 text-sm text-blue-300 mb-4">
          <div className="flex items-center">
            <MdAccessTime className="w-4 h-4 mr-2" />
            <span>{event.formattedDate} • {event.formattedTime}</span>
          </div>
          <div className="flex items-center">
            <MdLocationOn className="w-4 h-4 mr-2" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center">
            <MdPerson className="w-4 h-4 mr-2" />
            <span className="truncate">{event.organizer}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-4 border-t border-blue-700/50">
          <span className="text-sm text-blue-300">
            {event.daysUntilEvent === 0 
              ? 'Bugün başlıyor' 
              : event.daysUntilEvent > 0
                ? `${event.daysUntilEvent} gün kaldı`
                : 'Etkinlik bitti'
            }
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
          >
            Detayları Gör
            <MdArrowForward className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;