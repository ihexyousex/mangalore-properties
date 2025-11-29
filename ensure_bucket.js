const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
    const { data, error } = await supabase.storage.getBucket('property-images');
    if (error) {
        console.log("❌ Bucket 'property-images' NOT found or error:", error.message);
        // Try creating it
        console.log("Attempting to create bucket...");
        const { data: newBucket, error: createError } = await supabase.storage.createBucket('property-images', {
            public: true
        });
        if (createError) console.log("❌ Failed to create bucket:", createError.message);
        else console.log("✅ Bucket 'property-images' CREATED.");
    } else {
        console.log("✅ Bucket 'property-images' EXISTS.");
    }
}
check();
