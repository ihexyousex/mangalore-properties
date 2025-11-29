"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, X } from "lucide-react";
import clsx from "clsx";
import { useDebounce } from "@/hooks/useDebounce"; // We might need to create this hook or implement inline

export default function AdvancedFilter({
    showStatus = true,
    showType = true,
    className = ""
}: {
    showStatus?: boolean;
    showType?: boolean;
    className?: string;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Local state for inputs
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
    const [bhk, setBhk] = useState<string[]>(searchParams.get("bhk")?.split(",") || []);
    const [type, setType] = useState(searchParams.get("type") || "");
    const [status, setStatus] = useState(searchParams.get("status") || "");
    const [isExpanded, setIsExpanded] = useState(false);

    // Debounce search and price updates
    // Simple inline debounce implementation for now to avoid creating extra files if not needed
    useEffect(() => {
        const timer = setTimeout(() => {
            updateFilters();
        }, 500);
        return () => clearTimeout(timer);
    }, [search, minPrice, maxPrice]);

    // Update filters immediately for other controls
    useEffect(() => {
        updateFilters();
    }, [bhk, type, status]);

    const updateFilters = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());

        if (search) params.set("search", search);
        else params.delete("search");

        if (minPrice) params.set("minPrice", minPrice);
        else params.delete("minPrice");

        if (maxPrice) params.set("maxPrice", maxPrice);
        else params.delete("maxPrice");

        if (bhk.length > 0) params.set("bhk", bhk.join(","));
        else params.delete("bhk");

        if (type) params.set("type", type);
        else params.delete("type");

        if (status) params.set("status", status);
        else params.delete("status");

        // Prevent pushing if params haven't changed (to avoid duplicate history entries)
        if (params.toString() !== searchParams.toString()) {
            router.push(`?${params.toString()}`, { scroll: false });
        }
    }, [search, minPrice, maxPrice, bhk, type, status, router, searchParams]);

    const toggleBhk = (value: string) => {
        setBhk(prev =>
            prev.includes(value)
                ? prev.filter(b => b !== value)
                : [...prev, value]
        );
    };

    const clearFilters = () => {
        setSearch("");
        setMinPrice("");
        setMaxPrice("");
        setBhk([]);
        setType("");
        setStatus("");
        router.push("?", { scroll: false });
    };

    return (
        <div className={clsx("w-full space-y-4", className)}>
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={20} />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, location, or keywords (e.g. '2 BHK in Kadri')"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:border-gold/50 focus:outline-none transition-colors"
                />
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={clsx(
                        "absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium",
                        isExpanded ? "bg-gold text-dark-bg" : "bg-white/10 text-white hover:bg-white/20"
                    )}
                >
                    <Filter size={16} />
                    Filters
                </button>
            </div>

            {/* Expanded Filters */}
            {isExpanded && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Price Range */}
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-white/50 font-bold">Price Range</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    placeholder="Min"
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-gold/50 focus:outline-none"
                                />
                                <input
                                    type="number"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    placeholder="Max"
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-gold/50 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* BHK Selector */}
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-white/50 font-bold">Bedrooms</label>
                            <div className="flex flex-wrap gap-2">
                                {["1", "2", "3", "4+"].map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => toggleBhk(val)}
                                        className={clsx(
                                            "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                                            bhk.includes(val)
                                                ? "bg-gold border-gold text-dark-bg"
                                                : "bg-transparent border-white/20 text-white/70 hover:border-white/40"
                                        )}
                                    >
                                        {val} BHK
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Type Selector */}
                        {showType && (
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-white/50 font-bold">Property Type</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-gold/50 focus:outline-none [&>option]:bg-dark-bg"
                                >
                                    <option value="">All Types</option>
                                    <option value="Apartment">Apartment</option>
                                    <option value="Villa">Villa</option>
                                    <option value="Land">Land</option>
                                    <option value="Commercial">Commercial</option>
                                </select>
                            </div>
                        )}

                        {/* Status Selector */}
                        {showStatus && (
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-white/50 font-bold">Status</label>
                                <div className="flex bg-black/20 rounded-lg p-1 border border-white/10">
                                    <button
                                        onClick={() => setStatus("")}
                                        className={clsx(
                                            "flex-1 py-1.5 rounded text-xs font-medium transition-all",
                                            status === "" ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
                                        )}
                                    >
                                        All
                                    </button>
                                    <button
                                        onClick={() => setStatus("Ready to Move")}
                                        className={clsx(
                                            "flex-1 py-1.5 rounded text-xs font-medium transition-all",
                                            status === "Ready to Move" ? "bg-green-500/20 text-green-400" : "text-white/50 hover:text-white"
                                        )}
                                    >
                                        Ready
                                    </button>
                                    <button
                                        onClick={() => setStatus("Under Construction")}
                                        className={clsx(
                                            "flex-1 py-1.5 rounded text-xs font-medium transition-all",
                                            status === "Under Construction" ? "bg-amber-500/20 text-amber-400" : "text-white/50 hover:text-white"
                                        )}
                                    >
                                        Ongoing
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Active Filters & Clear */}
                    <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                        <div className="text-xs text-white/40">
                            {(search || minPrice || maxPrice || bhk.length > 0 || type || status) && "Filters active"}
                        </div>
                        <button
                            onClick={clearFilters}
                            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                        >
                            <X size={12} /> Clear All
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
