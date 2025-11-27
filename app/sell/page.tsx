"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, Info, ChevronRight, ChevronLeft, Upload } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import clsx from "clsx";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useUser } from "@/components/UserProvider";
import { useRouter } from "next/navigation";

export default function SellPage() {
    const { user, openLoginModal } = useUser();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    // Redirect if not logged in
    useEffect(() => {
        // Small delay to allow user state to hydrate
        const timer = setTimeout(() => {
            if (!user) {
                openLoginModal();
                // Optional: router.push("/"); 
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [user, openLoginModal]);

    const [formData, setFormData] = useState({
        // Step 1: Basics
        listingType: "Sell", // Sell, Rent
        propertyType: "Apartment", // Apartment, Villa, Land, Commercial

        // Step 2: Details
        name: "", // Project Title / Heading
        location: "",
        price: "",
        description: "",

        // Specifics
        bedrooms: "", // 1BHK, 2BHK...
        bathrooms: "",
        area: "", // sqft or cents
        floor: "",
        totalFloors: "",
        furnishing: "Semi-Furnished",
        parking: "1",

        // Rent Specific
        deposit: "",
        maintenance: "",
        availableFrom: "",
        preferredTenants: "Any", // Family, Bachelors, Any

        // Commercial Specific
        washrooms: "",
        pantry: "No",

        // Land Specific
        facing: "",
        roadWidth: "",
        zoning: "Residential",
    });

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            openLoginModal();
            return;
        }
        setStatus("loading");

        try {
            // Map form data to database columns
            // We use existing columns as best as possible

            const projectData = {
                title: formData.name || `${formData.bedrooms || ''} ${formData.propertyType} for ${formData.listingType} in ${formData.location}`,
                slug: `${formData.listingType.toLowerCase()}-${formData.propertyType.toLowerCase()}-${Date.now()}`, // Unique slug
                builder_id: null, // User listing
                // Store user info in builder name text column if possible, or just "Owner"
                // We'll use a specific convention or just "Owner Listing"
                // Actually, we can't write to 'builder' column if it's not in the table? 
                // check_all_columns showed 'builder' (text).
                builder: user.name || "Owner",

                location: formData.location,
                price_text: formData.price, // Display price
                status: "Pending Approval", // Custom status
                category: formData.propertyType, // Apartment, Villa...
                type: formData.listingType === "Sell" ? "Resale" : "Rent", // Resale or Rent

                description: `${formData.description}\n\nContact: ${user.phone}\nOwner Name: ${user.name}`,

                // Details
                carpet_area: formData.area,
                floor_number: formData.floor,
                total_floors: formData.totalFloors,
                bathrooms: formData.bathrooms,
                parking_count: formData.parking,
                furnished_status: formData.furnishing,

                // Rent specific
                security_deposit: formData.deposit,
                maintenance_charges: formData.maintenance,
                preferred_tenants: formData.preferredTenants,

                // Store user phone in rera_id as a hack to link to user
                rera_id: `USER:${user.phone}`,

                featured: false,

                // Default images
                cover_image_url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000", // Placeholder
                gallery_images: []
            };

            const { error } = await supabase.from("projects").insert(projectData);

            if (error) throw error;

            setStatus("success");

            // Also add to leads for notification
            await supabase.from("leads").insert({
                name: user.name || "User Listing",
                phone: user.phone || "",
                message: `New Property Listed: ${projectData.title} (${projectData.slug})`,
                project: "New Listing Submission"
            });

        } catch (error) {
            console.error("Error submitting property:", error);
            setStatus("error");
        }
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    if (!user) {
        return (
            <main className="min-h-screen bg-dark-bg text-white flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="animate-spin mx-auto mb-4 text-gold" size={32} />
                    <p>Please login to list your property...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-dark-bg text-white">
            <Navbar />

            <div className="pt-32 pb-12 container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif font-bold mb-4">List Your Property</h1>
                    <p className="text-white/60">Fill in the details to list your property on Mangalore Properties.</p>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center justify-center mb-12 gap-4">
                    <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors", step >= 1 ? "bg-gold text-dark-bg" : "bg-white/10")}>1</div>
                    <div className={clsx("w-20 h-1 rounded-full transition-colors", step >= 2 ? "bg-gold" : "bg-white/10")} />
                    <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors", step >= 2 ? "bg-gold text-dark-bg" : "bg-white/10")}>2</div>
                    <div className={clsx("w-20 h-1 rounded-full transition-colors", step >= 3 ? "bg-gold" : "bg-white/10")} />
                    <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors", step >= 3 ? "bg-gold text-dark-bg" : "bg-white/10")}>3</div>
                </div>

                <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-2xl border border-white/10">

                    {/* Step 1: Type Selection */}
                    {step === 1 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                            <div>
                                <label className="block text-lg font-bold text-white mb-4">I want to</label>
                                <div className="grid grid-cols-2 gap-4">
                                    {["Sell", "Rent"].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => handleChange("listingType", type)}
                                            className={clsx(
                                                "py-4 rounded-xl border font-bold text-lg transition-all",
                                                formData.listingType === type
                                                    ? "bg-gold text-dark-bg border-gold"
                                                    : "bg-white/5 border-white/10 hover:border-gold/50"
                                            )}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-lg font-bold text-white mb-4">Property Type</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {["Apartment", "Villa", "Commercial", "Land"].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => handleChange("propertyType", type)}
                                            className={clsx(
                                                "py-4 rounded-xl border font-medium transition-all",
                                                formData.propertyType === type
                                                    ? "bg-white text-dark-bg border-white"
                                                    : "bg-white/5 border-white/10 hover:border-white/50"
                                            )}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="bg-gold text-dark-bg px-8 py-3 rounded-full font-bold hover:bg-amber-400 transition-colors flex items-center gap-2"
                                >
                                    Next Step <ChevronRight size={20} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Details */}
                    {step === 2 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                            <h2 className="text-2xl font-serif font-bold text-gold mb-6">Property Details</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-white/60">Project Name / Title</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleChange("name", e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-gold/50 outline-none"
                                        placeholder="e.g. Luxury Apartment in Bejai"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-white/60">Location</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.location}
                                        onChange={(e) => handleChange("location", e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-gold/50 outline-none"
                                        placeholder="e.g. Kadri, Mangalore"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-white/60">
                                        {formData.listingType === "Rent" ? "Monthly Rent (₹)" : "Expected Price (₹)"}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.price}
                                        onChange={(e) => handleChange("price", e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-gold/50 outline-none"
                                        placeholder="e.g. 25000 or 85 Lakhs"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-white/60">
                                        {formData.propertyType === "Land" ? "Plot Area (Cents/Sqft)" : "Built-up Area (Sqft)"}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.area}
                                        onChange={(e) => handleChange("area", e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-gold/50 outline-none"
                                        placeholder="e.g. 1200"
                                    />
                                </div>
                            </div>

                            {/* Conditional Fields based on Property Type */}
                            {(formData.propertyType === "Apartment" || formData.propertyType === "Villa") && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm text-white/60">Bedrooms</label>
                                        <select
                                            value={formData.bedrooms}
                                            onChange={(e) => handleChange("bedrooms", e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-gold/50 outline-none [&>option]:bg-dark-bg"
                                        >
                                            <option value="">Select</option>
                                            <option value="1 BHK">1 BHK</option>
                                            <option value="2 BHK">2 BHK</option>
                                            <option value="3 BHK">3 BHK</option>
                                            <option value="4+ BHK">4+ BHK</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-white/60">Bathrooms</label>
                                        <input
                                            type="number"
                                            value={formData.bathrooms}
                                            onChange={(e) => handleChange("bathrooms", e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-gold/50 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-white/60">Floor No.</label>
                                        <input
                                            type="text"
                                            value={formData.floor}
                                            onChange={(e) => handleChange("floor", e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-gold/50 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-white/60">Total Floors</label>
                                        <input
                                            type="text"
                                            value={formData.totalFloors}
                                            onChange={(e) => handleChange("totalFloors", e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-gold/50 outline-none"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Rent Specifics */}
                            {formData.listingType === "Rent" && (
                                <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-4">
                                    <h3 className="font-bold text-gold text-sm uppercase">Rental Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm text-white/60">Security Deposit</label>
                                            <input
                                                type="text"
                                                value={formData.deposit}
                                                onChange={(e) => handleChange("deposit", e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-gold/50 outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-white/60">Maintenance Charges</label>
                                            <input
                                                type="text"
                                                value={formData.maintenance}
                                                onChange={(e) => handleChange("maintenance", e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-gold/50 outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-white/60">Furnishing</label>
                                            <select
                                                value={formData.furnishing}
                                                onChange={(e) => handleChange("furnishing", e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-gold/50 outline-none [&>option]:bg-dark-bg"
                                            >
                                                <option value="Unfurnished">Unfurnished</option>
                                                <option value="Semi-Furnished">Semi-Furnished</option>
                                                <option value="Fully Furnished">Fully Furnished</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-white/60">Preferred Tenants</label>
                                            <select
                                                value={formData.preferredTenants}
                                                onChange={(e) => handleChange("preferredTenants", e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-gold/50 outline-none [&>option]:bg-dark-bg"
                                            >
                                                <option value="Any">Any</option>
                                                <option value="Family">Family</option>
                                                <option value="Bachelors">Bachelors</option>
                                                <option value="Company Lease">Company Lease</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Commercial Specifics */}
                            {formData.propertyType === "Commercial" && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm text-white/60">Washrooms</label>
                                        <input
                                            type="number"
                                            value={formData.washrooms}
                                            onChange={(e) => handleChange("washrooms", e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-gold/50 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-white/60">Pantry</label>
                                        <select
                                            value={formData.pantry}
                                            onChange={(e) => handleChange("pantry", e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-gold/50 outline-none [&>option]:bg-dark-bg"
                                        >
                                            <option value="No">No</option>
                                            <option value="Yes">Yes</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm text-white/60">Description / Additional Details</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleChange("description", e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-gold/50 outline-none h-32"
                                    placeholder="Describe the property features, nearby landmarks, etc."
                                />
                            </div>

                            <div className="flex justify-between pt-4">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="text-white/60 hover:text-white flex items-center gap-2 px-4 py-2"
                                >
                                    <ChevronLeft size={20} /> Back
                                </button>
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="bg-gold text-dark-bg px-8 py-3 rounded-full font-bold hover:bg-amber-400 transition-colors flex items-center gap-2"
                                >
                                    Next Step <ChevronRight size={20} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Review & Submit */}
                    {step === 3 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                            <div className="text-center">
                                <h2 className="text-2xl font-serif font-bold text-gold mb-2">Review & Submit</h2>
                                <p className="text-white/60">Please review your details before submitting.</p>
                            </div>

                            <div className="bg-white/5 rounded-xl p-6 space-y-4 border border-white/10">
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="text-white/60">Type</span>
                                    <span className="font-bold">{formData.listingType} - {formData.propertyType}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="text-white/60">Location</span>
                                    <span className="font-bold">{formData.location}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="text-white/60">Price</span>
                                    <span className="font-bold text-gold">₹{formData.price}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="text-white/60">Area</span>
                                    <span className="font-bold">{formData.area}</span>
                                </div>
                                {formData.listingType === "Rent" && (
                                    <div className="flex justify-between border-b border-white/10 pb-2">
                                        <span className="text-white/60">Deposit</span>
                                        <span className="font-bold">₹{formData.deposit}</span>
                                    </div>
                                )}
                            </div>

                            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex gap-3 text-blue-300 text-sm">
                                <Info className="shrink-0" size={20} />
                                <p>Your listing will be reviewed by our admin team before going live. You will be notified once approved.</p>
                            </div>

                            <div className="flex justify-between pt-4">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    disabled={status === "loading" || status === "success"}
                                    className="text-white/60 hover:text-white flex items-center gap-2 px-4 py-2"
                                >
                                    <ChevronLeft size={20} /> Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={status === "loading" || status === "success"}
                                    className={clsx(
                                        "px-8 py-3 rounded-full font-bold transition-all duration-300 flex items-center gap-2",
                                        status === "success" ? "bg-green-500 text-white" : "bg-gold text-dark-bg hover:bg-amber-400"
                                    )}
                                >
                                    {status === "loading" ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} /> Submitting...
                                        </>
                                    ) : status === "success" ? (
                                        <>
                                            <CheckCircle size={20} /> Submitted!
                                        </>
                                    ) : (
                                        "Submit Listing"
                                    )}
                                </button>
                            </div>

                            {status === "success" && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center text-green-400">
                                    <p className="font-bold text-lg">Listing Submitted Successfully!</p>
                                    <p className="text-sm opacity-80">We will contact you shortly for verification.</p>
                                    <button onClick={() => router.push("/")} className="mt-4 text-white underline">Go Home</button>
                                </motion.div>
                            )}
                            {status === "error" && (
                                <p className="text-center text-red-500">Something went wrong. Please try again.</p>
                            )}
                        </motion.div>
                    )}
                </form>
            </div>
            <Footer />
        </main>
    );
}
