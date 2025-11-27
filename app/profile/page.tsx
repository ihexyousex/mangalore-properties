"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/components/UserProvider";
import PropertyCard from "@/components/PropertyCard";
import { PROJECTS, RESALE_PROPERTIES, COMMERCIAL_PROPERTIES, LAND_PROPERTIES } from "@/lib/data";
import { LogOut } from "lucide-react";

export default function ProfilePage() {
    const { user, favorites, logout } = useUser();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [savedProperties, setSavedProperties] = useState<any[]>([]);

    useEffect(() => {
        // Protect route
        if (!user) {
            router.push("/");
            return;
        }

        // Match favorites with local data
        const loadFavorites = () => {
            setIsLoading(true);
            const loadedProps: any[] = [];

            favorites.forEach(fav => {
                let foundProp = null;
                const id = fav.id;

                // Search in appropriate array based on type
                // Note: In data.ts, types are lowercase 'ongoing'/'upcoming' for projects
                // But we might store 'Project' in DB. 
                // Let's check all arrays to be safe or use the type hint.

                // Try Projects (Numeric IDs)
                if (!foundProp) {
                    foundProp = PROJECTS.find(p => p.id.toString() === id);
                }

                // Try Resale
                if (!foundProp) {
                    foundProp = RESALE_PROPERTIES.find(p => p.id === id);
                }

                // Try Commercial
                if (!foundProp) {
                    foundProp = COMMERCIAL_PROPERTIES.find(p => p.id === id);
                }

                // Try Land
                if (!foundProp) {
                    foundProp = LAND_PROPERTIES.find(p => p.id === id);
                }

                if (foundProp) {
                    loadedProps.push(foundProp);
                }
            });

            setSavedProperties(loadedProps);
            setIsLoading(false);
        };

        if (user) {
            loadFavorites();
        }
    }, [user, favorites, router]);

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    if (!user) return null;

    return (
        <main className="min-h-screen bg-dark-bg text-white pt-24 pb-20">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-white mb-2">
                            My <span className="text-gold">Profile</span>
                        </h1>
                        <p className="text-white/60">
                            Welcome back, {user.name || "User"}
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-sm font-bold text-white/60 hover:text-red-400 transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>

                {isLoading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold mx-auto mb-4"></div>
                        <p className="text-white/50">Loading your collection...</p>
                    </div>
                ) : savedProperties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {savedProperties.map((property) => (
                            <PropertyCard key={property.id} project={property} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                        <h2 className="text-2xl font-serif font-bold text-white mb-4">
                            You haven&apos;t saved any properties yet.
                        </h2>
                        <p className="text-white/60 mb-8 max-w-md mx-auto">
                            Start building your dream collection by browsing our exclusive properties.
                        </p>
                        <Link
                            href="/projects"
                            className="inline-block bg-gold text-dark-bg font-bold py-3 px-8 rounded-xl hover:bg-yellow-500 transition-colors"
                        >
                            Browse Projects
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}
