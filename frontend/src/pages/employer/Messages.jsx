// pages/employer/Messages.jsx
import React, { useState, useEffect } from 'react';
import EmployerLayout from './components/EmployerLayout';
import { getEmployerMessages, markMessageAsRead as markAsRead } from '../../services/employerApi';

const EmployerMessages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchMessages();
  }, []);
  
  const fetchMessages = async () => {
    try {
      setLoading(true);
      
      console.log('Fetching employer messages...');
      const response = await getEmployerMessages();
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      console.log('Message count:', response.data?.length);
      
      setMessages(response.data || []);
    } catch (error) {
      console.error('Mesajları getirme hatası:', error);
      console.error('Error details:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };
  
  const markMessageAsRead = async (messageId) => {
    try {
      await markAsRead(messageId);
      fetchMessages();
    } catch (error) {
      console.error('Mesaj okuma hatası:', error);
    }
  };
  
  if (loading) {
    return (
      <EmployerLayout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </EmployerLayout>
    );
  }
  
  console.log('Rendering with messages:', messages);
  
  return (
    <EmployerLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mesajlar</h1>
        <p className="text-gray-600">Admin mesajlarınızı buradan görüntüleyebilirsiniz.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white rounded-lg shadow">
        {/* Mesaj Listesi */}
        <div className="md:col-span-1 border-r border-gray-200">
          <h2 className="text-lg font-semibold p-4 border-b border-gray-200">Mesajlar</h2>
          <div className="space-y-0 max-h-96 overflow-y-auto">
            {messages.length > 0 ? (
              messages.map((messageRecipient) => {
                console.log('Message recipient:', messageRecipient);
                return (
                  <div 
                    key={messageRecipient.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      !messageRecipient.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                    onClick={() => {
                      setSelectedMessage(messageRecipient.AdminMessage);
                      if (!messageRecipient.isRead) {
                        markMessageAsRead(messageRecipient.messageId);
                      }
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className={`font-medium ${!messageRecipient.isRead ? 'text-blue-900' : 'text-gray-900'}`}>
                          {messageRecipient.AdminMessage?.title || 'Başlıksız Mesaj'}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <span className="mr-1">👤</span>
                          Admin Mesajı
                        </p>
                      </div>
                      {!messageRecipient.isRead && (
                        <span className="inline-block w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-2 flex items-center">
                      <span className="mr-1">📅</span>
                      {messageRecipient.AdminMessage?.createdAt 
                        ? new Date(messageRecipient.AdminMessage.createdAt).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'Tarih belirtilmemiş'
                      }
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center text-gray-500">
                <div className="mb-4">
                  <span className="text-4xl">📭</span>
                </div>
                <p className="text-lg font-medium mb-2">Henüz mesaj bulunmamaktadır</p>
                <p className="text-sm">Admin tarafından gönderilen mesajlar burada görünecektir.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Mesaj Detayı */}
        <div className="md:col-span-2">
          {selectedMessage ? (
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {selectedMessage.title}
                </h3>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <div className="flex items-center">
                    <span className="mr-1">👤</span>
                    <span>Gönderen: Admin</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">📅</span>
                    <span>
                      {new Date(selectedMessage.createdAt).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-800">
                    {selectedMessage.content}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6">
              <div className="mb-4">
                <span className="text-6xl">💬</span>
              </div>
              <p className="text-lg font-medium mb-2">Mesaj Seçin</p>
              <p className="text-sm text-center">Detaylarını görüntülemek için sol taraftaki listeden bir mesaj seçin.</p>
            </div>
          )}
        </div>
      </div>
    </EmployerLayout>
  );
};

export default EmployerMessages;