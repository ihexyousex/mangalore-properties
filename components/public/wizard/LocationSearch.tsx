"use client";

import { useEffect, useRef, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { Loader2, MapPin } from "lucide-react";

const LIBRARIES: ("places")[] = ["places"];

interface LocationSearchProps {
    onLocationSelect: (data: {
        address: string;
        latitude: number;
        longitude: number;
        area: string;
        city: string;
        pincode: string;
    }) => void;
    defaultValue?: string;
}

export default function LocationSearch({ onLocationSelect, defaultValue }: LocationSearchProps) {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        libraries: LIBRARIES,
    });

    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    useEffect(() => {
        if (isLoaded && inputRef.current) {
            autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
                componentRestrictions: { country: "in" },
                fields: ["address_components", "geometry", "formatted_address"],
                types: ["geocode", "establishment"],
            });

            // Bias towards Mangalore
            const mangaloreBounds = new google.maps.LatLngBounds(
                new google.maps.LatLng(12.8, 74.8),
                new google.maps.LatLng(13.0, 75.0)
            );
            autocompleteRef.current.setBounds(mangaloreBounds);

            autocompleteRef.current.addListener("place_changed", () => {
                const place = autocompleteRef.current?.getPlace();
                if (place && place.geometry && place.geometry.location) {
                    // Extract details
                    let area = "";
                    let city = "Mangalore";
                    let pincode = "";

                    place.address_components?.forEach((component) => {
                        if (component.types.includes("sublocality") || component.types.includes("neighborhood")) {
                            area = component.long_name;
                        }
                        if (component.types.includes("locality")) {
                            city = component.long_name;
                        }
                        if (component.types.includes("postal_code")) {
                            pincode = component.long_name;
                        }
                    });

                    // If area is empty, try to use the name of the place
                    if (!area && place.name) {
                        area = place.name;
                    }

                    onLocationSelect({
                        address: place.formatted_address || "",
                        latitude: place.geometry.location.lat(),
                        longitude: place.geometry.location.lng(),
                        area,
                        city,
                        pincode,
                    });
                }
            });
        }
    }, [isLoaded, onLocationSelect]);

    if (!isLoaded) {
        return (
            <div className="flex items-center gap-2 text-white/60">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading Maps...
            </div>
        );
    }

    return (
        <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500">
                <MapPin className="w-5 h-5" />
            </div>
            <input
                ref={inputRef}
                defaultValue={defaultValue}
                placeholder="Search area (e.g. Kadri, Bejai, Falnir...)"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-lg text-white placeholder:text-white/40 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
            />
            <p className="text-xs text-white/40 mt-2 ml-1">
                Start typing to see suggestions in Mangalore
            </p>
        </div>
    );
}
