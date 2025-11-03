import React, { useState, useEffect } from 'react';
import { MdSave, MdCancel, MdBusiness, MdWork, MdCalendarToday, MdDescription } from 'react-icons/md';

const WorkExperienceForm = ({ initialData = null, onSubmit, isSubmitting, onCancel, isEditMode = false }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    position: '',
    description: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    workType: 'internship'
  });

  const [errors, setErrors] = useState({});

  // Initial data yükle (edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        companyName: initialData.companyName || '',
        position: initialData.position || '',
        description: initialData.description || '',
        startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
        endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
        isCurrent: initialData.isCurrent || false,
        workType: initialData.workType || 'internship'
      });
    }
  }, [initialData]);

  const workTypes = [
    { value: 'internship', label: 'Staj' },
    { value: 'part-time', label: 'Yarı Zamanlı' },
    { value: 'full-time', label: 'Tam Zamanlı' },
    { value: 'freelance', label: 'Serbest Çalışma' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Hata mesajını temizle
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Eğer "hala çalışıyorum" seçilirse endDate'i temizle
    if (name === 'isCurrent' && checked) {
      setFormData(prev => ({
        ...prev,
        endDate: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Şirket adı zorunludur';
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Pozisyon zorunludur';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Başlangıç tarihi zorunludur';
    }

    if (!formData.isCurrent && !formData.endDate) {
      newErrors.endDate = 'Bitiş tarihi zorunludur veya "Hala çalışıyorum" seçeneğini işaretleyin';
    }

    // Tarih kontrolü
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      
      if (startDate >= endDate) {
        newErrors.endDate = 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const submitData = {
        ...formData,
        endDate: formData.isCurrent ? null : formData.endDate
      };
      
      onSubmit(submitData);
    }
  };

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Şirket Adı */}
        <div>
          <label className="flex items-center text-sm font-medium text-blue-200 mb-2">
            <MdBusiness className="w-4 h-4 mr-2" />
            Company Name *
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            placeholder="Example: Tech Company Inc."
            className="w-full px-4 py-3 bg-blue-800/30 border border-blue-700/50 rounded-lg text-white placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {errors.companyName && (
            <p className="mt-1 text-sm text-red-400">{errors.companyName}</p>
          )}
        </div>

        {/* Pozisyon */}
        <div>
          <label className="flex items-center text-sm font-medium text-blue-200 mb-2">
            <MdWork className="w-4 h-4 mr-2" />
            Position *
          </label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            placeholder="Örn: Frontend Developer Stajyeri"
            className="w-full px-4 py-3 bg-blue-800/30 border border-blue-700/50 rounded-lg text-white placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {errors.position && (
            <p className="mt-1 text-sm text-red-400">{errors.position}</p>
          )}
        </div>

        {/* Çalışma Türü */}
        <div>
          <label className="flex items-center text-sm font-medium text-blue-200 mb-2">
            <MdWork className="w-4 h-4 mr-2" />
            Working Type
          </label>
          <select
            name="workType"
            value={formData.workType}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-blue-800/30 border border-blue-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            {workTypes.map(type => (
              <option key={type.value} value={type.value} className="bg-blue-800">
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tarihler */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Başlangıç Tarihi */}
          <div>
            <label className="flex items-center text-sm font-medium text-blue-200 mb-2">
              <MdCalendarToday className="w-4 h-4 mr-2" />
              Start Date *
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-blue-800/30 border border-blue-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-400">{errors.startDate}</p>
            )}
          </div>

          {/* Bitiş Tarihi */}
          <div>
            <label className="flex items-center text-sm font-medium text-blue-200 mb-2">
              <MdCalendarToday className="w-4 h-4 mr-2" />
              End Date {!formData.isCurrent && '*'}
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              disabled={formData.isCurrent}
              className={`w-full px-4 py-3 bg-blue-800/30 border border-blue-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                formData.isCurrent ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-400">{errors.endDate}</p>
            )}
          </div>
        </div>

        {/* Hala Çalışıyorum Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isCurrent"
            name="isCurrent"
            checked={formData.isCurrent}
            onChange={handleInputChange}
            className="w-4 h-4 text-blue-600 bg-blue-800/30 border-blue-600 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label htmlFor="isCurrent" className="ml-2 text-sm font-medium text-blue-200">
            I'm still working here
          </label>
        </div>

        {/* Açıklama */}
        <div>
          <label className="flex items-center text-sm font-medium text-blue-200 mb-2">
            <MdDescription className="w-4 h-4 mr-2" />
            Explanation
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            placeholder="Describe your job description, responsibilities, and achievements..."
            className="w-full px-4 py-3 bg-blue-800/30 border border-blue-700/50 rounded-lg text-white placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          />
          <p className="mt-1 text-xs text-blue-400">
           Describe what you do, what technologies you use, and your achievements
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                {isEditMode ? 'Updating...' : 'Add...'}
              </>
            ) : (
              <>
                <MdSave className="w-4 h-4 mr-2" />
                {isEditMode ? 'Update' : 'Save'}
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex items-center justify-center px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            <MdCancel className="w-4 h-4 mr-2" />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkExperienceForm;