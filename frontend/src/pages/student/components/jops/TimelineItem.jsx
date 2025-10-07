// pages/student/components/Jobs/TimelineItem.jsx
import React from 'react';
import { MdCheckCircle, MdRadioButtonUnchecked, MdCancel, MdAccessTime } from 'react-icons/md';

const TimelineItem = ({ title, date, description, status }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <MdCheckCircle className="w-5 h-5 text-green-400" />;
      case 'active':
        return <MdAccessTime className="w-5 h-5 text-blue-400" />;
      case 'cancelled':
        return <MdCancel className="w-5 h-5 text-red-400" />;
      default:
        return <MdRadioButtonUnchecked className="w-5 h-5 text-blue-300" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'text-green-300';
      case 'active':
        return 'text-blue-300';
      case 'cancelled':
        return 'text-red-300';
      default:
        return 'text-blue-300';
    }
  };

  return (
    <div className="flex items-start space-x-3 pb-4 last:pb-0">
      <div className="flex-shrink-0 mt-1">
        {getStatusIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className={`text-sm font-medium ${getStatusColor()}`}>
            {title}
          </h4>
          {date && (
            <span className="text-xs text-blue-400 ml-2">
              {date}
            </span>
          )}
        </div>
        
        {description && (
          <p className="text-sm text-blue-200 mt-1">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default TimelineItem;