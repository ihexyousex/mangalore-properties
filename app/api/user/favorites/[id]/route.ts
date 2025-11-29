import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
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

        const { id: projectId } = await params;

        // Delete from favorites
        const { error: deleteError } = await supabaseAdmin
            .from('favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('project_id', projectId);

        if (deleteError) {
            return NextResponse.json(
                { error: 'Failed to remove favorite' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true
        });

    } catch (error) {
        console.error('Error removing favorite:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
