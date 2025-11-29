import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables (Service Role Key required)');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
    console.log('🚀 Starting migration: Adding location columns...');

    // We'll use a raw SQL query via the RPC interface if available, 
    // or just try to update a dummy row to force schema update if Supabase allows (unlikely).
    // Since we don't have direct SQL access via client, we have to rely on the user running SQL in dashboard 
    // OR use the 'postgres' library if we had connection string.
    // BUT, we can use the 'rpc' method if we had a function.

    // WAIT! The user has been running SQL manually or via dashboard in previous steps.
    // I cannot run DDL (ALTER TABLE) via the JS client unless I have a specific RPC function for it.

    // ALTERNATIVE: I will provide the SQL to the user via notify_user and ask them to run it.
    // OR, I can try to use the 'pg' library if I have the connection string.
    // I don't have the connection string in env vars usually, just the URL/Key.

    // Let's check if I can use the 'pg' library.
    // The package.json has 'pg'.
    // But do I have the connection string?
    // Usually it's DATABASE_URL. Let's check .env.local via a script (safely).

    console.log('Checking for DATABASE_URL...');
    if (process.env.DATABASE_URL) {
        console.log('✅ DATABASE_URL found. Using pg to run migration.');
        const { Client } = require('pg');
        const client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        });

        try {
            await client.connect();
            await client.query(`
                ALTER TABLE projects 
                ADD COLUMN IF NOT EXISTS latitude FLOAT8,
                ADD COLUMN IF NOT EXISTS longitude FLOAT8,
                ADD COLUMN IF NOT EXISTS pincode TEXT,
                ADD COLUMN IF NOT EXISTS area TEXT,
                ADD COLUMN IF NOT EXISTS landmarks TEXT[];
            `);
            console.log('✅ Migration successful!');
        } catch (err) {
            console.error('❌ Migration failed:', err);
        } finally {
            await client.end();
        }
    } else {
        console.log('⚠️  DATABASE_URL not found. Cannot run DDL automatically.');
        console.log('Please run this SQL in your Supabase SQL Editor:');
        console.log(`
            ALTER TABLE projects 
            ADD COLUMN IF NOT EXISTS latitude FLOAT8,
            ADD COLUMN IF NOT EXISTS longitude FLOAT8,
            ADD COLUMN IF NOT EXISTS pincode TEXT,
            ADD COLUMN IF NOT EXISTS area TEXT,
            ADD COLUMN IF NOT EXISTS landmarks TEXT[];
        `);
    }
}

runMigration();
