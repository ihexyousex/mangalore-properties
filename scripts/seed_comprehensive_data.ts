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

// Real builders from research
const builders = [
    {
        name: 'Land Trades',
        slug: 'land-trades',
        description: 'CRISIL DA2 rated builder with 34+ years of excellence in real estate development. Known for quality construction, timely delivery, and diverse portfolio of residential and commercial projects.',
        website: 'https://landtrades.in',
        contact_email: 'sales@landtrades.in',
        phone: '+91-824-4273555',
        year_est: 1990,
        address: 'Inland Empire, Opp. Aloysius PU College, Mangalore - 575003',
        logo_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=400&auto=format&fit=crop', // Placeholder
        total_projects: 15,
        established_year: 1990
    },
    {
        name: 'Inland Builders',
        slug: 'inland-builders',
        description: 'Leading real estate developer in Mangalore offering premium commercial spaces, luxury villas, and residential apartments with world-class amenities and modern architecture.',
        website: 'https://inlandbuilders.net',
        contact_email: 'info@inlandbuilders.net',
        phone: '+91-824-2444555',
        year_est: 1986,
        address: 'Inland House, Kodialbail, Mangalore - 575003',
        logo_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&auto=format&fit=crop',
        total_projects: 20,
        established_year: 1986
    },
    {
        name: 'Pranaam Builders',
        slug: 'pranaam-builders',
        description: 'Premium quality builder focused on futuristic design, modern engineering, and ultra-global lifestyle spaces. Known for transparency and customer relationships.',
        website: 'https://pranaambuilders.com',
        contact_email: 'sales@pranaambuilders.com',
        phone: '+91-824-2980000',
        year_est: 2005,
        address: 'Pranaam Towers, Mangalore',
        logo_url: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=80&w=400&auto=format&fit=crop',
        total_projects: 8,
        established_year: 2005
    },
    {
        name: 'Rohan Corporation',
        slug: 'rohan-corporation',
        description: 'Legacy of excellence spanning 30+ years. Diverse portfolio across residential, commercial, and hospitality sectors with emphasis on sustainable practices and integrity.',
        website: 'https://rohancorporation.in',
        contact_email: 'info@rohancorporation.in',
        phone: '+91-824-2425000',
        year_est: 1994,
        address: 'Rohan Towers, Bejai, Mangalore',
        logo_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=400&auto=format&fit=crop',
        total_projects: 25,
        established_year: 1994
    },
    {
        name: 'Mohtisham Complexes',
        slug: 'mohtisham-complexes',
        description: 'Shaping Mangaluru\'s skyline since 1991. Portfolio ranges from super luxury to affordable housing including residential, commercial, and hospitality developments.',
        website: 'https://mohtisham.com',
        contact_email: 'info@mohtisham.com',
        phone: '+91-824-2492000',
        year_est: 1991,
        address: 'Mohtisham Complex, Urwa Store, Mangalore',
        logo_url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=400&auto=format&fit=crop',
        total_projects: 30,
        established_year: 1991
    },
    {
        name: 'Citadel Developers',
        slug: 'citadel-developers',
        description: 'Established 1996, promoting well-designed, aesthetically built, and affordable dwelling units with innovation and dedication.',
        website: 'https://citadeldevelopers.com',
        contact_email: 'info@citadeldevelopers.com',
        phone: '+91-824-2211000',
        year_est: 1996,
        address: 'Citadel Plaza, Mangalore',
        logo_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400&auto=format&fit=crop',
        total_projects: 12,
        established_year: 1996
    },
    {
        name: 'Bhandary Builders',
        slug: 'bhandary-builders',
        description: 'Focus on affordable urban housing with thoughtful craftsmanship and strategic locations. Solid reputation for quality and customer satisfaction since 2003.',
        website: 'https://bhandarybuilders.com',
        contact_email: 'sales@bhandarybuilders.com',
        phone: '+91-824-2455000',
        year_est: 2003,
        address: 'Bhandary Complex, Kottara, Mangalore',
        logo_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400&auto=format&fit=crop',
        total_projects: 10,
        established_year: 2003
    },
    {
        name: 'Marian Projects',
        slug: 'marian-projects',
        description: 'Leading builder with portfolio including residential, commercial spaces, and plots. Committed to quality homes for all segments with meticulous planning.',
        website: 'https://marian.in',
        contact_email: 'info@marian.in',
        phone: '+91-824-2220000',
        year_est: 2008,
        address: 'Marian Complex, Nanthoor, Mangalore',
        logo_url: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61?q=80&w=400&auto=format&fit=crop',
        total_projects: 8,
        established_year: 2008
    },
    {
        name: 'Connect Builders',
        slug: 'connect-builders',
        description: 'Recognized for luxury, style, and value. First in Mangalore to receive MUDA approval for all layouts. Premium eco-friendly developments.',
        website: 'https://connectdevelopers.com',
        contact_email: 'info@connectdevelopers.com',
        phone: '+91-824-2250000',
        year_est: 2000,
        address: 'Connect Plaza, Mangalore',
        logo_url: 'https://images.unsplash.com/photo-1431576901776-e539bd916ba2?q=80&w=400&auto=format&fit=crop',
        total_projects: 15,
        established_year: 2000
    },
    {
        name: 'Ace Developers',
        slug: 'ace-developers',
        description: 'Preeminent property development firm offering diverse services from custom homes to high-rises. Client-focused with innovative building methods.',
        website: 'https://acedevelopers.in',
        contact_email: 'sales@acedevelopers.in',
        phone: '+91-824-2260000',
        year_est: 2005,
        address: 'Ace Towers, Mangalore',
        logo_url: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?q=80&w=400&auto=format&fit=crop',
        total_projects: 12,
        established_year: 2005
    }
];

