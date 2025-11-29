export async function getDistancesFromLandmarks(lat: number, lng: number) {
    const landmarks = [
        { name: "Mangalore International Airport", coords: [74.8892, 12.9613] },
        { name: "Forum Fiza Mall", coords: [74.8393, 12.8708] },
        { name: "Ladyhill", coords: [74.8475, 12.8821] },
        { name: "KSRTC Bus Stand", coords: [74.8421, 12.8699] },
        { name: "Pumpwell Circle", coords: [74.8467, 12.8533] },
    ];

    const results = [];

    for (const landmark of landmarks) {
        try {
            const res = await fetch(
                `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${process.env.ORS_API_KEY}&start=${landmark.coords[0]},${landmark.coords[1]}&end=${lng},${lat}`
            );

            if (!res.ok) continue;

            const data = await res.json();

            // ORS returns geojson format with features array
            if (data.features?.[0]?.properties?.summary) {
                const summary = data.features[0].properties.summary;
                results.push({
                    name: landmark.name,
                    distance: Math.round(summary.distance / 1000),        // km
                    duration: Math.round(summary.duration / 60),          // minutes
                });
            }
        } catch (error) {
            console.error(`Error fetching distance for ${landmark.name}:`, error);
            // Continue to next landmark on error
        }
    }
    return results;
}
