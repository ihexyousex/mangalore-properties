"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Loader2, Heart } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import { motion } from "framer-motion";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setUserId(user.id);
            fetchFavorites(user.id);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchFavorites = async (uid: string) => {
        try {
            // 1. Get favorite IDs
            const { data: prefs } = await supabase
                .from('user_preferences')
                .select('favorite_properties')
                .eq('user_id', uid)
                .single();

            const favoriteIds = prefs?.favorite_properties || [];

            if (favoriteIds.length === 0) {
                setFavorites([]);
                setLoading(false);
                return;
            }

            // 2. Fetch property details
            const { data: properties } = await supabase
                .from('projects')
                .select('*')
                .in('id', favoriteIds);

            const mappedProperties = (properties || []).map((p: any) => ({
                ...p,
                type: p.listing_type || p.type || 'Property',
                image: p.cover_image || (p.images && p.images[0]) || '/placeholder.jpg',
                price: p.price || 'Price on Request',
                location: p.location || 'Mangalore',
                status: p.status || (p.is_approved ? 'Active' : 'Pending'),
            }));

            setFavorites(mappedProperties);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
            </div>
        );
    }

    if (!userId) {
        return (
            <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-center">
                <Heart className="w-16 h-16 text-white/20 mb-4" />
                <h1 className="text-2xl font-bold text-white mb-2">Sign in to view favorites</h1>
                <p className="text-white/60 mb-6">Save properties you like and view them here.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 p-6 pt-24">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Your Favorites</h1>
                    <p className="text-white/60">
                        {favorites.length} {favorites.length === 1 ? 'property' : 'properties'} saved
                    </p>
                </div>

                {favorites.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                        <Heart className="w-16 h-16 text-white/20 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-white mb-2">No favorites yet</h2>
                        <p className="text-white/60">
                            Start exploring and click the heart icon to save properties.
                        </p>
                        <a
                            href="/projects"
                            className="inline-block mt-6 bg-yellow-500 text-neutral-950 px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-all"
                        >
                            Explore Properties
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {favorites.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <PropertyCard project={project} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
