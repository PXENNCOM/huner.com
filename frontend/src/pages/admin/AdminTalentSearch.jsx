// pages/admin/AdminTalentSearch.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import adminApi from '../../services/adminApi';

const AdminTalentSearch = () => {
  const navigate = useNavigate();
  
  // Filtreler
  const [filtreler, setFiltreler] = useState({
    skills: [],
    city: '',
    educationLevel: '',
    department: '',
    languages: [],
    position: '',
    seniority: 'junior',
    workType: '',
    minExperienceMonths: '',
    hasGithub: false,
    hasLinkedin: false,
    minProjectCount: '',
    minAge: '',
    maxAge: '',
    minScore: 0,
    sortBy: 'relevance',
    page: 1,
    limit: 20
  });

  // State
  const [sonuclar, setSonuclar] = useState([]);
  const [istatistikler, setIstatistikler] = useState(null);
  const [sayfalama, setSayfalama] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [filtreSecenekleri, setFiltreSecenekleri] = useState(null);
  const [gelismisFiltre, setGelismisFiltre] = useState(false);
  
  // Skill input için geçici state
  const [skillInput, setSkillInput] = useState('');
  const [languageInput, setLanguageInput] = useState('');

  // Sayfa yüklendiğinde filtre seçeneklerini getir
  useEffect(() => {
    filtreSecenekleriGetir();
  }, []);

  const filtreSecenekleriGetir = async () => {
    try {
      const response = await adminApi.talentArama.filtreSecenekleriGetir();
      setFiltreSecenekleri(response.data);
    } catch (err) {
      console.error('Filtre seçenekleri getirme hatası:', err);
    }
  };

  const aramaYap = async () => {
    try {
      setYukleniyor(true);
      const response = await adminApi.talentArama.yetenekAra(filtreler);
      
      if (response.data.success) {
        setSonuclar(response.data.data.talents);
        setIstatistikler(response.data.data.stats);
        setSayfalama(response.data.data.pagination);
      }
    } catch (err) {
      console.error('Arama hatası:', err);
      alert('Arama yapılırken hata oluştu');
    } finally {
      setYukleniyor(false);
    }
  };

  const filtreTemizle = () => {
    setFiltreler({
      skills: [],
      city: '',
      educationLevel: '',
      department: '',
      languages: [],
      position: '',
      seniority: 'junior',
      workType: '',
      minExperienceMonths: '',
      hasGithub: false,
      hasLinkedin: false,
      minProjectCount: '',
      minAge: '',
      maxAge: '',
      minScore: 0,
      sortBy: 'relevance',
      page: 1,
      limit: 20
    });
    setSonuclar([]);
    setIstatistikler(null);
  };

  const skillEkle = () => {
    if (skillInput.trim() && !filtreler.skills.includes(skillInput.trim())) {
      setFiltreler(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const skillSil = (skill) => {
    setFiltreler(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const languageEkle = () => {
    if (languageInput.trim() && !filtreler.languages.includes(languageInput.trim())) {
      setFiltreler(prev => ({
        ...prev,
        languages: [...prev.languages, languageInput.trim()]
      }));
      setLanguageInput('');
    }
  };

  const languageSil = (lang) => {
    setFiltreler(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== lang)
    }));
  };

  const sayfaDegistir = (yeniSayfa) => {
    setFiltreler(prev => ({ ...prev, page: yeniSayfa }));
    aramaYap();
  };

  const yetenekDetayinaGit = (yetenekId) => {
    navigate(`/admin/talent/${yetenekId}`);
  };

  const skorRengi = (skor) => {
    if (skor >= 80) return 'bg-green-100 text-green-800';
    if (skor >= 60) return 'bg-blue-100 text-blue-800';
    if (skor >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          🎯 Yetenek Arama Sistemi
        </h1>

        {/* FİLTRE BÖLÜMÜ */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Filtreler</h2>
            <button
              onClick={() => setGelismisFiltre(!gelismisFiltre)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              {gelismisFiltre ? '▼ Basit Filtre' : '▶ Gelişmiş Filtreler'}
            </button>
          </div>

          {/* TEMEL FİLTRELER */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* Skill Ekleme */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yetenekler
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && skillEkle()}
                  placeholder="Örn: React, Node.js"
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
                <button
                  onClick={skillEkle}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm"
                >
                  +
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {filtreler.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {skill}
                    <button onClick={() => skillSil(skill)} className="hover:text-blue-900">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Pozisyon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pozisyon
              </label>
              <select
                value={filtreler.position}
                onChange={(e) => setFiltreler(prev => ({ ...prev, position: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Tümü</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="fullstack">Full-stack</option>
                <option value="mobile">Mobile</option>
                <option value="devops">DevOps</option>
                <option value="data-science">Data Science</option>
                <option value="ui-ux">UI/UX</option>
              </select>
            </div>

            {/* Seniority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tecrübe Seviyesi
              </label>
              <select
                value={filtreler.seniority}
                onChange={(e) => setFiltreler(prev => ({ ...prev, seniority: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="intern">Stajyer</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid-level</option>
                <option value="senior">Senior</option>
              </select>
            </div>

            {/* Şehir */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şehir
              </label>
              <select
                value={filtreler.city}
                onChange={(e) => setFiltreler(prev => ({ ...prev, city: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Tümü</option>
                {filtreSecenekleri?.data?.cities?.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Minimum Skor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min. Uygunluk Skoru: {filtreler.minScore}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={filtreler.minScore}
                onChange={(e) => setFiltreler(prev => ({ ...prev, minScore: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>

            {/* Sıralama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sıralama
              </label>
              <select
                value={filtreler.sortBy}
                onChange={(e) => setFiltreler(prev => ({ ...prev, sortBy: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="relevance">Uygunluğa Göre</option>
                <option value="experience">Deneyime Göre</option>
                <option value="projects">Proje Sayısına Göre</option>
                <option value="education">Eğitime Göre</option>
                <option value="newest">En Yeniler</option>
              </select>
            </div>
          </div>

          {/* GELİŞMİŞ FİLTRELER */}
          {gelismisFiltre && (
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Gelişmiş Filtreler</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Eğitim Seviyesi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Eğitim Seviyesi
                  </label>
                  <select
                    value={filtreler.educationLevel}
                    onChange={(e) => setFiltreler(prev => ({ ...prev, educationLevel: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">Tümü</option>
                    <option value="high_school">Lise</option>
                    <option value="university">Üniversite</option>
                    <option value="masters">Yüksek Lisans</option>
                    <option value="doctorate">Doktora</option>
                  </select>
                </div>

                {/* Çalışma Türü */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Çalışma Türü
                  </label>
                  <select
                    value={filtreler.workType}
                    onChange={(e) => setFiltreler(prev => ({ ...prev, workType: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">Tümü</option>
                    <option value="internship">Staj</option>
                    <option value="part-time">Part-time</option>
                    <option value="full-time">Full-time</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>

                {/* Min. Deneyim (Ay) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min. Deneyim (Ay)
                  </label>
                  <input
                    type="number"
                    value={filtreler.minExperienceMonths}
                    onChange={(e) => setFiltreler(prev => ({ ...prev, minExperienceMonths: e.target.value }))}
                    placeholder="0"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>

                {/* Min. Proje Sayısı */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min. Proje Sayısı
                  </label>
                  <input
                    type="number"
                    value={filtreler.minProjectCount}
                    onChange={(e) => setFiltreler(prev => ({ ...prev, minProjectCount: e.target.value }))}
                    placeholder="0"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>

                {/* Yaş Aralığı */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min. Yaş
                  </label>
                  <input
                    type="number"
                    value={filtreler.minAge}
                    onChange={(e) => setFiltreler(prev => ({ ...prev, minAge: e.target.value }))}
                    placeholder="18"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max. Yaş
                  </label>
                  <input
                    type="number"
                    value={filtreler.maxAge}
                    onChange={(e) => setFiltreler(prev => ({ ...prev, maxAge: e.target.value }))}
                    placeholder="65"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>

                {/* Checkbox'lar */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filtreler.hasGithub}
                    onChange={(e) => setFiltreler(prev => ({ ...prev, hasGithub: e.target.checked }))}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">GitHub Profili Var</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filtreler.hasLinkedin}
                    onChange={(e) => setFiltreler(prev => ({ ...prev, hasLinkedin: e.target.checked }))}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">LinkedIn Profili Var</label>
                </div>
              </div>
            </div>
          )}

          {/* BUTONLAR */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={aramaYap}
              disabled={yukleniyor}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 flex items-center gap-2"
            >
              {yukleniyor ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  Aranıyor...
                </>
              ) : (
                <>🔍 Ara</>
              )}
            </button>
            <button
              onClick={filtreTemizle}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300"
            >
              🗑️ Temizle
            </button>
          </div>
        </div>

        {/* İSTATİSTİKLER */}
        {istatistikler && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="text-sm text-gray-600">Toplam Sonuç</div>
              <div className="text-2xl font-bold">{istatistikler.total}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow-md">
              <div className="text-sm text-green-600">Mükemmel Eşleşme</div>
              <div className="text-2xl font-bold text-green-700">
                {istatistikler.scoreDistribution.excellent}
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg shadow-md">
              <div className="text-sm text-blue-600">İyi Eşleşme</div>
              <div className="text-2xl font-bold text-blue-700">
                {istatistikler.scoreDistribution.good}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
              <div className="text-sm text-gray-600">Ortalama Skor</div>
              <div className="text-2xl font-bold">{istatistikler.averageScore}/100</div>
            </div>
          </div>
        )}

        {/* SONUÇLAR */}
        {sonuclar.length > 0 && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">
                Arama Sonuçları ({sonuclar.length} aday)
              </h2>
            </div>

            <div className="divide-y divide-gray-200">
              {sonuclar.map((yetenek) => (
                <div
                  key={yetenek.id}
                  className="p-6 hover:bg-gray-50 cursor-pointer"
                  onClick={() => yetenekDetayinaGit(yetenek.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {yetenek.fullName}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${skorRengi(yetenek.relevanceScore)}`}>
                          {yetenek.matchLabel} • {yetenek.relevanceScore}/100
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span>📍 {yetenek.city}</span>
                        <span>🎓 {yetenek.school}</span>
                        <span>👤 {yetenek.age} yaş</span>
                        {yetenek.totalExperienceMonths > 0 && (
                          <span>💼 {Math.round(yetenek.totalExperienceMonths / 12)} yıl deneyim</span>
                        )}
                      </div>

                      {yetenek.shortBio && (
                        <p className="text-sm text-gray-700 mb-3">{yetenek.shortBio}</p>
                      )}

                      <div className="flex flex-wrap gap-2 mb-3">
                        {yetenek.skills?.split(',').slice(0, 6).map((skill, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>

                      <div className="grid grid-cols-5 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Skill:</span>
                          <span className="ml-1 font-semibold">
                            {Math.round(yetenek.scoreBreakdown.skillMatch)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Deneyim:</span>
                          <span className="ml-1 font-semibold">
                            {Math.round(yetenek.scoreBreakdown.experience)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Proje:</span>
                          <span className="ml-1 font-semibold">
                            {Math.round(yetenek.scoreBreakdown.projectQuality)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Profil:</span>
                          <span className="ml-1 font-semibold">
                            {Math.round(yetenek.scoreBreakdown.profileQuality)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Proje Sayısı:</span>
                          <span className="ml-1 font-semibold">{yetenek.projectCount}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex gap-2">
                        {yetenek.githubProfile && (
                          <a
                            href={yetenek.githubProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-900"
                            onClick={(e) => e.stopPropagation()}
                          >
                            🔗 GitHub
                          </a>
                        )}
                        {yetenek.linkedinProfile && (
                          <a
                            href={yetenek.linkedinProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-900"
                            onClick={(e) => e.stopPropagation()}
                          >
                            🔗 LinkedIn
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* SAYFALAMA */}
            {sayfalama && sayfalama.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Sayfa {sayfalama.page} / {sayfalama.totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => sayfaDegistir(sayfalama.page - 1)}
                    disabled={!sayfalama.hasPrev}
                    className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    ← Önceki
                  </button>
                  <button
                    onClick={() => sayfaDegistir(sayfalama.page + 1)}
                    disabled={!sayfalama.hasNext}
                    className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Sonraki →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* BOŞ DURUM */}
        {!yukleniyor && sonuclar.length === 0 && istatistikler === null && (
          <div className="bg-white shadow-md rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Arama yapmak için filtreleri doldurun
            </h3>
            <p className="text-gray-500">
              Yetenekleri bulmak için yukarıdaki filtreleri kullanın ve "Ara" butonuna tıklayın
            </p>
          </div>
        )}

        {!yukleniyor && sonuclar.length === 0 && istatistikler !== null && (
          <div className="bg-white shadow-md rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">😕</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Sonuç bulunamadı
            </h3>
            <p className="text-gray-500">
              Filtrelerinizi değiştirerek tekrar deneyin
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminTalentSearch;