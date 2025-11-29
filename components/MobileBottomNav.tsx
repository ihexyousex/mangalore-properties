"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusCircle, Heart, User } from "lucide-react";
import clsx from "clsx";
import { useUser } from "./UserProvider";

export default function MobileBottomNav() {
    const pathname = usePathname();
    const { user } = useUser();

    // Hide on admin pages or if user is not logged in
    if (pathname?.startsWith("/admin") || !user) return null;

    const navItems = [
        { name: "Home", href: "/", icon: Home },
        { name: "Search", href: "/search", icon: Search },
        { name: "Sell", href: "/list-property", icon: PlusCircle, isPrimary: true },
        { name: "Saved", href: "/profile?tab=saved", icon: Heart },
        { name: "Profile", href: "/profile", icon: User },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900/95 backdrop-blur-lg border-t border-white/10 pb-safe md:hidden">
            <div className="flex items-center justify-around p-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));

                    if (item.isPrimary) {
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex flex-col items-center justify-center -mt-8"
                            >
                                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20 border-4 border-neutral-900">
                                    <Icon className="w-6 h-6 text-black" />
                                </div>
                                <span className="text-[10px] font-medium text-yellow-500 mt-1">
                                    {item.name}
                                </span>
                            </Link>
                        );
                    }

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={clsx(
                                "flex flex-col items-center justify-center p-2 rounded-lg transition-colors",
                                isActive ? "text-yellow-500" : "text-white/40 hover:text-white/60"
                            )}
                        >
                            <Icon className={clsx("w-6 h-6", isActive && "fill-current")} />
                            <span className="text-[10px] font-medium mt-1">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
