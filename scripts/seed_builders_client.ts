
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Try to use Service Role Key first, fallback to Anon Key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedBuilders() {
    console.log('Seeding builders using key ending in...', supabaseKey?.slice(-5));

    const sampleBuilders = [
        { name: 'Prestige Group', slug: 'prestige-group' },
        { name: 'Brigade Group', slug: 'brigade-group' },
        { name: 'NorthernSky Properties', slug: 'northernsky-properties' },
        { name: 'Land Trades', slug: 'land-trades' }
    ];

    const { data, error } = await supabase.from('builders').insert(sampleBuilders).select();

    if (error) {
        console.error('Insert Error:', error.message);
    } else {
        console.log(`Success! Inserted ${data.length} builders.`);
    }
}

seedBuilders();
