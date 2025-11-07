// pages/student/components/Events/EventsPanel.jsx
import React, { useState, useEffect } from 'react';
import EventCard from './EventCard';
import EventDetailModal from './EventDetailModal';
import { MdClose, MdCalendarToday, MdSearch, MdFilterList } from 'react-icons/md';

const EventsPanel = ({ isOpen, onClose }) => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [isEventDetailOpen, setIsEventDetailOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchEvents();
    }
  }, [isOpen]);

  useEffect(() => {
    // Filtre ve arama terimini uygula
    let filtered = events;
    
    // Filtre uygula
    if (filter !== 'all') {
      filtered = filtered.filter(event => {
        switch (filter) {
          case 'today':
            return event.timeStatus === 'today';
          case 'week':
            return ['today', 'tomorrow', 'this-week'].includes(event.timeStatus);
          case 'month':
            return event.daysUntilEvent <= 30;
          default:
            return true;
        }
      });
    }
    
    // Arama terimi uygula
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredEvents(filtered);
  }, [filter, events, searchTerm]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/student/events', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Events could not be fetched');
      }

      const data = await response.json();
      setEvents(data);
      setFilteredEvents(data);
    } catch (error) {
      console.error('EAn error occurred while loading events:', error);
      setError('An error occurred while loading events');
    } finally {
      setLoading(false);
    }
  };

  const filterOptions = [
    { 
      id: 'all', 
      label: 'All', 
      count: events.length,
      icon: '📅'
    },
    { 
      id: 'today', 
      label: 'Today', 
      count: events.filter(e => e.timeStatus === 'today').length,
      icon: '🔥'
    },
    { 
      id: 'week', 
      label: 'This week', 
      count: events.filter(e => ['today', 'tomorrow', 'this-week'].includes(e.timeStatus)).length,
      icon: '📅'
    },
    { 
      id: 'month', 
      label: 'This Month', 
      count: events.filter(e => e.daysUntilEvent <= 30).length,
      icon: '🗓️'
    }
  ];

  const handleEventClick = (eventId) => {
    setSelectedEventId(eventId);
    setIsEventDetailOpen(true);
  };

  const handleCloseEventDetail = () => {
    setIsEventDetailOpen(false);
    setSelectedEventId(null);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Panel */}
        <div className="absolute right-0 top-0 h-full w-full max-w-md bg-blue-900/95 backdrop-blur-xl shadow-2xl border-l border-blue-800/50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-blue-800/50 bg-blue-800/30">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-600/30 rounded-lg border border-purple-600/50">
                <MdCalendarToday className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Events</h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-blue-200 hover:text-white hover:bg-blue-700/50 rounded-lg transition-all duration-200"
            >
              <MdClose className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="h-full overflow-y-auto pb-20">
            {/* Search Bar */}
            <div className="p-4 border-b border-blue-700/30">
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-blue-900/40 border border-blue-600/50 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                />
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="p-4 border-b border-blue-700/30">
              <div className="flex items-center space-x-2 mb-3">
                <MdFilterList className="w-4 h-4 text-blue-300" />
                <span className="text-sm text-blue-300">Filter</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {filterOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => setFilter(option.id)}
                    className={`p-3 rounded-lg text-xs font-medium transition-all duration-200 ${
                      filter === option.id
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                        : 'bg-blue-800/30 text-blue-200 hover:bg-blue-700/40 hover:text-white border border-blue-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-1">
                      <span>{option.icon}</span>
                      <span>{option.label}</span>
                    </div>
                    {option.count > 0 && (
                      <div className={`mt-1 text-xs ${
                        filter === option.id
                          ? 'text-purple-100'
                          : 'text-blue-300'
                      }`}>
                        {option.count} event
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-400"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="p-4 m-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredEvents.length === 0 && (
              <div className="p-8 text-center">
                <div className="p-4 bg-blue-800/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center border border-blue-700/30">
                  <MdCalendarToday className="w-8 h-8 text-blue-300" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  {filter === 'all' 
                    ? 'No events yet'
                    : `${filterOptions.find(o => o.id === filter)?.label} no activity`
                  }
                </h3>
                <p className="text-blue-300 text-sm">
                  {filter === 'all'
                    ? 'New events will appear here'
                    : 'You can try different filters'}
                </p>
              </div>
            )}

            {/* Events List */}
            {!loading && filteredEvents.length > 0 && (
              <div className="p-4 space-y-3">
                {filteredEvents.map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onViewDetails={() => handleEventClick(event.id)}
                    compact={true}
                  />
                ))}
              </div>
            )}

            {/* Quick Stats */}
            {!loading && events.length > 0 && (
              <div className="p-4 border-t border-blue-700/30">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-blue-800/30 rounded-lg p-3 border border-blue-700/30">
                    <div className="text-lg font-bold text-red-400">
                      {events.filter(e => e.timeStatus === 'today').length}
                    </div>
                    <div className="text-xs text-blue-300">Today</div>
                  </div>
                  <div className="bg-blue-800/30 rounded-lg p-3 border border-blue-700/30">
                    <div className="text-lg font-bold text-orange-400">
                      {events.filter(e => e.timeStatus === 'tomorrow').length}
                    </div>
                    <div className="text-xs text-blue-300">Tomorrow</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
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

export default EventsPanel;