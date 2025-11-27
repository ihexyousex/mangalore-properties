'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || '');

// Using gemini-pro explicitly from the start
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

export async function runAI(task: string, input: string) {
    if (!apiKey) {
        return { error: 'Google API Key is not configured.' };
    }

    let systemPrompt = '';
    let isJson = false;

    switch (task) {
        case 'listing':
            systemPrompt = `You are a luxury real estate copywriter. Generate a JSON object with: description (100 words), amenities (list of 5), local_insight (50 words), and seo_title.`;
            isJson = true;
            break;
        case 'listing_description':
            systemPrompt = `You are a professional real estate copywriter. Write a compelling, luxurious, and SEO-friendly property description (approx 150-200 words) based on the provided details. Highlight the key features, location advantages, and lifestyle benefits. Use a professional yet inviting tone.`;
            isJson = false;
            break;
        default:
            return { error: 'Invalid task type.' };
    }

    const prompt = `${systemPrompt}\n\nInput: ${input}`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (isJson) {
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            try {
                return JSON.parse(cleanText);
            } catch (e) {
                return { error: "Failed to parse AI response as JSON", raw: text };
            }
        }

        return text;
    } catch (error: any) {
        console.error('Gemini AI Error:', error);
        return { error: error.message || 'Failed to generate content.', modelUsed: 'gemini-2.0-flash-lite' };
    }
}
