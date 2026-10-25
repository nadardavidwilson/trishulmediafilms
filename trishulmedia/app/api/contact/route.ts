import { env } from 'cloudflare:workers';

const recipient = 'Trishulmediafilms@gmail.com';
const allowedLocations = new Set(['Local', 'Destination', 'Not decided yet']);
const allowedBudgets = new Set(['Under ₹25,000', '₹25,000–₹50,000', '₹50,000+', 'Still exploring']);
const allowedReferrals = new Set(['Instagram', 'Google search', 'Referral', 'Other']);

type ContactEnquiry = {
  coupleName: string;
  email: string;
  shootDate: string;
  location: string;
  budget: string;
  referral: string;
  message?: string;
};

type ContactEnv = CloudflareEnv & {
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
};

function isValidEnquiry(value: unknown): value is ContactEnquiry {
  if (!value || typeof value !== 'object') return false;
  const enquiry = value as Record<string, unknown>;
  return (
    typeof enquiry.coupleName === 'string' &&
    enquiry.coupleName.trim().length > 0 &&
    enquiry.coupleName.length <= 120 &&
    typeof enquiry.email === 'string' &&
    enquiry.email.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email) &&
    typeof enquiry.shootDate === 'string' &&
    enquiry.shootDate.trim().length > 0 &&
    enquiry.shootDate.length <= 120 &&
    typeof enquiry.location === 'string' &&
    allowedLocations.has(enquiry.location) &&
    typeof enquiry.budget === 'string' &&
    allowedBudgets.has(enquiry.budget) &&
    typeof enquiry.referral === 'string' &&
    allowedReferrals.has(enquiry.referral) &&
    (enquiry.message === undefined ||
      (typeof enquiry.message === 'string' && enquiry.message.length <= 2000))
  );
}

function getSenderAddress(value: string): string | null {
  const sender = value.trim();
  const addressMatch = /<([^<>]+)>$/.exec(sender);
  const address = (addressMatch?.[1] ?? sender).trim();
  return /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(address) ? address : null;
}

export async function POST(request: Request): Promise<Response> {
  if (request.headers.get('origin') !== new URL(request.url).origin) {
    return Response.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: 'Please submit a valid enquiry.' }, { status: 400 });
  }

  if (!isValidEnquiry(payload)) {
    return Response.json({ error: 'Please complete all required enquiry fields.' }, { status: 400 });
  }

  const contactEnv = env as ContactEnv;
  if (!contactEnv.RESEND_API_KEY || !contactEnv.RESEND_FROM_EMAIL) {
    console.error('Contact email is not configured: Resend API key or sender address is missing.');
    return Response.json({ error: 'Email is not configured yet. Please email us directly.' }, { status: 503 });
  }

  const senderAddress = getSenderAddress(contactEnv.RESEND_FROM_EMAIL);
  if (!senderAddress) {
    console.error('Contact email is not configured: RESEND_FROM_EMAIL must contain a valid email address.');
    return Response.json(
      { error: 'Email sender is not configured correctly. Set RESEND_FROM_EMAIL to an authorized address such as bookings@contact.trishulmedia.co.in.' },
      { status: 503 },
    );
  }

  const coupleName = payload.coupleName.trim();
  const text = [
    `Couple: ${coupleName}`,
    `Email: ${payload.email}`,
    `Target shoot date / month: ${payload.shootDate}`,
    `Preferred shoot location: ${payload.location}`,
    `Estimated budget: ${payload.budget}`,
    `How they found us: ${payload.referral}`,
    `Additional details: ${payload.message?.trim() || 'Not provided'}`,
  ].join('\n');

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${contactEnv.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Trishul Media & Films <${senderAddress}>`,
        to: [recipient],
        reply_to: payload.email,
        subject: `Shoot enquiry — ${coupleName}`,
        text,
      }),
    });

    if (!resendResponse.ok) {
      const providerError = await resendResponse.json().catch(() => null) as { message?: string } | null;
      const message = providerError?.message;
      console.error(`Resend rejected the contact enquiry (${resendResponse.status}):`, message ?? 'No error message returned.');
      return Response.json(
        { error: message ? `Email provider error: ${message}` : 'We couldn’t send your enquiry. Please try again or email us directly.' },
        { status: 502 },
      );
    }

    return Response.json({ sent: true });
  } catch (error) {
    console.error('Failed to send contact enquiry through Resend:', error);
    return Response.json({ error: 'We couldn’t send your enquiry. Please try again or email us directly.' }, { status: 502 });
  }
}
