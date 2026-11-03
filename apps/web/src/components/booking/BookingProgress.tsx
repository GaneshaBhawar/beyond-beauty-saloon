'use client';

import React from 'react';
import { Check, Sparkles, User, Calendar, FileText } from 'lucide-react';

interface BookingProgressProps {
  currentStep: number; // 1 to 4
  onStepClick: (step: number) => void;
  maxAccessibleStep: number;
}

export function BookingProgress({
  currentStep,
  onStepClick,
  maxAccessibleStep,
}: BookingProgressProps) {
  const steps = [
    { number: 1, title: 'Choose Service', icon: Sparkles },
    { number: 2, title: 'Choose Stylist', icon: User },
    { number: 3, title: 'Date & Time', icon: Calendar },
    { number: 4, title: 'Your Details', icon: FileText },
  ];

  return (
    <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-salon-gray p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((s, index) => {
          const isCurrent = currentStep === s.number;
          const isCompleted = currentStep > s.number;
          const isAccessible = s.number <= maxAccessibleStep;
          const Icon = s.icon;

          return (
            <React.Fragment key={s.number}>
              {/* Step item */}
              <button
                type="button"
                onClick={() => isAccessible && onStepClick(s.number)}
                disabled={!isAccessible}
                className={`flex flex-col items-center group transition-all duration-200 focus:outline-hidden ${
                  isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                }`}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`Step ${s.number}: ${s.title}`}
              >
                <div
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-200 ${
                    isCompleted
                      ? 'bg-salon-rose text-white shadow-sm ring-2 ring-salon-rose/20'
                      : isCurrent
                      ? 'bg-salon-rose-dark text-white ring-4 ring-salon-rose/20 shadow-md scale-105'
                      : 'bg-salon-ivory text-salon-muted border border-salon-gray/80 group-hover:border-salon-rose/40'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                  ) : (
                    <span>{s.number}</span>
                  )}
                </div>

                <span
                  className={`mt-2 text-[11px] sm:text-xs font-semibold text-center transition-colors ${
                    isCurrent
                      ? 'text-salon-rose-dark font-bold'
                      : isCompleted
                      ? 'text-salon-black'
                      : 'text-salon-muted'
                  }`}
                >
                  {s.title}
                </span>
              </button>

              {/* Connector line between steps */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 sm:mx-4 transition-colors duration-300 ${
                    currentStep > s.number ? 'bg-salon-rose' : 'bg-salon-gray'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

