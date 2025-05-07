import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import { ogrenciYonetimi } from '../../services/adminApi';

const AdminStudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        
        // Öğrenci profilini getir
        const studentResponse = await ogrenciYonetimi.ogrenciDetayGetir(id);
        setStudent(studentResponse.data);
        
        // Öğrencinin projelerini getir
        const projectsResponse = await ogrenciYonetimi.ogrenciProjeleriGetir(id);
        setProjects(projectsResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Veri yüklenirken hata oluştu:', err);
        setError('Öğrenci bilgileri yüklenirken bir hata oluştu.');
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id]);


  // Öğrenci onaylama işlemi
  const handleApprove = async () => {
    try {
      await ogrenciYonetimi.ogrenciOnayla(student.User.id);
      // Sayfayı yeniden yükle
      navigate(0);
    } catch (err) {
      setError('Öğrenci onaylama sırasında bir hata oluştu.');
      console.error('Öğrenci onaylama hatası:', err);
    }
  };

  // Reddetme modalini aç
  const openRejectModal = () => {
    setShowRejectModal(true);
    setRejectionReason('');
  };

  // Öğrenci reddetme işlemi
  const handleReject = async () => {
    try {
      await ogrenciYonetimi.ogrenciReddet(student.User.id, rejectionReason);
      setShowRejectModal(false);
      // Sayfayı yeniden yükle
      navigate(0);
    } catch (err) {
      setError('Öğrenci reddetme sırasında bir hata oluştu.');
      console.error('Öğrenci reddetme hatası:', err);
    }
  };

  // Durum badge'i oluştur
  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved':
        return <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">Onaylandı</span>;
      case 'pending':
        return <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">Beklemede</span>;
      case 'rejected':
        return <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">Reddedildi</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">Bilinmiyor</span>;
    }
  };

  // Eğitim seviyesi formatını düzenle
  const formatEducationLevel = (level) => {
    if (!level) return 'Belirtilmemiş';
    
    switch(level) {
      case 'lisans': return 'Lisans';
      case 'yuksek_lisans': return 'Yüksek Lisans';
      case 'doktora': return 'Doktora';
      case 'mezun': return 'Mezun';
      default: return level;
    }
  };

  // Dil bilgisini görüntüle
  const renderLanguages = (languages) => {
    if (!languages) return <p>Belirtilmemiş</p>;
    
    try {
      const langArray = typeof languages === 'string' ? JSON.parse(languages) : languages;
      
      if (!Array.isArray(langArray) || langArray.length === 0) {
        return <p>Belirtilmemiş</p>;
      }
      
      return (
        <div className="space-y-1">
          {langArray.map((lang, index) => (
            <div key={index} className="flex items-center">
              <span className="mr-2 font-medium">{lang.lang}:</span>
              <span>{lang.level}</span>
            </div>
          ))}
        </div>
      );
    } catch (e) {
      console.error('Dil bilgisi işlenirken hata oluştu:', e);
      return <p>Biçim Hatası</p>;
    }
  };

  // Becerileri görüntüle
  const renderSkills = (skills) => {
    if (!skills) return <p>Belirtilmemiş</p>;
    
    try {
      // Önce JSON olarak parse etmeyi dene
      let skillsArray = [];
      
      try {
        skillsArray = JSON.parse(skills);
      } catch (e) {
        // JSON parse hatası, düz string olabilir
        // Virgülle ayrılmış değerleri dizi olarak böl
        skillsArray = skills.split(',').map(skill => skill.trim());
      }
      
      if (!Array.isArray(skillsArray) || skillsArray.length === 0) {
        return <p>Belirtilmemiş</p>;
      }
      
      return (
        <div className="flex flex-wrap">
          {skillsArray.map((skill, index) => (
            <span 
              key={index} 
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-2 mb-2"
            >
              {skill}
            </span>
          ))}
        </div>
      );
    } catch (e) {
      console.error('Beceriler işlenirken hata oluştu:', e);
      // Hata durumunda, metni doğrudan gösterelim
      return <p className="text-gray-600">{skills}</p>;
    }
  };

  const parseTechnologies = (technologies) => {
    if (!technologies) return [];
    
    try {
      // Önce JSON olarak parse etmeyi dene
      return JSON.parse(technologies);
    } catch (e) {
      // JSON parse hatası, düz string olabilir
      // Virgülle ayrılmış değerleri dizi olarak böl
      return technologies.split(',').map(tech => tech.trim());
    }
  };

  // renderProjects fonksiyonu - düzeltilmiş versiyon
  const renderProjects = () => {
    if (!projects || projects.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-500">Bu öğrencinin henüz bir projesi bulunmuyor.</p>
        </div>
      );
    }
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {projects.map(project => (
          <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            {/* Medya kısmı */}
            <div className="h-48 overflow-hidden bg-gray-200 flex items-center justify-center">
              {project.media && typeof project.media === 'string' && project.media.trim() !== '' ? (
                // Media varsa ve geçerli bir string ise
                <img 
                  src={(() => {
                    try {
                      const mediaArray = JSON.parse(project.media);
                      return mediaArray && mediaArray.length > 0 
                        ? `/uploads/project-media/${mediaArray[0]}` 
                        : 'https://via.placeholder.com/400x200?text=Görsel+Yok';
                    } catch (e) {
                      console.error('Media JSON parsing hatası:', e);
                      return 'https://via.placeholder.com/400x200?text=Format+Hatası';
                    }
                  })()}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x200?text=Görsel+Yok';
                  }}
                />
              ) : (
                // Media yoksa placeholder göster
                <p className="text-gray-500">Görsel Yok</p>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.title || 'İsimsiz Proje'}</h3>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                {project.description || 'Açıklama bulunmuyor'}
              </p>
              
              <div className="mb-3">
                <div className="flex flex-wrap">
                  {(() => {
                    try {
                      const techArray = parseTechnologies(project.technologies);
                      
                      return Array.isArray(techArray) && techArray.length > 0
                        ? techArray.map((tech, index) => (
                            <span key={index} className="bg-indigo-100 text-indigo-800 rounded-full px-2 py-1 text-xs mr-1 mb-1">
                              {tech}
                            </span>
                          ))
                        : <span className="text-gray-500 text-xs">Teknoloji belirtilmemiş</span>;
                    } catch (e) {
                      console.error('Technologies işlenirken hata oluştu:', e);
                      return <span className="text-gray-500 text-xs">Format hatası</span>;
                    }
                  })()}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {new Date(project.createdAt).toLocaleDateString('tr-TR')}
                </span>
                
                <div className="flex space-x-2">
                  {project.githubUrl && (
                    <a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                  )}
                  
                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Placeholder profil resmi
  const defaultProfileImage = "https://via.placeholder.com/150";

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p>{error}</p>
          </div>
          <button
            onClick={() => navigate('/admin/students')}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Öğrenci Listesine Dön
          </button>
        </div>
      </AdminLayout>
    );
  }

  if (!student) {
    return (
      <AdminLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-10">
            <p className="text-gray-500">Öğrenci bulunamadı.</p>
          </div>
          <button
            onClick={() => navigate('/admin/students')}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Öğrenci Listesine Dön
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Üst Bilgi ve Navigasyon */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <div className="flex items-center mb-2">
              <Link to="/admin/students" className="text-indigo-600 hover:text-indigo-800 mr-2">
                &larr; Öğrenci Listesine Dön
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">{student.fullName || 'İsimsiz Öğrenci'}</h1>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            {/* Öğrenci Durumu */}
            {getStatusBadge(student.User?.approvalStatus)}
            
            {/* Onaylama/Reddetme Butonları */}
            {student.User?.approvalStatus === 'pending' && (
              <>
                <button 
                  onClick={handleApprove}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Onayla
                </button>
                <button 
                  onClick={openRejectModal}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Reddet
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Sekme Menü */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex">
            <button 
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile' 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Profil Bilgileri
            </button>
            <button 
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'projects' 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('projects')}
            >
              Projeler ({projects.length})
            </button>
          </nav>
        </div>
        
        {/* Profil Bilgileri İçeriği */}
        {activeTab === 'profile' && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
            <div className="flex flex-col md:flex-row items-start">
              {/* Profil Fotoğrafı */}
              <div className="w-full md:w-1/4 mb-6 md:mb-0 flex justify-center md:justify-start">
                <div className="relative">
                  <img 
                    src={student.profileImage ? `/uploads/profile-images/${student.profileImage}` : defaultProfileImage} 
                    alt={student.fullName || "Öğrenci"} 
                    className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div className="absolute bottom-0 right-0">
                    {getStatusBadge(student.User?.approvalStatus)}
                  </div>
                </div>
              </div>
              
              {/* Profil Bilgileri */}
              <div className="w-full md:w-3/4 md:pl-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Kişisel Bilgiler */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Kişisel Bilgiler</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Ad Soyad</p>
                        <p className="font-medium">{student.fullName || 'Belirtilmemiş'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">E-posta</p>
                        <p className="font-medium">{student.User?.email || 'Belirtilmemiş'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Yaş</p>
                        <p className="font-medium">{student.age || 'Belirtilmemiş'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Şehir</p>
                        <p className="font-medium">{student.city || 'Belirtilmemiş'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Hakkında</p>
                        <p className="font-medium">{student.shortBio || 'Belirtilmemiş'}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Eğitim Bilgileri */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Eğitim Bilgileri</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Okul</p>
                        <p className="font-medium">{student.school || 'Belirtilmemiş'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Bölüm</p>
                        <p className="font-medium">{student.department || 'Belirtilmemiş'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Eğitim Seviyesi</p>
                        <p className="font-medium">{formatEducationLevel(student.educationLevel)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Sınıf</p>
                        <p className="font-medium">{student.currentGrade || 'Belirtilmemiş'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Beceriler ve Diller */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Beceriler</h2>
                    {renderSkills(student.skills)}
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Dil Bilgisi</h2>
                    {renderLanguages(student.languages)}
                  </div>
                </div>
                
                {/* LinkedIn ve GitHub */}
                <div className="mt-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Sosyal Hesaplar</h2>
                  
                  <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
                    {student.linkedinProfile ? (
                      <a 
                        href={student.linkedinProfile} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center text-blue-700"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5 mr-2" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                        LinkedIn Profili
                      </a>
                    ) : (
                      <p className="text-gray-500">LinkedIn profili belirtilmemiş</p>
                    )}
                    
                    {student.githubProfile ? (
                      <a 
                        href={student.githubProfile} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center text-gray-800"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5 mr-2" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        GitHub Profili
                      </a>
                    ) : (
                      <p className="text-gray-500">GitHub profili belirtilmemiş</p>
                    )}
                  </div>
                </div>
                
                {/* Kayıt Tarihi */}
                <div className="mt-8">
                  <p className="text-sm text-gray-500">
                    Kayıt Tarihi: {new Date(student.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                  {student.User?.approvalStatus === 'rejected' && student.User?.rejectionReason && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm font-medium text-red-800">Reddedilme Nedeni:</p>
                      <p className="text-sm text-red-700 mt-1">{student.User.rejectionReason}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Projeler İçeriği */}
        {activeTab === 'projects' && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Portfolyo Projeleri</h2>
            </div>
            
            {renderProjects()}
          </div>
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

export default AdminStudentDetail;