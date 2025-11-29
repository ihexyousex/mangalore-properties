import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ListingType = 'builder_new' | 'resale_residential' | 'rent_residential' | 'commercial_sell' | 'commercial_rent';

export type WizardStep = 1 | 2 | 3 | 4;

export interface ListingFormData {
    // Step 1: Listing Type
    listingType: ListingType | null;

    // Step 2: Basic Details (Common)
    title: string;
    price: string;
    bhk?: string;
    bathrooms?: number;
    carpetArea?: string;

    // Step 2: Builder-specific
    builderName?: string;
    reraId?: string;
    totalTowers?: number;
    totalUnits?: number;
    possessionDate?: string;

    // Step 2: Resale-specific
    propertyAge?: string;
    ownershipType?: 'Freehold' | 'Leasehold';
    maintenanceCost?: string;
    vacancyStatus?: 'Occupied' | 'Vacant';

    // Step 2: Rental-specific
    monthlyRent?: string;
    securityDeposit?: string;
    availableFrom?: string;
    tenantPreference?: 'Family' | 'Bachelors' | 'Company' | 'Any';
    furnishing?: 'Fully Furnished' | 'Semi Furnished' | 'Unfurnished';

    // Step 2: Commercial-specific
    floorLoading?: string;
    powerBackupKVA?: string;
    cafeteria?: boolean;
    zoningCode?: string;
    fireSafety?: boolean;

    // Step 3: Location & Media
    location: string;
    latitude?: number;
    longitude?: number;
    pincode?: string;
    area?: string;
    landmarks?: string[];
    mapUrl?: string;
    coverImage?: File | string;
    galleryImages?: (File | string)[];

    // Step 4: Description & Amenities
    description: string;
    amenities: string[];
    videoUrl?: string;
}

interface ListingStore {
    currentStep: WizardStep;
    formData: ListingFormData;
    draftId?: string;

    // Actions
    setStep: (step: WizardStep) => void;
    nextStep: () => void;
    prevStep: () => void;
    updateFormData: (data: Partial<ListingFormData>) => void;
    setListingType: (type: ListingType) => void;
    resetForm: () => void;
    setDraftId: (id: string) => void;
}

const initialFormData: ListingFormData = {
    listingType: null,
    title: '',
    price: '',
    location: '',
    description: '',
    amenities: [],
};

export const useListingStore = create<ListingStore>()(
    persist(
        (set, get) => ({
            currentStep: 1,
            formData: initialFormData,
            draftId: undefined,

            setStep: (step) => set({ currentStep: step }),

            nextStep: () => {
                const { currentStep } = get();
                if (currentStep < 4) {
                    set({ currentStep: (currentStep + 1) as WizardStep });
                }
            },

            prevStep: () => {
                const { currentStep } = get();
                if (currentStep > 1) {
                    set({ currentStep: (currentStep - 1) as WizardStep });
                }
            },

            updateFormData: (data) =>
                set((state) => ({
                    formData: { ...state.formData, ...data }
                })),

            setListingType: (type) =>
                set((state) => ({
                    formData: { ...state.formData, listingType: type }
                })),

            resetForm: () =>
                set({
                    currentStep: 1,
                    formData: initialFormData,
                    draftId: undefined,
                }),

            setDraftId: (id) => set({ draftId: id }),
        }),
        {
            name: 'listing-wizard-storage',
        }
    )
);
