import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendRejectionEmail } from '@/lib/email/notifications';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        // TODO: Add admin auth check here

        const { projectId, reason } = await request.json();

        if (!projectId || !reason) {
            return NextResponse.json(
                { error: 'Project ID and reason are required' },
                { status: 400 }
            );
        }

        // Update approval status and rejection reason
        const { data: project, error: updateError } = await supabase
            .from('projects')
            .update({
                approval_status: 'rejected',
                rejection_reason: reason
            })
            .eq('id', projectId)
            .select('name, property_meta')
            .single();

        if (updateError) {
            return NextResponse.json(
                { error: 'Failed to reject project' },
                { status: 500 }
            );
        }

        // Send rejection email
        const submitterEmail = project.property_meta?.submitter_email;
        if (submitterEmail) {
            await sendRejectionEmail(submitterEmail, project.name, reason);
        }

        return NextResponse.json({
            success: true,
            message: 'Property rejected'
        });

    } catch (error) {
        console.error('Error rejecting property:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
