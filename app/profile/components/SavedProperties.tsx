"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertCircle, Heart, Trash2, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface Favorite {
    id: number;
    created_at: string;
    project: {
        id: number;
        title: string;
        location: string;
        price: string;
        cover_image_url: string;
        type: string;
        category: string;
    };
}

export default function SavedProperties() {
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [loading, setLoading] = useState(true);
    const [removing, setRemoving] = useState<number | null>(null);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const res = await fetch('/api/user/favorites', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error('Failed to fetch favorites');
            const data = await res.json();
            setFavorites(data.favorites);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (projectId: number) => {
        if (!confirm('Remove this property from favorites?')) return;

        setRemoving(projectId);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const res = await fetch(`/api/user/favorites/${projectId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error('Failed to remove favorite');

            // Remove from local state
            setFavorites(prev => prev.filter(f => f.project.id !== projectId));
        } catch (error) {
            console.error('Error removing favorite:', error);
            alert('Failed to remove favorite');
        } finally {
            setRemoving(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
            </div>
        );
    }

    if (favorites.length === 0) {
        return (
            <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                <Heart className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No saved properties</h3>
                <p className="text-white/60 mb-6">
                    Start adding properties to your favorites to see them here
                </p>
                <Link
                    href="/projects"
                    className="inline-block px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-neutral-950 font-bold rounded-lg transition-colors"
                >
                    Browse Properties
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <p className="text-white/60">
                {favorites.length} saved propert{favorites.length === 1 ? 'y' : 'ies'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((favorite) => (
                    <div
                        key={favorite.id}
                        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all group"
                    >
                        {/* Image */}
                        <Link href={`/projects/${favorite.project.id}`}>
                            <div className="relative h-48 bg-white/10">
                                {favorite.project.cover_image_url ? (
                                    <Image
                                        src={favorite.project.cover_image_url}
                                        alt={favorite.project.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/40">
                                        No Image
                                    </div>
                                )}

                                {/* Heart Icon */}
                                <div className="absolute top-3 right-3">
                                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                                        <Heart className="w-5 h-5 text-white fill-white" />
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Content */}
                        <div className="p-4">
                            <Link href={`/projects/${favorite.project.id}`}>
                                <h3 className="text-lg font-bold text-white mb-2 truncate hover:text-yellow-500 transition-colors">
                                    {favorite.project.title}
                                </h3>
                            </Link>
                            <p className="text-white/60 text-sm mb-2">📍 {favorite.project.location}</p>
                            <p className="text-yellow-500 font-bold mb-3">{favorite.project.price}</p>

                            <div className="flex items-center justify-between text-xs text-white/40 mb-4">
                                <span>{favorite.project.type}</span>
                                <span>Saved {new Date(favorite.created_at).toLocaleDateString()}</span>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <Link
                                    href={`/projects/${favorite.project.id}`}
                                    className="flex-1 text-center px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-neutral-950 font-medium rounded-lg transition-colors"
                                >
                                    View Property
                                </Link>
                                <button
                                    onClick={() => handleRemove(favorite.project.id)}
                                    disabled={removing === favorite.project.id}
                                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg transition-colors disabled:opacity-50"
                                    title="Remove from favorites"
                                >
                                    {removing === favorite.project.id ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
