"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Session } from "@supabase/supabase-js";

type User = {
    name?: string;
    phone?: string;
} | null;

type UserContextType = {
    user: User;
    login: (userData: { name?: string; phone?: string }) => void;
    logout: () => void;
    favorites: { id: string; type: string }[];
    toggleFavorite: (id: string | number, type: string) => void;
    compareList: (number | string)[];
    toggleCompare: (id: number | string) => void;
    isLoginModalOpen: boolean;
    openLoginModal: () => void;
    closeLoginModal: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

// User Context Provider
export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>(null);
    const [favorites, setFavorites] = useState<{ id: string; type: string }[]>([]);
    const [compareList, setCompareList] = useState<(number | string)[]>([]);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("mangalore_prop_user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Save user to localStorage when it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem("mangalore_prop_user", JSON.stringify(user));
        } else {
            localStorage.removeItem("mangalore_prop_user");
        }
    }, [user]);

    // Sync with Supabase Auth (e.g. if logged in as Admin)
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: Session | null) => {
            if (session?.user) {
                // If Supabase has a user, sync it to our local user state if not already set
                const supabaseUser = {
                    name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || "Admin User",
                    phone: session.user.phone || session.user.user_metadata?.phone || "Admin"
                };
                // Only set if we don't have a user or if it's different
                setUser(prev => prev ? prev : supabaseUser);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Fetch favorites when user logs in
    useEffect(() => {
        const fetchFavorites = async () => {
            if (user?.phone) {
                const { data, error } = await supabase
                    .from('favorites')
                    .select('property_id, property_type')
                    .eq('user_id', user.phone);

                if (data) {
                    setFavorites(data.map((f: any) => ({ id: f.property_id, type: f.property_type })));
                } else if (error) {
                    console.error("Error fetching favorites:", error);
                }
            } else {
                setFavorites([]);
            }
        };

        fetchFavorites();
    }, [user]);

    const login = (userData: { name?: string; phone?: string }) => {
        setUser(userData);
        setIsLoginModalOpen(false);
    };

    const logout = () => {
        setUser(null);
        setFavorites([]);
    };

    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);

    const toggleFavorite = async (id: string | number, type: string) => {
        if (!user) {
            openLoginModal();
            return;
        }

        const idStr = id.toString();
        const isCurrentlyFavorite = favorites.some(f => f.id === idStr);

        // Optimistic Update
        setFavorites((prev) =>
            isCurrentlyFavorite
                ? prev.filter((f) => f.id !== idStr)
                : [...prev, { id: idStr, type }]
        );

        try {
            if (isCurrentlyFavorite) {
                // Remove from DB
                const { error } = await supabase
                    .from('favorites')
                    .delete()
                    .eq('user_id', user.phone)
                    .eq('property_id', idStr);

                if (error) throw error;
            } else {
                // Add to DB
                const { error } = await supabase
                    .from('favorites')
                    .insert({
                        user_id: user.phone,
                        property_id: idStr,
                        property_type: type
                    });

                if (error) throw error;
            }
        } catch (error) {
            console.error("Error updating favorite:", error);
            // Revert on error
            setFavorites((prev) =>
                isCurrentlyFavorite
                    ? [...prev, { id: idStr, type }]
                    : prev.filter((f) => f.id !== idStr)
            );
            alert("Failed to update favorite. Please try again.");
        }
    };

    const toggleCompare = (id: number | string) => {
        setCompareList((prev) => {
            if (prev.includes(id)) {
                return prev.filter((cid) => cid !== id);
            }
            if (prev.length >= 3) {
                alert("You can compare up to 3 projects only.");
                return prev;
            }
            return [...prev, id];
        });
    };

    return (
        <UserContext.Provider
            value={{
                user,
                login,
                logout,
                favorites,
                toggleFavorite,
                compareList,
                toggleCompare,
                isLoginModalOpen,
                openLoginModal,
                closeLoginModal,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
