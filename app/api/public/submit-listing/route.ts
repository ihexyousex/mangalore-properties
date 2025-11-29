import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendSubmissionConfirmation, sendAdminNotification } from '@/lib/email/notifications';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const { listing, submitter } = await request.json();

        // Validate required fields
        if (!listing.title || !listing.price || !listing.location) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (!submitter.name || !submitter.email || !submitter.phone) {
            return NextResponse.json(
                { error: 'Contact information is required' },
                { status: 400 }
            );
        }

        // Insert listing into database with is_approved = false
        const { data, error } = await supabase
            .from('projects')
            .insert({
                name: listing.title,
                price: listing.price,
                location: listing.location,
                listing_type: listing.listingType,
                is_approved: false,
                submitted_by: submitter.email,
                property_meta: {
                    submitter_name: submitter.name,
                    submitter_phone: submitter.phone,
                    ...listing,
                },
                // Map other fields
                latitude: listing.latitude,
                longitude: listing.longitude,
                pincode: listing.pincode,
                area: listing.area,
                landmarks: listing.landmarks,
                map_url: listing.mapUrl,
            })
            .select()
            .single();

        if (error) {
            console.error('Database error:', error);
            return NextResponse.json(
                { error: 'Failed to submit listing' },
                { status: 500 }
            );
        }

        const trackingId = data.id;

        // Send confirmation email to submitter
        await sendSubmissionConfirmation(
            submitter.email,
            trackingId,
            listing.title
        );

        // Send notification to admin
        await sendAdminNotification(
            listing.title,
            submitter.email,
            trackingId
        );

        return NextResponse.json({
            success: true,
            trackingId,
            message: 'Listing submitted successfully',
        });

    } catch (error: any) {
        console.error('Submission error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
