// pages/student/components/Messages/MessagesPanel.jsx
import React, { useState, useEffect } from 'react';
import { getStudentMessages, markMessageAsRead as markAsRead } from '../../../../services/api';
import MessageCard from './MessageCard';
import MessageDetailModal from './MessageDetailModal';
import { MdClose, MdMessage, MdSearch, MdMarkAsUnread } from 'react-icons/md';

const MessagesPanel = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isMessageDetailOpen, setIsMessageDetailOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen]);

  useEffect(() => {
    filterMessages();
  }, [messages, searchTerm, filter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await getStudentMessages();
      setMessages(response.data || []);
      setFilteredMessages(response.data || []);
    } catch (error) {
      console.error('Mesajları getirme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMessages = () => {
    let filtered = [...messages];
    
    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(messageRecipient =>
        messageRecipient.AdminMessage?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        messageRecipient.AdminMessage?.content?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Okuma durumu filtresi
    if (filter === 'unread') {
      filtered = filtered.filter(messageRecipient => !messageRecipient.isRead);
    } else if (filter === 'read') {
      filtered = filtered.filter(messageRecipient => messageRecipient.isRead);
    }
    
    setFilteredMessages(filtered);
  };

  const markMessageAsRead = async (messageId) => {
    try {
      await markAsRead(messageId);
      fetchMessages();
    } catch (error) {
      console.error('Mesaj okuma hatası:', error);
    }
  };

  const handleMessageClick = (messageRecipient) => {
    setSelectedMessage(messageRecipient);
    setIsMessageDetailOpen(true);
    
    // Mesajı okundu olarak işaretle
    if (!messageRecipient.isRead) {
      markMessageAsRead(messageRecipient.messageId);
    }
  };

  const handleCloseMessageDetail = () => {
    setIsMessageDetailOpen(false);
    setSelectedMessage(null);
  };

  const filterOptions = [
    { id: 'all', label: 'Tümü', count: messages.length },
    { id: 'unread', label: 'Okunmamış', count: messages.filter(m => !m.isRead).length },
    { id: 'read', label: 'Okunmuş', count: messages.filter(m => m.isRead).length }
  ];

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Panel */}
        <div className="absolute right-0 top-0 h-full w-full max-w-md bg-blue-900/95 backdrop-blur-xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-blue-800/50 bg-blue-800/30 backdrop-blur-xl">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-600/30 border border-green-600/50 rounded-lg">
                <MdMessage className="w-5 h-5 text-green-300" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Mesajlar</h2>
                <p className="text-sm text-blue-300">Admin mesajlarınız</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-blue-300 hover:text-white hover:bg-blue-700/50 rounded-lg transition-all duration-200"
            >
              <MdClose className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="h-full overflow-y-auto pb-20">
            {/* Search Bar */}
            <div className="p-4 border-b border-blue-700/30">
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Mesaj ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-blue-800/30 border border-blue-700/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50"
                />
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="p-4 border-b border-blue-700/30">
              <div className="flex flex-wrap gap-2">
                {filterOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => setFilter(option.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      filter === option.id
                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                        : 'bg-blue-700/30 border border-blue-600/30 text-blue-200 hover:bg-blue-600/50 hover:text-white'
                    }`}
                  >
                    {option.label}
                    {option.count > 0 && (
                      <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                        filter === option.id
                          ? 'bg-green-400 text-green-900'
                          : 'bg-blue-600 text-blue-200'
                      }`}>
                        {option.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredMessages.length === 0 && (
              <div className="p-8 text-center">
                <div className="p-4 bg-blue-800/30 border border-blue-700/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <MdMessage className="w-8 h-8 text-blue-300" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  {filter === 'all' 
                    ? 'Henüz mesaj yok'
                    : `${filterOptions.find(o => o.id === filter)?.label} mesaj yok`
                  }
                </h3>
                <p className="text-blue-300 text-sm">
                  {filter === 'all'
                    ? 'Yeni mesajlar burada görünecek'
                    : 'Farklı filtreler deneyebilirsiniz'}
                </p>
              </div>
            )}

            {/* Messages List */}
            {!loading && filteredMessages.length > 0 && (
              <div className="p-4 space-y-3">
                {filteredMessages.map(messageRecipient => (
                  <MessageCard 
                    key={messageRecipient.id}
                    messageRecipient={messageRecipient}
                    onViewDetails={() => handleMessageClick(messageRecipient)}
                    compact={true}
                  />
                ))}
              </div>
            )}

            {/* Quick Stats */}
            {!loading && messages.length > 0 && (
              <div className="p-4 border-t border-blue-700/30">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-blue-800/30 border border-blue-700/30 rounded-lg p-3">
                    <div className="text-lg font-bold text-red-400">
                      {messages.filter(m => !m.isRead).length}
                    </div>
                    <div className="text-xs text-blue-300">Okunmamış</div>
                  </div>
                  <div className="bg-blue-800/30 border border-blue-700/30 rounded-lg p-3">
                    <div className="text-lg font-bold text-green-400">
                      {messages.filter(m => m.isRead).length}
                    </div>
                    <div className="text-xs text-blue-300">Okunmuş</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
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

export default MessagesPanel;