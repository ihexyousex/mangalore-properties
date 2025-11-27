import ProjectForm from "@/components/admin/ProjectForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddProjectPage() {
    return (
        <div className="min-h-screen bg-neutral-950 text-white p-8 pb-32">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href="/admin"
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-playfair font-bold bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
                            Add New Project
                        </h1>
                        <p className="text-gray-400 mt-1">Upload a new property to the catalog</p>
                    </div>
                </div>

                {/* Form */}
                <ProjectForm />
            </div>
        </div>
    );
}
