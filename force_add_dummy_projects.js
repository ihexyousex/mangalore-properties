const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('Missing DATABASE_URL');
    process.exit(1);
}

const client = new Client({
    connectionString: connectionString,
});

async function forceAddDummyProjects() {
    try {
        await client.connect();
        console.log('Connected to database.');

        const projects = [
            ['Test Project 1', 'Mangalore', '50 Lakhs', 'Upcoming', 'Apartment', 'Test Builder', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60'],
            ['Test Project 2', 'Udupi', '75 Lakhs', 'Ready to Move', 'Villa', 'Test Builder', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60'],
            ['Test Project 3', 'Manipal', '1 Cr', 'Ongoing', 'Commercial', 'Test Builder', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60']
        ];

        for (const p of projects) {
            const query = 'INSERT INTO projects (name, location, price, status, type, builder, image) VALUES ($1, $2, $3, $4, $5, $6, $7)';
            await client.query(query, p);
        }

        console.log(`Added ${projects.length} dummy projects.`);

    } catch (err) {
        console.error('Error adding dummy projects:', err);
    } finally {
        await client.end();
    }
}

forceAddDummyProjects();
