import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
    try {
        // Get authenticated user from request headers
        const authHeader = request.headers.get('authorization');
        let user = null;

        if (authHeader) {
            const token = authHeader.replace('Bearer ', '');
            const { data } = await supabaseAdmin.auth.getUser(token);
            user = data.user;
        }

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get status filter from query params
        const { searchParams } = new URL(request.url);
        const statusFilter = searchParams.get('status') || 'all';

        // Build query
        let query = supabaseAdmin
            .from('projects')
            .select(`
        id,
        title,
        location,
        price,
        approval_status,
        submitted_at,
        rejection_reason,
        cover_image_url,
        type,
        category
      `)
            .eq('submitted_by', user.id)
            .order('submitted_at', { ascending: false });

        // Apply status filter
        if (statusFilter !== 'all') {
            query = query.eq('approval_status', statusFilter);
        }

        const { data: submissions, error: submissionsError } = await query;

        if (submissionsError) {
            return NextResponse.json(
                { error: 'Failed to fetch submissions' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            submissions: submissions || []
        });

    } catch (error) {
        console.error('Error fetching user submissions:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
