"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { usePublicListingStore } from "@/stores/usePublicListingStore";
import StepIndicator from "./wizard/StepIndicator";
import NavigationButtons from "./wizard/NavigationButtons";
import SelectionChip from "./wizard/SelectionChip";
import LocationSearch from "./wizard/LocationSearch";
import AmenityGrid from "./wizard/AmenityGrid";
import ImageUploader from "./wizard/ImageUploader";
import { Home, Building2, LandPlot, Store, Sparkles } from "lucide-react";
import { BHK_OPTIONS, BATHROOM_OPTIONS, BALCONY_OPTIONS, FURNISHING_OPTIONS, PRICE_SUFFIXES } from "@/lib/constants/listingOptions";

export default function PublicListingForm() {
    const router = useRouter();
    const {
        currentStep,
        formData,
        setStep,
        nextStep,
        prevStep,
        updateFormData,
        resetForm
    } = usePublicListingStore();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

    // Scroll to top on step change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentStep]);

    const handleNext = () => {
        nextStep();
    };

    const handleBack = () => {
        prevStep();
    };

    const generateDescription = async () => {
        setIsGeneratingDesc(true);
        try {
            const res = await fetch('/api/generate-desc', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    listingType: formData.intent === 'rent' ? 'rent_residential' : 'resale_residential',
                    basics: {
                        title: `${formData.bhk || ''} ${formData.propertyType} in ${formData.area || formData.city}`,
                        location: formData.location,
                        bhk: formData.bhk,
                        price: formData.price,
                    },
                    amenities: formData.amenities,
                }),
            });
            const data = await res.json();
            if (data.description) {
                updateFormData({ description: data.description });
                toast.success("Description generated!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate description");
        } finally {
            setIsGeneratingDesc(false);
        }
    };

    const onSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Map data to API format
            const listingData = {
                listingType: formData.intent === 'rent'
                    ? (formData.propertyType === 'commercial' ? 'commercial_rent' : 'rent_residential')
                    : (formData.propertyType === 'commercial' ? 'commercial_sell' : 'resale_residential'),
                title: `${formData.bhk || ''} ${formData.propertyType} in ${formData.area || formData.city}`,
                price: formData.price,
                location: formData.location,
                latitude: formData.latitude,
                longitude: formData.longitude,
                pincode: formData.pincode,
                area: formData.area,
                description: formData.description,
                amenities: formData.amenities,
                bhk: formData.bhk,
                bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined,
                furnishing: formData.furnishing,
                images: formData.images, // Note: In a real app, upload these first and send URLs
            };

            const submitterData = {
                name: formData.submitterName,
                email: formData.submitterEmail,
                phone: formData.submitterPhone,
            };

            const res = await fetch('/api/public/submit-listing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    listing: listingData,
                    submitter: submitterData,
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

    // Validation logic for "Next" button
    const canGoNext = () => {
        switch (currentStep) {
            case 1: return !!formData.intent && !!formData.propertyType;
            case 2: return !!formData.location;
            case 3: return !!formData.bhk && !!formData.bathrooms;
            case 4: return !!formData.furnishing;
            case 5: return formData.images.length > 0;
            case 6: return !!formData.price && !!formData.description;
            case 7: return !!formData.submitterName && !!formData.submitterPhone && !!formData.submitterEmail;
            default: return false;
        }
    };

    const slideVariants = {
        enter: { x: 20, opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: -20, opacity: 0 },
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white pb-24">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-neutral-950/80 backdrop-blur-md border-b border-white/10 p-4">
                <div className="max-w-xl mx-auto">
                    <h1 className="text-lg font-bold text-center">
                        {currentStep === 1 && "Start Listing"}
                        {currentStep === 2 && "Location"}
                        {currentStep === 3 && "Property Layout"}
                        {currentStep === 4 && "Features & Amenities"}
                        {currentStep === 5 && "Photos"}
                        {currentStep === 6 && "Price & Details"}
                        {currentStep === 7 && "Contact Info"}
                    </h1>
                </div>
            </div>

            <div className="max-w-xl mx-auto p-6">
                <StepIndicator currentStep={currentStep} totalSteps={7} />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="min-h-[400px]"
                    >
                        {/* Step 1: Basics */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold">What do you want to do?</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <SelectionChip
                                        label="Sell"
                                        isSelected={formData.intent === 'sell'}
                                        onClick={() => updateFormData({ intent: 'sell' })}
                                    />
                                    <SelectionChip
                                        label="Rent"
                                        isSelected={formData.intent === 'rent'}
                                        onClick={() => updateFormData({ intent: 'rent' })}
                                    />
                                </div>

                                {formData.intent && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-4 mt-8"
                                    >
                                        <h2 className="text-2xl font-bold">Property Type</h2>
                                        <div className="grid grid-cols-2 gap-4">
                                            <SelectionChip
                                                label="Apartment"
                                                icon={<Building2 className="w-6 h-6" />}
                                                isSelected={formData.propertyType === 'apartment'}
                                                onClick={() => updateFormData({ propertyType: 'apartment' })}
                                            />
                                            <SelectionChip
                                                label="House / Villa"
                                                icon={<Home className="w-6 h-6" />}
                                                isSelected={formData.propertyType === 'house'}
                                                onClick={() => updateFormData({ propertyType: 'house' })}
                                            />
                                            <SelectionChip
                                                label="Plot / Land"
                                                icon={<LandPlot className="w-6 h-6" />}
                                                isSelected={formData.propertyType === 'plot'}
                                                onClick={() => updateFormData({ propertyType: 'plot' })}
                                            />
                                            <SelectionChip
                                                label="Commercial"
                                                icon={<Store className="w-6 h-6" />}
                                                isSelected={formData.propertyType === 'commercial'}
                                                onClick={() => updateFormData({ propertyType: 'commercial' })}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        )}

                        {/* Step 2: Location */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold">Where is it located?</h2>
                                <LocationSearch
                                    defaultValue={formData.location}
                                    onLocationSelect={(data) => updateFormData(data)}
                                />

                                {formData.location && (
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                        <p className="text-sm text-white/60 mb-1">Selected Location</p>
                                        <p className="font-medium text-lg">{formData.location}</p>
                                        {formData.area && (
                                            <span className="inline-block mt-2 px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-sm">
                                                {formData.area}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 3: Layout */}
                        {currentStep === 3 && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-xl font-bold mb-4">Bedrooms (BHK)</h2>
                                    <div className="flex flex-wrap gap-3">
                                        {BHK_OPTIONS.map((opt) => (
                                            <button
                                                key={opt}
                                                onClick={() => updateFormData({ bhk: opt })}
                                                className={`px-6 py-3 rounded-full border transition-all ${formData.bhk === opt
                                                    ? "bg-yellow-500 text-neutral-950 border-yellow-500 font-bold"
                                                    : "bg-white/5 border-white/10 hover:bg-white/10"
                                                    }`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold mb-4">Bathrooms</h2>
                                    <div className="flex flex-wrap gap-3">
                                        {BATHROOM_OPTIONS.map((opt) => (
                                            <button
                                                key={opt}
                                                onClick={() => updateFormData({ bathrooms: opt })}
                                                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${formData.bathrooms === opt
                                                    ? "bg-yellow-500 text-neutral-950 border-yellow-500 font-bold"
                                                    : "bg-white/5 border-white/10 hover:bg-white/10"
                                                    }`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold mb-4">Balconies</h2>
                                    <div className="flex flex-wrap gap-3">
                                        {BALCONY_OPTIONS.map((opt) => (
                                            <button
                                                key={opt}
                                                onClick={() => updateFormData({ balconies: opt })}
                                                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${formData.balconies === opt
                                                    ? "bg-yellow-500 text-neutral-950 border-yellow-500 font-bold"
                                                    : "bg-white/5 border-white/10 hover:bg-white/10"
                                                    }`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Features */}
                        {currentStep === 4 && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-xl font-bold mb-4">Furnishing Status</h2>
                                    <div className="grid grid-cols-3 gap-3">
                                        {FURNISHING_OPTIONS.map((opt) => (
                                            <button
                                                key={opt}
                                                onClick={() => updateFormData({ furnishing: opt as any })}
                                                className={`p-3 rounded-xl border text-sm font-medium transition-all ${formData.furnishing === opt
                                                    ? "bg-yellow-500 text-neutral-950 border-yellow-500"
                                                    : "bg-white/5 border-white/10 hover:bg-white/10"
                                                    }`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold mb-4">Amenities</h2>
                                    <AmenityGrid
                                        selectedAmenities={formData.amenities}
                                        onChange={(amenities) => updateFormData({ amenities })}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 5: Photos */}
                        {currentStep === 5 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold">Add Photos</h2>
                                <ImageUploader
                                    images={formData.images}
                                    onChange={(images) => updateFormData({ images })}
                                />
                            </div>
                        )}

                        {/* Step 6: Price & Details */}
                        {currentStep === 6 && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-xl font-bold mb-4">Expected Price</h2>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60">₹</span>
                                        <input
                                            value={formData.price}
                                            onChange={(e) => updateFormData({ price: e.target.value })}
                                            placeholder="e.g. 85 Lakhs"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-xl font-bold text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="flex gap-2 mt-3">
                                        {PRICE_SUFFIXES.map((suffix) => (
                                            <button
                                                key={suffix}
                                                onClick={() => updateFormData({ price: `${formData.price} ${suffix}` })}
                                                className="px-3 py-1 bg-white/5 rounded-full text-xs hover:bg-white/10"
                                            >
                                                + {suffix}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-bold">Description</h2>
                                        <button
                                            onClick={generateDescription}
                                            disabled={isGeneratingDesc}
                                            className="flex items-center gap-2 text-yellow-500 text-sm hover:text-yellow-400 disabled:opacity-50"
                                        >
                                            {isGeneratingDesc ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                            Auto-Generate
                                        </button>
                                    </div>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => updateFormData({ description: e.target.value })}
                                        placeholder="Describe your property..."
                                        rows={6}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all resize-none"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 7: Contact */}
                        {currentStep === 7 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold">Contact Details</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-white/60 mb-1 block">Your Name</label>
                                        <input
                                            value={formData.submitterName}
                                            onChange={(e) => updateFormData({ submitterName: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-white/60 mb-1 block">Phone Number</label>
                                        <input
                                            value={formData.submitterPhone}
                                            onChange={(e) => updateFormData({ submitterPhone: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-white/60 mb-1 block">Email Address</label>
                                        <input
                                            value={formData.submitterEmail}
                                            onChange={(e) => updateFormData({ submitterEmail: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence >
            </div >

            <NavigationButtons
                onBack={handleBack}
                onNext={currentStep === 7 ? onSubmit : handleNext}
                canGoBack={currentStep > 1}
                canGoNext={canGoNext()}
                isLastStep={currentStep === 7}
                isSubmitting={isSubmitting}
            />
        </div >
    );
}
