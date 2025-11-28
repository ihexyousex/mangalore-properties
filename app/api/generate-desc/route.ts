import { NextRequest, NextResponse } from 'next/server';

// This is a flexible template that works with OpenAI, Anthropic, or Google Gemini
// Set NEXT_PUBLIC_AI_PROVIDER in .env.local to 'openai', 'anthropic', or 'gemini'

export async function POST(request: NextRequest) {
    try {
        const { listingType, basics, amenities } = await request.json();

        // Build a smart prompt based on listing data
        const prompt = `Write a compelling 150-word property listing description for:
    
Type: ${listingType?.replace('_', ' ')}
Title: ${basics?.title || 'Property'}
Location: ${basics?.location || 'Mangalore'}
Configuration: ${basics?.bhk || ''}
Price: ${basics?.price || ''}
Amenities: ${amenities?.join(', ') || 'Premium amenities'}

Make it luxurious, professional, and highlight key selling points. Focus on lifestyle and location benefits.`;

        // Check which AI provider is configured
        const provider = process.env.NEXT_PUBLIC_AI_PROVIDER || 'openai';

        let description = '';

        if (provider === 'openai') {
            // OpenAI Implementation
            const apiKey = process.env.OPENAI_API_KEY;
            if (!apiKey) {
                return NextResponse.json(
                    { error: 'OpenAI API key not configured' },
                    { status: 500 }
                );
            }

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: 'gpt-4',
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: 250,
                    temperature: 0.7,
                }),
            });

            const data = await response.json();
            description = data.choices[0]?.message?.content || '';

        } else if (provider === 'anthropic') {
            // Anthropic Claude Implementation
            const apiKey = process.env.ANTHROPIC_API_KEY;
            if (!apiKey) {
                return NextResponse.json(
                    { error: 'Anthropic API key not configured' },
                    { status: 500 }
                );
            }

            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                },
                body: JSON.stringify({
                    model: 'claude-3-sonnet-20240229',
                    max_tokens: 250,
                    messages: [{ role: 'user', content: prompt }],
                }),
            });

            const data = await response.json();
            description = data.content[0]?.text || '';

        } else if (provider === 'gemini') {
            // Google Gemini Implementation
            const apiKey = process.env.GOOGLE_AI_API_KEY;
            if (!apiKey) {
                return NextResponse.json(
                    { error: 'Google AI API key not configured' },
                    { status: 500 }
                );
            }

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                    }),
                }
            );

            const data = await response.json();
            description = data.candidates[0]?.content?.parts[0]?.text || '';
        } else {
            // Fallback: Generate a simple template-based description
            description = `Discover this stunning ${basics?.bhk || ''} property in ${basics?.location || 'Mangalore'}. 
      
Featuring ${amenities?.slice(0, 3).join(', ')} and more premium amenities, this ${listingType?.includes('rent') ? 'rental' : ''} property offers the perfect blend of luxury and convenience. 

Priced at ${basics?.price}, this is an exceptional opportunity in one of Mangalore's most sought-after locations. Contact us today to schedule a viewing!`;
        }

        return NextResponse.json({ description: description.trim() });

    } catch (error: any) {
        console.error('AI Description Generation Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate description', details: error.message },
            { status: 500 }
        );
    }
}
