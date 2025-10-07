// pages/student/components/ConfirmDialog.jsx
import React from 'react';

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmText = "Onayla",
  cancelText = "İptal",
  onConfirm,
  onCancel,
  confirmButtonClass = "bg-red-600 hover:bg-red-700 text-white",
  cancelButtonClass = "bg-blue-600 hover:bg-blue-700 text-white"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      ></div>
      
      {/* Dialog */}
      <div className="relative bg-blue-900/95 backdrop-blur-xl rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-blue-800/50">
        {/* Header */}
        <div className="px-6 py-4 border-b border-blue-800/50">
          <h3 className="text-lg font-semibold text-white">
            {title}
          </h3>
        </div>
        
        {/* Content */}
        <div className="px-6 py-4">
          <p className="text-blue-200 leading-relaxed">
            {message}
          </p>
        </div>
        
        {/* Actions */}
        <div className="px-6 py-4 bg-blue-800/30 border-t border-blue-800/50 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${cancelButtonClass}`}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;