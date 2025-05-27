import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import AdminLayout from './AdminLayout';

const AdminEditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    eventDate: '',
    location: '',
    organizer: '',
    status: 'active'
  });

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setFetchLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/events/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Etkinlik bulunamadı');
        }
        throw new Error('Etkinlik bilgileri getirilemedi');
      }

      const event = await response.json();
      
      // Tarih formatını düzelt (datetime-local input için)
      const eventDate = new Date(event.eventDate);
      const formattedDate = eventDate.toISOString().slice(0, 16);
      
      setFormData({
        title: event.title || '',
        description: event.description || '',
        image: event.image || '',
        eventDate: formattedDate,
        location: event.location || '',
        organizer: event.organizer || '',
        status: event.status || 'active'
      });
    } catch (error) {
      console.error('Etkinlik getirme hatası:', error);
      setError(error.message);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Etkinlik başlığı gereklidir');
      return false;
    }
    if (formData.title.length < 3 || formData.title.length > 200) {
      setError('Başlık 3-200 karakter arasında olmalıdır');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Etkinlik açıklaması gereklidir');
      return false;
    }
    if (formData.description.length < 10 || formData.description.length > 2000) {
      setError('Açıklama 10-2000 karakter arasında olmalıdır');
      return false;
    }
    if (!formData.eventDate) {
      setError('Etkinlik tarihi gereklidir');
      return false;
    }
    if (!formData.location.trim()) {
      setError('Etkinlik konumu gereklidir');
      return false;
    }
    if (formData.location.length < 3 || formData.location.length > 200) {
      setError('Konum 3-200 karakter arasında olmalıdır');
      return false;
    }
    if (!formData.organizer.trim()) {
      setError('Organizatör bilgisi gereklidir');
      return false;
    }
    if (formData.organizer.length < 2 || formData.organizer.length > 100) {
      setError('Organizatör adı 2-100 karakter arasında olmalıdır');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/events/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Etkinlik güncellenemedi');
      }

      const result = await response.json();
      
      // Başarı durumunda etkinlikler sayfasına yönlendir
      navigate('/admin/events', { 
        state: { 
          message: 'Etkinlik başarıyla güncellendi!',
          type: 'success'
        }
      });
      
    } catch (error) {
      console.error('Etkinlik güncelleme hatası:', error);
      setError(error.message || 'Etkinlik güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error && !formData.title) {
    return (
      <AdminLayout>
        <div className="text-center py-16">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Hata Oluştu</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            <Link
              to="/admin/events"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              ← Etkinliklere Dön
            </Link>
            <button
              onClick={fetchEvent}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              🔄 Tekrar Dene
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Etkinlik Düzenle</h1>
            <p className="text-gray-600">Mevcut etkinlik bilgilerini güncelleyin</p>
          </div>
          <Link
            to="/admin/events"
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            ← Geri Dön
          </Link>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow border">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                <div className="flex items-center">
                  <span className="mr-2">⚠️</span>
                  {error}
                </div>
              </div>
            )}

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Etkinlik Durumu
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
                <option value="cancelled">İptal Edildi</option>
              </select>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Etkinlik Başlığı <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Örn: React Workshop - Temel Seviye"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={200}
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                {formData.title.length}/200 karakter
              </p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Etkinlik Açıklaması <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Etkinlik hakkında detaylı bilgi verin..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                maxLength={2000}
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                {formData.description.length}/2000 karakter
              </p>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Etkinlik Tarihi ve Saati <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  id="eventDate"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Etkinlik Konumu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Örn: İstanbul Teknik Üniversitesi - Konferans Salonu"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={200}
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  {formData.location.length}/200 karakter
                </p>
              </div>
            </div>

            {/* Organizer and Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="organizer" className="block text-sm font-medium text-gray-700 mb-2">
                  Organizatör <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="organizer"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleChange}
                  placeholder="Örn: TechHub İstanbul"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={100}
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  {formData.organizer.length}/100 karakter
                </p>
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                  Etkinlik Görseli URL'si <span className="text-gray-400">(Opsiyonel)</span>
                </label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/event-image.jpg"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Image Preview */}
            {formData.image && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Görsel Önizleme
                </label>
                <div className="border border-gray-300 rounded-lg p-4">
                  <img
                    src={formData.image}
                    alt="Etkinlik görseli önizleme"
                    className="w-full max-w-md h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div 
                    className="hidden w-full max-w-md h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500"
                  >
                    <div className="text-center">
                      <span className="text-4xl block mb-2">🖼️</span>
                      <span className="text-sm">Görsel yüklenemedi</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4 space-y-4 sm:space-y-0 space-y-reverse pt-6 border-t border-gray-200">
              <Link
                to="/admin/events"
                className="w-full sm:w-auto px-6 py-3 text-center border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                İptal
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Güncelleniyor...
                  </>
                ) : (
                  <>
                    <span className="mr-2">💾</span>
                    Değişiklikleri Kaydet
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3 flex items-center">
            <span className="mr-2">⚠️</span>
            Dikkat
          </h3>
          <ul className="space-y-2 text-yellow-800">
            <li className="flex items-start">
              <span className="mr-2 mt-1">•</span>
              <span>Etkinlik durumunu "İptal Edildi" olarak değiştirirseniz, öğrenciler bu etkinliği göremeyecek</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1">•</span>
              <span>Tarih değişikliği yaparsanız, kayıtlı katılımcıları bilgilendirmeyi unutmayın</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1">•</span>
              <span>Önemli değişiklikler öncesi yedek almayı düşünün</span>
            </li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEditEvent;