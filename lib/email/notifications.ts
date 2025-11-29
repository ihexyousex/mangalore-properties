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
      subject: 'ðŸ”” New Property Listing Pending Approval',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #D4AF37;">New Listing Submitted</h1>
          <p><strong>Property:</strong> ${propertyTitle}</p>
          <p><strong>Submitted by:</strong> ${submitterEmail}</p>
          <p><strong>Listing ID:</strong> ${listingId}</p>
          <a href="http://localhost:3000/admin/approvals" 
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

// Email notification when listing is approved
export async function sendApprovalNotification(
  to: string,
  propertyTitle: string,
  listingUrl: string
) {
  try {
    if (!resend) {
      console.warn('Resend not configured, skipping approval notification email');
      return { success: false, error: 'Email service not configured' };
    }
    await resend.emails.send({
      from: 'Mangalore Properties <noreply@mangaloreproperties.com>',
      to,
      subject: 'âœ… Your Property Listing is Now Live!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #22c55e;">Congratulations! Your Listing is Live</h1>
          <p>Your property listing has been approved:</p>
          <p style="font-size: 18px; font-weight: bold;">${propertyTitle}</p>
          <a href="${listingUrl}" 
             style="display: inline-block; background: #22c55e; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
            View Your Listing
          </a>
          <p style="margin-top: 20px;">Your property is now visible to thousands of potential buyers!</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to send approval notification:', error);
    return { success: false, error };
  }
}

// Email notification when listing is rejected
export async function sendRejectionNotification(
  to: string,
  propertyTitle: string,
  reason?: string
) {
  try {
    if (!resend) {
      console.warn('Resend not configured, skipping rejection notification email');
      return { success: false, error: 'Email service not configured' };
    }
    await resend.emails.send({
      from: 'Mangalore Properties <noreply@mangaloreproperties.com>',
      to,
      subject: 'Property Listing Review Update',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ef4444;">Listing Requires Attention</h1>
          <p>We've reviewed your property listing:</p>
          <p style="font-size: 18px; font-weight: bold;">${propertyTitle}</p>
          ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
          <p>Please make the necessary changes and resubmit your listing.</p>
          <a href="http://localhost:3000/list-property" 
             style="display: inline-block; background: #D4AF37; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
            Submit Again
          </a>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to send rejection notification:', error);
    return { success: false, error };
  }
}
