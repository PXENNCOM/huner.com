// pages/student/components/Messages/MessageDetailModal.jsx
import React from 'react';
import { MdClose, MdMessage, MdAdminPanelSettings, MdAccessTime, MdMarkEmailRead } from 'react-icons/md';

const MessageDetailModal = ({ isOpen, onClose, messageRecipient }) => {
  if (!isOpen || !messageRecipient) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Tarih yok';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const message = messageRecipient.AdminMessage;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="absolute inset-4 md:inset-8 lg:inset-16 bg-blue-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-blue-800/50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-blue-800/50 bg-blue-800/30 backdrop-blur-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-600/30 border border-green-600/50 rounded-lg">
              <MdMessage className="w-5 h-5 text-green-300" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Mesaj Detayı</h2>
              <p className="text-sm text-blue-300">Admin mesajınız</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-blue-300 hover:text-white hover:bg-blue-700/50 rounded-lg transition-all duration-200"
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="h-full overflow-y-auto pb-20">
          <div className="p-6 space-y-6">
            {/* Message Header */}
            <div className="bg-blue-800/30 border border-blue-700/30 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <MdAdminPanelSettings className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-1">
                      {message?.title || 'Başlık yok'}
                    </h1>
                    <p className="text-blue-300">Admin Mesajı</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  messageRecipient.isRead 
                    ? 'bg-blue-600/20 text-blue-400' 
                    : 'bg-green-500/20 text-green-400'
                }`}>
                  {messageRecipient.isRead ? 'Okundu' : 'Yeni'}
                </div>
              </div>

              {/* Message Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-blue-200">
                  <MdAccessTime className="w-4 h-4 mr-3 text-blue-400" />
                  <div>
                    <div className="font-medium">Gönderim Tarihi</div>
                    <div className="text-sm text-blue-300">
                      {formatDate(message?.createdAt)} • {formatTime(message?.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-blue-200">
                  <MdMarkEmailRead className="w-4 h-4 mr-3 text-green-400" />
                  <div>
                    <div className="font-medium">Durum</div>
                    <div className="text-sm text-blue-300">
                      {messageRecipient.isRead ? 'Okunmuş' : 'Okunmamış'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Content */}
            <div className="bg-blue-800/30 border border-blue-700/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <span className="mr-2">📄</span>
                Mesaj İçeriği
              </h3>
              <div className="prose prose-invert max-w-none">
                <div className="text-blue-200 leading-relaxed whitespace-pre-wrap">
                  {message?.content || 'İçerik yok'}
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-blue-800/30 border border-blue-700/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <span className="mr-2">ℹ️</span>
                Mesaj Bilgileri
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-blue-700/30 border border-blue-600/30 rounded-lg">
                  <div className="text-blue-300 text-sm mb-1">Mesaj ID</div>
                  <div className="text-white font-mono text-sm">{message?.id || 'N/A'}</div>
                </div>
                <div className="p-3 bg-blue-700/30 border border-blue-600/30 rounded-lg">
                  <div className="text-blue-300 text-sm mb-1">Gönderen</div>
                  <div className="text-white font-medium">Sistem Yöneticisi</div>
                </div>
                <div className="p-3 bg-blue-700/30 border border-blue-600/30 rounded-lg">
                  <div className="text-blue-300 text-sm mb-1">Alıcı</div>
                  <div className="text-white font-medium">Siz</div>
                </div>
                <div className="p-3 bg-blue-700/30 border border-blue-600/30 rounded-lg">
                  <div className="text-blue-300 text-sm mb-1">Okuma Durumu</div>
                  <div className={`font-medium ${
                    messageRecipient.isRead ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {messageRecipient.isRead ? 'Okunmuş' : 'Okunmamış'}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-blue-800/30 border border-blue-700/30 rounded-xl p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">İşlemler</h3>
                <p className="text-blue-300 mb-4">Bu mesajla ilgili yapabileceğiniz işlemler</p>
                <div className="flex gap-3 justify-center">
                  {!messageRecipient.isRead && (
                    <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center">
                      <MdMarkEmailRead className="w-4 h-4 mr-2" />
                      Okundu Olarak İşaretle
                    </button>
                  )}
                  <button 
                    onClick={onClose}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageDetailModal;