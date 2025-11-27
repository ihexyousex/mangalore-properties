const { runAI } = require('./app/actions/ai.ts');

async function testAiSearch() {
    console.log("Testing AI property search...");

    const query = "3 BHK under 80 lakhs";
    console.log("Query:", query);

    try {
        const result = await runAI("property_search", query);
        console.log("AI Result:", result);
        console.log("Result type:", typeof result);

        if (typeof result === 'string') {
            console.log("Attempting to parse as JSON...");
            const parsed = JSON.parse(result);
            console.log("Parsed:", parsed);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

testAiSearch();
