import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
    try {
        // TODO: Add admin auth check here

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || 'all';

        // Build query
        let query = supabase
            .from('projects')
            .select('*')
            .order('submitted_at', { ascending: false });

        // Apply status filter
        if (status !== 'all') {
            query = query.eq('approval_status', status);
        }

        const { data: submissions, error } = await query;

        if (error) {
            return NextResponse.json(
                { error: 'Failed to fetch submissions' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            submissions: submissions || []
        });

    } catch (error) {
        console.error('Error fetching approvals:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
