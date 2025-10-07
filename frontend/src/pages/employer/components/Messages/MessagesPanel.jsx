// pages/employer/components/Messages/MessagesPanel.jsx
import React, { useState, useEffect } from 'react';
import { getEmployerMessages, markMessageAsRead as markAsRead } from '../../../../services/employerApi';
import { 
  MdClose, 
  MdMessage, 
  MdSearch,
  MdAccessTime,
  MdArrowBack
} from 'react-icons/md';

const MessagesPanel = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showDetail, setShowDetail] = useState(false); // Mobile detail view state

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await getEmployerMessages();
      setMessages(response.data || []);
    } catch (error) {
      console.error('Mesajlar yüklenirken hata:', error);
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

  const filteredMessages = messages.filter(messageRecipient => {
    const message = messageRecipient.AdminMessage;
    if (!message) return false;
    
    const matchesSearch = message.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.content?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'unread') return !messageRecipient.isRead && matchesSearch;
    if (filter === 'read') return messageRecipient.isRead && matchesSearch;
    return matchesSearch;
  });

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Tarih belirtilmemiş';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes} dakika önce`;
    if (hours < 24) return `${hours} saat önce`;
    if (days === 0) return 'Bugün';
    if (days === 1) return 'Dün';
    return `${days} gün önce`;
  };

  const handleMessageClick = (messageRecipient) => {
    setSelectedMessage(messageRecipient.AdminMessage);
    setShowDetail(true); // Show detail on mobile
    // Mesajı okundu olarak işaretle
    if (!messageRecipient.isRead) {
      markMessageAsRead(messageRecipient.messageId);
    }
  };

  const handleBackToList = () => {
    setShowDetail(false);
    setSelectedMessage(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop - Desktop only */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm hidden md:block"
        onClick={onClose}
      />
      
      {/* Panel - Full screen on mobile */}
      <div className="absolute w-full md:right-0 md:top-0 h-full md:w-full md:max-w-4xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 shadow-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-blue-700/50 bg-blue-800/50 backdrop-blur-xl gap-3 sm:gap-0">
          <div className="flex items-center space-x-3">
            {/* Back button - Mobile only, when detail is shown */}
            {showDetail && (
              <button
                onClick={handleBackToList}
                className="p-2 text-blue-200 hover:text-white hover:bg-blue-700/50 rounded-lg transition-all duration-200 md:hidden"
              >
                <MdArrowBack className="w-5 h-5" />
              </button>
            )}
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <MdMessage className="w-5 h-5 text-blue-300" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-white truncate">
                {showDetail ? 'Mesaj Detayı' : 'Mesajlar'}
              </h2>
              <p className="text-sm text-blue-200 hidden sm:block">
                {showDetail ? 'Admin mesajı' : 'Yazılımcılardan gelen mesajlar'}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-blue-200 hover:text-white hover:bg-blue-700/50 rounded-lg transition-all duration-200 self-end sm:self-auto"
          >
            <MdClose className="w-5 h-5" />
          </button>
        </div>

        <div className="h-full flex">
          {/* Mesaj Listesi - Hidden on mobile when detail is shown */}
          <div className={`w-full md:w-1/3 md:border-r border-blue-700/50 flex flex-col ${showDetail ? 'hidden md:flex' : 'flex'}`}>
            {/* Search & Filter */}
            <div className="p-4 border-b border-blue-700/30">
              <div className="relative mb-3">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-300" />
                <input
                  type="text"
                  placeholder="Mesaj ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-blue-700/30 border border-blue-600/50 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              
              <div className="grid grid-cols-3 md:flex md:flex-wrap gap-1 md:gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-2 py-1 rounded-lg text-xs font-medium transition-all text-center ${
                    filter === 'all' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-blue-800/30 text-blue-200 hover:bg-blue-700/50'
                  }`}
                >
                  <span className="block md:inline">Tümü</span>
                  <span className="block md:inline md:ml-1">({messages.length})</span>
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-2 py-1 rounded-lg text-xs font-medium transition-all text-center ${
                    filter === 'unread' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-blue-800/30 text-blue-200 hover:bg-blue-700/50'
                  }`}
                >
                  <span className="block md:inline">Yeni</span>
                  <span className="block md:inline md:ml-1">({messages.filter(m => !m.isRead).length})</span>
                </button>
                <button
                  onClick={() => setFilter('read')}
                  className={`px-2 py-1 rounded-lg text-xs font-medium transition-all text-center ${
                    filter === 'read' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-blue-800/30 text-blue-200 hover:bg-blue-700/50'
                  }`}
                >
                  <span className="block md:inline">Okunmuş</span>
                  <span className="block md:inline md:ml-1">({messages.filter(m => m.isRead).length})</span>
                </button>
              </div>
            </div>

            {/* Mesaj Listesi */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="text-center p-8">
                  <MdMessage className="w-12 h-12 text-blue-300 mx-auto mb-4" />
                  <p className="text-blue-200 text-sm">
                    {searchQuery ? 'Arama sonucu bulunamadı' : 'Henüz mesaj yok'}
                  </p>
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {filteredMessages.map((messageRecipient) => (
                    <div
                      key={messageRecipient.id}
                      onClick={() => handleMessageClick(messageRecipient)}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedMessage?.id === messageRecipient.AdminMessage?.id
                          ? 'bg-blue-600/40 border border-blue-500/50'
                          : messageRecipient.isRead
                          ? 'bg-blue-800/30 hover:bg-blue-700/40'
                          : 'bg-blue-700/40 hover:bg-blue-600/50 border-l-4 border-blue-400'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                          <MdAccessTime className="w-4 h-4 text-orange-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`text-sm font-medium truncate ${
                              messageRecipient.isRead ? 'text-blue-200' : 'text-white'
                            }`}>
                              Admin Mesajı
                            </h4>
                            <span className="text-xs text-blue-300 whitespace-nowrap ml-2">
                              {formatTime(messageRecipient.AdminMessage?.createdAt)}
                            </span>
                          </div>
                          <p className={`text-xs font-medium mb-1 truncate ${
                            messageRecipient.isRead ? 'text-blue-300' : 'text-blue-100'
                          }`}>
                            {messageRecipient.AdminMessage?.title || 'Başlıksız Mesaj'}
                          </p>
                          <p className="text-xs text-blue-400 line-clamp-2">
                            {messageRecipient.AdminMessage?.content || 'İçerik yok'}
                          </p>
                        </div>
                        {!messageRecipient.isRead && (
                          <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mesaj Detayı - Full width on mobile when shown */}
          <div className={`flex-1 flex flex-col ${showDetail ? 'flex' : 'hidden md:flex'}`}>
            {selectedMessage ? (
              <>
                {/* Mesaj Header */}
                <div className="p-4 border-b border-blue-700/30 bg-blue-800/30">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <MdAccessTime className="w-5 h-5 text-orange-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white">Admin Mesajı</h3>
                      <p className="text-sm text-blue-200 truncate">{selectedMessage.title || 'Başlıksız Mesaj'}</p>
                      <div className="flex items-center text-xs text-blue-300 mt-1">
                        <MdAccessTime className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">
                          {selectedMessage.createdAt 
                            ? new Date(selectedMessage.createdAt).toLocaleDateString('tr-TR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : 'Tarih belirtilmemiş'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mesaj İçeriği */}
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="bg-blue-800/30 rounded-xl p-4 md:p-6 border border-blue-700/30">
                    <p className="text-white whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                      {selectedMessage.content || 'Mesaj içeriği bulunmuyor.'}
                    </p>
                  </div>
                </div>

                {/* Yanıt Alanı */}
                <div className="p-4 border-t border-blue-700/30 bg-blue-800/30">
                  <div className="text-center text-blue-200 text-sm">
                    💡 Admin mesajlarına yanıt veremezsiniz
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="text-center">
                  <MdMessage className="w-12 md:w-16 h-12 md:h-16 text-blue-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Mesaj Seçin</h3>
                  <p className="text-blue-200 text-sm">
                    Detaylarını görmek için bir mesaj seçin
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPanel;