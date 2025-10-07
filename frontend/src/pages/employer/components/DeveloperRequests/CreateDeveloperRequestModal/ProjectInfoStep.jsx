// pages/employer/components/DeveloperRequests/ProjectInfoStep.jsx
import React from 'react';
import { MdCode, MdWarning } from 'react-icons/md';

const ProjectInfoStep = ({ formData, errors, onChange }) => {
  const PROJECT_TYPES = [
    { value: 'website', label: '🌐 Web Sitesi' },
    { value: 'mobile_app', label: '📱 Mobil Uygulama' },
    { value: 'desktop_app', label: '💻 Masaüstü Uygulaması' },
    { value: 'api', label: '🔗 API / Backend Servis' },
    { value: 'ecommerce', label: '🛒 E-Ticaret Platformu' },
    { value: 'crm', label: '👥 CRM Sistemi' },
    { value: 'erp', label: '🏢 ERP Sistemi' },
    { value: 'saas', label: '☁️ SaaS Uygulaması' },
    { value: 'ai_ml', label: '🤖 Yapay Zeka / ML Projesi' },
    { value: 'data_analytics', label: '📊 Veri Analitiği / Big Data' },
    { value: 'blockchain', label: '⛓️ Blockchain / Web3 Projesi' },
    { value: 'cybersecurity', label: '🛡️ Siber Güvenlik Çözümü' },
    { value: 'game', label: '🎮 Oyun Geliştirme' },
    { value: 'iot', label: '📡 IoT / Donanım Entegrasyonu' },
    { value: 'automation', label: '⚙️ RPA / Otomasyon Projesi' },
    { value: 'chatbot', label: '💬 Chatbot / Asistan' },
    { value: 'education', label: '📚 Eğitim / LMS' },
    { value: 'healthtech', label: '🏥 Sağlık Teknolojisi' },
    { value: 'fintech', label: '💰 FinTech Uygulaması' },
    { value: 'other', label: '✨ Diğer' }
  ];

  const handleProjectTypeSelect = (projectType) => {
    onChange({ target: { name: 'projectType', value: projectType } });
  };

  return (
    // Yüksekliği tam ve kaydırılabilir alan.
    <div className="h-full overflow-y-auto"> 
      <div className="w-full space-y-8 pb-4">
        
        {/* Form içeriği için responsive padding ayarı: 
            Küçük ekranlarda px-4 (daha az), büyük ekranlarda lg:px-8 (daha fazla). */}
        <div className="space-y-8 px-4 sm:px-6 lg:px-8"> 
          
          {/* Proje Başlığı */}
          <div>
            <label className="block text-base font-semibold text-blue-200 mb-3">
              Proje Başlığı <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="projectTitle"
              value={formData.projectTitle}
              onChange={onChange}
              // Input/Textarea stilleri korundu
              className={`
                w-full px-4 py-3 bg-blue-900/40 border rounded-lg text-white placeholder-blue-400/80 text-base
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                ${errors.projectTitle ? 'border-red-500 focus:ring-red-500' : 'border-blue-700/50 hover:border-blue-500/80'}
              `}
              placeholder="Örn: Müşteri Panelli Yeni Nesil ERP Sistemi"
            />
            {errors.projectTitle && (
              <p className="mt-2 text-sm text-red-400 flex items-center">
                <MdWarning className="w-4 h-4 mr-2 flex-shrink-0" />
                {errors.projectTitle}
              </p>
            )}
          </div>

          {/* Proje Açıklaması */}
          <div>
            <label className="block text-base font-semibold text-blue-200 mb-3">
              Proje Açıklaması <span className="text-red-400">*</span>
            </label>
            <textarea
              name="projectDescription"
              value={formData.projectDescription}
              onChange={onChange}
              rows={6}
              // Input/Textarea stilleri korundu
              className={`
                w-full px-4 py-3 bg-blue-900/40 border rounded-lg text-white placeholder-blue-400/80 text-base resize-none
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                ${errors.projectDescription ? 'border-red-500 focus:ring-red-500' : 'border-blue-700/50 hover:border-blue-500/80'}
              `}
              placeholder="Projenizin kapsamını, hedeflerini ve ana modüllerini detaylıca açıklayınız. (minimum 20 karakter)"
            />
            <div className="mt-2 flex justify-between items-start">
              {errors.projectDescription ? (
                <p className="text-sm text-red-400 flex items-center">
                  <MdWarning className="w-4 h-4 mr-2 flex-shrink-0" />
                  {errors.projectDescription}
                </p>
              ) : (
                <div />
              )}
              <span className="text-xs text-blue-400/80 ml-auto">
                {formData.projectDescription.length} / 20 minimum
              </span>
            </div>
          </div>

          {/* Proje Tipi */}
          <div>
            <label className="block text-base font-semibold text-blue-200 mb-4">
              Proje Tipi <span className="text-red-400">*</span>
            </label>
            {/* MOBİL UYUMLULUK ODAĞI BURADA: 
                Küçük Ekranlar (default): 2 Sütun
                Orta Ekranlar (sm): 3 Sütun
                Büyük Ekranlar (lg): 4 Sütun */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {PROJECT_TYPES.map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleProjectTypeSelect(type.value)}
                  className={`
                    p-3 rounded-lg border text-center transition-all duration-200 text-sm font-medium
                    ${formData.projectType === type.value
                      ? 'bg-blue-600/50 border-blue-400 text-white shadow-md shadow-blue-500/30'
                      : 'bg-blue-800/30 border-blue-700/50 text-blue-200 hover:bg-blue-700/50 hover:border-blue-500/80'
                    }
                  `}
                >
                  {/* Etiketler, emojiler sayesinde mobil ekranda bile neyin seçildiğini hızla belli eder. */}
                  {type.label} 
                </button>
              ))}
            </div>
            {errors.projectType && (
              <p className="mt-3 text-sm text-red-400 flex items-center">
                <MdWarning className="w-4 h-4 mr-2 flex-shrink-0" />
                {errors.projectType}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfoStep;