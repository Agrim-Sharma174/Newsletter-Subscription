import React from "react";
import { BiCheckCircle } from "react-icons/bi";
import { BsClock } from "react-icons/bs";
import { ChevronRight } from "lucide-react";

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
  flowState,
}) => {
  // Calculate the total width needed based on visible steps
  const totalVisibleSteps = visibleSteps.length;
  
  return (
    <div className="flex flex-col items-center justify-center mb-8">
      {flowState === "idle" ? (
        <div className="text-3xl font-bold text-gray-700 mb-6">Welcome!</div>
      ) : (
        <div className="w-full flex items-center justify-center mb-4 relative">
          {/* Container for visible steps with proper spacing */}
          <div className="flex items-center justify-center gap-16 relative">
            {/* Background progress line */}
            <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200 -z-10" />
            
            {/* Completed progress line */}
            <div 
              className="absolute top-6 left-6 h-0.5 bg-green-500 transition-all duration-500 -z-10"
              style={{
                width: totalVisibleSteps > 1 
                  ? `${((Math.max(0, currentStep) / (totalVisibleSteps - 1)) * 100)}%`
                  : '0%',
              }}
            />

            {steps.map((step, index) => {
              // Only render if step is in visibleSteps
              if (!visibleSteps.includes(index)) return null;

              // Find the position in visible steps array
              const visibleIndex = visibleSteps.indexOf(index);
              const isLastVisible = visibleIndex === visibleSteps.length - 1;

              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center relative"
                >
                  {/* Node */}
                  <div className="relative">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-full text-white text-lg font-semibold transition-colors duration-300 ${
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
                    
                    {/* Arrow - show only between visible steps */}
                    {!isLastVisible && (
                      <div className="absolute top-1/2 -right-10 transform -translate-y-1/2">
                        <ChevronRight 
                          className={`w-6 h-6 ${
                            index < currentStep 
                              ? "text-green-500" 
                              : "text-gray-300"
                          }`}
                        />
                      </div>
                    )}
                  </div>

                  {/* Step label */}
                  <p className="text-xs mt-2 text-gray-600">
                    {step.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default StepProgressBar;
