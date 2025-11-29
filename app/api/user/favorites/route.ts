import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getUser(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        const { data } = await supabaseAdmin.auth.getUser(token);
        return data.user;
    }
    return null;
}

export async function GET(request: NextRequest) {
    try {
        const user = await getUser(request);

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Fetch favorites with project details
        const { data: favorites, error: favoritesError } = await supabaseAdmin
            .from('favorites')
            .select(`
        id,
        created_at,
        project:project_id (
          id,
          title,
          location,
          price,
          cover_image_url,
          type,
          category
        )
      `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (favoritesError) {
            return NextResponse.json(
                { error: 'Failed to fetch favorites' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            favorites: favorites || []
        });

    } catch (error) {
        console.error('Error fetching favorites:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await getUser(request);

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { project_id } = await request.json();

        if (!project_id) {
            return NextResponse.json(
                { error: 'Project ID is required' },
                { status: 400 }
            );
        }

        // Check if already favorited
        const { data: existing } = await supabaseAdmin
            .from('favorites')
            .select('id')
            .eq('user_id', user.id)
            .eq('project_id', project_id)
            .single();

        if (existing) {
            return NextResponse.json(
                { error: 'Already in favorites' },
                { status: 400 }
            );
        }

        // Add to favorites
        const { data, error } = await supabaseAdmin
            .from('favorites')
            .insert({
                user_id: user.id,
                project_id
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json(
                { error: 'Failed to add favorite' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            favorite: data
        });

    } catch (error) {
        console.error('Error adding favorite:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
