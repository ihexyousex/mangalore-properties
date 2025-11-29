"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Building, Key, Phone, Briefcase, Trees, Heart, User, Search, ChevronDown, Building2, Store, PlusCircle } from "lucide-react";
import clsx from "clsx";
import GlobalSearch from "./GlobalSearch";
import MobileMenu from "./MobileMenu";
import { useUser } from "./UserProvider";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, openLoginModal } = useUser();
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const isActive = (path: string) => pathname === path;

    return (
        <>
            <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            {/* Desktop Navbar */}
            <nav className="hidden md:flex fixed top-0 w-full z-50 glass-panel px-10 py-5 justify-between items-center border-b border-white/10 backdrop-blur-xl bg-black/20">
                <Link href="/" className="flex items-center gap-3 group">
                    <span className="font-serif text-3xl text-gold font-bold tracking-tight group-hover:text-white transition-colors duration-300">KH</span>
                    <div className="flex flex-col">
                        <span className="text-lg text-white font-sans tracking-wide font-medium leading-none group-hover:text-gold transition-colors duration-300">
                            KudlaHomes.com
                        </span>
                        <span className="text-[10px] text-white/50 uppercase tracking-[0.2em] leading-none mt-1">
                            Luxury Real Estate
                        </span>
                    </div>
                </Link>

                <div className="flex items-center gap-8">
                    <Link
                        href="/"
                        className={clsx(
                            "text-base font-medium transition-all duration-300 hover:scale-105",
                            isActive("/") ? "text-gold" : "text-white/80 hover:text-gold"
                        )}
                    >
                        Home
                    </Link>

                    {/* Rent Dropdown */}
                    <div className="relative group">
                        <button className={clsx(
                            "flex items-center gap-1 text-base font-medium transition-all duration-300 hover:scale-105",
                            pathname.startsWith("/rent") ? "text-gold" : "text-white/80 hover:text-gold"
                        )}>
                            Rent <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                        </button>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                            <div className="bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-2 w-48 shadow-2xl flex flex-col gap-1">
                                <Link href="/rent?type=House" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-white/80 hover:text-gold transition-colors">
                                    <Home size={16} /> Homes
                                </Link>
                                <Link href="/rent?type=Apartment" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-white/80 hover:text-gold transition-colors">
                                    <Building2 size={16} /> Apartments
                                </Link>
                                <Link href="/rent?type=Commercial" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-white/80 hover:text-gold transition-colors">
                                    <Store size={16} /> Commercial
                                </Link>
                            </div>
                        </div>
                    </div>

                    <Link
                        href="/projects"
                        className={clsx(
                            "text-base font-medium transition-all duration-300 hover:scale-105",
                            isActive("/projects") ? "text-gold" : "text-white/80 hover:text-gold"
                        )}
                    >
                        New Projects
                    </Link>
                    <Link
                        href="/resale"
                        className={clsx(
                            "text-base font-medium transition-all duration-300 hover:scale-105",
                            isActive("/resale") ? "text-gold" : "text-white/80 hover:text-gold"
                        )}
                    >
                        Resale
                    </Link>
                    <Link
                        href="/commercial"
                        className={clsx(
                            "text-base font-medium transition-all duration-300 hover:scale-105",
                            isActive("/commercial") ? "text-gold" : "text-white/80 hover:text-gold"
                        )}
                    >
                        Commercial
                    </Link>
                    <Link
                        href="/lands"
                        className={clsx(
                            "text-base font-medium transition-all duration-300 hover:scale-105",
                            isActive("/lands") ? "text-gold" : "text-white/80 hover:text-gold"
                        )}
                    >
                        Lands
                    </Link>
                    <Link
                        href="/partners"
                        className={clsx(
                            "text-base font-medium transition-all duration-300 hover:scale-105",
                            isActive("/partners") ? "text-gold" : "text-white/80 hover:text-gold"
                        )}
                    >
                        Partners
                    </Link>
                </div>

                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="text-white/80 hover:text-gold transition-colors p-2 hover:bg-white/5 rounded-full"
                        aria-label="Search"
                    >
                        <Search size={20} />
                    </button>

                    <Link
                        href="/profile"
                        className={clsx(
                            "text-base font-medium transition-all duration-300 flex items-center gap-2 hover:scale-105",
                            isActive("/profile") ? "text-gold" : "text-white/80 hover:text-gold"
                        )}
                    >
                        <User size={20} className={isActive("/profile") ? "text-gold" : ""} />
                    </Link>
                    <button
                        onClick={() => {
                            if (user) {
                                router.push("/sell");
                            } else {
                                openLoginModal();
                            }
                        }}
                        className="bg-gradient-to-r from-gold to-amber-500 text-dark-bg px-6 py-2.5 rounded-full text-sm font-bold hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-105 transition-all duration-300 flex items-center gap-2"
                    >
                        <PlusCircle size={16} />
                        List: Sell / Rent
                    </button>
                </div>
            </nav>

            {/* Mobile Navbar */}
            <nav className="md:hidden fixed top-0 w-full z-50 glass-panel px-6 py-4 flex justify-between items-center border-b border-white/10 backdrop-blur-xl bg-black/20">
                <Link href="/" className="flex items-center gap-2">
                    <span className="font-serif text-2xl text-gold font-bold tracking-tight">KH</span>
                    <span className="text-sm text-white font-sans tracking-wide font-medium">KudlaHomes.com</span>
                </Link>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="text-white/80 hover:text-gold transition-colors"
                    >
                        <Search size={20} />
                    </button>
                    <MobileMenu />
                </div>
            </nav>
        </>
    );
}
