import React from 'react';
import {
  MdCalendarToday,
  MdSchedule,
  MdLocationOn,
  MdPerson,
  MdArrowForward,
  MdEvent,
  MdStar
} from 'react-icons/md';

const UpcomingEvents = ({ events, onOpenEventsPanel }) => {
  // API base URL'i
const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';

  const getEventImage = (event) => {
    if (event.image) {
      // Eğer tam URL ise direkt kullan
      if (event.image.startsWith('http')) {
        return event.image;
      }
      // Değilse API base URL ile birleştir
      return `${API_BASE_URL}/uploads/events/${event.image}`;
    }
    return null;
  };

  const formatEventDate = (dateString) => {
    // Tarih doğrulama ve düzeltme
    if (!dateString) return 'Tarih belirtilmemiş';
    
    try {
      let date;
      
      // Eğer zaten formatlı bir tarih string'i ise (örn: "25 Haziran 2025")
      if (typeof dateString === 'string' && !dateString.includes('T') && !dateString.includes('-')) {
        return dateString;
      }
      
      // Normal tarih parse etmeye çalış
      date = new Date(dateString);
      
      // Invalid Date kontrolü
      if (isNaN(date.getTime())) {
        // ISO formatı deneme
        if (typeof dateString === 'string') {
          // Farklı formatları dene
          const formats = [
            dateString,
            dateString.replace('T', ' '),
            dateString.split('T')[0],
            dateString.replace(/\//g, '-')
          ];
          
          for (const format of formats) {
            const testDate = new Date(format);
            if (!isNaN(testDate.getTime())) {
              date = testDate;
              break;
            }
          }
        }
        
        // Hala invalid ise varsayılan değer döndür
        if (isNaN(date.getTime())) {
          return 'Tarih formatı hatalı';
        }
      }
      
      const now = new Date();
      const diffTime = date - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Bugün';
      if (diffDays === 1) return 'Yarın';
      if (diffDays > 1 && diffDays <= 7) return `${diffDays} gün sonra`;
      if (diffDays < 0) return 'Geçmiş etkinlik';
      
      return date.toLocaleDateString('tr-TR', { 
        day: 'numeric', 
        month: 'short',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Tarih formatı hatalı';
    }
  };

  const getEventTypeColor = (type) => {
    const colors = {
      'workshop': 'bg-blue-900/30 text-blue-400 border-blue-700/50',
      'seminar': 'bg-purple-900/30 text-purple-400 border-purple-700/50',
      'conference': 'bg-green-900/30 text-green-400 border-green-700/50',
      'meetup': 'bg-orange-900/30 text-orange-400 border-orange-700/50',
      'webinar': 'bg-indigo-900/30 text-indigo-400 border-indigo-700/50',
      'default': 'bg-gray-800/30 text-gray-400 border-gray-700/50'
    };
    return colors[type] || colors.default;
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 shadow-lg shadow-black/20">
      {/* Header - Dark Theme */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
            <MdCalendarToday className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Yaklaşan Etkinlikler</h2>
            <p className="text-sm text-gray-400">{events.length} aktif etkinlik</p>
          </div>
        </div>
        <button 
          onClick={onOpenEventsPanel}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-all duration-200 shadow-lg shadow-purple-500/30"
        >
          <span>Tümünü Gör</span>
          <MdArrowForward className="w-4 h-4" />
        </button>
      </div>
      
      {events.length > 0 ? (
        <div className="space-y-3">
          {events.map((event, index) => {
            const eventImage = getEventImage(event);
            const isUpcoming = index === 0; // İlk etkinlik yaklaşan olarak işaretle
            
            return (
              <div 
                key={event.id} 
                className="flex items-center justify-between p-4 hover:bg-gray-700/50 transition-colors border border-gray-700/50 rounded-lg backdrop-blur-sm"
              >
                {/* Sol taraf - Etkinlik görseli ve bilgileri */}
                <div className="flex items-center space-x-4 flex-1">
                  {/* Etkinlik görseli veya ikonu */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    {eventImage ? (
                      <img 
                        src={eventImage} 
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-800 to-purple-900 flex items-center justify-center">
                        <MdEvent className="w-6 h-6 text-purple-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Etkinlik bilgileri */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-white truncate">
                        {event.title}
                      </h3>
                      {isUpcoming && (
                        <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                      )}
                    </div>
                    
                    {/* Etkinlik açıklaması (eğer varsa) */}
                    {event.description && (
                      <p className="text-sm text-gray-400 mb-2 line-clamp-1">
                        {event.description.length > 60 
                          ? event.description.substring(0, 60) + '...'
                          : event.description
                        }
                      </p>
                    )}
                    
                    {/* Alt bilgiler */}
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      {/* Tarih */}
                      <div className="flex items-center space-x-1">
                        <MdSchedule className="w-4 h-4" />
                        <span>
                          {formatEventDate(event.date || event.formattedDate)}
                          {event.time && ` • ${event.time}`}
                        </span>
                      </div>
                      
                      {/* Konum */}
                      <div className="flex items-center space-x-1">
                        <MdLocationOn className="w-4 h-4" />
                        <span className="truncate">
                          {event.location || event.venue || 'Online'}
                        </span>
                      </div>
                      
                      {/* Etkinlik tipi */}
                      {event.type && (
                        <span className={`px-2 py-1 text-xs font-medium rounded border ${getEventTypeColor(event.type)}`}>
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Sağ taraf - Katılımcı sayısı ve detay butonu */}
                <div className="flex items-center space-x-4">
                  {/* Katılımcı bilgisi */}
                  <div className="flex flex-col items-end min-w-[120px]">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm text-gray-400">Katılımcı</span>
                      <span className="text-sm font-medium text-white">
                        {event.attendeeCount || Math.floor(Math.random() * 100) + 20}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all duration-300" 
                        style={{ 
                          width: `${Math.min(((event.attendeeCount || 50) / 100) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Detay butonu */}
                  <button 
                    onClick={onOpenEventsPanel}
                    className="text-purple-400 hover:text-purple-300 font-medium text-sm flex items-center space-x-1 px-3 py-2 hover:bg-purple-900/30 rounded-lg transition-colors"
                  >
                    <span>Detay</span>
                    <MdArrowForward className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-700/50 rounded-2xl flex items-center justify-center">
            <MdCalendarToday className="w-8 h-8 text-gray-400" />
          </div>
          
          <h3 className="text-lg font-medium text-white mb-2">Yaklaşan etkinlik yok</h3>
          <p className="text-gray-400 text-sm mb-6">
            Yeni etkinlikler eklendiğinde burada görünecek.
          </p>
          
          <button 
            onClick={onOpenEventsPanel}
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/30"
          >
            <MdCalendarToday className="mr-2 w-5 h-5" />
            Tüm Etkinlikleri Gör
          </button>
        </div>
      )}
    </div>
  );
};

export default UpcomingEvents;