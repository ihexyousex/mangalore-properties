require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkSchema() {
    console.log("\n📊 Checking projects table schema...\n");

    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .limit(1);

    if (error) {
        console.error("Error:", error);
        process.exit(1);
    }

    if (data && data.length > 0) {
        console.log("Available columns:");
        Object.keys(data[0]).forEach(col => console.log(`  - ${col}`));
    } else {
        console.log("No data found, trying empty insert to see column error...");
        const { error: insertError } = await supabase
            .from('projects')
            .insert([{}]);

        if (insertError) {
            console.log("\nInsert error (shows required columns):");
            console.log(insertError);
        }
    }
}

checkSchema();
