import { Car, Clock } from "lucide-react";

interface DistanceItem {
    name: string;
    distance: number;
    duration: number;
}

interface DistanceDisplayProps {
    distances: DistanceItem[];
}

export default function DistanceDisplay({ distances }: DistanceDisplayProps) {
    if (!distances || distances.length === 0) return null;

    return (
        <section className="glass-panel p-6 rounded-2xl border border-white/10">
            <h3 className="text-xl font-serif font-bold text-white mb-6">Commute & Connectivity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {distances.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5 hover:border-gold/30 transition-colors">
                        <div className="flex flex-col">
                            <span className="text-white font-medium">{item.name}</span>
                            <div className="flex items-center gap-3 text-sm text-white/50 mt-1">
                                <span className="flex items-center gap-1">
                                    <Car size={14} className="text-gold" />
                                    {item.distance} km
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock size={14} className="text-gold" />
                                    {item.duration} mins
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
