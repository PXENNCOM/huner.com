import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { ogrenciYonetimi } from '../../services/adminApi';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

useEffect(() => {
  console.log('🔄 useEffect çalıştı - AdminStudents mount oldu');
  fetchStudents();
}, []);

const fetchStudents = async () => {
  try {
    setLoading(true);
    const response = await ogrenciYonetimi.tumOgrencileriGetir();
    
    console.log('========== DEBUG START ==========');
    console.log('📊 Raw API Response:', response.data);
    console.log('📈 Total records:', response.data.length);
    console.log('🔑 Unique IDs:', new Set(response.data.map(s => s.id)).size);
    console.log('📋 All IDs:', response.data.map(s => ({ id: s.id, name: s.fullName })));
    console.log('========== DEBUG END ==========');
    
    setStudents(response.data);
    setLoading(false);
  } catch (err) {
    setError('Öğrenci bilgileri alınırken bir hata oluştu.');
    setLoading(false);
    console.error('Öğrenci listeleme hatası:', err);
  }
};

  // Arama ve filtreleme işlemleri
  const filteredStudents = students.filter(student => {
    // Arama terimiyle eşleşme kontrolü
    const matchesSearch = 
      (student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      student.User?.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      student.school?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      false);
    
    // Durum filtresi kontrolü
    const matchesFilter = 
      filterStatus === 'all' || 
      (filterStatus === 'approved' && student.User?.approvalStatus === 'approved') ||
      (filterStatus === 'pending' && student.User?.approvalStatus === 'pending') ||
      (filterStatus === 'rejected' && student.User?.approvalStatus === 'rejected');
    
    return matchesSearch && matchesFilter;
  });

const handleApprove = async (userId) => {
    try {
      console.log('Onaylama işlemi başlatıldı, User ID:', userId);
      const response = await ogrenciYonetimi.ogrenciOnayla(userId);
      console.log('Onaylama response:', response);
      fetchStudents(); // Listeyi yenile
      setError(null); // Önceki hataları temizle
    } catch (err) {
      console.error('Öğrenci onaylama hatası:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      setError('Öğrenci onaylanırken bir hata oluştu: ' + (err.response?.data?.message || err.message));
    }
  };

  // Öğrenci reddetme işlemi
  const handleReject = async () => {
    try {
      console.log('Reddetme işlemi başlatıldı, User ID:', selectedStudentId, 'Sebep:', rejectionReason);
      const response = await ogrenciYonetimi.ogrenciReddet(selectedStudentId, rejectionReason);
      console.log('Reddetme response:', response);
      setShowRejectModal(false);
      fetchStudents(); // Listeyi yenile
      setError(null); // Önceki hataları temizle
    } catch (err) {
      console.error('Öğrenci reddetme hatası:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      setError('Öğrenci reddedilirken bir hata oluştu: ' + (err.response?.data?.message || err.message));
    }
  };

  // Öğrenci reddetme modali açma
  const openRejectModal = (userId) => {
    setSelectedStudentId(userId);
    setRejectionReason('');
    setShowRejectModal(true);
  };


  // Status badge renk ve metin ayarları
  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved':
        return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Onaylandı</span>;
      case 'pending':
        return <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Beklemede</span>;
      case 'rejected':
        return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Reddedildi</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">Bilinmiyor</span>;
    }
  };

  // Placeholder profil resmi URL'si
  const defaultProfileImage = "https://via.placeholder.com/50";

  return (
    <AdminLayout>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Öğrenci Yönetimi</h1>
          <div className="flex space-x-4">
            {/* Arama kutusu */}
            <div className="relative">
              <input
                type="text"
                placeholder="İsim, email veya okul ara..."
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 absolute right-3 top-3 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
            
            {/* Durum filtresi */}
            <select
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tüm Öğrenciler</option>
              <option value="approved">Onaylanmış</option>
              <option value="pending">Onay Bekleyen</option>
              <option value="rejected">Reddedilmiş</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profil</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-Posta</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Okul</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img 
                                className="h-10 w-10 rounded-full object-cover" 
                                src={student.profileImage ? `/uploads/profile-images/${student.profileImage}` : defaultProfileImage} 
                                alt={student.fullName || "Öğrenci"} 
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{student.fullName || "İsim Belirtilmemiş"}</div>
                              <div className="text-sm text-gray-500">{student.department || "Bölüm Belirtilmemiş"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{student.User?.email || "E-posta Yok"}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(student.createdAt).toLocaleDateString('tr-TR')} tarihinde kaydoldu
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{student.school || "Okul Belirtilmemiş"}</div>
                          <div className="text-xs text-gray-500">
                            {student.educationLevel ? (
                              student.educationLevel === 'lisans' ? 'Lisans' :
                              student.educationLevel === 'yuksek_lisans' ? 'Yüksek Lisans' :
                              student.educationLevel === 'doktora' ? 'Doktora' : 
                              student.educationLevel === 'mezun' ? 'Mezun' : 'Belirtilmemiş'
                            ) : 'Belirtilmemiş'}
                            {student.currentGrade ? ` - ${student.currentGrade}` : ''}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(student.User?.approvalStatus)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link 
                            to={`/admin/students/${student.id}`} 
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Detay
                          </Link>
                          {student.User?.approvalStatus === 'pending' && (
                            <>
                              <button 
                                className="text-green-600 hover:text-green-900 mr-4"
                                onClick={() => handleApprove(student.User.id)}
                              >
                                Onayla
                              </button>
                              <button 
                                className="text-red-600 hover:text-red-900"
                                onClick={() => openRejectModal(student.User.id)}
                              >
                                Reddet
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        Kriterlere uygun öğrenci bulunamadı.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-gray-600 text-sm">
              Toplam {filteredStudents.length} öğrenci listeleniyor.
            </div>
          </>
        )}
      </div>

      {/* Reddetme Nedeni Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow max-w-md mx-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-gray-900">Reddetme Nedeni</h3>
              <button
                onClick={() => setShowRejectModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-2">
              <textarea
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-indigo-500"
                rows="4"
                placeholder="Reddetme nedenini girin..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              ></textarea>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg mr-2 hover:bg-gray-400"
              >
                İptal
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Reddet
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminStudents;