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
    console.log("Fetching one project to check columns...");
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error fetching project:', error.message);
        return;
    }

    if (data && data.length > 0) {
        const p = data[0];
        console.log('Project keys:', Object.keys(p));
        console.log('Amenities type:', typeof p.amenities, Array.isArray(p.amenities) ? 'Array' : 'Not Array', p.amenities);
        console.log('Floor Plans type:', typeof p.floor_plans, Array.isArray(p.floor_plans) ? 'Array' : 'Not Array', p.floor_plans);
    } else {
        console.log('No projects found in the table.');
    }
}

checkColumns();
