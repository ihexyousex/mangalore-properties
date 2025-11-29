"use client";

import { ArrowLeft, ArrowRight, Send } from "lucide-react";

interface PublicWizardNavigationProps {
    currentStep: number;
    onBack: () => void;
    onNext: () => void;
    canGoNext: boolean;
    isLastStep: boolean;
    isSubmitting?: boolean;
}

export default function PublicWizardNavigation({
    currentStep,
    onBack,
    onNext,
    canGoNext,
    isLastStep,
    isSubmitting = false,
}: PublicWizardNavigationProps) {
    return (
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/10">
            {/* Back Button */}
            <button
                type="button"
                onClick={onBack}
                disabled={currentStep === 1 || isSubmitting}
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

            {/* Next/Submit Button */}
            <button
                type="button"
                onClick={onNext}
                disabled={!canGoNext || isSubmitting}
                className={`
          flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all
          ${canGoNext && !isSubmitting
                        ? "bg-yellow-500 text-neutral-950 hover:bg-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.4)]"
                        : "bg-white/10 text-white/40 cursor-not-allowed"
                    }
        `}
            >
                {isSubmitting ? "Submitting..." : isLastStep ? "Submit Listing" : "Continue"}
                {!isLastStep && !isSubmitting && <ArrowRight className="w-5 h-5" />}
                {isLastStep && !isSubmitting && <Send className="w-5 h-5" />}
            </button>
        </div>
    );
}
