import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

import HeroSearch from "@/components/HeroSearch";
import SeoFaq from "@/components/SeoFaq";
import { supabase } from "@/lib/supabaseClient";
import PropertyCard from "@/components/PropertyCard";
import AiSearchBar from "@/components/AiSearchBar";
import AdvancedFilter from "@/components/AdvancedFilter";

export const revalidate = 0;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  // Parse filters
  const search = typeof params.search === "string" ? params.search : "";
  const minPrice = typeof params.minPrice === "string" ? Number(params.minPrice) : 0;
  const maxPrice = typeof params.maxPrice === "string" ? Number(params.maxPrice) : 1000000000;
  const bhk = typeof params.bhk === "string" ? params.bhk.split(",") : [];
  const type = typeof params.type === "string" ? params.type : "";
  const status = typeof params.status === "string" ? params.status : "";

  // Build Query
  let query = supabase
    .from('projects')
    .select('*')
    .order('id', { ascending: false })
    .limit(20); // Increased from 6 to show more results when filtering

  if (search) {
    query = query.or(`name.ilike.%${search}%,location.ilike.%${search}%`);
  }

  if (type) {
    query = query.eq("type", type);
  }

  if (status) {
    query = query.eq("status", status);
  }

  const { data: rawData, error } = await query;

  if (error) {
    console.error("Supabase Error:", error);
    return <div className="text-white text-center py-20">Error loading projects: {error.message}</div>;
  }

  // Client-side Filtering for Complex Fields (Price Text, BHK Array)
  let latestProjects = rawData || [];

  // Filter by Price (Text parsing)
  if (minPrice > 0 || maxPrice < 1000000000) {
    latestProjects = latestProjects.filter((p: any) => {
      const parsePrice = (priceStr: string) => {
        if (!priceStr) return 0;
        const clean = priceStr.toLowerCase().replace(/,/g, "");
        if (clean.includes("crore") || clean.includes("cr")) {
          return parseFloat(clean) * 10000000;
        }
        if (clean.includes("lakh") || clean.includes("l")) {
          return parseFloat(clean) * 100000;
        }
        return parseFloat(clean) || 0;
      };
      const pValue = parsePrice(p.price);
      return pValue >= minPrice && pValue <= maxPrice;
    });
  }

  // Filter by BHK (Description parsing)
  if (bhk.length > 0) {
    latestProjects = latestProjects.filter((p: any) => {
      const text = `${p.configuration || ""} ${p.description || ""}`.toLowerCase();
      return bhk.some(b => text.includes(`${b}bhk`) || text.includes(`${b} bhk`));
    });
  }

  return (
    <main className="min-h-screen bg-dark-bg text-white">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000"
            alt="Luxury Coastal Home"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#050505]" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 w-full">
          <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight mb-6 animate-fade-in-up">
            Your Gateway to <br />
            <span className="text-gold italic">Coastal Luxury</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-sans mb-8">
            Discover exclusive properties in Mangalore's most prestigious locations.
          </p>

          <HeroSearch />
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown className="text-white/50 w-8 h-8" />
        </div>
      </section>

      {/* Bento Grid Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {/* Card 1: New Launches (Large) */}
          <Link href="/projects" className="glass-panel md:col-span-2 rounded-2xl p-6 relative overflow-hidden group cursor-pointer transition-transform hover:scale-[1.02]">
            <div className="absolute inset-0 z-0">
              <Image
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000"
                alt="New Launches"
                fill
                className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-end">
              <h3 className="text-3xl font-serif font-bold text-white mb-2">New Launches</h3>
              <p className="text-white/70">Exclusive pre-launch offers on premium apartments.</p>
            </div>
          </Link>

          {/* Card 2: Buy Resale (Tall) */}
          <Link href="/resale" className="glass-panel md:row-span-2 rounded-2xl p-6 relative overflow-hidden group cursor-pointer transition-transform hover:scale-[1.02]">
            <div className="absolute inset-0 z-0">
              <Image
                src="https://images.unsplash.com/photo-1600596542815-27bfefd0c3c6?q=80&w=1000"
                alt="Resale Properties"
                fill
                className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-end">
              <h3 className="text-3xl font-serif font-bold text-white mb-2">Buy Resale</h3>
              <p className="text-white/70">Move-in ready homes in prime locations.</p>
            </div>
          </Link>

          {/* Card 3: Commercial */}
          <Link href="/commercial" className="glass-panel rounded-2xl p-6 relative overflow-hidden group cursor-pointer transition-transform hover:scale-[1.02]">
            <div className="absolute inset-0 z-0">
              <Image
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000"
                alt="Commercial Properties"
                fill
                className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-end">
              <h3 className="text-2xl font-serif font-bold text-white mb-2">Commercial</h3>
              <p className="text-white/70">High-return investment spaces.</p>
            </div>
          </Link>

          {/* Card 4: Lands */}
          <Link href="/lands" className="glass-panel rounded-2xl p-6 relative overflow-hidden group cursor-pointer transition-transform hover:scale-[1.02]">
            <div className="absolute inset-0 z-0">
              <Image
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000"
                alt="Premium Lands"
                fill
                className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-end">
              <h3 className="text-2xl font-serif font-bold text-white mb-2">Lands</h3>
              <p className="text-white/70">Build your dream on prime plots.</p>
            </div>
          </Link>

          {/* Card 5: Rent (New) */}
          <Link href="/rent" className="glass-panel md:col-span-2 rounded-2xl p-6 relative overflow-hidden group cursor-pointer transition-transform hover:scale-[1.02]">
            <div className="absolute inset-0 z-0">
              <Image
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070"
                alt="Rent Properties"
                fill
                className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-end">
              <h3 className="text-3xl font-serif font-bold text-white mb-2">Rent</h3>
              <p className="text-white/70">Find your perfect rental home or commercial space.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Latest Listings Section */}
      <section className="container mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
            Latest <span className="text-gold">Listings</span>
          </h2>
          <a href="/projects" className="text-gold hover:text-white transition-colors text-sm font-bold uppercase tracking-wider">
            View All
          </a>
        </div>

        {/* AI-Powered Search */}
        <div className="mb-8">
          <AiSearchBar />
        </div>

        {/* Advanced Filters */}
        <div className="mb-10">
          <AdvancedFilter />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestProjects.length > 0 ? (
            latestProjects.map((project: any) => (
              <PropertyCard
                key={project.id}
                project={{
                  id: project.id,
                  title: project.name, // Mapped from name
                  location: project.location,
                  price: project.price, // Mapped from price
                  image: project.image || "https://images.unsplash.com/photo-1600596542815-27bfefd0c3c6?q=80&w=1000", // Mapped from image
                  type: project.type, // Mapped from type
                  status: project.status,
                  builder: project.builders?.name || "Reputed Builder",
                  badge: project.status,
                  badgeColor: project.status === "Ready to Move" ? "bg-green-500 text-white" : "bg-gold text-dark-bg"
                }}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-white/50">
              <p>No listings found. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <SeoFaq />
    </main>
  );
}
