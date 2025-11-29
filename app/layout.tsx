import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { UserProvider } from "@/components/UserProvider";
import LoginModal from "@/components/LoginModal";
import CompareBar from "@/components/CompareBar";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import Footer from "@/components/Footer";
import MobileMenu from "@/components/MobileMenu";
import { Toaster } from "sonner";
import GoogleOneTap from "@/components/GoogleOneTap";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Kudla Homes | Luxury Real Estate, Plots & Gated Communities",
  description: "Discover exclusive properties in Mangalore. From luxury apartments in Kadri to premium plots in Derebail & Moodbidri. Your trusted guide for RERA-approved real estate investments.",
  keywords: ["Mangalore real estate", "luxury apartments Mangalore", "plots for sale in Mangalore", "gated community Mangalore", "commercial property Mangalore", "best builders Mangalore", "RERA approved projects"],
  openGraph: {
    title: "Kudla Homes | Luxury Real Estate",
    description: "Discover exclusive properties in Mangalore. From luxury apartments in Kadri to premium plots in Derebail & Moodbidri.",
    url: "https://mangaloreproperties.in",
    siteName: "MangaloreProperties.in",
    images: [
      {
        url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000",
        width: 1200,
        height: 630,
        alt: "Mangalore Luxury Real Estate",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

import JsonLd from "@/components/JsonLd";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "MangaloreProperties.in",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000",
    description: "Your trusted guide for luxury real estate, plots, and RERA-approved projects in Mangalore.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mangalore",
      addressRegion: "Karnataka",
      addressCountry: "IN"
    },
    areaServed: ["Mangalore", "Kadri", "Derebail", "Moodbidri", "Surathkal", "Mulki"],
    priceRange: "₹40 Lakhs - ₹10 Crores",
    telephone: "+91-9999999999",
    url: "https://mangaloreproperties.in"
  };

  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${manrope.variable} font-sans antialiased bg-dark-bg text-white`}
      >
        <JsonLd data={jsonLd} />
        <GoogleOneTap />
        <UserProvider>
          <Navbar />
          {children}
          <LoginModal />
          <CompareBar />
          <WhatsAppWidget />
          <Footer />
          <MobileMenu />
        </UserProvider>
        <Toaster position="top-right" theme="dark" richColors />
      </body>
    </html>
  );
}

