"use client";

import { useState } from "react";
import { X, Phone, ArrowRight } from "lucide-react";
import { useUser } from "./UserProvider";
import Link from "next/link";

export default function LoginModal() {
    const { isLoginModalOpen, closeLoginModal, login } = useUser();
    const [step, setStep] = useState<"phone" | "otp">("phone");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");

    if (!isLoginModalOpen) return null;

    const handleGoogleLogin = () => {
        login({ name: "Google User" });
    };

    const handleSendOtp = (e: React.FormEvent) => {
        e.preventDefault();
        if (phone.length === 10) {
            setStep("otp");
        } else {
            alert("Please enter a valid 10-digit phone number");
        }
    };

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp === "1234") {
            login({ phone });
            // Reset state after successful login
            setStep("phone");
            setPhone("");
            setOtp("");
        } else {
            alert("Invalid OTP. Please enter 1234.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-[#1a1a1a]/90 border border-gold/20 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                <button
                    onClick={closeLoginModal}
                    className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-200 mb-2">
                        Welcome to Mangalore Luxury
                    </h2>
                    <p className="text-white/60 text-sm">
                        Sign in to access exclusive features
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Google Login */}
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-3 shadow-lg"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Continue with Google
                    </button>

                    {/* Divider */}
                    <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-white/10"></div>
                        <span className="flex-shrink-0 mx-4 text-white/30 text-xs font-bold uppercase">OR</span>
                        <div className="flex-grow border-t border-white/10"></div>
                    </div>

                    {/* Phone/OTP Flow */}
                    {step === "phone" ? (
                        <form onSubmit={handleSendOtp} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gold uppercase tracking-wider">
                                    Mobile Number
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "");
                                            if (value.length <= 10) {
                                                setPhone(value);
                                            }
                                        }}
                                        placeholder="Enter 10-digit number"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-gold/50 focus:outline-none transition-colors"
                                        autoFocus
                                        maxLength={10}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gold/10 text-gold border border-gold/50 font-bold py-3.5 rounded-xl hover:bg-gold hover:text-dark-bg transition-all"
                            >
                                Send OTP
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in slide-in-from-right duration-300">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold text-gold uppercase tracking-wider">
                                        Enter OTP
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setStep("phone")}
                                        className="text-xs text-white/50 hover:text-white"
                                    >
                                        Change Number
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter 1234"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-center text-2xl tracking-[0.5em] text-white placeholder:text-white/20 focus:border-gold/50 focus:outline-none transition-colors"
                                    maxLength={4}
                                    autoFocus
                                />
                                <p className="text-xs text-center text-white/40">Use 1234 to verify</p>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gold text-dark-bg font-bold py-3.5 rounded-xl hover:bg-yellow-500 transition-colors shadow-lg shadow-gold/10 flex items-center justify-center gap-2"
                            >
                                Verify & Continue
                                <ArrowRight size={18} />
                            </button>
                        </form>
                    )}
                </div>

                <div className="mt-6 text-center">
                    <Link href="/admin/login" className="text-xs text-white/30 hover:text-white/60 transition-colors">
                        Admin Access
                    </Link>
                </div>
            </div>
        </div>
    );
}
