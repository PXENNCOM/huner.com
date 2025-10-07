import React from 'react';
import { MdEdit, MdDelete, MdBusiness, MdDateRange, MdWork, MdAccessTime } from 'react-icons/md';

const WorkExperienceView = ({ experiences, onEdit, onDelete }) => {
  
  const getWorkTypeColor = (workType) => {
    const colors = {
      'internship': 'bg-green-500/20 text-green-300 border-green-500/30',
      'part-time': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'full-time': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'freelance': 'bg-orange-500/20 text-orange-300 border-orange-500/30'
    };
    return colors[workType] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  if (experiences.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <MdWork className="w-8 h-8 text-blue-400" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">
          Henüz iş deneyimi eklenmemiş
        </h3>
        <p className="text-blue-200 mb-6">
          İlk iş deneyiminizi ekleyerek başlayın
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-white">İş Deneyimlerim</h3>
          <p className="text-blue-200 text-sm md:text-base">Toplam {experiences.length} deneyim</p>
        </div>
      </div>

      <div className="grid gap-4">
        {experiences.map((experience) => (
          <div
            key={experience.id}
            className="bg-blue-800/30 border border-blue-700/50 rounded-xl p-4 md:p-6 hover:bg-blue-800/40 transition-all duration-200"
          >
            {/* Header - Company and Actions */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-600/50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MdBusiness className="w-5 h-5 text-blue-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-lg font-semibold text-white truncate">
                      {experience.companyName}
                    </h4>
                    <p className="text-blue-200 font-medium">
                      {experience.position}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => onEdit(experience.id)}
                  className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-700/50 rounded-lg transition-colors"
                  title="Düzenle"
                >
                  <MdEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(experience)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors"
                  title="Sil"
                >
                  <MdDelete className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Work Type and Duration */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getWorkTypeColor(experience.workType)}`}>
                {experience.workTypeLabel}
              </span>
              
              <div className="flex items-center text-blue-300 text-sm">
                <MdDateRange className="w-4 h-4 mr-1" />
                <span>
                  {experience.formattedStartDate} - {experience.formattedEndDate}
                </span>
              </div>
              
              {experience.duration && (
                <div className="flex items-center text-blue-400 text-sm">
                  <MdAccessTime className="w-4 h-4 mr-1" />
                  <span>{experience.duration}</span>
                </div>
              )}
              
              {experience.isCurrent && (
                <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-medium border border-green-500/30">
                  Mevcut
                </span>
              )}
            </div>

            {/* Description */}
            {experience.description && (
              <div className="mt-4">
                <p className="text-blue-100 text-sm md:text-base leading-relaxed">
                  {experience.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>    
    </div>
  );
};

export default WorkExperienceView;