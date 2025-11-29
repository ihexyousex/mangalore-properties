import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, ChevronLeft, CheckSquare } from "lucide-react";
import { BLUR_DATA_URL } from "@/lib/constants";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectActions from "@/components/ProjectActions";
import FloorPlanSection from "@/components/FloorPlanSection";
import AmenitiesSection from "@/components/AmenitiesSection";
import ProjectInquiryForm from "@/components/ProjectInquiryForm";
import { getDistancesFromLandmarks } from "@/lib/ors";
import DistanceDisplay from "@/components/DistanceDisplay";
import EmiCalculator from "@/components/EmiCalculator";

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch Project from Supabase
    console.log('[ProjectDetailsPage] Fetching project ID:', id);
    const { data: project, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

    console.log('[ProjectDetailsPage] Query result - Error:', error);
    console.log('[ProjectDetailsPage] Query result - Data:', project ? 'Found' : 'Not found');

    if (error || !project) {
        console.error('[ProjectDetailsPage] Returning notFound() - Error:', error?.message || 'No error, but project is null');
        notFound();
    }

    const isUpcoming = project.status === "New Launch";

    // Fetch Similar Projects (same type)
    const { data: similarProjects } = await supabase
        .from("projects")
        .select("*")
        .eq("type", project.type)
        .neq("id", id)
        .limit(3);

    // Fetch More by Builder (using builder name text column for now)
    const { data: moreProjectsByBuilder } = await supabase
        .from("projects")
        .select("*")
        .eq("builder", project.builder) // Assuming builder is stored as ID or Name, strictly matching
        .neq("id", id)
        .limit(3);

    // Calculate Distances if coordinates are available
    let distances: { name: string; distance: number; duration: number }[] = [];
    if (project.latitude && project.longitude) {
        try {
            distances = await getDistancesFromLandmarks(project.latitude, project.longitude);
        } catch (err) {
            console.error("Error fetching distances:", err);
        }
    }

    // Helper to parse price
    const parsePrice = (priceStr: string) => {
        if (!priceStr) return 0;
        const cleanStr = priceStr.replace(/[^0-9.]/g, "");
        const val = parseFloat(cleanStr);
        if (priceStr.includes("Cr")) return val * 10000000;
        if (priceStr.includes("Lakhs")) return val * 100000;
        return val;
    };

    const numericPrice = parsePrice(project.price);

    // JSON-LD Structured Data
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        "name": project.name,
        "description": project.description,
        "image": project.cover_image_url ? [project.cover_image_url] : [],
        "url": `${process.env.NEXT_PUBLIC_SITE_URL}/projects/${project.id}`,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": project.location,
            "addressRegion": "Karnataka",
            "addressCountry": "IN"
        },
        "geo": project.latitude && project.longitude ? {
            "@type": "GeoCoordinates",
            "latitude": project.latitude,
            "longitude": project.longitude
        } : undefined,
        "offers": {
            "@type": "Offer",
            "price": numericPrice,
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock"
        }
    };

    return (
        <main className="min-h-screen bg-dark-bg text-white pb-24 md:pb-0">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Floating Back Button */}
            <Link
                href="/projects"
                className="fixed top-24 left-4 z-40 p-3 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-gold hover:text-dark-bg transition-all shadow-lg group"
            >
                <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </Link>

            {/* Hero Section */}
            <section className="relative h-[60vh] w-full">
                <Image
                    src={project.cover_image_url || BLUR_DATA_URL}
                    alt={project.name}
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
                    <div className="container mx-auto flex justify-between items-end">
                        <div>
                            <div className="inline-block px-3 py-1 rounded-full bg-gold text-dark-bg text-xs font-bold uppercase tracking-wider mb-4">
                                {project.status}
                            </div>
                            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-2">{project.name}</h1>
                            <div className="flex items-center gap-2 text-white/80 text-lg">
                                <MapPin size={20} className="text-gold" />
                                <span>{project.location}</span>
                            </div>
                        </div>

                        <ProjectActions project={project} />
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">

                    {/* New: Detailed Property Highlights Grid */}
                    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {project.total_units && (
                            <div className="glass-panel p-4 rounded-xl text-center">
                                <p className="text-xs text-white/50 uppercase">Total Units</p>
                                <p className="text-xl font-bold text-gold">{project.total_units}</p>
                            </div>
                        )}
                        {project.project_size && (
                            <div className="glass-panel p-4 rounded-xl text-center">
                                <p className="text-xs text-white/50 uppercase">Project Size</p>
                                <p className="text-xl font-bold text-white">{project.project_size}</p>
                            </div>
                        )}
                        {project.launch_date && (
                            <div className="glass-panel p-4 rounded-xl text-center">
                                <p className="text-xs text-white/50 uppercase">Launch Date</p>
                                <p className="text-xl font-bold text-white">{new Date(project.launch_date).getFullYear()}</p>
                            </div>
                        )}
                        {project.possession_date && (
                            <div className="glass-panel p-4 rounded-xl text-center">
                                <p className="text-xs text-white/50 uppercase">Possession</p>
                                <p className="text-xl font-bold text-gold">{new Date(project.possession_date).getFullYear()}</p>
                            </div>
                        )}
                        {project.carpet_area && (
                            <div className="glass-panel p-4 rounded-xl text-center">
                                <p className="text-xs text-white/50 uppercase">Carpet Area</p>
                                <p className="text-xl font-bold text-white">{project.carpet_area} <span className="text-xs">sqft</span></p>
                            </div>
                        )}
                        {project.floor_number && (
                            <div className="glass-panel p-4 rounded-xl text-center">
                                <p className="text-xs text-white/50 uppercase">Floor</p>
                                <p className="text-xl font-bold text-white">{project.floor_number} {project.total_floors && <span className="text-sm text-white/50">/ {project.total_floors}</span>}</p>
                            </div>
                        )}
                        {project.bathrooms && (
                            <div className="glass-panel p-4 rounded-xl text-center">
                                <p className="text-xs text-white/50 uppercase">Bathrooms</p>
                                <p className="text-xl font-bold text-white">{project.bathrooms}</p>
                            </div>
                        )}
                        {project.balconies_count && (
                            <div className="glass-panel p-4 rounded-xl text-center">
                                <p className="text-xs text-white/50 uppercase">Balconies</p>
                                <p className="text-xl font-bold text-gold">{project.balconies_count}</p>
                            </div>
                        )}
                        {project.lifts_count && (
                            <div className="glass-panel p-4 rounded-xl text-center">
                                <p className="text-xs text-white/50 uppercase">Lifts</p>
                                <p className="text-xl font-bold text-white">{project.lifts_count}</p>
                            </div>
                        )}
                        {project.facing && (
                            <div className="glass-panel p-4 rounded-xl text-center">
                                <p className="text-xs text-white/50 uppercase">Facing</p>
                                <p className="text-xl font-bold text-white">{project.facing}</p>
                            </div>
                        )}
                        {project.price_per_sqft && (
                            <div className="glass-panel p-4 rounded-xl text-center">
                                <p className="text-xs text-white/50 uppercase">Price/Sqft</p>
                                <p className="text-xl font-bold text-gold">₹{project.price_per_sqft}</p>
                            </div>
                        )}
                    </section>

                    {/* RERA & Legal */}
                    {project.rera_id && (
                        <div className="flex items-center gap-2 bg-green-900/20 border border-green-500/30 p-3 rounded-lg text-green-400 text-sm w-fit">
                            <CheckSquare size={16} />
                            <span>RERA Approved: <strong>{project.rera_id}</strong></span>
                        </div>
                    )}

                    {/* Description */}
                    <section>
                        <h2 className="text-2xl font-serif font-bold text-gold mb-4">About the Project</h2>
                        <p className="text-white/70 leading-relaxed text-lg whitespace-pre-line">
                            {project.description}
                        </p>
                    </section>

                    {/* Additional Rooms */}
                    {project.additional_rooms && Array.isArray(project.additional_rooms) && project.additional_rooms.length > 0 && (
                        <section className="glass-panel p-6 rounded-2xl border border-white/10">
                            <h3 className="text-xl font-serif font-bold text-white mb-4">Additional Features</h3>
                            <div className="flex flex-wrap gap-3">
                                {project.additional_rooms.map((room: string, index: number) => (
                                    <span key={index} className="bg-gold/10 border border-gold/20 text-gold px-4 py-2 rounded-full text-sm font-medium">
                                        {room}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Rent / Resale Specifics */}
                    {(project.type === "Rent" || project.type === "Resale") && (
                        <section className="glass-panel p-6 rounded-2xl border border-white/10">
                            <h3 className="text-xl font-serif font-bold text-white mb-6">Property Specifications</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {project.furnished_status && (
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-white/60">Furnishing</span>
                                        <span className="font-medium text-white">{project.furnished_status}</span>
                                    </div>
                                )}
                                {project.bathrooms && (
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-white/60">Bathrooms</span>
                                        <span className="font-medium text-white">{project.bathrooms}</span>
                                    </div>
                                )}
                                {project.parking_count && (
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-white/60">Parking</span>
                                        <span className="font-medium text-white">{project.parking_count}</span>
                                    </div>
                                )}
                                {project.maintenance_charges && (
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-white/60">Maintenance</span>
                                        <span className="font-medium text-white">₹{project.maintenance_charges}</span>
                                    </div>
                                )}
                                {project.security_deposit && (
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-white/60">Security Deposit</span>
                                        <span className="font-medium text-gold">₹{project.security_deposit}</span>
                                    </div>
                                )}
                                {project.preferred_tenants && (
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-white/60">Preferred Tenants</span>
                                        <span className="font-medium text-white">{project.preferred_tenants}</span>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Amenities with Icons */}
                    <AmenitiesSection amenities={project.amenities} />

                    {/* Floor Plans (Images) */}
                    <FloorPlanSection project={project} isUpcoming={isUpcoming} />

                    {/* Location Map & Connectivity */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-serif font-bold text-gold">Location</h2>
                        <div className="w-full h-[480px] rounded-2xl border-4 border-yellow-600/30 shadow-2xl backdrop-blur-sm overflow-hidden relative">
                            <iframe
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                style={{ border: 0 }}
                                src={project.map_url || `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(project.location)}`}
                                allowFullScreen
                                loading="lazy"
                                className="filter grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                            ></iframe>
                            <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded-lg border border-gold/30">
                                <p className="text-gold font-bold text-sm flex items-center gap-2">
                                    <MapPin size={16} />
                                    {project.location}
                                </p>
                            </div>
                        </div>

                        {/* Distance Display */}
                        <DistanceDisplay distances={distances} />
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-8 sticky top-24 h-fit">
                    <div className="glass-panel p-6 rounded-2xl">
                        <p className="text-white/50 text-sm uppercase tracking-wider mb-1">Price</p>
                        <p className="text-3xl md:text-4xl font-serif font-bold text-gold mb-6">{project.price}</p>

                        <h3 className="text-xl font-serif font-bold text-white mb-4">Interested?</h3>
                        <ProjectInquiryForm project={project} />
                    </div>

                    <EmiCalculator price={numericPrice} projectName={project.name} />
                </div>
            </div>
        </main>
    );
}
