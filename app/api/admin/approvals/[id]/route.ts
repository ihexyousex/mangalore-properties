import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendApprovalNotification, sendRejectionNotification } from '@/lib/email/notifications';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { action, message } = await request.json();
        const { id } = await params;

        if (action === 'approve') {
            // Approve listing
            const { data, error } = await supabase
                .from('projects')
                .update({
                    is_approved: true,
                    approved_at: new Date().toISOString(),
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            // Send approval email
            if (data.submitted_by && data.property_meta?.submitter_name) {
                await sendApprovalNotification(
                    data.submitted_by,
                    data.name,
                    `http://localhost:3000/projects/${id}`
                );
            }

            return NextResponse.json({ success: true, listing: data });

        } else if (action === 'reject') {
            // First fetch the existing project to get property_meta
            const { data: existingProject, error: fetchError } = await supabase
                .from('projects')
                .select('property_meta, submitted_by, name')
                .eq('id', id)
                .single();

            if (fetchError) throw fetchError;

            // Keep listing but mark as rejected (soft delete)
            const { data, error } = await supabase
                .from('projects')
                .update({
                    is_approved: false,
                    property_meta: {
                        ...existingProject.property_meta,
                        rejected: true,
                        rejection_reason: message,
                    },
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            // Send rejection email
            if (data.submitted_by) {
                await sendRejectionNotification(
                    data.submitted_by,
                    data.name,
                    message
                );
            }

            return NextResponse.json({ success: true, listing: data });

        } else {
            return NextResponse.json(
                { error: 'Invalid action' },
                { status: 400 }
            );
        }
    } catch (error: any) {
        console.error('Approval action error:', error);
        return NextResponse.json(
            { error: 'Failed to process action', details: error.message },
            { status: 500 }
        );
    }
}
