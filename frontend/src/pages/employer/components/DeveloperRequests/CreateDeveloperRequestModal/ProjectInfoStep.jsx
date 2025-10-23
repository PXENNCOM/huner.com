// pages/employer/components/DeveloperRequests/ProjectInfoStep.jsx
import React from 'react';
import { MdCode, MdWarning } from 'react-icons/md';

const ProjectInfoStep = ({ formData, errors, onChange }) => {
  // AI ve Veri Bilimi Odaklı Proje Tipleri
  const PROJECT_TYPES = [
    // Machine Learning
    { value: 'machine_learning', label: '🤖 Machine Learning Projesi', category: 'ML' },
    { value: 'supervised_learning', label: '📈 Supervised Learning', category: 'ML' },
    { value: 'unsupervised_learning', label: '🔍 Unsupervised Learning', category: 'ML' },
    { value: 'reinforcement_learning', label: '🎯 Reinforcement Learning', category: 'ML' },
    
    // Deep Learning
    { value: 'deep_learning', label: '🧠 Deep Learning Projesi', category: 'DL' },
    { value: 'neural_networks', label: '🕸️ Neural Networks', category: 'DL' },
    { value: 'cnn', label: '📸 CNN (Convolutional)', category: 'DL' },
    { value: 'rnn_lstm', label: '🔄 RNN / LSTM', category: 'DL' },
    { value: 'transformer', label: '⚡ Transformer Modelleri', category: 'DL' },
    
    // Natural Language Processing
    { value: 'nlp', label: '💬 NLP Uygulaması', category: 'NLP' },
    { value: 'sentiment_analysis', label: '😊 Sentiment Analizi', category: 'NLP' },
    { value: 'text_classification', label: '📝 Metin Sınıflandırma', category: 'NLP' },
    { value: 'chatbot', label: '🤖 Chatbot / Conversational AI', category: 'NLP' },
    { value: 'text_generation', label: '✍️ Metin Üretme', category: 'NLP' },
    { value: 'named_entity_recognition', label: '🏷️ NER (Entity Recognition)', category: 'NLP' },
    
    // Computer Vision
    { value: 'computer_vision', label: '👁️ Computer Vision Projesi', category: 'CV' },
    { value: 'image_classification', label: '🖼️ Görüntü Sınıflandırma', category: 'CV' },
    { value: 'object_detection', label: '🎯 Nesne Tespiti', category: 'CV' },
    { value: 'face_recognition', label: '👤 Yüz Tanıma', category: 'CV' },
    { value: 'image_segmentation', label: '✂️ Görüntü Segmentasyonu', category: 'CV' },
    { value: 'ocr', label: '📄 OCR (Optical Character Recognition)', category: 'CV' },
    
    // Generative AI
    { value: 'generative_ai', label: '✨ Generative AI Projesi', category: 'GenAI' },
    { value: 'gpt_llm', label: '🧠 GPT / LLM Uygulaması', category: 'GenAI' },
    { value: 'image_generation', label: '🎨 Görüntü Üretimi (GAN/Diffusion)', category: 'GenAI' },
    { value: 'text_to_image', label: '🖼️ Text-to-Image', category: 'GenAI' },
    { value: 'ai_assistant', label: '🤝 AI Asistan / Agent', category: 'GenAI' },
    
    // Data Science & Analytics
    { value: 'data_analytics', label: '📊 Veri Analitiği', category: 'Data' },
    { value: 'predictive_analytics', label: '🔮 Tahminsel Analitik', category: 'Data' },
    { value: 'data_visualization', label: '📈 Veri Görselleştirme', category: 'Data' },
    { value: 'statistical_analysis', label: '📉 İstatistiksel Analiz', category: 'Data' },
    { value: 'exploratory_data_analysis', label: '🔬 Keşifsel Veri Analizi (EDA)', category: 'Data' },
    
    // Data Engineering
    { value: 'data_engineering', label: '⚙️ Veri Mühendisliği', category: 'DataEng' },
    { value: 'etl_pipeline', label: '🔄 ETL Pipeline', category: 'DataEng' },
    { value: 'data_warehouse', label: '🏢 Data Warehouse', category: 'DataEng' },
    { value: 'big_data', label: '💾 Big Data İşleme', category: 'DataEng' },
    { value: 'real_time_data', label: '⚡ Gerçek Zamanlı Veri İşleme', category: 'DataEng' },
    
    // Recommendation Systems
    { value: 'recommendation_system', label: '🎯 Öneri Sistemi', category: 'RecSys' },
    { value: 'collaborative_filtering', label: '👥 Collaborative Filtering', category: 'RecSys' },
    { value: 'content_based', label: '📑 Content-Based Filtering', category: 'RecSys' },
    
    // Time Series & Forecasting
    { value: 'time_series', label: '📅 Zaman Serisi Analizi', category: 'TimeSeries' },
    { value: 'forecasting', label: '🔮 Tahminleme / Forecasting', category: 'TimeSeries' },
    { value: 'anomaly_detection', label: '⚠️ Anomali Tespiti', category: 'TimeSeries' },
    
    // AI Ethics & Governance
    { value: 'ai_ethics', label: '⚖️ AI Etiği ve Yönetişim', category: 'Ethics' },
    { value: 'bias_detection', label: '🔍 Model Bias Tespiti', category: 'Ethics' },
    { value: 'explainable_ai', label: '💡 Açıklanabilir AI (XAI)', category: 'Ethics' },
    
    // MLOps & Deployment
    { value: 'mlops', label: '🚀 MLOps / Model Deployment', category: 'MLOps' },
    { value: 'model_monitoring', label: '📊 Model İzleme', category: 'MLOps' },
    { value: 'ab_testing', label: '🧪 A/B Testing', category: 'MLOps' },
    
    { value: 'other', label: '✨ Diğer AI/Data Projesi', category: 'Other' }
  ];

  // Kategori başlıkları ve renkleri
  const CATEGORIES = {
    'ML': { name: '🤖 Machine Learning', color: 'from-blue-600/20 to-cyan-600/20 border-blue-500/30' },
    'DL': { name: '🧠 Deep Learning', color: 'from-purple-600/20 to-pink-600/20 border-purple-500/30' },
    'NLP': { name: '💬 Natural Language Processing', color: 'from-green-600/20 to-emerald-600/20 border-green-500/30' },
    'CV': { name: '👁️ Computer Vision', color: 'from-indigo-600/20 to-blue-600/20 border-indigo-500/30' },
    'GenAI': { name: '✨ Generative AI', color: 'from-yellow-600/20 to-orange-600/20 border-yellow-500/30' },
    'Data': { name: '📊 Data Science & Analytics', color: 'from-pink-600/20 to-rose-600/20 border-pink-500/30' },
    'DataEng': { name: '⚙️ Data Engineering', color: 'from-slate-600/20 to-gray-600/20 border-slate-500/30' },
    'RecSys': { name: '🎯 Recommendation Systems', color: 'from-teal-600/20 to-cyan-600/20 border-teal-500/30' },
    'TimeSeries': { name: '📅 Time Series & Forecasting', color: 'from-orange-600/20 to-amber-600/20 border-orange-500/30' },
    'Ethics': { name: '⚖️ AI Ethics & Governance', color: 'from-violet-600/20 to-purple-600/20 border-violet-500/30' },
    'MLOps': { name: '🚀 MLOps & Deployment', color: 'from-red-600/20 to-rose-600/20 border-red-500/30' },
    'Other': { name: '✨ Diğer', color: 'from-gray-600/20 to-slate-600/20 border-gray-500/30' }
  };

  const handleProjectTypeSelect = (projectType) => {
    onChange({ target: { name: 'projectType', value: projectType } });
  };

  // Kategorilere göre grupla
  const groupedTypes = PROJECT_TYPES.reduce((acc, type) => {
    if (!acc[type.category]) {
      acc[type.category] = [];
    }
    acc[type.category].push(type);
    return acc;
  }, {});

  return (
    <div className="h-full overflow-y-auto">
      <div className="w-full space-y-8 pb-4">
        <div className="space-y-8 px-4 sm:px-6 lg:px-8">
          
          {/* Proje Başlığı */}
          <div>
            <label className="block text-base font-semibold text-blue-200 mb-3">
              AI/Data Science Proje Başlığı <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="projectTitle"
              value={formData.projectTitle}
              onChange={onChange}
              className={`
                w-full px-4 py-3 bg-blue-900/40 border rounded-lg text-white placeholder-blue-400/80 text-base
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                ${errors.projectTitle ? 'border-red-500 focus:ring-red-500' : 'border-blue-700/50 hover:border-blue-500/80'}
              `}
              placeholder="Örn: Müşteri Churn Tahmini ML Modeli, Sentiment Analizi Chatbot"
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
              className={`
                w-full px-4 py-3 bg-blue-900/40 border rounded-lg text-white placeholder-blue-400/80 text-base resize-none
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                ${errors.projectDescription ? 'border-red-500 focus:ring-red-500' : 'border-blue-700/50 hover:border-blue-500/80'}
              `}
              placeholder="AI/Data Science projenizin kapsamını, kullanılacak algoritmaları, veri kaynaklarını ve hedeflerini detaylıca açıklayınız. (minimum 20 karakter)"
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

          {/* Proje Tipi - Kategorilere Göre */}
          <div>
            <label className="block text-base font-semibold text-blue-200 mb-4">
              AI/Data Science Proje Tipi <span className="text-red-400">*</span>
            </label>
            <p className="text-sm text-blue-300 mb-4">
              Yapay zeka ve veri bilimi alanında gerçekleştireceğiniz projenin tipini seçin
            </p>

            <div className="space-y-6">
              {Object.keys(CATEGORIES).map(categoryKey => {
                const category = CATEGORIES[categoryKey];
                const types = groupedTypes[categoryKey] || [];
                
                if (types.length === 0) return null;

                return (
                  <div key={categoryKey} className={`bg-gradient-to-br ${category.color} rounded-xl p-4 border`}>
                    <h4 className="text-sm font-semibold text-white mb-3">
                      {category.name}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {types.map(type => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => handleProjectTypeSelect(type.value)}
                          className={`
                            p-2.5 rounded-lg border text-left transition-all duration-200 text-sm font-medium
                            ${formData.projectType === type.value
                              ? 'bg-blue-600/60 border-blue-400 text-white shadow-lg shadow-blue-500/30 scale-105'
                              : 'bg-blue-900/40 border-blue-700/50 text-blue-200 hover:bg-blue-800/60 hover:border-blue-500/80 hover:scale-102'
                            }
                          `}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {errors.projectType && (
              <p className="mt-3 text-sm text-red-400 flex items-center">
                <MdWarning className="w-4 h-4 mr-2 flex-shrink-0" />
                {errors.projectType}
              </p>
            )}
          </div>

          {/* AI/Data Info Box */}
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
                <MdCode className="w-5 h-5 text-purple-300" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold mb-2">💡 Proje Tipi Seçim İpuçları</h4>
                <ul className="text-sm text-purple-200 space-y-1">
                  <li>• <strong>ML/DL:</strong> Model eğitimi ve tahminleme projeleri</li>
                  <li>• <strong>NLP:</strong> Metin işleme ve dil modeli uygulamaları</li>
                  <li>• <strong>Computer Vision:</strong> Görüntü işleme ve analiz projeleri</li>
                  <li>• <strong>Generative AI:</strong> İçerik üretimi ve LLM uygulamaları</li>
                  <li>• <strong>Data Science:</strong> Veri analizi ve görselleştirme</li>
                  <li>• <strong>Data Engineering:</strong> Veri pipeline ve ETL işlemleri</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfoStep;