
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

const builders = [
    {
        name: 'Inland Builders',
        slug: 'inland-builders',
        description: 'Inland Builders is recognized as a leading real estate property developer in Mangalore, known for offering a range of commercial spaces, villas, flats, and residential apartments.',
        website: 'https://inlandbuilders.net',
        contact_email: 'info@inlandbuilders.net',
        year_est: 1986,
        logo_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=500&auto=format&fit=crop' // Placeholder
    },
    {
        name: 'Land Trades',
        slug: 'land-trades',
        description: 'Land Trades is a trusted name in Mangalore real estate, dedicated to quality and timely project delivery. Specializing in premium residential and commercial spaces.',
        website: 'https://landtrades.in',
        contact_email: 'sales@landtrades.in',
        year_est: 1992,
        logo_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=500&auto=format&fit=crop'
    },
    {
        name: 'Rohan Corporation',
        slug: 'rohan-corporation',
        description: 'With over 30 years of experience, Rohan Corporation is a leading developer known for its legacy of excellence, integrity, and cultural ethos.',
        website: 'https://rohancorporation.in',
        contact_email: 'info@rohancorporation.in',
        year_est: 1994,
        logo_url: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=80&w=500&auto=format&fit=crop'
    },
    {
        name: 'Mohtisham Complexes',
        slug: 'mohtisham-complexes',
        description: 'Shaping Mangaluru real estate since 1991, known for landmark projects and offering innovative and cost-efficient solutions.',
        website: 'https://mohtisham.com',
        contact_email: 'info@mohtisham.com',
        year_est: 1991,
        logo_url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=500&auto=format&fit=crop'
    },
    {
        name: 'Bhandary Builders',
        slug: 'bhandary-builders',
        description: 'Focuses on affordable urban housing, combining thoughtful craftsmanship with strategic locations.',
        website: 'https://bhandarybuilders.com',
        contact_email: 'sales@bhandarybuilders.com',
        year_est: 2003,
        logo_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=500&auto=format&fit=crop'
    },
    {
        name: 'Citadel Developers',
        slug: 'citadel-developers',
        description: 'Reputed real estate company aiming to promote and develop properties in and around Mangalore since 1996.',
        website: 'https://citadeldevelopers.com',
        contact_email: 'info@citadeldevelopers.com',
        year_est: 1996,
        logo_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=500&auto=format&fit=crop'
    },
    {
        name: 'Pranaam Builders',
        slug: 'pranaam-builders',
        description: 'Valuing premium quality, futuristic design, and modern engineering to transform local landscapes.',
        website: 'https://pranaambuilders.com',
        contact_email: 'sales@pranaambuilders.com',
        year_est: 2005,
        logo_url: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=500&auto=format&fit=crop'
    },
    {
        name: 'Marian Projects',
        slug: 'marian-projects',
        description: 'Leading real estate builder with a portfolio including residential, commercial spaces, and plots.',
        website: 'https://marian.in',
        contact_email: 'info@marian.in',
        year_est: 2008,
        logo_url: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61?q=80&w=500&auto=format&fit=crop'
    },
    {
        name: 'Connect Builders',
        slug: 'connect-builders',
        description: 'Recognized for luxury, style, and value. First in Mangalore to receive MUDA approval for all layouts.',
        website: 'https://connectdevelopers.com',
        contact_email: 'info@connectdevelopers.com',
        year_est: 2000,
        logo_url: 'https://images.unsplash.com/photo-1431576901776-e539bd916ba2?q=80&w=500&auto=format&fit=crop'
    },
    {
        name: 'Ace Developers',
        slug: 'ace-developers',
        description: 'Preeminent property development firm offering diverse services from custom homes to high-rises since 2005.',
        website: 'https://acedevelopers.in',
        contact_email: 'sales@acedevelopers.in',
        year_est: 2005,
        logo_url: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?q=80&w=500&auto=format&fit=crop'
    }
];

