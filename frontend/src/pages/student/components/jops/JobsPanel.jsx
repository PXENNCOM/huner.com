// pages/student/components/Jobs/JobsPanel.jsx
import React, { useState, useEffect } from 'react';
import { getAssignedJobs } from '../../../../services/api';
import JobCard from './JobCard';
import JobDetailPanel from './JobDetailPanel';
import { MdClose, MdWork, MdSearch } from 'react-icons/md';

const JobsPanel = ({ isOpen, onClose }) => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Job detail panel state
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isJobDetailOpen, setIsJobDetailOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchJobs();
    }
  }, [isOpen]);

  useEffect(() => {
    // Filtre ve arama terimini uygula
    let filtered = jobs;
    
    if (activeFilter !== 'all') {
      filtered = filtered.filter(job => job.status === activeFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.EmployerProfile?.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredJobs(filtered);
  }, [activeFilter, jobs, searchTerm]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching assigned jobs...');
      const response = await getAssignedJobs();
      console.log('Jobs response:', response);
      console.log('Response structure:', {
        hasData: !!response.data,
        dataKeys: response.data ? Object.keys(response.data) : [],
        responseKeys: Object.keys(response)
      });
      
      // Backend'den success: true, data: [...] formatında geliyor
      const jobsData = response.data?.data || response.data || response;
      console.log('Parsed jobs data:', jobsData);
      console.log('Is array:', Array.isArray(jobsData));
      
      setJobs(Array.isArray(jobsData) ? jobsData : []);
      setFilteredJobs(Array.isArray(jobsData) ? jobsData : []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      console.error('Error details:', err.response?.data);
      setError('İşler yüklenirken bir hata oluştu: ' + (err.response?.data?.message || err.message));
      setJobs([]);
      setFilteredJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const filterOptions = [
    { id: 'all', label: 'All', count: jobs.length },
    { id: 'assigned', label: 'Appointed', count: jobs.filter(j => j.status === 'assigned').length },
    { id: 'in_progress', label: 'Continuing', count: jobs.filter(j => j.status === 'in_progress').length },
    { id: 'completed', label: 'Completed', count: jobs.filter(j => j.status === 'completed').length },
    { id: 'cancelled', label: 'Cancelled', count: jobs.filter(j => j.status === 'cancelled').length }
  ];

  const handleJobClick = (jobId) => {
    console.log('Opening job detail for:', jobId);
    setSelectedJobId(jobId);
    setIsJobDetailOpen(true);
  };

  const handleJobDetailClose = () => {
    setIsJobDetailOpen(false);
    setSelectedJobId(null);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Panel */}
        <div className="absolute right-0 top-0 h-full w-full max-w-md bg-blue-900/95 backdrop-blur-xl shadow-2xl border-l border-blue-800/50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-blue-800/50 bg-blue-800/30">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600/30 rounded-lg border border-blue-600/50">
                <MdWork className="w-5 h-5 text-blue-300" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">My Works</h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-blue-200 hover:text-white hover:bg-blue-700/50 rounded-lg transition-all duration-200"
            >
              <MdClose className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="h-full overflow-y-auto pb-20">
            {/* Search Bar */}
            <div className="p-4 border-b border-blue-700/30">
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                <input
                  type="text"
                  placeholder="İş ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-blue-900/40 border border-blue-600/50 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="p-4 border-b border-blue-700/30">
              <div className="flex flex-wrap gap-2">
                {filterOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => setActiveFilter(option.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      activeFilter === option.id
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-blue-800/30 text-blue-200 hover:bg-blue-700/40 hover:text-white border border-blue-700/50'
                    }`}
                  >
                    {option.label}
                    {option.count > 0 && (
                      <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                        activeFilter === option.id
                          ? 'bg-blue-400 text-blue-900'
                          : 'bg-blue-700/40 text-blue-200'
                      }`}>
                        {option.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="p-4 m-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                <div className="font-medium mb-2">Error:</div>
                <div>{error}</div>
                <button
                  onClick={fetchJobs}
                  className="mt-3 px-3 py-1 bg-red-500/30 hover:bg-red-500/50 rounded text-xs transition-colors"
                >
                 Try Again
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredJobs.length === 0 && (
              <div className="p-8 text-center">
                <div className="p-4 bg-blue-800/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center border border-blue-700/30">
                  <MdWork className="w-8 h-8 text-blue-300" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  {activeFilter === 'all'
                    ? 'no job yet'
                    : `${filterOptions.find(o => o.id === activeFilter)?.label} iş yok`}
                </h3>
                <p className="text-blue-300 text-sm">
                  {activeFilter === 'all'
                    ? 'Jobs assigned to you will appear here'
                    : 'You can try different filters'}
                </p>
              </div>
            )}

            {/* Jobs List */}
            {!loading && !error && filteredJobs.length > 0 && (
              <div className="p-4 space-y-3">
                <div className="text-sm text-blue-300 mb-3">
                  {filteredJobs.length} job found
                </div>
                {filteredJobs.map(job => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    onViewDetails={() => handleJobClick(job.id)}
                    compact={true}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Detail Panel */}
      <JobDetailPanel
        isOpen={isJobDetailOpen}
        onClose={handleJobDetailClose}
        jobId={selectedJobId}
      />
    </>
  );
};

export default JobsPanel;