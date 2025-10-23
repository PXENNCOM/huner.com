// pages/student/components/ProjectIdeas/ProjectIdeaCard.jsx
import React from 'react';
import { MdAccessTime, MdArrowForward, MdCode } from 'react-icons/md';

const ProjectIdeaCard = ({ project, onViewDetails, compact = false }) => {
  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Kolay': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Orta': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Zor': 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[difficulty] || 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Web Development': '🌐',
      'Mobile Development': '📱',
      'Artificial Intelligence': '🤖',
      'Game Development': '🎮',
      'Data Science': '📊',
      'Cybersecurity': '🔐',
      'Cloud & DevOps': '☁️',
      'System Design': '🏗️'
    };
    return icons[category] || '💻';
  };

  if (compact) {
    return (
      <div 
        className="bg-blue-800/30 backdrop-blur-xl rounded-xl p-4 border border-blue-700/30 hover:border-blue-600/50 cursor-pointer transition-all duration-200 hover:bg-blue-700/40"
        onClick={onViewDetails}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-white font-medium text-sm mb-1 line-clamp-2">
              {project.title}
            </h3>
            <div className="flex items-center text-blue-300 text-xs mb-2">
              <span className="mr-1">{getCategoryIcon(project.category)}</span>
              <span className="line-clamp-1">{project.category}</span>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(project.difficulty)}`}>
            {project.difficulty}
          </div>
        </div>

        {/* Project Image or Placeholder */}
        <div className="mb-3">
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-20 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-20 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg flex items-center justify-center border border-blue-600/30">
              <span className="text-2xl">💡</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-blue-200 text-xs mb-3 line-clamp-2">
          {project.shortDescription || project.description}
        </p>

        {/* Technologies */}
        {project.technologiesArray && project.technologiesArray.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {project.technologiesArray.slice(0, 2).map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-full border border-blue-600/30"
              >
                {tech}
              </span>
            ))}
            {project.technologiesArray.length > 2 && (
              <span className="px-2 py-1 bg-blue-700/30 text-blue-300 text-xs rounded-full border border-blue-600/30">
                +{project.technologiesArray.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-blue-300">
          <div className="flex items-center">
            <MdAccessTime className="w-3 h-3 mr-1" />
            <span>{project.estimatedDays} gün</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            className="text-yellow-300 hover:text-yellow-200 font-medium flex items-center group"
          >
            Detay
            <MdArrowForward className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  // Normal (non-compact) view
  return (
    <div 
      className="bg-blue-800/30 backdrop-blur-xl rounded-lg shadow-lg overflow-hidden border-l-4 border-yellow-500 cursor-pointer hover:shadow-xl transition-shadow duration-300 border border-blue-700/30"
      onClick={onViewDetails}
    >
      {/* Project Image */}
      {project.image && (
        <div className="h-48 bg-blue-700/30 rounded-t-lg overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6 overflow-hidden">
        {/* Category and Difficulty */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-blue-200 flex items-center">
            <span className="mr-1">{getCategoryIcon(project.category)}</span>
            {project.category}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(project.difficulty)}`}>
            {project.difficulty}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
          {project.title}
        </h3>

        {/* Description */}
        <div className="mb-4 overflow-hidden">
    <p className="text-blue-200 text-sm line-clamp-3 overflow-hidden break-words">
      {project.shortDescription || project.description}
    </p>
  </div>

        {/* Duration */}
        <div className="flex items-center text-sm text-blue-300 mb-4">
          <MdAccessTime className="w-4 h-4 mr-1" />
          <span>{project.estimatedDays} gün</span>
        </div>

        {/* Technologies */}
        {project.technologiesArray && project.technologiesArray.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {project.technologiesArray.slice(0, 3).map((tech, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-full border border-blue-600/30"
                >
                  {tech}
                </span>
              ))}
              {project.technologiesArray.length > 3 && (
                <span className="px-2 py-1 bg-blue-700/30 text-blue-300 text-xs rounded-full border border-blue-600/30">
                  +{project.technologiesArray.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            className="inline-flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
          >
            <MdCode className="w-4 h-4 mr-2" />
            Detayları Görüntüle
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectIdeaCard;