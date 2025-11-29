"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

function SubmissionSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const trackingId = searchParams.get("id");

    useEffect(() => {
        // Redirect to home after 10 seconds
        const timeout = setTimeout(() => {
            router.push("/");
        }, 10000);

        return () => clearTimeout(timeout);
    }, [router]);

    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                    <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
                </motion.div>

                <h1 className="text-4xl font-bold text-white mb-4">
                    Submission Successful!
                </h1>

                <p className="text-xl text-white/80 mb-6">
                    Thank you for listing your property with us.
                </p>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 mb-8">
                    <p className="text-yellow-500 text-lg font-medium mb-2">
                        ðŸ“‹ Your Tracking ID
                    </p>
                    <p className="text-3xl font-bold text-yellow-500 font-mono">
                        #{trackingId}
                    </p>
                </div>

                <div className="space-y-4 text-white/70">
                    <p className="text-lg">
                        âœ… Your listing is under review
                    </p>
                    <p className="text-lg">
                        ðŸ“§ Check your email for confirmation
                    </p>
                    <p className="text-lg">
                        â±ï¸ We'll review within 24 hours
                    </p>
                </div>

                <div className="mt-12 space-y-4">
                    <button
                        onClick={() => router.push("/")}
                        className="w-full bg-yellow-500 text-neutral-950 font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-all"
                    >
                        Return to Homepage
                    </button>

                    <button
                        onClick={() => router.push("/list-property")}
                        className="w-full bg-white/10 text-white font-medium py-3 px-6 rounded-lg hover:bg-white/20 transition-all"
                    >
                        List Another Property
                    </button>
                </div>

                <p className="text-sm text-white/40 mt-8">
                    Redirecting to homepage in 10 seconds...
                </p>
            </motion.div>
        </div>
    );
}

export default function SubmissionSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
                Loading...
            </div>
        }>
            <SubmissionSuccessContent />
        </Suspense>
    );
}
