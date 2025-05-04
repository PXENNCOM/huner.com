// pages/student/components/PortfolioPreviewCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const PortfolioPreviewCard = ({ projects }) => {
  // Son eklenen en fazla 3 projeyi göster
  const recentProjects = projects
    ? projects.slice(0, 3)
    : [];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Son Projeler</h2>
      
      {recentProjects.length === 0 ? (
        <div className="text-gray-500 py-2">
          Henüz portfolyonuza proje eklenmemiş.
        </div>
      ) : (
        <div className="space-y-3">
          {recentProjects.map(project => (
            <div key={project.id} className="border-l-4 border-purple-500 pl-4 py-2">
              <h3 className="font-medium text-gray-800 truncate">{project.title}</h3>
              <p className="text-sm text-gray-600 truncate">
                {project.technologies}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(project.createdAt).toLocaleDateString('tr-TR')}
              </p>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4">
        <Link 
          to="/student/portfolio"
          className="text-purple-500 hover:text-purple-600 text-sm font-medium"
        >
          Tüm Projeleri Görüntüle &rarr;
        </Link>
      </div>
    </div>
  );
};

export default PortfolioPreviewCard;