require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .limit(5);

    if (error) {
        console.error('Error fetching projects:', error);
    } else {
        console.log('Projects found:', data.length);
        data.forEach(p => console.log(`- ${p.title} (${p.category})`));
    }
}

run();
