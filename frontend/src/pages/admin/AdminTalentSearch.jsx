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
    keywords: [], // 🆕 Yeni eklendi
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
  
  // Input için geçici state'ler
  const [skillInput, setSkillInput] = useState('');
  const [keywordInput, setKeywordInput] = useState(''); // 🆕 Yeni eklendi
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

  const aramaYap = async (guncelFiltreler = filtreler) => {
    try {
      setYukleniyor(true);
      const response = await adminApi.talentArama.yetenekAra(guncelFiltreler);
      
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
      keywords: [], // 🆕
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
    setSayfalama(null);
  };

  // Skill ekleme
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

  // 🆕 Keyword ekleme
  const keywordEkle = () => {
    if (keywordInput.trim() && !filtreler.keywords.includes(keywordInput.trim())) {
      setFiltreler(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const keywordSil = (keyword) => {
    setFiltreler(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  // Language ekleme
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

  // Sayfa değiştirme (DÜZELTİLDİ)
  const sayfaDegistir = (yeniSayfa) => {
    const guncelFiltreler = { ...filtreler, page: yeniSayfa };
    setFiltreler(guncelFiltreler);
    aramaYap(guncelFiltreler); // Güncel filtreleri gönder
  };

  const yetenekDetayinaGit = (yetenekId) => {
    navigate(`/admin/talent/${yetenekId}`);
  };

  // Skor rengi (Güncellenmiş)
  const skorRengi = (skor) => {
    if (skor >= 85) return 'bg-green-100 text-green-800 border border-green-200';
    if (skor >= 70) return 'bg-blue-100 text-blue-800 border border-blue-200';
    if (skor >= 55) return 'bg-cyan-100 text-cyan-800 border border-cyan-200';
    if (skor >= 40) return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    return 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          🎯 Gelişmiş Yetenek Arama Sistemi
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
                💻 Teknik Yetenekler
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && skillEkle()}
                  placeholder="Örn: React, Node.js"
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <button onClick={() => skillSil(skill)} className="hover:text-blue-900 font-bold">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* 🆕 Keyword Ekleme */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔍 Serbest Arama (Bio, Projeler, Deneyimler)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && keywordEkle()}
                  placeholder="Örn: startup, AI, açık kaynak"
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={keywordEkle}
                  className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 text-sm"
                >
                  +
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {filtreler.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    🔍 {keyword}
                    <button onClick={() => keywordSil(keyword)} className="hover:text-purple-900 font-bold">
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Bu kelimeler tüm profilde aranır (biyografi, proje açıklamaları, iş deneyimleri)
              </p>
            </div>

            {/* Pozisyon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                👔 Pozisyon
              </label>
              <select
                value={filtreler.position}
                onChange={(e) => setFiltreler(prev => ({ ...prev, position: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tümü</option>
                <option value="frontend">Frontend Developer</option>
                <option value="backend">Backend Developer</option>
                <option value="fullstack">Full-stack Developer</option>
                <option value="mobile">Mobile Developer</option>
                <option value="devops">DevOps Engineer</option>
                <option value="data-science">Data Scientist</option>
                <option value="ui-ux">UI/UX Designer</option>
              </select>
            </div>

            {/* Seniority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📊 Tecrübe Seviyesi
              </label>
              <select
                value={filtreler.seniority}
                onChange={(e) => setFiltreler(prev => ({ ...prev, seniority: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="intern">Stajyer</option>
                <option value="junior">Junior (0-2 yıl)</option>
                <option value="mid">Mid-level (2-5 yıl)</option>
                <option value="senior">Senior (5+ yıl)</option>
              </select>
            </div>

            {/* Şehir */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📍 Şehir
              </label>
              <select
                value={filtreler.city}
                onChange={(e) => setFiltreler(prev => ({ ...prev, city: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                🎯 Min. Uygunluk Skoru: {filtreler.minScore}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={filtreler.minScore}
                onChange={(e) => setFiltreler(prev => ({ ...prev, minScore: parseInt(e.target.value) }))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
              </div>
            </div>

            {/* Sıralama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔄 Sıralama
              </label>
              <select
                value={filtreler.sortBy}
                onChange={(e) => setFiltreler(prev => ({ ...prev, sortBy: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="relevance">Uygunluğa Göre</option>
                <option value="experience">Deneyime Göre</option>
                <option value="projects">Proje Sayısına Göre</option>
                <option value="education">Eğitime Göre</option>
                <option value="newest">En Yeniler</option>
              </select>
            </div>

            {/* Language Ekleme */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🌍 Diller
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={languageInput}
                  onChange={(e) => setLanguageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && languageEkle()}
                  placeholder="Örn: İngilizce, Almanca"
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={languageEkle}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 text-sm"
                >
                  +
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {filtreler.languages.map((lang, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {lang}
                    <button onClick={() => languageSil(lang)} className="hover:text-green-900 font-bold">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* GELİŞMİŞ FİLTRELER */}
          {gelismisFiltre && (
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">⚙️ Gelişmiş Filtreler</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Eğitim Seviyesi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🎓 Eğitim Seviyesi
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
                    💼 Çalışma Türü
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
                    ⏱️ Min. Deneyim (Ay)
                  </label>
                  <input
                    type="number"
                    value={filtreler.minExperienceMonths}
                    onChange={(e) => setFiltreler(prev => ({ ...prev, minExperienceMonths: e.target.value }))}
                    placeholder="0"
                    min="0"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>

                {/* Min. Proje Sayısı */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📦 Min. Proje Sayısı
                  </label>
                  <input
                    type="number"
                    value={filtreler.minProjectCount}
                    onChange={(e) => setFiltreler(prev => ({ ...prev, minProjectCount: e.target.value }))}
                    placeholder="0"
                    min="0"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>

                {/* Yaş Aralığı */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    👤 Min. Yaş
                  </label>
                  <input
                    type="number"
                    value={filtreler.minAge}
                    onChange={(e) => setFiltreler(prev => ({ ...prev, minAge: e.target.value }))}
                    placeholder="18"
                    min="18"
                    max="100"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    👤 Max. Yaş
                  </label>
                  <input
                    type="number"
                    value={filtreler.maxAge}
                    onChange={(e) => setFiltreler(prev => ({ ...prev, maxAge: e.target.value }))}
                    placeholder="65"
                    min="18"
                    max="100"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>

                {/* Checkbox'lar */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hasGithub"
                    checked={filtreler.hasGithub}
                    onChange={(e) => setFiltreler(prev => ({ ...prev, hasGithub: e.target.checked }))}
                    className="mr-2 w-4 h-4 text-blue-600"
                  />
                  <label htmlFor="hasGithub" className="text-sm text-gray-700">
                    🔗 GitHub Profili Var
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hasLinkedin"
                    checked={filtreler.hasLinkedin}
                    onChange={(e) => setFiltreler(prev => ({ ...prev, hasLinkedin: e.target.checked }))}
                    className="mr-2 w-4 h-4 text-blue-600"
                  />
                  <label htmlFor="hasLinkedin" className="text-sm text-gray-700">
                    🔗 LinkedIn Profili Var
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* BUTONLAR */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => aramaYap()}
              disabled={yukleniyor}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 flex items-center gap-2 transition-colors"
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
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              🗑️ Temizle
            </button>
            
            {/* 🆕 Aktif Filtre Sayısı */}
            {(filtreler.skills.length > 0 || filtreler.keywords.length > 0 || filtreler.languages.length > 0) && (
              <div className="flex items-center text-sm text-gray-600 ml-auto">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                  {filtreler.skills.length + filtreler.keywords.length + filtreler.languages.length} aktif filtre
                </span>
              </div>
            )}
          </div>
        </div>

        {/* İSTATİSTİKLER (Güncellenmiş) */}
        {istatistikler && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="text-sm text-gray-600">Toplam Sonuç</div>
              <div className="text-2xl font-bold">{istatistikler.total}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow-md border border-green-200">
              <div className="text-sm text-green-600">⭐ Mükemmel (85+)</div>
              <div className="text-2xl font-bold text-green-700">
                {istatistikler.scoreDistribution.excellent || 0}
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg shadow-md border border-blue-200">
              <div className="text-sm text-blue-600">✅ Çok İyi (70+)</div>
              <div className="text-2xl font-bold text-blue-700">
                {istatistikler.scoreDistribution.veryGood || 0}
              </div>
            </div>
            <div className="bg-cyan-50 p-4 rounded-lg shadow-md border border-cyan-200">
              <div className="text-sm text-cyan-600">👍 İyi (55+)</div>
              <div className="text-2xl font-bold text-cyan-700">
                {istatistikler.scoreDistribution.good || 0}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
              <div className="text-sm text-gray-600">Ortalama Skor</div>
              <div className="text-2xl font-bold">{istatistikler.averageScore}/100</div>
            </div>
          </div>
        )}

        {/* SONUÇLAR (Güncellenmiş) */}
        {sonuclar.length > 0 && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                  Arama Sonuçları ({sonuclar.length} aday)
                </h2>
                {istatistikler?.averageExperience && (
                  <div className="text-sm text-gray-600">
                    Ort. Deneyim: {Math.round(istatistikler.averageExperience / 12)} yıl
                  </div>
                )}
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {sonuclar.map((yetenek) => (
                <div
                  key={yetenek.id}
                  className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
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

                      <div className="flex items-center flex-wrap gap-3 text-sm text-gray-600 mb-3">
                        <span>📍 {yetenek.city}</span>
                        <span>🎓 {yetenek.school}</span>
                        {yetenek.department && (
                          <span>📚 {yetenek.department}</span>
                        )}
                        <span>👤 {yetenek.age} yaş</span>
                        {yetenek.experienceYears > 0 && (
                          <span className="font-medium">💼 {yetenek.experienceYears} yıl deneyim</span>
                        )}
                      </div>

                      {yetenek.shortBio && (
                        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{yetenek.shortBio}</p>
                      )}

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {yetenek.skills?.split(',').slice(0, 8).map((skill, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                        {yetenek.skills?.split(',').length > 8 && (
                          <span className="text-xs text-gray-500 self-center">
                            +{yetenek.skills.split(',').length - 8} daha
                          </span>
                        )}
                      </div>

{/* 🆕 Eşleşme Detayları */}
                      {yetenek.matchHighlights && (
                        <div className="mb-3 p-3 bg-blue-50 rounded-md border border-blue-100">
                          <div className="text-xs font-semibold text-blue-800 mb-2">🎯 Eşleşme Detayları:</div>
                          <div className="space-y-1">
                            {/* Bio Matches */}
                            {yetenek.matchHighlights.bioMatches?.length > 0 && (
                              <div className="text-xs text-blue-700">
                                <span className="font-medium">Biyografi:</span>{' '}
                                {yetenek.matchHighlights.bioMatches.map(m => m.keyword).join(', ')}
                              </div>
                            )}
                            
                            {/* Project Matches */}
                            {yetenek.matchHighlights.topProjects?.length > 0 && (
                              <div className="text-xs text-blue-700">
                                <span className="font-medium">Projeler:</span>{' '}
                                {yetenek.matchHighlights.topProjects.map(p => p.projectTitle).join(', ')}
                              </div>
                            )}
                            
                            {/* Experience Matches */}
                            {yetenek.matchHighlights.topExperiences?.length > 0 && (
                              <div className="text-xs text-blue-700">
                                <span className="font-medium">Deneyim:</span>{' '}
                                {yetenek.matchHighlights.topExperiences.map(e => `${e.position} @ ${e.company}`).join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Skor Breakdown */}
                      <div className="grid grid-cols-5 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Skill:</span>
                          <span className="ml-1 font-semibold text-blue-600">
                            {Math.round(yetenek.scoreBreakdown.skillMatch)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Deneyim:</span>
                          <span className="ml-1 font-semibold text-green-600">
                            {Math.round(yetenek.scoreBreakdown.experience)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Proje:</span>
                          <span className="ml-1 font-semibold text-purple-600">
                            {Math.round(yetenek.scoreBreakdown.projectQuality)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Profil:</span>
                          <span className="ml-1 font-semibold text-orange-600">
                            {Math.round(yetenek.scoreBreakdown.profileQuality)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Proje Sayısı:</span>
                          <span className="ml-1 font-semibold">{yetenek.projectCount}</span>
                        </div>
                      </div>

                      {/* 🆕 Detaylı Eşleşme Skorları */}
                      {yetenek.matchScores && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="text-xs text-gray-500 mb-1">Detaylı Eşleşme:</div>
                          <div className="flex flex-wrap gap-2">
                            {yetenek.matchScores.bio > 0 && (
                              <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                                Bio: {yetenek.matchScores.bio}%
                              </span>
                            )}
                            {yetenek.matchScores.skills > 0 && (
                              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                Skills: {yetenek.matchScores.skills}%
                              </span>
                            )}
                            {yetenek.matchScores.department > 0 && (
                              <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                                Bölüm: {yetenek.matchScores.department}%
                              </span>
                            )}
                            {yetenek.matchScores.projects > 0 && (
                              <span className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded">
                                Projeler: {yetenek.matchScores.projects}%
                              </span>
                            )}
                            {yetenek.matchScores.workExperiences > 0 && (
                              <span className="text-xs bg-cyan-50 text-cyan-700 px-2 py-1 rounded">
                                Deneyimler: {yetenek.matchScores.workExperiences}%
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 🆕 Pozisyon Uygunluğu */}
                      {yetenek.positionRelevance && filtreler.position && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {filtreler.position.toUpperCase()} Pozisyon Uygunluğu:
                            </span>
                            <span className="text-sm font-bold text-indigo-600">
                              {yetenek.positionRelevance.overall}%
                            </span>
                          </div>
                          <div className="mt-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-indigo-600 h-2 rounded-full transition-all"
                                style={{ width: `${yetenek.positionRelevance.overall}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sağ Taraf - Linkler */}
                    <div className="text-right ml-4">
                      <div className="flex flex-col gap-2">
                        {yetenek.githubProfile && (
                          <a
                            href={yetenek.githubProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-900 text-sm flex items-center gap-1"
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
                            className="text-gray-600 hover:text-gray-900 text-sm flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            🔗 LinkedIn
                          </a>
                        )}
                        {yetenek.email && (
                          <a
                            href={`mailto:${yetenek.email}`}
                            className="text-gray-600 hover:text-gray-900 text-sm flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            📧 Email
                          </a>
                        )}
                      </div>
                      
                      {/* Profil Tamamlanma */}
                      <div className="mt-3 text-xs text-gray-500">
                        <div className="mb-1">Profil: {yetenek.profileCompleteness}%</div>
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{ width: `${yetenek.profileCompleteness}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* SAYFALAMA */}
            {sayfalama && sayfalama.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="text-sm text-gray-700">
                  Sayfa {sayfalama.page} / {sayfalama.totalPages} 
                  <span className="text-gray-500 ml-2">
                    ({sayfalama.total} sonuçtan {((sayfalama.page - 1) * filtreler.limit) + 1}-
                    {Math.min(sayfalama.page * filtreler.limit, sayfalama.total)} arası gösteriliyor)
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => sayfaDegistir(sayfalama.page - 1)}
                    disabled={!sayfalama.hasPrev}
                    className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                  >
                    ← Önceki
                  </button>
                  
                  {/* Sayfa numaraları */}
                  <div className="flex gap-1">
                    {[...Array(Math.min(5, sayfalama.totalPages))].map((_, i) => {
                      let pageNum;
                      if (sayfalama.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (sayfalama.page <= 3) {
                        pageNum = i + 1;
                      } else if (sayfalama.page >= sayfalama.totalPages - 2) {
                        pageNum = sayfalama.totalPages - 4 + i;
                      } else {
                        pageNum = sayfalama.page - 2 + i;
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => sayfaDegistir(pageNum)}
                          className={`px-3 py-2 border rounded-md transition-colors ${
                            pageNum === sayfalama.page
                              ? 'bg-blue-500 text-white border-blue-500'
                              : 'border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => sayfaDegistir(sayfalama.page + 1)}
                    disabled={!sayfalama.hasNext}
                    className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                  >
                    Sonraki →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* BOŞ DURUM - Henüz Arama Yapılmadı */}
        {!yukleniyor && sonuclar.length === 0 && istatistikler === null && (
          <div className="bg-white shadow-md rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Gelişmiş Yetenek Arama
            </h3>
            <p className="text-gray-500 mb-4">
              Yetenekleri bulmak için yukarıdaki filtreleri kullanın ve "Ara" butonuna tıklayın
            </p>
            <div className="max-w-2xl mx-auto text-left">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="font-semibold text-blue-800 mb-2">💡 İpuçları:</div>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• <strong>Teknik Yetenekler:</strong> React, Node.js gibi spesifik teknolojiler</li>
                  <li>• <strong>Serbest Arama:</strong> "startup", "AI", "açık kaynak" gibi kelimeler tüm profilde aranır</li>
                  <li>• <strong>Pozisyon:</strong> Seçtiğiniz pozisyona göre skorlama ağırlıkları ayarlanır</li>
                  <li>• <strong>Min. Skor:</strong> Minimum {filtreler.minScore} puan alan adaylar gösterilir</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* BOŞ DURUM - Sonuç Bulunamadı */}
        {!yukleniyor && sonuclar.length === 0 && istatistikler !== null && (
          <div className="bg-white shadow-md rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">😕</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Sonuç bulunamadı
            </h3>
            <p className="text-gray-500 mb-4">
              Aradığınız kriterlere uygun aday bulunamadı
            </p>
            <div className="max-w-md mx-auto">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
                <div className="font-semibold text-yellow-800 mb-2">💡 Öneriler:</div>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Minimum skor limitini düşürün ({filtreler.minScore} → 0)</li>
                  <li>• Daha az filtre kullanın</li>
                  <li>• Farklı pozisyon veya şehir seçin</li>
                  <li>• Teknik yetenekler yerine daha genel anahtar kelimeler kullanın</li>
                </ul>
              </div>
              <button
                onClick={filtreTemizle}
                className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
              >
                🔄 Filtreleri Sıfırla
              </button>
            </div>
          </div>
        )}

        {/* 🆕 Algoritma Bilgisi (Debug için - sadece dev modda göster) */}
        {process.env.NODE_ENV === 'development' && sonuclar.length > 0 && (
          <div className="mt-4 bg-gray-800 text-white p-4 rounded-lg text-xs">
            <div className="font-mono">
              <div className="font-bold mb-2">🔬 Algoritma Bilgisi:</div>
              <div className="grid grid-cols-2 gap-2">
                <div>Toplam Sorgu: {sonuclar.length} aday</div>
                <div>Ortalama Skor: {istatistikler?.averageScore}/100</div>
                <div>Fuzzy Matching: Aktif</div>
                <div>Deep Search: {filtreler.keywords.length > 0 ? 'Aktif' : 'Pasif'}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminTalentSearch;