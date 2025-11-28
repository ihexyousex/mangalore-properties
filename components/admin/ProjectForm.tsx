"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Loader2, Upload, X, CheckCircle, Image as ImageIcon } from "lucide-react";
import clsx from "clsx";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";

type Builder = {
    id: number;
    name: string;
};

type FloorPlan = {
    name: string;
    file: File | null;
    preview: string;
};

export default function ProjectForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [builders, setBuilders] = useState<Builder[]>([]);

    // Combobox State
    const [builderQuery, setBuilderQuery] = useState("");
    const [isBuilderDropdownOpen, setIsBuilderDropdownOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Google Maps
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        libraries: ["places"],
    });
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        builder_id: "",
        location: "",
        price_text: "",
        video_url: "",
        status: "New Launch",
        category: "Residential",
        sub_category: "House", // Default for Rent
        description: "",
        amenities: "",
        completion_percentage: 0,
        map_url: "",
        ai_local_insight: "",
        // New Fields
        total_units: "",
        project_size: "",
        launch_date: "",
        possession_date: "",
        rera_id: "",
        carpet_area: "",
        floor_number: "",
        total_floors: "",
        furnished_status: "Unfurnished",
        bathrooms: "",
        parking_count: "",
        maintenance_charges: "",
        security_deposit: "",
        preferred_tenants: "Any",
        // New Enhanced Fields
        lifts_count: "",
        balconies_count: "",
        facing: "",
        price_per_sqft: "",
        additional_rooms: [] as string[],
    });

    // ... (existing code)



    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [galleryImages, setGalleryImages] = useState<File[]>([]);
    const [amenityInput, setAmenityInput] = useState("");
    const [priceValue, setPriceValue] = useState("");
    const [priceUnit, setPriceUnit] = useState("Lakhs");
    const [tags, setTags] = useState<string[]>([]);
    const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);

    const filteredBuilders = builderQuery === ""
        ? builders
        : builders.filter((b) =>
            b.name.toLowerCase().includes(builderQuery.toLowerCase())
        );

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsBuilderDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    // Fetch Builders on Mount
    useEffect(() => {
        const fetchBuilders = async () => {
            const { data, error } = await supabase.from("builders").select("id, name");
            if (data) setBuilders(data);
            if (error) console.error("Error fetching builders:", error);
        };
        fetchBuilders();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCoverImage(e.target.files[0]);
        }
    };

    const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setGalleryImages(Array.from(e.target.files));
        }
    };

    const handleAmenityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const val = amenityInput.trim();
            if (val && !tags.includes(val)) {
                setTags([...tags, val]);
            }
            setAmenityInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const addFloorPlan = () => {
        setFloorPlans([...floorPlans, { name: "", file: null, preview: "" }]);
    };

    const updateFloorPlan = (index: number, field: keyof FloorPlan, value: any) => {
        const newPlans = [...floorPlans];
        if (field === "file" && value instanceof File) {
            newPlans[index].file = value;
            newPlans[index].preview = URL.createObjectURL(value);
        } else {
            (newPlans[index] as any)[field] = value;
        }
        setFloorPlans(newPlans);
    };

    const removeFloorPlan = (index: number) => {
        const newPlans = [...floorPlans];
        setFloorPlans(newPlans.filter((_, i) => i !== index));
    };

    const uploadImage = async (file: File) => {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from("property-images")
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("property-images").getPublicUrl(filePath);
        return data.publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submit clicked");
        setLoading(true);

        try {
            console.log("Form Data:", formData);

            // Validation Check
            if (!formData.title) {
                alert("Title is required");
                setLoading(false);
                return;
            }
            // Cover image is now optional

            // Construct price text
            const finalPriceText = `${priceValue} ${priceUnit}`;
            console.log("Price:", finalPriceText);

            //1. Upload Cover Image (if exists)
            let coverImageUrl = "https://ik.imagekit.io/dydioygv9/default-property.jpg"; // Default placeholder
            if (coverImage) {
                console.log("Uploading cover image...");
                coverImageUrl = await uploadImage(coverImage);
                console.log("Cover image uploaded:", coverImageUrl);
            } else {
                console.log("No cover image provided, using default placeholder");
            }

            // 2. Upload Gallery Images
            console.log("Uploading gallery images...");
            const galleryImageUrls = await Promise.all(
                galleryImages.map((file) => uploadImage(file))
            );
            console.log("Gallery images uploaded:", galleryImageUrls.length);

            // 3. Upload Floor Plan Images
            console.log("Uploading floor plans...");
            const floorPlansData = await Promise.all(
                floorPlans.map(async (plan) => {
                    let url = null;
                    if (plan.file) {
                        url = await uploadImage(plan.file);
                    }
                    // Keep plan if it has a name OR an image
                    if (!plan.name && !url) return null;
                    return { name: plan.name, image: url };
                })
            );
            const validFloorPlans = floorPlansData.filter(Boolean);
            console.log("Floor plans processed:", validFloorPlans.length);

            // 4. Create Slug
            const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
            console.log("Generated slug:", slug);

            // Handle Builder for Rent (if empty)
            let finalBuilderId = formData.builder_id ? parseInt(formData.builder_id) : null;

            if (!finalBuilderId && formData.category === "Rent") {
                console.log("Rent property with no builder. Checking for 'Owner' builder...");
                const { data: ownerBuilder } = await supabase
                    .from("builders")
                    .select("id")
                    .ilike("name", "Owner")
                    .single();

                if (ownerBuilder) {
                    finalBuilderId = ownerBuilder.id;
                } else {
                    console.log("Creating 'Owner' builder...");
                    const { data: newOwner } = await supabase
                        .from("builders")
                        .insert({ name: "Owner", slug: "owner", description: "Individual Property Owner" })
                        .select()
                        .single();
                    if (newOwner) finalBuilderId = newOwner.id;
                }
                console.log("Assigned Builder ID:", finalBuilderId);
            }

            // 5. Insert via secure API route
            console.log("Submitting to API route...");

            // Get auth session token
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                throw new Error("Not authenticated. Please log in again.");
            }

            const projectData = {
                name: formData.title, // Mapped to 'name'
                builder: finalBuilderId, // Mapped to 'builder'
                location: formData.location,
                price: finalPriceText, // Mapped to 'price'
                status: formData.status,
                type: formData.category, // Mapped to 'type'
                sub_category: formData.category === "Rent" ? formData.sub_category : null,
                image: coverImageUrl, // Mapped to 'image'
                amenities: tags,
                description: formData.description,
                completion_percentage: formData.completion_percentage,
                map_url: formData.map_url,
                ai_local_insight: formData.ai_local_insight,
                floor_plans: validFloorPlans,
                // New Fields
                total_units: formData.total_units ? parseInt(formData.total_units) : null,
                project_size: formData.project_size,
                launch_date: formData.launch_date || null,
                possession_date: formData.possession_date || null,
                rera_id: formData.rera_id,
                carpet_area: formData.carpet_area,
                floor_number: formData.floor_number,
                total_floors: formData.total_floors ? parseInt(formData.total_floors) : null,
                furnished_status: formData.furnished_status,
                bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
                parking_count: formData.parking_count,
                maintenance_charges: formData.maintenance_charges,
                security_deposit: formData.security_deposit,
                preferred_tenants: formData.preferred_tenants,
                // Enhanced Property Details
                lifts_count: formData.lifts_count ? parseInt(formData.lifts_count) : null,
                balconies_count: formData.balconies_count ? parseInt(formData.balconies_count) : null,
                facing: formData.facing || null,
                price_per_sqft: formData.price_per_sqft ? parseFloat(formData.price_per_sqft) : null,
                additional_rooms: formData.additional_rooms || [],
            };

            // Call API route with authentication
            const response = await fetch('/api/admin/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify(projectData)
            });

            const result = await response.json();

            if (!response.ok) {
                console.error("API Error:", result.error);
                throw new Error(result.error || "Failed to create project");
            }

            console.log("Project created successfully!", result.data);
            setSuccess(true);
            setTimeout(() => {
                router.push("/admin/dashboard");
            }, 2000);

        } catch (error: any) {
            console.error("Error submitting project:", error);
            alert(error.message || "Failed to create project");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-300">
                <CheckCircle className="w-16 h-16 text-amber-500 mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Project Published Successfully!</h2>
                <p className="text-gray-400">Redirecting to dashboard...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-12 max-w-6xl mx-auto p-8 bg-neutral-900/50 border border-white/10 rounded-2xl backdrop-blur-md">

            {/* Page Header */}
            <div className="border-b border-white/10 pb-6">
                <h1 className="text-4xl font-bold text-white mb-2">Add New Property</h1>
                <p className="text-gray-400 text-lg">Fill in the details below to list a property</p>
            </div>

            {/* SECTION 1: Basic Information */}
            <div className="space-y-6 border border-blue-500/20 rounded-2xl p-8 bg-blue-500/5">
                <div className="flex items-center gap-3 border-b border-blue-500/20 pb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <span className="text-2xl">🏢</span>
                    </div>
                    <h2 className="text-2xl font-bold text-blue-400">Basic Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-base font-medium text-gray-200">Project Title <span className="text-red-500">*</span></label>
                        <input
                            required
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. NorthernSky City"
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2 relative" ref={wrapperRef}>
                        <label className="text-sm font-medium text-gray-300">Builder <span className="text-gray-500 text-xs">(Optional)</span></label>
                        <div className="relative">
                            <input
                                type="text"
                                value={builderQuery}
                                onChange={(e) => {
                                    setBuilderQuery(e.target.value);
                                    setIsBuilderDropdownOpen(true);
                                    if (e.target.value === "") {
                                        setFormData({ ...formData, builder_id: "" });
                                    }
                                }}
                                onFocus={() => setIsBuilderDropdownOpen(true)}
                                placeholder="Select or type to create builder..."
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                            />
                            {isBuilderDropdownOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-neutral-900 border border-white/10 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                    {filteredBuilders.length > 0 ? (
                                        filteredBuilders.map((b) => (
                                            <button
                                                key={b.id}
                                                type="button"
                                                onClick={() => {
                                                    setFormData({ ...formData, builder_id: b.id.toString() });
                                                    setBuilderQuery(b.name);
                                                    setIsBuilderDropdownOpen(false);
                                                }}
                                                className="w-full text-left px-4 py-2 hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
                                            >
                                                {b.name}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="p-2">
                                            <p className="text-xs text-gray-500 px-2 mb-2">No builder found.</p>
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    const newName = builderQuery.trim();
                                                    if (!newName) return;

                                                    const slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

                                                    // Optimistic update
                                                    const tempId = Date.now();
                                                    const newBuilder = { id: tempId, name: newName };
                                                    setBuilders([...builders, newBuilder]);
                                                    setFormData({ ...formData, builder_id: tempId.toString() });
                                                    setIsBuilderDropdownOpen(false);

                                                    // Actual Insert
                                                    const { data, error } = await supabase.from('builders').insert({ name: newName, slug }).select().single();

                                                    if (data) {
                                                        setBuilders(prev => prev.map(b => b.id === tempId ? data : b));
                                                        setFormData(prev => ({ ...prev, builder_id: data.id.toString() }));
                                                    }
                                                    if (error) {
                                                        console.error("Error creating builder:", error);
                                                        alert("Failed to create builder. Please try again.");
                                                    }
                                                }}
                                                className="w-full text-left px-4 py-2 bg-amber-500/10 text-amber-400 rounded hover:bg-amber-500/20 transition-colors text-sm font-medium"
                                            >
                                                + Create "{builderQuery}"
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-base font-medium text-gray-200">Location <span className="text-red-500">*</span></label>
                        {isLoaded ? (
                            <Autocomplete
                                onLoad={(autocomplete) => {
                                    autocompleteRef.current = autocomplete;
                                }}
                                onPlaceChanged={() => {
                                    if (autocompleteRef.current) {
                                        const place = autocompleteRef.current.getPlace();
                                        if (place.geometry && place.geometry.location) {
                                            const locationName = place.formatted_address || place.name || "";
                                            const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${place.place_id}`;

                                            setFormData(prev => ({
                                                ...prev,
                                                location: locationName,
                                                map_url: mapUrl
                                            }));
                                        }
                                    }
                                }}
                            >
                                <input
                                    required
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="Search location..."
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                />
                            </Autocomplete>
                        ) : (
                            <input
                                required
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g. Kadri, Mangalore"
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                            />
                        )}

                        {/* Live Map Preview */}
                        {formData.map_url && (
                            <div className="mt-4 w-full h-[300px] rounded-xl overflow-hidden border border-white/10 shadow-lg relative group">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    style={{ border: 0 }}
                                    src={formData.map_url}
                                    allowFullScreen
                                    className="filter grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                                ></iframe>
                                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs text-gold border border-gold/20">
                                    Live Preview
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <label className="text-base font-medium text-gray-200">Price <span className="text-red-500">*</span></label>
                        <div className="flex gap-2">
                            <input
                                required
                                type="number"
                                value={priceValue}
                                onChange={(e) => setPriceValue(e.target.value)}
                                placeholder="e.g. 85"
                                className="w-2/3 bg-black/50 border border-white/10 rounded-xl p-4 text-white text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                            />
                            <select
                                value={priceUnit}
                                onChange={(e) => setPriceUnit(e.target.value)}
                                className="w-1/3 bg-black/50 border border-white/10 rounded-xl p-4 text-white text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                            >
                                <option value="Lakhs">Lakhs</option>
                                <option value="Cr">Cr</option>
                                <option value="K">K (Thou)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-base font-medium text-gray-200">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        >
                            <option value="New Launch">New Launch</option>
                            <option value="Under Construction">Under Construction</option>
                            <option value="Ready to Move">Ready to Move</option>
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="text-base font-medium text-gray-200">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        >
                            <option value="Residential">Residential</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Plots">Plots</option>
                            <option value="Resale">Resale</option>
                            <option value="Rent">Rent</option>
                        </select>
                    </div>

                    {formData.category === "Rent" && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                            <label className="text-base font-medium text-gray-200">Property Type</label>
                            <select
                                name="sub_category"
                                value={formData.sub_category}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                            >
                                <option value="House">House</option>
                                <option value="Apartment">Apartment</option>
                                <option value="Villa">Villa</option>
                                <option value="Office Space">Office Space</option>
                                <option value="Shop">Shop</option>
                            </select>
                        </div>
                    )}

                    <div className="space-y-3">
                        <label className="text-base font-medium text-gray-200">Completion Status (%)</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                name="completion_percentage"
                                value={formData.completion_percentage}
                                onChange={handleChange}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                            <span className="text-white font-bold w-12">{formData.completion_percentage}%</span>
                        </div>
                    </div>
                </div>

                {/* Detailed Property Info */}
                <div className="space-y-6 border border-purple-500/20 rounded-2xl p-8 bg-purple-500/5">
                    <div className="flex items-center gap-3 border-b border-purple-500/20 pb-4">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                            <span className="text-2xl">📝</span>
                        </div>
                        <h2 className="text-2xl font-bold text-purple-400">Property Details</h2>
                    </div>

                    {/* New Projects / General */}
                    {(formData.status === "New Launch" || formData.status === "Under Construction") && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2">
                            <div className="space-y-2">
                                <label className="text-base font-medium text-gray-200">Total Units</label>
                                <input
                                    type="number"
                                    name="total_units"
                                    value={(formData as any).total_units}
                                    onChange={handleChange}
                                    placeholder="e.g. 120"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                />                       </div>
                            <div className="space-y-2">
                                <label className="text-base font-medium text-gray-200">Project Size (Acres/Sqft)</label>
                                <input
                                    name="project_size"
                                    value={(formData as any).project_size}
                                    onChange={handleChange}
                                    placeholder="e.g. 2 Acres"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                />                       </div>
                            <div className="space-y-2">
                                <label className="text-base font-medium text-gray-200">Launch Date</label>
                                <input
                                    type="date"
                                    name="launch_date"
                                    value={(formData as any).launch_date}
                                    onChange={handleChange}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                />                       </div>
                            <div className="space-y-2">
                                <label className="text-base font-medium text-gray-200">Possession Date</label>
                                <input
                                    type="date"
                                    name="possession_date"
                                    value={(formData as any).possession_date}
                                    onChange={handleChange}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                />                       </div>
                            <div className="space-y-2">
                                <label className="text-base font-medium text-gray-200">RERA ID</label>
                                <input
                                    name="rera_id"
                                    value={(formData as any).rera_id}
                                    onChange={handleChange}
                                    placeholder="e.g. PRM/KA/RERA/..."
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                />                       </div>
                        </div>
                    )}

                    {/* Resale & Rent Specifics */}
                    {(formData.category === "Resale" || formData.category === "Rent") && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2">
                            <div className="space-y-2">
                                <label className="text-base font-medium text-gray-200">Carpet Area (Sqft)</label>
                                <input
                                    name="carpet_area"
                                    value={(formData as any).carpet_area}
                                    onChange={handleChange}
                                    placeholder="e.g. 1200"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                />                       </div>
                            <div className="space-y-2">
                                <label className="text-base font-medium text-gray-200">Floor Number</label>
                                <div className="flex gap-2">
                                    <input
                                        name="floor_number"
                                        value={(formData as any).floor_number}
                                        onChange={handleChange}
                                        placeholder="e.g. 5"
                                        className="w-1/2 bg-black/50 border border-white/10 rounded-xl p-4 text-white text-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                    />
                                    <input
                                        type="number"
                                        name="total_floors"
                                        value={(formData as any).total_floors}
                                        onChange={handleChange}
                                        placeholder="Total Floors"
                                        className="w-1/2 bg-black/50 border border-white/10 rounded-xl p-4 text-white text-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-base font-medium text-gray-200">Furnished Status</label>
                                <select
                                    name="furnished_status"
                                    value={(formData as any).furnished_status}
                                    onChange={handleChange}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                >                              <option value="Unfurnished">Unfurnished</option>
                                    <option value="Semi-Furnished">Semi-Furnished</option>
                                    <option value="Fully Furnished">Fully Furnished</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-base font-medium text-gray-200">Bathrooms</label>
                                <input
                                    type="number"
                                    name="bathrooms"
                                    value={(formData as any).bathrooms}
                                    onChange={handleChange}
                                    placeholder="e.g. 2"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                />                       </div>
                            <div className="space-y-2">
                                <label className="text-base font-medium text-gray-200">Parking</label>
                                <input
                                    name="parking_count"
                                    value={(formData as any).parking_count}
                                    onChange={handleChange}
                                    placeholder="e.g. 1 Covered"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                />                       </div>
                            <div className="space-y-2">
                                <label className="text-base font-medium text-gray-200">Maintenance Charges</label>
                                <input
                                    name="maintenance_charges"
                                    value={(formData as any).maintenance_charges}
                                    onChange={handleChange}
                                    placeholder="e.g. 2500/month"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                />                       </div>
                        </div>
                    )}

                    {/* Rent Only */}
                    {formData.category === "Rent" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2">
                            <div className="space-y-2">
                                <label className="text-base font-medium text-gray-200">Security Deposit</label>
                                <input
                                    name="security_deposit"
                                    value={(formData as any).security_deposit}
                                    onChange={handleChange}
                                    placeholder="e.g. 50000"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                />                       </div>
                            <div className="space-y-2">
                                <label className="text-base font-medium text-gray-200">Preferred Tenants</label>
                                <select
                                    name="preferred_tenants"
                                    value={(formData as any).preferred_tenants}
                                    onChange={handleChange}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                >
                                    <option value="Any">Any</option>
                                    <option value="Family">Family</option>
                                    <option value="Bachelors">Bachelors</option>
                                    <option value="Couples">Couples</option>
                                    <option value="Company Lease">Company Lease</option>
                                </select>
                            </div>
                        </div>
                    )
                    }

                    {/* Universal Property Specifications */}
                    <div className="border border-amber-500/20 rounded-xl p-6 bg-amber-500/5">
                        <h3 className="text-lg font-medium text-amber-400 mb-6">📋 Property Specifications</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-base font-medium text-gray-200">Lifts/Elevators</label>
                                <input
                                    type="number"
                                    name="lifts_count"
                                    value={(formData as any).lifts_count}
                                    onChange={handleChange}
                                    placeholder="e.g. 2"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-base font-medium text-gray-200">Balconies</label>
                                <input
                                    type="number"
                                    name="balconies_count"
                                    value={(formData as any).balconies_count}
                                    onChange={handleChange}
                                    placeholder="e.g. 2"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-base font-medium text-gray-200">Facing Direction</label>
                                <select
                                    name="facing"
                                    value={(formData as any).facing}
                                    onChange={handleChange}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                                >
                                    <option value="">Select Direction</option>
                                    <option value="North">North</option>
                                    <option value="South">South</option>
                                    <option value="East">East</option>
                                    <option value="West">West</option>
                                    <option value="North-East">North-East</option>
                                    <option value="North-West">North-West</option>
                                    <option value="South-East">South-East</option>
                                    <option value="South-West">South-West</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-base font-medium text-gray-200">Price per Sqft (₹)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="price_per_sqft"
                                    value={(formData as any).price_per_sqft}
                                    onChange={handleChange}
                                    placeholder="e.g. 4500"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Additional Rooms - Multi-select checkboxes */}
                        <div className="space-y-2 mt-6">
                            <label className="text-sm font-medium text-gray-300">Additional Rooms</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {['Study Room', 'Servant Room', 'Pooja Room', 'Store Room', 'Utility Room', 'Home Office', 'Gym Room', 'Entertainment Room'].map((room) => (
                                    <label key={room} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-white transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={(formData as any).additional_rooms?.includes(room)}
                                            onChange={(e) => {
                                                const rooms = (formData as any).additional_rooms || [];
                                                if (e.target.checked) {
                                                    setFormData({ ...formData, additional_rooms: [...rooms, room] } as any);
                                                } else {
                                                    setFormData({ ...formData, additional_rooms: rooms.filter((r: string) => r !== room) } as any);
                                                }
                                            }}
                                            className="w-4 h-4 rounded border-white/20 bg-black/50 text-amber-500 focus:ring-amber-500 focus:ring-offset-0"
                                        />
                                        {room}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Video URL</label>
                    <input
                        name="video_url"
                        value={formData.video_url}
                        onChange={handleChange}
                        placeholder="YouTube or Drive Link"
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                    />
                </div>


                {/* Map URL */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Google Map Embed URL</label>
                    <input
                        name="map_url"
                        value={formData.map_url}
                        onChange={handleChange}
                        placeholder="https://www.google.com/maps/embed?..."
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                    />
                </div>

                {/* Floor Plans */}
                <div className="space-y-4 border border-cyan-500/20 rounded-2xl p-8 bg-cyan-500/5">
                    <div className="flex justify-between items-center border-b border-cyan-500/20 pb-4 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                <span className="text-2xl">📐</span>
                            </div>
                            <h3 className="text-2xl font-bold text-cyan-400">Floor Plans</h3>
                        </div>
                        <button type="button" onClick={addFloorPlan} className="text-sm bg-amber-500/10 text-amber-400 px-3 py-1 rounded hover:bg-amber-500/20 transition-colors">
                            + Add Floor Plan
                        </button>
                    </div>
                    {floorPlans.map((plan, index) => (
                        <div key={index} className="flex gap-4 items-start bg-black/40 p-4 rounded-lg border border-white/5">
                            <div className="flex-1 space-y-2">
                                <input
                                    placeholder="Unit Name (e.g. 3BHK Type A)"
                                    value={plan.name}
                                    onChange={(e) => updateFloorPlan(index, "name", e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                                />                           <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => e.target.files && updateFloorPlan(index, "file", e.target.files[0])}
                                    className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-500/10 file:text-amber-400 hover:file:bg-amber-500/20"
                                />
                            </div>
                            {plan.preview && (
                                <div className="w-16 h-16 rounded overflow-hidden border border-white/10">
                                    <img src={plan.preview} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <button type="button" onClick={() => removeFloorPlan(index)} className="text-gray-500 hover:text-red-400">
                                <X size={20} />
                            </button>
                        </div>
                    ))}
                    {floorPlans.length === 0 && <p className="text-sm text-gray-500 italic">No floor plans added yet.</p>}
                </div>

                {/* Amenities (Tags) */}
                <div className="space-y-4 border border-pink-500/20 rounded-2xl p-8 bg-pink-500/5">
                    <div className="flex items-center gap-3 border-b border-pink-500/20 pb-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                            <span className="text-2xl">✨</span>
                        </div>
                        <h3 className="text-2xl font-bold text-pink-400">Amenities</h3>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {tags.map((tag, index) => (
                            <span key={index} className="bg-pink-500/10 border border-pink-500/20 text-pink-400 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                {tag}
                                <button type="button" onClick={() => removeTag(tag)} className="hover:text-pink-200"><X size={12} /></button>
                            </span>
                        ))}
                    </div>
                    <input
                        value={amenityInput}
                        onChange={(e) => setAmenityInput(e.target.value)}
                        onKeyDown={handleAmenityKeyDown}
                        placeholder="Type amenity and press Enter or Comma (e.g. Pool, Gym)"
                        className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Image Uploads - REDESIGNED */}
            <div className="space-y-8 border border-green-500/20 rounded-2xl p-8 bg-green-500/5">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-medium text-green-400">📸 Property Images</h3>
                    <span className="text-sm text-white/50">Cover + up to 20 gallery images</span>
                </div>

                {/* Cover Image - Large Preview */}
                <div className="space-y-3">
                    <label className="text-lg font-medium text-gray-200 flex items-center gap-2">
                        Cover Image <span className="text-red-500">*</span>
                        <span className="text-xs text-white/40 font-normal">(Main display photo)</span>
                    </label>

                    {coverImage ? (
                        <div className="relative group">
                            <div className="aspect-video w-full max-w-md rounded-2xl overflow-hidden border-2 border-green-500/50">
                                <img
                                    src={URL.createObjectURL(coverImage)}
                                    alt="Cover preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute top-3 right-3 flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setCoverImage(null)}
                                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="mt-2 flex items-center gap-2 text-sm text-green-400">
                                <CheckCircle size={16} />
                                <span>{coverImage.name}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-white/20 rounded-2xl p-12 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-center cursor-pointer relative group max-w-md">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleCoverImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <Upload className="w-16 h-16 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                <div className="space-y-1">
                                    <p className="text-lg font-medium text-white">Click to upload cover image</p>
                                    <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Gallery Images - Grid with counter */}
                <div className="space-y-3">
                    <label className="text-lg font-medium text-gray-200 flex items-center gap-2">
                        Gallery Images
                        <span className="text-sm text-blue-400 font-normal">
                            ({galleryImages.length} / 20 images)
                        </span>
                    </label>

                    {/* Image Grid - Larger thumbnails */}
                    {galleryImages.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {galleryImages.map((file, index) => (
                                <div key={index} className="relative aspect-square rounded-xl overflow-hidden group border-2 border-white/10 hover:border-blue-500/50 transition-all">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newImages = [...galleryImages];
                                            newImages.splice(index, 1);
                                            setGalleryImages(newImages);
                                        }}
                                        className="absolute top-2 right-2 p-2 bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                    >
                                        <X size={16} />
                                    </button>
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs py-1 px-2 text-center">
                                        Image {index + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Upload Button */}
                    <div className="border-2 border-dashed border-white/20 rounded-2xl p-10 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-center cursor-pointer relative group">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                                if (e.target.files) {
                                    const newFiles = Array.from(e.target.files);
                                    const currentCount = galleryImages.length;
                                    const remaining = 20 - currentCount;
                                    const filesToAdd = newFiles.slice(0, remaining);
                                    setGalleryImages((prev) => [...prev, ...filesToAdd]);
                                    if (newFiles.length > remaining) {
                                        alert(`Only ${remaining} images can be added. Maximum is 20 images.`);
                                    }
                                }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center justify-center space-y-3">
                            <ImageIcon className="w-12 h-12 text-gray-400 group-hover:text-blue-500 transition-colors" />
                            <div className="space-y-1">
                                <p className="text-base font-medium text-white">
                                    {galleryImages.length === 0
                                        ? "Click to add gallery images"
                                        : "Add more images"}
                                </p>
                                <p className="text-sm text-gray-400">Select multiple images at once</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description & AI Insight */}
            <div className="space-y-4 border border-purple-500/20 rounded-2xl p-8 bg-purple-500/5">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                            <span className="text-2xl">🤖</span>
                        </div>
                        <h3 className="text-2xl font-bold text-purple-400">AI Assistance</h3>
                    </div>
                    <button
                        type="button"
                        onClick={async () => {
                            const { title, builder_id, location, category } = formData;

                            if (!title || !location) {
                                alert("Please fill in Title and Location first!");
                                return;
                            }

                            // Create a temporary loading state for the button
                            const btn = document.getElementById('ai-generate-btn');
                            if (btn) {
                                btn.innerText = "Generating...";
                                btn.setAttribute('disabled', 'true');
                            }

                            try {
                                const builderName = builders.find(b => b.id === Number(builder_id))?.name || "a reputed builder";
                                const amenitiesList = tags.join(", ");
                                const price = `${priceValue} ${priceUnit}`;

                                const input = `Project: ${title}\nBuilder: ${builderName}\nLocation: ${location}\nType: ${category}\nAmenities: ${amenitiesList}\nPrice: ${price}`;

                                const { runAI } = await import("@/app/actions/ai-service");
                                // Use the new 'listing_description' task we just added
                                const result = await runAI("listing_description", input);

                                if (typeof result === 'string') {
                                    setFormData(prev => ({
                                        ...prev,
                                        description: result
                                    }));
                                } else if (result && result.error) {
                                    alert(`AI Error: ${result.error}`);
                                }
                            } catch (e) {
                                console.error("AI Generation Error:", e);
                                alert("An error occurred while generating content.");
                            } finally {
                                if (btn) {
                                    btn.innerText = "✨ Generate Description with AI";
                                    btn.removeAttribute('disabled');
                                }
                            }
                        }}
                        id="ai-generate-btn"
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors font-medium shadow-lg shadow-purple-500/20"
                    >
                        ✨ Generate Description with AI
                    </button>
                </div>

                <div className="space-y-3">
                    <label className="text-base font-medium text-gray-200">Description</label>
                    <textarea
                        rows={6}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Project description..."
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all resize-none"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase tracking-wider">AI Local Insight (Neighborhood Analysis)</label>
                    <textarea
                        name="ai_local_insight"
                        value={formData.ai_local_insight}
                        onChange={handleChange}
                        rows={3}
                        placeholder="AI-generated neighborhood analysis..."
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all resize-none"
                    />
                </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className={clsx(
                        "w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2",
                        loading
                            ? "bg-neutral-800 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-[1.02]"
                    )}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        "Publish Project"
                    )}
                </button>
            </div>
        </form>
    );
}
