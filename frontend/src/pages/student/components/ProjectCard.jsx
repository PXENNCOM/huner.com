// pages/student/components/ProjectCard.jsx
import React from 'react';

const ProjectCard = ({ project, onEdit, onDelete }) => {
  // Proje türüne göre etiket rengi
  const typeColors = {
    personal: 'bg-green-100 text-green-800',
    school: 'bg-blue-100 text-blue-800',
    huner: 'bg-purple-100 text-purple-800',
    other: 'bg-gray-100 text-gray-800'
  };
  
  // Proje türü Türkçe karşılıkları
  const typeLabels = {
    personal: 'Kişisel',
    school: 'Okul',
    huner: 'Hüner',
    other: 'Diğer'
  };
  
  // İlk medyayı önizleme olarak kullan
  let previewImage = null;
  
  // project.media Portfolio.jsx'te zaten parse edildi ve tam URL'lere dönüştürüldü
  if (project.media && Array.isArray(project.media) && project.media.length > 0) {
    previewImage = project.media[0]; // Artık tam URL olarak geliyor
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="relative aspect-video bg-gray-100">
        {previewImage ? (
          <img 
            src={previewImage} 
            alt={project.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        <div className="absolute top-2 right-2">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${typeColors[project.projectType] || typeColors.other}`}>
            {typeLabels[project.projectType] || 'Diğer'}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
          {project.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
        {project.description}
        </p>
        
        <div className="mb-3">
          {project.technologies?.split(',').slice(0, 3).map((tech, index) => (
            <span key={index} className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mr-1 mb-1">
              {tech.trim()}
            </span>
          ))}
          {project.technologies?.split(',').length > 3 && (
            <span className="inline-block text-xs text-gray-500">
              +{project.technologies.split(',').length - 3} daha
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-x-2">
            {project.githubUrl && (
              <a 
                href={project.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-5 h-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            )}
            
            {project.liveUrl && (
              <a 
                href={project.liveUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-5 h-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
          
          <div className="space-x-2">
            <button
              onClick={onEdit}
              className="text-blue-500 hover:text-blue-700"
              title="Düzenle"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            
            <button
              onClick={onDelete}
              className="text-red-500 hover:text-red-700"
              title="Sil"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;