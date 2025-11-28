const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkColumns() {
    console.log('Checking projects table columns...');

    // We can't easily query information_schema via JS client without RPC
    // So we'll try to select these columns from a row
    const { data, error } = await supabase
        .from('projects')
        .select('latitude, longitude, pincode, area, landmarks')
        .limit(1);

    if (error) {
        console.log('❌ Error selecting columns:', error.message);
        if (error.message.includes('does not exist')) {
            console.log('⚠️  Some columns are missing!');
        }
    } else {
        console.log('✅ Columns exist! Data sample:', data);
    }
}

checkColumns();