// Comprehensive property data
const projects = [
    // NEW LAUNCH (5 properties)
    {
        name: 'Krishna Kuteera',
        builder: 'Land Trades',
        location: 'Valencia, Mangalore',
        type: 'apartment',
        status: 'New Launch',
        price: '₹75 Lakhs - ₹1.2 Cr',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000',
        description: 'Premium 3 & 4 BHK apartments in the heart of Valencia with modern amenities and strategic location near IT hubs and educational institutions.',
        bedrooms: '3, 4 BHK',
        amenities: ['Swimming Pool', 'Gymnasium', 'Clubhouse', 'Children Play Area', 'Indoor Games', 'Landscaped Gardens', '24/7 Security', 'Power Backup', 'Rain Water Harvesting', 'Covered Parking'],
        launch_date: '2024-01-15',
        rera_id: 'PR/KA/RERA/1251/309/PR/200224/005678',
        area_sqft_min: 1450,
        area_sqft_max: 2100
    },
    {
        name: 'Pranaam Mythri Garden',
        builder: 'Pranaam Builders',
        location: 'Urwa, Mangalore',
        type: 'apartment',
        status: 'New Launch',
        price: '₹65 Lakhs - ₹95 Lakhs',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000',
        description: 'Contemporary living spaces designed for modern families. Strategic location with excellent connectivity to major landmarks and premium amenities.',
        bedrooms: '2, 3 BHK',
        amenities: ['Clubhouse', 'Gymnasium', 'Yoga Deck', 'Kids Play Zone', 'Multipurpose Hall', 'Security', 'Lift', 'Power Backup', 'Visitor Parking', 'Intercom'],
        launch_date: '2024-03-01',
        rera_id: 'PR/KA/RERA/1251/309/PR/200324/006123',
        area_sqft_min: 1100,
        area_sqft_max: 1650
    },
    {
        name: 'Inland Buenos Aires',
        builder: 'Inland Builders',
        location: 'Lobo Lane, Bendoor',
        type: 'apartment',
        status: 'New Launch',
        price: '₹85 Lakhs - ₹1.35 Cr',
        image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=1000',
        description: 'Ultra-luxury apartments with world-class specifications. Premium finishes, smart home features, and resort-style amenities.',
        bedrooms: '2, 3 BHK',
        amenities: ['Infinity Pool', 'Spa & Gym', 'Concierge Service', 'Smart Home', 'Home Theatre', 'Sports Court', 'Landscaped Terrace', 'EV Charging', 'Fire Safety', 'CCTV'],
        launch_date: '2024-06-15',
        rera_id: 'PR/KA/RERA/1251/309/PR/200624/007891',
        area_sqft_min: 1250,
        area_sqft_max: 1980
    },
    {
        name: 'Mahalaxmi Residency',
        builder: 'Land Trades',
        location: 'Kadri, Mangalore',
        type: 'apartment',
        status: 'New Launch',
        price: '₹60 Lakhs - ₹90 Lakhs',
        image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=1000',
        description: 'Affordable luxury living near Kadri Temple. Well-ventilated homes with modern kitchen and premium fittings.',
        bedrooms: '2, 3 BHK',
        amenities: ['Community Hall', 'Children Park', 'Jogging Track', 'Gym', 'Security', 'Lift', 'Generator', 'Water Softener', 'Parking', 'Garden'],
        launch_date: '2024-02-20',
        rera_id: 'PR/KA/RERA/1251/309/PR/200224/005432',
        area_sqft_min: 980,
        area_sqft_max: 1420
    },
    {
        name: 'Rohan Skyline',
        builder: 'Rohan Corporation',
        location: 'Bejai, Mangalore',
        type: 'apartment',
        status: 'New Launch',
        price: '₹70 Lakhs - ₹1.1 Cr',
        image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1000',
        description: 'High-rise living with stunning city views. Premium location with proximity to schools, hospitals, and shopping centers.',
        bedrooms: '2, 3, 4 BHK',
        amenities: ['Sky Lounge', 'Swimming Pool', 'Fitness Center', 'Indoor Games', 'Mini Theatre', 'Clubhouse', 'Security', 'Lifts', 'Power Backup', 'Parking'],
        launch_date: '2024-04-10',
        rera_id: 'PR/KA/RERA/1251/309/PR/200424/006789',
        area_sqft_min: 1150,
        area_sqft_max: 2200
    },

    // UNDER CONSTRUCTION (5 properties)
    {
        name: 'Inland Ascott',
        builder: 'Inland Builders',
        location: 'Near Bondel Church, Airport Road',
        type: 'apartment',
        status: 'Under Construction',
        price: '₹90 Lakhs - ₹1.5 Cr',
        image: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?q=80&w=1000',
        description: 'Spacious luxury apartments near airport. Modern architecture with excellent ventilation and natural light.',
        bedrooms: '2, 3, 4 BHK',
        amenities: ['Pool', 'Gym', 'Clubhouse', 'Garden', 'Play Area', 'Security', 'Elevator', 'Parking', 'Power Backup', 'Water Supply'],
        completion_date: '2025-08-31',
        completion_percentage: 65,
        area_sqft_min: 1350,
        area_sqft_max: 2450
    },
    {
        name: 'BMK Sky Villa',
        builder: 'Land Trades',
        location: 'Kankanady, Mangalore',
        type: 'villa',
        status: 'Under Construction',
        price: '₹2.5 Cr - ₹3.8 Cr',
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1000',
        description: 'Exclusive 4 BHK luxury villas with private terrace and garden. Premium gated community with world-class amenities.',
        bedrooms: '4 BHK',
        amenities: ['Private Pool', 'Home Automation', 'Landscaped Garden', 'Terrace Garden', 'Clubhouse', 'Security', 'Power Backup', 'Parking', 'Gym', 'Sports Court'],
        completion_date: '2025-12-31',
        completion_percentage: 45,
        area_sqft_min: 3200,
        area_sqft_max: 4100
    },
    {
        name: 'Inland Elora',
        builder: 'Inland Builders',
        location: 'Matadakani Road, Mannagudda',
        type: 'apartment',
        status: 'Under Construction',
        price: '₹68 Lakhs - ₹98 Lakhs',
        image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1000',
        description: 'Contemporary apartments in prime Mannagudda location. Easy access to schools, hospitals, and commercial centers.',
        bedrooms: '2, 3 BHK',
        amenities: ['Gymnasium', 'Children Play Area', 'Multipurpose Hall', 'Landscape Garden', 'Security', 'Lift', 'Parking', 'Power Backup', 'Water Harvesting', 'Intercom'],
        completion_date: '2025-10-15',
        completion_percentage: 55,
        area_sqft_min: 1050,
        area_sqft_max: 1580
    },
    {
        name: 'Pristine Heights',
        builder: 'Land Trades',
        location: 'Derebail, Mangalore',
        type: 'apartment',
        status: 'Under Construction',
        price: '₹72 Lakhs - ₹1.15 Cr',
        image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1000',
        description: 'Premium 3 & 4 BHK apartments with spacious balconies and modern amenities. Excellent ventilation and natural lighting.',
        bedrooms: '3, 4 BHK',
        amenities: ['Swimming Pool', 'Gym', 'Clubhouse', 'Indoor Games', 'Party Hall', 'Garden', 'Security', 'Lifts', 'Generator', 'Parking'],
        completion_date: '2025-09-30',
        completion_percentage: 60,
        area_sqft_min: 1420,
        area_sqft_max: 2050
    },
    {
        name: 'Mohtisham Heights',
        builder: 'Mohtisham Complexes',
        location: 'Urwa Store, Mangalore',
        type: 'apartment',
        status: 'Under Construction',
        price: '₹78 Lakhs - ₹1.25 Cr',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000',
        description: 'High-rise residential tower in the heart of the city. Premium specifications with modern amenities.',
        bedrooms: '2, 3, 4 BHK',
        amenities: ['Gym', 'Party Hall', 'Indoor Games', 'Children Park', 'Security', 'Lifts', 'Power Backup', 'Parking', 'Intercom', 'Water Supply'],
        completion_date: '2026-01-31',
        completion_percentage: 40,
        area_sqft_min: 1180,
        area_sqft_max: 2100
    },

    // READY TO MOVE (5 properties)
    {
        name: 'Laxmi Govind Apartments',
        builder: 'Land Trades',
        location: 'Valencia, Mangalore',
        type: 'apartment',
        status: 'Ready to Move',
        price: '₹55 Lakhs - ₹82 Lakhs',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000',
        description: 'Ready to occupy 2 & 3 BHK apartments in prime Valencia location. Immediate possession available.',
        bedrooms: '2, 3 BHK',
        amenities: ['Clubhouse', 'Garden', 'Children Play Area', 'Security', 'Lift', 'Parking', 'Power Backup', 'Water Supply', 'Intercom', 'Waste Management'],
        completion_date: '2023-12-01',
        area_sqft_min: 950,
        area_sqft_max: 1380
    },
    {
        name: 'Citadel Amethyst',
        builder: 'Citadel Developers',
        location: 'Baghambila, Mangalore',
        type: 'apartment',
        status: 'Ready to Move',
        price: '₹48 Lakhs - ₹72 Lakhs',
        image: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=1000',
        description: 'Compact and comfortable homes perfect for modern families. Good connectivity and peaceful neighborhood.',
        bedrooms: '2, 3 BHK',
        amenities: ['Parking', 'Lift', 'Power Backup', 'Security', 'Water Supply', 'Garden', 'Intercom', 'Fire Safety', 'Waste Disposal', 'Rain Water Harvesting'],
        completion_date: '2023-08-15',
        area_sqft_min: 880,
        area_sqft_max: 1250
    },
    {
        name: 'Bhandary Heights',
        builder: 'Bhandary Builders',
        location: 'Kottara Chowki, Mangalore',
        type: 'apartment',
        status: 'Ready to Move',
        price: '₹92 Lakhs - ₹1.4 Cr',
        image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1000',
        description: 'High-rise panoramic city views. Premium finishes with modern amenities. Ready for immediate possession.',
        bedrooms: '3, 4 BHK',
        amenities: ['Infinity Pool', 'Sky Garden', 'Gym', 'Clubhouse', 'Security', 'Lifts', 'Parking', 'Power Backup', 'Smart Features', 'EV Charging'],
        completion_date: '2023-06-30',
        area_sqft_min: 1520,
        area_sqft_max: 2350
    },
    {
        name: 'Connect Elite',
        builder: 'Connect Builders',
        location: 'Kankanady, Mangalore',
        type: 'apartment',
        status: 'Ready to Move',
        price: '₹85 Lakhs - ₹1.3 Cr',
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000',
        description: 'Premium eco-friendly apartments with MUDA approved layout. Immediate possession with all amenities functional.',
        bedrooms: '3, 4 BHK',
        amenities: ['Solar Power', 'Rain Harvesting', 'Gym', 'Garden', 'Play Area', 'Security', 'Lifts', 'Parking', 'Clubhouse', 'Swimming Pool'],
        completion_date: '2023-10-20',
        area_sqft_min: 1450,
        area_sqft_max: 2180
    },
    {
        name: 'Ace Residency',
        builder: 'Ace Developers',
        location: 'Bejai, Mangalore',
        type: 'apartment',
        status: 'Ready to Move',
        price: '₹68 Lakhs - ₹1.05 Cr',
        image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1000',
        description: 'Well-designed apartments in the heart of Bejai. Ready to move with bank approvals and OC.',
        bedrooms: '2, 3, 4 BHK',
        amenities: ['Gym', 'Children Park', 'Community Hall', 'Security', 'Lifts', 'Parking', 'Power Backup', 'Intercom', 'Garden', 'Water Supply'],
        completion_date: '2023-09-15',
        area_sqft_min: 1100,
        area_sqft_max: 1950
    },

    // RENTAL PROPERTIES (3 properties)
    {
        name: 'Luxury Villa - Kadri',
        builder: 'Individual',
        location: 'Kadri Hills, Mangalore',
        type: 'villa',
        status: 'For Rent',
        price: '₹45,000/month',
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000',
        description: 'Spacious 4 BHK independent villa with private garden and parking. Semi-furnished with modular kitchen.',
        bedrooms: '4 BHK',
        amenities: ['Private Garden', 'Covered Parking', 'Modular Kitchen', 'Security', 'Power Backup', 'Water Supply', 'Semi-Furnished', 'Balcony'],
        area_sqft_min: 2800,
        area_sqft_max: 2800
    },
    {
        name: 'Premium Apartment - Bejai',
        builder: 'Individual',
        location: 'Bejai Main Road, Mangalore',
        type: 'apartment',
        status: 'For Rent',
        price: '₹22,000/month',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000',
        description: 'Well-maintained 2 BHK apartment near market. Good connectivity and peaceful locality.',
        bedrooms: '2 BHK',
        amenities: ['Parking', 'Lift', 'Security', 'Power Backup', 'Water Supply', 'Unfurnished', 'Balcony', 'Intercom'],
        area_sqft_min: 1050,
        area_sqft_max: 1050
    },
    {
        name: 'Commercial Office Space - MG Road',
        builder: 'Individual',
        location: 'MG Road, Mangalore',
        type: 'commercial',
        status: 'For Rent',
        price: '₹60,000/month',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000',
        description: '1200 sqft fully furnished office space in prime commercial location. Ready to occupy.',
        bedrooms: 'Office Space',
        amenities: ['AC', 'Power Backup', 'Parking', 'Security', 'Lift', 'Restrooms', 'Pantry', 'Broadband Ready'],
        area_sqft_min: 1200,
        area_sqft_max: 1200
    },

    // RESALE PROPERTIES (3 properties)
    {
        name: 'Independent House - Urwa',
        builder: 'Individual',
        location: 'Urwa Store, Mangalore',
        type: 'villa',
        status: 'For Sale',
        price: '₹1.8 Cr',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000',
        description: 'Spacious 3 BHK independent house with parking. Prime location with good resale value.',
        bedrooms: '3 BHK',
        amenities: ['Covered Parking', 'Garden Space', 'Bore Well', 'Security', 'Road Facing', 'Well Maintained'],
        area_sqft_min: 2200,
        area_sqft_max: 2200
    },
    {
        name: 'Apartment Resale - Kankanady',
        builder: 'Individual',
        location: 'Kankanady, Mangalore',
        type: 'apartment',
        status: 'For Sale',
        price: '₹62 Lakhs',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1000',
        description: '2 BHK apartment in established society. Good condition with bank loan available.',
        bedrooms: '2 BHK',
        amenities: ['Parking', 'Lift', 'Security', 'Power Backup', 'Society Maintenance', 'Children Park'],
        area_sqft_min: 1100,
        area_sqft_max: 1100
    },
    {
        name: 'Villa Resale - Mangaladevi',
        builder: 'Individual',
        location: 'Mangaladevi, Mangalore',
        type: 'villa',
        status: 'For Sale',
        price: '₹2.2 Cr',
        image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1000',
        description: 'Premium 4 BHK villa in prime locality. Well maintained with modern amenities.',
        bedrooms: '4 BHK',
        amenities: ['Parking', 'Garden', 'Security', 'Bore Well', 'Solar Water Heater', 'Modular Kitchen'],
        area_sqft_min: 3000,
        area_sqft_max: 3000
    },

    // COMMERCIAL PROPERTIES (3 properties)
    {
        name: 'Land Trades Synergy',
        builder: 'Land Trades',
        location: 'Balmatta Road, Mangalore',
        type: 'commercial',
        status: 'Ready to Move',
        price: '₹1.5 Cr - ₹2.8 Cr',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000',
        description: 'G+4 commercial building with retail and office spaces. Prime location with high footfall.',
        bedrooms: 'Commercial',
        amenities: ['Elevators', 'Parking', 'Power Backup', 'Security', 'Fire Safety', 'Cafeteria', 'Water Supply', 'Waste Management'],
        area_sqft_min: 800,
        area_sqft_max: 1500
    },
    {
        name: 'Marian Office Complex',
        builder: 'Marian Projects',
        location: 'Nanthoor Junction, Mangalore',
        type: 'commercial',
        status: 'Ready to Move',
        price: '₹1.2 Cr - ₹2.5 Cr',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000',
        description: 'Modern office complex near city center. Ideal for corporate offices and medical centers.',
        bedrooms: 'Commercial',
        amenities: ['Central AC', 'Elevators', 'Parking', 'Security', 'Power Backup', 'Broadband', 'Water Supply', 'Generator'],
        area_sqft_min: 1000,
        area_sqft_max: 2000
    },
    {
        name: 'Land Trades Vikram',
        builder: 'Land Trades',
        location: 'Hampankatta, Mangalore',
        type: 'commercial',
        status: 'Ready to Move',
        price: '₹1.8 Cr - ₹3.2 Cr',
        image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1000',
        description: 'G+4 premium commercial complex in heart of the city. High rental yield potential.',
        bedrooms: 'Commercial',
        amenities: ['Lifts', 'Basement Parking', 'Security', 'Fire Safety', 'Power Backup', 'Water Supply', 'Modern Facade', 'Retail Ground Floor'],
        area_sqft_min: 900,
        area_sqft_max: 1800
    },

    // LAND PLOTS (4 properties)
    {
        name: 'Premium Residential Plot - Surathkal',
        builder: 'Individual',
        location: 'Surathkal, Mangalore',
        type: 'plot',
        status: 'For Sale',
        price: '₹28 Lakhs',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000',
        description: '5 cents residential plot near NITK. Clear title with all approvals.',
        bedrooms: 'Land',
        amenities: ['Road Access', 'Water Connection', 'Electricity', 'Clear Title', 'MUDA Approved'],
        area_sqft_min: 2178,
        area_sqft_max: 2178
    },
    {
        name: 'Hilltop Plot - Shakti Nagar',
        builder: 'Individual',
        location: 'Shakti Nagar, Mangalore',
        type: 'plot',
        status: 'For Sale',
        price: '₹45 Lakhs',
        image: 'https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?q=80&w=1000',
        description: 'Scenic hilltop plot with panoramic city views. Ideal for premium villa construction.',
        bedrooms: 'Land',
        amenities: ['City View', 'Road Access', 'Electricity Nearby', 'Peaceful Location'],
        area_sqft_min: 3000,
        area_sqft_max: 3000
    },
    {
        name: 'Commercial Plot - Baikampady',
        builder: 'Individual',
        location: 'Baikampady Industrial Area, Mangalore',
        type: 'plot',
        status: 'For Sale',
        price: '₹1.8 Cr',
        image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=1000',
        description: 'Industrial/Commercial land in prime industrial area. Perfect for warehouses and manufacturing.',
        bedrooms: 'Land',
        amenities: ['Industrial Zone', 'Wide Road Access', 'Three Phase Power', 'Water Connection'],
        area_sqft_min: 5000,
        area_sqft_max: 5000
    },
    {
        name: 'Shivabagh Layout',
        builder: 'Land Trades',
        location: 'Shivabagh, Mangalore',
        type: 'plot',
        status: 'For Sale',
        price: '₹35 Lakhs - ₹65 Lakhs',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000',
        description: 'MUDA approved residential layout with developed infrastructure. Multiple plot sizes available.',
        bedrooms: 'Land',
        amenities: ['MUDA Approved', 'Underground Drainage', 'Street Lights', 'Tar Roads', 'Water Connection', 'Electricity'],
        area_sqft_min: 1200,
        area_sqft_max: 2400
    }
];

