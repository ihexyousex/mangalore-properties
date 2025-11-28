"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface FavoriteButtonProps {
    propertyId: string;
    className?: string;
    iconSize?: number;
}

export default function FavoriteButton({ propertyId, className = "", iconSize = 20 }: FavoriteButtonProps) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Check if user is logged in
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setUserId(user.id);
            checkIfFavorite(user.id);
        }

        // Listen for sign-in events
        const handleSignIn = (e: CustomEvent) => {
            setUserId(e.detail.id);
            checkIfFavorite(e.detail.id);
        };

        window.addEventListener('user-signed-in', handleSignIn as EventListener);
        return () => window.removeEventListener('user-signed-in', handleSignIn as EventListener);
    }, [propertyId]);

    const checkIfFavorite = async (uid: string) => {
        try {
            const res = await fetch(`/api/user/favorites?userId=${uid}`);
            const data = await res.json();
            if (data.favorites?.includes(propertyId)) {
                setIsFavorite(true);
            }
        } catch (error) {
            console.error('Error checking favorite:', error);
        }
    };

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!userId) {
            toast.error("Please sign in to save favorites");
            // Optional: Trigger login modal or One Tap prompt
            return;
        }

        // Optimistic update
        const newState = !isFavorite;
        setIsFavorite(newState);
        setIsLoading(true);

        try {
            const res = await fetch('/api/user/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, propertyId }),
            });

            if (!res.ok) {
                throw new Error('Failed to update');
            }

            toast.success(newState ? "Added to favorites" : "Removed from favorites");
        } catch (error) {
            // Revert on error
            setIsFavorite(!newState);
            toast.error("Failed to update favorite");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={toggleFavorite}
            className={`relative group ${className}`}
            disabled={isLoading}
        >
            <Heart
                size={iconSize}
                className={`transition-colors duration-300 ${isFavorite
                        ? "fill-red-500 text-red-500"
                        : "text-white group-hover:text-red-500"
                    }`}
            />
            <AnimatePresence>
                {isFavorite && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                        <Heart size={iconSize} className="fill-red-500 text-red-500" />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
}
