"use client";

import { ArrowLeft, ArrowRight, Save } from "lucide-react";

interface WizardNavigationProps {
    currentStep: number;
    onBack: () => void;
    onNext: () => void;
    onSaveDraft: () => void;
    canGoNext: boolean;
    isLastStep: boolean;
    isSaving?: boolean;
}

export default function WizardNavigation({
    currentStep,
    onBack,
    onNext,
    onSaveDraft,
    canGoNext,
    isLastStep,
    isSaving = false,
}: WizardNavigationProps) {
    return (
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/10">
            {/* Back Button */}
            <button
                type="button"
                onClick={onBack}
                disabled={currentStep === 1}
                className={`
          flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
          ${currentStep === 1
                        ? "opacity-50 cursor-not-allowed text-white/40"
                        : "text-white hover:bg-white/10"
                    }
        `}
            >
                <ArrowLeft className="w-5 h-5" />
                Back
            </button>

            {/* Center: Save Draft */}
            <button
                type="button"
                onClick={onSaveDraft}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all disabled:opacity-50"
            >
                <Save className="w-5 h-5" />
                {isSaving ? "Saving..." : "Save Draft"}
            </button>

            {/* Next/Publish Button */}
            <button
                type="button"
                onClick={onNext}
                disabled={!canGoNext || isSaving}
                className={`
          flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all
          ${canGoNext && !isSaving
                        ? "bg-yellow-500 text-neutral-950 hover:bg-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.4)]"
                        : "bg-white/10 text-white/40 cursor-not-allowed"
                    }
        `}
            >
                {isLastStep ? "Publish Listing" : "Continue"}
                {!isLastStep && <ArrowRight className="w-5 h-5" />}
            </button>
        </div>
    );
}
