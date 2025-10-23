// AdminCreateProjectIdea.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createProjectIdea } from '../../services/adminApi';
import AdminLayout from './AdminLayout';

const AdminCreateProjectIdea = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Machine Learning',
    difficulty: 'Orta',
    estimatedDays: '',
    technologies: '',
    resources: '',
    requirements: '',
    image: ''
  });

  // AI Kategorileri
  const categories = [
    'Machine Learning',
    'Deep Learning',
    'Natural Language Processing (NLP)',
    'Computer Vision',
    'Generative AI',
    'Autonomous Agents & Multi-Agent Systems',
    'Data Science & Analytics',
    'Data Engineering',
    'Reinforcement Learning',
    'AI Ethics & Governance'
  ];

  // Kategori İkonları
  const categoryIcons = {
    'Machine Learning': '🤖',
    'Deep Learning': '🧠',
    'Natural Language Processing (NLP)': '💬',
    'Computer Vision': '👁️',
    'Generative AI': '✨',
    'Autonomous Agents & Multi-Agent Systems': '🤝',
    'Data Science & Analytics': '📊',
    'Data Engineering': '⚙️',
    'Reinforcement Learning': '🎯',
    'AI Ethics & Governance': '⚖️'
  };

  // Kategori Açıklamaları
  const categoryDescriptions = {
    'Machine Learning': 'Makine Öğrenmesi - Temel ML algoritmaları ve uygulamaları',
    'Deep Learning': 'Derin Öğrenme - Neural Networks ve ileri seviye modeller',
    'Natural Language Processing (NLP)': 'Doğal Dil İşleme - Metin analizi ve dil modelleri',
    'Computer Vision': 'Bilgisayarlı Görü - Görüntü işleme ve nesne tanıma',
    'Generative AI': 'Üretken Yapay Zeka - GPT, DALL-E gibi üretken modeller',
    'Autonomous Agents & Multi-Agent Systems': 'Otonom Ajanlar - Akıllı ajan sistemleri',
    'Data Science & Analytics': 'Veri Bilimi - Veri analizi ve görselleştirme',
    'Data Engineering': 'Veri Mühendisliği - Veri pipeline ve ETL süreçleri',
    'Reinforcement Learning': 'Pekiştirmeli Öğrenme - Ödül tabanlı öğrenme',
    'AI Ethics & Governance': 'AI Etiği - Yapay zekanın etik kullanımı'
  };

  const difficulties = [
    { value: 'Kolay', label: 'Kolay', icon: '🟢', description: 'Başlangıç seviyesi, temel kavramlar' },
    { value: 'Orta', label: 'Orta', icon: '🟡', description: 'Orta seviye, entegrasyon gerekli' },
    { value: 'Zor', label: 'Zor', icon: '🔴', description: 'İleri seviye, karmaşık yapı' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Proje başlığı gereklidir');
      return false;
    }
    if (formData.title.length < 3 || formData.title.length > 200) {
      setError('Başlık 3-200 karakter arasında olmalıdır');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Proje açıklaması gereklidir');
      return false;
    }
    if (formData.description.length < 20 || formData.description.length > 5000) {
      setError('Açıklama 20-5000 karakter arasında olmalıdır');
      return false;
    }
    if (!formData.estimatedDays) {
      setError('Tahmini süre gereklidir');
      return false;
    }
    const days = parseInt(formData.estimatedDays);
    if (days < 1 || days > 365) {
      setError('Tahmini süre 1-365 gün arasında olmalıdır');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const projectData = {
        ...formData,
        estimatedDays: parseInt(formData.estimatedDays)
      };
      
      const response = await createProjectIdea(projectData);
      
      console.log('Proje fikri oluşturuldu:', response.data);
      
      navigate('/admin/project-ideas', { 
        state: { 
          message: 'Proje fikri başarıyla oluşturuldu!',
          type: 'success'
        }
      });
      
    } catch (error) {
      console.error('Proje fikri oluşturma hatası:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                           error.response.data?.errors?.join(', ') ||
                           `Server hatası: ${error.response.status}`;
        setError(errorMessage);
      } else if (error.request) {
        setError('Sunucuya ulaşılamıyor. İnternet bağlantınızı kontrol edin.');
      } else {
        setError('Proje fikri oluşturulurken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🤖 Yeni AI Proje Fikri Oluştur</h1>
            <p className="text-gray-600">Yapay Zeka alanında öğrenciler için yeni bir proje fikri ekleyin</p>
          </div>
          <Link
            to="/admin/project-ideas"
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            ← Geri Dön
          </Link>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow border">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                <div className="flex items-center">
                  <span className="mr-2">⚠️</span>
                  <div>
                    <div className="font-medium">{error}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Proje Başlığı <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Örn: Sentiment Analizi Uygulaması"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={200}
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                {formData.title.length}/200 karakter
              </p>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                AI Kategorisi <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {categoryIcons[category]} {category}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                {categoryDescriptions[formData.category]}
              </p>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zorluk Seviyesi <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {difficulties.map(diff => (
                  <label key={diff.value} className="flex items-center">
                    <input
                      type="radio"
                      name="difficulty"
                      value={diff.value}
                      checked={formData.difficulty === diff.value}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-3 flex items-center">
                      <span className="mr-2">{diff.icon}</span>
                      <span className="font-medium">{diff.label}</span>
                      <span className="ml-2 text-sm text-gray-500">- {diff.description}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Proje Açıklaması <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="AI projesi hakkında detaylı bilgi verin. Projenin amacı, hangi AI teknolojilerini kullandığı, hangi problemleri çözdüğü, temel özellikleri ve öğrencinin neler öğreneceği hakkında bilgi ekleyin..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                maxLength={5000}
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                {formData.description.length}/5000 karakter
              </p>
            </div>

            {/* Estimated Days and Technologies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="estimatedDays" className="block text-sm font-medium text-gray-700 mb-2">
                  Tahmini Süre <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="estimatedDays"
                    name="estimatedDays"
                    value={formData.estimatedDays}
                    onChange={handleChange}
                    placeholder="14"
                    min="1"
                    max="365"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <span className="absolute right-3 top-3 text-gray-500">gün</span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Projenin tamamlanması için gereken tahmini süre
                </p>
              </div>

              <div>
                <label htmlFor="technologies" className="block text-sm font-medium text-gray-700 mb-2">
                  AI Teknolojileri <span className="text-gray-400">(Opsiyonel)</span>
                </label>
                <input
                  type="text"
                  id="technologies"
                  name="technologies"
                  value={formData.technologies}
                  onChange={handleChange}
                  placeholder="TensorFlow, PyTorch, Scikit-learn, OpenAI API"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Virgülle ayırarak teknolojileri listeleyin
                </p>
              </div>
            </div>

            {/* Requirements */}
            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                Ön Gereksinimler <span className="text-gray-400">(Opsiyonel)</span>
              </label>
              <textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="Bu AI projesini başlatmak için öğrencinin bilmesi gerekenler:&#10;- Python temel bilgisi&#10;- NumPy ve Pandas kullanımı&#10;- Temel istatistik bilgisi&#10;- Machine Learning temelleri"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="mt-1 text-sm text-gray-500">
                Her satıra bir gereksinim yazın
              </p>
            </div>

            {/* Resources */}
            <div>
              <label htmlFor="resources" className="block text-sm font-medium text-gray-700 mb-2">
                Kaynaklar ve Linkler <span className="text-gray-400">(Opsiyonel)</span>
              </label>
              <textarea
                id="resources"
                name="resources"
                value={formData.resources}
                onChange={handleChange}
                placeholder="Faydalı AI kaynakları ve dökümanlar:&#10;https://tensorflow.org/tutorials&#10;https://pytorch.org/tutorials&#10;https://huggingface.co/docs&#10;Coursera: Machine Learning by Andrew Ng"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="mt-1 text-sm text-gray-500">
                Her satıra bir kaynak/link yazın
              </p>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Proje Görseli URL'si <span className="text-gray-400">(Opsiyonel)</span>
              </label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/ai-project-image.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-sm text-gray-500">
                AI projesi ile ilgili görsel URL'si ekleyin
              </p>
            </div>

            {/* Image Preview */}
            {formData.image && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Görsel Önizleme
                </label>
                <div className="border border-gray-300 rounded-lg p-4">
                  <img
                    src={formData.image}
                    alt="Proje görseli önizleme"
                    className="w-full max-w-md h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div 
                    className="hidden w-full max-w-md h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500"
                  >
                    <div className="text-center">
                      <span className="text-4xl block mb-2">🖼️</span>
                      <span className="text-sm">Görsel yüklenemedi</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4 space-y-4 sm:space-y-0 space-y-reverse pt-6 border-t border-gray-200">
              <Link
                to="/admin/project-ideas"
                className="w-full sm:w-auto px-6 py-3 text-center border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                İptal
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Oluşturuluyor...
                  </>
                ) : (
                  <>
                    <span className="mr-2">🤖</span>
                    AI Proje Fikri Oluştur
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <span className="mr-2">💡</span>
            AI Proje İpuçları
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <span className="mr-2 mt-1">•</span>
              <span>Proje başlığını açık ve AI odaklı tutun (örn: "Image Classification with CNN")</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1">•</span>
              <span>Hangi AI algoritması/modelinin kullanılacağını belirtin</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1">•</span>
              <span>Dataset kaynağını ve veri ön işleme adımlarını açıklayın</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1">•</span>
              <span>Model eğitimi, validasyon ve test aşamalarını tanımlayın</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1">•</span>
              <span>Kaggle, Hugging Face, TensorFlow gibi kaynakları ekleyin</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1">•</span>
              <span>AI Etiği ve model bias konularına değinin</span>
            </li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCreateProjectIdea;