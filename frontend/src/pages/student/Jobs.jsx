// pages/student/Jobs.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAssignedJobs } from '../../services/api';
import StudentLayout from './components/StudentLayout';
import JobCard from './components/JobCard';

const StudentJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await getAssignedJobs();
        setJobs(response.data);
        setFilteredJobs(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('İşler yüklenirken bir hata oluştu.');
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    // Filtre değiştiğinde işleri filtrele
    if (activeFilter === 'all') {
      setFilteredJobs(jobs);
    } else {
      setFilteredJobs(jobs.filter(job => job.status === activeFilter));
    }
  }, [activeFilter, jobs]);

  const filterOptions = [
    { id: 'all', label: 'Tümü' },
    { id: 'in_progress', label: 'Devam Eden' },
    { id: 'completed', label: 'Tamamlanan' },
    { id: 'cancelled', label: 'İptal Edilen' }
  ];

  if (loading && jobs.length === 0) {
    return (
      <StudentLayout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Atanan İşler</h1>
        <p className="text-gray-600">Size atanan işleri görüntüleyin ve yönetin.</p>
      </div>

      {/* Filtre Butonları */}
      <div className="mb-6 flex space-x-2 overflow-x-auto pb-2">
        {filterOptions.map(option => (
          <button
            key={option.id}
            onClick={() => setActiveFilter(option.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeFilter === option.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 text-red-500 rounded-md">
          {error}
        </div>
      )}

      {filteredJobs.length === 0 && !loading ? (
        <div className="bg-white p-8 text-center rounded-lg shadow">
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            {activeFilter === 'all' 
              ? 'Henüz size atanmış bir iş bulunmuyor' 
              : `${filterOptions.find(o => o.id === activeFilter).label} durumunda iş bulunmuyor`}
          </h3>
          <p className="text-gray-500">
            {activeFilter === 'all' 
              ? 'İşler size atandığında burada listelenecektir.' 
              : 'Farklı bir filtre seçerek diğer işleri görüntüleyebilirsiniz.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map(job => (
            <JobCard 
              key={job.id} 
              job={job} 
              onViewDetails={() => navigate(`/student/jobs/${job.id}`)} 
            />
          ))}
        </div>
      )}
    </StudentLayout>
  );
};

export default StudentJobs;