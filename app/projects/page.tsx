import { supabase } from "@/lib/supabaseClient";
import PropertyCard from "@/components/PropertyCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdvancedFilter from "@/components/AdvancedFilter";

export const revalidate = 0;

export default async function ProjectsPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    // Parse filters
    const search = typeof searchParams.search === "string" ? searchParams.search : "";
    const minPrice = typeof searchParams.minPrice === "string" ? Number(searchParams.minPrice) : 0;
    const maxPrice = typeof searchParams.maxPrice === "string" ? Number(searchParams.maxPrice) : 1000000000; // High default
    const bhk = typeof searchParams.bhk === "string" ? searchParams.bhk.split(",") : [];
    const type = typeof searchParams.type === "string" ? searchParams.type : "";
    const status = typeof searchParams.status === "string" ? searchParams.status : "";

    // Build Query
    let query = supabase
        .from("projects")
        .select("*") // Removed builders(name) join due to missing FK
        .order("id", { ascending: false });

    if (search) {
        query = query.or(`name.ilike.%${search}%,location.ilike.%${search}%`);
    }

    if (type) {
        query = query.eq("type", type);
    }

    if (status) {
        query = query.eq("status", status);
    }

    // Execute SQL Query
    const { data: rawData, error } = await query;

    if (error) {
        console.error("Error fetching projects:", error);
        return <div className="text-white text-center py-20">Error loading projects.</div>;
    }

    // Client-side Filtering for Complex Fields (Price Text, BHK Array)
    let projects = rawData || [];

    // Filter by Price (Text parsing)
    if (minPrice > 0 || maxPrice < 1000000000) {
        projects = projects.filter((p: any) => {
            // Simple parser: "85 Lakhs" -> 8500000
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
        projects = projects.filter((p: any) => {
            // Check if description or configuration contains the BHK value
            const text = `${p.configuration} ${p.description}`.toLowerCase();
            return bhk.some(b => text.includes(`${b}bhk`) || text.includes(`${b} bhk`));
        });
    }

    return (
        <main className="min-h-screen bg-dark-bg text-white">
            <Navbar />
            <div className="pt-32 pb-12 container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-serif font-bold mb-2">
                            New <span className="text-gold">Projects</span>
                        </h1>
                        <p className="text-white/60">Discover the latest premium developments.</p>
                    </div>
                </div>

                {/* Advanced Filter */}
                <div className="mb-10">
                    <AdvancedFilter />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.length > 0 ? (
                        projects.map((p: any) => (
                            <PropertyCard
                                key={p.id}
                                project={{
                                    id: p.id,
                                    title: p.name,
                                    location: p.location,
                                    price: p.price,
                                    image: p.image || "https://images.unsplash.com/photo-1600596542815-27bfefd0c3c6?q=80&w=1000",
                                    type: p.type,
                                    status: p.status,
                                    builder: p.builder || "Reputed Builder", // Use text column or default
                                    badge: p.status,
                                    badgeColor: p.status === "Ready to Move" ? "bg-green-500 text-white" : "bg-gold text-dark-bg"
                                }}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                            <h3 className="text-2xl font-bold text-white mb-2">No Projects Found</h3>
                            <p className="text-white/50">Try adjusting your filters to see more results.</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}
