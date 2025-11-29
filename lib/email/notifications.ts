import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Email template for submission confirmation
export async function sendSubmissionConfirmation(
  to: string,
  trackingId: string,
  propertyTitle: string
) {
  try {
    if (!resend) {
      console.warn('Resend not configured, skipping submission confirmation email');
      return { success: false, error: 'Email service not configured' };
    }
    await resend.emails.send({
      from: 'Mangalore Properties <noreply@mangaloreproperties.com>',
      to,
      subject: 'Property Listing Submitted - Under Review',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #D4AF37;">Thank You for Your Submission!</h1>
          <p>We've received your property listing:</p>
          <p style="font-size: 18px; font-weight: bold;">${propertyTitle}</p>
          <p>Your listing is currently under review. We'll get back to you within 24 hours.</p>
          <p><strong>Tracking ID:</strong> #${trackingId}</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            If you have any questions, reply to this email or contact us at support@mangaloreproperties.com
          </p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to send submission confirmation:', error);
    return { success: false, error };
  }
}

// Email notification to admin for new submission
export async function sendAdminNotification(
  propertyTitle: string,
  submitterEmail: string,
  listingId: string
) {
  try {
    if (!resend) {
      console.warn('Resend not configured, skipping admin notification email');
      return { success: false, error: 'Email service not configured' };
    }
    await resend.emails.send({
      from: 'Mangalore Properties <noreply@mangaloreproperties.com>',
      to: process.env.ADMIN_EMAIL || 'admin@mangaloreproperties.com',
      subject: '🔔 New Property Listing Pending Approval',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #D4AF37;">New Listing Submitted</h1>
          <p><strong>Property:</strong> ${propertyTitle}</p>
          <p><strong>Submitted by:</strong> ${submitterEmail}</p>
          <p><strong>Listing ID:</strong> ${listingId}</p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/approvals" 
             style="display: inline-block; background: #D4AF37; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
            Review Now
          </a>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to send admin notification:', error);
    return { success: false, error };
  }
}

// Email notification for property approval
export async function sendApprovalEmail(
  to: string,
  propertyTitle: string,
  propertyId: number
) {
  try {
    if (!resend) {
      console.warn('Resend not configured, skipping approval email');
      return { success: false, error: 'Email service not configured' };
    }
    await resend.emails.send({
      from: 'Kudla Homes <noreply@kudlahomes.com>',
      to,
      subject: '🎉 Your Property Listing Has Been Approved!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #10B981;">Congratulations!</h1>
          <p style="font-size: 16px;">Your property listing has been approved and is now live on Kudla Homes!</p>
          <div style="background: #f9fafb; padding: 15px; margin: 20px 0; border-radius: 8px;">
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #111;">${propertyTitle}</p>
          </div>
          <p>Your property is now visible to thousands of potential buyers and will start receiving inquiries soon.</p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/projects/${propertyId}" 
             style="display: inline-block; background: #DAA520; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0;">
            View Your Live Listing
          </a>
          <hr style="border: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            Questions? Contact us at hello@kudlahomes.com
          </p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to send approval email:', error);
    return { success: false, error };
  }
}

// Email notification for property rejection
export async function sendRejectionEmail(
  to: string,
  propertyTitle: string,
  reason: string
) {
  try {
    if (!resend) {
      console.warn('Resend not configured, skipping rejection email');
      return { success: false, error: 'Email service not configured' };
    }
    await resend.emails.send({
      from: 'Kudla Homes <noreply@kudlahomes.com>',
      to,
      subject: 'Update on Your Property Listing',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #EF4444;">Property Listing Update</h1>
          <p style="font-size: 16px;">We've reviewed your property listing:</p>
          <div style="background: #f9fafb; padding: 15px; margin: 20px 0; border-radius: 8px;">
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #111;">${propertyTitle}</p>
          </div>
          <p>Unfortunately, we're unable to approve this listing at this time for the following reason:</p>
          <div style="background: #fef2f2; border-left: 4px solid #EF4444; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #991b1b;">${reason}</p>
          </div>
          <p><strong>What you can do:</strong></p>
          <ul style="line-height: 1.8;">
            <li>Review the feedback and make necessary changes</li>
            <li>Submit your property again with updated information</li>
            <li>Contact our team if you have questions</li>
          </ul>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/list-property" 
             style="display: inline-block; background: #DAA520; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0;">
            Submit Again
          </a>
          <hr style="border: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            Need help? Contact us at hello@kudlahomes.com
          </p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to send rejection email:', error);
    return { success: false, error };
  }
}
