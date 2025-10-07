// pages/student/components/Messages/MessagesPreviewCard.jsx
import React, { useState } from 'react';
import { MdMessage, MdArrowForward, MdAccessTime, MdAdminPanelSettings } from 'react-icons/md';
import MessageDetailModal from './MessageDetailModal';

const MessagesPreviewCard = ({ messages, onOpenPanel }) => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isMessageDetailOpen, setIsMessageDetailOpen] = useState(false);

  // Son 3 mesajı göster (okunmamış öncelikli)
  const recentMessages = messages
    .sort((a, b) => {
      // Önce okunmamış mesajları göster
      if (a.isRead !== b.isRead) {
        return a.isRead ? 1 : -1;
      }
      // Sonra tarih sırasına göre
      return new Date(b.AdminMessage?.createdAt) - new Date(a.AdminMessage?.createdAt);
    })
    .slice(0, 3);

  const unreadCount = messages.filter(m => !m.isRead).length;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short'
    });
  };

  const handleMessageClick = (messageRecipient) => {
    setSelectedMessage(messageRecipient);
    setIsMessageDetailOpen(true);
  };

  const handleCloseMessageDetail = () => {
    setIsMessageDetailOpen(false);
    setSelectedMessage(null);
  };

  return (
    <>
      <div className="bg-blue-800/30 backdrop-blur-xl rounded-xl p-6 border border-blue-700/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-600/30 border border-green-600/50 rounded-lg relative">
              <MdMessage className="w-5 h-5 text-green-300" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{unreadCount}</span>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Mesajlar</h2>
              <p className="text-sm text-blue-300">
                {unreadCount > 0 ? `${unreadCount} yeni mesaj` : 'Tüm mesajlar okundu'}
              </p>
            </div>
          </div>
          
          <button
            onClick={onOpenPanel}
            className="text-green-300 hover:text-green-200 text-sm font-medium flex items-center group"
          >
            Tümünü Gör
            <MdArrowForward className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        {recentMessages.length === 0 ? (
          <div className="text-center py-8">
            <div className="p-4 bg-blue-700/30 border border-blue-600/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MdMessage className="w-8 h-8 text-blue-300" />
            </div>
            <p className="text-blue-300 text-sm">
              Henüz mesaj bulunmuyor.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentMessages.map(messageRecipient => (
              <div 
                key={messageRecipient.id} 
                className={`bg-blue-700/30 border border-blue-600/30 rounded-lg p-4 cursor-pointer transition-colors ${
                  !messageRecipient.isRead 
                    ? 'border-green-500/50 bg-green-500/10 hover:border-green-400/50' 
                    : 'hover:border-blue-500/50'
                }`}
                onClick={() => handleMessageClick(messageRecipient)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="p-1 bg-green-500/20 rounded-lg flex-shrink-0">
                      <MdAdminPanelSettings className="w-3 h-3 text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white text-sm line-clamp-1">
                        {messageRecipient.AdminMessage?.title || 'Başlık yok'}
                      </h3>
                      <p className="text-blue-300 text-xs line-clamp-1 mt-1">
                        {messageRecipient.AdminMessage?.content || 'İçerik yok'}
                      </p>
                    </div>
                  </div>
                  {!messageRecipient.isRead && (
                    <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0 mt-1"></div>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-xs text-blue-200">
                  <div className="flex items-center">
                    <MdAccessTime className="w-3 h-3 mr-1" />
                    <span>{formatDate(messageRecipient.AdminMessage?.createdAt)}</span>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMessageClick(messageRecipient);
                    }}
                    className="text-green-300 hover:text-green-200 font-medium"
                  >
                    Oku
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        {messages.length > 0 && (
          <div className="mt-4 pt-4 border-t border-blue-700/30">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-blue-700/30 border border-blue-600/30 rounded-lg p-2">
                <div className="text-sm font-bold text-red-400">
                  {unreadCount}
                </div>
                <div className="text-xs text-blue-300">Okunmamış</div>
              </div>
              <div className="bg-blue-700/30 border border-blue-600/30 rounded-lg p-2">
                <div className="text-sm font-bold text-green-400">
                  {messages.length}
                </div>
                <div className="text-xs text-blue-300">Toplam</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      <MessageDetailModal 
        isOpen={isMessageDetailOpen}
        onClose={handleCloseMessageDetail}
        messageRecipient={selectedMessage}
      />
    </>
  );
};

export default MessagesPreviewCard;