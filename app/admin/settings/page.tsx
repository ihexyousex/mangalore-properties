"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Save, Lock, User } from "lucide-react";

export default function AdminSettingsPage() {
    const router = useRouter();
    const [adminName, setAdminName] = useState("");
    const [adminRole, setAdminRole] = useState("");
    const [adminEmail, setAdminEmail] = useState("");

    useEffect(() => {
        const role = localStorage.getItem("admin_role");
        if (role !== "master") {
            router.push("/admin/dashboard"); // Protect route
            return;
        }
        setAdminName(localStorage.getItem("admin_name") || "");
        setAdminRole(role || "");
        setAdminEmail(localStorage.getItem("admin_email") || "");
    }, [router]);

    return (
        <div className="flex min-h-screen bg-dark-bg text-white font-sans">
            <AdminSidebar />

            <main className="flex-1 ml-64 p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-serif font-bold text-white">Settings</h1>
                    <p className="text-white/50">Manage admin preferences</p>
                </div>

                <div className="max-w-2xl space-y-6">
                    {/* Profile Card */}
                    <div className="bg-neutral-900/50 border border-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <User size={20} className="text-gold" />
                            Profile Information
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-white/50 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={adminName}
                                    readOnly
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white/70 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-white/50 mb-1">Email</label>
                                <input
                                    type="text"
                                    value={adminEmail}
                                    readOnly
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white/70 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-white/50 mb-1">Role</label>
                                <div className="inline-block px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium uppercase tracking-wider">
                                    {adminRole}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security Card (Placeholder) */}
                    <div className="bg-neutral-900/50 border border-white/10 rounded-xl p-6 opacity-75">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Lock size={20} className="text-gold" />
                            Security
                        </h2>
                        <p className="text-white/40 text-sm mb-4">
                            Password change functionality is managed by the system administrator directly in the database for security reasons.
                        </p>
                        <button disabled className="px-4 py-2 bg-white/5 text-white/30 rounded-lg text-sm cursor-not-allowed">
                            Change Password
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
