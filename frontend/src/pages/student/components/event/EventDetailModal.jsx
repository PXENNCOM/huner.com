// pages/student/components/Events/EventDetailModal.jsx
import React, { useState, useEffect } from 'react';
import { MdClose, MdCalendarToday, MdLocationOn, MdPerson, MdShare, MdFavorite, MdEvent, MdAccessTime } from 'react-icons/md';

const EventDetailModal = ({ isOpen, onClose, eventId }) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && eventId) {
      fetchEventDetail();
    }
  }, [isOpen, eventId]);

  const fetchEventDetail = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/student/events/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Etkinlik detayları getirilemedi');
      }

      const data = await response.json();
      setEvent(data);
    } catch (error) {
      console.error('Etkinlik detayı getirme hatası:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal - Responsive sizing */}
      <div className="absolute inset-2 sm:inset-4 md:inset-6 lg:inset-8 xl:inset-16 bg-blue-900/95 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl border border-blue-800/50 overflow-hidden flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-blue-800/50 bg-blue-800/30 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-600/30 rounded-lg border border-purple-600/50">
              <MdEvent className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-white">Etkinlik Detayı</h2>
              <p className="text-xs sm:text-sm text-blue-200 hidden sm:block">Detaylı bilgiler ve katılım</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-blue-200 hover:text-white hover:bg-blue-700/50 rounded-lg transition-all duration-200"
          >
            <MdClose className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
            </div>
          )}

          {error && (
            <div className="p-4 m-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          {event && (
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Event Header Card */}
              <div className="bg-blue-800/30 rounded-lg sm:rounded-xl border border-blue-700/30 overflow-hidden">
                {/* Hero Image Section */}
                <div className="relative h-32 sm:h-48 bg-gradient-to-br from-purple-500/30 to-blue-600/30">
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl sm:text-6xl text-blue-200 opacity-80">🎯</span>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className={`absolute top-2 sm:top-4 right-2 sm:right-4 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border backdrop-blur-sm ${getTimeStatusColor(event.timeStatus)}`}>
                    <span className="mr-1">{getStatusIcon(event.timeStatus)}</span>
                    <span className="hidden sm:inline">{event.timeInfo}</span>
                  </div>
                </div>

                {/* Event Info Section */}
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Column - Event Details */}
                    <div className="flex-1">
                      <h1 className="text-xl sm:text-2xl font-bold text-white mb-4 line-clamp-2">{event.title}</h1>
                      
                      {/* Quick Info Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="bg-blue-700/30 border border-blue-600/30 rounded-lg p-3">
                          <div className="flex items-center text-purple-400 mb-2">
                            <MdCalendarToday className="w-4 h-4 mr-2" />
                            <span className="font-medium text-sm">Tarih</span>
                          </div>
                          <div className="text-white font-medium text-sm">{event.formattedDate}</div>
                        </div>
                        
                        <div className="bg-blue-700/30 border border-blue-600/30 rounded-lg p-3">
                          <div className="flex items-center text-blue-400 mb-2">
                            <MdAccessTime className="w-4 h-4 mr-2" />
                            <span className="font-medium text-sm">Saat</span>
                          </div>
                          <div className="text-white font-medium text-sm">{event.formattedTime}</div>
                        </div>
                        
                        <div className="bg-blue-700/30 border border-blue-600/30 rounded-lg p-3">
                          <div className="flex items-center text-green-400 mb-2">
                            <MdLocationOn className="w-4 h-4 mr-2" />
                            <span className="font-medium text-sm">Konum</span>
                          </div>
                          <div className="text-white font-medium text-sm line-clamp-1">{event.location}</div>
                        </div>
                        
                        <div className="bg-blue-700/30 border border-blue-600/30 rounded-lg p-3">
                          <div className="flex items-center text-orange-400 mb-2">
                            <MdPerson className="w-4 h-4 mr-2" />
                            <span className="font-medium text-sm">Organizatör</span>
                          </div>
                          <div className="text-white font-medium text-sm line-clamp-1">{event.organizer}</div>
                        </div>
                      </div>
                    </div>

                   
                  </div>
                </div>
              </div>

              {/* Event Description */}
              <div className="bg-blue-800/30 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-blue-700/30">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3 flex items-center">
                  <span className="mr-2">📄</span>
                  Etkinlik Açıklaması
                </h3>
                <div className="text-blue-200 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                  {event.description}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;