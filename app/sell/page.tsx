"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SellPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the new listing wizard
        router.push("/list-property");
    }, [router]);

    return (
        <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="animate-spin mx-auto mb-4 text-yellow-500" size={32} />
                <p>Redirecting to List Property...</p>
            </div>
        </main>
    );
}
