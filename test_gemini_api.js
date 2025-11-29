require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiAPI() {
    console.log("\n🤖 Testing Google Gemini AI API...\n");

    if (!process.env.GEMINI_API_KEY) {
        console.error("❌ GEMINI_API_KEY not found in .env.local");
        process.exit(1);
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        console.log("Testing AI property search...");
        const testQuery = "3 BHK apartments under 80 lakhs in Mangalore";
        console.log(`Query: "${testQuery}"\n`);

        const prompt = `You are a real estate search assistant. Extract search filters from this query: "${testQuery}"
Return ONLY valid JSON with these fields:
{
  "location": "extracted location or null",
  "priceMax": number in lakhs or null,
  "bedrooms": number or null,
  "propertyType": "Residential/Commercial/Rent/Plots" or null
}`;

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        console.log("✅ AI Response received:");
        console.log(response);

        // Try to parse as JSON
        try {
            const parsed = JSON.parse(response.replace(/```json\n?|\n?```/g, '').trim());
            console.log("\n✅ Parsed JSON:");
            console.log(parsed);
        } catch (e) {
            console.log("\n⚠️  Response is text, not JSON (this is OK for some queries)");
        }

        console.log("\n✅ Gemini API is working!\n");
    } catch (error) {
        console.error("\n❌ Gemini API Error:", error.message);
        if (error.message.includes('API key')) {
            console.error("   Check if GEMINI_API_KEY is correct");
        }
        process.exit(1);
    }
}

testGeminiAPI();
