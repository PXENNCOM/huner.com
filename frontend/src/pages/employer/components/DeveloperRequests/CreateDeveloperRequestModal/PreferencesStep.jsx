// pages/employer/components/DeveloperRequests/PreferencesStep.jsx
import React from 'react';
import { MdSettings, MdWarning } from 'react-icons/md';

const PreferencesStep = ({ formData, errors, onChange, onMultiSelect }) => {
  const COMMUNICATION_LANGUAGES = ['Türkçe', 'İngilizce'];

  const INDUSTRY_EXPERIENCES = [
    { value: 'ecommerce', label: '🛒 E-Ticaret' },
    { value: 'fintech', label: '💰 FinTech' },
    { value: 'healthcare', label: '🏥 Sağlık' },
    { value: 'education', label: '📚 Eğitim' },
    { value: 'gaming', label: '🎮 Oyun' },
    { value: 'social_media', label: '📱 Sosyal Medya' },
    { value: 'enterprise', label: '🏢 Kurumsal / ERP' },
    { value: 'saas', label: '☁️ SaaS / B2B Yazılımlar' },
    { value: 'travel', label: '✈️ Seyahat & Turizm' },
    { value: 'real_estate', label: '🏠 Gayrimenkul' },
    { value: 'logistics', label: '🚚 Lojistik & Kargo' },
    { value: 'retail', label: '🛍️ Perakende' },
    { value: 'cybersecurity', label: '🛡️ Siber Güvenlik' },
    { value: 'blockchain', label: '⛓️ Blockchain / Web3' },
    { value: 'iot', label: '📡 IoT & Donanım' },
    { value: 'energy', label: '⚡ Enerji & Çevre' },
    { value: 'media', label: '🎬 Medya & Yayıncılık' },
    { value: 'automotive', label: '🚗 Otomotiv' },
    { value: 'government', label: '🏛️ Kamu & Devlet' },
    { value: 'other', label: '✨ Diğer' },
    { value: 'no_preference', label: '🔀 Fark Etmez' }
  ];

  const PRIORITIES = [
    { value: 'normal', label: '📋 Normal' },
    { value: 'high', label: '⚠️ Yüksek' },
    { value: 'urgent', label: '🚨 Acil' }
  ];

  // CONSTANTS for summary (Özet için gerekli olanlar)
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

  const WORK_STYLES = [
    { value: 'remote', label: '🏠 Remote' },
    { value: 'hybrid', label: '🏢 Hibrit' },
    { value: 'office', label: '🏬 Ofiste' }
  ];

  const handleSelectOption = (fieldName, value) => {
    onChange({ target: { name: fieldName, value } });
  };

  // --- Yardımcı Bileşenler ---

  const OptionButton = ({ fieldName, option }) => {
    const isSelected = formData[fieldName] === option.value;
    return (
      <button
        key={option.value}
        type="button"
        onClick={() => handleSelectOption(fieldName, option.value)}
        className={`
          w-full p-4 rounded-lg border text-left transition-all duration-200 text-sm font-medium
          ${isSelected
            ? 'bg-blue-600/50 border-blue-400 text-white shadow-md shadow-blue-500/30'
            : 'bg-blue-800/30 border-blue-700/50 text-blue-200 hover:bg-blue-700/50 hover:border-blue-500/80'
          }
        `}
      >
        <div className="font-semibold">{option.label}</div>
      </button>
    );
  };

  const MultiSelectCheckbox = ({ item, fieldName }) => {
    const isSelected = formData[fieldName]?.includes(item);
    return (
        <label 
            key={item} 
            className={`
                flex items-center space-x-4 cursor-pointer p-4 rounded-lg border transition-all duration-200 text-sm font-medium
                ${isSelected 
                    ? 'bg-blue-600/50 border-blue-400 text-white shadow-md shadow-blue-500/30' 
                    : 'bg-blue-800/30 border-blue-700/50 text-blue-200 hover:bg-blue-700/50 hover:border-blue-500/80'
                }
            `}
        >
            <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onMultiSelect(fieldName, item)}
                className={`
                    h-4 w-4 rounded 
                    text-blue-500 bg-blue-900/40 border-blue-600/50 
                    focus:ring-blue-500 focus:ring-offset-blue-900/50
                `}
            />
            <span className="font-semibold">{item}</span>
        </label>
    );
  };
  
  const Label = ({ children, optional = false }) => (
    <label className="block text-base font-semibold text-blue-200 mb-4">
      {children} 
      {optional && <span className="text-blue-400/80 text-sm ml-2 font-normal">(İsteğe bağlı)</span>}
    </label>
  );

  // --- Ana Bileşen Render ---
  
  return (
    // Tam genişlik ve kaydırılabilir alan.
    <div className="h-full overflow-y-auto">
      <div className="w-full space-y-10 pb-4">
        
        {/* Form içeriği için responsive padding */}
        <div className="space-y-10 px-4 sm:px-6 lg:px-8">
          
          {/* İletişim Dilleri ve Sektör */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Label optional>İletişim Dilleri</Label>
              <div className="space-y-3">
                {COMMUNICATION_LANGUAGES.map(lang => (
                  <MultiSelectCheckbox key={lang} item={lang} fieldName="communicationLanguages" />
                ))}
              </div>
            </div>

            <div>
              <Label optional>Sektör Deneyimi</Label>
              <select
                name="industryExperience"
                value={formData.industryExperience}
                onChange={onChange}
                className="
                  w-full px-4 py-3 bg-blue-900/40 border border-blue-700/50 rounded-lg text-white text-base
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-500/80 transition-all duration-200
                "
              >
                <option value="" className="bg-blue-900 text-blue-300">Seçiniz</option>
                {INDUSTRY_EXPERIENCES.map(industry => (
                  <option key={industry.value} value={industry.value} className="bg-blue-900 text-white">
                    {industry.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Öncelik ve Bütçe */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Label>Öncelik Durumu</Label>
              <div className="space-y-3">
                {PRIORITIES.map(priority => (
                  <OptionButton key={priority.value} fieldName="priority" option={priority} />
                ))}
              </div>
            </div>

            <div>
              <Label optional>Bütçe Aralığı</Label>
              <input
                type="text"
                name="budgetRange"
                value={formData.budgetRange}
                onChange={onChange}
                className="
                  w-full px-4 py-3 bg-blue-900/40 border border-blue-700/50 rounded-lg text-white placeholder-blue-400/80 text-base
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-500/80 transition-all duration-200
                "
                placeholder="Örn: 15000-25000 TL"
              />
              <p className="mt-3 text-sm text-blue-400/80 leading-relaxed">
                💡 Tahmini bütçe aralığınızı belirtmek, ilgili geliştiricileri bulmanıza yardımcı olur.
              </p>
            </div>
          </div>

          {/* Talep Özeti (Talep Özeti alanı tam genişlikte kalabilir) */}
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-lg p-6 border border-blue-700/50 shadow-inner">
            <h4 className="text-xl font-bold text-white mb-6 flex items-center border-b border-blue-700/30 pb-3">
              <span className="mr-3 text-2xl">📋</span>
              Talep Özeti
            </h4>
            
            {/* Özet Satırları: 2 sütunlu grid, mobil uyumlu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
              
              {/* Sol Sütun */}
              <div className="space-y-4">
                <SummaryItem 
                  label="Proje" 
                  value={formData.projectTitle || 'Belirtilmemiş'} 
                  truncate 
                />
                <SummaryItem 
                  label="Tip" 
                  value={PROJECT_TYPES.find(t => t.value === formData.projectType)?.label.replace(/^[^\s]+\s/, '') || 'Belirtilmemiş'}
                />
                <SummaryItem 
                  label="Deneyim" 
                  value={EXPERIENCE_LEVELS.find(e => e.value === formData.experienceLevel)?.label.replace(/^[^\s]+\s/, '') || 'Belirtilmemiş'}
                />
              </div>

              {/* Orta Sütun (Süre kaldırıldığı için bu sütuna yeni alanlar eklenmeli veya aşağıdaki alanlar yukarı kaydırılmalı) */}
              <div className="space-y-4">
                <SummaryItem 
                  label="Çalışma Tipi" 
                  value={WORK_TYPES.find(w => w.value === formData.workType)?.label.replace(/^[^\s]+\s/, '') || 'Belirtilmemiş'}
                />
                <SummaryItem 
                  label="Çalışma Şekli" 
                  value={WORK_STYLES.find(s => s.value === formData.workStyle)?.label.replace(/^[^\s]+\s/, '') || 'Belirtilmemiş'}
                />
                <SummaryItem 
                  label="Konum" 
                  value={formData.location || 'Fark Etmez'} 
                  capitalize 
                />
              </div>

              {/* Sağ Sütun */}
              <div className="space-y-4">
                <SummaryItem 
                  label="Teknoloji" 
                  value={`${formData.technologies?.length || 0} adet`}
                />
                <SummaryItem 
                  label="Öncelik" 
                  value={PRIORITIES.find(p => p.value === formData.priority)?.label.replace(/^[^\s]+\s/, '') || 'Belirtilmemiş'}
                />
                {/* Bütçe alanı buraya eklenebilir veya ayrı bir kart olarak kalabilir. Mevcut tasarımda ayrı tutuyorum. */}
              </div>
            </div>
            
            {/* Bütçe: Özete dahil bir kart olarak bırakıldı */}
            {formData.budgetRange && (
              <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-blue-300 font-medium flex items-center">
                    <span className="mr-2">💰</span>
                    Bütçe:
                  </span>
                  <span className="text-white font-bold">{formData.budgetRange}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Yeni Yardımcı Bileşen: Özet Satırı ---
const SummaryItem = ({ label, value, truncate = false, capitalize = false }) => {
    let displayValue = value;
    if (capitalize && typeof value === 'string') {
        displayValue = value.charAt(0).toUpperCase() + value.slice(1);
    }

    return (
        <div className="flex justify-between items-center py-2 border-b border-blue-700/20 last:border-b-0">
            <span className="text-blue-300 font-medium">{label}:</span>
            <span className={`text-white font-semibold text-right max-w-[60%] ${truncate ? 'truncate' : ''}`}>
                {displayValue}
            </span>
        </div>
    );
};


export default PreferencesStep;