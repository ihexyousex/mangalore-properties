import { supabase } from "@/lib/supabaseClient";
import PropertyCard from "@/components/PropertyCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdvancedFilter from "@/components/AdvancedFilter";

export const revalidate = 0;

export default async function RentPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const typeFilter = typeof searchParams.type === "string" ? searchParams.type : null;
    const search = typeof searchParams.search === "string" ? searchParams.search : "";
    const minPrice = typeof searchParams.minPrice === "string" ? Number(searchParams.minPrice) : 0;
    const maxPrice = typeof searchParams.maxPrice === "string" ? Number(searchParams.maxPrice) : 1000000000;
    const bhk = typeof searchParams.bhk === "string" ? searchParams.bhk.split(",") : [];

    let query = supabase
        .from("projects")
        .select("*") // Removed builders(name) join
        .eq("type", "Rent") // Filter for Rent category
        .order("id", { ascending: false });

    if (search) {
        query = query.or(`name.ilike.%${search}%,location.ilike.%${search}%`);
    }

    // Execute SQL Query
    const { data: projects, error } = await query;

    if (error) {
        console.error("Error fetching rent projects:", error);
        return <div className="text-white text-center py-20">Error loading properties.</div>;
    }

    // Client-side filtering
    let filteredProjects = projects || [];

    // Filter by Type (Sub-category)
    if (typeFilter && typeFilter !== "Rent") {
        const keyword = typeFilter.toLowerCase();
        filteredProjects = filteredProjects.filter((p: any) =>
            p.name.toLowerCase().includes(keyword) ||
            (p.description && p.description.toLowerCase().includes(keyword)) ||
            (p.configuration && p.configuration.toLowerCase().includes(keyword))
        );
    }

    // Filter by Price
    if (minPrice > 0 || maxPrice < 1000000000) {
        filteredProjects = filteredProjects.filter((p: any) => {
            const parsePrice = (priceStr: string) => {
                if (!priceStr) return 0;
                const clean = priceStr.toLowerCase().replace(/,/g, "").replace(/\/ month/g, "").replace(/\/month/g, "");
                if (clean.includes("lakh") || clean.includes("l")) return parseFloat(clean) * 100000;
                if (clean.includes("k")) return parseFloat(clean) * 1000;
                return parseFloat(clean) || 0;
            };
            const pValue = parsePrice(p.price);
            return pValue >= minPrice && pValue <= maxPrice;
        });
    }

    // Filter by BHK
    if (bhk.length > 0) {
        filteredProjects = filteredProjects.filter((p: any) => {
            const text = `${p.configuration} ${p.description}`.toLowerCase();
            return bhk.some(b => text.includes(`${b}bhk`) || text.includes(`${b} bhk`));
        });
    }

    const mappedProjects = filteredProjects.map((p: any) => ({
        id: p.id,
        title: p.name,
        location: p.location,
        price: p.price,
        image: p.image || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070",
        type: "Rent",
        status: "Available",
        builder: p.builder || "Owner/Agent", // Use text column or default
        badge: "For Rent",
        badgeColor: "bg-blue-500 text-white"
    }));

    return (
        <main className="min-h-screen bg-dark-bg text-white">
            <Navbar />
            <div className="pt-32 pb-12 container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-serif font-bold mb-2">
                            Properties for <span className="text-gold">Rent</span>
                        </h1>
                        <p className="text-white/60">Find your perfect rental home or commercial space.</p>
                    </div>
                </div>

                {/* Advanced Filter */}
                <div className="mb-10">
                    <AdvancedFilter showStatus={false} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mappedProjects.length > 0 ? (
                        mappedProjects.map((project: any) => (
                            <PropertyCard key={project.id} project={project} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                            <h3 className="text-2xl font-bold text-white mb-2">No Rental Properties Found</h3>
                            <p className="text-white/50">Try adjusting your filters.</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}
