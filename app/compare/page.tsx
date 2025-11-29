"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, X, MapPin, ArrowLeft, Phone, Plus, RefreshCw, Calendar, Ruler } from "lucide-react";
import { useUser } from "@/components/UserProvider";
import { useState, useEffect } from "react";
import ProjectSelectorModal from "@/components/ProjectSelectorModal";
import LeadFormModal from "@/components/LeadFormModal";
import clsx from "clsx";
import { supabase } from "@/lib/supabaseClient";

export default function ComparePage() {
    const { compareList, toggleCompare } = useUser();
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
    const [selectedForLead, setSelectedForLead] = useState("");
    const [swapTargetId, setSwapTargetId] = useState<number | string | null>(null);
    const [fetchedProjects, setFetchedProjects] = useState<any[]>([]);

    // Fetch dynamic projects from Supabase
    useEffect(() => {
        const fetchProjects = async () => {
            if (compareList.length === 0) {
                setFetchedProjects([]);
                return;
            }

            const { data } = await supabase
                .from('projects')
                .select('*')
                .in('id', compareList);

            if (data) {
                const mapped = data.map((p: any) => ({
                    id: p.id,
                    name: p.name || p.title,
                    location: p.location,
                    price: p.price || p.price_text || "Price on Request",
                    image: p.image || p.cover_image_url || "https://images.unsplash.com/photo-1600596542815-27bfefd0c3c6?q=80&w=1000",
                    status: p.status || "Ongoing",
                    type: p.type || "Project",
                    amenities: p.amenities?.map((a: string) => ({ name: a })) || [],
                    area: p.configuration || p.size || "-",
                    handover: p.possession_date || "Upcoming"
                }));
                setFetchedProjects(mapped);
            }
        };

        fetchProjects();
    }, [compareList]);

    const selectedProjects = fetchedProjects;

    // Helper to parse price string to number for comparison
    const parsePrice = (priceStr: string) => {
        if (!priceStr) return 0;
        const match = priceStr.match(/(\d+)/);
        return match ? parseInt(match[0]) : 0;
    };

    const lowestPrice = selectedProjects.length > 0 ? Math.min(...selectedProjects.map(p => parsePrice(p.price))) : 0;

    const handleAddProject = (projectId: number | string) => {
        if (swapTargetId) {
            toggleCompare(swapTargetId); // Remove old
            toggleCompare(projectId);    // Add new
            setSwapTargetId(null);
        } else {
            toggleCompare(projectId);
        }
        setIsSelectorOpen(false);
    };

    const openSwapModal = (id: number | string) => {
        setSwapTargetId(id);
        setIsSelectorOpen(true);
    };

    const openLeadForm = (name: string) => {
        setSelectedForLead(name);
        setIsLeadFormOpen(true);
    };

    // Common amenities to check against
    const commonAmenities = ["Pool", "Gym", "Garden", "Play Area", "Clubhouse", "Security"];

    const hasAmenity = (project: any, amenityName: string) => {
        if (!project.amenities) return false;
        return project.amenities.some((a: any) => a.name.toLowerCase().includes(amenityName.toLowerCase()));
    };

    if (selectedProjects.length === 0) {
        return (
            <main className="min-h-screen bg-dark-bg text-white pt-32 pb-20 px-4">
                <div className="container mx-auto text-center">
                    <h1 className="text-3xl font-serif font-bold text-gold mb-4">
                        No Projects Selected
                    </h1>
                    <p className="text-white/60 mb-8">
                        Please select projects to compare from the collections page.
                    </p>
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-gold hover:text-dark-bg px-6 py-3 rounded-full transition-all"
                    >
                        <ArrowLeft size={20} />
                        Browse Collections
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-dark-bg text-white pt-32 pb-20 px-4">
            <div className="container mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-gold">
                        Compare Projects
                    </h1>
                    <Link
                        href="/projects"
                        className="text-white/60 hover:text-white flex items-center gap-2 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Collections
                    </Link>
                </div>

                <div className="overflow-x-auto pb-8 custom-scrollbar">
                    <table className="w-full min-w-[1000px] border-collapse">
                        <thead>
                            <tr>
                                <th className="p-4 text-left w-[200px] sticky left-0 bg-dark-bg z-10 border-b border-white/10">
                                    <span className="text-white/40 uppercase text-xs tracking-widest">
                                        Features
                                    </span>
                                </th>
                                {selectedProjects.map((project) => (
                                    <th
                                        key={project.id}
                                        className="p-4 w-[300px] border-b border-white/10 align-top group"
                                    >
                                        <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 border border-white/10">
                                            <Image
                                                src={project.image}
                                                alt={project.name}
                                                fill
                                                className="object-cover"
                                            />
                                            <button
                                                onClick={() => toggleCompare(project.id)}
                                                className="absolute top-2 right-2 p-1.5 bg-black/50 backdrop-blur-md rounded-full text-white/70 hover:bg-red-500/80 hover:text-white transition-colors"
                                                title="Remove"
                                            >
                                                <X size={16} />
                                            </button>
                                            <button
                                                onClick={() => openSwapModal(project.id)}
                                                className="absolute top-2 left-2 p-1.5 bg-black/50 backdrop-blur-md rounded-full text-white/70 hover:bg-gold hover:text-dark-bg transition-colors opacity-0 group-hover:opacity-100"
                                                title="Change Project"
                                            >
                                                <RefreshCw size={16} />
                                            </button>
                                        </div>
                                        <h3 className="text-xl font-serif font-bold text-white mb-1">
                                            {project.name}
                                        </h3>
                                        <p className="text-sm text-white/60 flex items-center gap-1 mb-2">
                                            <MapPin size={14} className="text-gold" />
                                            {project.location}
                                        </p>
                                        <button
                                            onClick={() => openSwapModal(project.id)}
                                            className="text-xs text-gold hover:underline flex items-center gap-1"
                                        >
                                            <RefreshCw size={12} /> Change Project
                                        </button>
                                    </th>
                                ))}
                                {/* Smart Add Slots */}
                                {Array.from({ length: 3 - selectedProjects.length }).map((_, i) => (
                                    <th key={`empty-${i}`} className="p-4 w-[300px] border-b border-white/10 align-middle">
                                        <button
                                            onClick={() => {
                                                setSwapTargetId(null);
                                                setIsSelectorOpen(true);
                                            }}
                                            className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-white/10 hover:border-gold/50 flex flex-col items-center justify-center gap-2 text-white/30 hover:text-gold transition-all group"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-white/5 group-hover:bg-gold/10 flex items-center justify-center transition-colors">
                                                <Plus size={24} />
                                            </div>
                                            <span className="font-bold">Add Project</span>
                                        </button>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {/* Price */}
                            <tr>
                                <td className="p-4 sticky left-0 bg-dark-bg z-10 font-bold text-white/80">
                                    Price
                                </td>
                                {selectedProjects.map((project) => {
                                    const isLowest = parsePrice(project.price) === lowestPrice;
                                    return (
                                        <td key={project.id} className={clsx("p-4 font-bold text-xl", isLowest ? "text-gold" : "text-white")}>
                                            {project.price}
                                            {isLowest && <span className="block text-[10px] font-normal text-gold/70 uppercase tracking-wider">Best Price</span>}
                                        </td>
                                    );
                                })}
                                {Array.from({ length: 3 - selectedProjects.length }).map((_, i) => <td key={i} className="p-4"></td>)}
                            </tr>

                            {/* Status */}
                            <tr>
                                <td className="p-4 sticky left-0 bg-dark-bg z-10 font-bold text-white/80">
                                    Status
                                </td>
                                {selectedProjects.map((project) => (
                                    <td key={project.id} className="p-4">
                                        <span className={clsx(
                                            "inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
                                            project.status.includes("Ready")
                                                ? "bg-green-500/10 border-green-500/30 text-green-400"
                                                : "bg-blue-500/10 border-blue-500/30 text-blue-400"
                                        )}>
                                            {project.status}
                                        </span>
                                    </td>
                                ))}
                                {Array.from({ length: 3 - selectedProjects.length }).map((_, i) => <td key={i} className="p-4"></td>)}
                            </tr>

                            {/* Area */}
                            <tr>
                                <td className="p-4 sticky left-0 bg-dark-bg z-10 font-bold text-white/80 flex items-center gap-2">
                                    <Ruler size={16} className="text-gold" /> Total Area
                                </td>
                                {selectedProjects.map((project) => (
                                    <td key={project.id} className="p-4 text-white/70">
                                        {(project as any).area || (project as any).size || (project as any).carpetArea || "-"}
                                    </td>
                                ))}
                                {Array.from({ length: 3 - selectedProjects.length }).map((_, i) => <td key={i} className="p-4"></td>)}
                            </tr>

                            {/* Handover */}
                            <tr>
                                <td className="p-4 sticky left-0 bg-dark-bg z-10 font-bold text-white/80 flex items-center gap-2">
                                    <Calendar size={16} className="text-gold" /> Possession
                                </td>
                                {selectedProjects.map((project) => (
                                    <td key={project.id} className="p-4 text-white/70">
                                        {(project as any).handover || "Immediate"}
                                    </td>
                                ))}
                                {Array.from({ length: 3 - selectedProjects.length }).map((_, i) => <td key={i} className="p-4"></td>)}
                            </tr>

                            {/* Amenities Check */}
                            {commonAmenities.map((amenity) => (
                                <tr key={amenity}>
                                    <td className="p-4 sticky left-0 bg-dark-bg z-10 font-medium text-white/60">
                                        {amenity}
                                    </td>
                                    {selectedProjects.map((project) => {
                                        const available = hasAmenity(project, amenity);
                                        return (
                                            <td key={project.id} className="p-4">
                                                {available ? (
                                                    <div className="flex items-center gap-2 text-green-400">
                                                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                                                            <Check size={14} />
                                                        </div>
                                                        <span className="text-sm">Included</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-red-400/50">
                                                        <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center">
                                                            <X size={14} />
                                                        </div>
                                                        <span className="text-sm">Not Available</span>
                                                    </div>
                                                )}
                                            </td>
                                        );
                                    })}
                                    {Array.from({ length: 3 - selectedProjects.length }).map((_, i) => <td key={i} className="p-4"></td>)}
                                </tr>
                            ))}

                            {/* Action Button */}
                            <tr>
                                <td className="p-4 sticky left-0 bg-dark-bg z-10"></td>
                                {selectedProjects.map((project) => (
                                    <td key={project.id} className="p-4">
                                        <button
                                            onClick={() => openLeadForm(project.name)}
                                            className="w-full bg-gold text-dark-bg font-bold py-3 rounded-lg hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gold/10"
                                        >
                                            <Phone size={18} />
                                            Get Best Offer
                                        </button>
                                    </td>
                                ))}
                                {Array.from({ length: 3 - selectedProjects.length }).map((_, i) => <td key={i} className="p-4"></td>)}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <ProjectSelectorModal
                isOpen={isSelectorOpen}
                onClose={() => setIsSelectorOpen(false)}
                onSelect={handleAddProject}
                excludeIds={selectedProjects.map(p => p.id)}
            />

            <LeadFormModal
                isOpen={isLeadFormOpen}
                onClose={() => setIsLeadFormOpen(false)}
                projectName={selectedForLead}
            />
        </main>
    );
}
