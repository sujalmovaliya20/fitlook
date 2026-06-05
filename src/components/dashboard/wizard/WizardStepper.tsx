"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface WizardStepperProps {
  currentStep: number;
}

const STEPS = ["Fabric Upload", "Customer Upload", "Garment Selector", "Review"];

export function WizardStepper({ currentStep }: WizardStepperProps) {
  return (
    <div className="relative w-full max-w-2xl mx-auto mb-12">
      {/* Background Line */}
      <div className="absolute top-[15px] left-0 right-0 h-[2px] bg-[rgba(255,255,255,0.1)] -z-10" />
      
      {/* Active Line */}
      <motion.div
        className="absolute top-[15px] left-0 h-[2px] bg-[var(--accent-gold)] -z-10"
        initial={{ width: 0 }}
        animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />

      <div className="flex justify-between">
        {STEPS.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={label} className="flex flex-col items-center relative">
              <div className="relative flex items-center justify-center">
                {/* Pulse ring for active step */}
                {isActive && (
                  <div className="absolute inset-0 bg-[var(--accent-gold)] rounded-full animate-pulse-ring pointer-events-none" />
                )}

                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[clamp(12px,2.5vw,14px)] font-bold z-10 transition-colors duration-300 ${
                    isCompleted
                      ? "bg-[var(--accent-gold)] text-black"
                      : isActive
                      ? "bg-[var(--accent-gold)] text-black shadow-[var(--glow-gold)]"
                      : "bg-[#16161F] border-2 border-[rgba(255,255,255,0.1)] text-[var(--text-muted)]"
                  }`}
                  animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3px]" /> : stepNumber}
                </motion.div>
              </div>

              <span
                className={`mt-3 text-[clamp(10px,2vw,12px)] font-[family-name:var(--font-body)] transition-colors duration-300 ${
                  isActive ? "text-[var(--text-primary)] font-medium" : "text-[var(--text-secondary)]"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
