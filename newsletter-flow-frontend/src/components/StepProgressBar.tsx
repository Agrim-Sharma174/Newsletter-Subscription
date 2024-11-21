import React from 'react';
import { BiCheckCircle } from 'react-icons/bi';
import { BsClock } from 'react-icons/bs';

interface Step {
  id: number;
  name: string;
}

interface StepProgressBarProps {
  steps: Step[];
  currentStep: number;
  visibleSteps: number[];
  flowState: string;
}

export const StepProgressBar: React.FC<StepProgressBarProps> = ({
  steps,
  currentStep,
  visibleSteps,
  flowState
}) => {
  return (
    <div className="flex flex-col items-center justify-center mb-8">
      <div className="w-full flex justify-between mb-4 relative">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`text-center transition-all duration-500 ease-in-out ${
              visibleSteps.includes(index)
                ? "opacity-100 scale-100"
                : "opacity-0 scale-0"
            }`}
          >
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-full text-white text-lg font-semibold ${
                index < currentStep || flowState === "completed"
                  ? "bg-green-500"
                  : index === currentStep
                  ? "bg-indigo-500"
                  : "bg-gray-300"
              }`}
            >
              {index < currentStep || flowState === "completed" ? (
                <BiCheckCircle size={24} />
              ) : index === currentStep ? (
                <BsClock size={24} />
              ) : (
                step.id
              )}
            </div>
            <p className="text-xs mt-2 text-gray-600">{step.name}</p>
          </div>
        ))}
        {visibleSteps.length > 0 && visibleSteps.length < steps.length && (
          <div
            className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-300 -z-10 transition-all duration-500 ease-in-out"
            style={{
              width: `${(visibleSteps.length / (steps.length - 1)) * 100}%`,
            }}
          />
        )}
      </div>
    </div>
  );
};
