"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";
import { MapPin, Navigation, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import clsx from "clsx";

// Mangalore Center Coordinates
const MANGALORE_CENTER = { lat: 12.9141, lng: 74.8560 };
const MANGALORE_BOUNDS = {
    north: 13.15,
    south: 12.65,
    east: 75.10,
    west: 74.70,
};

type LocationData = {
    address: string;
    latitude: number;
    longitude: number;
    map_url: string;
    area: string;
    pincode: string;
    landmarks?: string[];
};

type LocationPickerProps = {
    isLoaded: boolean;
    onLocationSelect: (data: LocationData) => void;
    initialLocation?: string;
    initialLat?: number;
    initialLng?: number;
};

export default function LocationPicker({ isLoaded, onLocationSelect, initialLocation, initialLat, initialLng }: LocationPickerProps) {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [markerPos, setMarkerPos] = useState(MANGALORE_CENTER);
    const [address, setAddress] = useState(initialLocation || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [nearbyLandmarks, setNearbyLandmarks] = useState<string[]>([]);

    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const geocoderRef = useRef<google.maps.Geocoder | null>(null);
    const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

    // Initialize Geocoder
    useEffect(() => {
        if (isLoaded && !geocoderRef.current) {
            geocoderRef.current = new google.maps.Geocoder();
        }
    }, [isLoaded]);

    // Initialize Places Service when map is ready
    const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
        setMap(mapInstance);
        placesServiceRef.current = new google.maps.places.PlacesService(mapInstance);

        if (initialLat && initialLng) {
            const pos = { lat: initialLat, lng: initialLng };
            setMarkerPos(pos);
            mapInstance.panTo(pos);
        }
    }, [initialLat, initialLng]);

    // Fetch Nearby Landmarks
    const fetchLandmarks = (pos: google.maps.LatLngLiteral) => {
        if (!placesServiceRef.current) return;

        const request = {
            location: pos,
            radius: 1000, // 1km radius
            type: 'point_of_interest'
        };

        placesServiceRef.current.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                const landmarks = results
                    .slice(0, 5) // Top 5
                    .map(place => place.name || "")
                    .filter(name => name.length > 0);
                setNearbyLandmarks(landmarks);
            }
        });
    };

    // Handle Geocoding (Lat/Lng -> Address)
    const reverseGeocode = (pos: google.maps.LatLngLiteral) => {
        if (!geocoderRef.current) return;
        setLoading(true);

        geocoderRef.current.geocode({ location: pos }, (results, status) => {
            setLoading(false);
            if (status === "OK" && results && results[0]) {
                const result = results[0];
                const newAddress = result.formatted_address;
                setAddress(newAddress);

                // Extract details
                let area = "";
                let pincode = "";

                result.address_components.forEach(comp => {
                    if (comp.types.includes("sublocality") || comp.types.includes("neighborhood")) {
                        area = comp.long_name;
                    }
                    if (comp.types.includes("postal_code")) {
                        pincode = comp.long_name;
                    }
                });

                // Validate Mangalore bounds (Rough check)
                const isMangalore = newAddress.toLowerCase().includes("mangalore") ||
                    newAddress.toLowerCase().includes("mangaluru") ||
                    newAddress.toLowerCase().includes("karnataka");

                if (!isMangalore) {
                    setError("Location appears to be outside Mangalore region");
                } else {
                    setError("");
                }

                // Update Parent
                onLocationSelect({
                    address: newAddress,
                    latitude: pos.lat,
                    longitude: pos.lng,
                    map_url: `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${pos.lat},${pos.lng}`,
                    area,
                    pincode,
                    landmarks: nearbyLandmarks
                });

                fetchLandmarks(pos);
            } else {
                setError("Unable to fetch address details");
            }
        });
    };

    // Handle Autocomplete Selection
    const onPlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place.geometry && place.geometry.location) {
                const pos = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                };
                setMarkerPos(pos);
                map?.panTo(pos);
                map?.setZoom(15);
                reverseGeocode(pos);
            }
        }
    };

    // Handle Marker Drag
    const onMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const pos = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
            };
            setMarkerPos(pos);
            reverseGeocode(pos);
        }
    };

    if (!isLoaded) return <div className="h-[400px] w-full bg-neutral-900 animate-pulse rounded-xl" />;

    return (
        <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
                <Autocomplete
                    onLoad={(autocomplete) => {
                        autocompleteRef.current = autocomplete;
                        // Restrict to Mangalore area roughly
                        autocomplete.setBounds(MANGALORE_BOUNDS);
                        autocomplete.setComponentRestrictions({ country: "in" });
                    }}
                    onPlaceChanged={onPlaceChanged}
                >
                    <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Search location (e.g. Kadri, Mangalore)..."
                            className={clsx(
                                "w-full bg-black/50 border rounded-xl p-4 pl-12 text-white text-lg outline-none transition-all",
                                error ? "border-red-500 focus:border-red-500" : "border-white/10 focus:border-blue-500"
                            )}
                        />
                        {loading && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <Loader2 className="animate-spin text-blue-500" size={20} />
                            </div>
                        )}
                    </div>
                </Autocomplete>
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                    <AlertTriangle size={16} />
                    {error}
                </div>
            )}

            {/* Map Container */}
            <div className="relative w-full h-[400px] rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    center={markerPos}
                    zoom={13}
                    onLoad={onMapLoad}
                    options={{
                        styles: [
                            {
                                elementType: "geometry",
                                stylers: [{ color: "#242f3e" }],
                            },
                            {
                                elementType: "labels.text.stroke",
                                stylers: [{ color: "#242f3e" }],
                            },
                            {
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#746855" }],
                            },
                            // ... more dark mode styles can be added
                        ],
                        disableDefaultUI: false,
                        streetViewControl: false,
                        mapTypeControl: false,
                    }}
                >
                    <Marker
                        position={markerPos}
                        draggable={true}
                        onDragEnd={onMarkerDragEnd}
                        animation={google.maps.Animation.DROP}
                    />
                </GoogleMap>

                {/* Overlay Controls */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none">
                    <div className="bg-black/80 backdrop-blur-md p-3 rounded-lg border border-white/10 pointer-events-auto max-w-[70%]">
                        <p className="text-xs text-gray-400 uppercase mb-1">Selected Location</p>
                        <p className="text-sm text-white font-medium truncate">{address || "No location selected"}</p>
                        <div className="flex gap-4 mt-2 text-xs text-gray-500">
                            <span>Lat: {markerPos.lat.toFixed(4)}</span>
                            <span>Lng: {markerPos.lng.toFixed(4)}</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setMarkerPos(MANGALORE_CENTER);
                            map?.panTo(MANGALORE_CENTER);
                            map?.setZoom(13);
                            reverseGeocode(MANGALORE_CENTER);
                        }}
                        className="bg-gold text-dark-bg p-3 rounded-full shadow-lg hover:scale-105 transition-transform pointer-events-auto"
                        title="Reset to Mangalore Center"
                    >
                        <Navigation size={20} />
                    </button>
                </div>
            </div>

            {/* Nearby Landmarks Suggestions */}
            {nearbyLandmarks.length > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-xs text-gray-400 uppercase mb-2 flex items-center gap-2">
                        <MapPin size={12} /> Nearby Landmarks Detected
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {nearbyLandmarks.map((landmark, i) => (
                            <span key={i} className="text-xs bg-white/10 text-white px-2 py-1 rounded-md border border-white/5">
                                {landmark}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
