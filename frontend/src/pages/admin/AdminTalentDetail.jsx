// pages/admin/AdminTalentDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import adminApi from '../../services/adminApi';

const AdminTalentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [yetenek, setYetenek] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState(null);
  const [aktifSekme, setAktifSekme] = useState('genel'); // 'genel', 'projeler', 'deneyim'

  useEffect(() => {
    yetenekDetayGetir();
  }, [id]);

  const yetenekDetayGetir = async () => {
    try {
      setYukleniyor(true);
      const response = await adminApi.talentArama.yetenekDetayiGetir(id);
      
      if (response.data.success) {
        setYetenek(response.data.data);
      }
    } catch (err) {
      console.error('Yetenek detay hatası:', err);
      setHata('Yetenek bilgileri yüklenirken hata oluştu');
    } finally {
      setYukleniyor(false);
    }
  };

  if (yukleniyor) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (hata || !yetenek) {
    return (
      <AdminLayout>
        <div className="bg-red-50 p-4 rounded-md text-red-500">
          {hata || 'Yetenek bulunamadı'}
        </div>
      </AdminLayout>
    );
  }

  const skorRengi = (skor) => {
    if (skor >= 80) return 'text-green-600';
    if (skor >= 60) return 'text-blue-600';
    if (skor >= 40) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const ProfilTamamlanmaCircle = ({ percentage }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width="100" height="100" className="transform -rotate-90">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#3b82f6"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500"
          />
        </svg>
        <span className="absolute text-lg font-bold">{percentage}%</span>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div>
        {/* Geri Butonu */}
        <button
          onClick={() => navigate('/admin/talent-search')}
          className="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← Aramaya Dön
        </button>

        {/* Başlık ve Genel Bilgiler */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              {yetenek.profileImage ? (
                <img
                  src={yetenek.profileImage}
                  alt={yetenek.fullName}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl">
                  👤
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{yetenek.fullName}</h1>
                <p className="text-gray-600">{yetenek.email}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span>📍 {yetenek.city}</span>
                  <span>👤 {yetenek.age} yaş</span>
                  {yetenek.totalExperienceMonths > 0 && (
                    <span>💼 {Math.round(yetenek.totalExperienceMonths / 12)} yıl deneyim</span>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right">
              <ProfilTamamlanmaCircle percentage={yetenek.profileCompleteness || 0} />
              <p className="text-xs text-gray-500 mt-2">Profil Tamlığı</p>
            </div>
          </div>

          {/* Bio */}
          {yetenek.shortBio && (
            <div className="mb-4">
              <p className="text-gray-700">{yetenek.shortBio}</p>
            </div>
          )}

          {/* Sosyal Linkler */}
          <div className="flex gap-4">
            {yetenek.githubProfile && (
              <a
                href={yetenek.githubProfile}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 text-sm flex items-center gap-2"
              >
                🔗 GitHub
              </a>
            )}
            {yetenek.linkedinProfile && (
              <a
                href={yetenek.linkedinProfile}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm flex items-center gap-2"
              >
                🔗 LinkedIn
              </a>
            )}
          </div>
        </div>

        {/* Eğitim ve Yetenekler */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Eğitim Bilgileri */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">🎓 Eğitim Bilgileri</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Okul:</span>
                <span className="font-medium">{yetenek.school || 'Belirtilmemiş'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bölüm:</span>
                <span className="font-medium">{yetenek.department || 'Belirtilmemiş'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Seviye:</span>
                <span className="font-medium">
                  {yetenek.educationLevel === 'university' ? 'Üniversite' :
                   yetenek.educationLevel === 'high_school' ? 'Lise' :
                   yetenek.educationLevel === 'masters' ? 'Yüksek Lisans' :
                   yetenek.educationLevel === 'doctorate' ? 'Doktora' :
                   'Belirtilmemiş'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sınıf:</span>
                <span className="font-medium">{yetenek.currentGrade || 'Belirtilmemiş'}</span>
              </div>
            </div>
          </div>

          {/* Diller */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">🌍 Diller</h2>
            {yetenek.languages ? (
              <div className="flex flex-wrap gap-2">
                {yetenek.languages.split(',').map((lang, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {lang.trim()}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Belirtilmemiş</p>
            )}
          </div>
        </div>

        {/* Yetenekler */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">💡 Yetenekler</h2>
          {yetenek.skills ? (
            <div className="flex flex-wrap gap-2">
              {yetenek.skills.split(',').map((skill, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-800 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Belirtilmemiş</p>
          )}
        </div>

        {/* Sekmeler */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Sekme Başlıkları */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setAktifSekme('projeler')}
                className={`px-6 py-3 text-sm font-medium ${
                  aktifSekme === 'projeler'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                💻 Projeler ({yetenek.Projects?.length || 0})
              </button>
              <button
                onClick={() => setAktifSekme('deneyim')}
                className={`px-6 py-3 text-sm font-medium ${
                  aktifSekme === 'deneyim'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                💼 İş Deneyimi ({yetenek.WorkExperiences?.length || 0})
              </button>
            </nav>
          </div>

          {/* Sekme İçerikleri */}
          <div className="p-6">
            {/* Projeler Sekmesi */}
            {aktifSekme === 'projeler' && (
              <div>
                 {yetenek.Projects && yetenek.Projects.length > 0 ? (  
                  <div className="space-y-4">
                    {yetenek.Projects.map((proje, index) => (  // ← Projects
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">{proje.title}</h3>
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                            {proje.projectType === 'personal' ? 'Kişisel' :
                             proje.projectType === 'academic' ? 'Akademik' :
                             proje.projectType === 'professional' ? 'Profesyonel' : 'Diğer'}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 text-sm mb-3">{proje.description}</p>
                        
                        {proje.technologies && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {proje.technologies.split(',').map((tech, idx) => (
                              <span
                                key={idx}
                                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                              >
                                {tech.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex gap-3 text-sm">
                          {proje.githubUrl && (
                            <a
                              href={proje.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              🔗 GitHub
                            </a>
                          )}
                          {proje.liveUrl && (
                            <a
                              href={proje.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-800"
                            >
                              🌐 Canlı Demo
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Henüz proje eklenmemiş</p>
                  </div>
                )}
              </div>
            )}

            {/* İş Deneyimi Sekmesi */}
            {aktifSekme === 'deneyim' && (
              <div>
                {yetenek.WorkExperiences && yetenek.WorkExperiences.length > 0 ? (
                  <div className="space-y-4">
                    {yetenek.WorkExperiences.map((deneyim, index) => {
                      const startDate = new Date(deneyim.startDate);
                      const endDate = deneyim.isCurrent ? new Date() : new Date(deneyim.endDate);
                      const months = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24 * 30));
                      
                      return (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{deneyim.position}</h3>
                              <p className="text-gray-600">{deneyim.companyName}</p>
                            </div>
                            {deneyim.isCurrent && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                Devam Ediyor
                              </span>
                            )}
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-2">
                            {startDate.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' })} - 
                            {deneyim.isCurrent ? ' Devam Ediyor' : endDate.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' })}
                            {' • '}
                            {months < 12 ? `${months} ay` : `${Math.floor(months / 12)} yıl ${months % 12} ay`}
                          </div>
                          
                          {deneyim.description && (
                            <p className="text-gray-700 text-sm">{deneyim.description}</p>
                          )}
                          
                          <div className="mt-2">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              {deneyim.workType === 'full-time' ? 'Tam Zamanlı' :
                               deneyim.workType === 'part-time' ? 'Yarı Zamanlı' :
                               deneyim.workType === 'internship' ? 'Staj' :
                               deneyim.workType === 'freelance' ? 'Freelance' : 'Diğer'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Henüz iş deneyimi eklenmemiş</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTalentDetail;