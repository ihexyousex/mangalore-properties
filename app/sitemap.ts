import { MetadataRoute } from "next";
import { PROJECTS } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://mangaloreproperties.in";

    // Static routes
    const routes = [
        "",
        "/projects",
        "/commercial",
        "/resale",
        "/lands",
        "/contact",
        "/partners",
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: route === "" ? 1 : 0.8,
    }));

    // Dynamic routes for Projects
    const projectRoutes = PROJECTS.map((project) => ({
        url: `${baseUrl}/projects/${project.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.9,
    }));

    return [...routes, ...projectRoutes];
}
