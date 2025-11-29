const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables');
    console.error('Need: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
    try {
        console.log('📦 Reading migration file...');
        const sqlPath = path.join(__dirname, 'add_category_column.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('🚀 Running migration...');
        console.log('SQL:', sql);

        // Split by semicolons and execute each statement
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s && !s.startsWith('--'));

        for (const statement of statements) {
            if (!statement) continue;

            console.log(`\n📝 Executing: ${statement.substring(0, 60)}...`);
            const { error } = await supabase.rpc('exec_sql', { sql: statement });

            if (error) {
                // If RPC doesn't exist, try direct SQL (this might not work with Supabase)
                console.warn('⚠️  RPC method not available, migration needs to be run manually');
                console.log('\n📋 Copy and paste this SQL into Supabase SQL Editor:');
                console.log('─'.repeat(60));
                console.log(sql);
                console.log('─'.repeat(60));
                return;
            }
        }

        console.log('\n✅ Migration completed successfully!');
        console.log('\n🔍 Verifying category column...');

        const { data, error } = await supabase
            .from('projects')
            .select('id, title, category')
            .limit(5);

        if (error) {
            console.error('❌ Verification failed:', error.message);
        } else {
            console.log('✅ Category column verified!');
            console.log('Sample data:', data);
        }

    } catch (err) {
        console.error('❌ Migration failed:', err.message);
        console.log('\n📋 Please run this SQL manually in Supabase Dashboard:');
        console.log('Go to: SQL Editor in your Supabase project');
        console.log('─'.repeat(60));
        const sqlPath = path.join(__dirname, 'add_category_column.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');
        console.log(sql);
        console.log('─'.repeat(60));
    }
}

runMigration();
