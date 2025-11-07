// pages/student/components/Events/EventsPreviewCard.jsx
import React, { useState } from 'react';
import { MdCalendarToday, MdArrowForward, MdLocationOn, MdAccessTime } from 'react-icons/md';
import EventDetailModal from './EventDetailModal';

const EventsPreviewCard = ({ events, onOpenPanel }) => {
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [isEventDetailOpen, setIsEventDetailOpen] = useState(false);

  // Yaklaşan etkinlikleri filtrele ve en fazla 3 tanesini göster
  const upcomingEvents = events
    .filter(event => ['today', 'tomorrow', 'this-week'].includes(event.timeStatus))
    .sort((a, b) => a.daysUntilEvent - b.daysUntilEvent)
    .slice(0, 3);

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

  const getTimeStatusColor = (timeStatus) => {
    const colors = {
      'today': 'bg-red-500/20 text-red-400',
      'tomorrow': 'bg-orange-500/20 text-orange-400',
      'this-week': 'bg-yellow-500/20 text-yellow-400',
      'this-month': 'bg-blue-500/20 text-blue-400',
      'future': 'bg-green-500/20 text-green-400',
      'ended': 'bg-blue-500/20 text-blue-400'
    };
    return colors[timeStatus] || colors.future;
  };

  const handleEventClick = (eventId) => {
    setSelectedEventId(eventId);
    setIsEventDetailOpen(true);
  };

  const handleCloseEventDetail = () => {
    setIsEventDetailOpen(false);
    setSelectedEventId(null);
  };

  return (
    <>
      <div className="bg-blue-800/30 backdrop-blur-xl rounded-xl p-6 border border-blue-700/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-600/30 rounded-lg border border-purple-600/50">
              <MdCalendarToday className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Upcoming Events</h2>
              <p className="text-sm text-blue-200">Don't miss it, join!</p>
            </div>
          </div>
          
          <button
            onClick={onOpenPanel}
            className="text-purple-300 hover:text-purple-200 text-sm font-medium flex items-center group"
          >
            See All
            <MdArrowForward className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        {upcomingEvents.length === 0 ? (
          <div className="text-center py-8">
            <div className="p-4 bg-blue-700/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center border border-blue-600/30">
              <MdCalendarToday className="w-8 h-8 text-blue-300" />
            </div>
            <p className="text-blue-300 text-sm">
              There are no upcoming events.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingEvents.map(event => (
              <div 
                key={event.id} 
                className="bg-blue-700/30 rounded-lg p-4 border border-blue-600/30 hover:border-blue-500/50 transition-colors cursor-pointer"
                onClick={() => handleEventClick(event.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-white text-sm line-clamp-1">
                      {event.title}
                    </h3>
                    <div className="flex items-center text-blue-300 text-xs mt-1">
                      <MdLocationOn className="w-3 h-3 mr-1" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getTimeStatusColor(event.timeStatus)}`}>
                    <span className="mr-1">{getStatusIcon(event.timeStatus)}</span>
                    {event.timeStatus === 'today' ? 'Today' : 
                     event.timeStatus === 'tomorrow' ? 'Tomorrow' :
                     'This week'}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-blue-300">
                  <div className="flex items-center">
                    <MdAccessTime className="w-3 h-3 mr-1" />
                    <span>{event.formattedDate} • {event.formattedTime}</span>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEventClick(event.id);
                    }}
                    className="text-purple-300 hover:text-purple-200 font-medium"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        {events.length > 0 && (
          <div className="mt-4 pt-4 border-t border-blue-700/30">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-700/30 rounded-lg p-2 border border-blue-600/30">
                <div className="text-sm font-bold text-red-400">
                  {events.filter(e => e.timeStatus === 'today').length}
                </div>
                <div className="text-xs text-blue-300">Today</div>
              </div>
              <div className="bg-blue-700/30 rounded-lg p-2 border border-blue-600/30">
                <div className="text-sm font-bold text-orange-400">
                  {events.filter(e => e.timeStatus === 'tomorrow').length}
                </div>
                <div className="text-xs text-blue-300">Tomorrow</div>
              </div>
              <div className="bg-blue-700/30 rounded-lg p-2 border border-blue-600/30">
                <div className="text-sm font-bold text-purple-400">
                  {events.length}
                </div>
                <div className="text-xs text-blue-300">Total</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      <EventDetailModal 
        isOpen={isEventDetailOpen}
        onClose={handleCloseEventDetail}
        eventId={selectedEventId}
      />
    </>
  );
};

export default EventsPreviewCard;