async function seedComprehensiveData() {
    console.log('🌱 Starting comprehensive data seeding...\n');

    // 1. Seed Builders
    console.log('📊 Seeding Builders...');
    let builderCount = 0;
    for (const builder of builders) {
        const { error } = await supabase
            .from('builders')
            .upsert(builder, { onConflict: 'slug' });

        if (error) {
            console.error(`❌ Error upserting builder ${builder.name}:`, error.message);
        } else {
            builderCount++;
            console.log(`✅ ${builder.name}`);
        }
    }
    console.log(`\n✨ Successfully seeded ${builderCount} builders\n`);

    // 2. Seed Projects
    console.log('🏗️  Seeding Projects...');
    let projectCount = 0;
    let skippedCount = 0;

    for (const project of projects) {
        // Generate slug
        const slug = project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        const projectData = {
            ...project,
            slug,
            featured: Math.random() > 0.7 // 30% chance of being featured
        };

        // Check if exists
        const { data: existing } = await supabase
            .from('projects')
            .select('id')
            .eq('slug', slug)
            .single();

        if (existing) {
            skippedCount++;
            console.log(`⏭️  ${project.name} (already exists)`);
        } else {
            const { error } = await supabase
                .from('projects')
                .insert(projectData);

            if (error) {
                console.error(`❌ Error inserting ${project.name}:`, error.message);
            } else {
                projectCount++;
                console.log(`✅ ${project.name} - ${project.status}`);
            }
        }
    }

    console.log(`\n✨ Successfully seeded ${projectCount} new projects`);
    console.log(`⏭️  Skipped ${skippedCount} existing projects\n`);

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📈 SEEDING SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Builders: ${builderCount}/10`);
    console.log(`✅ Properties: ${projectCount}/${projects.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🎉 Comprehensive data seeding completed!\n');
    console.log('📝 Next Steps:');
    console.log('   1. Visit /admin/builders to manage builders');
    console.log('   2. Visit /partners to see builder showcase');
    console.log('   3. Upload real logos via Admin Dashboard');
    console.log('   4. Add high-quality property images');
    console.log('   5. Upload floor plans for premium properties\n');
}

seedComprehensiveData();
