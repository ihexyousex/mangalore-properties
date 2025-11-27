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
        const res = await fetch(
            `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${process.env.ORS_API_KEY}&start=${landmark.coords[0]},${landmark.coords[1]}&end=${lng},${lat}`
        );
        const data = await res.json();
        if (data.routes?.[0]) {
            const route = data.routes[0].summary;
            results.push({
                name: landmark.name,
                distance: Math.round(route.distance / 1000),        // km
                duration: Math.round(route.duration / 60),          // minutes
            });
        }
    }
    return results;
}
