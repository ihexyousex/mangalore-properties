import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PublicWizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface PublicListingData {
    // Step 1: Basics
    intent: 'sell' | 'rent' | null;
    propertyType: 'apartment' | 'house' | 'plot' | 'commercial' | null;

    // Step 2: Location
    location: string;
    latitude?: number;
    longitude?: number;
    area?: string;
    pincode?: string;
    city: string;

    // Step 3: Layout
    bhk?: string; // 1, 2, 3, 4+
    bathrooms?: string; // 1, 2, 3+
    balconies?: string; // 0, 1, 2, 3+
    totalFloors?: string;
    floorNumber?: string;

    // Step 4: Features
    furnishing?: 'Unfurnished' | 'Semi-Furnished' | 'Fully-Furnished';
    amenities: string[];
    parking?: 'Bike' | 'Car' | 'Both' | 'None';

    // Step 5: Photos
    images: string[]; // Base64 or URLs for preview

    // Step 6: Price & Details
    price: string;
    maintenance?: string;
    description: string;
    builtUpArea?: string;

    // Step 7: Contact
    submitterName: string;
    submitterPhone: string;
    submitterEmail: string;
}

interface PublicListingStore {
    currentStep: PublicWizardStep;
    formData: PublicListingData;

    // Actions
    setStep: (step: PublicWizardStep) => void;
    nextStep: () => void;
    prevStep: () => void;
    updateFormData: (data: Partial<PublicListingData>) => void;
    resetForm: () => void;
}

const initialFormData: PublicListingData = {
    intent: null,
    propertyType: null,
    location: '',
    city: 'Mangalore',
    amenities: [],
    images: [],
    price: '',
    description: '',
    submitterName: '',
    submitterPhone: '',
    submitterEmail: '',
};

export const usePublicListingStore = create<PublicListingStore>()(
    persist(
        (set, get) => ({
            currentStep: 1,
            formData: initialFormData,

            setStep: (step) => set({ currentStep: step }),

            nextStep: () => {
                const { currentStep } = get();
                if (currentStep < 7) {
                    set({ currentStep: (currentStep + 1) as PublicWizardStep });
                }
            },

            prevStep: () => {
                const { currentStep } = get();
                if (currentStep > 1) {
                    set({ currentStep: (currentStep - 1) as PublicWizardStep });
                }
            },

            updateFormData: (data) =>
                set((state) => ({
                    formData: { ...state.formData, ...data }
                })),

            resetForm: () =>
                set({
                    currentStep: 1,
                    formData: initialFormData,
                }),
        }),
        {
            name: 'public-listing-storage',
        }
    )
);
