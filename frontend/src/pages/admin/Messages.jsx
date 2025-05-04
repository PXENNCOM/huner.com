// pages/admin/Messages.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import adminApi from '../../services/adminApi';

const Messages = () => {
  const [messageForm, setMessageForm] = useState({
    title: '',
    content: '',
    recipientType: 'students',
    sendType: 'all',
    selectedRecipients: [],
    priority: 'normal'
  });
  
  const [students, setStudents] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const [hata, setHata] = useState(null);
  const [basari, setBasari] = useState(null);

  useEffect(() => {
    verileriGetir();
  }, []);

  const verileriGetir = async () => {
    try {
      const [studentsRes, employersRes, messagesRes] = await Promise.all([
        adminApi.ogrenciYonetimi.tumOgrencileriGetir(),
        adminApi.isverenYonetimi.tumIsverenleriGetir(),
        adminApi.mesajSistemi.gonderilenMesajlariGetir()
      ]);
      
      setStudents(studentsRes.data);
      setEmployers(employersRes.data);
      setSentMessages(messagesRes.data);
      setYukleniyor(false);
    } catch (err) {
      console.error('Veri getirme hatası:', err);
      setHata('Veriler yüklenirken hata oluştu');
      setYukleniyor(false);
    }
  };

  const handleInputChange = (field, value) => {
    setMessageForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setHata(null);
    setBasari(null);
    
    try {
      setGonderiliyor(true);
      
      // Log için data'yı kontrol et
      console.log('Sending message data:', messageForm);
      
      await adminApi.mesajSistemi.mesajGonder(messageForm);
      
      setBasari('Mesaj başarıyla gönderildi!');
      setMessageForm({
        title: '',
        content: '',
        recipientType: 'students',
        sendType: 'all',
        selectedRecipients: [],
        priority: 'normal'
      });
      verileriGetir();
    } catch (err) {
      console.error('Mesaj gönderme hatası:', err);
      setHata('Mesaj gönderilirken hata oluştu: ' + (err.response?.data?.message || err.message));
    } finally {
      setGonderiliyor(false);
    }
  };

  const priorityBadgeColor = (priority) => {
    switch(priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'normal':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mesaj Gönderme Formu */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Yeni Mesaj Gönder</h2>
          
          {hata && (
            <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
              {hata}
            </div>
          )}
          
          {basari && (
            <div className="bg-green-50 text-green-600 p-3 rounded mb-4">
              {basari}
            </div>
          )}
          
          <form onSubmit={handleSendMessage}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Alıcı Tipi</label>
              <select 
                className="w-full p-2 border rounded"
                value={messageForm.recipientType}
                onChange={(e) => handleInputChange('recipientType', e.target.value)}
              >
                <option value="students">Öğrenciler</option>
                <option value="employers">İşverenler</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Gönderim Tipi</label>
              <select 
                className="w-full p-2 border rounded"
                value={messageForm.sendType}
                onChange={(e) => handleInputChange('sendType', e.target.value)}
              >
                <option value="all">Hepsine</option>
                <option value="selected">Seçilenlere</option>
              </select>
            </div>
            
            {messageForm.sendType === 'selected' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Alıcıları Seç</label>
                <select 
                  multiple 
                  className="w-full p-2 border rounded h-32"
                  value={messageForm.selectedRecipients}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                    handleInputChange('selectedRecipients', selected);
                  }}
                >
                  {messageForm.recipientType === 'students' 
                    ? students.map(student => (
                        <option key={student.id} value={student.id}>
                          {student.fullName || student.User?.email}
                        </option>
                      ))
                    : employers.map(employer => (
                        <option key={employer.id} value={employer.id}>
                          {employer.companyName || employer.User?.email}
                        </option>
                      ))
                  }
                </select>
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Başlık</label>
              <input 
                type="text"
                className="w-full p-2 border rounded"
                value={messageForm.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Mesaj</label>
              <textarea 
                className="w-full p-2 border rounded h-32"
                value={messageForm.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Öncelik</label>
              <select 
                className="w-full p-2 border rounded"
                value={messageForm.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
              >
                <option value="low">Düşük</option>
                <option value="normal">Normal</option>
                <option value="high">Yüksek</option>
              </select>
            </div>
            
            <button 
              type="submit"
              disabled={gonderiliyor}
              className={`w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 ${
                gonderiliyor ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {gonderiliyor ? 'Gönderiliyor...' : 'Mesaj Gönder'}
            </button>
          </form>
        </div>
        
        {/* Gönderilen Mesajlar */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Gönderilen Mesajlar</h2>
          
          {yukleniyor ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {sentMessages.map(message => (
                <div key={message.id} className="border p-4 rounded">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">{message.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${priorityBadgeColor(message.priority)}`}>
                      {message.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{message.content.substring(0, 100)}...</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {message.recipientType === 'students' ? 'Öğrencilere' : 'İşverenlere'} 
                      ({message.sendType === 'all' ? 'Hepsine' : 'Seçilenlere'})
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(message.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Messages;