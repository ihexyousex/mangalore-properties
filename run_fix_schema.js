const { Client } = require('pg');
const fs = require('fs');

const connectionString = "postgresql://postgres:postgres@localhost:54322/postgres";

const client = new Client({
    connectionString: connectionString,
});

async function run() {
    try {
        await client.connect();
        const sql = fs.readFileSync('fix_projects_schema.sql', 'utf8');
        console.log('Running SQL...');
        await client.query(sql);
        console.log('Migration successful');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
}

run();
