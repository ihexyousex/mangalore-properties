"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft, Building, Home, Map, Check, ChevronRight, Upload } from "lucide-react";
import clsx from "clsx";

export default function AddPropertyPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        type: "", // Apartment, Villa, Commercial, Land
        listingType: "", // Sell, Rent
        location: "",
        price: "",
        status: "Available", // Default
        description: "",
        configuration: "", // 2BHK, 3BHK etc
        sqft: "",
        builder: "",
        rera_id: "",
        possession_date: "",

        // Commercial Specific
        washrooms: "",
        pantry: false,
        parking_spots: "",

        // Land Specific
        zoning: "", // Residential, Commercial, Mixed

        // Rent Specific
        deposit: "",
        maintenance: "",

        // Images
        image_url: "",
        images: [] as string[]
    });

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Prepare data for insertion
            // Note: You might need to adjust columns based on your actual DB schema
            // For now, we'll map to existing columns and store extra data in description or separate columns if they exist

            const projectData = {
                name: formData.name,
                type: formData.type, // This maps to 'type' column (Apartment, Villa, etc)
                // We might need a 'category' or 'listing_type' column for Sell/Rent if it exists, 
                // otherwise we can append to type or description. 
                // For this implementation, we'll assume 'type' holds the property type.
                location: formData.location,
                price: formData.price,
                status: formData.status,
                description: formData.description +
                    (formData.listingType ? `\n\nListing Type: ${formData.listingType}` : "") +
                    (formData.washrooms ? `\nWashrooms: ${formData.washrooms}` : "") +
                    (formData.pantry ? `\nPantry: Yes` : "") +
                    (formData.deposit ? `\nDeposit: ${formData.deposit}` : ""),
                configuration: formData.configuration,
                image_url: formData.image_url || "https://ik.imagekit.io/dydioygv9/default-property.jpg"
                // Add other fields if your DB supports them
            };

            const { error } = await supabase.from("projects").insert([projectData]);

            if (error) throw error;

            alert("Property added successfully!");
            router.push("/admin/projects");

        } catch (error: any) {
            console.error("Error adding property:", error);
            alert("Error adding property: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <ArrowLeft size={24} className="text-white" />
                </button>
                <div>
                    <h1 className="text-2xl font-serif font-bold text-white">Add New Property</h1>
                    <p className="text-white/50 text-sm">Step {step} of 3</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-white/10 rounded-full mb-8 overflow-hidden">
                <div
                    className="h-full bg-gold transition-all duration-500 ease-out"
                    style={{ width: `${(step / 3) * 100}%` }}
                />
            </div>

            {/* Step 1: Category Selection */}
            {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-xl font-bold text-white">What kind of property is this?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { id: "Apartment", icon: Building, label: "Apartment" },
                            { id: "Villa", icon: Home, label: "Villa" },
                            { id: "Commercial", icon: Building, label: "Commercial" },
                            { id: "Land", icon: Map, label: "Land / Plot" }
                        ].map((type) => (
                            <button
                                key={type.id}
                                onClick={() => {
                                    setFormData({ ...formData, type: type.id });
                                    handleNext();
                                }}
                                className={clsx(
                                    "p-6 rounded-xl border transition-all duration-200 flex flex-col items-center gap-4 group",
                                    formData.type === type.id
                                        ? "bg-gold text-black border-gold"
                                        : "bg-white/5 border-white/10 hover:border-gold/50 text-white"
                                )}
                            >
                                <type.icon size={32} className={formData.type === type.id ? "text-black" : "text-gold group-hover:scale-110 transition-transform"} />
                                <span className="font-bold">{type.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 2: Listing Type */}
            {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-xl font-bold text-white">Is it for Sell or Rent?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {["Sell", "Rent"].map((lType) => (
                            <button
                                key={lType}
                                onClick={() => {
                                    setFormData({ ...formData, listingType: lType });
                                    handleNext();
                                }}
                                className={clsx(
                                    "p-8 rounded-xl border transition-all duration-200 flex items-center justify-center gap-3 text-lg font-bold",
                                    formData.listingType === lType
                                        ? "bg-gold text-black border-gold"
                                        : "bg-white/5 border-white/10 hover:border-gold/50 text-white"
                                )}
                            >
                                {formData.listingType === lType && <Check size={20} />}
                                For {lType}
                            </button>
                        ))}
                    </div>
                    <button onClick={handleBack} className="text-white/50 hover:text-white text-sm mt-4">
                        Back to Category
                    </button>
                </div>
            )}

            {/* Step 3: Details Form */}
            {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-xl font-bold text-white">Property Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs text-white/50 uppercase font-bold">Property Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none"
                                placeholder="e.g. Prestige Valley"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-white/50 uppercase font-bold">Location</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none"
                                placeholder="e.g. Bejai, Mangalore"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-white/50 uppercase font-bold">Price</label>
                            <input
                                type="text"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none"
                                placeholder={formData.listingType === 'Rent' ? "e.g. 25,000 / month" : "e.g. 1.5 Cr"}
                            />
                        </div>

                        {/* Conditional Fields based on Category */}
                        {formData.type !== 'Land' && (
                            <div className="space-y-2">
                                <label className="text-xs text-white/50 uppercase font-bold">Configuration</label>
                                <input
                                    type="text"
                                    value={formData.configuration}
                                    onChange={e => setFormData({ ...formData, configuration: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none"
                                    placeholder={formData.type === 'Commercial' ? "e.g. 1500 sqft Office" : "e.g. 3 BHK"}
                                />
                            </div>
                        )}

                        {/* Commercial Specific */}
                        {formData.type === 'Commercial' && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-xs text-white/50 uppercase font-bold">Washrooms</label>
                                    <input
                                        type="number"
                                        value={formData.washrooms}
                                        onChange={e => setFormData({ ...formData, washrooms: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none"
                                        placeholder="Number of washrooms"
                                    />
                                </div>
                                <div className="flex items-center gap-3 pt-8">
                                    <input
                                        type="checkbox"
                                        checked={formData.pantry}
                                        onChange={e => setFormData({ ...formData, pantry: e.target.checked })}
                                        className="w-5 h-5 accent-gold"
                                    />
                                    <label className="text-white">Has Pantry?</label>
                                </div>
                            </>
                        )}

                        {/* Rent Specific */}
                        {formData.listingType === 'Rent' && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-xs text-white/50 uppercase font-bold">Security Deposit</label>
                                    <input
                                        type="text"
                                        value={formData.deposit}
                                        onChange={e => setFormData({ ...formData, deposit: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none"
                                        placeholder="e.g. 10 Lakhs"
                                    />
                                </div>
                            </>
                        )}

                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-xs text-white/50 uppercase font-bold">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none h-32"
                                placeholder="Describe the property..."
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                        <button
                            onClick={handleBack}
                            className="px-6 py-3 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 bg-gold text-black font-bold py-3 rounded-lg hover:bg-amber-400 transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? "Creating..." : "Create Listing"}
                            {!loading && <ChevronRight size={20} />}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
