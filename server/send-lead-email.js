// Mirrors api/send-lead-email.js for the Express-style server/handlers path.
// See api/send-lead-email.js for full documentation of env vars and setup.

import supabase from './db-client.js';

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function getNotificationEmails() {
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'notification_emails')
    .single();

  const fromSettings = data?.value || '';
  const fromEnv = process.env.LEAD_NOTIFY_EMAILS || '';
  const raw = fromSettings || fromEnv;

  return raw
    .split(',')
    .map((e) => e.trim())
    .filter((e) => e.length > 0);
}

export async function sendLeadNotificationEmail(lead) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('RESEND_API_KEY not set — skipping lead notification email.');
      return;
    }

    const recipients = await getNotificationEmails();
    if (recipients.length === 0) {
      console.warn('No notification_emails configured in Site Settings — skipping email.');
      return;
    }

    const fromAddress = process.env.RESEND_FROM_EMAIL || 'Devsiy Leads <onboarding@resend.dev>';
    const subject = `New Lead: ${lead.project_name} (${lead.urgency} priority)`;

    const html = `
      <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 560px; margin: 0 auto;">
        <h2 style="margin-bottom: 4px;">New lead received</h2>
        <p style="color:#555; margin-top:0;">A new lead just came in through the website contact form.</p>
        <table style="width:100%; border-collapse: collapse; margin-top: 16px;">
          <tr><td style="padding:8px 0; color:#888; width:160px;">Name</td><td style="padding:8px 0;">${escapeHtml(lead.name)}</td></tr>
          <tr><td style="padding:8px 0; color:#888;">Email</td><td style="padding:8px 0;">${escapeHtml(lead.email)}</td></tr>
          <tr><td style="padding:8px 0; color:#888;">Mobile</td><td style="padding:8px 0;">${escapeHtml(lead.mobile)}</td></tr>
          <tr><td style="padding:8px 0; color:#888;">Project</td><td style="padding:8px 0;">${escapeHtml(lead.project_name)}</td></tr>
          <tr><td style="padding:8px 0; color:#888;">Budget</td><td style="padding:8px 0;">${escapeHtml(lead.currency)} ${escapeHtml(lead.budget_amount)}</td></tr>
          <tr><td style="padding:8px 0; color:#888;">Urgency</td><td style="padding:8px 0;">${escapeHtml(lead.urgency)}</td></tr>
          <tr><td style="padding:8px 0; color:#888; vertical-align:top;">Description</td><td style="padding:8px 0;">${escapeHtml(lead.description)}</td></tr>
        </table>
        <p style="margin-top:24px;">
          <a href="https://${process.env.SITE_DOMAIN || 'yourdomain.com'}/admin/leads" style="background:#111; color:#fff; padding:10px 18px; border-radius:8px; text-decoration:none; display:inline-block;">
            Open in Admin Panel
          </a>
        </p>
      </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ from: fromAddress, to: recipients, subject, html }),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => '');
      console.error('Resend API error while sending lead email:', res.status, errBody);
    }
  } catch (err) {
    console.error('sendLeadNotificationEmail failed:', err);
  }
}
