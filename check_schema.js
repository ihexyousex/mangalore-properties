const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
    // We can't directly query information_schema with supabase-js client easily unless we use rpc or just try to select the columns.
    // Instead, we'll try to insert a dummy row with all new columns and see if it fails, or just select them.

    const { data, error } = await supabase
        .from('projects')
        .select('total_units, project_size, launch_date, possession_date, rera_id, carpet_area, floor_number, total_floors, furnished_status, bathrooms, parking_count, maintenance_charges, security_deposit, preferred_tenants')
        .limit(1);

    if (error) {
        console.error('Error selecting new columns:', error.message);
    } else {
        console.log('Successfully selected new columns. Schema update verified.');
    }
}

checkColumns();
