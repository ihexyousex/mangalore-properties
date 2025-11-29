"use client";

import { CheckCircle2 } from "lucide-react";

interface PublicWizardHeaderProps {
    currentStep: number;
    listingType: string | null;
}

const STEPS = [
    { number: 1, label: "Select Type" },
    { number: 2, label: "Details" },
    { number: 3, label: "Location & Media" },
    { number: 4, label: "Description" },
    { number: 5, label: "Contact Info" },
];

export default function PublicWizardHeader({ currentStep, listingType }: PublicWizardHeaderProps) {
    return (
        <div className="mb-8">
            {/* Title */}
            <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    List Your Property
                </h1>
                <p className="text-white/60">
                    {listingType
                        ? `Step ${currentStep} of 5 - ${STEPS[currentStep - 1].label}`
                        : "Choose your property type to get started"
                    }
                </p>
            </div>

            {/* Progress Stepper */}
            <div className="flex items-center justify-center space-x-2 md:space-x-4">
                {STEPS.map((step, index) => {
                    const isCompleted = currentStep > step.number;
                    const isCurrent = currentStep === step.number;

                    return (
                        <div key={step.number} className="flex items-center">
                            {/* Step Circle */}
                            <div className={`
                relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border-2 transition-all
                ${isCompleted ? "border-yellow-500 bg-yellow-500" :
                                    isCurrent ? "border-yellow-500 bg-yellow-500/20" :
                                        "border-white/20 bg-white/5"}
              `}>
                                {isCompleted ? (
                                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-neutral-950" />
                                ) : (
                                    <span className={`text-xs md:text-sm font-bold ${isCurrent ? "text-yellow-500" : "text-white/40"}`}>
                                        {step.number}
                                    </span>
                                )}
                            </div>

                            {/* Step Label (hidden on mobile) */}
                            <span className={`
                ml-2 text-sm font-medium hidden lg:block
                ${isCompleted || isCurrent ? "text-white" : "text-white/40"}
              `}>
                                {step.label}
                            </span>

                            {/* Connector Line */}
                            {index < STEPS.length - 1 && (
                                <div className={`
                  w-4 md:w-8 lg:w-12 h-0.5 ml-2 transition-colors
                  ${isCompleted ? "bg-yellow-500" : "bg-white/20"}
                `} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
