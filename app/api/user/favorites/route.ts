import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const { userId, propertyId } = await request.json();

        if (!userId || !propertyId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Get current favorites
        const { data: prefs, error: fetchError } = await supabase
            .from('user_preferences')
            .select('favorite_properties')
            .eq('user_id', userId)
            .single();

        if (fetchError) {
            // If no preferences exist, create them
            if (fetchError.code === 'PGRST116') {
                await supabase.from('user_preferences').insert({
                    user_id: userId,
                    favorite_properties: [propertyId],
                });
                return NextResponse.json({ isFavorite: true });
            }
            throw fetchError;
        }

        let favorites = prefs.favorite_properties || [];
        let isFavorite = false;

        if (favorites.includes(propertyId)) {
            // Remove from favorites
            favorites = favorites.filter((id: string) => id !== propertyId);
            isFavorite = false;
        } else {
            // Add to favorites
            favorites.push(propertyId);
            isFavorite = true;
        }

        // Update database
        const { error: updateError } = await supabase
            .from('user_preferences')
            .update({ favorite_properties: favorites })
            .eq('user_id', userId);

        if (updateError) throw updateError;

        return NextResponse.json({ isFavorite, favorites });

    } catch (error: any) {
        console.error('Favorites error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ favorites: [] });
        }

        const { data: prefs } = await supabase
            .from('user_preferences')
            .select('favorite_properties')
            .eq('user_id', userId)
            .single();

        return NextResponse.json({
            favorites: prefs?.favorite_properties || []
        });

    } catch (error) {
        return NextResponse.json({ favorites: [] });
    }
}
