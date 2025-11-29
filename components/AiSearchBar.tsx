"use client";

import { useState } from "react";
import { Sparkles, Search, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";


export default function AiSearchBar() {
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleAiSearch = async () => {
        if (!query.trim()) {
            setError("Please enter a search query");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const { runAI } = await import('@/app/actions/ai-service');
            const result = await runAI("property_search", query);
            console.log("AI Search Result:", result);

            // runAI with isJson=true already returns parsed JSON
            let filters = result;

            // Check if result has an error property
            if (filters.error) {
                throw new Error(filters.error);
            }

            // Validate filters object
            if (typeof filters !== 'object' || filters === null) {
                // Fallback to basic search
                filters = { search: query };
            }

            // Build URL search params from filters
            const params = new URLSearchParams(searchParams.toString());

            // Clear existing params
            params.delete('search');
            params.delete('minPrice');
            params.delete('maxPrice');
            params.delete('bhk');
            params.delete('type');
            params.delete('status');

            // Add new params from AI interpretation
            if (filters.search) params.set('search', filters.search);
            if (filters.minPrice) params.set('minPrice', filters.minPrice.toString());
            if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
            if (filters.bhk && filters.bhk.length > 0) params.set('bhk', filters.bhk.join(','));
            if (filters.type) params.set('type', filters.type);
            if (filters.status) params.set('status', filters.status);

            // Navigate with new params
            router.push(`/?${params.toString()}`, { scroll: false });

        } catch (err: any) {
            console.error("AI Search error:", err);
            setError("AI search failed. Try using the filters below.");

            // Fallback: Use query as basic search
            const params = new URLSearchParams(searchParams.toString());
            params.set('search', query);
            router.push(`/?${params.toString()}`, { scroll: false });
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isLoading) {
            handleAiSearch();
        }
    };

    return (
        <div className="space-y-3">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Sparkles size={20} className="text-gold" />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Try: '3 BHK under 80 lakhs near Kadri' or 'Ready to move apartments with pool'"
                    disabled={isLoading}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-32 py-4 text-white placeholder:text-white/40 focus:border-gold/50 outline-none transition-colors disabled:opacity-50"
                />
                <button
                    onClick={handleAiSearch}
                    disabled={isLoading}
                    className="absolute inset-y-0 right-0 m-2 px-6 bg-gold text-dark-bg font-bold rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            <span className="hidden sm:inline">Thinking...</span>
                        </>
                    ) : (
                        <>
                            <Search size={18} />
                            <span className="hidden sm:inline">AI Search</span>
                        </>
                    )}
                </button>
            </div>
            {error && (
                <p className="text-red-400 text-sm px-4">{error}</p>
            )}
            <p className="text-white/50 text-xs px-4">
                💡 Tip: Describe what you're looking for in natural language, and AI will find the best matches
            </p>
        </div>
    );
}
