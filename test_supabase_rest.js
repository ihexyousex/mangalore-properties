const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL or Key missing in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRest() {
    console.log('Testing Supabase REST API...');
    const { data, error } = await supabase.from('projects').select('count', { count: 'exact', head: true });

    if (error) {
        console.error('REST API Error:', error.message);
    } else {
        console.log('REST API Success! Project is active.');
    }
}

testRest();
