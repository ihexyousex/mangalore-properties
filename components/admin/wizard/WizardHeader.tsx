"use client";

import { WizardStep } from "@/stores/useListingStore";
import { CheckCircle2, Circle } from "lucide-react";

interface WizardHeaderProps {
    currentStep: WizardStep;
    listingType: string | null;
}

const STEPS = [
    { number: 1, label: "Select Type" },
    { number: 2, label: "Details" },
    { number: 3, label: "Location & Media" },
    { number: 4, label: "Preview & Publish" },
];

export default function WizardHeader({ currentStep, listingType }: WizardHeaderProps) {
    return (
        <div className="mb-8">
            {/* Title */}
            <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {listingType ? "Add New Listing" : "Create New Listing"}
                </h1>
                <p className="text-white/60">
                    {listingType
                        ? `Step ${currentStep} of 4 - ${STEPS[currentStep - 1].label}`
                        : "Choose your listing type to get started"
                    }
                </p>
            </div>

            {/* Progress Stepper */}
            <div className="flex items-center justify-center space-x-4">
                {STEPS.map((step, index) => {
                    const isCompleted = currentStep > step.number;
                    const isCurrent = currentStep === step.number;

                    return (
                        <div key={step.number} className="flex items-center">
                            {/* Step Circle */}
                            <div className={`
                relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
                ${isCompleted ? "border-yellow-500 bg-yellow-500" :
                                    isCurrent ? "border-yellow-500 bg-yellow-500/20" :
                                        "border-white/20 bg-white/5"}
              `}>
                                {isCompleted ? (
                                    <CheckCircle2 className="w-5 h-5 text-neutral-950" />
                                ) : (
                                    <span className={`text-sm font-bold ${isCurrent ? "text-yellow-500" : "text-white/40"}`}>
                                        {step.number}
                                    </span>
                                )}
                            </div>

                            {/* Step Label (hidden on mobile) */}
                            <span className={`
                ml-2 text-sm font-medium hidden md:block
                ${isCompleted || isCurrent ? "text-white" : "text-white/40"}
              `}>
                                {step.label}
                            </span>

                            {/* Connector Line */}
                            {index < STEPS.length - 1 && (
                                <div className={`
                  w-8 md:w-16 h-0.5 ml-2 transition-colors
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
