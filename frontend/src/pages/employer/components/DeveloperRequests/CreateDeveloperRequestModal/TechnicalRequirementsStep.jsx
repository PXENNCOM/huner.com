// pages/employer/components/DeveloperRequests/TechnicalRequirementsStep.jsx
import React from 'react';
import { MdPerson, MdWarning } from 'react-icons/md';

const TechnicalRequirementsStep = ({ formData, errors, onMultiSelect, onChange }) => {
  const EXPERIENCE_LEVELS = [
    { value: 'intern', label: '🎓 Stajyer' },
    { value: 'junior', label: '🌱 Junior (0-2 yıl)' },
    { value: 'mid', label: '🚀 Mid-level (2-5 yıl)' },
    { value: 'senior', label: '⭐ Senior (5+ yıl)' }
  ];

  const TECHNOLOGIES = [
    'React', 'Next.js', 'Vue.js', 'Nuxt.js', 'Angular', 'Svelte', 'Astro',
    'Tailwind CSS', 'Bootstrap', 'Material UI', 'Chakra UI', 'Ant Design',
    'Node.js', 'Express.js', 'NestJS', 'FastAPI', 'Django', 'Flask',
    'Laravel', 'Symfony', 'Ruby on Rails', 'Spring Boot', 'Micronaut',
    'Ktor', 'Go', 'Rust', 'Elixir', 'Phoenix Framework', 'ASP.NET Core',
    'MySQL', 'PostgreSQL', 'MongoDB', 'SQLite', 'Redis', 'Cassandra',
    'Firebase', 'Supabase', 'PlanetScale', 'DynamoDB',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud', 'Vercel',
    'React Native', 'Flutter', 'Swift', 'Kotlin', 'Ionic',
    'TensorFlow', 'PyTorch', 'OpenAI API', 'LangChain',
    'Solidity', 'Web3.js', 'Ethereum', 'Hardhat',
    'GraphQL', 'Apollo', 'tRPC', 'Prisma ORM'
  ];

  const handleExperienceLevelSelect = (level) => {
    onChange({ target: { name: 'experienceLevel', value: level } });
  };

  return (
    // Tam genişlik ve kaydırılabilir alan.
    <div className="h-full overflow-y-auto"> 
      <div className="w-full space-y-10 pb-4">
        
        {/* Form içeriği için responsive padding: px-4 (mobil), sm:px-6 (tablet), lg:px-8 (masaüstü) */}
        <div className="space-y-10 px-4 sm:px-6 lg:px-8">
          
          {/* Deneyim Seviyesi */}
          <div>
            <label className="block text-base font-semibold text-blue-200 mb-4">
              Deneyim Seviyesi <span className="text-red-400">*</span>
            </label>
            {/* Mobil Uyum: Küçük ekranlarda (default) 2 sütun. sm ve sonrası 4 sütun daha iyi olabilir.
               Ancak seçenek sayısı az olduğu için 2 veya 4 sütun tercih edilebilir.
               Burada dikeyde daha fazla yer kaplaması için 2 sütunu koruyup, büyük ekranda 4'e geçiyorum. */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {EXPERIENCE_LEVELS.map(level => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => handleExperienceLevelSelect(level.value)}
                  className={`
                    p-4 rounded-lg border text-left transition-all duration-200 text-sm font-medium
                    ${formData.experienceLevel === level.value
                      ? 'bg-blue-600/50 border-blue-400 text-white shadow-md shadow-blue-500/30'
                      : 'bg-blue-800/30 border-blue-700/50 text-blue-200 hover:bg-blue-700/50 hover:border-blue-500/80'
                    }
                  `}
                >
                  {/* Etiket içeriğini p etiketinde değil, butonda direkt gösteriyoruz */}
                  <div className="font-semibold">{level.label}</div>
                </button>
              ))}
            </div>
            {errors.experienceLevel && (
              <p className="mt-3 text-sm text-red-400 flex items-center">
                <MdWarning className="w-4 h-4 mr-2 flex-shrink-0" />
                {errors.experienceLevel}
              </p>
            )}
          </div>

          {/* Teknolojiler */}
          <div>
            <label className="block text-base font-semibold text-blue-200 mb-4">
              Teknolojiler 
              <span className="text-blue-400/80 text-sm ml-2 font-normal">(İsteğe bağlı, birden fazla seçilebilir)</span>
            </label>
            
            {/* Teknoloji Seçim Alanı: Arka plan ve kenarlık güncellendi */}
            <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-700/50 max-h-96 overflow-y-auto shadow-inner">
              
              {/* Mobil Uyum: Küçük ekranlarda 2 sütun, orta ekranlarda 3, büyük ekranlarda 4 sütun */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {TECHNOLOGIES.map(tech => {
                  const isSelected = formData.technologies.includes(tech);
                  return (
                    <label 
                      key={tech} 
                      className={`
                        flex items-center space-x-3 cursor-pointer p-2 rounded-lg text-sm font-medium transition-all duration-200
                        ${isSelected 
                          ? 'bg-blue-600/40 text-white border border-blue-400' 
                          : 'bg-blue-800/30 text-blue-300 border border-transparent hover:bg-blue-800/50 hover:border-blue-600/50'
                        }
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onMultiSelect('technologies', tech)}
                        // Checkbox stilleri kurumsal renklere güncellendi
                        className={`
                            h-4 w-4 rounded 
                            text-blue-500 bg-blue-900/40 border-blue-600/50 
                            focus:ring-blue-500 focus:ring-offset-blue-900/50
                        `}
                      />
                      <span className="truncate">{tech}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            
            <div className="mt-3 text-sm text-blue-400/80">
              Şu anda **{formData.technologies.length}** teknoloji seçildi.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalRequirementsStep;