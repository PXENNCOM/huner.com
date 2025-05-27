import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StudentLayout from './components/StudentLayout';

const StudentEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, today, week, month

  useEffect(() => {
    fetchEvents();
  }, []);

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
        throw new Error('Etkinlikler getirilemedi');
      }

      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Etkinlikleri getirme hatası:', error);
      setError('Etkinlikler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredEvents = () => {
    const today = new Date();
    
    return events.filter(event => {
      switch (filter) {
        case 'today':
          return event.timeStatus === 'today';
        case 'week':
          return event.timeStatus === 'today' || event.timeStatus === 'tomorrow' || event.timeStatus === 'this-week';
        case 'month':
          return event.daysUntilEvent <= 30;
        default:
          return true;
      }
    });
  };

  const getTimeStatusColor = (timeStatus) => {
    const colors = {
      'today': 'bg-red-100 text-red-800 border-red-200',
      'tomorrow': 'bg-orange-100 text-orange-800 border-orange-200',
      'this-week': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'this-month': 'bg-blue-100 text-blue-800 border-blue-200',
      'future': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[timeStatus] || colors.future;
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </StudentLayout>
    );
  }

  const filteredEvents = getFilteredEvents();

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Etkinlikler</h1>
          <p className="text-gray-600">Yaklaşan etkinlikleri keşfedin ve katılım sağlayın</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 bg-white p-4 rounded-lg shadow border">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tüm Etkinlikler ({events.length})
          </button>
          <button
            onClick={() => setFilter('today')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'today'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Bugün ({events.filter(e => e.timeStatus === 'today').length})
          </button>
          <button
            onClick={() => setFilter('week')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'week'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Bu Hafta ({events.filter(e => ['today', 'tomorrow', 'this-week'].includes(e.timeStatus)).length})
          </button>
          <button
            onClick={() => setFilter('month')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'month'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Bu Ay ({events.filter(e => e.daysUntilEvent <= 30).length})
          </button>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow border">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'Henüz etkinlik yok' : 'Bu süreçte etkinlik bulunmuyor'}
            </h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'Yeni etkinlikler eklendiğinde burada görünecek'
                : 'Farklı bir zaman aralığı seçerek diğer etkinlikleri görüntüleyebilirsiniz'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Link
                key={event.id}
                to={`/student/events/${event.id}`}
                className="bg-white rounded-lg shadow border hover:shadow-lg transition-shadow overflow-hidden group"
              >
                {/* Event Image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl text-white opacity-80">🎯</span>
                    </div>
                  )}
                  
                  {/* Time Badge */}
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-medium border ${getTimeStatusColor(event.timeStatus)}`}>
                    {event.timeInfo}
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {event.title}
                    </h3>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="mr-2">📅</span>
                      <span>{event.formattedDate}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">⏰</span>
                      <span>{event.formattedTime}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">📍</span>
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">👤</span>
                      <span className="truncate">{event.organizer}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {event.daysUntilEvent === 0 
                          ? 'Bugün başlıyor' 
                          : `${event.daysUntilEvent} gün kaldı`
                        }
                      </span>
                      <span className="text-blue-600 text-sm font-medium group-hover:text-blue-700">
                        Detayları Gör →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Stats Footer */}
        {events.length > 0 && (
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Etkinlik İstatistikleri</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {events.filter(e => e.timeStatus === 'today').length}
                </div>
                <div className="text-sm text-gray-600">Bugün</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {events.filter(e => e.timeStatus === 'tomorrow').length}
                </div>
                <div className="text-sm text-gray-600">Yarın</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {events.filter(e => e.timeStatus === 'this-week').length}
                </div>
                <div className="text-sm text-gray-600">Bu Hafta</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {events.length}
                </div>
                <div className="text-sm text-gray-600">Toplam</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default StudentEvents;