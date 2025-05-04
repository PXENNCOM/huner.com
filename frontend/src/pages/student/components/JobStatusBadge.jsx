// pages/student/components/JobStatusBadge.jsx
import React from 'react';

const JobStatusBadge = ({ status }) => {
  // Duruma göre renkler ve metinler
  const statusStyles = {
    pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      label: 'Beklemede'
    },
    approved: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      label: 'Onaylandı'
    },
    in_progress: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Devam Ediyor'
    },
    completed: {
      bg: 'bg-teal-100',
      text: 'text-teal-800',
      label: 'Tamamlandı'
    },
    cancelled: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      label: 'İptal Edildi'
    }
  };

  const style = statusStyles[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  );
};

export default JobStatusBadge;