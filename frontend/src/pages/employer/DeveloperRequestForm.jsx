// src/pages/employer/DeveloperRequestForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployerLayout from './components/EmployerLayout';
import { createDeveloperRequest } from '../../services/employerApi';

const DeveloperRequestForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Proje Bilgileri
    projectTitle: '',
    projectDescription: '',
    projectType: '',
    
    // Teknik Gereksinimler
    technologies: [],
    experienceLevel: '',
    
    // Çalışma Türü ve Süresi
    workType: '',
    duration: '',
    startDate: '',
    
    // Çalışma Koşulları
    workStyle: '',
    location: '',
    workHours: '',
    teamSize: '',
    
    // Tercihler
    communicationLanguages: [],
    industryExperience: '',
    priority: 'normal',
    budgetRange: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);

  // Form sabitleri
  const PROJECT_TYPES = [
    { value: 'website', label: 'Web Sitesi' },
    { value: 'mobile_app', label: 'Mobil Uygulama' },
    { value: 'api', label: 'API' },
    { value: 'ecommerce', label: 'E-ticaret' },
    { value: 'crm', label: 'CRM' },
    { value: 'desktop_app', label: 'Masaüstü Uygulaması' },
    { value: 'other', label: 'Diğer' }
  ];

  const TECHNOLOGIES = [
    'React', 'Vue.js', 'Angular', 'Node.js', 'Express.js', 'Python', 'Django', 
    'PHP', 'Laravel', 'Java', 'Spring Boot', 'C#', '.NET', 'MySQL', 'PostgreSQL', 
    'MongoDB', 'Docker', 'AWS', 'React Native', 'Flutter'
  ];

  const EXPERIENCE_LEVELS = [
    { value: 'intern', label: 'Stajyer' },
    { value: 'junior', label: 'Junior (0-2 yıl)' },
    { value: 'mid', label: 'Mid-level (2-5 yıl)' },
    { value: 'senior', label: 'Senior (5+ yıl)' }
  ];

  const WORK_TYPES = [
    { value: 'freelance', label: 'Freelance/Proje bazlı' },
    { value: 'part_time', label: 'Part-time çalışan' },
    { value: 'full_time', label: 'Full-time çalışan' },
    { value: 'intern', label: 'Stajyer' }
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
    { value: 'immediately', label: 'Hemen' },
    { value: 'within_1_week', label: '1 hafta içinde' },
    { value: 'within_1_month', label: '1 ay içinde' }
  ];

  const WORK_STYLES = [
    { value: 'remote', label: 'Remote' },
    { value: 'hybrid', label: 'Hibrit' },
    { value: 'office', label: 'Ofiste' }
  ];

  const TURKISH_CITIES = [
    'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep',
    'Mersin', 'Diyarbakır', 'Kayseri', 'Eskişehir', 'Sakarya', 'Denizli', 'Şanlıurfa',
    'Adapazarı', 'Malatya', 'Kahramanmaraş', 'Erzurum', 'Van', 'Batman', 'Elazığ'
  ];

  const WORK_HOURS = [
    { value: 'business_hours', label: 'Mesai saatleri (09:00-18:00)' },
    { value: 'flexible', label: 'Esnek çalışma saatleri' },
    { value: 'night_shift', label: 'Gece vardiyası' }
  ];

  const TEAM_SIZES = [
    { value: 'solo', label: '1 kişi (Tek başına)' },
    { value: '2_3_people', label: '2-3 kişi (Küçük takım)' },
    { value: 'team', label: 'Takım (4+ kişi)' }
  ];

  const COMMUNICATION_LANGUAGES = ['Türkçe', 'İngilizce'];

  const INDUSTRY_EXPERIENCES = [
    { value: 'ecommerce', label: 'E-ticaret' },
    { value: 'fintech', label: 'Fintech' },
    { value: 'healthcare', label: 'Sağlık' },
    { value: 'education', label: 'Eğitim' },
    { value: 'gaming', label: 'Oyun' },
    { value: 'social_media', label: 'Sosyal Medya' },
    { value: 'no_preference', label: 'Fark etmez' }
  ];

  const PRIORITIES = [
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'Yüksek' },
    { value: 'urgent', label: 'Acil' }
  ];

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
      await createDeveloperRequest(formData);
      setSuccess('Yazılımcı talebi başarıyla oluşturuldu!');
      
      // 2 saniye sonra listeye yönlendir
      setTimeout(() => {
        navigate('/employer/developer-requests');
      }, 2000);
      
    } catch (error) {
      console.error('Talep oluşturma hatası:', error);
      setErrors({ 
        submit: error.response?.data?.message || 'Talep oluşturulurken bir hata oluştu' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <EmployerLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Yazılımcı Talep Formu</h1>
          <p className="text-gray-600 mt-2">İhtiyacınız olan yazılımcı profilini detaylı olarak belirtin.</p>
        </div>

        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
            <p>{success}</p>
          </div>
        )}

        {errors.submit && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{errors.submit}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-8">
          {/* Proje Bilgileri */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Proje Bilgileri</h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proje Başlığı *
                </label>
                <input
                  type="text"
                  name="projectTitle"
                  value={formData.projectTitle}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.projectTitle ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Örn: E-ticaret Web Sitesi Geliştirme"
                />
                {errors.projectTitle && <p className="mt-1 text-sm text-red-500">{errors.projectTitle}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proje Açıklaması *
                </label>
                <textarea
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleChange}
                  rows="4"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.projectDescription ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Projeniz hakkında detaylı açıklama yazın..."
                />
                {errors.projectDescription && <p className="mt-1 text-sm text-red-500">{errors.projectDescription}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proje Tipi *
                </label>
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.projectType ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seçiniz</option>
                  {PROJECT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                {errors.projectType && <p className="mt-1 text-sm text-red-500">{errors.projectType}</p>}
              </div>
            </div>
          </div>

          {/* Teknik Gereksinimler */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Teknik Gereksinimler</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teknolojiler
                </label>
                <div className="border rounded-md p-3 h-40 overflow-y-auto">
                  {TECHNOLOGIES.map(tech => (
                    <label key={tech} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={formData.technologies.includes(tech)}
                        onChange={() => handleMultiSelect('technologies', tech)}
                        className="mr-2"
                      />
                      <span className="text-sm">{tech}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deneyim Seviyesi *
                </label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.experienceLevel ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seçiniz</option>
                  {EXPERIENCE_LEVELS.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
                {errors.experienceLevel && <p className="mt-1 text-sm text-red-500">{errors.experienceLevel}</p>}
              </div>
            </div>
          </div>

          {/* Çalışma Türü ve Süresi */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Çalışma Türü ve Süresi</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Çalışma Türü *
                </label>
                <select
                  name="workType"
                  value={formData.workType}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.workType ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seçiniz</option>
                  {WORK_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                {errors.workType && <p className="mt-1 text-sm text-red-500">{errors.workType}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Süre *
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.duration ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seçiniz</option>
                  {DURATIONS.map(duration => (
                    <option key={duration.value} value={duration.value}>{duration.label}</option>
                  ))}
                </select>
                {errors.duration && <p className="mt-1 text-sm text-red-500">{errors.duration}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlama Tarihi *
                </label>
                <select
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.startDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seçiniz</option>
                  {START_DATES.map(date => (
                    <option key={date.value} value={date.value}>{date.label}</option>
                  ))}
                </select>
                {errors.startDate && <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>}
              </div>
            </div>
          </div>

          {/* Çalışma Koşulları */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Çalışma Koşulları</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Çalışma Şekli *
                </label>
                <select
                  name="workStyle"
                  value={formData.workStyle}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.workStyle ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seçiniz</option>
                  {WORK_STYLES.map(style => (
                    <option key={style.value} value={style.value}>{style.label}</option>
                  ))}
                </select>
                {errors.workStyle && <p className="mt-1 text-sm text-red-500">{errors.workStyle}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konum
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Fark etmez</option>
                  {TURKISH_CITIES.map(city => (
                    <option key={city} value={city.toLowerCase()}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Çalışma Saatleri *
                </label>
                <select
                  name="workHours"
                  value={formData.workHours}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.workHours ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seçiniz</option>
                  {WORK_HOURS.map(hours => (
                    <option key={hours.value} value={hours.value}>{hours.label}</option>
                  ))}
                </select>
                {errors.workHours && <p className="mt-1 text-sm text-red-500">{errors.workHours}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Takım Büyüklüğü *
                </label>
                <select
                  name="teamSize"
                  value={formData.teamSize}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.teamSize ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seçiniz</option>
                  {TEAM_SIZES.map(size => (
                    <option key={size.value} value={size.value}>{size.label}</option>
                  ))}
                </select>
                {errors.teamSize && <p className="mt-1 text-sm text-red-500">{errors.teamSize}</p>}
              </div>
            </div>
          </div>

          {/* Tercihler */}
          <div className="pb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Tercihler</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İletişim Dilleri
                </label>
                <div className="space-y-2">
                  {COMMUNICATION_LANGUAGES.map(lang => (
                    <label key={lang} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.communicationLanguages.includes(lang)}
                        onChange={() => handleMultiSelect('communicationLanguages', lang)}
                        className="mr-2"
                      />
                      <span className="text-sm">{lang}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sektör Deneyimi
                </label>
                <select
                  name="industryExperience"
                  value={formData.industryExperience}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seçiniz</option>
                  {INDUSTRY_EXPERIENCES.map(industry => (
                    <option key={industry.value} value={industry.value}>{industry.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Öncelik
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {PRIORITIES.map(priority => (
                    <option key={priority.value} value={priority.value}>{priority.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bütçe Aralığı
                </label>
                <input
                  type="text"
                  name="budgetRange"
                  value={formData.budgetRange}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Örn: 15000-25000 TL"
                />
              </div>
            </div>
          </div>

          {/* Form Butonları */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-md transition-colors font-medium flex justify-center items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Gönderiliyor...
                </>
              ) : (
                'Talebi Gönder'
              )}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/employer/dashboard')}
              disabled={isSubmitting}
              className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-md transition-colors font-medium"
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </EmployerLayout>
  );
};

export default DeveloperRequestForm;