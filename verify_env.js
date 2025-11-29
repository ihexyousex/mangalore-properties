require('dotenv').config({ path: '.env.local' });

async function verifyAllEnvironmentVariables() {
    console.log("\n🔍 Environment Variables Verification Report\n");
    console.log("=".repeat(60));

    const variables = [
        { name: 'NEXT_PUBLIC_SUPABASE_URL', service: 'Supabase Database' },
        { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', service: 'Supabase Auth' },
        { name: 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY', service: 'Google Maps' },
        { name: 'ORS_API_KEY', service: 'OpenRouteService' },
        { name: 'GEMINI_API_KEY', service: 'Google Gemini AI' }
    ];

    let allPresent = true;
    let results = [];

    variables.forEach(({ name, service }) => {
        const value = process.env[name];
        const status = value ? '✅ Present' : '❌ Missing';
        const preview = value ? `${value.substring(0, 20)}...` : 'NOT SET';

        results.push({ service, name, status, present: !!value, preview });

        if (!value) allPresent = false;
    });

    // Print results
    console.log("\nService                    | Variable Name                        | Status");
    console.log("-".repeat(85));

    results.forEach(({ service, name, status, preview }) => {
        const servicePad = service.padEnd(25);
        const namePad = name.padEnd(37);
        console.log(`${servicePad} | ${namePad} | ${status}`);
    });

    console.log("=".repeat(60));
    console.log(`\nFound ${results.filter(r => r.present).length} out of ${variables.length} variables\n`);

    if (allPresent) {
        console.log("✅ All environment variables are configured!\n");
        console.log("NOTE: Variable presence is confirmed. Actual API connectivity");
        console.log("      should be tested individually with dedicated test scripts.\n");
    } else {
        console.log("❌ Some environment variables are missing!");
        console.log("\nMissing variables:");
        results.filter(r => !r.present).forEach(({ service, name }) => {
            console.log(`   - ${name} (${service})`);
        });
        console.log("\nPlease add them to your .env.local file.\n");
        process.exit(1);
    }

    // Show what's actually loaded
    console.log("Loaded .env.local with the following keys:");
    Object.keys(process.env)
        .filter(key => key.includes('SUPABASE') || key.includes('GOOGLE') || key.includes('ORS') || key.includes('GEMINI'))
        .forEach(key => {
            console.log(`  - ${key}`);
        });
    console.log("");
}

verifyAllEnvironmentVariables();
