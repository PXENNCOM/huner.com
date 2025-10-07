// pages/student/components/Jobs/JobStatusBadge.jsx
import React from 'react';

const JobStatusBadge = ({ status, compact = false }) => {
  // Duruma göre renkler ve metinler
  const statusStyles = {
    pending: {
      bg: 'bg-yellow-500/20',
      text: 'text-yellow-400',
      border: 'border-yellow-500/30',
      label: 'Beklemede'
    },
    approved: {
      bg: 'bg-blue-500/20',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      label: 'Onaylandı'
    },
    in_progress: {
      bg: 'bg-green-500/20',
      text: 'text-green-400',
      border: 'border-green-500/30',
      label: 'Devam Ediyor'
    },
    completed: {
      bg: 'bg-teal-500/20',
      text: 'text-teal-400',
      border: 'border-teal-500/30',
      label: 'Tamamlandı'
    },
    cancelled: {
      bg: 'bg-red-500/20',
      text: 'text-red-400',
      border: 'border-red-500/30',
      label: 'İptal Edildi'
    }
  };

  const style = statusStyles[status] || {
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    label: status
  };

  if (compact) {
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}>
        {style.label}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${style.bg} ${style.text} ${style.border} border`}>
      {style.label}
    </span>
  );
};

export default JobStatusBadge;