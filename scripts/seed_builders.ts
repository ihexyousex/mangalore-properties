
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndSeedBuilders() {
    console.log('Checking builders table...');

    const { data: existingBuilders, error: fetchError } = await supabase
        .from('builders')
        .select('*');

    if (fetchError) {
        console.error('Error fetching builders:', fetchError);
        return;
    }

    console.log(`Found ${existingBuilders?.length || 0} builders.`);

    if (!existingBuilders || existingBuilders.length === 0) {
        console.log('Seeding sample builders...');
        const sampleBuilders = [
            { name: 'Prestige Group', contact_email: 'contact@prestige.com' },
            { name: 'Brigade Group', contact_email: 'sales@brigade.com' },
            { name: 'NorthernSky Properties', contact_email: 'info@northernsky.com' },
            { name: 'Land Trades', contact_email: 'sales@landtrades.in' }
        ];

        const { data: inserted, error: insertError } = await supabase
            .from('builders')
            .insert(sampleBuilders)
            .select();

        if (insertError) {
            console.error('Error inserting builders:', insertError);
        } else {
            console.log('Successfully inserted builders:', inserted);
        }
    } else {
        console.log('Builders already exist:', existingBuilders);
    }
}

checkAndSeedBuilders();
