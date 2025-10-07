// pages/employer/components/DeveloperRequests/CreateDeveloperRequestModal.jsx
import React, { useState, useEffect } from 'react';
import { createDeveloperRequest } from '../../../../../services/employerApi';
import { checkEmployerProfileComplete } from '../../../../../utils/profileUtils';
import { MdClose, MdCheckCircle, MdError, MdAdd, MdArrowBack, MdArrowForward } from 'react-icons/md';

// Import step components
import StepIndicator from './StepIndicator'; 
import ProjectInfoStep from './ProjectInfoStep';
import TechnicalRequirementsStep from './TechnicalRequirementsStep';
import WorkConditionsStep from './WorkConditionsStep';
import PreferencesStep from './PreferencesStep';

const CreateDeveloperRequestModal = ({ isOpen, onClose, onSuccess }) => {
  // Form state (Mevcut hali korunmuştur)
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
  const [profileCheckLoading, setProfileCheckLoading] = useState(true);
  const [profileIncomplete, setProfileIncomplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Steps configuration (Mevcut hali korunmuştur)
  const steps = [
    { id: 1, title: 'Proje Bilgileri', component: ProjectInfoStep },
    { id: 2, title: 'Teknik Gereksinimler', component: TechnicalRequirementsStep },
    { id: 3, title: 'Çalışma Koşulları', component: WorkConditionsStep },
    { id: 4, title: 'Tercihler', component: PreferencesStep }
  ];

  // Effects, Handlers, Validation, Navigation, Submit (Mevcut hali korunmuştur)
  // ... (Bu kısımlar değişmeden bırakılmıştır) ...
  useEffect(() => {
    if (isOpen) {
      checkProfile();
    }
  }, [isOpen]);

  const checkProfile = async () => {
    try {
      const result = await checkEmployerProfileComplete();
      
      if (!result.isComplete) {
        setProfileIncomplete(true);
        setErrors({ submit: result.message });
        setProfileCheckLoading(false);
        return;
      }
      
      setProfileCheckLoading(false);
    } catch (err) {
      console.error('Profil kontrol hatası:', err);
      setErrors({ submit: 'Profil bilgileriniz kontrol edilirken bir hata oluştu.' });
      setProfileIncomplete(true);
      setProfileCheckLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

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

  const updateFormData = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
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
    }
    
    if (step === 2) {
      if (!formData.experienceLevel) {
        newErrors.experienceLevel = 'Deneyim seviyesi seçilmelidir';
      }
    }
    
    if (step === 3) {
      if (!formData.workType) {
        newErrors.workType = 'Çalışma türü seçilmelidir';
      }
      
      if (!formData.duration.trim()) {
        newErrors.duration = 'Ortalama Çalışma Süresi gereklidir';
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
    }
    
    return newErrors;
  };

  const handleNextStep = () => {
    const stepErrors = validateStep(currentStep);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    
    setErrors({});
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    // Son adımı (4. Tercihler) göndermeden önce de doğrulama yapılıyorsa (opsiyonel alanlar olsa bile)
    // genel doğrulama Step 3'e bakıyor. Son adım için de bir doğrulama ekleyebilirsiniz, 
    // ancak mevcut kodda sadece son adımda `handleSubmit` çağrıldığı için 
    // (ve önceki adımların zaten doğrulanmış olduğu varsayıldığı için) mevcut yapıyı koruyorum.
    
    // Son adıma gelindiğinde (currentStep=4) ve submit tıklandığında,
    // Step 3 (WorkConditionsStep) doğrulaması yapılıyor.
    // Aslında son adıma geldiğimizde *tüm* adımların doğrulanmış olması gerekir.
    // Basitleştirmek adına sadece son adımın (4) verilerini doğrulayabilirsiniz, 
    // ancak mevcut yapıda sadece 3'e kadar kontrol var. 
    // Tüm adımların doğrulaması için bu kısmı düzenleyebilirsiniz (örn: validateStep(currentStep)).
    
    const finalStepErrors = validateStep(currentStep);
    if (currentStep === steps.length && Object.keys(finalStepErrors).length > 0) {
        setErrors(finalStepErrors);
        return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      await createDeveloperRequest(formData);
      setSuccess('Yazılımcı talebi başarıyla oluşturuldu!');
      
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 2000);
      
    } catch (error) {
      console.error('Talep oluşturma hatası:', error);
      
      if (error.response && error.response.data && error.response.data.redirectTo) {
        setErrors({ submit: error.response.data.message });
        setProfileIncomplete(true);
      } else {
        setErrors({ 
          submit: error.response?.data?.message || 'Talep oluşturulurken bir hata oluştu' 
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset form data and state (Mevcut hali korunmuştur)
    setFormData({
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
    setCurrentStep(1);
    setErrors({});
    setSuccess(null);
    setProfileIncomplete(false);
    setProfileCheckLoading(true);
    onClose();
  };

  if (!isOpen) return null;

  // 1. Loading state (Daha sade ve kurumsal hale getirildi)
  if (profileCheckLoading) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div className="bg-blue-900/95 rounded-xl shadow-2xl p-10 mx-4 max-w-sm w-full border border-blue-700/30">
          <div className="text-center">
            <div className="relative mb-6">
              {/* Spinner rengi daha kurumsal mavi tonlarına çekildi */}
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600/30 border-t-blue-400 mx-auto"></div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Profil Kontrol Ediliyor</h3>
            <p className="text-blue-200/80 text-sm">İşlem sıraya alınıyor...</p>
          </div>
        </div>
      </div>
    );
  }

  // 2. Profile incomplete state (Daha temiz ve net butonlar)
  if (profileIncomplete) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div className="bg-blue-900/95 rounded-xl shadow-2xl p-8 mx-4 max-w-lg w-full border border-blue-700/30">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <MdError className="w-6 h-6 mr-3 text-yellow-400" />
              Profil Eksik
            </h2>
            <button 
              onClick={handleClose} 
              className="text-blue-300 hover:text-white p-2 rounded-lg hover:bg-blue-700/30 transition-all duration-200"
            >
              <MdClose className="w-6 h-6" />
            </button>
          </div>
          
          <div className="text-center">
            <MdError className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
            <h3 className="text-lg font-semibold text-white mb-4">İşleminiz İçin Profil Bilgileri Tamamlanmalı</h3>
            <p className="text-blue-200/80 mb-8 leading-relaxed">{errors.submit}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleClose}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md shadow-yellow-500/20"
              >
                Profili Tamamla
              </button>
              <button
                onClick={handleClose}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get current step component
  const CurrentStepComponent = steps[currentStep - 1].component;

  // 3. Main modal (Daha yapısal ve kurumsal hale getirildi)
  return (
    <div className="fixed inset-0 z-[60] backdrop-blur-sm">
      <div className="h-full w-full bg-blue-900/90 shadow-2xl border border-blue-700/30 flex flex-col">
        
        {/* Header (Daha sade bir arka plan ve keskin hatlar) */}
        <div className="flex items-center justify-between p-6 lg:p-8 border-b border-blue-700/50 bg-blue-950/50 flex-shrink-0">
          <div className="flex items-center space-x-4">
            {/* Logo/Icon Area (Daha sade ve temiz) */}
            <div className="p-3 bg-blue-700/30 rounded-lg border border-blue-500/30">
              <MdAdd className="w-7 h-7 text-blue-300" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-wide">Yeni Yazılımcı Talebi Oluştur</h2>
              <p className="text-blue-300/80 text-sm mt-1">Adım {currentStep} / {steps.length}: {steps[currentStep-1].title}</p>
            </div>
          </div>
          
          <button
            onClick={handleClose}
            className="p-3 text-blue-300 hover:text-white hover:bg-blue-700/40 rounded-lg transition-all duration-200"
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        {/* Step Indicator (Bu bileşenin iç stilini de profesyonel yapmalısınız) */}
        <div className="flex-shrink-0 p-4 lg:p-6 border-b border-blue-800/50">
            <StepIndicator 
                steps={steps}
                currentStep={currentStep}
            />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
            
            {/* Success/Error Messages (Daha belirgin ve kurumsal uyarı renkleri) */}
            {success && (
                <div className="p-4 mb-6 bg-green-700/30 border border-green-600/50 rounded-lg text-green-300 flex items-center">
                    <MdCheckCircle className="w-6 h-6 mr-3 text-green-400" />
                    <span className="font-medium">{success}</span>
                </div>
            )}

            {errors.submit && !profileIncomplete && (
                <div className="p-4 mb-6 bg-red-700/30 border border-red-600/50 rounded-lg text-red-300 flex items-center">
                    <MdError className="w-6 h-6 mr-3 text-red-400" />
                    <span className="font-medium">{errors.submit}</span>
                </div>
            )}
            
            {/* Current Step Content */}
            <div className="p-6 bg-blue-800/20 rounded-xl border border-blue-700/30 shadow-inner">
                <h3 className="text-xl font-bold text-white mb-6 border-b border-blue-700/30 pb-3">{steps[currentStep-1].title}</h3>
                <CurrentStepComponent
                    formData={formData}
                    errors={errors}
                    onChange={handleChange}
                    onMultiSelect={handleMultiSelect}
                    onUpdateFormData={updateFormData}
                />
            </div>
        </div>

        {/* Navigation Footer (Sabit, belirgin footer) */}
       <div className="flex-shrink-0 p-6 bg-blue-950/50 border-t border-blue-700/50">
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Previous Button */}
        <button
            onClick={handlePrevStep}
            disabled={currentStep === 1 || isSubmitting}
            className={`flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded-lg font-semibold transition-colors duration-200 text-lg ${
                currentStep > 1 && !isSubmitting
                    ? 'bg-gray-700 hover:bg-gray-600 text-white shadow-md'
                    : 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
            }`}
        >
            <MdArrowBack className="w-5 h-5 mr-2" />
            Önceki Adım
        </button>

        {/* Next / Submit Button Container */}
        <div className="w-full sm:w-auto">
            {currentStep < steps.length ? (
                /* Next Button */
                <button
                    onClick={handleNextStep}
                    disabled={isSubmitting}
                    className="flex items-center justify-center w-full px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-700/70 text-white rounded-lg font-bold transition-all duration-200 shadow-xl shadow-blue-500/20 text-lg"
                >
                    Sonraki Adım <MdArrowForward className="w-5 h-5 ml-2" />
                </button>
            ) : (
                /* Submit Button */
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center justify-center w-full px-10 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-700/70 text-white rounded-lg font-bold transition-all duration-200 shadow-xl shadow-green-500/30 text-lg min-w-[200px]"
                >
                    {isSubmitting ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-3"></div>
                            Gönderiliyor...
                        </>
                    ) : (
                        <>
                            <MdCheckCircle className="w-5 h-5 mr-2" /> Talebi Gönder
                        </>
                    )}
                </button>
            )}
        </div>
    </div>
</div>
      </div>
    </div>
  );
};

export default CreateDeveloperRequestModal;