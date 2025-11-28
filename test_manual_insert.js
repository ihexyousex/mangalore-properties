require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testInsert() {
    console.log("\n🧪 Testing manual property insert with correct schema...\n");

    const testProperty = {
        name: "Skyline Residency Test CLI",
        builder: null,
        location: "Kadri, Mangalore",
        price: "75 Lakhs",
        status: "Under Construction",
        type: "Residential",
        image: "https://ik.imagekit.io/dydioygv9/default-property.jpg",
        description: "Test property inserted via CLI",
        amenities: ["Swimming Pool", "Gym", "Parking"]
    };

    console.log("Attempting to insert:", testProperty);

    const { data, error } = await supabase
        .from('projects')
        .insert([testProperty])
        .select();

    if (error) {
        console.error("\n❌ Insert failed!");
        console.error("Error:", error);
        process.exit(1);
    }

    console.log("\n✅ Insert successful!");
    console.log("New property ID:", data[0].id);
    console.log("\n🎉 Property created successfully! Check homepage at http://localhost:3000/\n");
}

testInsert();
