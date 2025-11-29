import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifySchema() {
    console.log('🔍 Verifying projects table schema...');

    // Attempt to insert a row with all new fields to see if it's accepted
    const testSlug = `schema-test-${Date.now()}`;
    const { data, error } = await supabase
        .from('projects')
        .insert({
            name: 'Schema Test Project',
            slug: testSlug,
            builder: 'Land Trades', // Using string as per current schema
            location: 'Test Location',
            price: '1 Cr',
            status: 'New Launch',
            type: 'Residential',
            // New fields
            latitude: 12.9141,
            longitude: 74.8560,
            pincode: '575003',
            area: 'Kadri',
            landmarks: ['Temple', 'Park']
        })
        .select()
        .single();

    if (error) {
        console.error('❌ Schema verification failed:', error.message);
        console.log('The following columns might be missing: latitude, longitude, pincode, area, landmarks');
    } else {
        console.log('✅ Schema verification successful! New columns exist.');
        // Cleanup
        await supabase.from('projects').delete().eq('slug', testSlug);
        console.log('🧹 Cleanup done.');
    }
}

verifySchema();
