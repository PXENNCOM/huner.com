// pages/employer/components/DeveloperRequests/StepIndicator.jsx
import React from 'react';
import { MdCode, MdPerson, MdBusiness, MdSettings, MdCheck } from 'react-icons/md';

const StepIndicator = ({ steps, currentStep }) => {
  const stepIcons = {
    1: MdCode,
    2: MdPerson,
    3: MdBusiness,
    4: MdSettings
  };

  return (
    <div className="px-6 lg:px-8 py-4 bg-blue-800/10 flex-shrink-0">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = stepIcons[step.id];
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          
          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex items-center">
                <div className={`
                  w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-300
                  ${isActive ? 'bg-blue-500/80 border-blue-400 text-white shadow-lg shadow-blue-500/30' : ''}
                  ${isCompleted ? 'bg-green-500/80 border-green-400 text-white shadow-lg shadow-green-500/30' : ''}
                  ${!isActive && !isCompleted ? 'bg-blue-800/30 border-blue-600/50 text-blue-300' : ''}
                `}>
                  {isCompleted ? (
                    <MdCheck className="w-6 h-6" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>
                <div className="ml-4 hidden lg:block">
                  <p className={`text-sm font-semibold ${isActive ? 'text-white' : isCompleted ? 'text-green-300' : 'text-blue-300'}`}>
                    {step.title}
                  </p>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`
                  flex-1 h-1 mx-4 rounded-full transition-all duration-300
                  ${currentStep > step.id ? 'bg-green-500/80' : 'bg-blue-700/30'}
                `} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;