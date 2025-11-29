const fs = require('fs');
const path = require('path');

async function updateEnvFile() {
    const envPath = path.join(__dirname, '.env.local');

    console.log("\n🔧 Updating .env.local with new API keys...\n");

    // New API keys to add
    const newKeys = {
        'ORS_API_KEY': 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjA2ZTM4NmJjNTdkYjQ2MjFhZjFmNDJhODE0MzVmNjZkIiwiaCI6Im11cm11cjY0In0=',
        'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY': 'AIzaSyByy-MHR3S8MTQVOHqoVX_V4MsHlbFEwAo',
        'NEXT_PUBLIC_IMAGEKIT_URL': 'https://ik.imagekit.io/dydioygv9/'
    };

    try {
        // Read existing .env.local
        let envContent = '';
        if (fs.existsSync(envPath)) {
            envContent = fs.readFileSync(envPath, 'utf8');
            console.log("✅ Found existing .env.local file\n");
        } else {
            console.log("⚠️  No .env.local found, creating new file\n");
        }

        // Track which keys were added/updated
        const results = [];

        for (const [key, value] of Object.entries(newKeys)) {
            const regex = new RegExp(`^${key}=.*$`, 'm');

            if (regex.test(envContent)) {
                // Update existing key
                envContent = envContent.replace(regex, `${key}=${value}`);
                results.push({ key, action: 'Updated' });
            } else {
                // Add new key
                envContent += `\n${key}=${value}`;
                results.push({ key, action: 'Added' });
            }
        }

        // Write back to file
        fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf8');

        // Print results
        console.log("Key Updates:");
        console.log("-".repeat(70));
        results.forEach(({ key, action }) => {
            const actionPad = action.padEnd(10);
            console.log(`${actionPad} | ${key}`);
        });
        console.log("-".repeat(70));

        console.log("\n✅ Successfully updated .env.local!\n");
        console.log("New API keys added:");
        console.log("  • OpenRouteService API (distance calculations)");
        console.log("  • Google Maps API (location autocomplete)");
        console.log("  • ImageKit.io URL (image hosting)");
        console.log("\nYou can now run verification tests.\n");

    } catch (error) {
        console.error("\n❌ Error updating .env.local:", error.message);
        process.exit(1);
    }
}

updateEnvFile();
