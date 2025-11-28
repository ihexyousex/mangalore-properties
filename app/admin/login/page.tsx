"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight } from "lucide-react";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    // Initialize Supabase client for Client Components
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("🚀 Starting login process...");
        setLoading(true);
        setError("");

        try {
            // 1. Sign in
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (signInError) {
                console.error("❌ Sign in error:", signInError);
                setError(signInError.message || "Invalid email or password");
                setLoading(false);
                return;
            }

            console.log("✅ Sign in successful, checking role...");

            // 2. Check Role
            const userRole = data.user?.user_metadata?.role;
            if (userRole !== 'admin') {
                console.error("❌ Access denied: Not an admin");
                setError("Access denied. Admin privileges required.");
                await supabase.auth.signOut();
                setLoading(false);
                return;
            }

            console.log("✅ Admin verified, setting storage and redirecting...");

            // 3. Store UI helpers
            localStorage.setItem("admin_name", data.user?.user_metadata?.name || "Admin");
            localStorage.setItem("admin_email", data.user?.email || "");
            localStorage.setItem("admin_role", userRole);

            // 4. Force router refresh to update middleware state
            router.refresh();

            // 5. Redirect
            router.push("/admin/dashboard");

        } catch (err: any) {
            console.error("❌ Unexpected error:", err);
            setError(err.message || "An unexpected error occurred");
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
                            placeholder="admin@mangaloreproperties.in"
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
                        Secure authentication via Supabase Auth<br />
                        Admin credentials required
                    </p>
                </div>
            </div>
        </main>
    );
}
