import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import StudentLayout from './components/StudentLayout';

const StudentEventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEventDetail();
  }, [id]);

  const fetchEventDetail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/student/events/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Etkinlik bulunamadı');
        }
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
      'today': 'bg-red-100 text-red-800 border-red-200',
      'tomorrow': 'bg-orange-100 text-orange-800 border-orange-200',
      'this-week': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'this-month': 'bg-blue-100 text-blue-800 border-blue-200',
      'future': 'bg-green-100 text-green-800 border-green-200',
      'ended': 'bg-gray-100 text-gray-800 border-gray-200'
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

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </StudentLayout>
    );
  }

  if (error) {
    return (
      <StudentLayout>
        <div className="text-center py-16">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Hata Oluştu</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/student/events')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              ← Etkinliklere Dön
            </button>
            <button
              onClick={fetchEventDetail}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              🔄 Tekrar Dene
            </button>
          </div>
        </div>
      </StudentLayout>
    );
  }

  if (!event) {
    return (
      <StudentLayout>
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Etkinlik Bulunamadı</h2>
          <p className="text-gray-600 mb-6">Aradığınız etkinlik mevcut değil veya kaldırılmış olabilir.</p>
          <Link
            to="/student/events"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            ← Etkinliklere Dön
          </Link>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <div className="flex items-center space-x-4">
          <Link
            to="/student/events"
            className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
          >
            <span className="mr-2">←</span>
            Etkinliklere Dön
          </Link>
        </div>

        {/* Event Header */}
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          {/* Hero Image */}
          <div className="relative h-64 md:h-80 bg-gradient-to-br from-blue-500 to-purple-600">
            {event.image ? (
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-8xl text-white opacity-80">🎯</span>
              </div>
            )}
            
            {/* Status Badge */}
            <div className={`absolute top-6 right-6 px-4 py-2 rounded-full text-sm font-medium border shadow-lg ${getTimeStatusColor(event.timeStatus)}`}>
              <span className="mr-2">{getStatusIcon(event.timeStatus)}</span>
              {event.timeInfo}
            </div>
          </div>

          {/* Event Info */}
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {event.title}
                </h1>
                
                {/* Quick Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-700">
                    <span className="mr-3 text-xl">📅</span>
                    <div>
                      <div className="font-medium">{event.formattedDate}</div>
                      <div className="text-sm text-gray-500">Tarih</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <span className="mr-3 text-xl">⏰</span>
                    <div>
                      <div className="font-medium">{event.formattedTime}</div>
                      <div className="text-sm text-gray-500">Saat</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <span className="mr-3 text-xl">📍</span>
                    <div>
                      <div className="font-medium">{event.location}</div>
                      <div className="text-sm text-gray-500">Konum</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <span className="mr-3 text-xl">👤</span>
                    <div>
                      <div className="font-medium">{event.organizer}</div>
                      <div className="text-sm text-gray-500">Organizatör</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Section */}
              <div className="md:ml-8 mt-6 md:mt-0">
                <div className="bg-gray-50 rounded-lg p-6 text-center min-w-[200px]">
                  <div className="text-3xl mb-2">
                    {event.timeStatus === 'ended' ? '✅' : '🎯'}
                  </div>
                  <div className="text-lg font-semibold text-gray-900 mb-2">
                    {event.timeStatus === 'ended' 
                      ? 'Etkinlik Sona Erdi' 
                      : `${event.daysUntilEvent} Gün Kaldı`
                    }
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    {event.timeStatus === 'ended' 
                      ? 'Bu etkinlik tamamlanmıştır' 
                      : 'Etkinlik başlamasına'
                    }
                  </div>
                  
                  {event.canParticipate && (
                    <div className="space-y-2">
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium">
                        📝 Katılım Sağla
                      </button>
                      <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium">
                        ❤️ Favorilere Ekle
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Event Description */}
        <div className="bg-white rounded-lg shadow border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Etkinlik Açıklaması</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {event.description}
            </p>
          </div>
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location Details */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">📍</span>
              Konum Detayları
            </h3>
            <div className="space-y-3">
              <div>
                <div className="font-medium text-gray-900">Adres</div>
                <div className="text-gray-600">{event.location}</div>
              </div>
              <div className="pt-3">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium">
                  🗺️ Haritada Göster
                </button>
              </div>
            </div>
          </div>

          {/* Organizer Details */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">👤</span>
              Organizatör
            </h3>
            <div className="space-y-3">
              <div>
                <div className="font-medium text-gray-900">Düzenleyen</div>
                <div className="text-gray-600">{event.organizer}</div>
              </div>
              <div className="pt-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium">
                  ✉️ İletişime Geç
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Events */}
        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Benzer Etkinlikler</h3>
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🔍</div>
            <p>Benzer etkinlikler yakında burada görünecek</p>
          </div>
        </div>

        {/* Share Section */}
        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Etkinliği Paylaş</h3>
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
              <span>📋</span>
              <span>Linki Kopyala</span>
            </button>
            <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg">
              <span>📱</span>
              <span>WhatsApp</span>
            </button>
            <button className="flex items-center space-x-2 bg-blue-400 hover:bg-blue-500 text-white py-2 px-4 rounded-lg">
              <span>🐦</span>
              <span>Twitter</span>
            </button>
            <button className="flex items-center space-x-2 bg-blue-800 hover:bg-blue-900 text-white py-2 px-4 rounded-lg">
              <span>📘</span>
              <span>Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentEventDetail;