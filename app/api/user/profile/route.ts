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

        // Fetch user profile
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileError) {
            return NextResponse.json(
                { error: 'Failed to fetch profile' },
                { status: 500 }
            );
        }

        // Fetch user stats
        const [submissionsCount, favoritesCount, inquiriesCount] = await Promise.all([
            supabaseAdmin
                .from('projects')
                .select('approval_status', { count: 'exact', head: true })
                .eq('submitted_by', user.id),
            supabaseAdmin
                .from('favorites')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id),
            supabaseAdmin
                .from('leads')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
        ]);

        // Count submissions by status
        const { data: submissions } = await supabaseAdmin
            .from('projects')
            .select('approval_status')
            .eq('submitted_by', user.id);

        const stats = {
            total_submissions: submissionsCount.count || 0,
            approved_submissions: submissions?.filter(s => s.approval_status === 'approved').length || 0,
            pending_submissions: submissions?.filter(s => s.approval_status === 'pending').length || 0,
            rejected_submissions: submissions?.filter(s => s.approval_status === 'rejected').length || 0,
            total_favorites: favoritesCount.count || 0,
            total_inquiries: inquiriesCount.count || 0
        };

        return NextResponse.json({
            id: user.id,
            email: user.email,
            full_name: profile?.full_name || '',
            phone: profile?.phone || '',
            avatar_url: profile?.avatar_url || '',
            bio: profile?.bio || '',
            location: profile?.location || '',
            email_notifications: profile?.email_notifications ?? true,
            whatsapp_notifications: profile?.whatsapp_notifications ?? true,
            created_at: profile?.created_at,
            stats
        });

    } catch (error) {
        console.error('Error fetching user profile:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const user = await getUser(request);

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Parse request body
        const body = await request.json();
        const {
            full_name,
            phone,
            bio,
            location,
            email_notifications,
            whatsapp_notifications
        } = body;

        // Update profile
        const { data: updatedProfile, error: updateError } = await supabaseAdmin
            .from('user_profiles')
            .update({
                full_name,
                phone,
                bio,
                location,
                email_notifications,
                whatsapp_notifications
            })
            .eq('id', user.id)
            .select()
            .single();

        if (updateError) {
            return NextResponse.json(
                { error: 'Failed to update profile' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            profile: updatedProfile
        });

    } catch (error) {
        console.error('Error updating user profile:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
