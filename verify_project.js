require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
    const { data, error } = await supabase
        .from('projects')
        .select('id, title, category, sub_category, builder_id')
        .eq('title', 'Luxury Rental Villa 2')
        .single();

    if (error) {
        console.error('Error fetching project:', error);
    } else {
        console.log('Project found:', data);
    }
}

run();
