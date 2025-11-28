import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { user: googleUser } = await request.json();

    if (!googleUser || !googleUser.email) {
      return NextResponse.json(
        { error: 'Invalid user data' },
        { status: 400 }
      );
    }

    // Check if user exists
    let { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', googleUser.email)
      .single();

    let user = existingUser;

    // Create user if doesn't exist
    if (!existingUser && fetchError?.code === 'PGRST116') {
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          email: googleUser.email,
          name: googleUser.name,
          avatar: googleUser.avatar,
          google_id: googleUser.google_id,
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating user:', createError);
        return NextResponse.json(
          { error: 'Failed to create user' },
          { status: 500 }
        );
      }

      user = newUser;

      // Create user preferences
      await supabase.from('user_preferences').insert({
        user_id: user!.id,
        favorite_properties: [],
        saved_searches: [],
      });
    } else if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching user:', fetchError);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }

    // Update user avatar/name in case it changed
    if (existingUser) {
      const { data: updatedUser } = await supabase
        .from('users')
        .update({
          name: googleUser.name,
          avatar: googleUser.avatar,
        })
        .eq('id', existingUser.id)
        .select()
        .single();

      user = updatedUser || existingUser;
    }

    // Fetch user preferences
    const { data: preferences } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user!.id)
      .single();

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        preferences,
      },
    });

  } catch (error: any) {
    console.error('Google auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
