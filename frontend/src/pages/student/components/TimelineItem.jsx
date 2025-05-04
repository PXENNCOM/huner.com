// pages/student/components/TimelineItem.jsx
import React from 'react';

const TimelineItem = ({ title, date, description, status }) => {
  // Durum göstergeleri
  const statusStyles = {
    pending: {
      dot: 'bg-gray-300',
      line: 'border-gray-200'
    },
    active: {
      dot: 'bg-blue-500',
      line: 'border-blue-200'
    },
    completed: {
      dot: 'bg-green-500',
      line: 'border-green-200'
    },
    cancelled: {
      dot: 'bg-red-500',
      line: 'border-red-200'
    }
  };

  const style = statusStyles[status] || statusStyles.pending;

  return (
    <div className="mb-6 last:mb-0">
      <div className="relative">
        <div className={`absolute -left-7 mt-1.5 w-3 h-3 rounded-full ${style.dot}`}></div>
        <div className="flex items-start">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-medium text-gray-800">
              {title}
              {date && <span className="text-gray-500 font-normal ml-2 text-sm">{date}</span>}
            </h3>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineItem;