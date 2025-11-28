import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
    try {
        // 1. Verify user is authenticated
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized - No auth header' }, { status: 401 });
        }

        // 2. Verify user session
        const token = authHeader.replace('Bearer ', '');
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            console.error('Auth verification failed:', authError);
            return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 });
        }

        // 3. Check if user has admin role
        const userRole = user.user_metadata?.role;
        if (userRole !== 'admin') {
            console.error('User is not admin:', user.email, 'Role:', userRole);
            return NextResponse.json({ error: 'Forbidden - Not an admin' }, { status: 403 });
        }

        console.log('Admin verified:', user.email);

        // 4. Get project data from request
        const projectData = await request.json();
        console.log('Inserting project:', projectData.name);

        // 5. Insert using service role key (bypasses RLS)
        const supabaseAdmin = getSupabaseAdmin();
        const { data, error } = await supabaseAdmin
            .from('projects')
            .insert([projectData])
            .select()
            .single();

        if (error) {
            console.error('Database insert error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        console.log('Project created successfully:', data.id);
        return NextResponse.json({ data }, { status: 201 });

    } catch (error: any) {
        console.error('API route error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
