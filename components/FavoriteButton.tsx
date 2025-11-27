"use client";

import { Heart } from "lucide-react";
import { useUser } from "./UserProvider";
import clsx from "clsx";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FavoriteButtonProps {
    propertyId: string | number;
    propertyType?: string;
    className?: string;
}

export default function FavoriteButton({ propertyId, propertyType = "Project", className }: FavoriteButtonProps) {
    const { user, favorites, toggleFavorite, openLoginModal } = useUser();

    const isFavorite = favorites.some(f => f.id === propertyId.toString());

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            openLoginModal();
            return;
        }

        toggleFavorite(propertyId, propertyType);
    };

    return (
        <motion.button
            onClick={handleClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={clsx(
                "p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 group relative overflow-hidden",
                isFavorite
                    ? "bg-amber-500/10 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                    : "bg-black/30 border-white/10 hover:bg-black/50 hover:border-amber-500/30 hover:shadow-[0_0_10px_rgba(245,158,11,0.2)]",
                className
            )}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
            <AnimatePresence>
                {isFavorite ? (
                    <motion.div
                        key="filled"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0, opacity: 0, transition: { duration: 0.1 } }}
                        transition={{ type: "spring", stiffness: 500, damping: 25, mass: 0.5 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <Heart
                            size={20}
                            className="fill-amber-500 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="outline"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0, opacity: 0, transition: { duration: 0.1 } }}
                        transition={{ type: "spring", stiffness: 500, damping: 25, mass: 0.5 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <Heart
                            size={20}
                            className="text-white/80 group-hover:text-amber-400 transition-colors duration-300"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
}
