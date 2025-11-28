"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useListingStore } from "@/stores/useListingStore";
import WizardHeader from "./wizard/WizardHeader";
import WizardNavigation from "./wizard/WizardNavigation";
import ListingTypeCard, { LISTING_TYPES } from "./wizard/ListingTypeCard";
import { BuilderFields, ResaleFields, RentalFields, CommercialFields } from "./wizard/FormSections";
import LocationPicker from "./LocationPicker";
import { useLoadScript } from "@react-google-maps/api";
import { Loader2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";

const MAPS_LIBRARIES: ("places")[] = ["places"];

export default function PublicListingForm() {
    const router = useRouter();
    const { currentStep, formData, nextStep, prevStep, updateFormData, setListingType, resetForm } = useListingStore();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitterInfo, setSubmitterInfo] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const { isLoaded: mapsLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        libraries: MAPS_LIBRARIES,
    });

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        defaultValues: formData,
    });

    const watchedValues = watch();

    const handleTypeSelection = (type: any) => {
        setListingType(type);
        updateFormData({ listingType: type });
        nextStep();
    };

    const handleBack = () => {
        if (currentStep === 2) {
            updateFormData({ listingType: null });
        }
        prevStep();
    };

    const handleNext = () => {
        if (currentStep < 4) {
            updateFormData(watchedValues);
            nextStep();
        }
    };

    const onSubmit = async () => {
        setIsSubmitting(true);
        try {
            const listingData = { ...formData, ...watchedValues };

            const res = await fetch('/api/public/submit-listing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    listing: listingData,
                    submitter: submitterInfo,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Listing submitted successfully!");
                resetForm();
                router.push(`/submission-success?id=${data.trackingId}`);
            } else {
                throw new Error(data.error || "Failed to submit");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to submit listing");
        } finally {
            setIsSubmitting(false);
        }
    };

    const slideVariants = {
        enter: () => ({ x: 1000, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: () => ({ x: -1000, opacity: 0 }),
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-6">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">List Your Property</h1>
                    <p className="text-white/60">Reach thousands of potential buyers in Mangalore</p>
                </div>

                <WizardHeader currentStep={currentStep} listingType={formData.listingType} />

                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 min-h-[500px]">
                    <AnimatePresence mode="wait">
                        {/* Step 1: Listing Type */}
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="text-2xl font-bold text-center mb-8">Choose Property Type</h2>
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

                        {/* Step 2: Property Details */}
                        {currentStep === 2 && formData.listingType && (
                            <motion.div
                                key="step2"
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold text-white mb-4">Basic Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-medium text-white/80">
                                                Property Title <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                {...register("title")}
                                                placeholder="e.g., Luxury 3BHK Apartment in Kadri"
                                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-white/80">
                                                Price <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                {...register("price")}
                                                placeholder="e.g., ₹85 Lakhs"
                                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

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
                                    <CommercialFields register={register} errors={errors} listingType={formData.listingType} />
                                )}
                            </motion.div>
                        )}

                        {/* Step 3: Location */}
                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                className="space-y-8"
                            >
                                <h2 className="text-2xl font-bold">Location & Media</h2>
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
                            </motion.div>
                        )}

                        {/* Step 4: Contact Info & Submit */}
                        {currentStep === 4 && (
                            <motion.div
                                key="step4"
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-bold">Your Contact Information</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium text-white/80">
                                            Your Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            value={submitterInfo.name}
                                            onChange={(e) => setSubmitterInfo({ ...submitterInfo, name: e.target.value })}
                                            placeholder="John Doe"
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white/80">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={submitterInfo.email}
                                            onChange={(e) => setSubmitterInfo({ ...submitterInfo, email: e.target.value })}
                                            placeholder="john@example.com"
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white/80">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            value={submitterInfo.phone}
                                            onChange={(e) => setSubmitterInfo({ ...submitterInfo, phone: e.target.value })}
                                            placeholder="+91 9999999999"
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mt-6">
                                    <p className="text-yellow-500 text-sm">
                                        📋 Your listing will be reviewed within 24 hours. We'll send you an email once it's approved!
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <WizardNavigation
                    currentStep={currentStep}
                    onBack={handleBack}
                    onNext={currentStep === 4 ? onSubmit : handleNext}
                    onSaveDraft={() => { }}
                    canGoNext={currentStep === 1 ? Boolean(formData.listingType) : true}
                    isLastStep={currentStep === 4}
                    isSaving={isSubmitting}
                />
            </div>
        </div>
    );
}
