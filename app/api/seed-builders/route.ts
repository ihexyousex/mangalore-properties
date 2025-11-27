import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
    try {
        console.log('Authenticating...');
        // Sign in anonymously or with a dummy account to get an authenticated session
        const email = `seed-${Date.now()}@example.com`;
        const password = 'seed-password-123';

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) {
            console.error("Auth error:", authError);
            // Try signing in if sign up fails (user might exist)
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            if (signInError) {
                return NextResponse.json({ error: `Auth failed: ${signInError.message}` }, { status: 500 });
            }
        }

        console.log('Checking builders table...');

        const { data: existingBuilders, error: fetchError } = await supabase
            .from('builders')
            .select('*');

        if (fetchError) {
            return NextResponse.json({ error: fetchError.message }, { status: 500 });
        }

        if (!existingBuilders || existingBuilders.length === 0) {
            console.log('Seeding sample builders...');
            const sampleBuilders = [
                { name: 'Prestige Group', slug: 'prestige-group' },
                { name: 'Brigade Group', slug: 'brigade-group' },
                { name: 'NorthernSky Properties', slug: 'northernsky-properties' },
                { name: 'Land Trades', slug: 'land-trades' }
            ];

            const { data: inserted, error: insertError } = await supabase
                .from('builders')
                .insert(sampleBuilders)
                .select();

            if (insertError) {
                return NextResponse.json({ error: insertError.message }, { status: 500 });
            }

            return NextResponse.json({ message: 'Successfully inserted builders', data: inserted });
        } else {
            return NextResponse.json({ message: 'Builders already exist', data: existingBuilders });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
