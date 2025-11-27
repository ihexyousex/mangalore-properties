"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Query Supabase for the admin
            const { data, error: dbError } = await supabase
                .from("admins")
                .select("*")
                .eq("email", email)
                .eq("password_hash", password) // Simple check for demo
                .single();

            if (dbError || !data) {
                setError("Invalid email or password");
                setLoading(false);
                return;
            }

            // Login Success
            localStorage.setItem("admin_auth", "true");
            localStorage.setItem("admin_role", data.role);
            localStorage.setItem("admin_name", data.name);
            localStorage.setItem("admin_email", data.email);

            router.push("/admin");

        } catch (err) {
            console.error("Login error:", err);
            setError("An unexpected error occurred");
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#1a1a1a]/90 border border-gold/20 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-2xl font-serif font-bold text-white mb-2">
                        Admin Portal
                    </h1>
                    <p className="text-white/60 text-sm">
                        Sign in to manage properties
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs text-white/50 uppercase tracking-wider font-bold">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/20 focus:border-gold/50 focus:outline-none transition-colors"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-white/50 uppercase tracking-wider font-bold">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/20 focus:border-gold/50 focus:outline-none transition-colors"
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-xs text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gold text-dark-bg font-bold py-3.5 rounded-xl hover:bg-yellow-500 transition-colors shadow-lg shadow-gold/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Verifying..." : "Access Dashboard"}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-xs text-white/30">
                        Demo Credentials:<br />
                        Master: admin@mangaloreproperties.in / admin123<br />
                        Partner: partner@mangaloreproperties.in / sub123
                    </p>
                </div>
            </div>
        </main>
    );
}
