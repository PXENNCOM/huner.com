// pages/employer/components/Messages/MessagesPreviewCard.jsx
import React, { useState, useEffect } from 'react';
import { getEmployerMessages } from '../../../../services/employerApi';
import { MdMessage, MdArrowForward, MdAdminPanelSettings, MdMailOutline, MdNotifications } from 'react-icons/md';

const MessagesPreviewCard = ({ onOpenPanel }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0
  });

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await getEmployerMessages();
      const messageList = response.data || [];
      setMessages(messageList);
      
      // İstatistikleri hesapla
      setStats({
        total: messageList.length,
        unread: messageList.filter(m => !m.isRead).length
      });
    } catch (error) {
      console.error('Mesajlar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Tarih belirtilmemiş';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Bugün';
    if (days === 1) return 'Dün';
    return `${days} gün önce`;
  };

  if (loading) {
    return (
      <div className="bg-blue-800/30 backdrop-blur-xl rounded-xl p-4 sm:p-6 border border-blue-700/30">
        <div className="animate-pulse">
          <div className="h-4 bg-blue-700/50 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-blue-700/50 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-800/30 backdrop-blur-xl rounded-xl p-4 sm:p-6 border border-blue-700/30">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/20 rounded-lg relative">
            <MdMessage className="w-5 h-5 text-blue-300" />
            {stats.unread > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">{stats.unread}</span>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Mesajlar</h2>
            <p className="text-sm text-blue-200 hidden sm:block">Admin mesajlarınız</p>
          </div>
        </div>
        
        <button
          onClick={onOpenPanel}
          className="text-blue-300 hover:text-blue-200 text-sm font-medium flex items-center justify-center sm:justify-start group self-end sm:self-auto"
        >
          Tümünü Gör
          <MdArrowForward className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-6 sm:py-8">
          <div className="p-4 bg-blue-700/30 border border-blue-600/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <MdMailOutline className="w-8 h-8 text-blue-300" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Mesaj yok</h3>
          <p className="text-blue-200 text-sm max-w-sm mx-auto">
            Admin tarafından gönderilen mesajlar burada görünecek
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* İstatistikler */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-700/30 rounded-lg p-3 border border-blue-600/30">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-white">{stats.total}</div>
                  <div className="text-xs text-blue-200">Toplam Mesaj</div>
                </div>
                <MdMessage className="w-5 h-5 sm:w-6 sm:h-6 text-blue-300" />
              </div>
            </div>
            
            <div className="bg-blue-700/30 rounded-lg p-3 border border-blue-600/30">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-orange-300">{stats.unread}</div>
                  <div className="text-xs text-blue-200">Okunmamış</div>
                </div>
                <MdNotifications className="w-5 h-5 sm:w-6 sm:h-6 text-orange-300" />
              </div>
            </div>
          </div>

          {/* Son Mesajlar */}
          <div>
            <h3 className="text-sm font-medium text-blue-200 mb-3">Son Mesajlar</h3>
            <div className="space-y-2">
              {messages.slice(0, 3).map((messageRecipient) => (
                <div
                  key={messageRecipient.id}
                  className="bg-blue-700/30 rounded-lg p-3 sm:p-4 border border-blue-600/30 hover:bg-blue-600/40 transition-all duration-200 cursor-pointer"
                  onClick={onOpenPanel}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                        <MdAdminPanelSettings className="w-4 h-4 text-orange-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium text-sm line-clamp-1 ${
                          messageRecipient.isRead ? 'text-blue-200' : 'text-white'
                        }`}>
                          {messageRecipient.AdminMessage?.title || 'Başlıksız Mesaj'}
                        </h4>
                        <p className="text-blue-200 text-xs line-clamp-2 mt-1">
                          {messageRecipient.AdminMessage?.content || 'İçerik yok'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-1 ml-2 flex-shrink-0">
                      {!messageRecipient.isRead && (
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      )}
                      <span className="text-xs text-blue-300 whitespace-nowrap">
                        {formatTime(messageRecipient.AdminMessage?.createdAt)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-blue-400">
                    <div className="flex items-center space-x-2">
                      <span>Admin</span>
                      {!messageRecipient.isRead && (
                        <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs">
                          Yeni
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onOpenPanel}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            <MdMessage className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Tüm Mesajları Görüntüle</span>
            <span className="sm:hidden">Mesajları Gör</span>
            {stats.unread > 0 && (
              <span className="ml-2 px-2 py-1 bg-red-500 text-white rounded-full text-xs">
                {stats.unread}
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default MessagesPreviewCard;