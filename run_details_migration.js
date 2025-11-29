const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Local Supabase connection string
const connectionString = "postgresql://postgres:postgres@localhost:54322/postgres";

const client = new Client({
    connectionString: connectionString,
});

async function runMigration() {
    try {
        await client.connect();
        const sqlPath = path.join(__dirname, 'add_property_details.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');
        console.log('Running SQL from:', sqlPath);
        await client.query(sql);
        console.log('Migration successful');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
}

runMigration();
