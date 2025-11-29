import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendApprovalEmail } from '@/lib/email/notifications';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        // TODO: Add admin auth check here

        const { projectId } = await request.json();

        if (!projectId) {
            return NextResponse.json(
                { error: 'Project ID is required' },
                { status: 400 }
            );
        }

        // Update approval status
        const { data: project, error: updateError } = await supabase
            .from('projects')
            .update({ approval_status: 'approved' })
            .eq('id', projectId)
            .select('name, property_meta')
            .single();

        if (updateError) {
            return NextResponse.json(
                { error: 'Failed to approve project' },
                { status: 500 }
            );
        }

        // Send approval email
        const submitterEmail = project.property_meta?.submitter_email;
        if (submitterEmail) {
            await sendApprovalEmail(submitterEmail, project.name, projectId);
        }

        return NextResponse.json({
            success: true,
            message: 'Property approved successfully'
        });

    } catch (error) {
        console.error('Error approving property:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