const projects = [
    // New Launch (5)
    {
        name: 'Prestige Palm Residences',
        builder: 'Prestige Group', // Using string as per current schema
        location: 'Deralakatte, Mangalore',
        type: 'villa',
        status: 'New Launch',
        price: '₹1.97 Cr - ₹3.5 Cr',
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1000',
        description: 'Luxury 3 & 4 BHK villas offering a blend of modern architecture and serene living.',
        amenities: ['Swimming Pool', 'Gym', 'Clubhouse', 'Garden', 'Security', 'Parking', 'Play Area', 'Badminton Court'],
        launch_date: '2024-01-15',
        rera_id: 'PR/190108/002286'
    },
    {
        name: 'Yamuna Sky City',
        builder: 'Yamuna Developers',
        location: 'Kulai, Mangalore',
        type: 'apartment',
        status: 'New Launch',
        price: '₹1.54 Cr - ₹2.56 Cr',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000',
        description: 'Premium 2 & 3 BHK apartments with sea view options.',
        amenities: ['Sea View', 'Infinity Pool', 'Gym', 'Sky Lounge', 'Security', 'Parking'],
        launch_date: '2025-12-01',
        rera_id: 'PR/230912/006789'
    },
    {
        name: 'Allegro Aventus',
        builder: 'Allegro Builders',
        location: 'Kodailbail, Mangalore',
        type: 'apartment',
        status: 'New Launch',
        price: '₹68 Lakhs - ₹72 Lakhs',
        image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=1000',
        description: 'Modern 2 BHK apartments in the heart of the city.',
        amenities: ['Lobby', 'Elevator', 'Power Backup', 'Security', 'Parking'],
        launch_date: '2024-03-01'
    },
    {
        name: 'Inland Buenos Aires',
        builder: 'Inland Builders',
        location: 'Bendoor, Mangalore',
        type: 'apartment',
        status: 'New Launch',
        price: '₹85 Lakhs Onwards',
        image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=1000',
        description: 'Ultra-luxury apartments with world-class amenities.',
        amenities: ['Pool', 'Gym', 'Spa', 'Concierge', 'Security', 'Parking'],
        launch_date: '2024-06-01'
    },
    {
        name: 'Northern Alexandria',
        builder: 'NorthernSky Properties',
        location: 'Hampankatta, Mangalore',
        type: 'apartment',
        status: 'New Launch',
        price: '₹1.2 Cr Onwards',
        image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1000',
        description: 'Premium residences near the city center.',
        amenities: ['Clubhouse', 'Gym', 'Garden', 'Security', 'Parking'],
        launch_date: '2024-02-15'
    },

    // Under Construction (5)
    {
        name: 'Prestige Valley Crest',
        builder: 'Prestige Group',
        location: 'Bejai, Mangalore',
        type: 'apartment',
        status: 'Under Construction',
        price: '₹45 Lakhs - ₹2.10 Cr',
        image: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?q=80&w=1000',
        description: 'Sprawling residential community with 1, 2, 3 & 4 BHK homes.',
        amenities: ['Pool', 'Gym', 'Badminton', 'Library', 'Mini Theatre'],
        completion_date: '2025-12-31'
    },
    {
        name: 'Landmark Green County',
        builder: 'Landmark Infratech',
        location: 'Bikarnakatte, Mangalore',
        type: 'apartment',
        status: 'Under Construction',
        price: '₹48 Lakhs Onwards',
        image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1000',
        description: 'Eco-friendly living spaces surrounded by greenery.',
        amenities: ['Garden', 'Jogging Track', 'Gym', 'Play Area'],
        completion_date: '2025-06-30'
    },
    {
        name: 'Marian Paradise Venture',
        builder: 'Marian Projects',
        location: 'Nanthoor, Mangalore',
        type: 'commercial',
        status: 'Under Construction',
        price: '₹1.5 Cr Onwards',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000',
        description: 'Premium commercial spaces for offices and retail.',
        amenities: ['Parking', 'Security', 'Power Backup', 'Elevator'],
        completion_date: '2025-09-30'
    },
    {
        name: 'Rohan City',
        builder: 'Rohan Corporation',
        location: 'Bejai, Mangalore',
        type: 'mixed',
        status: 'Under Construction',
        price: '₹60 Lakhs Onwards',
        image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1000',
        description: 'Integrated township with residential and commercial zones.',
        amenities: ['Mall', 'Multiplex', 'Pool', 'Gym', 'Clubhouse'],
        completion_date: '2026-03-31'
    },
    {
        name: 'Inland Ascott',
        builder: 'Inland Builders',
        location: 'Bondel, Mangalore',
        type: 'apartment',
        status: 'Under Construction',
        price: '₹75 Lakhs Onwards',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000',
        description: 'Luxury apartments near the airport road.',
        amenities: ['Pool', 'Gym', 'Garden', 'Security'],
        completion_date: '2025-08-15'
    },

    // Ready to Move (5)
    {
        name: 'Prestige Westholmes',
        builder: 'Prestige Group',
        location: 'Kenjar, Mangalore',
        type: 'apartment',
        status: 'Ready to Move',
        price: '₹1.43 Cr Onwards',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000',
        description: 'Ready to move in 3 BHK luxury apartments.',
        amenities: ['Pool', 'Gym', 'Clubhouse', 'Play Area'],
        completion_date: '2023-01-01'
    },
    {
        name: 'RedBricks Palm Hills',
        builder: 'RedBricks',
        location: 'Kulashekara, Mangalore',
        type: 'apartment',
        status: 'Ready to Move',
        price: '₹30 Lakhs - ₹61 Lakhs',
        image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1000',
        description: 'Affordable luxury homes in a serene location.',
        amenities: ['Garden', 'Parking', 'Security'],
        completion_date: '2023-06-01'
    },
    {
        name: 'Citadel Amethyst',
        builder: 'Citadel Developers',
        location: 'Baghambila, Mangalore',
        type: 'apartment',
        status: 'Ready to Move',
        price: '₹40 Lakhs Onwards',
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000',
        description: 'Compact and comfortable homes for modern families.',
        amenities: ['Parking', 'Lift', 'Power Backup'],
        completion_date: '2022-12-01'
    },
    {
        name: 'Mohtisham Canopy',
        builder: 'Mohtisham Complexes',
        location: 'Urwa Store, Mangalore',
        type: 'apartment',
        status: 'Ready to Move',
        price: '₹65 Lakhs Onwards',
        image: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=1000',
        description: 'Premium apartments with excellent connectivity.',
        amenities: ['Gym', 'Party Hall', 'Indoor Games'],
        completion_date: '2023-03-15'
    },
    {
        name: 'Bhandary Heights',
        builder: 'Bhandary Builders',
        location: 'Kottara Chowki, Mangalore',
        type: 'apartment',
        status: 'Ready to Move',
        price: '₹80 Lakhs Onwards',
        image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1000',
        description: 'High-rise living with panoramic city views.',
        amenities: ['Infinity Pool', 'Sky Garden', 'Gym'],
        completion_date: '2023-05-01'
    },

    // Rental (3)
    {
        name: 'Luxury Villa for Rent',
        builder: 'Individual',
        location: 'Kadri, Mangalore',
        type: 'villa',
        status: 'For Rent',
        price: '₹45,000 / month',
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000',
        description: 'Spacious 4 BHK villa with private garden.',
        amenities: ['Garden', 'Parking', 'Semi-furnished']
    },
    {
        name: '2 BHK Apartment Rental',
        builder: 'Individual',
        location: 'Bejai, Mangalore',
        type: 'apartment',
        status: 'For Rent',
        price: '₹22,000 / month',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000',
        description: 'Modern 2 BHK flat near Bejai market.',
        amenities: ['Parking', 'Lift', 'Security']
    },
    {
        name: 'Commercial Office Space',
        builder: 'Individual',
        location: 'MG Road, Mangalore',
        type: 'commercial',
        status: 'For Rent',
        price: '₹60,000 / month',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000',
        description: '1200 sqft furnished office space.',
        amenities: ['AC', 'Power Backup', 'Parking']
    },

    // Land Plots (3)
    {
        name: 'Premium Residential Plot',
        builder: 'Individual',
        location: 'Surathkal, Mangalore',
        type: 'plot',
        status: 'For Sale',
        price: '₹25 Lakhs',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000',
        description: '5 cents residential land near NITK.',
        amenities: ['Road Access', 'Water Connection', 'Electricity']
    },
    {
        name: 'Hilltop Land',
        builder: 'Individual',
        location: 'Shakti Nagar, Mangalore',
        type: 'plot',
        status: 'For Sale',
        price: '₹40 Lakhs',
        image: 'https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?q=80&w=1000',
        description: 'Scenic plot with city view.',
        amenities: ['View', 'Road Access']
    },
    {
        name: 'Commercial Plot',
        builder: 'Individual',
        location: 'Baikampady, Mangalore',
        type: 'plot',
        status: 'For Sale',
        price: '₹1.5 Cr',
        image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=1000',
        description: 'Industrial/Commercial land in industrial area.',
        amenities: ['Industrial Zone', 'Wide Road']
    }
];

async function seed() {
    console.log('Starting seed process...');

    // 1. Seed Builders
    console.log('Seeding builders...');
    for (const builder of builders) {
        const { error } = await supabase
            .from('builders')
            .upsert(builder, { onConflict: 'slug' });

        if (error) console.error(`Error upserting builder ${builder.name}:`, error.message);
        else console.log(`Upserted builder: ${builder.name}`);
    }

    // 2. Seed Projects
    console.log('Seeding projects...');
    for (const project of projects) {
        // Generate a slug
        const slug = project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        const projectData = {
            ...project,
            slug,
            featured: Math.random() > 0.7 // Randomly feature some
        };

        // Check if exists to avoid duplicates if running multiple times (based on slug)
        const { data: existing } = await supabase.from('projects').select('id').eq('slug', slug).single();

        if (existing) {
            console.log(`Project ${project.name} already exists. Skipping...`);
            // Optional: Update if needed
            // await supabase.from('projects').update(projectData).eq('id', existing.id);
        } else {
            const { error } = await supabase.from('projects').insert(projectData);
            if (error) console.error(`Error inserting project ${project.name}:`, error.message);
            else console.log(`Inserted project: ${project.name}`);
        }
    }

    console.log('Seed process completed!');
}

seed();
