"use client";

import { GoogleAnalytics } from "@next/third-parties/google";

export default function Analytics() {
    // Replace with your Measurement ID (G-XXXXXXXXXX)
    // You can find this in Google Analytics -> Admin -> Data Streams
    const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

    if (!gaId) return null;

    return <GoogleAnalytics gaId={gaId} />;
}
