"use client";

import { useState } from "react";
import Image from "next/image";
import { Lock } from "lucide-react";
import LeadTrapModal from "@/components/LeadTrapModal";

export default function FloorPlanSection({ project, isUpcoming }: { project: any, isUpcoming: boolean }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);

    const handleUnlock = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setIsUnlocked(true);
    };

    return (
        <section className="relative overflow-hidden rounded-2xl glass-panel p-8 border border-white/5">
            <h2 className="text-2xl font-serif font-bold text-gold mb-6">
                Floor Plans & Pricing
            </h2>

            {isUpcoming && !isUnlocked ? (
                <div className="relative">
                    {/* Blurred Content */}
                    <div className="filter blur-md select-none pointer-events-none opacity-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="aspect-square bg-white/10 rounded-xl"></div>
                            <div className="space-y-4">
                                <div className="h-8 bg-white/10 rounded w-3/4"></div>
                                <div className="h-8 bg-white/10 rounded w-1/2"></div>
                                <div className="h-32 bg-white/10 rounded w-full"></div>
                            </div>
                        </div>
                    </div>

                    {/* Lock Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                        <div className="bg-dark-bg/80 backdrop-blur-xl p-8 rounded-2xl border border-gold/30 text-center max-w-sm mx-auto shadow-2xl">
                            <Lock size={48} className="text-gold mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">Restricted Access</h3>
                            <p className="text-white/60 mb-6">
                                Unlock exclusive floor plans and pricing details for {project.name}.
                            </p>
                            <button
                                onClick={handleUnlock}
                                className="bg-gold text-dark-bg font-bold py-3 px-8 rounded-full hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
                            >
                                Unlock Pricing & Floor Plans
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 bg-white/5 rounded-xl border border-gold/10">
                        <div>
                            <p className="text-white/50 text-sm uppercase tracking-wider mb-1">Starting Price</p>
                            <p className="text-3xl md:text-4xl font-serif font-bold text-gold">{project.price}</p>
                        </div>
                        <button className="bg-white text-dark-bg font-bold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors">
                            Download Brochure
                        </button>
                    </div>

                    {/* Floor Plans (Images) */}
                    {project.floor_plans && Array.isArray(project.floor_plans) && project.floor_plans.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {project.floor_plans.map((plan: any, index: number) => (
                                <div key={index} className="space-y-2">
                                    <div className="aspect-[4/3] bg-white/5 rounded-xl border border-white/10 relative overflow-hidden group">
                                        {plan.image ? (
                                            <Image
                                                src={plan.image}
                                                alt={plan.name}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                                className="object-cover group-hover:scale-105 transition-transform"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-white/30">No Image</div>
                                        )}
                                    </div>
                                    <p className="text-center text-white/70 font-medium">{plan.name}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Placeholder Floor Plans if none exist */}
                            <div className="aspect-[4/3] bg-white/5 rounded-xl border border-white/10 flex items-center justify-center relative group overflow-hidden cursor-pointer">
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                                <span className="relative z-10 font-medium text-white/70 group-hover:text-white">2 BHK Layout</span>
                            </div>
                            <div className="aspect-[4/3] bg-white/5 rounded-xl border border-white/10 flex items-center justify-center relative group overflow-hidden cursor-pointer">
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                                <span className="relative z-10 font-medium text-white/70 group-hover:text-white">3 BHK Layout</span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <LeadTrapModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                title={`Unlock ${project.name} Details`}
            />
        </section>
    );
}
