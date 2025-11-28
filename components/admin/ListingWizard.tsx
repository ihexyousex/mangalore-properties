"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useListingStore, ListingType } from "@/stores/useListingStore";
import { getSchemaForListingType } from "@/lib/schemas/listingSchemas";

import WizardHeader from "./wizard/WizardHeader";
import WizardNavigation from "./wizard/WizardNavigation";
import ListingTypeCard, { LISTING_TYPES } from "./wizard/ListingTypeCard";
import { BuilderFields, ResaleFields, RentalFields, CommercialFields } from "./wizard/FormSections";
import LocationPicker from "./LocationPicker";
import { useLoadScript } from "@react-google-maps/api";
import { Sparkles, Loader2 } from "lucide-react";

// Define libraries outside component to prevent re-creation
const MAPS_LIBRARIES: ("places")[] = ["places"];

export default function ListingWizard() {
    const router = useRouter();
    const { currentStep, formData, nextStep, prevStep, updateFormData, setListingType, resetForm } = useListingStore();

    const [isSaving, setIsSaving] = useState(false);
    const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

    // Google Maps
    const { isLoaded: mapsLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        libraries: MAPS_LIBRARIES,
    });

    // React Hook Form with conditional schema
    const currentSchema = formData.listingType
        ? getSchemaForListingType(formData.listingType)
        : null;

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm({
        resolver: currentSchema ? zodResolver(currentSchema) : undefined,
        defaultValues: formData,
    });

    // Watch all form values
    const watchedValues = watch();

    // Handle listing type selection (Step 1)
    const handleTypeSelection = (type: ListingType) => {
        setListingType(type);
        updateFormData({ listingType: type });
        nextStep();
    };

    // Handle back navigation
    const handleBack = () => {
        if (currentStep === 2) {
            // Going back to step 1 resets listing type
            updateFormData({ listingType: null });
        }
        prevStep();
    };

    // Handle next navigation
    const handleNext = () => {
        if (currentStep < 4) {
            // Sync form data to store before moving to next step
            updateFormData(watchedValues);
            nextStep();
        } else {
            // Final step - submit
            handleSubmit(onSubmit)();
        }
    };

    // Handle draft save
    const handleSaveDraft = async () => {
        setIsSaving(true);
        try {
            const draftData = { ...formData, ...watchedValues };

            const res = await fetch('/api/admin/listings/draft', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(draftData),
            });

            if (res.ok) {
                toast.success("Draft saved successfully!");
            } else {
                throw new Error("Failed to save");
            }
        } catch (error) {
            toast.error("Failed to save draft");
        } finally {
            setIsSaving(false);
        }
    };

    // Handle AI description generation
    const handleGenerateDescription = async () => {
        setIsGeneratingDesc(true);
        try {
            const res = await fetch('/api/generate-desc', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    listingType: formData.listingType,
                    basics: {
                        title: watchedValues.title,
                        location: watchedValues.location,
                        bhk: (watchedValues as any).bhk,
                        price: watchedValues.price,
                    },
                    amenities: watchedValues.amenities || [],
                }),
            });

            const data = await res.json();
            if (data.description) {
                setValue('description', data.description);
                updateFormData({ description: data.description });
                toast.success("AI description generated!");
            }
        } catch (error) {
            toast.error("Failed to generate description");
        } finally {
            setIsGeneratingDesc(false);
        }
    };

    // Final submit
    const onSubmit = async (data: any) => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    is_approved: true, // Admin submissions auto-approved
                }),
            });

            if (res.ok) {
                toast.success("Listing published successfully!");
                resetForm();
                router.push('/admin/dashboard');
            } else {
                throw new Error("Failed to publish");
            }
        } catch (error) {
            toast.error("Failed to publish listing");
        } finally {
            setIsSaving(false);
        }
    };

    // Slide animation variants
    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
        }),
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header with Progress */}
                <WizardHeader currentStep={currentStep} listingType={formData.listingType} />

                {/* Main Content Area */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 min-h-[500px]">
                    <AnimatePresence mode="wait" custom={1}>
                        {/* Step 1: Listing Type Selection */}
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                custom={1}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="text-2xl font-bold text-center mb-8">Choose Listing Type</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {LISTING_TYPES.map((type) => (
                                        <ListingTypeCard
                                            key={type.type}
                                            type={type.type}
                                            title={type.title}
                                            description={type.description}
                                            icon={type.icon}
                                            isSelected={formData.listingType === type.type}
                                            onClick={() => handleTypeSelection(type.type)}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Adaptive Form */}
                        {currentStep === 2 && formData.listingType && (
                            <motion.div
                                key="step2"
                                custom={1}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                {/* Common Fields */}
                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold text-white mb-4">Basic Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Title */}
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-medium text-white/80">
                                                Property Title <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                {...register("title")}
                                                placeholder="e.g., Luxury 3BHK Apartment in Kadri"
                                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                                            />
                                            {errors.title && (
                                                <p className="text-sm text-red-500">{errors.title.message as string}</p>
                                            )}
                                        </div>

                                        {/* Price */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-white/80">
                                                Price <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                {...register("price")}
                                                placeholder="e.g., ₹85 Lakhs or ₹25,000/month"
                                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                                            />
                                            {errors.price && (
                                                <p className="text-sm text-red-500">{errors.price.message as string}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Conditional Fields Based on Type */}
                                {formData.listingType === 'builder_new' && (
                                    <BuilderFields register={register} errors={errors} />
                                )}
                                {formData.listingType === 'resale_residential' && (
                                    <ResaleFields register={register} errors={errors} />
                                )}
                                {formData.listingType === 'rent_residential' && (
                                    <RentalFields register={register} errors={errors} />
                                )}
                                {(formData.listingType === 'commercial_sell' || formData.listingType === 'commercial_rent') && (
                                    <CommercialFields
                                        register={register}
                                        errors={errors}
                                        listingType={formData.listingType}
                                    />
                                )}
                            </motion.div>
                        )}

                        {/* Step 3: Location & Media */}
                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                custom={1}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                className="space-y-8"
                            >
                                <h2 className="text-2xl font-bold">Location & Media</h2>

                                {/* Location Picker */}
                                <div>
                                    <label className="text-sm font-medium text-white/80 mb-2 block">
                                        Property Location <span className="text-red-500">*</span>
                                    </label>
                                    {mapsLoaded ? (
                                        <LocationPicker
                                            isLoaded={mapsLoaded}
                                            initialLocation={formData.location}
                                            initialLat={formData.latitude}
                                            initialLng={formData.longitude}
                                            onLocationSelect={(data) => {
                                                updateFormData({
                                                    location: data.address,
                                                    latitude: data.latitude,
                                                    longitude: data.longitude,
                                                    pincode: data.pincode,
                                                    area: data.area,
                                                    landmarks: data.landmarks,
                                                    mapUrl: data.map_url,
                                                });
                                                setValue('location', data.address);
                                            }}
                                        />
                                    ) : (
                                        <div className="h-64 bg-white/5 rounded-xl flex items-center justify-center">
                                            <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
                                        </div>
                                    )}
                                </div>

                                {/* Image Upload Placeholder */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold">Property Images</h3>
                                    <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-yellow-500/50 transition-colors cursor-pointer">
                                        <p className="text-white/60">Click to upload or drag and drop</p>
                                        <p className="text-sm text-white/40 mt-2">Cover image + Gallery</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 4: Description & Preview */}
                        {currentStep === 4 && (
                            <motion.div
                                key="step4"
                                custom={1}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-bold">Description & Amenities</h2>

                                {/* AI Description Generator */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-white/80">
                                            Property Description <span className="text-red-500">*</span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleGenerateDescription}
                                            disabled={isGeneratingDesc}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-neutral-950 font-medium hover:shadow-lg transition-all disabled:opacity-50"
                                        >
                                            {isGeneratingDesc ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Generating...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="w-4 h-4" />
                                                    AI Magic ✨
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <textarea
                                        {...register("description")}
                                        rows={6}
                                        placeholder="Describe the property..."
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all resize-none"
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-500">{errors.description.message as string}</p>
                                    )}
                                </div>

                                {/* Amenities */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-white/80">
                                        Amenities <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        {...register("amenities")}
                                        placeholder="Type amenities separated by commas (e.g., Pool, Gym, Parking)"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                                    />
                                    {errors.amenities && (
                                        <p className="text-sm text-red-500">{errors.amenities.message as string}</p>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Navigation */}
                <WizardNavigation
                    currentStep={currentStep}
                    onBack={handleBack}
                    onNext={handleNext}
                    onSaveDraft={handleSaveDraft}
                    canGoNext={currentStep === 1 ? Boolean(formData.listingType) : true}
                    isLastStep={currentStep === 4}
                    isSaving={isSaving}
                />
            </div>
        </div>
    );
}
