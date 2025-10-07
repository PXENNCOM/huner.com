// pages/employer/components/DeveloperRequests/EditDeveloperRequestModal.jsx
import React, { useState, useEffect } from 'react';
import { updateDeveloperRequest } from '../../../../services/employerApi';
import { 
  MdClose, 
  MdEdit, 
  MdCode,
  MdPerson,
  MdBusiness,
  MdSettings,
  MdSave,
  MdCancel
} from 'react-icons/md';

const EditDeveloperRequestModal = ({ isOpen, onClose, request, onSuccess }) => {
  const [formData, setFormData] = useState({
    projectTitle: '',
    projectDescription: '',
    projectType: '',
    technologies: [],
    experienceLevel: '',
    workType: '',
    duration: '',
    startDate: '',
    workStyle: '',
    location: '',
    workHours: '',
    teamSize: '',
    communicationLanguages: [],
    industryExperience: '',
    priority: 'normal',
    budgetRange: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);

  // Form sabitleri (CreateDeveloperRequestModal ile aynı)
  const PROJECT_TYPES = [
    { value: 'website', label: '🌐 Web Sitesi' },
    { value: 'mobile_app', label: '📱 Mobil Uygulama' },
    { value: 'api', label: '🔗 API' },
    { value: 'ecommerce', label: '🛒 E-ticaret' },
    { value: 'crm', label: '👥 CRM' },
    { value: 'desktop_app', label: '💻 Masaüstü Uygulaması' },
    { value: 'other', label: '⚡ Diğer' }
  ];

  const TECHNOLOGIES = [
    'React', 'Vue.js', 'Angular', 'Node.js', 'Express.js', 'Python', 'Django', 
    'PHP', 'Laravel', 'Java', 'Spring Boot', 'C#', '.NET', 'MySQL', 'PostgreSQL', 
    'MongoDB', 'Docker', 'AWS', 'React Native', 'Flutter'
  ];

  const EXPERIENCE_LEVELS = [
    { value: 'intern', label: '🎓 Stajyer' },
    { value: 'junior', label: '🌱 Junior (0-2 yıl)' },
    { value: 'mid', label: '🚀 Mid-level (2-5 yıl)' },
    { value: 'senior', label: '⭐ Senior (5+ yıl)' }
  ];

  const WORK_TYPES = [
    { value: 'freelance', label: '💼 Freelance/Proje bazlı' },
    { value: 'part_time', label: '⏰ Part-time çalışan' },
    { value: 'full_time', label: '🕘 Full-time çalışan' },
    { value: 'intern', label: '🎓 Stajyer' }
  ];

  const DURATIONS = [
    { value: '1_month', label: '1 ay' },
    { value: '2_months', label: '2 ay' },
    { value: '3_months', label: '3 ay' },
    { value: '4_months', label: '4 ay' },
    { value: '5_months', label: '5 ay' },
    { value: '6_months', label: '6 ay' },
    { value: '6_plus_months', label: '6+ ay' },
    { value: 'indefinite', label: 'Belirsiz' }
  ];

  const START_DATES = [
    { value: 'immediately', label: '🚀 Hemen' },
    { value: 'within_1_week', label: '📅 1 hafta içinde' },
    { value: 'within_1_month', label: '📆 1 ay içinde' }
  ];

  const WORK_STYLES = [
    { value: 'remote', label: '🏠 Remote' },
    { value: 'hybrid', label: '🏢 Hibrit' },
    { value: 'office', label: '🏬 Ofiste' }
  ];

  const WORK_HOURS = [
    { value: 'business_hours', label: '🕘 Mesai saatleri (09:00-18:00)' },
    { value: 'flexible', label: '⏰ Esnek çalışma saatleri' },
    { value: 'night_shift', label: '🌙 Gece vardiyası' }
  ];

  const TEAM_SIZES = [
    { value: 'solo', label: '👤 1 kişi (Tek başına)' },
    { value: '2_3_people', label: '👥 2-3 kişi (Küçük takım)' },
    { value: 'team', label: '👨‍👩‍👧‍👦 Takım (4+ kişi)' }
  ];

  const COMMUNICATION_LANGUAGES = ['Türkçe', 'İngilizce'];

  const INDUSTRY_EXPERIENCES = [
    { value: 'ecommerce', label: '🛒 E-ticaret' },
    { value: 'fintech', label: '💰 Fintech' },
    { value: 'healthcare', label: '🏥 Sağlık' },
    { value: 'education', label: '📚 Eğitim' },
    { value: 'gaming', label: '🎮 Oyun' },
    { value: 'social_media', label: '📱 Sosyal Medya' },
    { value: 'no_preference', label: '⚡ Fark etmez' }
  ];

  const PRIORITIES = [
    { value: 'normal', label: '📋 Normal' },
    { value: 'high', label: '⚠️ Yüksek' },
    { value: 'urgent', label: '🚨 Acil' }
  ];

  const TURKISH_CITIES = [
    'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep',
    'Mersin', 'Diyarbakır', 'Kayseri', 'Eskişehir', 'Sakarya', 'Denizli', 'Şanlıurfa'
  ];

  useEffect(() => {
    if (isOpen && request) {
      setFormData({
        projectTitle: request.projectTitle || '',
        projectDescription: request.projectDescription || '',
        projectType: request.projectType || '',
        technologies: Array.isArray(request.technologies) ? request.technologies : [],
        experienceLevel: request.experienceLevel || '',
        workType: request.workType || '',
        duration: request.duration || '',
        startDate: request.startDate || '',
        workStyle: request.workStyle || '',
        location: request.location || '',
        workHours: request.workHours || '',
        teamSize: request.teamSize || '',
        communicationLanguages: Array.isArray(request.communicationLanguages) ? request.communicationLanguages : [],
        industryExperience: request.industryExperience || '',
        priority: request.priority || 'normal',
        budgetRange: request.budgetRange || ''
      });
      setErrors({});
      setSuccess(null);
    }
  }, [isOpen, request]);

  // Form değişiklikleri
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Hata varsa temizle
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Çoklu seçim (teknolojiler, diller)
  const handleMultiSelect = (name, value) => {
    setFormData(prev => {
      const currentValues = prev[name] || [];
      const newValues = currentValues.includes(value) 
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        [name]: newValues
      };
    });
  };

  // Form validasyonu
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.projectTitle.trim()) {
      newErrors.projectTitle = 'Proje başlığı gereklidir';
    }
    
    if (!formData.projectDescription.trim()) {
      newErrors.projectDescription = 'Proje açıklaması gereklidir';
    } else if (formData.projectDescription.length < 20) {
      newErrors.projectDescription = 'Proje açıklaması en az 20 karakter olmalıdır';
    }
    
    if (!formData.projectType) {
      newErrors.projectType = 'Proje tipi seçilmelidir';
    }
    
    if (!formData.experienceLevel) {
      newErrors.experienceLevel = 'Deneyim seviyesi seçilmelidir';
    }
    
    if (!formData.workType) {
      newErrors.workType = 'Çalışma türü seçilmelidir';
    }
    
    if (!formData.duration) {
      newErrors.duration = 'Proje süresi seçilmelidir';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Başlangıç tarihi seçilmelidir';
    }
    
    if (!formData.workStyle) {
      newErrors.workStyle = 'Çalışma şekli seçilmelidir';
    }
    
    if (!formData.workHours) {
      newErrors.workHours = 'Çalışma saatleri seçilmelidir';
    }
    
    if (!formData.teamSize) {
      newErrors.teamSize = 'Takım büyüklüğü seçilmelidir';
    }
    
    return newErrors;
  };

  // Form gönderimi
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      await updateDeveloperRequest(request.id, formData);
      setSuccess('Yazılımcı talebi başarıyla güncellendi!');
      
      setTimeout(() => {
        onSuccess();
      }, 2000);
      
    } catch (error) {
      console.error('Talep güncelleme hatası:', error);
      setErrors({ 
        submit: error.response?.data?.message || 'Talep güncellenirken bir hata oluştu' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 z-[70] overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="absolute inset-4 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-blue-700/50 bg-blue-800/50 backdrop-blur-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <MdEdit className="w-6 h-6 text-orange-300" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Talep Düzenle</h2>
              <p className="text-sm text-blue-200">{request.projectTitle}</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-blue-200 hover:text-white hover:bg-blue-700/50 rounded-lg transition-all duration-200"
          >
            <MdClose className="w-5 h-5" />
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="p-4 m-6 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm">
            ✅ {success}
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="p-4 m-6 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
            ❌ {errors.submit}
          </div>
        )}

        {/* Content */}
        <form onSubmit={handleSubmit} className="h-full overflow-y-auto pb-32">
          <div className="p-6 space-y-6">
            {/* Proje Bilgileri */}
            <div className="bg-blue-800/30 rounded-xl p-6 border border-blue-700/30">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <MdCode className="w-5 h-5 mr-2 text-blue-300" />
                Proje Bilgileri
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Proje Başlığı *
                  </label>
                  <input
                    type="text"
                    name="projectTitle"
                    value={formData.projectTitle}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 bg-blue-700/30 border rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                      errors.projectTitle ? 'border-red-500/50' : 'border-blue-600/50'
                    }`}
                    placeholder="Örn: E-ticaret Web Sitesi Geliştirme"
                  />
                  {errors.projectTitle && <p className="mt-1 text-sm text-red-300">{errors.projectTitle}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Proje Açıklaması *
                  </label>
                  <textarea
                    name="projectDescription"
                    value={formData.projectDescription}
                    onChange={handleChange}
                    rows="4"
                    className={`w-full px-3 py-2 bg-blue-700/30 border rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                      errors.projectDescription ? 'border-red-500/50' : 'border-blue-600/50'
                    }`}
                    placeholder="Projeniz hakkında detaylı açıklama yazın..."
                  />
                  {errors.projectDescription && <p className="mt-1 text-sm text-red-300">{errors.projectDescription}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Proje Tipi *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {PROJECT_TYPES.map(type => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, projectType: type.value }))}
                        className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                          formData.projectType === type.value
                            ? 'bg-blue-500/30 border-blue-500/50 text-white'
                            : 'bg-blue-700/30 border-blue-600/50 text-blue-200 hover:bg-blue-600/40'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                  {errors.projectType && <p className="mt-1 text-sm text-red-300">{errors.projectType}</p>}
                </div>
              </div>
            </div>

            {/* Teknik Gereksinimler */}
            <div className="bg-blue-800/30 rounded-xl p-6 border border-blue-700/30">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <MdPerson className="w-5 h-5 mr-2 text-blue-300" />
                Teknik Gereksinimler
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-3">
                    Deneyim Seviyesi *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {EXPERIENCE_LEVELS.map(level => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, experienceLevel: level.value }))}
                        className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                          formData.experienceLevel === level.value
                            ? 'bg-blue-500/30 border-blue-500/50 text-white'
                            : 'bg-blue-700/30 border-blue-600/50 text-blue-200 hover:bg-blue-600/40'
                        }`}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                  {errors.experienceLevel && <p className="mt-1 text-sm text-red-300">{errors.experienceLevel}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-3">
                    Teknolojiler
                  </label>
                  <div className="bg-blue-700/30 rounded-lg p-4 border border-blue-600/30 max-h-60 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-2">
                      {TECHNOLOGIES.map(tech => (
                        <label key={tech} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.technologies.includes(tech)}
                            onChange={() => handleMultiSelect('technologies', tech)}
                            className="rounded border-blue-500/50 bg-blue-700/50 text-blue-500 focus:ring-blue-500/50"
                          />
                          <span className="text-sm text-blue-200">{tech}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Çalışma Koşulları */}
            <div className="bg-blue-800/30 rounded-xl p-6 border border-blue-700/30">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <MdBusiness className="w-5 h-5 mr-2 text-blue-300" />
                Çalışma Koşulları
              </h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-3">
                      Çalışma Türü *
                    </label>
                    <div className="space-y-2">
                      {WORK_TYPES.map(type => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, workType: type.value }))}
                          className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${
                            formData.workType === type.value
                              ? 'bg-blue-500/30 border-blue-500/50 text-white'
                              : 'bg-blue-700/30 border-blue-600/50 text-blue-200 hover:bg-blue-600/40'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                    {errors.workType && <p className="mt-1 text-sm text-red-300">{errors.workType}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-3">
                      Proje Süresi *
                    </label>
                    <select
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 bg-blue-700/30 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                        errors.duration ? 'border-red-500/50' : 'border-blue-600/50'
                      }`}
                    >
                      <option value="">Seçiniz</option>
                      {DURATIONS.map(duration => (
                        <option key={duration.value} value={duration.value}>{duration.label}</option>
                      ))}
                    </select>
                    {errors.duration && <p className="mt-1 text-sm text-red-300">{errors.duration}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-3">
                      Başlangıç Tarihi *
                    </label>
                    <div className="space-y-2">
                      {START_DATES.map(date => (
                        <button
                          key={date.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, startDate: date.value }))}
                          className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${
                            formData.startDate === date.value
                              ? 'bg-blue-500/30 border-blue-500/50 text-white'
                              : 'bg-blue-700/30 border-blue-600/50 text-blue-200 hover:bg-blue-600/40'
                          }`}
                        >
                          {date.label}
                        </button>
                      ))}
                    </div>
                    {errors.startDate && <p className="mt-1 text-sm text-red-300">{errors.startDate}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-3">
                      Çalışma Şekli *
                    </label>
                    <div className="space-y-2">
                      {WORK_STYLES.map(style => (
                        <button
                          key={style.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, workStyle: style.value }))}
                          className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${
                            formData.workStyle === style.value
                              ? 'bg-blue-500/30 border-blue-500/50 text-white'
                              : 'bg-blue-700/30 border-blue-600/50 text-blue-200 hover:bg-blue-600/40'
                          }`}
                        >
                          {style.label}
                        </button>
                      ))}
                    </div>
                    {errors.workStyle && <p className="mt-1 text-sm text-red-300">{errors.workStyle}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-3">
                      Çalışma Saatleri *
                    </label>
                    <div className="space-y-2">
                      {WORK_HOURS.map(hours => (
                        <button
                          key={hours.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, workHours: hours.value }))}
                          className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${
                            formData.workHours === hours.value
                              ? 'bg-blue-500/30 border-blue-500/50 text-white'
                              : 'bg-blue-700/30 border-blue-600/50 text-blue-200 hover:bg-blue-600/40'
                          }`}
                        >
                          {hours.label}
                        </button>
                      ))}
                    </div>
                    {errors.workHours && <p className="mt-1 text-sm text-red-300">{errors.workHours}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-3">
                      Takım Büyüklüğü *
                    </label>
                    <div className="space-y-2">
                      {TEAM_SIZES.map(size => (
                        <button
                          key={size.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, teamSize: size.value }))}
                          className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${
                            formData.teamSize === size.value
                              ? 'bg-blue-500/30 border-blue-500/50 text-white'
                              : 'bg-blue-700/30 border-blue-600/50 text-blue-200 hover:bg-blue-600/40'
                          }`}
                        >
                          {size.label}
                        </button>
                      ))}
                    </div>
                    {errors.teamSize && <p className="mt-1 text-sm text-red-300">{errors.teamSize}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-3">
                    Konum
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-blue-700/30 border border-blue-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="">Fark etmez</option>
                    {TURKISH_CITIES.map(city => (
                      <option key={city} value={city.toLowerCase()}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Tercihler */}
            <div className="bg-blue-800/30 rounded-xl p-6 border border-blue-700/30">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <MdSettings className="w-5 h-5 mr-2 text-blue-300" />
                Tercihler ve Diğer Bilgiler
              </h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-3">
                      İletişim Dilleri
                    </label>
                    <div className="space-y-2">
                      {COMMUNICATION_LANGUAGES.map(lang => (
                        <label key={lang} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.communicationLanguages.includes(lang)}
                            onChange={() => handleMultiSelect('communicationLanguages', lang)}
                            className="rounded border-blue-500/50 bg-blue-700/50 text-blue-500 focus:ring-blue-500/50"
                          />
                          <span className="text-sm text-blue-200">{lang}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-3">
                      Sektör Deneyimi
                    </label>
                    <select
                      name="industryExperience"
                      value={formData.industryExperience}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-blue-700/30 border border-blue-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                      <option value="">Seçiniz</option>
                      {INDUSTRY_EXPERIENCES.map(industry => (
                        <option key={industry.value} value={industry.value}>{industry.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-3">
                      Öncelik
                    </label>
                    <div className="space-y-2">
                      {PRIORITIES.map(priority => (
                        <button
                          key={priority.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, priority: priority.value }))}
                          className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${
                            formData.priority === priority.value
                              ? 'bg-blue-500/30 border-blue-500/50 text-white'
                              : 'bg-blue-700/30 border-blue-600/50 text-blue-200 hover:bg-blue-600/40'
                          }`}
                        >
                          {priority.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-3">
                      Bütçe Aralığı
                    </label>
                    <input
                      type="text"
                      name="budgetRange"
                      value={formData.budgetRange}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-blue-700/30 border border-blue-600/50 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      placeholder="Örn: 15000-25000 TL"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-blue-800/50 backdrop-blur-xl border-t border-blue-700/50">
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              <MdCancel className="w-4 h-4 mr-2" />
              İptal
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Güncelleniyor...
                </>
              ) : (
                <>
                  <MdSave className="w-4 h-4 mr-2" />
                  Değişiklikleri Kaydet
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDeveloperRequestModal;