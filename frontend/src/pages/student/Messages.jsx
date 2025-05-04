// pages/student/Messages.jsx
import React, { useState, useEffect } from 'react';
import StudentLayout from './components/StudentLayout';
import { getStudentMessages, markMessageAsRead as markAsRead } from '../../services/api';

const StudentMessages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchMessages();
  }, []);
  
  const fetchMessages = async () => {
    try {
      setLoading(true);
      
      console.log('Fetching messages...');
      const response = await getStudentMessages();
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
      <StudentLayout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </StudentLayout>
    );
  }
  
  console.log('Rendering with messages:', messages);
  
  return (
    <StudentLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Mesaj Listesi */}
        <div className="md:col-span-1 border-r border-gray-200">
          <h2 className="text-lg font-semibold p-4">Mesajlar</h2>
          <div className="space-y-2">
            {messages.length > 0 ? (
              messages.map((messageRecipient) => {
                console.log('Message recipient:', messageRecipient);
                return (
                  <div 
                    key={messageRecipient.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      !messageRecipient.isRead ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => {
                      setSelectedMessage(messageRecipient.AdminMessage);
                      if (!messageRecipient.isRead) {
                        markMessageAsRead(messageRecipient.messageId);
                      }
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          {messageRecipient.AdminMessage?.title || 'No title'}
                        </p>
                        <p className="text-sm text-gray-500">Admin Mesajı</p>
                      </div>
                      {!messageRecipient.isRead && (
                        <span className="inline-block w-2 h-2 mt-2 ml-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {messageRecipient.AdminMessage?.createdAt 
                        ? new Date(messageRecipient.AdminMessage.createdAt).toLocaleDateString('tr-TR')
                        : 'No date'
                      }
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-gray-500">
                Henüz mesaj bulunmamaktadır.
                <pre className="mt-2 text-xs bg-gray-100 p-2">
                  {JSON.stringify({ messagesLength: messages.length }, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
        
        {/* Mesaj Detayı */}
        <div className="md:col-span-2">
          {selectedMessage ? (
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">{selectedMessage.title}</h3>
              <div className="mb-4">
                <span className="text-sm text-gray-500">Gönderen: </span>
                <span className="font-medium">Admin</span>
              </div>
              <div className="prose">
                {selectedMessage.content}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Bir mesaj seçin
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentMessages;