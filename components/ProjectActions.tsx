"use client";

import { Heart, CheckSquare, Square } from "lucide-react";
import clsx from "clsx";
import { useUser } from "@/components/UserProvider";

export default function ProjectActions({ project }: { project: any }) {
    const { favorites, toggleFavorite, compareList, toggleCompare } = useUser();
    const isUpcoming = project.status === "New Launch";

    return (
        <div className="flex items-center gap-4">
            {/* Compare Button */}
            {!isUpcoming && (
                <button
                    onClick={() => toggleCompare(project.id)}
                    className="hidden md:flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all"
                >
                    {compareList.includes(project.id) ? (
                        <>
                            <CheckSquare size={20} className="text-gold" />
                            <span className="text-gold font-bold">Added to Compare</span>
                        </>
                    ) : (
                        <>
                            <Square size={20} />
                            <span>Compare</span>
                        </>
                    )}
                </button>
            )}

            {/* Favorite Button */}
            <button
                onClick={() => toggleFavorite(project.id, project.type)}
                className="p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all group"
            >
                <Heart
                    size={28}
                    className={clsx("transition-colors", favorites.some(f => f.id === project.id.toString()) ? "fill-red-500 text-red-500" : "text-white group-hover:text-red-400")}
                />
            </button>
        </div>
    );
}
