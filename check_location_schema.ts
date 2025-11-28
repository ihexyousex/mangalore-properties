import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log('Checking projects table schema...');

    // We can check by selecting a single row and seeing what keys come back, 
    // or by trying to insert a dummy row with the new keys and seeing if it errors (transaction rollback).
    // Better yet, let's just inspect the error message from a select with the specific columns.

    const { data, error } = await supabase
        .from('projects')
        .select('latitude, longitude, pincode, area, landmarks')
        .limit(1);

    if (error) {
        console.error('❌ Schema check failed:', error.message);
        if (error.message.includes('does not exist')) {
            console.log('⚠️  Columns are missing. Migration needed.');
        }
    } else {
        console.log('✅ Columns exist!');
    }
}

checkSchema();
