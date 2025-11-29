"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { ListingType } from "@/stores/useListingStore";
import { getSchemaForListingType } from "@/lib/schemas/listingSchemas";

import PublicWizardHeader from "./wizard/PublicWizardHeader";
import PublicWizardNavigation from "./wizard/PublicWizardNavigation";
import ListingTypeCard, { LISTING_TYPES } from "@/components/admin/wizard/ListingTypeCard";
import { BuilderFields, ResaleFields, RentalFields, CommercialFields } from "@/components/admin/wizard/FormSections";
import LocationPicker from "@/components/admin/LocationPicker";
import { useLoadScript } from "@react-google-maps/api";
import { Sparkles, Loader2, User, Mail, Phone } from "lucide-react";

const MAPS_LIBRARIES: ("places")[] = ["places"];

const contactSchema = z.object({
    submitterName: z.string().min(2, "Name is required"),
    submitterEmail: z.string().email("Invalid email address"),
    submitterPhone: z.string().min(10, "Valid phone number is required"),
});

export default function PublicListingWizard() {
    const router = useRouter();

    const [currentStep, setCurrentStep] = useState(1);
    const [listingType, setListingType] = useState<ListingType | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

    const { isLoaded: mapsLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        libraries: MAPS_LIBRARIES,
    });

    if (loadError) {
        return <div className="text-red-500 text-center p-4">Error loading Google Maps</div>;
    }

    const getStepSchema = () => {
        if (currentStep === 5) return contactSchema;
        if (listingType) return getSchemaForListingType(listingType);
        return z.any();
    };

    const {
        register,
        trigger,
        formState: { errors },
        setValue,
        watch,
        getValues,
    } = useForm({
        resolver: zodResolver(getStepSchema()),
        mode: "onChange",
        defaultValues: formData,
    });

    const watchedValues = watch();

    const handleTypeSelection = (type: ListingType) => {
        setListingType(type);
        setFormData({ ...formData, listingType: type });
        setCurrentStep(2);
    };

    const handleBack = () => {
        if (currentStep === 2) {
            setListingType(null);
        }
        setCurrentStep(prev => prev - 1);
    };

    const handleNext = async () => {
        let isValid = false;

        if (currentStep === 2) {
            isValid = await trigger(["title", "price", "bhk", "bathrooms", "total_floors", "floor_number", "built_up_area", "plot_area"]);
        } else if (currentStep === 3) {
            const loc = getValues("location");
            if (loc) isValid = true;
            else {
                isValid = await trigger("location");
            }
        } else if (currentStep === 4) {
            isValid = await trigger(["description", "amenities"]);
        }

        if (isValid) {
            setFormData({ ...formData, ...watchedValues });
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleGenerateDescription = async () => {
        setIsGeneratingDesc(true);
        try {
            const res = await fetch('/api/generate-desc', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    listingType: listingType,
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
                toast.success("AI description generated!");
            }
        } catch (error) {
            toast.error("Failed to generate description");
        } finally {
            setIsGeneratingDesc(false);
        }
    };

    const onSubmit = async () => {
        const isValid = await trigger(["submitterName", "submitterEmail", "submitterPhone"]);
        if (!isValid) return;

        setIsSubmitting(true);
        try {
            const finalData = { ...formData, ...watchedValues };

            const submissionPayload = {
                listing: {
                    ...finalData,
                    bathrooms: finalData.bathrooms ? Number(finalData.bathrooms) : undefined,
                },
                submitter: {
                    name: finalData.submitterName,
                    email: finalData.submitterEmail,
                    phone: finalData.submitterPhone,
                }
            };

            const res = await fetch('/api/public/submit-listing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionPayload),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Listing submitted successfully!");
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
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 50 : -50,
            opacity: 0,
        }),
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-4 md:p-8 pb-24">
            <div className="max-w-4xl mx-auto">
                <PublicWizardHeader currentStep={currentStep} listingType={listingType} />

                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 min-h-[500px]">
                    <AnimatePresence mode="wait" custom={1}>
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="text-2xl font-bold text-center mb-8">What kind of property?</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    {LISTING_TYPES.map((type) => (
                                        <ListingTypeCard
                                            key={type.type}
                                            type={type.type}
                                            title={type.title}
                                            description={type.description}
                                            icon={type.icon}
                                            isSelected={listingType === type.type}
                                            onClick={() => handleTypeSelection(type.type)}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 2 && listingType && (
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
                                            {errors.title && (
                                                <p className="text-sm text-red-500">{errors.title.message as string}</p>
                                            )}
                                        </div>

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

                                {listingType === 'builder_new' && (
                                    <BuilderFields register={register} errors={errors} />
                                )}
                                {listingType === 'resale_residential' && (
                                    <ResaleFields register={register} errors={errors} />
                                )}
                                {listingType === 'rent_residential' && (
                                    <RentalFields register={register} errors={errors} />
                                )}
                                {(listingType === 'commercial_sell' || listingType === 'commercial_rent') && (
                                    <CommercialFields
                                        register={register}
                                        errors={errors}
                                        listingType={listingType}
                                    />
                                )}
                            </motion.div>
                        )}

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
                                            initialLocation={watchedValues.location}
                                            initialLat={watchedValues.latitude}
                                            initialLng={watchedValues.longitude}
                                            onLocationSelect={(data) => {
                                                setValue('location', data.address);
                                                setValue('latitude', data.latitude);
                                                setValue('longitude', data.longitude);
                                                setValue('pincode', data.pincode);
                                                setValue('area', data.area);
                                                setValue('landmarks', data.landmarks);
                                                setValue('mapUrl', data.map_url);
                                            }}
                                        />
                                    ) : (
                                        <div className="h-64 bg-white/5 rounded-xl flex items-center justify-center">
                                            <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
                                        </div>
                                    )}
                                    {errors.location && (
                                        <p className="text-sm text-red-500 mt-2">{errors.location.message as string}</p>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold">Property Images</h3>
                                    <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-yellow-500/50 transition-colors cursor-pointer">
                                        <p className="text-white/60">Click to upload or drag and drop</p>
                                        <p className="text-sm text-white/40 mt-2">Cover image + Gallery</p>
                                    </div>
                                    <p className="text-xs text-white/40">* For this demo, images are optional. In production, we'd use ImageKit here.</p>
                                </div>
                            </motion.div>
                        )}

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
                                <h2 className="text-2xl font-bold">Description & Amenities</h2>

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

                        {currentStep === 5 && (
                            <motion.div
                                key="step5"
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-bold">Contact Details</h2>
                                <p className="text-white/60">How can we reach you regarding this listing?</p>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white/80">Your Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                            <input
                                                {...register("submitterName")}
                                                placeholder="John Doe"
                                                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                                            />
                                        </div>
                                        {errors.submitterName && (
                                            <p className="text-sm text-red-500">{errors.submitterName.message as string}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white/80">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                            <input
                                                {...register("submitterEmail")}
                                                placeholder="john@example.com"
                                                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                                            />
                                        </div>
                                        {errors.submitterEmail && (
                                            <p className="text-sm text-red-500">{errors.submitterEmail.message as string}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white/80">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                            <input
                                                {...register("submitterPhone")}
                                                placeholder="+91 98765 43210"
                                                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                                            />
                                        </div>
                                        {errors.submitterPhone && (
                                            <p className="text-sm text-red-500">{errors.submitterPhone.message as string}</p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <PublicWizardNavigation
                    currentStep={currentStep}
                    onBack={handleBack}
                    onNext={currentStep === 5 ? onSubmit : handleNext}
                    canGoNext={currentStep === 1 ? Boolean(listingType) : true}
                    isLastStep={currentStep === 5}
                    isSubmitting={isSubmitting}
                />
            </div>
        </div>
    );
}
