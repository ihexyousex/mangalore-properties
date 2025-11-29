"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Home, Building2, Store, PlusCircle } from "lucide-react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";

export default function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [isRentOpen, setIsRentOpen] = useState(false);
    const pathname = usePathname();

    // Close menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const menuItems = [
        { name: "Home", href: "/" },
        { name: "New Projects", href: "/projects" },
        { name: "Resale", href: "/resale" },
        { name: "Commercial", href: "/commercial" },
        { name: "Lands", href: "/lands" },
        { name: "Partners", href: "/partners" },
    ];

    return (
        <div className="md:hidden">
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-white hover:text-gold transition-colors"
                aria-label="Open Menu"
            >
                <Menu size={24} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[100] bg-dark-bg flex flex-col h-[100dvh]" // Increased z-index, use 100dvh
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-white/10 shrink-0">
                            <span className="font-serif text-2xl text-gold font-bold">Menu</span>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 text-white/70 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Links Container - Ensure it takes remaining height and scrolls */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-20">
                            {/* Standard Links First for better visibility */}
                            {menuItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={clsx(
                                        "block text-xl font-medium transition-colors",
                                        pathname === item.href ? "text-gold" : "text-white hover:text-gold"
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}

                            {/* Rent Accordion */}
                            <div className="space-y-4">
                                <button
                                    onClick={() => setIsRentOpen(!isRentOpen)}
                                    className="flex items-center justify-between w-full text-xl font-medium text-white"
                                >
                                    <span>Rent</span>
                                    <ChevronDown
                                        size={20}
                                        className={clsx("transition-transform duration-300", isRentOpen && "rotate-180")}
                                    />
                                </button>
                                <AnimatePresence>
                                    {isRentOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden pl-4 space-y-4 border-l border-white/10 ml-2"
                                        >
                                            <Link href="/rent?type=House" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-white/70 hover:text-gold py-2">
                                                <Home size={18} /> Homes
                                            </Link>
                                            <Link href="/rent?type=Apartment" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-white/70 hover:text-gold py-2">
                                                <Building2 size={18} /> Apartments
                                            </Link>
                                            <Link href="/rent?type=Commercial" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-white/70 hover:text-gold py-2">
                                                <Store size={18} /> Commercial
                                            </Link>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* CTA */}
                            <div className="pt-6 border-t border-white/10">
                                <Link
                                    href="/sell"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-gold to-amber-500 text-dark-bg font-bold rounded-xl text-lg hover:shadow-lg transition-all"
                                >
                                    <PlusCircle size={20} />
                                    List: Sell / Rent
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
