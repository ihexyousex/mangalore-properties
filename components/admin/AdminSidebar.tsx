"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { LayoutDashboard, Building, Users, Search, Settings, LogOut } from "lucide-react";
import clsx from "clsx";

const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Properties", href: "/admin/projects", icon: Building },
    { name: "Builders", href: "/admin/builders", icon: Building }, // Reusing Building icon or use HardHat if available
    { name: "Leads", href: "/admin/leads", icon: Users },
    { name: "SEO Tools", href: "/admin/seo", icon: Search },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [role, setRole] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);

    useEffect(() => {
        setRole(localStorage.getItem("admin_role"));
        setName(localStorage.getItem("admin_name"));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("admin_auth");
        localStorage.removeItem("admin_role");
        localStorage.removeItem("admin_name");
        localStorage.removeItem("admin_email");
        window.location.href = "/admin/login";
    };

    return (
        <aside className="w-full h-full flex flex-col bg-neutral-900">
            {/* Logo */}
            <div className="p-6 border-b border-white/10">
                <Link href="/" className="text-xl font-serif font-bold text-gold">
                    Mangalore<span className="text-white">Properties.in</span>
                </Link>
                <div className="mt-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-xs text-white/60 truncate max-w-[150px]">
                        {name || "Admin"}
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                    // Role-based hiding
                    if (item.name === "Settings" && role !== "master") return null;

                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-gold text-black shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                                    : "text-white/60 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <Icon size={18} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-white/10">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </aside>
    );
}
