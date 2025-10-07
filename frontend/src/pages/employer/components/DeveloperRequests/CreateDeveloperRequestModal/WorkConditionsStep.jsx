import React from 'react';
// import { MdBusiness } from 'react-icons/md'; // Harici bağımlılık nedeniyle kaldırıldı

const WorkConditionsStep = ({ formData, errors, onChange }) => {
  const WORK_TYPES = [
    { value: 'freelance', label: '💼 Freelance/Proje bazlı' },
    { value: 'part_time', label: '⏰ Part-time çalışan' },
    { value: 'full_time', label: '🕘 Full-time çalışan' },
    { value: 'intern', label: '🎓 Stajyer' }
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

  const TURKISH_CITIES = [
    'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep',
    'Mersin', 'Diyarbakır', 'Kayseri', 'Eskişehir', 'Sakarya', 'Denizli', 'Şanlıurfa',
    'Trabzon', 'Malatya', 'Erzurum', 'Van', 'Batman', 'Elazığ', 'Sivas', 'Manisa',
    'Tarsus', 'Kahramanmaraş', 'Samsun', 'Balıkesir', 'Uşak', 'Isparta', 'Çorum'
  ];

  const handleSelectOption = (fieldName, value) => {
    onChange({ target: { name: fieldName, value } });
  };

  // Inline SVG replacement for MdBusiness icon
  const BusinessIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-300">
      <path d="M12 2L2 7V21H22V7L12 2ZM17 19H15V13H17V19ZM13 19H11V13H13V19ZM9 19H7V13H9V19ZM16 7L12 5L8 7V9H16V7Z" />
    </svg>
  );

  return (
    <div className="h-full overflow-y-auto p-6 lg:p-8">
      {/* max-w-6xl mx-auto kaldırıldı, yerine w-full kullanıldı. */}
      <div className="w-full space-y-8">
        <div className="bg-blue-800/15 rounded-2xl p-6 lg:p-8 border border-blue-700/20">
          <div className="flex items-center mb-8">
            <div className="p-3 bg-blue-500/20 rounded-xl mr-4">
              {/* MdBusiness yerine BusinessIcon kullanıldı */}
              {BusinessIcon}
            </div>
            <h3 className="text-xl font-bold text-white">Çalışma Koşulları</h3>
          </div>
          
          <div className="space-y-10">
            {/* Çalışma Türü ve Proje Süresi */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-blue-200 mb-4">
                  Çalışma Türü *
                </label>
                <div className="space-y-3">
                  {WORK_TYPES.map(type => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleSelectOption('workType', type.value)}
                      className={`
                        w-full p-4 rounded-xl border text-left transition-all duration-200 hover:scale-[1.01]
                        ${formData.workType === type.value
                          ? 'bg-blue-500/30 border-blue-400/60 text-white shadow-lg shadow-blue-500/20'
                          : 'bg-blue-800/15 border-blue-600/30 text-blue-200 hover:bg-blue-700/25'
                        }
                      `}
                    >
                      <div className="font-semibold">{type.label}</div>
                    </button>
                  ))}
                </div>
                {errors.workType && (
                  <p className="mt-3 text-sm text-red-300 flex items-center">
                    <span className="mr-2">⚠️</span>
                    {errors.workType}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-200 mb-4">
                  Çalışma Süresi (Ortama)*
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={onChange}
                  className={`
                    w-full px-4 py-4 bg-blue-900/20 border rounded-xl text-white placeholder-blue-400/70 
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-blue-900/30
                    transition-all duration-200
                    ${errors.duration ? 'border-red-500/50 focus:ring-red-500/50' : 'border-blue-600/30'}
                  `}
                  placeholder="Örn: 3 ay, 6 ay, 1 yıl"
                />
                {errors.duration && (
                  <p className="mt-3 text-sm text-red-300 flex items-center">
                    <span className="mr-2">⚠️</span>
                    {errors.duration}
                  </p>
                )}
              </div>
            </div>

            {/* Başlangıç Tarihi ve Çalışma Şekli */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-blue-200 mb-4">
                  Başlangıç Tarihi *
                </label>
                <div className="space-y-3">
                  {START_DATES.map(date => (
                    <button
                      key={date.value}
                      type="button"
                      onClick={() => handleSelectOption('startDate', date.value)}
                      className={`
                        w-full p-4 rounded-xl border text-left transition-all duration-200 hover:scale-[1.01]
                        ${formData.startDate === date.value
                          ? 'bg-blue-500/30 border-blue-400/60 text-white shadow-lg shadow-blue-500/20'
                          : 'bg-blue-800/15 border-blue-600/30 text-blue-200 hover:bg-blue-700/25'
                        }
                      `}
                    >
                      <div className="font-semibold">{date.label}</div>
                    </button>
                  ))}
                </div>
                {errors.startDate && (
                  <p className="mt-3 text-sm text-red-300 flex items-center">
                    <span className="mr-2">⚠️</span>
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-200 mb-4">
                  Çalışma Şekli *
                </label>
                <div className="space-y-3">
                  {WORK_STYLES.map(style => (
                    <button
                      key={style.value}
                      type="button"
                      onClick={() => handleSelectOption('workStyle', style.value)}
                      className={`
                        w-full p-4 rounded-xl border text-left transition-all duration-200 hover:scale-[1.01]
                        ${formData.workStyle === style.value
                          ? 'bg-blue-500/30 border-blue-400/60 text-white shadow-lg shadow-blue-500/20'
                          : 'bg-blue-800/15 border-blue-600/30 text-blue-200 hover:bg-blue-700/25'
                        }
                      `}
                    >
                      <div className="font-semibold">{style.label}</div>
                    </button>
                  ))}
                </div>
                {errors.workStyle && (
                  <p className="mt-3 text-sm text-red-300 flex items-center">
                    <span className="mr-2">⚠️</span>
                    {errors.workStyle}
                  </p>
                )}
              </div>
            </div>

            {/* Çalışma Saatleri ve Takım Büyüklüğü */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-blue-200 mb-4">
                  Çalışma Saatleri *
                </label>
                <div className="space-y-3">
                  {WORK_HOURS.map(hours => (
                    <button
                      key={hours.value}
                      type="button"
                      onClick={() => handleSelectOption('workHours', hours.value)}
                      className={`
                        w-full p-4 rounded-xl border text-left transition-all duration-200 hover:scale-[1.01]
                        ${formData.workHours === hours.value
                          ? 'bg-blue-500/30 border-blue-400/60 text-white shadow-lg shadow-blue-500/20'
                          : 'bg-blue-800/15 border-blue-600/30 text-blue-200 hover:bg-blue-700/25'
                        }
                      `}
                    >
                      <div className="font-semibold">{hours.label}</div>
                    </button>
                  ))}
                </div>
                {errors.workHours && (
                  <p className="mt-3 text-sm text-red-300 flex items-center">
                    <span className="mr-2">⚠️</span>
                    {errors.workHours}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-200 mb-4">
                  Takım Büyüklüğü *
                </label>
                <div className="space-y-3">
                  {TEAM_SIZES.map(size => (
                    <button
                      key={size.value}
                      type="button"
                      onClick={() => handleSelectOption('teamSize', size.value)}
                      className={`
                        w-full p-4 rounded-xl border text-left transition-all duration-200 hover:scale-[1.01]
                        ${formData.teamSize === size.value
                          ? 'bg-blue-500/30 border-blue-400/60 text-white shadow-lg shadow-blue-500/20'
                          : 'bg-blue-800/15 border-blue-600/30 text-blue-200 hover:bg-blue-700/25'
                        }
                      `}
                    >
                      <div className="font-semibold">{size.label}</div>
                    </button>
                  ))}
                </div>
                {errors.teamSize && (
                  <p className="mt-3 text-sm text-red-300 flex items-center">
                    <span className="mr-2">⚠️</span>
                    {errors.teamSize}
                  </p>
                )}
              </div>
            </div>

            {/* Konum */}
            <div>
              <label className="block text-sm font-semibold text-blue-200 mb-4">
                Konum 
                <span className="text-blue-400/80 text-xs ml-2 font-normal">(İsteğe bağlı)</span>
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={onChange}
                className="w-full px-4 py-4 bg-blue-900/20 border border-blue-600/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-blue-900/30 transition-all duration-200"
              >
                <option value="" className="bg-blue-900 text-white">Fark etmez</option>
                {TURKISH_CITIES.map(city => (
                  <option key={city} value={city.toLowerCase()} className="bg-blue-900 text-white">
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkConditionsStep; 
