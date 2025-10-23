// pages/employer/components/DeveloperRequests/PreferencesStep.jsx
import React from 'react';
import { MdSettings, MdWarning } from 'react-icons/md';

const PreferencesStep = ({ formData, errors, onChange, onMultiSelect }) => {
  const COMMUNICATION_LANGUAGES = ['Türkçe', 'İngilizce'];

  // AI ve Veri Bilimi Sektörleri
  const INDUSTRY_EXPERIENCES = [
    // AI & Tech Industries
    { value: 'ai_ml', label: '🤖 AI / Machine Learning' },
    { value: 'data_science', label: '📊 Veri Bilimi / Analytics' },
    { value: 'nlp', label: '💬 NLP / Metin İşleme' },
    { value: 'computer_vision', label: '👁️ Computer Vision' },
    { value: 'robotics', label: '🦾 Robotik / Otomasyon' },
    
    // Data-Driven Industries
    { value: 'fintech', label: '💰 FinTech / Finansal AI' },
    { value: 'healthcare_ai', label: '🏥 HealthTech / Tıbbi AI' },
    { value: 'ecommerce_ai', label: '🛒 E-Ticaret / Öneri Sistemleri' },
    { value: 'marketing_analytics', label: '📈 Marketing Analytics' },
    { value: 'fraud_detection', label: '🔍 Fraud Detection / Güvenlik' },
    
    // Domain-Specific AI
    { value: 'edtech_ai', label: '📚 EdTech / Eğitim AI' },
    { value: 'agriculture_ai', label: '🌾 Tarım Teknolojisi / AgTech' },
    { value: 'energy_ai', label: '⚡ Enerji / Smart Grid' },
    { value: 'automotive_ai', label: '🚗 Otomotiv / Otonom Araçlar' },
    { value: 'smart_city', label: '🏙️ Akıllı Şehir Teknolojileri' },
    { value: 'climate_tech', label: '🌍 İklim Teknolojisi' },
    
    // Business & Enterprise
    { value: 'enterprise_ai', label: '🏢 Kurumsal AI Çözümleri' },
    { value: 'saas_ai', label: '☁️ SaaS / AI-as-a-Service' },
    { value: 'consulting', label: '💼 Danışmanlık / AI Stratejisi' },
    
    // Research & Academia
    { value: 'research', label: '🔬 Araştırma / Akademik' },
    
    { value: 'other', label: '✨ Diğer' },
    { value: 'no_preference', label: '🔀 Fark Etmez' }
  ];

  const PRIORITIES = [
    { value: 'normal', label: '📋 Normal' },
    { value: 'high', label: '⚠️ Yüksek' },
    { value: 'urgent', label: '🚨 Acil' }
  ];

  // AI/Data Science Proje Tipleri (ProjectInfoStep'ten kopyalandı)
  const PROJECT_TYPES = [
    // Machine Learning
    { value: 'machine_learning', label: '🤖 Machine Learning Projesi' },
    { value: 'supervised_learning', label: '📈 Supervised Learning' },
    { value: 'unsupervised_learning', label: '🔍 Unsupervised Learning' },
    { value: 'reinforcement_learning', label: '🎯 Reinforcement Learning' },
    
    // Deep Learning
    { value: 'deep_learning', label: '🧠 Deep Learning Projesi' },
    { value: 'neural_networks', label: '🕸️ Neural Networks' },
    { value: 'cnn', label: '📸 CNN (Convolutional)' },
    { value: 'rnn_lstm', label: '🔄 RNN / LSTM' },
    { value: 'transformer', label: '⚡ Transformer Modelleri' },
    
    // NLP
    { value: 'nlp', label: '💬 NLP Uygulaması' },
    { value: 'sentiment_analysis', label: '😊 Sentiment Analizi' },
    { value: 'text_classification', label: '📝 Metin Sınıflandırma' },
    { value: 'chatbot', label: '🤖 Chatbot / Conversational AI' },
    { value: 'text_generation', label: '✍️ Metin Üretme' },
    { value: 'named_entity_recognition', label: '🏷️ NER' },
    
    // Computer Vision
    { value: 'computer_vision', label: '👁️ Computer Vision Projesi' },
    { value: 'image_classification', label: '🖼️ Görüntü Sınıflandırma' },
    { value: 'object_detection', label: '🎯 Nesne Tespiti' },
    { value: 'face_recognition', label: '👤 Yüz Tanıma' },
    { value: 'image_segmentation', label: '✂️ Görüntü Segmentasyonu' },
    { value: 'ocr', label: '📄 OCR' },
    
    // Generative AI
    { value: 'generative_ai', label: '✨ Generative AI Projesi' },
    { value: 'gpt_llm', label: '🧠 GPT / LLM Uygulaması' },
    { value: 'image_generation', label: '🎨 Görüntü Üretimi' },
    { value: 'text_to_image', label: '🖼️ Text-to-Image' },
    { value: 'ai_assistant', label: '🤝 AI Asistan / Agent' },
    
    // Data
    { value: 'data_analytics', label: '📊 Veri Analitiği' },
    { value: 'predictive_analytics', label: '🔮 Tahminsel Analitik' },
    { value: 'data_visualization', label: '📈 Veri Görselleştirme' },
    { value: 'statistical_analysis', label: '📉 İstatistiksel Analiz' },
    { value: 'exploratory_data_analysis', label: '🔬 EDA' },
    
    // Data Engineering
    { value: 'data_engineering', label: '⚙️ Veri Mühendisliği' },
    { value: 'etl_pipeline', label: '🔄 ETL Pipeline' },
    { value: 'data_warehouse', label: '🏢 Data Warehouse' },
    { value: 'big_data', label: '💾 Big Data İşleme' },
    { value: 'real_time_data', label: '⚡ Gerçek Zamanlı Veri' },
    
    // Other
    { value: 'recommendation_system', label: '🎯 Öneri Sistemi' },
    { value: 'time_series', label: '📅 Zaman Serisi Analizi' },
    { value: 'forecasting', label: '🔮 Tahminleme' },
    { value: 'anomaly_detection', label: '⚠️ Anomali Tespiti' },
    { value: 'ai_ethics', label: '⚖️ AI Etiği ve Yönetişim' },
    { value: 'mlops', label: '🚀 MLOps / Model Deployment' },
    { value: 'other', label: '✨ Diğer AI/Data Projesi' }
  ];

  const EXPERIENCE_LEVELS = [
    { value: 'intern', label: '🎓 Stajyer / Öğrenci' },
    { value: 'junior', label: '🌱 Junior (0-2 yıl)' },
    { value: 'mid', label: '🚀 Mid-level (2-5 yıl)' },
    { value: 'senior', label: '⭐ Senior (5+ yıl)' },
    { value: 'expert', label: '💎 Expert / Lead (8+ yıl)' }
  ];

  const WORK_TYPES = [
    { value: 'freelance', label: '💼 Freelance / Proje Bazlı' },
    { value: 'part_time', label: '⏰ Part-time' },
    { value: 'full_time', label: '🕘 Full-time' },
    { value: 'contract', label: '📝 Kontrat / Danışmanlık' },
    { value: 'intern', label: '🎓 Stajyer' }
  ];

  const WORK_STYLES = [
    { value: 'remote', label: '🏠 Remote (Uzaktan)' },
    { value: 'hybrid', label: '🏢 Hibrit (Esnek)' },
    { value: 'office', label: '🏬 Ofiste (On-site)' }
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
            ? 'bg-gradient-to-r from-blue-600/60 to-purple-600/60 border-blue-400 text-white shadow-lg shadow-blue-500/30'
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
            ? 'bg-gradient-to-r from-blue-600/60 to-purple-600/60 border-blue-400 text-white shadow-lg shadow-blue-500/30' 
            : 'bg-blue-800/30 border-blue-700/50 text-blue-200 hover:bg-blue-700/50 hover:border-blue-500/80'
          }
        `}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onMultiSelect(fieldName, item)}
          className="h-4 w-4 rounded text-blue-500 bg-blue-900/40 border-blue-600/50 focus:ring-blue-500 focus:ring-offset-blue-900/50"
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
    <div className="h-full overflow-y-auto">
      <div className="w-full space-y-10 pb-4">
        <div className="space-y-10 px-4 sm:px-6 lg:px-8">
          
          {/* AI/Data Science Info Banner */}
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
                <MdSettings className="w-5 h-5 text-purple-300" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold mb-2">🤖 AI/Data Science Tercihleri</h4>
                <p className="text-sm text-purple-200">
                  Yapay zeka ve veri bilimi projeleriniz için en uygun yetenekleri bulmanıza yardımcı olacak tercihlerinizi belirleyin.
                </p>
              </div>
            </div>
          </div>

          {/* İletişim Dilleri ve AI Sektörü */}
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
              <Label optional>AI/Data Science Sektör Deneyimi</Label>
              <select
                name="industryExperience"
                value={formData.industryExperience}
                onChange={onChange}
                className="w-full px-4 py-3 bg-blue-900/40 border border-blue-700/50 rounded-lg text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-500/80 transition-all duration-200"
              >
                <option value="" className="bg-blue-900 text-blue-300">Seçiniz</option>
                <optgroup label="🤖 AI & Machine Learning" className="bg-blue-900">
                  {INDUSTRY_EXPERIENCES.filter(i => ['ai_ml', 'data_science', 'nlp', 'computer_vision', 'robotics'].includes(i.value)).map(industry => (
                    <option key={industry.value} value={industry.value} className="bg-blue-900 text-white">
                      {industry.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="📊 Data-Driven Industries" className="bg-blue-900">
                  {INDUSTRY_EXPERIENCES.filter(i => ['fintech', 'healthcare_ai', 'ecommerce_ai', 'marketing_analytics', 'fraud_detection'].includes(i.value)).map(industry => (
                    <option key={industry.value} value={industry.value} className="bg-blue-900 text-white">
                      {industry.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="🏭 Domain-Specific AI" className="bg-blue-900">
                  {INDUSTRY_EXPERIENCES.filter(i => ['edtech_ai', 'agriculture_ai', 'energy_ai', 'automotive_ai', 'smart_city', 'climate_tech'].includes(i.value)).map(industry => (
                    <option key={industry.value} value={industry.value} className="bg-blue-900 text-white">
                      {industry.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="🏢 Business & Research" className="bg-blue-900">
                  {INDUSTRY_EXPERIENCES.filter(i => ['enterprise_ai', 'saas_ai', 'consulting', 'research', 'other', 'no_preference'].includes(i.value)).map(industry => (
                    <option key={industry.value} value={industry.value} className="bg-blue-900 text-white">
                      {industry.label}
                    </option>
                  ))}
                </optgroup>
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
              <Label optional>Bütçe Aralığı (AI/ML Projeleri için)</Label>
              <input
                type="text"
                name="budgetRange"
                value={formData.budgetRange}
                onChange={onChange}
                className="w-full px-4 py-3 bg-blue-900/40 border border-blue-700/50 rounded-lg text-white placeholder-blue-400/80 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-500/80 transition-all duration-200"
                placeholder="Örn: 25000-50000 TL"
              />
              <p className="mt-3 text-sm text-blue-400/80 leading-relaxed">
                💡 AI ve ML projeleri için önerilen bütçe: 20.000-100.000 TL arası. Model karmaşıklığına ve veri büyüklüğüne göre değişkenlik gösterebilir.
              </p>
            </div>
          </div>

          {/* AI/Data Science Talep Özeti */}
          <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-lg p-6 border border-purple-700/50 shadow-inner">
            <h4 className="text-xl font-bold text-white mb-6 flex items-center border-b border-purple-700/30 pb-3">
              <span className="mr-3 text-2xl">🤖</span>
              AI/Data Science Talep Özeti
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
              
              {/* Sol Sütun */}
              <div className="space-y-4">
                <SummaryItem 
                  label="Proje" 
                  value={formData.projectTitle || 'Belirtilmemiş'} 
                  truncate 
                />
                <SummaryItem 
                  label="AI/Data Tipi" 
                  value={PROJECT_TYPES.find(t => t.value === formData.projectType)?.label.replace(/^[^\s]+\s/, '') || 'Belirtilmemiş'}
                />
                <SummaryItem 
                  label="Deneyim" 
                  value={EXPERIENCE_LEVELS.find(e => e.value === formData.experienceLevel)?.label.replace(/^[^\s]+\s/, '') || 'Belirtilmemiş'}
                />
              </div>

              {/* Orta Sütun */}
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
                  label="AI Teknolojileri" 
                  value={`${formData.technologies?.length || 0} adet`}
                />
                <SummaryItem 
                  label="Öncelik" 
                  value={PRIORITIES.find(p => p.value === formData.priority)?.label.replace(/^[^\s]+\s/, '') || 'Belirtilmemiş'}
                />
                <SummaryItem 
                  label="Sektör" 
                  value={INDUSTRY_EXPERIENCES.find(i => i.value === formData.industryExperience)?.label.replace(/^[^\s]+\s/, '') || 'Belirtilmemiş'}
                />
              </div>
            </div>
            
            {/* Bütçe Kartı */}
            {formData.budgetRange && (
              <div className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-green-300 font-medium flex items-center">
                    <span className="mr-2">💰</span>
                    AI/ML Proje Bütçesi:
                  </span>
                  <span className="text-white font-bold text-lg">{formData.budgetRange}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Yardımcı Bileşen: Özet Satırı ---
const SummaryItem = ({ label, value, truncate = false, capitalize = false }) => {
  let displayValue = value;
  if (capitalize && typeof value === 'string') {
    displayValue = value.charAt(0).toUpperCase() + value.slice(1);
  }

  return (
    <div className="flex justify-between items-center py-2 border-b border-purple-700/20 last:border-b-0">
      <span className="text-purple-300 font-medium">{label}:</span>
      <span className={`text-white font-semibold text-right max-w-[60%] ${truncate ? 'truncate' : ''}`}>
        {displayValue}
      </span>
    </div>
  );
};

export default PreferencesStep;