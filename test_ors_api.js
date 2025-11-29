require('dotenv').config({ path: '.env.local' });

async function testOpenRouteService() {
    console.log("\n🗺️  Testing OpenRouteService API...\n");

    if (!process.env.ORS_API_KEY) {
        console.error("❌ ORS_API_KEY not found in .env.local");
        process.exit(1);
    }

    // Test location: Kadri Park, Mangalore (approximate coordinates)
    const testLat = 12.8821;
    const testLng = 74.8475;

    const landmarks = [
        { name: "Mangalore International Airport", coords: [74.8892, 12.9613] },
        { name: "Forum Fiza Mall", coords: [74.8393, 12.8708] },
    ];

    console.log(`Testing from location: ${testLat}, ${testLng}\n`);

    try {
        for (const landmark of landmarks) {
            // Correct ORS API format: geojson response
            const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${process.env.ORS_API_KEY}&start=${landmark.coords[0]},${landmark.coords[1]}&end=${testLng},${testLat}`;

            console.log(`Fetching distance to ${landmark.name}...`);
            const res = await fetch(url);

            if (!res.ok) {
                const errorText = await res.text();
                console.log(`❌ HTTP Error ${res.status}: ${errorText.substring(0, 100)}`);
                continue;
            }

            const data = await res.json();

            // ORS returns geojson format with features array
            if (data.features && data.features[0] && data.features[0].properties) {
                const props = data.features[0].properties;
                const summary = props.summary;

                if (summary) {
                    const distance = Math.round(summary.distance / 1000); // km
                    const duration = Math.round(summary.duration / 60);   // minutes

                    console.log(`✅ ${landmark.name}: ${distance} km, ${duration} min`);
                } else {
                    console.log(`❌ No summary found in response`);
                }
            } else if (data.error) {
                console.log(`❌ API Error: ${JSON.stringify(data.error)}`);
            } else {
                console.log(`❌ Unexpected response structure`);
            }
        }
        console.log("\n✅ OpenRouteService API is fully working!\n");
    } catch (error) {
        console.error("\n❌ OpenRouteService API Error:", error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

testOpenRouteService();
