"use client";

import {
    Car, Bike, Wifi, Zap, Droplets, Shield,
    Dumbbell, Trees, Utensils, ShoppingBag,
    Tv, Wind, Waves, ArrowUpFromLine
} from "lucide-react";
import SelectionChip from "./SelectionChip";

const AMENITIES_LIST = [
    { id: 'parking_car', label: 'Car Parking', icon: <Car className="w-6 h-6" /> },
    { id: 'parking_bike', label: 'Bike Parking', icon: <Bike className="w-6 h-6" /> },
    { id: 'lift', label: 'Lift', icon: <ArrowUpFromLine className="w-6 h-6" /> },
    { id: 'power_backup', label: 'Power Backup', icon: <Zap className="w-6 h-6" /> },
    { id: 'water_supply', label: '24/7 Water', icon: <Droplets className="w-6 h-6" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-6 h-6" /> },
    { id: 'gym', label: 'Gym', icon: <Dumbbell className="w-6 h-6" /> },
    { id: 'garden', label: 'Garden', icon: <Trees className="w-6 h-6" /> },
    { id: 'swimming_pool', label: 'Pool', icon: <Waves className="w-6 h-6" /> },
    { id: 'ac', label: 'AC', icon: <Wind className="w-6 h-6" /> },
    { id: 'wifi', label: 'Wifi', icon: <Wifi className="w-6 h-6" /> },
    { id: 'furnished_kitchen', label: 'Modular Kitchen', icon: <Utensils className="w-6 h-6" /> },
];

interface AmenityGridProps {
    selectedAmenities: string[];
    onChange: (amenities: string[]) => void;
}

export default function AmenityGrid({ selectedAmenities, onChange }: AmenityGridProps) {
    const toggleAmenity = (id: string) => {
        if (selectedAmenities.includes(id)) {
            onChange(selectedAmenities.filter(a => a !== id));
        } else {
            onChange([...selectedAmenities, id]);
        }
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {AMENITIES_LIST.map((amenity) => (
                <SelectionChip
                    key={amenity.id}
                    label={amenity.label}
                    icon={amenity.icon}
                    isSelected={selectedAmenities.includes(amenity.id)}
                    onClick={() => toggleAmenity(amenity.id)}
                />
            ))}
        </div>
    );
}
