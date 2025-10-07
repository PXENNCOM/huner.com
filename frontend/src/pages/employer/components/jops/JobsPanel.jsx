// pages/employer/components/Jobs/JobsPanel.jsx
import React, { useState, useEffect } from 'react';
import { getEmployerJobs } from '../../../../services/employerApi';
import JobCard from './JobCard';
import JobDetailModal from './JobDetailModal';
import CreateJobModal from './CreateJobModal';
import { MdClose, MdWork, MdSearch, MdAdd, MdFilterList } from 'react-icons/md';

const JobsPanel = ({ isOpen, onClose }) => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isJobDetailOpen, setIsJobDetailOpen] = useState(false);
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchJobs();
    }
  }, [isOpen]);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm, statusFilter]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getEmployerJobs();
      setJobs(response.data);
      setFilteredJobs(response.data);
    } catch (err) {
      console.error('İş ilanları yüklenirken hata:', err);
      setError('İş ilanları yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = [...jobs];
    
    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Durum filtresi
    if (statusFilter !== 'all') {
      filtered = filtered.filter(job => job.status === statusFilter);
    }
    
    setFilteredJobs(filtered);
  };

  const handleJobClick = (jobId) => {
    setSelectedJobId(jobId);
    setIsJobDetailOpen(true);
  };

  const handleCloseJobDetail = () => {
    setIsJobDetailOpen(false);
    setSelectedJobId(null);
  };

  const handleCreateJobSuccess = () => {
    setIsCreateJobOpen(false);
    fetchJobs(); // Listeyi yenile
  };

  const statusOptions = [
    { id: 'all', label: 'Tümü', count: jobs.length },
    { id: 'pending', label: 'Onay Bekleyen', count: jobs.filter(j => j.status === 'pending').length },
    { id: 'approved', label: 'Onaylanan', count: jobs.filter(j => j.status === 'approved').length },
    { id: 'assigned', label: 'Atanan', count: jobs.filter(j => j.status === 'assigned').length },
    { id: 'in_progress', label: 'Devam Eden', count: jobs.filter(j => j.status === 'in_progress').length },
    { id: 'completed', label: 'Tamamlanan', count: jobs.filter(j => j.status === 'completed').length },
    { id: 'cancelled', label: 'İptal Edilen', count: jobs.filter(j => j.status === 'cancelled').length }
  ];

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
        <div className="absolute right-0 top-0 h-full w-full max-w-md bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-blue-700/50 bg-blue-800/50 backdrop-blur-xl">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <MdWork className="w-5 h-5 text-blue-300" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">İş İlanları</h2>
                <p className="text-sm text-blue-200">İlanlarınızı yönetin</p>
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
            {/* Create Job Button */}
            <div className="p-4 border-b border-blue-700/30">
              <button
                onClick={() => setIsCreateJobOpen(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <MdAdd className="w-5 h-5 mr-2" />
                Yeni İlan Oluştur
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-blue-700/30">
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                <input
                  type="text"
                  placeholder="İlan ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-blue-700/30 border border-blue-600/50 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                />
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="p-4 border-b border-blue-700/30">
              <div className="flex items-center space-x-2 mb-3">
                <MdFilterList className="w-4 h-4 text-blue-300" />
                <span className="text-sm text-blue-200">Duruma göre filtrele</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {statusOptions.slice(0, 6).map(option => (
                  <button
                    key={option.id}
                    onClick={() => setStatusFilter(option.id)}
                    className={`p-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                      statusFilter === option.id
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-blue-700/50 text-blue-200 hover:bg-blue-600/50 hover:text-white'
                    }`}
                  >
                    <div className="text-center">
                      <div>{option.label}</div>
                      {option.count > 0 && (
                        <div className={`text-xs ${
                          statusFilter === option.id
                            ? 'text-blue-100'
                            : 'text-blue-300'
                        }`}>
                          {option.count}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="p-4 m-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredJobs.length === 0 && (
              <div className="p-8 text-center">
                <div className="p-4 bg-blue-700/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <MdWork className="w-8 h-8 text-blue-300" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  {statusFilter === 'all' 
                    ? 'Henüz iş ilanı yok'
                    : `${statusOptions.find(o => o.id === statusFilter)?.label} ilan yok`
                  }
                </h3>
                <p className="text-blue-200 text-sm mb-4">
                  {statusFilter === 'all'
                    ? 'İlk iş ilanınızı oluşturun'
                    : 'Farklı filtreler deneyebilirsiniz'}
                </p>
                {statusFilter === 'all' && (
                  <button
                    onClick={() => setIsCreateJobOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    İlk İlanınızı Oluşturun
                  </button>
                )}
              </div>
            )}

            {/* Jobs List */}
            {!loading && filteredJobs.length > 0 && (
              <div className="p-4 space-y-3">
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

            {/* Quick Stats */}
            {!loading && jobs.length > 0 && (
              <div className="p-4 border-t border-blue-700/30">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-blue-700/30 rounded-lg p-3">
                    <div className="text-lg font-bold text-yellow-400">
                      {jobs.filter(j => j.status === 'pending').length}
                    </div>
                    <div className="text-xs text-blue-200">Onay Bekliyor</div>
                  </div>
                  <div className="bg-blue-700/30 rounded-lg p-3">
                    <div className="text-lg font-bold text-green-400">
                      {jobs.filter(j => j.status === 'completed').length}
                    </div>
                    <div className="text-xs text-blue-200">Tamamlandı</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Detail Modal */}
      <JobDetailModal 
        isOpen={isJobDetailOpen}
        onClose={handleCloseJobDetail}
        jobId={selectedJobId}
      />

      {/* Create Job Modal */}
      <CreateJobModal 
        isOpen={isCreateJobOpen}
        onClose={() => setIsCreateJobOpen(false)}
        onSuccess={handleCreateJobSuccess}
      />
    </>
  );
};

export default JobsPanel;