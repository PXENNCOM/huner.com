// pages/student/components/JobsPreviewCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const JobsPreviewCard = ({ jobs }) => {
  // Sadece devam eden işleri filtrele ve en fazla 3 tanesini göster
  const activeJobs = jobs
    .filter(job => job.status === 'in_progress')
    .slice(0, 3);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Devam Eden İşler</h2>
      
      {activeJobs.length === 0 ? (
        <div className="text-gray-500 py-2">
          Şu anda devam eden işiniz bulunmuyor.
        </div>
      ) : (
        <div className="space-y-3">
          {activeJobs.map(job => {
            // Kalan zamanı hesapla
            const dueDate = new Date(job.dueDate);
            const now = new Date();
            const diffTime = dueDate - now;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            return (
              <div key={job.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="font-medium text-gray-800">{job.title}</h3>
                <p className="text-sm text-gray-600">
                  {job.EmployerProfile?.companyName || "İşveren"}
                </p>
                <p className="text-xs text-blue-500 mt-1">
                  {diffDays > 0 
                    ? `Teslim tarihine ${diffDays} gün kaldı` 
                    : diffDays === 0 
                      ? "Bugün teslim edilmesi gerekiyor" 
                      : `Teslim tarihi ${Math.abs(diffDays)} gün geçti`}
                </p>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="mt-4">
        <Link 
          to="/student/jobs"
          className="text-blue-500 hover:text-blue-600 text-sm font-medium"
        >
          Tüm İşleri Görüntüle &rarr;
        </Link>
      </div>
    </div>
  );
};

export default JobsPreviewCard;