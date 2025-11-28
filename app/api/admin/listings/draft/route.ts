import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET: Load draft
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId'); // If you want user-specific drafts

        // For simplicity, we'll get the most recent draft
        const { data, error } = await supabase
            .from('projects')
            .select('draft_data')
            .not('draft_data', 'is', null)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
            throw error;
        }

        return NextResponse.json({ draft: data?.draft_data || null });

    } catch (error: any) {
        console.error('Draft Load Error:', error);
        return NextResponse.json(
            { error: 'Failed to load draft' },
            { status: 500 }
        );
    }
}

// POST: Save draft
export async function POST(request: NextRequest) {
    try {
        const draftData = await request.json();

        // Option 1: Update existing draft row
        // Option 2: Create new project with is_approved=false and draft_data filled

        // We'll use option 2 for simplicity
        const { data, error } = await supabase
            .from('projects')
            .insert({
                name: draftData.title || 'Draft Listing',
                listing_type: draftData.listingType,
                draft_data: draftData,
                is_approved: false,
                location: draftData.location || '',
                price: draftData.price || '',
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, draftId: data.id });

    } catch (error: any) {
        console.error('Draft Save Error:', error);
        return NextResponse.json(
            { error: 'Failed to save draft', details: error.message },
            { status: 500 }
        );
    }
}
