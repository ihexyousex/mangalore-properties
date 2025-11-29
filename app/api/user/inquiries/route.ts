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

        // Fetch user's inquiries
        const { data: inquiries, error: inquiriesError } = await supabaseAdmin
            .from('leads')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (inquiriesError) {
            return NextResponse.json(
                { error: 'Failed to fetch inquiries' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            inquiries: inquiries || []
        });

    } catch (error) {
        console.error('Error fetching inquiries:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
