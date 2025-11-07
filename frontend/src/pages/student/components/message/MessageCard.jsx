// pages/student/components/Messages/MessageCard.jsx
import React from 'react';
import { MdAdminPanelSettings, MdArrowForward, MdCircle, MdAccessTime } from 'react-icons/md';

const MessageCard = ({ messageRecipient, onViewDetails, compact = false }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Tarih yok';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
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

  if (compact) {
    return (
      <div 
        className={`bg-blue-800/30 backdrop-blur-xl rounded-xl p-4 border cursor-pointer transition-all duration-200 hover:bg-blue-800/50 ${
          !messageRecipient.isRead 
            ? 'border-green-500/50 bg-green-500/10' 
            : 'border-blue-700/30'
        }`}
        onClick={onViewDetails}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3 flex-1">
            <div className="p-2 bg-green-500/20 rounded-lg flex-shrink-0">
              <MdAdminPanelSettings className="w-4 h-4 text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium text-sm mb-1 line-clamp-1">
                {messageRecipient.AdminMessage?.title || 'Başlık yok'}
              </h3>
              <p className="text-blue-300 text-xs">Message</p>
            </div>
          </div>
          {!messageRecipient.isRead && (
            <div className="flex items-center space-x-1">
              <MdCircle className="w-2 h-2 text-green-400" />
              <span className="text-xs text-green-400 font-medium">New</span>
            </div>
          )}
        </div>

        {/* Content Preview */}
        <div className="mb-3">
          <p className="text-blue-200 text-xs line-clamp-2">
            {messageRecipient.AdminMessage?.content || 'no content'}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-blue-300">
          <div className="flex items-center">
            <MdAccessTime className="w-3 h-3 mr-1" />
            <span>{formatDate(messageRecipient.AdminMessage?.createdAt)}</span>
            <span className="mx-1">•</span>
            <span>{formatTime(messageRecipient.AdminMessage?.createdAt)}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            className="text-green-400 hover:text-green-300 font-medium flex items-center group"
          >
            Read
            <MdArrowForward className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  // Normal (non-compact) view
  return (
    <div 
      className={`bg-blue-800/30 backdrop-blur-xl border border-blue-700/30 rounded-lg shadow-lg overflow-hidden border-l-4 cursor-pointer hover:shadow-xl transition-shadow duration-300 ${
        !messageRecipient.isRead 
          ? 'border-green-500 bg-green-500/10' 
          : 'border-blue-700/30'
      }`}
      onClick={onViewDetails}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <MdAdminPanelSettings className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {messageRecipient.AdminMessage?.title || 'Başlık yok'}
              </h3>
              <p className="text-sm text-blue-200">Admin Mesajı</p>
            </div>
          </div>
          {!messageRecipient.isRead && (
            <div className="flex items-center space-x-2">
              <MdCircle className="w-3 h-3 text-green-500" />
              <span className="text-sm text-green-600 font-medium">Yeni</span>
            </div>
          )}
        </div>

        <div className="mb-4">
          <p className="text-blue-200 line-clamp-3">
            {messageRecipient.AdminMessage?.content || 'İçerik yok'}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm text-blue-300">
          <div className="flex items-center">
            <MdAccessTime className="w-4 h-4 mr-2" />
            <span>{formatDate(messageRecipient.AdminMessage?.createdAt)}</span>
            <span className="mx-2">•</span>
            <span>{formatTime(messageRecipient.AdminMessage?.createdAt)}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
          >
            Mesajı Oku
            <MdArrowForward className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageCard;